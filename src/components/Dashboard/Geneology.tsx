import { useState, useEffect } from 'react';
import { useWallet } from '@/lib/hooks/useWallet';
import { useContract } from '@/lib/hooks/useContract';

interface TreeNode {
    address: `0x${string}`;
    children: `0x${string}`[];
    isLoading: boolean;
}

const Geneology = () => {
    const { address } = useWallet();
    const { getDownlineByDepthPaginated } = useContract();
    const [currentAddress, setCurrentAddress] = useState<`0x${string}` | null>(null);
    const [downlines, setDownlines] = useState<`0x${string}`[]>([]);
    const [loading, setLoading] = useState(false);
    const [currentDepth, setCurrentDepth] = useState(1);

    // Initial load of root address
    useEffect(() => {
        if (address) {
            setCurrentAddress(address);
            fetchDownlines(address);
        }
    }, [address]);

    const fetchDownlines = async (targetAddress: `0x${string}`) => {
        try {
            setLoading(true);
            const result = await getDownlineByDepthPaginated(targetAddress, 1, BigInt(0), BigInt(3));
            setDownlines(result.downlineAddresses);
        } catch (error) {
            console.error('Error fetching downlines:', error);
            setDownlines([]);
        } finally {
            setLoading(false);
        }
    };

    const handleAddressClick = async (clickedAddress: `0x${string}`) => {
        if (clickedAddress === address) {
            setCurrentDepth(1); // Reset to level 1 when going back to root
        } else {
            setCurrentDepth(prev => prev + 1); // Increment depth when going deeper
        }
        setCurrentAddress(clickedAddress);
        await fetchDownlines(clickedAddress);
    };

    if (!currentAddress) {
        return <div className="text-center">Loading...</div>;
    }

    return (
        <div className="p-4 rounded-lg drop-shadow-lg shadow bg-light-gradient dark:bg-dark-gradient overflow-auto">
            <div className="text-center mb-4">
                <span className="px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900 text-sm font-medium">
                    Depth Level: {currentDepth}
                </span>
            </div>
            <div className="flex flex-col items-center min-w-max p-4">
                {/* Current Address */}
                <div className="mb-8">
                    <button
                        type="button"
                        onClick={() => address && currentAddress !== address && handleAddressClick(address)}
                        className={`p-4 rounded-lg transition-all duration-200 
                            ${currentAddress === address ? 'bg-blue-100 dark:bg-blue-900' : 'bg-white/40 dark:bg-white/5'}
                            backdrop-blur-lg shadow-md hover:shadow-lg`}
                    >
                        <span className="text-sm font-medium">
                            {`${currentAddress.slice(0, 6)}...${currentAddress.slice(-4)}`}
                        </span>
                    </button>
                </div>

                {/* Connecting Line */}
                {downlines.length > 0 && (
                    <div className="w-px h-8 bg-gray-300 dark:bg-gray-700" />
                )}

                {/* Downline Addresses */}
                <div className="flex gap-8">
                    {loading ? (
                        <div className="flex items-center justify-center">
                            <span className="inline-block w-8 h-8 border-2 border-t-transparent border-blue-500 rounded-full animate-spin" />
                        </div>
                    ) : (
                        downlines.map((downlineAddress) => (
                            <button
                                type="button"
                                key={downlineAddress}
                                onClick={() => handleAddressClick(downlineAddress)}
                                className="p-4 rounded-lg transition-all duration-200 bg-white/40 dark:bg-white/5 
                                    backdrop-blur-lg shadow-md hover:shadow-lg hover:bg-blue-50 dark:hover:bg-blue-900/50"
                            >
                                <span className="text-sm font-medium">
                                    {`${downlineAddress.slice(0, 6)}...${downlineAddress.slice(-4)}`}
                                </span>
                            </button>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default Geneology;   