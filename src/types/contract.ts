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

export interface RecentIncome {
    from: string
    amount: bigint
    levelNumber: number
    timestamp: number
}

export interface ReferralData {
    userAddress: string
    activationTime: number
    currentLevel: number
    directReferrals: number
}
