import {Pool, PoolConfig} from 'pg';

const connectConfig: PoolConfig = {
    user: 'maksim',
    host: '34.121.219.138',
    database: 'bookings',
    password: '123',
    port: 5432,
}

export const pool = new Pool(connectConfig);
