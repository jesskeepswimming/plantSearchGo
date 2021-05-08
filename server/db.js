const Pool = require("pg").Pool;

const pool = new Pool({
    user: "postgres",
    password: "password2001",
    host: "localhost",
    port: 5432,
    database: "plantDB"
});

module.exports = pool;