import {Pool, PoolConfig} from 'pg';

const connectConfig: PoolConfig = {
    user: 'maksim',
    host: '34.72.184.104',
    database: 'loyalties',
    password: '123',
    port: 5432,
}

export const pool = new Pool(connectConfig);
