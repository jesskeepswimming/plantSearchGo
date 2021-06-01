require('dotenv').config()
const makeApp = require('./app.js');
const makeDatabase = require('./db/db.js');

const Pool = require("pg").Pool;


const pool = new Pool({
    // user: process.env.DB_USER,
    // password: process.env.DB_PASSWORD,
    // host: process.env.DB_HOST,
    // port: process.env.DB_PORT,
    // database: process.env.DB_PROD
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

const db = new makeDatabase(pool)
const app = makeApp(db)

app.listen(process.env.PORT, ()=> {
    console.log("listening on port", process.env.PORT)
});

exports.pool = pool
exports.module = db;