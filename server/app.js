
const express = require("express");

const cors = require("cors");
// const db = require("./db");
const validation = require("./validation"); 

function App(db) {
    const app = express();
    app.use(cors());
    app.use(express.json());


    // ROUTES //

    // create a plant profile + upload a post to the profile
    app.post("/plants", async(req, res)=> {

        try { 
            const body =  req.body;

            const [user_id, plant, for_sale, cover_image, variety] = validation.parseNewProfile(body);
            const new_plant_id = await db.newProfile(user_id, plant, for_sale, cover_image, variety)

            const [plant_id, stage, caption, image] = validation.parseNewPost(body, new_plant_id);
            const {post_id, date_posted} = await db.newPost(plant_id, stage, caption, image)

            res.json({plant_id, post_id, date_posted})

        } catch (err) {
            res.status(500).send({error: err.message})
        }
    });


    // upload an post to a plant profile
    app.post("/posts", async(req, res)=> {

        try { 
            const body =  req.body;        

            if (!validation.validateNewPost(body) ) {
                res.status(400).send({error: "body is not valid"})
                return
            }

            const [plant_id, stage, caption, image] = validation.parseNewPost(body, body.plant_id);
            const {post_id, date_posted} = await db.newPost(plant_id, stage, caption, image)

            await db.updateProfile(image, date_posted, plant_id)        

            res.json({post_id, date_posted})

        } catch (err) {
            res.status(500).send({error: err.message})
        }
    });

    // get all plant profiles
    app.get("/plants/search", async(req, res)=> {
        try { 
            const allProfiles = await db.getAllProfiles()
            res.json(allProfiles)

        } catch (err) {
            res.status(500).send({error: err.message})
        }
    })

    // search for all posts for a plant profile
    app.get("/posts/:plant_id", async(req, res)=> {
        try { 
            const plant_id =  Number(req.params.plant_id);

            if (!validation.validateID(plant_id)) {
                res.status(400).send({error: "plant_id is not an integer"})
                return
            }

            const posts = await db.getProfilePosts(plant_id)

            res.json(posts)

        } catch (err) {
            res.status(500).send({error: err.message})
        }
    })

    // Delete a plant profile

    app.delete("/plants/:plant_id", async(req, res) => {
        try {
            const plant_id = Number(req.params.plant_id);

            if (!validation.validateID(plant_id)) {
                res.status(400).send({error: "plant_id is not an integer"})
                return
            }

            await db.deleteProfile(plant_id)

            res.json(`profile ${plant_id} deleted`)

        } catch (err) {
            res.status(500).send({error: err.message})
        }
    })


    return app
} 

module.exports = App;