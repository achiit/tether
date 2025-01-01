import { useState, useEffect } from 'react';
import { useFrontendId } from '@/contexts/FrontendIdContext';
import type { FrontendIdDisplayProps } from '@/types/contract';

export function FrontendIdDisplay({ address, isRegistered = true }: FrontendIdDisplayProps) {
    const [displayId, setDisplayId] = useState('Loading...');
    const { getFrontendId } = useFrontendId();

    useEffect(() => {
        if (!address) {
            setDisplayId('Not Available');
            return;
        }

        // If not registered, just show truncated address
        if (!isRegistered) {
            const truncated = `${address.slice(0, 6)}...${address.slice(-4)}`;
            setDisplayId(truncated);
            return;
        }

        let isMounted = true;

        const fetchId = async () => {
            try {
                const id = await getFrontendId(address);
                if (isMounted) {
                    setDisplayId(id);
                }
            } catch {
                if (isMounted) {
                    const truncated = `${address.slice(0, 6)}...${address.slice(-4)}`;
                    setDisplayId(truncated);
                }
            }
        };

        fetchId();

        return () => {
            isMounted = false;
        };
    }, [address, getFrontendId, isRegistered]);

    return displayId;
}