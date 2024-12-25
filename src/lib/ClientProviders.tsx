"use client";

import { WagmiConfig } from 'wagmi';
import { RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit';
import { QueryClientProvider } from "@tanstack/react-query";
import { config, queryClient } from './wallet-config';
import { useState, useEffect } from 'react';

export function ClientProviders({ children }: { children: React.ReactNode }) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        // Check if MetaMask is installed
        if (typeof window !== 'undefined' && window.ethereum) {
            // Request permission to connect
            window.ethereum.request({ method: 'eth_requestAccounts' })
                .then(() => {
                    setMounted(true);
                })
                .catch((err: Error) => {
                    console.error('Failed to connect to wallet:', err);
                    // Still set mounted to true to allow manual connection
                    setMounted(true);
                });
        } else {
            // If no wallet is available, still mount the app
            setMounted(true);
        }

        return () => {
            // Cleanup if needed
        };
    }, []);

    return (
        <WagmiConfig config={config}>
            <QueryClientProvider client={queryClient}>
                <RainbowKitProvider
                    modalSize="compact"
                    theme={darkTheme()}
                >
                    {mounted ? children : null}
                </RainbowKitProvider>
            </QueryClientProvider>
        </WagmiConfig>
    );
}
