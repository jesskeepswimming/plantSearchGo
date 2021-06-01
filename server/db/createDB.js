exports.gis = `CREATE EXTENSION postgis`

exports.users = `DROP TABLE IF EXISTS users CASCADE;
CREATE TABLE users(
    email VARCHAR(255) PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE
)`

exports.pins = `DROP TABLE IF EXISTS pins CASCADE;
CREATE TABLE pins(
    pin_id SERIAL PRIMARY KEY,
    string_address VARCHAR(255),
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    geolocation geography(point)
)`        

exports.plants = `DROP TABLE IF EXISTS plants CASCADE;
CREATE TABLE plants(
    plant_id SERIAL PRIMARY KEY,
    date_posted TIMESTAMP default CURRENT_TIMESTAMP NOT NULL,
    plant_name VARCHAR(255) NOT NULL,
    plant_scientific_name VARCHAR(255),
    plant_details VARCHAR(255),
    pin_id INTEGER NOT NULL REFERENCES pins(pin_id),
    user_id VARCHAR(255) NOT NULL REFERENCES users(email),
    image VARCHAR(255) NOT NULL
)`        

exports.TD_plants = `DROP TABLE IF EXISTS plants CASCADE`
exports.TD_pins = `DROP TABLE IF EXISTS pins CASCADE`
exports.TD_users = `DROP TABLE IF EXISTS users CASCADE`        


