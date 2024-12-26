export interface LevelInfo {
    id: number
    level: number
    name: string
    amount: number
    color: string
}

export interface UserStats {
    currentLevel: number
    directReferrals: number
    totalEarnings: bigint
    directCommissionEarned: bigint
    levelIncomeEarned: bigint
    timestamp: number
    isActive: boolean
}

export interface RecentIncomeEvents {
    userAddresses: `0x${string}`[];
    levelNumbers: number[];
    amounts: bigint[];
    timestamps: number[];
    totalCount: number;
}

export interface ReferralData {
    userAddress: string;
    activationTime: number;
    currentLevel: number;
    directReferrals: number;
}

export interface DownlineData {
    downlineAddresses: `0x${string}`[];
    sponsorAddresses: `0x${string}`[];
    totalCount: number;
}