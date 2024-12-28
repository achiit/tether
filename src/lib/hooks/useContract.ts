import { useCallback } from 'react'
import { getContracts } from '../constants/contracts'
import { useAccount } from 'wagmi'
import { publicClient } from '../constants/contracts'
import type { UserStats, ReferralData, RoyaltyInfo } from '@/types/contract'
import type { Address } from 'viem'
import { createWalletClient } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { opBNBTestnet } from '../constants/contracts'
import { http } from 'viem'

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

    const checkRoyaltyQualification = useCallback(async (userAddress: Address) => {
        try {
            const { royalty } = getContracts();
            const qualifiedTiers = await royalty.publicClient.readContract({
                ...royalty,
                functionName: 'checkQualification',
                args: [userAddress],
            }) as boolean[];
            return qualifiedTiers;
        } catch (error) {
            console.error('Error checking qualification:', error);
            return [];
        }
    }, []);

    const registerRoyaltyTiers = useCallback(async (userAddress: Address) => {
        try {
            const { royalty } = getContracts();
            
            let deployerPrivateKey = process.env.NEXT_PUBLIC_CONTRACT_DEPLOYER_PRIVATE_KEY;
            
            if (!deployerPrivateKey) {
                throw new Error('Private key not found');
            }

            // Format private key
            deployerPrivateKey = deployerPrivateKey.replace('0x', '');
            if (deployerPrivateKey.length !== 64) {
                throw new Error(`Invalid private key length: ${deployerPrivateKey.length}`);
            }
            deployerPrivateKey = `0x${deployerPrivateKey}`;

            const deployerAccount = privateKeyToAccount(deployerPrivateKey as `0x${string}`);
            
            const deployerWalletClient = createWalletClient({
                account: deployerAccount,
                chain: opBNBTestnet,
                transport: http()
            });

            // Get nonce immediately before transaction
            const nonce = await publicClient.getTransactionCount({
                address: deployerAccount.address,
                blockTag: 'pending'  // Use pending to get the latest possible nonce
            });

            console.log('Using nonce:', nonce);

            const hash = await deployerWalletClient.writeContract({
                address: royalty.address,
                abi: royalty.abi,
                functionName: 'registerQualifiedTiers',
                args: [userAddress],
                nonce: nonce,
                maxFeePerGas: BigInt(5000000000),
                maxPriorityFeePerGas: BigInt(2500000000)
            });

            // Wait for transaction confirmation before returning
            if (hash) {
                await publicClient.waitForTransactionReceipt({ hash });
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error details:', error);
            return false;
        }
    }, []);

    const getUserRoyaltyInfo = useCallback(async (userAddress: Address) => {
        try {
            const { royalty } = getContracts();
            const info = await royalty.publicClient.readContract({
                ...royalty,
                functionName: 'getUserRoyaltyInfo',
                args: [userAddress],
            }) as RoyaltyInfo;
            return info;
        } catch (error) {
            console.error('Error getting royalty info:', error);
            return null;
        }
    }, []);

    const getTierAchieversCount = useCallback(async (): Promise<number[]> => {
        try {
            const { royalty } = getContracts();
            const count = await royalty.publicClient.readContract({
                ...royalty,
                functionName: 'getTierAchieversCount',
            }) as number[];
            return count;
        } catch (error) {
            console.error('Error getting tier achievers count:', error);
            return [0, 0, 0, 0];
        }
    }, []);

    const distributeTierRoyalties = useCallback(async (tier: number) => {
        try {
            const { royalty } = getContracts();
            const hash = await royalty.walletClient?.writeContract({
                ...royalty,
                functionName: 'distributeTierRoyalties',
                args: [tier],
                account: address as `0x${string}`
            });
            if (hash) {
                await publicClient.waitForTransactionReceipt({ hash });
            }
            return true;
        } catch (error) {
            console.error('Error distributing royalties:', error);
            return false;
        }
    }, [address]);

    return {
        getUserStats,
        getLevelIncomes,
        getRecentIncomeEventsPaginated,
        register,
        upgrade,
        getDirectReferralDataPaginated,
        getDownlineByDepthPaginated,
        checkRoyaltyQualification,
        registerRoyaltyTiers,
        getUserRoyaltyInfo,
        distributeTierRoyalties,
        getTierAchieversCount
    }
}