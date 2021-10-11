export interface ILoyaltyData {
    user_id: number;
    status: string;
    discount: number;
}

export interface ILoyaltyModel {
    id: number;
    user_id: number;
    status: string;
    discount: number;
}

export enum LoyaltyStatuses {
    WOODEN = 'WOODEN',
    BRONZE = 'BRONZE',
    SILVER = 'SILVER',
    GOLD = 'GOLD'
}