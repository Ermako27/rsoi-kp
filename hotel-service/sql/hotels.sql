DROP TABLE IF EXISTS hotels CASCADE;
DROP TABLE IF EXISTS rooms CASCADE;


CREATE TABLE hotels
(
    id              SERIAL UNIQUE PRIMARY KEY,
    title           VARCHAR(255) NOT NULL,
    city            VARCHAR(255) NOT NULL,
    hotel_address   VARCHAR(255) NOT NULL,
    rooms_count     INTEGER      NOT NULL
);

CREATE TABLE rooms
(
    id              SERIAL UNIQUE PRIMARY KEY,
    hotel_id        INTEGER NOT NULL REFERENCES hotels (id),
    room_number     INTEGER      NOT NULL,
    room_status     VARCHAR(255) NOT NULL,
    room_cost       INTEGER      NOT NULL
);