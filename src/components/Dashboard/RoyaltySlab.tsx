import { useEffect, useState, useCallback } from 'react';
import { useWallet } from '@/lib/hooks/useWallet';
import { useContract } from '@/lib/hooks/useContract';
import type { LegProgress, RoyaltyInfo } from '@/types/contract';
import type { Address } from 'viem';
import { formatUnits } from 'viem';
import { Ban, BookmarkPlus, CircleCheck, HandCoins, SquareArrowRight } from 'lucide-react';

const isFullyRegistered = (info: RoyaltyInfo | null): boolean => {
  return !!info?.achievedTiers?.every(tier => tier);
};

const RoyaltySlab = () => {
  const slabs = [
    { title: 'FFR1', description: 'Royalty Slab 1', bg: "bg-light-gradient dark:bg-dark-gradient" },
    { title: 'FFR2', description: 'Royalty Slab 2', bg: "bg-light-gradient dark:bg-dark-gradient" },
    { title: 'FFR3', description: 'Royalty Slab 3', bg: "bg-light-gradient dark:bg-dark-gradient" },
    { title: 'FFR4', description: 'Royalty Slab 4', bg: "bg-light-gradient dark:bg-dark-gradient" },
  ];

  const { address } = useWallet();
  const { checkRoyaltyQualification, registerRoyaltyTiers, getUserRoyaltyInfo, distributeTierRoyalties, getTierAchieversCount, getNextDistributionTime, getLevelActivatedCount } = useContract();
  const [qualifiedTiers, setQualifiedTiers] = useState<boolean[]>([]);
  const [royaltyInfo, setRoyaltyInfo] = useState<RoyaltyInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [legProgress, setLegProgress] = useState<{
    tier1: LegProgress;
    tier2: LegProgress;
    tier3: LegProgress;
    tier4: LegProgress;
  }>({
    tier1: { total: 6, requiredStrong: 3, strongLeg: BigInt(0), weakLeg1: BigInt(0), weakLeg2: BigInt(0), requiredLevel: 2 },
    tier2: { total: 8, requiredStrong: 4, strongLeg: BigInt(0), weakLeg1: BigInt(0), weakLeg2: BigInt(0), requiredLevel: 3 },
    tier3: { total: 10, requiredStrong: 5, strongLeg: BigInt(0), weakLeg1: BigInt(0), weakLeg2: BigInt(0), requiredLevel: 4 },
    tier4: { total: 12, requiredStrong: 6, strongLeg: BigInt(0), weakLeg1: BigInt(0), weakLeg2: BigInt(0), requiredLevel: 5 }
  });

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
      return null;
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

  useEffect(() => {
    const fetchLegProgress = async () => {
      if (!address) return;

      try {
        const tier1Data = await getLevelActivatedCount(address, 2); // Apprentice
        const tier2Data = await getLevelActivatedCount(address, 3); // Adventure
        const tier3Data = await getLevelActivatedCount(address, 4); // Challenger
        const tier4Data = await getLevelActivatedCount(address, 5); // Warrior

        setLegProgress({
          tier1: {
            total: 6,
            requiredStrong: 3,
            strongLeg: tier1Data?.strongLeg || BigInt(0),
            weakLeg1: tier1Data?.weakLeg1 || BigInt(0),
            weakLeg2: tier1Data?.weakLeg2 || BigInt(0),
            requiredLevel: 2
          },
          tier2: {
            total: 8,
            requiredStrong: 4,
            strongLeg: tier2Data?.strongLeg || BigInt(0),
            weakLeg1: tier2Data?.weakLeg1 || BigInt(0),
            weakLeg2: tier2Data?.weakLeg2 || BigInt(0),
            requiredLevel: 3
          },
          tier3: {
            total: 10,
            requiredStrong: 5,
            strongLeg: tier3Data?.strongLeg || BigInt(0),
            weakLeg1: tier3Data?.weakLeg1 || BigInt(0),
            weakLeg2: tier3Data?.weakLeg2 || BigInt(0),
            requiredLevel: 4
          },
          tier4: {
            total: 12,
            requiredStrong: 6,
            strongLeg: tier4Data?.strongLeg || BigInt(0),
            weakLeg1: tier4Data?.weakLeg1 || BigInt(0),
            weakLeg2: tier4Data?.weakLeg2 || BigInt(0),
            requiredLevel: 5
          }
        });
      } catch (error) {
        console.error('Error fetching leg progress:', error);
      }
    };

    fetchLegProgress();
  }, [address, getLevelActivatedCount]);

  const tierAmounts = [
    BigInt('5000000000000000000'), 
    BigInt('10000000000000000000'), 
    BigInt('25000000000000000000'),
    BigInt('50000000000000000000')  
  ];

  const parseRoyaltyInfo = (info: RoyaltyInfo | [boolean[], bigint[], bigint[], bigint[], bigint[], boolean[]] | null) => {
    if (!info || !Array.isArray(info)) return null;

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
  const calculateTotalPoolAmount = (tierIndex: number): string => {
    const totalDays = BigInt(500);
    const poolAmount = tierAmounts[tierIndex] * totalDays;
    return formatUnits(poolAmount, 18);
  };

  const calculateStrongLegProgress = (tier: LegProgress): number => {
    const strongLegValue = Number(tier.strongLeg);
    const requiredValue = tier.requiredStrong;
    const percentage = (strongLegValue / requiredValue) * 100;
    return strongLegValue >= requiredValue ? 100 : Math.min(percentage, 100);
  };

  const calculateWeakLegProgress = (tier: LegProgress): number => {
    const weakLegTotal = Number(tier.weakLeg1 + tier.weakLeg2);
    const requiredValue = tier.requiredStrong;
    const percentage = (weakLegTotal / requiredValue) * 100;
    return weakLegTotal >= requiredValue ? 100 : Math.min(percentage, 100);
  };

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
            className={`relative drop-shadow shadow-md px-4 lg:px-8 py-4 min-h-32 rounded-md overflow-hidden transition-all duration-300 ${slab.bg}`}
          >
            <div className="flex justify-between items-center mb-3">
              <div className='flex justify-center items-center gap-2'>
                <h3 className="text-lg font-semibold">{slab.title}</h3>
                <div className={`w-3 h-3 rounded-full animate-pulse ${parsedRoyaltyInfo?.achievedTiers[index] ? "bg-green-400" : "bg-red-500"}`} />
              </div>
              <div className="flex gap-2">
                {qualifiedTiers[index] && !parsedRoyaltyInfo?.achievedTiers[index] && (
                  <span className="bg-gradient-button-green text-white px-2 py-1 rounded text-sm">
                    Qualified
                  </span>
                )}
                {parsedRoyaltyInfo?.achievedTiers[index] && (
                  <span className="bg-gradient-button text-white px-2 py-1 rounded text-sm">
                    Registered
                  </span>
                )}
              </div>
            </div>

            <div className="mt-2 space-y-2">
              <div className="space-y-4">
                {/* Strong Leg Progress */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Strong Leg</span>
                    <span>
                      {index === 0 && `${Number(legProgress.tier1.strongLeg)}/${legProgress.tier1.requiredStrong}`}
                      {index === 1 && `${Number(legProgress.tier2.strongLeg)}/${legProgress.tier2.requiredStrong}`}
                      {index === 2 && `${Number(legProgress.tier3.strongLeg)}/${legProgress.tier3.requiredStrong}`}
                      {index === 3 && `${Number(legProgress.tier4.strongLeg)}/${legProgress.tier4.requiredStrong}`}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-green-600 h-2.5 rounded-full transition-all duration-300"
                      style={{
                        width: `${index === 0 ? calculateStrongLegProgress(legProgress.tier1) :
                          index === 1 ? calculateStrongLegProgress(legProgress.tier2) :
                          index === 2 ? calculateStrongLegProgress(legProgress.tier3) :
                          calculateStrongLegProgress(legProgress.tier4)}%`
                      }}
                    />
                  </div>
                </div>

                {/* Weak Leg Progress */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Weak Leg</span>
                    <span>
                      {index === 0 && `${Number(legProgress.tier1.weakLeg1 + legProgress.tier1.weakLeg2)}/${legProgress.tier1.requiredStrong}`}
                      {index === 1 && `${Number(legProgress.tier2.weakLeg1 + legProgress.tier2.weakLeg2)}/${legProgress.tier2.requiredStrong}`}
                      {index === 2 && `${Number(legProgress.tier3.weakLeg1 + legProgress.tier3.weakLeg2)}/${legProgress.tier3.requiredStrong}`}
                      {index === 3 && `${Number(legProgress.tier4.weakLeg1 + legProgress.tier4.weakLeg2)}/${legProgress.tier4.requiredStrong}`}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-blue h-2.5 rounded-full transition-all duration-300"
                      style={{
                        width: `${index === 0 ? calculateWeakLegProgress(legProgress.tier1) :
                          index === 1 ? calculateWeakLegProgress(legProgress.tier2) :
                          index === 2 ? calculateWeakLegProgress(legProgress.tier3) :
                          calculateWeakLegProgress(legProgress.tier4)}%`
                      }}
                    />
                  </div>
                </div>
              </div>

              {parsedRoyaltyInfo?.achievedTiers[index] ? (
                <>
                  <div className="flex justify-between items-center">
                    <div className='flex justify-start items-center gap-1 text-gray-600 dark:text-gray-400'>
                      <HandCoins className="w-4 h-4" />
                      <span className="text-sm">Paid Days:</span>
                    </div>
                    <span className="font-medium">
                      {Number(parsedRoyaltyInfo.paidDays[index])}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className='flex justify-start items-center gap-1 text-gray-600 dark:text-gray-400'>
                      <BookmarkPlus className="w-4 h-4" />
                      <span className="text-sm">Days Remaining:</span>
                    </div>
                    <span className="font-semibold text-red-500 ">
                      {Number(parsedRoyaltyInfo.daysRemaining[index])}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className='flex justify-start items-center gap-1 text-gray-600 dark:text-gray-400'>
                      <SquareArrowRight className="w-4 h-4" />
                      <span className="text-sm">Next Claim:</span>
                    </div>
                    <span className="font-medium">
                      {parsedRoyaltyInfo.nextClaimTime[index]
                        ? new Date(Number(parsedRoyaltyInfo.nextClaimTime[index]) * 1000).toLocaleDateString()
                        : 'N/A'
                      }
                    </span>
                  </div>
                  <div className="flex justify-between items-center bg-white/40 dark:bg-white/5 backdrop-blur-md rounded-lg p-3 lg:p-4 drop-shadow-lg shadow">
                    <div className="flex flex-col justify-between items-center">
                      <h3 className="text-lg font-semibold">Total Earned</h3>
                      <p className="text-2xl font-bold text-green-600">
                        {parsedRoyaltyInfo?.totalEarned[index] ?
                          `+${formatUnits(parsedRoyaltyInfo.totalEarned[index], 18)} USDT` :
                          '0.00 USDT'
                        }
                      </p>
                    </div>
                    <div className="flex flex-col justify-between items-end">
                      <h3 className="text-lg font-semibold">Total Pool Amount</h3>
                      <p className="text-2xl font-bold text-green-600">
                        {`${calculateTotalPoolAmount(index)} USDT`}
                      </p>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex justify-between items-center">
                    <div className='flex justify-start items-center gap-1 text-gray-600 dark:text-gray-400'>
                      <HandCoins className="w-4 h-4" />
                      <span className="text-sm">Paid Days:</span>
                    </div>
                    <span className="font-medium">0</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className='flex justify-start items-center gap-1 text-gray-600 dark:text-gray-400'>
                      <BookmarkPlus className="w-4 h-4" />
                      <span className="text-sm">Days Remaining:</span>
                    </div>
                    <span className="font-semibold text-red-500">0</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className='flex justify-start items-center gap-1 text-gray-600 dark:text-gray-400'>
                      <SquareArrowRight className="w-4 h-4" />
                      <span className="text-sm">Next Claim:</span>
                    </div>
                    <span className="font-medium">N/A</span>
                  </div>
                  <div className="flex justify-between items-center bg-white/40 dark:bg-white/5 backdrop-blur-md rounded-lg p-3 lg:p-4 drop-shadow-lg shadow">
                    <div className="flex flex-col justify-between items-center">
                      <h3 className="text-lg font-semibold">Total Earned</h3>
                      <p className="text-2xl font-bold text-green-600">0.00 USDT</p>
                    </div>
                    <div className="flex flex-col justify-between items-end">
                      <h3 className="text-lg font-semibold">Total Pool Amount</h3>
                      <p className="text-2xl font-bold text-green-600">{`${calculateTotalPoolAmount(index)} USDT`}</p>
                    </div>
                  </div>
                </>
              )}
            </div>

            {qualifiedTiers[index] && !parsedRoyaltyInfo?.achievedTiers[index] && (
              <div className="flex justify-start items-center gap-1 mt-2 text-sm text-gray-600 dark:text-gray-400">
                <CircleCheck className="h-4 lg:h-5 w-4 lg:w-4" />
                <span>Qualified for registration</span>
              </div>
            )}

            {!qualifiedTiers[index] && !parsedRoyaltyInfo?.achievedTiers[index] && (
              <div className="flex justify-start items-center gap-1 mt-2 text-sm text-gray-600 dark:text-gray-400">
                <Ban className="h-4 lg:h-5 w-4 lg:w-4" />
                <span>Not qualified for this tier</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
};

export default RoyaltySlab;
