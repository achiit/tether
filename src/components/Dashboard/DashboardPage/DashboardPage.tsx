"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import { useWallet } from "@/lib/hooks/useWallet";
import { useContract } from "@/lib/hooks/useContract";
import SocialLinks from "../SocialLinks";
import RoyaltySlab from "../RoyaltySlab";
import type {
  UserStats,
  RecentIncomeEvents,
  Sponsor,
  UserProfileData,
} from "@/types/contract";
import { useFrontendDisplay } from "@/lib/hooks/useFrontendDisplay";
import ProfileDetails from "./ProfileDetails";
import WalletDetails from "./WalletDetails";
import Registration from "./Registration";
import Packages from "./Packages";
import AllIncomes from "./AllIncomes";
import RankIncome from "./RankIncome";
import RecentIncome from "./RecentIncome";
import toast from 'react-hot-toast';

const DashboardPage = () => {
  const { address, balances, refetchUsdtBalance } = useWallet();
  const {
    getUserStats,
    getLevelIncomes,
    getRecentIncomeEventsPaginated,
    register,
    upgrade,
    getSponsors,
    getUpgradeReferralIncome,
    getTeamSizes,
  } = useContract();

  const [referrerAddress, setReferrerAddress] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [referralCode, setReferralCode] = useState<string>("");
  const [directSponsor, setDirectSponsor] = useState<Sponsor | null>(null);
  const [matrixSponsor, setMatrixSponsor] = useState<Sponsor | null>(null);
  const itemsPerPage = 5;
  const [recentIncomes, setRecentIncomes] = useState<RecentIncomeEvents>({
    userAddresses: [],
    levelNumbers: [],
    amounts: [],
    timestamps: [],
    totalCount: 0,
  });
  const [userProfileData, setUserProfileData] =
    useState<UserProfileData | null>(null);
  const [usdtBalance, setUsdtBalance] = useState("0.0000");

  const contractFunctions = useMemo(() => ({
    getUserStats,
    getLevelIncomes,
    getRecentIncomeEventsPaginated,
    register,
    upgrade,
    getSponsors,
    getUpgradeReferralIncome,
    getTeamSizes,
  }), [
    getUserStats,
    getLevelIncomes,
    getRecentIncomeEventsPaginated,
    register,
    upgrade,
    getSponsors,
    getUpgradeReferralIncome,
    getTeamSizes
  ]);

  const [dashboardState, setDashboardState] = useState({
    isRegistered: false,
    currentLevel: 0,
    userStats: null as UserStats | null,
    levelIncomes: [] as bigint[],
    referralCode: "",
    directSponsor: null as Sponsor | null,
    matrixSponsor: null as Sponsor | null,
    upgradeReferralIncome: undefined as bigint | null | undefined,
    totalTeamSize: undefined as number | undefined,
    userProfileData: null as UserProfileData | null,
  });

  const fetchDashboardData = useCallback(async () => {
    if (!address) return;

    try {
      const [stats, sponsors] = await Promise.all([
        contractFunctions.getUserStats(),
        contractFunctions.getSponsors()
      ]);

      if (!stats) return;

      const updates: Partial<typeof dashboardState> = {
        currentLevel: stats.currentLevel,
        userStats: stats,
        isRegistered: stats.currentLevel > 0,
        directSponsor: sponsors ? {
          directSponsor: sponsors.directSponsor,
          matrixSponsor: sponsors.matrixSponsor,
        } : null,
        matrixSponsor: sponsors ? {
          directSponsor: sponsors.directSponsor,
          matrixSponsor: sponsors.matrixSponsor,
        } : null,
      };

      if (stats.currentLevel > 0) {
        const [incomes, upgradeRefIncome, teamSize, recentInc] = await Promise.all([
          contractFunctions.getLevelIncomes(),
          contractFunctions.getUpgradeReferralIncome(address),
          contractFunctions.getTeamSizes(address),
          contractFunctions.getRecentIncomeEventsPaginated(
            address,
            BigInt((currentPage - 1) * itemsPerPage),
            BigInt(itemsPerPage)
          )
        ]);

        Object.assign(updates, {
          levelIncomes: incomes,
          upgradeReferralIncome: upgradeRefIncome || undefined,
          totalTeamSize: teamSize && teamSize.length > 0 ? teamSize[0] : 0,
        });
        setRecentIncomes(recentInc);
      }

      setDashboardState(prev => ({ ...prev, ...updates }));
    } catch (error) {
      console.error('Dashboard data fetch error:', error);
    }
  }, [address, contractFunctions, currentPage]);

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, [fetchDashboardData]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const refId = params.get("ref");

    if (refId) {
      localStorage.setItem("tetherwave_refId", refId);
      console.log("RefID stored in localStorage:", refId);
    } else {
      console.log("No refId found in URL");
    }
  }, []);

  useEffect(() => {
    const fetchReferrerAddress = async () => {
      try {
        const storedRefId = localStorage.getItem("tetherwave_refId");
        console.log("Checking stored refId:", storedRefId);
        console.log("Current wallet address:", address);

        if (!storedRefId || !address) {
          console.log("Missing required data:", {
            hasStoredRefId: !!storedRefId,
            hasAddress: !!address,
          });
          return;
        }

        console.log("Fetching referrer data for refId:", storedRefId);
        const response = await fetch(
          `https://node-referral-system.onrender.com/referral/${storedRefId}`
        );

        console.log("API Response status:", response.status);
        if (!response.ok) {
          throw new Error(`API responded with status: ${response.status}`);
        }

        const data = await response.json();
        console.log("API Response data:", data);

        setReferrerAddress(data.referring_wallet);
        console.log("Referrer address set:", data.frontend_id);
        console.log("Referrer address set:", data.referring_wallet);
      } catch (error) {
        console.error("Error in fetchReferrerAddress:", error);
      }
    };

    fetchReferrerAddress();
  }, [address]);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!address) return;

      try {
        const response = await fetch(
          `https://node-referral-system.onrender.com/user/${address}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch user profile");
        }
        const data = await response.json();
        setUserProfileData(data);
        setReferralCode(data.referral_code);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserProfile();
  }, [address]);

  useEffect(() => {
    const updateBalance = async () => {
      if (balances.usdt) {
        setUsdtBalance(balances.usdt);
      }
    };

    updateBalance();
  }, [balances.usdt]);

  const handleRegister = async () => {
    if (!address || !referrerAddress) {
        toast.error("Missing address or referrer address");
        return;
    }

    const registerPromise = (async () => {
        try {
            // First do the blockchain registration
            await register(referrerAddress, usdtBalance);
            
            // Wait for blockchain state to update
            await new Promise(resolve => setTimeout(resolve, 3000));

            // Try to get the backend response
            const response = await fetch("https://node-referral-system.onrender.com/register-referred", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    wallet_address: address,
                    referred_by: referrerAddress,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.error('Backend registration error:', errorData);
                // Continue with UI updates even if backend fails
            }

            // Get sponsors data regardless of backend status
            const sponsors = await contractFunctions.getSponsors();
            
            // Update UI state
            setDashboardState(prev => ({ ...prev, isRegistered: true, currentLevel: 1 }));
            if (sponsors) {
                setDirectSponsor({ 
                    directSponsor: sponsors.directSponsor, 
                    matrixSponsor: sponsors.matrixSponsor 
                });
                setMatrixSponsor({ 
                    directSponsor: sponsors.directSponsor, 
                    matrixSponsor: sponsors.matrixSponsor 
                });
            }
            localStorage.removeItem("tetherwave_refId");

            return "Registration successful!";
        } catch (error) {
            console.error('Registration error:', error);
            throw new Error("Registration failed. Please try again.");
        }
    })();

    toast.promise(registerPromise, {
      loading: 'Registering...',
      success: (message: string) => message,
      error: (err: Error) => `Registration failed: ${err.message}`
  });
  };

  const handleUpgrade = async (targetLevel: number) => {
    if (!address) return;

    const upgradePromise = (async () => {
        await upgrade(targetLevel, usdtBalance);
        
        const [stats, response, sponsors] = await Promise.all([
            contractFunctions.getUserStats(),
            fetch(`https://node-referral-system.onrender.com/user/${address}`),
            contractFunctions.getSponsors()
        ]);

        setDashboardState(prev => ({ ...prev, currentLevel: targetLevel }));
        await refetchUsdtBalance();

        if (stats) {
            setDashboardState(prev => ({ ...prev, userStats: stats }));
        }

        if (response.ok) {
            const data = await response.json();
            setUserProfileData(data);
        }

        if (sponsors) {
            setDirectSponsor({ 
                directSponsor: sponsors.directSponsor, 
                matrixSponsor: sponsors.matrixSponsor 
            });
            setMatrixSponsor({ 
                directSponsor: sponsors.directSponsor, 
                matrixSponsor: sponsors.matrixSponsor 
            });
        }

        return `Successfully upgraded to Level ${targetLevel}!`;
    })();

    toast.promise(upgradePromise, {
        loading: 'Processing upgrade...',
        success: (message: string) => message,
        error: (err: Error) => `Upgrade failed: ${err.message}`
    });
  };

  const directSponsorId = useFrontendDisplay(
    directSponsor?.directSponsor?.toString(),
    true
  );
  const matrixSponsorId = useFrontendDisplay(
    matrixSponsor?.matrixSponsor?.toString(),
    true
  );

  return (
    <div className="flex flex-col justify-center items-center gap-4 w-full overflow-hidden">
      <section className="lg:hidden flex justify-between items-center w-full overflow-y-auto drop-shadow-lg lg:p-4 pb-2 ps-5">
        <SocialLinks />
      </section>

      <section className="grid lg:grid-cols-2 gap-6 lg:gap-8 text-nowrap w-full">
        <ProfileDetails
          userProfileData={userProfileData}
          currentLevel={dashboardState.currentLevel}
          directSponsorId={directSponsorId}
          matrixSponsorId={matrixSponsorId}
        />

        <WalletDetails
          address={address}
          usdtBalance={usdtBalance}
          referralCode={referralCode}
        />
      </section>

      {!dashboardState.isRegistered && (
        <Registration
          referrerAddress={referrerAddress}
          setReferrerAddress={setReferrerAddress}
          handleRegister={handleRegister}
        />
      )}

      {dashboardState.isRegistered && (
        <Packages currentLevel={dashboardState.currentLevel} handleUpgrade={handleUpgrade} />
      )}

      {dashboardState.isRegistered && dashboardState.userStats && (
        <AllIncomes
          userStats={dashboardState.userStats}
          upgradeReferralIncome={dashboardState.upgradeReferralIncome}
          totalTeamSize={dashboardState.totalTeamSize}
        />
      )}

      <section className="w-full">
        <RankIncome userStats={dashboardState.userStats} levelIncomes={dashboardState.levelIncomes} />
      </section>

      <section className="mt-4 lg:mt-8 w-full">
        <h3 className="text-2xl lg:text-5xl font-bold pb-4 lg:pb-8 text-center text-3d dark:text-3d-dark bg-gradient-to-r from-pink via-purple to-blue text-transparent/10 bg-clip-text">
          Fortune Founder Reward
        </h3>
        <RoyaltySlab />
      </section>

      <section className="w-full">
        <RecentIncome
          {...{
            recentIncomes,
            currentLevel: dashboardState.currentLevel,
            currentPage,
            setCurrentPage,
            itemsPerPage,
          }}
        />
      </section>

      <section className="text-center text-xs lg:text-sm font-bold mt-4 lg:mt-8 mb-2 w-full">
        <p>TetherWave Contract opbnb.bscscan</p>
        <Link
          href="https://opbnb-testnet.bscscan.com/address/0xad7284Bf6fB1c725a7500C51b71847fEf2D2d17C"
          className="text-yellow-600 hover:underline"
        >
          (0xad7284Bf6fB1c725a7500C51b71847fEf2D2d17C)
        </Link>
      </section>
    </div>
  );
};

export default DashboardPage;
