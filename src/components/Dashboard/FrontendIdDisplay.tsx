import { useFrontendDisplay } from '@/lib/hooks/useFrontendDisplay';

export const FrontendIdDisplay = ({ address }: { address: string }) => {
    const displayId = useFrontendDisplay(address);
    return <>{displayId}</>;
}; 