DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS payments_stats CASCADE;

CREATE TABLE payments
(
    id              SERIAL       PRIMARY KEY,
    payment_status  VARCHAR(255) NOT NULL,
    price           INTEGER      NOT NULL
);

CREATE TABLE payments_stats
(
    id              SERIAL       PRIMARY KEY,
    "user_id"       INTEGER      NOT NULL,
    username        VARCHAR(255)      NOT NULL,
    total_count     INTEGER      NOT NULL,
    unpaid          INTEGER      NOT NULL,
    paid            INTEGER      NOT NULL,
    reversed        INTEGER      NOT NULL,
    canceled        INTEGER      NOT NULL
);