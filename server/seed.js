const index = require('./index');
const createDB = require('./db/createDB')


async function seed() {
    const pool = index.pool
    const client = await pool.connect();

    // build database tables
    await client.query(createDB.gis)
    await client.query(createDB.users)
    await client.query(createDB.pins)
    await client.query(createDB.plants);

    client.release()
    await pool.end();

}

seed()
