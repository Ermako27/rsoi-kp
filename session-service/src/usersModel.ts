import {pool} from './pool';
import * as bcrypt from 'bcrypt';
import {ICreateUserReqBody} from './interfaces/IRequest';
import {IGetUsersResponse, IGetUserResponse, ICreateUserResponse} from './interfaces/IResponse';
import {IUserModel} from './interfaces/IUser';

export class UserModel {
    async createUser(payload: ICreateUserReqBody): Promise<IUserModel> {
        const {email, password, username, role} = payload;
        const hashedPassword = bcrypt.hashSync(password, 10);

        return (
            await pool.query<IUserModel>(
                `INSERT INTO users (role, email, password, username) VALUES ('${role}','${email}','${hashedPassword}','${username}') RETURNING *`,
            )
        ).rows[0];
    }

    async getUsers(): Promise<IGetUsersResponse> {
        const result = (await pool.query('SELECT * FROM users'));
        return {
            users: result.rows,
            count: result.rowCount
        }
    }

    async getUser(id: number): Promise<IGetUserResponse> {
        const result = await pool.query<IUserModel>(`SELECT * FROM users WHERE id=${id}`)
        return {
            user: result.rows[0],
            count: result.rowCount
        }
    }

    async getUserByEmail(email: string): Promise<IGetUserResponse> {
        const result = await pool.query<IUserModel>(`SELECT * FROM users WHERE email='${email}'`);
        return {
            user: result.rows[0],
            count: result.rowCount
        }
    }

    async isPasswordCorrect(email: string, password: string): Promise<boolean> {
        const user = (await pool.query<IUserModel>(`SELECT * FROM users WHERE email='${email}'`)).rows[0];
        const isCorrect = bcrypt.compareSync(password, user.password);
        return isCorrect
    }
}
