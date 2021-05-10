const request = require("supertest")
const makeDatabase = require('../db/db.js');
const sample = require('./sample')
const Pool = require("pg").Pool;
const createDB = require('../db/createDB')

describe('tesing endpoints', () => {

    let pool;
    let db;

    beforeAll(async () => {

        pool = new Pool({
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            database: process.env.DB_TEST
        });

        db = new makeDatabase(pool)

        const client = await pool.connect();

        // build + clean database tables
        await client.query(createDB.stage_types)
        await client.query(createDB.plant_profiles)
        await client.query(createDB.plant_posts);

        client.release()

    });

    afterAll(async () => {
        const client = await pool.connect();
        // tear down database tables
        await client.query(createDB.TD_stage_types)
        await client.query(createDB.TD_plant_profiles)
        await client.query(createDB.TD_plant_posts);
        client.release()
        db = null
        await pool.end();
    });

    describe ("test SQL queries", () => {
        test('creating a newProfile', async () => {
            const client = await pool.connect();
            
            expect(db.newProfile).toBeInstanceOf(Function);

            try {
                // add a valid profile
                let [user_id, plant, for_sale, image, variety] = sample.profile
                const plant_id_1 = await db.newProfile(user_id, plant, for_sale, image, variety)
                expect(Number(plant_id_1)).not.toBeNaN()

                // add a faulty profile
                await expect(db.newProfile(null, plant, for_sale, image, variety)).rejects.toThrow()
                
                // check # of profiles
                const results = await client.query('SELECT * FROM plant_profiles')
                expect(results.rows.length).toEqual(1)


            } catch (err) {
                throw err
            } finally {
                client.release();
            }                

        })

        test('creating a newPost', async () => {
            const client = await pool.connect();
            expect(db.newPost).toBeInstanceOf(Function);
            try {
                // add a valid post
                let [plant_id, stage, caption, image] = sample.post
                const {post_id, date_posted} = await db.newPost(plant_id, stage, caption, image)
                expect(Number(post_id)).not.toBeNaN()
                const postDate = new Date(date_posted)
                expect(Date.now()).toBeGreaterThanOrEqual(postDate.getTime());

                // add a faulty post
                await expect(db.newProfile(plant_id, "not plant_stage enum", caption, image)).rejects.toThrow()
                
                // check # of posts
                const results = await client.query('SELECT * FROM plant_posts')
                expect(results.rows.length).toEqual(1)

            } catch (err) {
                throw err
            } finally {
                client.release();
            }                

        })

        test('update a profile', async () => {
            const client = await pool.connect();
            expect(db.updateProfile).toBeInstanceOf(Function);
            try {
                // valid update
                let [image, plant_id] = sample.update
                let currentDate = new Date()
                await db.updateProfile(image, currentDate, plant_id)
                const result = await client.query(`SELECT image, last_updated FROM plant_profiles WHERE plant_id = ${plant_id}`)
                expect(result.rows[0].image).toEqual(image);
                expect(result.rows[0].last_updated).toEqual(currentDate);

                // invalid update
                await expect(db.updateProfile(image, currentDate, "invalid id")).rejects.toThrow()


            } catch (err) {
                throw err
            } finally {
                client.release();
            }                

        })

        test('get all profiles', async () => {
            const client = await pool.connect();
            expect(db.getAllProfiles).toBeInstanceOf(Function);
            try {
                // get all
                const rows = await db.getAllProfiles()
                expect(rows.length).toEqual(1);
            } catch (err) {
                throw err
            } finally {
                client.release();
            }                

        })

        test('get all posts in one profile', async () => {
            const client = await pool.connect();
            expect(db.getProfilePosts).toBeInstanceOf(Function);
            try {
                // fetch for populated plant_id
                const rows = await db.getProfilePosts(1)
                expect(rows.length).toEqual(1);

                // fetch for unpopulated plant_id
                const rowsEmpty = await db.getProfilePosts(143)
                expect(rowsEmpty.length).toEqual(0);


            } catch (err) {
                throw err
            } finally {
                client.release();
            }                

        })

        test('delete profile', async () => {
            const client = await pool.connect();
            expect(db.deleteProfile).toBeInstanceOf(Function);
            try {
                // delete for unpopulated plant_id
                await db.deleteProfile(143)
                const profileResults = await client.query('SELECT * FROM plant_profiles')
                const postResults = await client.query('SELECT * FROM plant_posts')
                expect(profileResults.rows.length).toEqual(1);
                expect(postResults.rows.length).toEqual(1);

                // delete for populated plant_id
                await db.deleteProfile(1)
                const profileResults2 = await client.query('SELECT * FROM plant_profiles')
                const postResults2 = await client.query('SELECT * FROM plant_posts')
                expect(profileResults2.rows.length).toEqual(0);
                expect(postResults2.rows.length).toEqual(0);

            } catch (err) {
                throw err
            } finally {
                client.release();
            }                

        })


    })
    
});