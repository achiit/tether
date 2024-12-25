"use client";

import '@rainbow-me/rainbowkit/styles.css';
import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { mainnet, polygon, bsc, arbitrum, optimism, opBNB, opBNBTestnet } from 'wagmi/chains';
import { http } from 'wagmi';
import {
    rainbowWallet,
    metaMaskWallet,
    trustWallet,
    coinbaseWallet,
    walletConnectWallet,
} from '@rainbow-me/rainbowkit/wallets';
import { QueryClient } from "@tanstack/react-query";

export const config = getDefaultConfig({
    appName: 'tetherwave',
    projectId: '85ea157b5dd90e1472df0fbb28950fef',
    chains: [mainnet, polygon, bsc, arbitrum, optimism, opBNB, opBNBTestnet] as const,
    ssr: true,

    wallets: [
        {
            groupName: 'Recommended',
            wallets: [
                rainbowWallet,
                metaMaskWallet,
                coinbaseWallet,
                trustWallet,
                walletConnectWallet,
            ],
        },
    ],
    transports: {
        [mainnet.id]: http('https://mainnet.base.org'),
        [polygon.id]: http('https://polygon-rpc.com'),
        [bsc.id]: http('https://bsc-dataseed.binance.org'),
        [arbitrum.id]: http('https://arbitrum.publicnode.com'),
        [optimism.id]: http('https://optimism.publicnode.com'),
        [opBNB.id]: http('https://opbnb-testnet-rpc.bnbchain.org'),
    },
});

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            retry: false,
        },
    },
});
export const { chains: configuredChains } = config; 