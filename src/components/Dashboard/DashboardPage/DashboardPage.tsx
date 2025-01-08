"use client";

import { useState, useEffect } from "react";
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

const DashboardPage = () => {
  const { address, balances } = useWallet();
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
  const [isRegistered, setIsRegistered] = useState(false);
  const [currentLevel, setCurrentLevel] = useState(0);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [levelIncomes, setLevelIncomes] = useState<bigint[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [referralCode, setReferralCode] = useState<string>("");
  const [directSponsor, setDirectSponsor] = useState<Sponsor | null>(null);
  const [matrixSponsor, setMatrixSponsor] = useState<Sponsor | null>(null);
  const [upgradeReferralIncome, setUpgradeReferralIncome] = useState<
    bigint | null | undefined
  >();
  const [totalTeamSize, setTotalTeamSize] = useState<number | undefined>();
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

  useEffect(() => {
    const fetchData = async () => {
      if (!address) return;

      try {
        // First check if user is registered
        const stats = await getUserStats();
        const sponsors = await getSponsors();
        if (stats) {
          setCurrentLevel(stats.currentLevel);
          setUserStats(stats);
          setIsRegistered(stats.currentLevel > 0);
          // Transform array response into Sponsor objects
          setDirectSponsor(
            sponsors
              ? {
                  directSponsor: sponsors.directSponsor,
                  matrixSponsor: sponsors.matrixSponsor,
                }
              : null
          );
          setMatrixSponsor(
            sponsors
              ? {
                  directSponsor: sponsors.directSponsor,
                  matrixSponsor: sponsors.matrixSponsor,
                }
              : null
          );
        }

        if ((stats?.currentLevel ?? 0) > 0) {
          const incomes = await getLevelIncomes();
          setLevelIncomes(incomes);
          const upgradeReferralIncome = await getUpgradeReferralIncome(address);
          setUpgradeReferralIncome(upgradeReferralIncome || undefined);
          const totalTeamSize = await getTeamSizes(address);
          setTotalTeamSize(
            totalTeamSize && totalTeamSize.length > 0 ? totalTeamSize[0] : 0
          );

          const resultInc = await getRecentIncomeEventsPaginated(
            address,
            BigInt((currentPage - 1) * itemsPerPage),
            BigInt(itemsPerPage)
          );
          setRecentIncomes(resultInc);
        }
      } catch {
        return null;
      }
    };

    fetchData();
  }, [
    address,
    getUserStats,
    getLevelIncomes,
    getRecentIncomeEventsPaginated,
    currentPage,
    getSponsors,
    getUpgradeReferralIncome,
    getTeamSizes,
  ]);

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
      console.error("Missing address or referrer address");
      return;
    }

    try {
      try {
        await register(referrerAddress);
        console.log("Blockchain registration successful");
      } catch (blockchainError) {
        console.error("Blockchain registration failed:", blockchainError);
        throw new Error("Blockchain registration failed");
      }

      await new Promise((resolve) => setTimeout(resolve, 3000));

      try {
        const response = await fetch(
          "https://node-referral-system.onrender.com/register-referred",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              wallet_address: address,
              referred_by: referrerAddress,
            }),
          }
        );

        const data = await response.json();
        if (!response.ok) {
          throw new Error(
            `Backend registration failed: ${response.status} - ${JSON.stringify(
              data
            )}`
          );
        }

        setIsRegistered(true);
        setCurrentLevel(1);

        localStorage.removeItem("tetherwave_refId");

        await new Promise((resolve) => setTimeout(resolve, 2000));

        const [stats, profile, sponsors] = await Promise.all([
          getUserStats(),
          fetch(
            `https://node-referral-system.onrender.com/user/${address}`
          ).then((r) => r.json()),
          getSponsors(),
        ]);

        if (stats) setUserStats(stats);
        if (profile) {
          setUserProfileData(profile);
          setReferralCode(profile.referral_code);
        }
        if (sponsors) {
          setDirectSponsor(
            sponsors
              ? {
                  directSponsor: sponsors.directSponsor,
                  matrixSponsor: sponsors.matrixSponsor,
                }
              : null
          );
          setMatrixSponsor(
            sponsors
              ? {
                  directSponsor: sponsors.directSponsor,
                  matrixSponsor: sponsors.matrixSponsor,
                }
              : null
          );
        }

        const referralLink = `${window.location.origin}/dashboard/?ref=${data.referral_code}`;
        const referralLinkElement = document.querySelector(".referral-link");
        if (referralLinkElement) {
          referralLinkElement.setAttribute("data-referral", referralLink);
        }

        alert("Registration successful!");
      } catch (backendError) {
        console.error("Backend registration failed:", backendError);
        throw new Error("Backend registration failed");
      }
    } catch (error) {
      console.error("Registration process failed:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      alert(`Registration failed: ${errorMessage}`);
      throw new Error("Failed to register");
    }
  };

  const handleUpgrade = async (targetLevel: number, amount: number) => {
    if (!address) return;

    try {
      await upgrade(targetLevel, amount);
      setCurrentLevel(targetLevel);
      alert("Upgrade successful!");
      const stats = await getUserStats();
      if (stats) setUserStats(stats);
    } catch {
      alert("Upgrade failed!");
    }
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
          currentLevel={currentLevel}
          directSponsorId={directSponsorId}
          matrixSponsorId={matrixSponsorId}
        />

        <WalletDetails
          address={address}
          usdtBalance={usdtBalance}
          referralCode={referralCode}
        />
      </section>

      {!isRegistered && (
        <Registration
          referrerAddress={referrerAddress}
          setReferrerAddress={setReferrerAddress}
          handleRegister={handleRegister}
        />
      )}

      {isRegistered && (
        <Packages currentLevel={currentLevel} handleUpgrade={handleUpgrade} />
      )}

      {isRegistered && userStats && (
        <AllIncomes
          userStats={userStats}
          upgradeReferralIncome={upgradeReferralIncome}
          totalTeamSize={totalTeamSize}
        />
      )}

      <section className="w-full">
        <RankIncome userStats={userStats} levelIncomes={levelIncomes} />
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
            currentLevel,
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
