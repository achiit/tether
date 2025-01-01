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

export interface RoyaltyInfo {
    achievedTiers: boolean[];
    paidDays: bigint[];
    daysRemaining: bigint[];
    nextClaimTime: bigint[];
    totalEarned: bigint[];
    qualifiedNewTiers: boolean[];
}

export interface Sponsor {
    directSponsor: string[];
    matrixSponsor: string[];
}

export interface LevelActivatedCount {
    strongLeg: bigint;
    weakLeg1: bigint;
    weakLeg2: bigint;
}

export interface UserProfileData {
    frontend_id: string;
    created_at: string;
    wallet_address: string;
    referral_code: string;
}

export interface FrontendIdContextType {
    getFrontendId: (address: string) => Promise<string>;
    clearCache: () => void;
}

export interface LegProgress {
    total: number;
    requiredStrong: number;
    strongLeg: bigint;
    weakLeg1: bigint;
    weakLeg2: bigint;
    requiredLevel: number;
}

export interface FrontendIdDisplayProps {
    address?: string;
    isRegistered?: boolean;
}