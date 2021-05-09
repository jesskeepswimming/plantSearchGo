exports.stage_types = `DROP TYPE IF EXISTS plant_stage CASCADE;
    CREATE TYPE plant_stage AS ENUM (
    'Seed', 'Seedling', 'Fruiting','Flowering',  'Mature'
)`


exports.plant_profiles = `DROP TABLE IF EXISTS plant_profiles CASCADE;
CREATE TABLE plant_profiles(
    plant_id SERIAL PRIMARY KEY,
    last_updated TIMESTAMP default CURRENT_TIMESTAMP NOT NULL,
    user_id VARCHAR(255) NOT NULL,
    plant VARCHAR(255) NOT NULL,
    for_sale BOOLEAN, 
    variety VARCHAR(255),
    image VARCHAR(255) NOT NULL
)`

exports.plant_posts = `DROP TABLE IF EXISTS plant_posts CASCADE;
CREATE TABLE plant_posts(
    post_id SERIAL PRIMARY KEY,
    date_posted TIMESTAMP default CURRENT_TIMESTAMP NOT NULL,
    plant_id INTEGER NOT NULL,
    stage plant_stage,
    caption VARCHAR(255),
    image VARCHAR(255) NOT NULL
)`        

exports.TD_stage_types = `DROP TYPE IF EXISTS plant_stage CASCADE`
exports.TD_plant_profiles = `DROP TABLE IF EXISTS plant_profiles CASCADE`
exports.TD_plant_posts = `DROP TABLE IF EXISTS plant_posts CASCADE`        


