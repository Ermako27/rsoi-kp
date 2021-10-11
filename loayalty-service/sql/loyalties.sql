DROP TABLE IF EXISTS loyalties CASCADE;

CREATE TABLE loyalties
(
    id              SERIAL UNIQUE PRIMARY KEY,
    "user_id"        INTEGER      NOT NULL,
    discount        INTEGER      NOT NULL,
    status          VARCHAR(255) NOT NULL
);