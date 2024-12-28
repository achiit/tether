import { useEffect, useState, useCallback } from 'react';
import { useWallet } from '@/lib/hooks/useWallet';
import { useContract } from '@/lib/hooks/useContract';
import type { RoyaltyInfo } from '@/types/contract';
import type { Address } from 'viem';

// Move outside component
const isFullyRegistered = (info: RoyaltyInfo | null): boolean => {
  return !!info?.achievedTiers?.every(tier => tier);
};

// // Move outside component
// const isDistributionTime = () => {
//   const now = new Date();
//   const istTime = new Date(now.getTime() + (5.5 * 60 * 60 * 1000));
//   return istTime.getHours() === 2 && istTime.getMinutes() === 23;
// };

const RoyaltySlab = () => {
  const slabs = [
    { title: 'R1', description: 'Royalty Slab 1' },
    { title: 'R2', description: 'Royalty Slab 2' },
    { title: 'R3', description: 'Royalty Slab 3' },
    { title: 'R4', description: 'Royalty Slab 4' },
  ];

  const { address } = useWallet();
  const { checkRoyaltyQualification, registerRoyaltyTiers, getUserRoyaltyInfo, distributeTierRoyalties, getTierAchieversCount, getNextDistributionTime } = useContract();
  const [qualifiedTiers, setQualifiedTiers] = useState<boolean[]>([]);
  const [royaltyInfo, setRoyaltyInfo] = useState<RoyaltyInfo | null>(null);

  // Function to check qualifications
  const checkQualifications = useCallback(async (userAddress: Address) => {
    const qualified = await checkRoyaltyQualification(userAddress);
    setQualifiedTiers(qualified);
    return qualified;
  }, [checkRoyaltyQualification]);

  // Function to handle registration
  const handleRegistration = useCallback(async (userAddress: Address, qualified: boolean[]) => {
    try {
      const currentInfo = await getUserRoyaltyInfo(userAddress);

      // First check and register R1 if qualified
      if (qualified[0] && !currentInfo?.achievedTiers?.[0]) {
        await registerRoyaltyTiers(userAddress);
        await new Promise(resolve => setTimeout(resolve, 3000));
        const updatedInfo = await getUserRoyaltyInfo(userAddress);
        setRoyaltyInfo(updatedInfo);
      }

      // Then check and register R2 if qualified
      const latestInfo = await getUserRoyaltyInfo(userAddress);
      if (qualified[1] && !latestInfo?.achievedTiers?.[1]) {
        await registerRoyaltyTiers(userAddress);
        await new Promise(resolve => setTimeout(resolve, 3000));
        const updatedInfo = await getUserRoyaltyInfo(userAddress);
        setRoyaltyInfo(updatedInfo);
      }

      // Continue for R3 and R4 if needed
      for (let tier = 2; tier < 4; tier++) {
        const currentTierInfo = await getUserRoyaltyInfo(userAddress);
        if (qualified[tier] && !currentTierInfo?.achievedTiers?.[tier]) {
          await registerRoyaltyTiers(userAddress);
          await new Promise(resolve => setTimeout(resolve, 3000));
          const updatedInfo = await getUserRoyaltyInfo(userAddress);
          setRoyaltyInfo(updatedInfo);
        }
      }
    } catch (error) {
      console.error('Registration error:', error);
    }
  }, [getUserRoyaltyInfo, registerRoyaltyTiers]);

  // Function to handle royalty distribution
  const handleRoyaltyDistribution = useCallback(async () => {
    try {
      console.log('Checking for royalty distribution...');
      const achieversCount = await getTierAchieversCount();
      console.log('Current tier achievers count:', achieversCount);

      const currentTime = Math.floor(Date.now() / 1000);
      for (let tier = 0; tier < 4; tier++) {
        if (achieversCount[tier] > 0) {
          const nextDistTime = await getNextDistributionTime(tier);
          if (currentTime >= Number(nextDistTime)) {
            await distributeTierRoyalties(tier);
          }
        } else break;
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }, [getTierAchieversCount, getNextDistributionTime, distributeTierRoyalties]);

  useEffect(() => {
    const processRoyalties = async () => {
      if (!address) return;

      try {
        // First check if user is already fully registered
        const initialInfo = await getUserRoyaltyInfo(address);
        setRoyaltyInfo(initialInfo);

        if (!isFullyRegistered(initialInfo)) {
          // Check qualifications and register if qualified
          const qualified = await checkQualifications(address);

          if (qualified.some(q => q)) {
            await handleRegistration(address, qualified);
          }
        }
      } catch (error) {
        console.error('Error in royalty processing:', error);
      }
    };

    processRoyalties();

    // Check every minute for new qualifications
    const interval = setInterval(processRoyalties, 60000);
    return () => clearInterval(interval);
  }, [address, checkQualifications, handleRegistration, getUserRoyaltyInfo]);

  // Add distribution check to useEffect
  useEffect(() => {
    console.log('Setting up distribution check interval...');
    
    // Run distribution check immediately and every minute
    const checkDistribution = async () => {
      await handleRoyaltyDistribution();
    };

    checkDistribution();
    const distributionInterval = setInterval(checkDistribution, 60000);
    
    return () => {
      clearInterval(distributionInterval);
    };
  }, [handleRoyaltyDistribution]);

  // Helper function to parse royalty info
  const parseRoyaltyInfo = (info: RoyaltyInfo | null) => {
    if (!info || !Array.isArray(info)) return null;

    return {
      achievedTiers: info[0] || [],
      paidDays: info[1] || [],
      daysRemaining: info[2] || [],
      nextClaimTime: info[3] || [],
      totalEarned: info[4] || BigInt(0),
      qualifiedNewTiers: info[5] || []
    };
  };
  const parsedRoyaltyInfo = parseRoyaltyInfo(royaltyInfo);

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {slabs.map((slab, index) => (
        <div
          key={`${index + 1}`}
          className="overflow-hidden transition-all duration-300 drop-shadow-lg px-4 py-2.5 min-h-32 rounded-md bg-white border border-gray-200"
        >
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-semibold">{slab.title}</h3>
            <div className="flex gap-2">
              {qualifiedTiers[index] && !parsedRoyaltyInfo?.achievedTiers[index] && (
                <span className="bg-green-500 text-white px-2 py-1 rounded text-sm">
                  Qualified
                </span>
              )}
              {parsedRoyaltyInfo?.achievedTiers[index] && (
                <span className="bg-blue-500 text-white px-2 py-1 rounded text-sm">
                  Registered
                </span>
              )}
            </div>
          </div>

          {/* Always show tier status */}
          <div className="text-sm text-gray-600 mb-2">
            Status: {parsedRoyaltyInfo?.achievedTiers[index] ? 'Active' : 'Inactive'}
          </div>

          {/* Show royalty details if available */}
          {parsedRoyaltyInfo?.achievedTiers[index] && (
            <div className="mt-2 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Paid Days:</span>
                <span className="font-medium">
                  {Number(parsedRoyaltyInfo.paidDays[index])}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Days Remaining:</span>
                <span className="font-medium">
                  {Number(parsedRoyaltyInfo.daysRemaining[index])}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Next Claim:</span>
                <span className="font-medium">
                  {parsedRoyaltyInfo.nextClaimTime[index]
                    ? new Date(Number(parsedRoyaltyInfo.nextClaimTime[index]) * 1000).toLocaleDateString()
                    : 'N/A'
                  }
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Claimable:</span>
                <span className="font-medium">
                  {parsedRoyaltyInfo.qualifiedNewTiers[index] ? 'Yes' : 'No'}
                </span>
              </div>
              <div className="bg-white rounded-lg p-4 shadow">
                <h3 className="text-lg font-semibold">Total Earned</h3>
                <p className="text-2xl font-bold">{parsedRoyaltyInfo?.totalEarned?.toString() || '0'} USDT</p>
              </div>
            </div>
          )}

          {/* Show if not registered but qualified */}
          {qualifiedTiers[index] && !parsedRoyaltyInfo?.achievedTiers[index] && (
            <div className="mt-2 text-sm text-gray-600">
              Qualified for registration
            </div>
          )}

          {/* Show if not qualified and not registered */}
          {!qualifiedTiers[index] && !parsedRoyaltyInfo?.achievedTiers[index] && (
            <div className="mt-2 text-sm text-gray-600">
              Not qualified for this tier
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default RoyaltySlab;
