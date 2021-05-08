const Pool = require("pg").Pool;

const pool = new Pool({
    user: "postgres",
    password: "password2001",
    host: "localhost",
    port: 5432,
    database: "plantDB"
});

async function newProfile(user_id, plant, for_sale, image, variety){
    const newProfile = await pool.query(
        `INSERT INTO plant_profiles (user_id, plant, for_sale, image, variety) 
        VALUES($1, $2, $3, $4, $5) 
        RETURNING plant_id`, 
        [user_id, plant, for_sale, image, variety]
    )

    const plant_id = newProfile.rows[0].plant_id

    return plant_id
}

async function newPost(plant_id, stage, caption, image){
    const newPost = await pool.query(
        `INSERT INTO plant_posts (plant_id, stage, caption, image) 
        VALUES($1, $2, $3, $4) 
        RETURNING post_id, date_posted`,
        [plant_id, stage, caption, image]
    )

    return newPost.rows[0]
}

async function updateProfile(image, date_posted, plant_id){
    await pool.query(
        `UPDATE plant_profiles 
        SET image = $1, last_updated = $2 
        WHERE plant_id = $3`, 
        [image, date_posted, plant_id]
    )

    return 
}

async function getAllProfiles(){
    const allProfiles = await pool.query(`
        SELECT * FROM plant_profiles 
        ORDER BY last_updated DESC`
    )

    return allProfiles.rows
}

async function searchProfiles(plant){
    const allProfiles = await pool.query(`
        SELECT * FROM plant_profiles 
        WHERE plant = $1`,
        [plant]
    )

    return allProfiles.rows
}

async function getProfilePosts(plant_id){
    const posts = await pool.query(`
        SELECT * FROM plant_posts 
        WHERE plant_id = $1 
        ORDER BY date_posted DESC`, 
        [plant_id]
    )

    return posts.rows
}

async function deleteProfile(plant_id) {
    await pool.query(`
        DELETE FROM plant_profiles 
        WHERE plant_id = $1`,
        [plant_id]
    );

    await pool.query(`
        DELETE FROM plant_posts 
        WHERE plant_id = $1`, 
        [plant_id]
    );

    return
}


exports.pool = pool;
exports.newProfile = newProfile;
exports.newPost = newPost;
exports.updateProfile = updateProfile;
exports.getAllProfiles = getAllProfiles;
exports.searchProfiles = searchProfiles;
exports.getProfilePosts = getProfilePosts;
exports.deleteProfile = deleteProfile;