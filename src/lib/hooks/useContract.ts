import { useCallback } from 'react'
import { getContracts } from '../constants/contracts'
import { useAccount } from 'wagmi'
import { publicClient } from '../constants/contracts'
import type { UserStats, ReferralData } from '@/types/contract'
import type { Address } from 'viem'

export function useContract() {
    const { address } = useAccount()

    const getUserStats = useCallback(async (): Promise<UserStats | null> => {
        if (!address) return null
        try {
            const { tetherWave } = getContracts()
            const stats = await tetherWave.publicClient.readContract({
                ...tetherWave,
                functionName: 'getUserStats',
                args: [address]
            }) as [number, number, bigint, bigint, bigint, number, boolean]

            return {
                currentLevel: Number(stats[0]),
                directReferrals: Number(stats[1]),
                totalEarnings: stats[2],
                directCommissionEarned: stats[3],
                levelIncomeEarned: stats[4],
                timestamp: Number(stats[5]),
                isActive: stats[6]
            }
        } catch (error) {
            console.error('Error fetching user stats:', error)
            return null
        }
    }, [address])

    const getLevelIncomes = useCallback(async (): Promise<bigint[]> => {
        if (!address) return []
        try {
            const { tetherWave } = getContracts()
            const stats = await tetherWave.publicClient.readContract({
                ...tetherWave,
                functionName: 'getUserTeamStats',
                args: [address]
            }) as [number[], bigint[]]

            return stats[1]
        } catch (error) {
            console.error('Error fetching level incomes:', error)
            return []
        }
    }, [address])

    const getRecentIncomeEventsPaginated = useCallback(async (
        userAddress: Address,
        startIndex: bigint,
        limit: bigint
    ) => {
        try {
            const { tetherWave } = getContracts();
            
            // First get total count
            const totalData = await tetherWave.publicClient.readContract({
                ...tetherWave,
                functionName: 'getRecentIncomeEventsPaginated',
                args: [userAddress, BigInt(0), BigInt(1)],
            }) as [Address[], number[], bigint[], number[], number];
            
            const totalCount = Number(totalData[4]);
            const newStartIndex = BigInt(Math.max(totalCount - Number(startIndex) - Number(limit), 0));

            // Get data with reversed index
            const data = await tetherWave.publicClient.readContract({
                ...tetherWave,
                functionName: 'getRecentIncomeEventsPaginated',
                args: [userAddress, newStartIndex, limit],
            }) as [Address[], number[], bigint[], number[], number];

            const [userAddresses, levelNumbers, amounts, timestamps] = data;

            return {
                userAddresses,
                levelNumbers: levelNumbers.map(Number),
                amounts,
                timestamps: timestamps.map(Number),
                totalCount
            };
        } catch (error) {
            console.error('Error fetching recent income events:', error);
            return {
                userAddresses: [],
                levelNumbers: [],
                amounts: [],
                timestamps: [],
                totalCount: 0
            };
        }
    }, []);

    const register = useCallback(async (referrerAddress: string): Promise<void> => {
        if (!address || !referrerAddress) return
        try {
            const { tetherWave, usdt } = getContracts()

            // First approve USDT
            const approveAmount = BigInt(11 * 10 ** 18)
            const approveHash = await usdt.walletClient.writeContract({
                ...usdt,
                functionName: 'approve',
                args: [tetherWave.address, approveAmount],
                account: address as `0x${string}`
            })
            await publicClient.waitForTransactionReceipt({ hash: approveHash })

            // Then register
            const { request } = await tetherWave.publicClient.simulateContract({
                ...tetherWave,
                functionName: 'register',
                args: [referrerAddress],
                account: address as `0x${string}`
            })

            const registerHash = await tetherWave.walletClient.writeContract(request)
            await publicClient.waitForTransactionReceipt({ hash: registerHash })
        } catch (error) {
            console.error('Registration error:', error)
            throw error
        }
    }, [address])

    const upgrade = useCallback(async (targetLevel: number, amount: number): Promise<void> => {
        if (!address) return
        try {
            const { tetherWave, usdt } = getContracts()

            const approveAmount = BigInt(amount * 10 ** 18)
            const approveHash = await usdt.walletClient.writeContract({
                ...usdt,
                functionName: 'approve',
                args: [tetherWave.address, approveAmount],
                account: address as `0x${string}`
            })
            await publicClient.waitForTransactionReceipt({ hash: approveHash })

            const upgradeHash = await tetherWave.walletClient.writeContract({
                ...tetherWave,
                functionName: 'upgrade',
                args: [targetLevel],
                account: address as `0x${string}`
            })
            await publicClient.waitForTransactionReceipt({ hash: upgradeHash })
        } catch (error) {
            console.error('Upgrade error:', error)
            throw error
        }
    }, [address])

    const getDirectReferralDataPaginated = useCallback(async (
        userAddress: Address,
        startIndex: bigint,
        limit: bigint
    ) => {
        try {
            const { tetherWave } = getContracts();
            
            const data = await tetherWave.publicClient.readContract({
                ...tetherWave,
                functionName: 'getDirectReferralDataPaginated',
                args: [userAddress, startIndex, limit],
            }) as [ReferralData[], bigint];
    
            const [referralData, totalCount] = data;
    
            return {
                referralData,
                totalCount: Number(totalCount)
            };
        } catch (error) {
            console.error('Error fetching referral data:', error);
            return {
                referralData: [],
                totalCount: 0
            };
        }
    }, []);

    const getDownlineByDepthPaginated = useCallback(async (
        userAddress: Address,
        depth: number,
        startIndex: bigint,
        limit: bigint
    ) => {
        try {
            const { tetherWave } = getContracts();
            
            const data = await tetherWave.publicClient.readContract({
                ...tetherWave,
                functionName: 'getDownlineByDepthPaginated',
                args: [userAddress, depth, startIndex, limit],
            }) as [Address[], Address[], bigint];
    
            const [downlineAddresses, sponsorAddresses, totalCount] = data;
    
            return {
                downlineAddresses,
                sponsorAddresses,
                totalCount: Number(totalCount)
            };
        } catch (error) {
            console.error('Error fetching downline data:', error);
            return {
                downlineAddresses: [],
                sponsorAddresses: [],
                totalCount: 0
            };
        }
    }, []);

    return {
        getUserStats,
        getLevelIncomes,
        getRecentIncomeEventsPaginated,
        register,
        upgrade,
        getDirectReferralDataPaginated,
        getDownlineByDepthPaginated
    }
}