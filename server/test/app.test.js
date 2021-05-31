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
        await client.query(createDB.users)
        await client.query(createDB.pins)
        await client.query(createDB.plants);

        client.release()

    });

    afterAll(async () => {
        const client = await pool.connect();
        // tear down database tables
        await client.query(createDB.TD_plants)
        await client.query(createDB.TD_pins)
        await client.query(createDB.TD_users);
        client.release()
        db = null
        await pool.end();
    });

    describe ("test SQL queries", () => {
        test('creating a user', async () => {
            const client = await pool.connect();
            
            expect(db.newUser).toBeInstanceOf(Function);

            try {
                // add valid users
                await db.newUser(sample.user1.email, sample.user1.username)
                await db.newUser(sample.user2.email, sample.user2.username)

                // add faulty profiles
                await expect(db.newUser(null, null)).rejects.toThrow()
                await expect(db.newUser("someemail", sample.user1.username)).rejects.toThrow()
                
                // check # of profiles
                const results = await client.query('SELECT * FROM users')
                expect(results.rows.length).toEqual(2)

            } catch (err) {
                throw err
            } finally {
                client.release();
            }                

        })
    })
    
});