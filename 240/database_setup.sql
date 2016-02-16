DROP TABLE IF EXISTS asteroid_type;
DROP TABLE IF EXISTS level;
DROP TABLE IF EXISTS level_object;
DROP TABLE IF EXISTS level_asteroid;
DROP TABLE IF EXISTS main_body;
DROP TABLE IF EXISTS cannon;
DROP TABLE IF EXISTS extra_part;
DROP TABLE IF EXISTS engine;
DROP TABLE IF EXISTS power_core;

CREATE TABLE IF NOT EXISTS object
(
    id integer primary key autoincrement,
    imageFile varchar(255) not null
);

CREATE TABLE IF NOT EXISTS asteroid_type
(
    id integer primary key autoincrement,
    name varchar(255) not null,
    image varchar(255) not null,
    imageWidth integer not null,
    imageHeight integer not null,
    type varchar(255) not null
);

CREATE TABLE IF NOT EXISTS level
(
    id integer primary key autoincrement,
    number integer not null,
    title varchar(255) not null,
    hint varchar(255) not null,
    width integer not null,
    height integer not null,
    music varchar(255) not null
);

CREATE TABLE IF NOT EXISTS level_object
(
    id integer primary key autoincrement,
    position varchar(255) not null,
    objectId integer not null,
    scale real not null
);

CREATE TABLE IF NOT EXISTS level_asteroid
(
    id integer primary key autoincrement,
    number integer not null,
    asteroidId integer not null
);

CREATE TABLE IF NOT EXISTS main_body
(
    cannonAttach varchar(255) not null,
    engineAttach varchar(255) not null,
    extraAttach varchar(255) not null,
    image varchar(255) not null,
    imageWidth integer not null,
    imageHeight integer not null
);

CREATE TABLE IF NOT EXISTS cannon
(
    attachPoint varchar(255) not null,
    emitPoint varchar(255) not null,
    image varchar(255) not null,
    imageWidth integer not null,
    imageHeight integer not null,
    attackImage String not null,
    attackImageWidth integer not null,
    attackImageHeight integer not null,
    attackSound varchar(255) not null,
    damage integer not null
);

CREATE TABLE IF NOT EXISTS extra_part
(
    attachPoint varchar(255) not null,
    image varchar(255) not null,
    imageWidth integer not null,
    imageHeight integer not null,
);

CREATE TABLE IF NOT EXISTS engine
(
    baseSpeed integer not null,
    baseTurnRate integer not null,
    attachPoint varchar(255) not null,
    image varchar(255) not null,
    imageWidth integer not null,
    imageHeight integer not null,
);

CREATE TABLE IF NOT EXISTS power_core
(
    cannonBoost integer not null,
    engineBoost integer not null,
    image varchar(255) not null
);
