import {Pool, PoolConfig} from 'pg';

const connectConfig: PoolConfig = {
    user: 'maksim',
    host: '34.133.58.250',
    database: 'users',
    password: '123',
    port: 5432,
}

export const pool = new Pool(connectConfig);
