"use client";

import {
  User,
  Wallet,
  Calendar,
  Users,
  Hash,
  Crown,
  Copy,
  Boxes,
  Link2,
  ChevronLeft,
  ChevronRight,
  Key,
  Landmark,
  BadgeDollarSign,
} from "lucide-react";
import { useState, useEffect } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { formatUnits } from 'viem';
import Link from "next/link";

import { useWallet } from "@/lib/hooks/useWallet";
import { useContract } from "@/lib/hooks/useContract";
import { truncateAddress } from "@/lib/utils/format";
import { LEVELS } from "@/lib/constants/levels";
import SocialLinks from "./SocialLinks";
import { RoyaltySlab } from "./RoyaltySlab"; 
import type { UserStats, RecentIncomeEvents } from "@/types/contract";

function ProfileItem({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center space-x-2">
      <Icon className="h-4 w-4 text-muted-foreground" />
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
      <section className="lg:hidden flex justify-between items-center drop-shadow-lg lg:p-4 py-4 bg-white lg:rounded-lg">
        <div className="ps-4">
          <SocialLinks />
        </div>
      </section>

      <div className="grid lg:grid-cols-2 gap-4 text-nowrap">
        <section className="drop-shadow-lg p-4 bg-white lg:rounded-lg">
          <div className="flex items-center space-x-2 text-lg font-bold">
            <User className="h-5 w-5" />
            <span>Profile Details</span>
          </div>

          <div className="grid gap-2 mt-4">
            <ProfileItem icon={Hash} label="User ID" value="123" />
            <ProfileItem icon={Crown} label="Rank" value={`${currentLevel} - ${LEVELS.find(l => l.level === currentLevel)?.name || 'Unknown'}`} />
            <ProfileItem
              icon={Calendar}
              label="Activation Date"
              value="2024-01-01"
            />
            <ProfileItem
              icon={Users}
              label="Referred By"
              value="feygyfe...fegwu"
            />
          </div>
        </section>

        <section className="drop-shadow-lg p-4 bg-white lg:rounded-lg space-y-4">
          <section>
            <div className="flex items-center space-x-2 text-lg font-bold">
              <Wallet className="h-5 w-5" />
              <span>Wallet Details</span>
            </div>
            <div className="mt-2">
              <div className="flex items-center space-x-2">
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
              <div className="flex flex-col space-y-1">
                <div className="flex items-center space-x-2">
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
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">USDT Balance:</span>
                  <span className="font-bold">
                    {balances.usdt ? `${balances.usdt} USDT` : '0.0000 USDT'}
                  </span>
                </div>
              </div>
            </div>
          </section>

          <section>
            <div className="flex items-center space-x-2 text-lg font-bold">
              <Link2 className="h-5 w-5" />
              <span>Referral Link</span>
            </div>
            <div className="mt-2">
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  className="flex items-center space-x-2 cursor-pointer"
                  onClick={() => address && copyToClipboard(`${window.location.origin}?ref=${address}`)}
                  onKeyDown={(e) => e.key === 'Enter' && address && copyToClipboard(`${window.location.origin}?ref=${address}`)}
                >
                  <span className="font-bold bg-yellow-300 px-2 py-1 rounded">
                    {address ? truncateAddress(address) : 'Not Connected'}
                  </span>
                  <Copy className={`h-4 w-4 transition-colors ${isCopied ? 'text-green-500' : 'text-muted-foreground hover:text-black'}`} />
                </button>
              </div>
            </div>
          </section>
        </section>
      </div>

      {!isRegistered && (
        <section className="mt-4">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center space-x-2 text-lg font-bold mb-4">
             <Key className="h-5 w-5" />
             <span>Registration</span>
          </div>
            <input
              type="text"
              placeholder="Referrer Address"
              value={referrerAddress}
              onChange={(e) => setReferrerAddress(e.target.value)}
              className="w-full p-2 border rounded mb-4 text-black"
            />
            <button
              type="button"
              onClick={handleRegister}
              className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600"
            >
              Register
            </button>
          </div>
        </section>
      )}

      {isRegistered && (
        <div className="drop-shadow-lg p-4 bg-white lg:rounded-lg">
          <div className="flex items-center space-x-2 text-lg font-bold">
            <Boxes className="h-5 w-5" />
            <span>Packages (Current Level: {currentLevel})</span>
          </div>
          <div className="flex lg:grid lg:grid-cols-5 gap-4 mt-4 overflow-auto text-nowrap">
            {LEVELS.map((levelInfo) => {
              const currentLevelNum = Number(currentLevel);
              const levelNum = Number(levelInfo.level);
              const isNextLevel = levelNum === (currentLevelNum + 1);
              const isCompleted = levelNum <= currentLevelNum;

              return (
                <div key={levelInfo.id} className="flex flex-col items-center">
                  <button
                    type="button"
                    onClick={() => handleUpgrade(levelNum, levelInfo.amount)}
                    disabled={!isNextLevel}
                    className={`
                flex flex-col justify-center items-center gap-2 min-w-48 px-4 py-2 rounded-md w-full
                transition-all duration-300 bg-gradient-to-tr shadow-md drop-shadow-md
                ${isCompleted ? 'from-green-400 via-green-300 to-green-400' : 'from-yellow-300 via-yellow-200 to-yellow-300'}
                ${isNextLevel ? 'hover:scale-105 cursor-pointer' : 'opacity-50 cursor-not-allowed'}
              `}
                  >
                    <div className="flex justify-between items-center gap-2 w-full" >
                    <p className="text-sm font-bold">Level {levelInfo.level}</p>
                    {isCompleted && (
                    <span className="text-xs lg:text-sm font-bold text-green-800">✓ Completed</span>
                   )}
                    </div>
                   <p className="text-lg lg:text-xl font-semibold">{levelInfo.name}</p>
                      <p className="text-sm font-bold text-end w-full">{levelInfo.amount} USD</p>
                  </button>

                  
                </div>
              );
            })}
          </div>
        </div>
      )}

      {isRegistered && userStats && (
        <section className="flex flex-col lg:flex-row justify-between items-start gap-4 w-full mt-4">
          <div className="drop-shadow-lg p-4 lg:rounded-lg w-full border-l-4 border-green-900 bg-gradient-to-r from-green-300  to-green-500">
            <p className="text-lg font-bold">Total Income</p>
            <p className="font-bold">{userStats?.totalEarnings ? formatUnits(userStats.totalEarnings, 18) : '0'} USDT</p>
          </div>
          <div className="drop-shadow-lg p-4 lg:rounded-lg w-full border-l-4 border-pink-900 bg-gradient-to-r from-pink-300  to-pink-500">
            <p className="text-lg font-bold">Referral Income</p>
            <p className="font-bold">{userStats?.directCommissionEarned ? formatUnits(userStats.directCommissionEarned, 18) : '0'} USDT</p>
          </div>
          <div className="drop-shadow-lg p-4 lg:rounded-lg w-full border-l-4 border-orange-900 bg-gradient-to-r from-orange-300  to-orange-500">
            <p className="text-lg font-bold">Level Income</p>
            <p className="font-bold">{userStats?.levelIncomeEarned ? formatUnits(userStats.levelIncomeEarned, 18) : '0'} USDT</p>
          </div>
          <div className="drop-shadow-lg p-4 lg:rounded-lg w-full border-l-4 border-indigo-900 bg-gradient-to-r from-indigo-300  to-indigo-500">
            <p className="text-lg font-bold">Direct Referral</p>
            <p className="font-bold">{userStats?.directReferrals?.toString() || '0'}</p>
          </div>
        </section>
      )}

      <section className="mt-4">
        <div className="drop-shadow-lg p-4 pb-6 bg-white lg:rounded-lg ">
          <div className="flex items-center space-x-2 text-lg font-bold">
            <Landmark className="h-5 w-5" />
            <span>Rank Income</span>
          </div>
          <div className="grid gap-4 md:grid-cols-2 mt-4 h-80 lg:h-auto overflow-auto">
            <div className="rounded-lg px-4 py-3 drop-shadow-md shadow-inner bg-gradient-to-r border from-yellow-100 to-blue-50">
              <div className="flex justify-between items-center">
                <span className="font-semibold">{LEVELS[0].name}</span>
                <span className="bg-gradient-to-br from-yellow-500 via-yellow-300 to-yellow-500 border border-dashed px-2 py-1 rounded font-medium">
                  {userStats?.directCommissionEarned ? formatUnits(userStats.directCommissionEarned, 18) : '0'} USDT
                </span>
              </div>
            </div>
            {LEVELS.slice(1).map((level, index) => (
              <div
                key={level.id}
                className="rounded-lg px-4 py-3 drop-shadow-md shadow-inner bg-gradient-to-r border from-yellow-100 to-blue-50"
              >
                <div className="flex justify-between items-center">
                  <span className="font-semibold">{level.name}</span>
                  <span className="bg-gradient-to-br from-yellow-500 via-yellow-300 to-yellow-500 border border-dashed px-2 py-1 rounded font-medium">
                    {levelIncomes[index + 1] ? formatUnits(levelIncomes[index + 1], 18) : '0'} USDT
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-4">
        <RoyaltySlab/>
      </section>

      <section className="drop-shadow-lg p-4 bg-white rounded-lg mt-4">
        <div className="flex items-center space-x-2 text-lg font-bold">
          <BadgeDollarSign className="h-5 w-5" />
          <span>Recent Income</span>
        </div>
        <div className="overflow-y-auto text-nowrap">
          <table className="w-full mt-4 border-collapse">
            <thead className="overflow-y-auto">
              <tr>
                <th className="bg-yellow-200 py-2 px-4 text-left">From</th>
                <th className="bg-yellow-200 py-2 px-4 text-left">Amount</th>
                <th className="bg-yellow-200 py-2 px-4 text-left">Rank Level</th>
                <th className="bg-yellow-200 py-2 px-4 text-left">Layer</th>
                <th className="bg-yellow-200 py-2 px-4 text-left">Time</th>
              </tr>
            </thead>
            <tbody>
              {recentIncomes.userAddresses.map((address, index) => (
                <tr key={`${index + 1}`} className="hover:bg-gray-50 border-b">
                  <td className="py-2 px-4">{truncateAddress(address)}</td>
                  <td className="py-2 px-4">
                    {formatUnits(recentIncomes.amounts[index], 18)} USDT
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

          <div className="flex justify-between items-center mt-4">
            <div className="text-sm text-gray-500">
              Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
              {Math.min(currentPage * itemsPerPage, recentIncomes.totalCount)} of{' '}
              {recentIncomes.totalCount} entries
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded ${currentPage === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-yellow-200 hover:bg-yellow-300'
                  }`}
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <div className="px-3 py-1 rounded bg-yellow-300">
                {currentPage} of {Math.ceil(recentIncomes.totalCount / itemsPerPage)}
              </div>
              <button
                type="button"
                onClick={() => setCurrentPage(prev =>
                  Math.min(prev + 1, Math.ceil(recentIncomes.totalCount / itemsPerPage))
                )}
                disabled={currentPage === Math.ceil(recentIncomes.totalCount / itemsPerPage)}
                className={`px-3 py-1 rounded ${currentPage === Math.ceil(recentIncomes.totalCount / itemsPerPage)
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-yellow-200 hover:bg-yellow-300'
                  }`}
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      <div className="text-center text-sm font-semibold mt-4">
        <p>TetherWave Contract opbnb.bscscan</p>
        <Link href="https://opbnb-testnet.bscscan.com/address/0xc3ea8e34b056fa334244ab4c6c5dfca80c490f93" className="text-yellow-700 hover:underline">
          (0xC3eA8E34B056fa334244AB4c6c5DfCa80C490f93)
        </Link>
      </div>
    </div>
  );
};

export default DashboardPage;
