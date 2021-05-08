const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");

app.use(cors());
app.use(express.json());


// ROUTES //

// create a user
app.post("/user", async(req, res)=> {

    try { 
        const body =  req.body;
        const vars = [body.user_id, body.location];
        
        const {user} = await pool.query("INSERT INTO users (user_id, location) VALUES($1, $2) WHERE NOT EXISTS (user_id IN $1)", vars)
        

        res.json(user)

    } catch (err) {
        console.error(err.message);
    }
});


// create a plant profile + upload a post to the profile
app.post("/plants", async(req, res)=> {

    try { 
        const body =  req.body;
        const vars = [body.user_id, body.plant, body.for_sale, body.image, body.nickname];
        const newProfile = await pool.query("INSERT INTO plant_profiles (user_id, plant, for_sale, image, nickname) VALUES($1, $2, $3, $4, $5) RETURNING plant_id ", vars)
        
        const plant_id = newProfile.rows[0].plant_id
        const varsPost = [plant_id, body.stage, body.caption, body.image];
        const newPost =  await pool.query("INSERT INTO plant_posts (plant_id, stage, caption, image) VALUES($1, $2, $3, $4) RETURNING post_id ", varsPost)
        const post_id = newPost.rows[0].post_id

        res.json({"plant_id": plant_id, "post_id": post_id})

    } catch (err) {
        console.error(err.message);
    }
});


// upload an post to a plant profile
app.post("/posts", async(req, res)=> {

    try { 
        const body =  req.body;        
        const varsPost = [body.plant_id, body.stage, body.caption, body.image];

        const newPost = await pool.query("INSERT INTO plant_posts (plant_id, stage, caption, image) VALUES($1, $2, $3, $4) RETURNING post_id, date_posted ", varsPost)

        const returnVal = newPost.rows[0]
        console.log(returnVal.date_posted)

        const varsUpdate = [body.image, returnVal.date_posted , body.plant_id];

        const updateProfile = await pool.query("UPDATE plant_profiles SET image = $1, last_updated = $2 WHERE plant_id = $3", varsUpdate)

        res.json(returnVal)

    } catch (err) {
        console.error(err.message);
    }
});

// get all plant profiles
app.get("/plants", async(req, res)=> {
    try { 
 
        const allPosts  = await pool.query("SELECT * FROM plant_profiles ORDER BY last_updated DESC")
        res.json(allPosts.rows)

    } catch (err) {
        console.error(err.message);
    }
})


// search for a plant profile
app.get("/plants/search/:plant", async(req, res)=> {
    try { 
        const params = req.params;

        const vars = [params.plant];
        const searchResults  = await pool.query("SELECT * FROM plant_profiles WHERE plant = $1", vars)

        res.json(searchResults.rows)

    } catch (err) {
        console.error(err.message);
    }
})

// search for all posts for a plant profile
app.get("/posts/:plant_id", async(req, res)=> {
    try { 
        const params = req.params;
        const vars = [params.plant_id];

        const results  = await pool.query("SELECT * FROM plant_posts WHERE plant_id = $1 ORDER BY date_posted", vars)

        res.json(results.rows)

    } catch (err) {
        console.error(err.message);
    }
})

// Delete a profile

app.delete("/plants/:plant_id", async(req, res) => {
    try {
        const plant_id = req.params.plant_id;
        const deletedProfile = await pool.query("DELETE FROM plant_profiles WHERE plant_id = $1", [plant_id]);
        const deletedPosts = await pool.query("DELETE FROM plant_posts WHERE plant_id = $1", [plant_id]);

        res.json("profile deleted")
    } catch {

    }
})

// trade an image

app.listen(5000, ()=> {
    console.log("listening on 5000")
});