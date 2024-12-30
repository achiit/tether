"use client";

import { User, Wallet, Calendar, Users, Hash, Crown, Copy, Boxes, Link2, ChevronLeft, ChevronRight, Key, Landmark, BadgeDollarSign, FileInput, CircleDollarSign, Flame } from "lucide-react";
import { useState, useEffect } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { formatUnits } from 'viem';
import Link from "next/link";

import { useWallet } from "@/lib/hooks/useWallet";
import { useContract } from "@/lib/hooks/useContract";
import { truncateAddress } from "@/lib/utils/format";
import { LEVELS } from "@/lib/constants/levels";
import SocialLinks from "./SocialLinks";
import RoyaltySlab from "./RoyaltySlab";
import type { UserStats, RecentIncomeEvents } from "@/types/contract";

function ProfileItem({ icon: Icon, label, value, }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="flex items-center space-x-2 px-4 py-4 drop-shadow-lg shadow-inner rounded-md bg-white/40 dark:bg-white/5 backdrop-blur-lg">
      <Icon className="h-4 lg:h-5 w-4 lg:w-4 text-muted-foreground" />
      <span className="text-sm font-medium">{label}:</span>
      <span className="font-bold">{value}</span>
    </div>
  );
}

const DashboardPage = () => {
  const { address, balances } = useWallet();
  const { getUserStats, getLevelIncomes, getRecentIncomeEventsPaginated, register, upgrade } = useContract();

  const [isCopied, setIsCopied] = useState(false);
  const [referrerAddress, setReferrerAddress] = useState('');
  const [isRegistered, setIsRegistered] = useState(false);
  const [currentLevel, setCurrentLevel] = useState(0);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [levelIncomes, setLevelIncomes] = useState<bigint[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [recentIncomes, setRecentIncomes] = useState<RecentIncomeEvents>({
    userAddresses: [],
    levelNumbers: [],
    amounts: [],
    timestamps: [],
    totalCount: 0
  });

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!address) return;

      try {
        const stats = await getUserStats();
        if (stats) {
          setCurrentLevel(stats.currentLevel);
          setUserStats(stats);
          setIsRegistered(stats.isActive);
        }

        const incomes = await getLevelIncomes();
        setLevelIncomes(incomes);

        const resultInc = await getRecentIncomeEventsPaginated(
          address,
          BigInt((currentPage - 1) * itemsPerPage),
          BigInt(itemsPerPage)
        );
        setRecentIncomes(resultInc);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [address, getUserStats, getLevelIncomes, getRecentIncomeEventsPaginated, currentPage]);

  const handleRegister = async () => {
    if (!address || !referrerAddress) return;

    try {
      await register(referrerAddress);
      setIsRegistered(true);
      setCurrentLevel(1);
      const stats = await getUserStats();
      if (stats) setUserStats(stats);
      alert('Registration successful!');
    } catch (error) {
      console.error('Registration error:', error);
      alert(`Registration failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  const handleUpgrade = async (targetLevel: number, amount: number) => {
    if (!address) return;

    try {
      await upgrade(targetLevel, amount);
      setCurrentLevel(targetLevel);
      alert('Upgrade successful!');
      const stats = await getUserStats();
      if (stats) setUserStats(stats);
    } catch (error) {
      console.error('Upgrade error:', error);
      alert('Upgrade failed!');
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <section className="lg:hidden flex justify-between items-center w-full overflow-y-auto drop-shadow-lg lg:p-4 py-4">
        <SocialLinks />
      </section>

      <div className="grid lg:grid-cols-2 gap-6 lg:gap-8 text-nowrap">
        <section
          className="relative p-4 rounded-lg drop-shadow-lg shadow bg-light-gradient dark:bg-dark-gradient">
          <div className="flex items-center space-x-2 text-lg font-bold">
            <User className="h-5 w-5" />
            <span>Profile Details</span>
          </div>
          <div className="grid lg:grid-cols-2 gap-2 lg:gap-4 mt-4">
            <ProfileItem icon={Hash} label="User ID" value="123" />
            <ProfileItem icon={Crown} label="Rank" value={`${currentLevel} - ${LEVELS.find(l => l.level === currentLevel)?.name || 'Unknown'}`} />
            <ProfileItem icon={Calendar} label="Activation Date" value="2024-01-01" />
            <ProfileItem icon={Users} label="Referred By" value="feygyfe...fegwu" />
          </div>
        </section>

        <section
          className="relative p-4 rounded-lg drop-shadow-lg shadow bg-light-gradient dark:bg-dark-gradient">
          <div>
            <div className="flex items-center space-x-2 text-lg font-bold">
              <Wallet className="h-5 w-5" />
              <span>Wallet Details</span>
            </div>
            <div className="grid lg:grid-cols-2 gap-2 lg:gap-4 mt-4">
              <div className="flex items-center space-x-2 px-4 py-4 drop-shadow-lg shadow-inner rounded-md bg-white/40 dark:bg-white/5 backdrop-blur-lg">
                <FileInput className="h-4 lg:h-5 w-4 lg:w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Address:</span>
                <button
                  type="button"
                  className="flex items-center space-x-2 cursor-pointer"
                  onClick={() => address && copyToClipboard(address)}
                  onKeyDown={(e) => e.key === 'Enter' && address && copyToClipboard(address)}
                >
                  <span className="font-bold">
                    {address ? truncateAddress(address) : 'Not Connected'}
                  </span>
                  <Copy className={`h-4 w-4 transition-colors ${isCopied ? 'text-green-500' : 'text-muted-foreground hover:text-black'}`} />
                </button>
              </div>
              <div className="flex items-center space-x-2 px-4 py-4 drop-shadow-lg shadow-inner rounded-md bg-white/40 dark:bg-white/5 backdrop-blur-lg">
                <Flame className="h-4 lg:h-5 w-4 lg:w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Balance:</span>
                <ConnectButton.Custom>
                  {({
                    account,
                    chain,
                    authenticationStatus,
                    mounted,
                  }) => {
                    const ready = mounted && authenticationStatus !== 'loading';
                    const connected = ready && account && chain &&
                      (!authenticationStatus || authenticationStatus === 'authenticated');

                    return (
                      <div
                        {...(!ready && {
                          'aria-hidden': true,
                          'style': {
                            opacity: 0,
                            pointerEvents: 'none',
                            userSelect: 'none',
                          },
                        })}
                      >
                        <span className="font-bold">
                          {!connected
                            ? 'Not Connected'
                            : account?.displayBalance
                              ? ` ${account.balanceFormatted}`
                              : `0.0000 ${chain?.name || 'BNB'}`
                          }
                        </span>
                      </div>
                    );
                  }}
                </ConnectButton.Custom>
              </div>
              <div className="flex items-center space-x-2 px-4 py-4 drop-shadow-lg shadow-inner rounded-md bg-white/40 dark:bg-white/5 backdrop-blur-lg">
                <CircleDollarSign className="h-4 lg:h-5 w-4 lg:w-4 text-muted-foreground" />
                <span className="text-sm font-medium">USDT Balance:</span>
                <span className="font-bold">
                  {balances.usdt ? `${balances.usdt} USDT` : '0.0000 USDT'}
                </span>
              </div>
              <div className="flex items-center space-x-2 px-4 py-3 drop-shadow-lg shadow-inner rounded-md bg-white/40 dark:bg-white/5 backdrop-blur-lg">
                <Link2 className="h-4 lg:h-5 w-4 lg:w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Referral Link:</span>
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    className="flex items-center space-x-2 cursor-pointer"
                    onClick={() => address && copyToClipboard(`${window.location.origin}?ref=${address}`)}
                    onKeyDown={(e) => e.key === 'Enter' && address && copyToClipboard(`${window.location.origin}?ref=${address}`)}
                  >
                    <span className="bg-gradient-button px-2 py-1 rounded font-medium">
                      {address ? truncateAddress(address) : 'Not Connected'}
                    </span>
                    <Copy className={`h-4 w-4 transition-colors ${isCopied ? 'text-green-500' : 'text-muted-foreground hover:text-black'}`} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {!isRegistered && (
        <section
          className="mt-4 lg:mt-8">
          <div className="p-4 lg:p-6 rounded-lg drop-shadow-lg shadow bg-light-gradient dark:bg-dark-gradient">
            <div className="flex items-center space-x-2 text-lg font-bold mb-4">
              <Key className="h-5 w-5" />
              <span>Registration</span>
            </div>
            <input
              type="text"
              placeholder="Referrer Address"
              value={referrerAddress}
              onChange={(e) => setReferrerAddress(e.target.value)}
              className="w-full py-3 px-4  rounded mb-4 bg-white/40 dark:bg-white/5 outline-none flex items-center space-x-2 drop-shadow-lg shadow-inner backdrop-blur-lg"
            />
            <button
              type="button"
              onClick={handleRegister}
              className="p-2.5 px-4 lg:px-8 font-semibold cursor-pointer drop-shadow shadow 
              bg-gradient-button active:scale-105 hover:opacity-80 rounded-lg transition-all duration-300"
            >
              Register
            </button>
          </div>
        </section>
      )}

      {isRegistered && (
        <div
          className="mt-4 lg:mt-8 rounded-lg drop-shadow-lg shadow bg-light-gradient dark:bg-dark-gradient">
          <div className="flex items-center space-x-2 text-lg font-bold px-4 lg:px-6 pt-4 lg:pt-6">
            <Boxes className="h-5 w-5" />
            <span>Packages (Current Level: {currentLevel})</span>
          </div>
          <div className="p-4 lg:px-6 lg:pb-6 flex lg:grid lg:grid-cols-5 gap-4 lg:gap-6 overflow-auto text-nowrap">
            {LEVELS.map((levelInfo) => {
              const currentLevelNum = Number(currentLevel);
              const levelNum = Number(levelInfo.level);
              const isNextLevel = levelNum === (currentLevelNum + 1);
              const isCompleted = levelNum <= currentLevelNum;

              return (
                <div key={levelInfo.id}
                  className={`flex flex-col items-center rounded-md transition-all duration-300
                ${!isCompleted ? 'border-animation-card' : 'border-animation-card-completed'}
                ${isNextLevel ? 'hover:scale-105  opacity-100 cursor-pointer' : 'opacity-50 cursor-not-allowed'}
                `}>
                  <div className="flex justify-center items-center w-full z-50 p-0.5">
                    <button
                      type="button"
                      onClick={() => handleUpgrade(levelNum, levelInfo.amount)}
                      disabled={!isNextLevel}
                      className={`relative flex flex-col justify-center items-center min-w-48 px-4 py-2.5 rounded-md w-full z-50
                    shadow-md drop-shadow-md overflow-hidden text-white 
                    ${isCompleted ? 'bg-[#7bc23d]' : 'bg-[#F72C5B]'}
                    ${isNextLevel ? 'cursor-pointer' : 'cursor-not-allowed text-opacity-50'}
                  `}>
                      <div className="flex justify-between items-center w-full z-20" >
                        <p className=" font-bold text-3d dark:text-3d-dark">Level {levelInfo.level}</p>
                        {isCompleted && (
                          <span className="absolute top-2 right-2 flex justify-center items-center text-xs shadow drop-shadow lg:text-sm font-bold text-white bg-green-500 rounded-full p-1 w-6 lg:w-7 h-6 lg:h-7 z-20">✓</span>
                        )}
                      </div>
                      <div className="z-20 pb-2 pt-2" >
                        <p className="text-lg lg:text-2xl font-bold text-3d dark:text-3d-dark">{levelInfo.name}</p>
                        <p className="text-sm  lg:text-lg font-bold text-center w-full text-3d dark:text-3d-dark">${levelInfo.amount}</p>
                      </div>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {isRegistered && userStats && (
        <section className="flex flex-col lg:flex-row justify-between items-start gap-4 w-full mt-4 lg:mt-8">
          <div className="flex justify-center items-center drop-shadow-lg shadow-md p-px w-full rounded-lg !bg-gradient-button">
            <div className="flex flex-col justify-center items-center w-full p-4 rounded-lg bg-white/70 dark:bg-black/80">
              <p className="text-lg font-bold">Total Income</p>
              <p className="font-bold">{userStats?.totalEarnings ? formatUnits(userStats.totalEarnings, 18) : '0'} USDT</p>
            </div>
          </div>
          <div className="flex justify-center items-center drop-shadow-lg shadow-md p-px w-full rounded-lg !bg-gradient-button">
            <div className="flex flex-col justify-center items-center w-full p-4 rounded-lg bg-white/70 dark:bg-black/80">
              <p className="text-lg font-bold">Referral Income</p>
              <p className="font-bold">{userStats?.directCommissionEarned ? formatUnits(userStats.directCommissionEarned, 18) : '0'} USDT</p>
            </div>
          </div>
          <div className="flex justify-center items-center drop-shadow-lg shadow-md p-px w-full rounded-lg !bg-gradient-button">
            <div className="flex flex-col justify-center items-center w-full p-4 rounded-lg bg-white/70 dark:bg-black/80">
              <p className="text-lg font-bold">Level Income</p>
              <p className="font-bold">{userStats?.levelIncomeEarned ? formatUnits(userStats.levelIncomeEarned, 18) : '0'} USDT</p>
            </div>
          </div>
          <div className="flex justify-center items-center drop-shadow-lg shadow-md p-px w-full rounded-lg !bg-gradient-button">
            <div className="flex flex-col justify-center items-center w-full p-4 rounded-lg bg-white/70 dark:bg-black/80">
              <p className="text-lg font-bold">Direct Referral</p>
              <p className="font-bold">{userStats?.directReferrals?.toString() || '0'}</p>
            </div>
          </div>
        </section>
      )}

      <section className="mt-4 lg:mt-8">
        <div className="rounded-lg drop-shadow-lg shadow bg-light-gradient dark:bg-dark-gradient">
          <div className="flex items-center space-x-2 text-lg font-bold px-4 lg:px-6 pt-4 lg:pt-6 ">
            <Landmark className="h-5 w-5" />
            <span>Rank Income</span>
          </div>
          <div className="p-4 lg:px-6 lg:pb-6 grid gap-4 md:grid-cols-2 h-80 lg:h-auto overflow-auto">
            <div className="rounded-lg px-4 py-3 drop-shadow-md shadow-inner bg-white/40 dark:bg-white/5 backdrop-blur-md">
              <div className="flex justify-between items-center">
                <span className="font-semibold">{LEVELS[0].name}</span>
                <span className="bg-gradient-button text-white overflow-hidden px-2 py-1 rounded font-medium">
                  {userStats?.directCommissionEarned ? formatUnits(userStats.directCommissionEarned, 18) : '0'} USDT
                </span>
              </div>
            </div>
            {LEVELS.slice(1).map((level, index) => (
              <div
                key={level.id}
                className="rounded-lg px-4 py-3 drop-shadow-md shadow-inner bg-white/40 dark:bg-white/5 backdrop-blur-md"
              >
                <div className="flex justify-between items-center">
                  <span className="font-semibold">{level.name}</span>
                  <span className="bg-gradient-button text-white  overflow-hidden px-2 py-1 rounded font-medium">
                    {levelIncomes[index + 1] ? formatUnits(levelIncomes[index + 1], 18) : '0'} USDT
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-4 lg:mt-8">
        <RoyaltySlab />
      </section>

      <section className="mt-4 lg:mt-8 p-4 rounded-lg drop-shadow-lg shadow bg-light-gradient dark:bg-dark-gradient">
        <div className="flex items-center space-x-2 text-lg font-bold">
          <BadgeDollarSign className="h-5 w-5" />
          <span>Recent Income</span>
        </div>
        <div className="overflow-y-auto text-nowrap pb-1">
          <table className="w-full mt-4 border-collapse">
            <thead className="overflow-y-auto drop-shadow-lg shadow-inner bg-white/40 dark:bg-white/5 backdrop-blur-lg">
              <tr>
                <th className="py-2 px-4 text-left">From</th>
                <th className="py-2 px-4 text-left">Amount</th>
                <th className="py-2 px-4 text-left">Rank Level</th>
                <th className="py-2 px-4 text-left">Layer</th>
                <th className="py-2 px-4 text-left">Time</th>
              </tr>
            </thead>
            <tbody>
              {recentIncomes.userAddresses.map((address, index) => (
                <tr key={`${index + 1}`} className="border-b hover:bg-white/10 backdrop-blur-lg">
                  <td className="py-2 px-4">{truncateAddress(address)}</td>
                  <td className="py-2 px-4 text-green-600">
                    +{formatUnits(recentIncomes.amounts[index], 18)} USDT
                  </td>
                  <td className="py-2 px-4">
                    {LEVELS[recentIncomes.levelNumbers[index] - 1]?.name ||
                      `Level ${recentIncomes.levelNumbers[index]}`}
                  </td>
                  <td className="py-2 px-4">
                    Level {recentIncomes.levelNumbers[index]}
                  </td>
                  <td className="py-2 px-4">
                    {new Date(recentIncomes.timestamps[index] * 1000).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-between items-center gap-4 mt-4 w-full">
            <div className="text-sm text-gray-500 w-full">
              Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
              {Math.min(currentPage * itemsPerPage, recentIncomes.totalCount)} of{' '}
              {recentIncomes.totalCount} entries
            </div>
            <div className="flex justify-end gap-1 lg:gap-2">
              <button
                type="button"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`px-3 py-2 rounded drop-shadow shadow ${currentPage === 1
                  ? 'bg-gray-300 text-gray-600 dark:bg-gray-700 dark:text-gray-500 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-500 dark:bg-gray-600 dark:text-gray-300 hover:bg-opacity-80 dark:hover:bg-opacity-80'
                  }`}
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <div className="px-3 py-1 rounded bg-gradient-button text-white">
                {currentPage} of {Math.ceil(recentIncomes.totalCount / itemsPerPage)}
              </div>
              <button
                type="button"
                onClick={() => setCurrentPage(prev =>
                  Math.min(prev + 1, Math.ceil(recentIncomes.totalCount / itemsPerPage))
                )}
                disabled={currentPage === Math.ceil(recentIncomes.totalCount / itemsPerPage)}
                className={`px-3 py-1 rounded drop-shadow shadow ${currentPage === Math.ceil(recentIncomes.totalCount / itemsPerPage)
                  ? 'bg-gray-300 text-gray-600 dark:bg-gray-700 dark:text-gray-500 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-500 dark:bg-gray-600 dark:text-gray-300 hover:bg-opacity-80 dark:hover:bg-opacity-80'
                  }`}
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      <div
        data-aos="fade-up"
        data-aos-duration={500}
        data-aos-anchor-placement="top-bottom"
        className="text-center text-xs lg:text-sm font-bold mt-4 lg:mt-8 mb-2">
        <p>TetherWave Contract opbnb.bscscan</p>
        <Link href="https://opbnb-testnet.bscscan.com/address/0xad7284Bf6fB1c725a7500C51b71847fEf2D2d17C" className="text-yellow-600 hover:underline">
          (0xad7284Bf6fB1c725a7500C51b71847fEf2D2d17C)
        </Link>
      </div>
    </div>
  );
};

export default DashboardPage;
