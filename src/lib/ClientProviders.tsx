"use client";

import { WagmiConfig } from 'wagmi';
import { RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit';
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { wagmiConfig } from './wallet-config';
import { useState, useEffect } from 'react';

// Create a client
const queryClient = new QueryClient();

export function ClientProviders({ children }: { children: React.ReactNode }) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        // Add this to ensure wallet connection is initialized
        if (typeof window !== 'undefined') {
            window.ethereum?.enable();
        }
    }, []);

    if (!mounted) return null;

    return (
        <WagmiConfig config={wagmiConfig}>
            <QueryClientProvider client={queryClient}>
                <RainbowKitProvider
                    modalSize="compact"
                    theme={darkTheme()}
                >
                    {children}
                </RainbowKitProvider>
            </QueryClientProvider>
        </WagmiConfig>
    );
}
