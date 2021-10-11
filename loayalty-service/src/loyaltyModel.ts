import {ILoyaltyModel, ILoyaltyData, LoyaltyStatuses} from './interfaces/ILoyalty';
import {pool} from './pool';

export class LoyaltyModel {
    async updateLoyalty(payload: ILoyaltyData): Promise<ILoyaltyModel> {
        const {user_id, status, discount} = payload;

        const loyalty = (await pool.query<ILoyaltyModel>(
            `UPDATE loyalties SET status='${status}', discount=${discount} WHERE "user_id"=${user_id} RETURNING *`,
        )).rows[0];
        return loyalty
    }

    async createLoyalty(userId: number): Promise<ILoyaltyModel> {
        const loyalty = (await pool.query<ILoyaltyModel>(
            `INSERT INTO loyalties ("user_id", status, discount) VALUES (${userId},'${LoyaltyStatuses.WOODEN}',0) RETURNING *`,
        )).rows[0]
        return loyalty
    }

    async getLoyalty(userId: number): Promise<{loyalty: ILoyaltyModel | undefined}> {
        const loyaltyData = (await pool.query<ILoyaltyModel>(`SELECT * FROM loyalties WHERE "user_id"=${userId}`));
        if (loyaltyData.rowCount === 0) {
            return {
                loyalty: undefined
            } 
        }
        return {
            loyalty: loyaltyData.rows[0]
        };
    }
}



