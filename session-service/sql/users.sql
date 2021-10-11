DROP TABLE IF EXISTS users CASCADE;

CREATE TABLE users
(
    id              SERIAL PRIMARY KEY,
    role            VARCHAR(255) NOT NULL,
    email           VARCHAR(255) NOT NULL UNIQUE,
    password        VARCHAR(255) NOT NULL,
    username        VARCHAR(255) NOT NULL
);