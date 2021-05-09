const makeApp = require('./app.js');
const makeDatabase = require('./db.js');

const Pool = require("pg").Pool;

const pool = new Pool({
    user: "postgres",
    password: "password2001",
    host: "localhost",
    port: 5432,
    database: "plantDB"
});

const db = new makeDatabase(pool)
const app = makeApp(db)

app.listen(5000, ()=> {
    console.log("listening on 5000")
});

exports.module = db;