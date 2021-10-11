import {Pool, PoolConfig} from 'pg';

const connectConfig: PoolConfig = {
    user: 'maksim',
    host: '34.122.216.244',
    database: 'payments',
    password: '123',
    port: 5432,
}

export const pool = new Pool(connectConfig);
