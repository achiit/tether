"use client";

import { createContext, useContext, useState, useCallback } from 'react';
import type { FrontendIdContextType } from '@/types/contract';


const FrontendIdContext = createContext<FrontendIdContextType | null>(null);

export function FrontendIdProvider({ children }: { children: React.ReactNode }) {
    // Cache to store already fetched frontend IDs
    const [frontendIdCache, setFrontendIdCache] = useState<Record<string, string>>({});

    const getFrontendId = useCallback(async (address: string) => {
        // Return from cache if available
        if (frontendIdCache[address]) {
            return frontendIdCache[address];
        }

        try {
            const response = await fetch(`https://node-referral-system.onrender.com/user/${address}`);
            if (!response.ok) {
                throw new Error('Failed to fetch frontend ID');
            }
            const data = await response.json();
            const frontendId = data.frontend_id;

            // Update cache
            setFrontendIdCache(prev => ({
                ...prev,
                [address]: frontendId
            }));

            return frontendId;
        } catch (error) {
            console.error('Error fetching frontend ID:', error);
            return 'ID Not Found';
        }
    }, [frontendIdCache]);

    const clearCache = useCallback(() => {
        setFrontendIdCache({});
    }, []);

    return (
        <FrontendIdContext.Provider value={{ getFrontendId, clearCache }}>
            {children}
        </FrontendIdContext.Provider>
    );
}

export function useFrontendId() {
    const context = useContext(FrontendIdContext);
    if (!context) {
        throw new Error('useFrontendId must be used within a FrontendIdProvider');
    }
    return context;
} 