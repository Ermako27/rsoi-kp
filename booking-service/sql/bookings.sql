DROP TABLE IF EXISTS bookings CASCADE;

CREATE TABLE bookings
(
    id              SERIAL  NOT NULL,
    hotel_id        INTEGER NOT NULL,
    room_id         INTEGER NOT NULL,
    "user_id"       INTEGER NOT NULL,
    payment_id      INTEGER NOT NULL,
    created         TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);