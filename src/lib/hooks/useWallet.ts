import { useAccount, useBalance, useChainId } from 'wagmi'
import { useCallback, useEffect, useState } from 'react'
import { formatUnits } from 'viem'
import { siteConfig } from '@/config/site'
import { useContract } from './useContract'

export function useWallet() {
    const { address, isConnected } = useAccount()
    const chainId = useChainId()
    const [isRegistered, setIsRegistered] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const { getUserStats } = useContract()

    const { data: usdtBalance } = useBalance({
        address,
        token: siteConfig.contracts.USDT as `0x${string}`,
    })

    const { data: nativeBalance } = useBalance({
        address,
    })

    const checkRegistrationStatus = useCallback(async () => {
        if (!address) {
            setIsRegistered(false)
            setIsLoading(false)
            return
        }

        try {
            const stats = await getUserStats()
            setIsRegistered((stats?.currentLevel ?? 0) > 0)
        } catch (error) {
            console.error('Error checking registration:', error)
            setIsRegistered(false)
        } finally {
            setIsLoading(false)
        }
    }, [address, getUserStats])

    const formattedBalances = {
        usdt: usdtBalance ? formatUnits(usdtBalance.value, usdtBalance.decimals) : '0',
        native: nativeBalance ? formatUnits(nativeBalance.value, nativeBalance.decimals) : '0',
    }

    useEffect(() => {
        checkRegistrationStatus()
    }, [checkRegistrationStatus])

    return {
        address,
        isConnected,
        isRegistered,
        isLoading,
        chainId,
        balances: formattedBalances,
        checkRegistrationStatus,
    }
}
