import {Pool, PoolConfig} from 'pg';

const connectConfig: PoolConfig = {
    user: 'maksim',
    host: '34.132.19.132',
    database: 'hotels',
    password: '123',
    port: 5432,
}

export const pool = new Pool(connectConfig);
