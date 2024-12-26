import { useCallback } from 'react'
import { getContracts } from '../constants/contracts'
import { useAccount } from 'wagmi'
import { publicClient } from '../constants/contracts'
import type { UserStats, RecentIncome, ReferralData } from '@/types/contract'

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

    const getRecentIncomes = useCallback(async (): Promise<RecentIncome[]> => {
        if (!address) return []
        try {
            const { tetherWave } = getContracts()
            const events = await tetherWave.publicClient.readContract({
                ...tetherWave,
                functionName: 'getRecentIncomeEvents',
                args: [address]
            }) as [string[], number[], bigint[], number[], number]

            const [userAddresses, levelNumbers, amounts, timestamps] = events

            return userAddresses.map((from, index) => ({
                from,
                amount: amounts[index],
                levelNumber: levelNumbers[index],
                timestamp: timestamps[index]
            }))
        } catch (error) {
            console.error('Error fetching recent incomes:', error)
            return []
        }
    }, [address])

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

    const getReferralData = useCallback(async (): Promise<ReferralData[]> => {
        if (!address) return [];
        try {
            const { tetherWave } = getContracts();
            const data = await tetherWave.publicClient.readContract({
                ...tetherWave,
                functionName: 'getDirectReferralData',
                args: [address]
            }) as ReferralData[];

            return data;
        } catch (error) {
            console.error('Error fetching referral data:', error);
            return [];
        }
    }, [address]);

    return {
        getUserStats,
        getLevelIncomes,
        getRecentIncomes,
        register,
        upgrade,
        getReferralData
    }
}
