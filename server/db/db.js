
class DB{

    constructor(pool) {
        this.pool = pool;
    }

    async newUser(email, username){
        const results = await this.pool.query(`
            SELECT * FROM users 
            WHERE email = $1`,
            [email]
        );

        if (results.rows.length > 0) {
            // account already exists
            return true;
        } else {
            await this.pool.query(
                `INSERT INTO users (email, username) 
                VALUES($1, $2)`, 
                [email, username]
            )

            return false
        }

    }

    async checkUsername(username){
        const emails = await this.pool.query(`
            SELECT email FROM users 
            WHERE username = $1`,
            [username]
        );

        return emails.rows
    }

    async getUsername(email){
        const username = await this.pool.query(`
            SELECT username FROM users 
            WHERE email = $1`,
            [email]
        );

        return username.rows[0]
    }

    async newPin(address, latitude, longitude){
        const newPin = await this.pool.query(
            `INSERT INTO pins (string_address, latitude, longitude) 
            VALUES($1, $2, $3) 
            RETURNING pin_id`,
            [address, latitude, longitude]
        )

        const pin_id = newPin.rows[0].pin_id
        console.log(pin_id)

        await this.pool.query(
            `UPDATE pins 
            SET geolocation = ST_MakePoint($1, $2)
            WHERE pin_id = $3`,
            [longitude, latitude, pin_id]
        )

        return pin_id
    }

    async newPlant(plant_name, common_name, notes, user, image, pin_id){
        const newPlant = await this.pool.query(
            `INSERT INTO plants (plant_name, plant_scientific_name, plant_details, user_id, image, pin_id) 
            VALUES($1, $2, $3, $4, $5, $6) 
            RETURNING plant_id, date_posted`,
            [common_name, plant_name, notes, user, image, pin_id]
        )

        return newPlant.rows[0]
    }


    async getPinsByRadius(longitude, latitude, radius){

        const pins = await this.pool.query(`
            SELECT * FROM pins 
            WHERE ST_DWithin(geolocation, ST_MakePoint($1, $2), $3)`, 
            [longitude, latitude, radius]
        )

        return pins.rows
    }

    async getPlantsForPin(pin_id){
        const plants = await this.pool.query(`
            SELECT * FROM plants 
            WHERE pin_id = $1 
            ORDER BY date_posted DESC`, 
            [pin_id]
        )

        return plants.rows
    }

    async getPlantsForUser(user) {
        
        const plants = await this.pool.query(`
            SELECT * FROM plants 
            WHERE user_id = $1 
            ORDER BY date_posted DESC`, 
            [user]
        )

        return plants.rows
    
    }

    async deletePlant(plant_id) {
        const pins = await this.pool.query(`
            SELECT pin_id FROM plants 
            WHERE plant_id = $1`,
            [plant_id]
        );
        console.log(pins.rows[0].pin_id)


        const pin_id = pins.rows[0].pin_id
        await this.pool.query(`
            DELETE FROM plants 
            WHERE plant_id = $1`,
            [plant_id]
        );

        const plants = await this.getPlantsForPin(pin_id)
        console.log(plants)
        if (plants.length == 0) {
            await this.pool.query(`
                DELETE FROM pins 
                WHERE pin_id = $1`, 
                [pin_id]
            );
        }

        return true
        
    }

}

module.exports = DB;