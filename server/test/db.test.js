const Pool = require("pg").Pool;


describe('testing postgres', () => {

    let pgPool;

    beforeAll(() => {
        pgPool = new Pool({
            connectionString: process.env.TEST_DATABASE_URL
        });
    });

    afterAll(async () => {
        await pgPool.end();
    });

    it('should test', async () => {
        const client = await pgPool.connect();
        try {
            await client.query('BEGIN');

            const { rows } = await client.query('SELECT 1 AS "result"');
            expect(rows[0]["result"]).toBe(1);

            await client.query('ROLLBACK');
        } catch(err) {
          throw err;
        } finally {
            client.release();
        }

    })

});