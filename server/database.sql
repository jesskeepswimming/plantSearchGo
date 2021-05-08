CREATE DATABASE plantDB;

CREATE TYPE plant_stage AS ENUM ('Seed', 'Seedling', 'Fruiting','Flowering',  'Mature');


CREATE TABLE plant_profiles(
    plant_id SERIAL PRIMARY KEY,
    last_updated TIMESTAMP default CURRENT_TIMESTAMP NOT NULL,
    user_id VARCHAR(255) NOT NULL,
    plant VARCHAR(255) NOT NULL,
    for_sale BOOLEAN, 
    variety VARCHAR(255),
    image VARCHAR(255) NOT NULL
);

CREATE TABLE plant_posts(
    post_id SERIAL PRIMARY KEY,
    date_posted TIMESTAMP default CURRENT_TIMESTAMP NOT NULL,
    plant_id INTEGER NOT NULL,
    stage plant_stage,
    caption VARCHAR(255),
    image VARCHAR(255) NOT NULL
);