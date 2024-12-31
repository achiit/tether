import { useState, useEffect } from 'react';
import { useFrontendId } from '@/contexts/FrontendIdContext';

export function useFrontendDisplay(address: string | undefined) {
    const [displayId, setDisplayId] = useState<string>('Loading...');
    const { getFrontendId } = useFrontendId();

    useEffect(() => {
        if (!address) {
            setDisplayId('Not Available');
            return;
        }

        let isMounted = true;

        const fetchId = async () => {
            const id = await getFrontendId(address);
            if (isMounted) {
                setDisplayId(id);
            }
        };

        fetchId();

        return () => {
            isMounted = false;
        };
    }, [address, getFrontendId]);

    return displayId;
}