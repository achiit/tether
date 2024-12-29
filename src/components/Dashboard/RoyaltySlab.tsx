import { useEffect, useState, useCallback } from 'react';
import { useWallet } from '@/lib/hooks/useWallet';
import { useContract } from '@/lib/hooks/useContract';
import type { RoyaltyInfo } from '@/types/contract';
import type { Address } from 'viem';
import { formatUnits } from 'viem';

const isFullyRegistered = (info: RoyaltyInfo | null): boolean => {
  return !!info?.achievedTiers?.every(tier => tier);
};

const RoyaltySlab = () => {
  const slabs = [
    { title: 'R1', description: 'Royalty Slab 1', bg:"bg-[radial-gradient(130%_120%_at_50%_50%,_#ffcc8033_0,_#ff006633_100%)]" },
    { title: 'R2', description: 'Royalty Slab 2', bg:"bg-[radial-gradient(130%_120%_at_50%_50%,_#00c1d433_0,_#001f3f33_100%)]" },
    { title: 'R3', description: 'Royalty Slab 3', bg:"bg-[radial-gradient(130%_120%_at_50%_50%,_#a4f8b544_0,_#054a2922_100%)]" },
    { title: 'R4', description: 'Royalty Slab 4', bg:"bg-[radial-gradient(130%_120%_at_50%_50%,_#d084ff44_0,_#20004d44_100%)]" },
  ];

  const { address } = useWallet();
  const { checkRoyaltyQualification, registerRoyaltyTiers, getUserRoyaltyInfo, distributeTierRoyalties, getTierAchieversCount, getNextDistributionTime } = useContract();
  const [qualifiedTiers, setQualifiedTiers] = useState<boolean[]>([]);
  const [royaltyInfo, setRoyaltyInfo] = useState<RoyaltyInfo | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Clear error after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const checkQualifications = useCallback(async (userAddress: Address) => {
    try {
      const qualified = await checkRoyaltyQualification(userAddress);
      setQualifiedTiers(qualified);
      return qualified;
    } catch {
      return [];
    }
  }, [checkRoyaltyQualification]);

  const handleRegistration = useCallback(async (userAddress: Address, qualified: boolean[]) => {
    try {
      const currentInfo = await getUserRoyaltyInfo(userAddress);

      if (qualified[0] && !currentInfo?.achievedTiers?.[0]) {
        await registerRoyaltyTiers(userAddress);
        await new Promise(resolve => setTimeout(resolve, 3000));
        const updatedInfo = await getUserRoyaltyInfo(userAddress);
        setRoyaltyInfo(updatedInfo);
      }

      const latestInfo = await getUserRoyaltyInfo(userAddress);
      if (qualified[1] && !latestInfo?.achievedTiers?.[1]) {
        await registerRoyaltyTiers(userAddress);
        await new Promise(resolve => setTimeout(resolve, 3000));
        const updatedInfo = await getUserRoyaltyInfo(userAddress);
        setRoyaltyInfo(updatedInfo);
      }

      for (let tier = 2; tier < 4; tier++) {
        const currentTierInfo = await getUserRoyaltyInfo(userAddress);
        if (qualified[tier] && !currentTierInfo?.achievedTiers?.[tier]) {
          await registerRoyaltyTiers(userAddress);
          await new Promise(resolve => setTimeout(resolve, 3000));
          const updatedInfo = await getUserRoyaltyInfo(userAddress);
          setRoyaltyInfo(updatedInfo);
        }
      }
    } catch {
      throw new Error('Failed to register tiers') 
    }
  }, [getUserRoyaltyInfo, registerRoyaltyTiers]);

  const handleRoyaltyDistribution = useCallback(async () => {
    try {
      const achieversCount = await getTierAchieversCount();
      const currentTime = Math.floor(Date.now() / 1000);

      for (let tier = 0; tier < 4; tier++) {
        if (achieversCount[tier] > 0) {
          const nextDistTime = await getNextDistributionTime(tier);
          
          if (currentTime >= Number(nextDistTime)) {
            const success = await distributeTierRoyalties(tier);
            
            if (success && address) {
              await new Promise(resolve => setTimeout(resolve, 3000));
              const updatedInfo = await getUserRoyaltyInfo(address);
              if (updatedInfo) setRoyaltyInfo(updatedInfo);
            }
          }
        }
      }
    } catch {
      // Silent fail - only show errors for user-initiated actions
    }
  }, [getTierAchieversCount, getNextDistributionTime, distributeTierRoyalties, getUserRoyaltyInfo, address]);

  useEffect(() => {
    const processRoyalties = async () => {
      if (!address) return;

      try {
        const initialInfo = await getUserRoyaltyInfo(address);
        setRoyaltyInfo(initialInfo);

        if (!isFullyRegistered(initialInfo)) {
          const qualified = await checkQualifications(address);

          if (qualified.some(q => q)) {
            await handleRegistration(address, qualified);
          }
        }
      } catch {
        throw new Error('Failed to process royalties')
      }
    };

    processRoyalties();

    const interval = setInterval(processRoyalties, 60000);
    return () => clearInterval(interval);
  }, [address, checkQualifications, handleRegistration, getUserRoyaltyInfo]);

  useEffect(() => {

    const checkDistribution = async () => {
      await handleRoyaltyDistribution();
    };

    checkDistribution();
    const distributionInterval = setInterval(checkDistribution, 60000);

    return () => {
      clearInterval(distributionInterval);
    };
  }, [handleRoyaltyDistribution]);

  const parseRoyaltyInfo = (info: RoyaltyInfo | [boolean[], bigint[], bigint[], bigint[], bigint[], boolean[]] | null) => {
    if (!info || !Array.isArray(info)) return null;

    const tierAmounts = [
      BigInt('5000000000000000000'),   // $5 USDT for tier 1
      BigInt('10000000000000000000'),  // $10 USDT for tier 2
      BigInt('25000000000000000000'),  // $25 USDT for tier 3
      BigInt('50000000000000000000')   // $50 USDT for tier 4
    ];

    try {
      const calculatedTotalEarned = (info[1] as bigint[]).map((days, index) => 
        (info[0] as boolean[])[index] ? days * tierAmounts[index] : BigInt(0)
      );

      return {
        achievedTiers: info[0] || [],
        paidDays: info[1] || [],
        daysRemaining: info[2] || [],
        nextClaimTime: info[3] || [],
        totalEarned: calculatedTotalEarned,
        qualifiedNewTiers: info[5] || []
      };
    } catch {
      return null;
    }
  };
  const parsedRoyaltyInfo = parseRoyaltyInfo(royaltyInfo);

  return (
    <>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 animate-fade-out">
          {error}
        </div>
      )}
      <div className="grid gap-4 md:grid-cols-2">
        {slabs.map((slab, index) => (
        <div
          key={`${index + 1}`}
          data-aos="fade-up"
          data-aos-duration={1000}
          data-aos-anchor-placement="center-bottom"
          className={`relative drop-shadow shadow-md px-4 lg:px-8 py-4 min-h-32 rounded-md overflow-hidden transition-all duration-300 ${slab.bg}`}
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
            <div className="text-sm text-gray-600 mb-2">
              Status: {parsedRoyaltyInfo?.achievedTiers[index] ? 'Active' : 'Inactive'}
            </div>

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
                <div className="bg-white rounded-lg p-4 shadow">
                  <h3 className="text-lg font-semibold">Total Earned</h3>
                  <p className="text-2xl font-bold">
                    {parsedRoyaltyInfo?.totalEarned[index] ?
                      `${formatUnits(parsedRoyaltyInfo.totalEarned[index], 18)} USDT` :
                      '0.00 USDT'
                    }
                  </p>
                </div>
                <div className="flex justify-between items-center bg-white/50 backdrop-blur rounded-lg p-3 lg:p-4 drop-shadow-lg shadow-inner">
                <h3 className="lg:text-xl font-bold">Total Earned</h3>
                <p className="text-lg lg:text-2xl font-bold">{parsedRoyaltyInfo?.totalEarned?.toString() || '0'} USDT</p>
              </div>
              </div>
            )}

            {qualifiedTiers[index] && !parsedRoyaltyInfo?.achievedTiers[index] && (
              <div className="mt-2 text-sm text-gray-600">
                Qualified for registration
              </div>
            )}

            {!qualifiedTiers[index] && !parsedRoyaltyInfo?.achievedTiers[index] && (
              <div className="mt-2 text-sm text-gray-600">
                Not qualified for this tier
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
};

export default RoyaltySlab;
