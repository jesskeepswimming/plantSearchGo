CREATE DATABASE plantDB;

CREATE TYPE plant_stage AS ENUM ('Seed', 'Seedling', 'Fruiting','Flowering',  'Mature');

CREATE TABLE users(
    user_id VARCHAR(255),
    location VARCHAR(255),
);

CREATE TABLE plant_profiles(
    plant_id SERIAL PRIMARY KEY,
    user_id VARCHAR(255),
    plant VARCHAR(255),
    for_sale BOOLEAN,
    nickname VARCHAR(255),
    image VARCHAR(255)
);

CREATE TABLE plant_posts(
    post_id SERIAL PRIMARY KEY,
    date_posted TIMESTAMP default CURRENT_TIMESTAMP,
    plant_id INTEGER,
    stage plant_stage,
    caption VARCHAR(255),
    image VARCHAR(255)
);