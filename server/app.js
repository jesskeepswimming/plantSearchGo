
const express = require("express");
const request = require('request');
const imageToBase64 = require('image-to-base64');

const cors = require("cors");
const parser = require("./parser"); 

const apiKey = process.env.PLANT_API_KEY;
const plantURL = 'https://api.plant.id/v2/identify';

function validateID(id) {
    return Number.isInteger(id) && id >=0
}

function App(db) {
    const app = express();
    app.use(cors());
    app.use(express.json());


    // ROUTES //

    // create new user profile - good - tested
    app.post("/users/new", async(req, res)=> {

        try { 
            const body =  req.body;
            // add validation

            const [email, username] = parser.parseNewUser(body);

            // check if username is already taken
            const emails = await db.checkUsername(username)

            if (emails.length > 0) {
                res.status(400).send({error: "Username is already taken."})
                return
            }

            const exists = await db.newUser(email, username)

            if (exists) {
                res.json("Profile already exists.")
            } else {
                res.json("Profile successfully created.")
            }

        } catch (err) {
            res.status(500).send({error: err.message})
        }
    });

    // get a username from an email
    app.get("/users/:email/username", async(req, res)=> {
        try { 
            const email =  req.params.email;
            const username = await db.getUsername(email)

            res.json(username)

        } catch (err) {
            res.status(500).send({error: err.message})
        }
    }) 

    // get all of a users plants - good
    app.get("/users/:user/plants", async(req, res)=> {
        try { 
            const user =  req.params.user;
            const plants = await db.getPlantsForUser(user)

            res.json(plants)

        } catch (err) {
            res.status(500).send({error: err.message})
        }
    }) 

    // upload a plant to a given location pin - good
    app.post("/plants/upload", async(req, res)=> {

        try { 
            const body =  req.body;        

            // add validation

            const [plant_name, common_name, plant_details, user, image, pin_id] = parser.parseNewPlant(body);
            const notes = plant_details.notes

            const {plant_id, date_posted} = await db.newPlant(plant_name, common_name, notes, user, image, pin_id)

            res.json({plant_id, date_posted})

        } catch (err) {
            res.status(500).send({error: err.message})
        }
    });

    
     // delete a plant - good
     app.delete("/plants/:plant_id", async(req, res) => {
        try {
            const plant_id = Number(req.params.plant_id);

            if (!validateID(plant_id)) {
                res.status(400).send({error: "plant_id is not an integer"})
                return
            }

            await db.deletePlant(plant_id)

            res.json(`plant ${plant_id} deleted`)

        } catch (err) {
            res.status(500).send({error: err.message})
        }
    })

    

    // identify plant picture - good - tested
    app.post("/plants/identify", async (req, res)=> {

        try { 
            const body =  req.body;        
            const [imageUrl,latitude, longitude] = parser.parseImageRequest(body);
    
            imageToBase64(imageUrl)
            .then(
                async(response) => {
                    var formData = {
                        "images": [response],
                        "latitude": latitude,
                        "longitude": longitude,
                        "plant_details": ["common_names", "wiki_description", "wiki_images"]
                    };
        
                    await request.post({
                        uri: plantURL,
                        json: formData
                    }, function (err, response, body) {
                        if (!err && response.statusCode == 200) {            
                            res.json(body.suggestions[0])
                        }  else {
                            res.status(400).send({error: err})
                        }
                    }).auth('client', apiKey);
                    
                }
            ).catch(
                (err)=> {
                    res.status(400).send({error: err})
                }
            );

        } catch (err) {
            res.status(500).send({error: err.message})
        }
    });


    // create a new location pin and upload a plant to it - good
    app.post("/pins/upload", async(req, res)=> {

        try { 
            const body =  req.body;
            // add validation
            const [plant_name, common_name, plant_details, user, image, latitude, longitude] = parser.parseNewPlantPin(body);
            const address = "";
            const pin_id = await db.newPin(address, latitude, longitude)

            const notes = plant_details.notes
            // const wiki_description = plant_details.wiki_description.value
  
            const {plant_id, date_posted} = await db.newPlant(plant_name, common_name, notes, user, image, pin_id)

            res.json({plant_id, date_posted})

        } catch (err) {
            res.status(500).send({error: err.message})
        }
    });



    // get all pins within given radius- good
    app.get("/pins/:pin_id/vicinity/:radius", async(req, res)=> {
        try { 
            const pin_id =  Number(req.params.pin_id);
            const radius =  Number(req.params.radius);
            //const radius = 4000; // m
            const pins = await db.getPinsByRadius(pin_id, radius)
            res.json(pins)

        } catch (err) {
            res.status(500).send({error: err.message})
        }
    })

    // get all plants at a location pin - good
    app.get("/pins/:pin_id/plants", async(req, res)=> {
        try { 
            const pin_id =  Number(req.params.pin_id);

            if (!validateID(pin_id)) {
                res.status(400).send({error: "pin_id is not an integer"})
                return
            }

            const plants = await db.getPlantsForPin(pin_id)

            res.json(plants)

        } catch (err) {
            res.status(500).send({error: err.message})
        }
    })

   

    return app
} 

module.exports = App;