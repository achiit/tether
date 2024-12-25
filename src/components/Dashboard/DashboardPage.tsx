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
} from "lucide-react";
import SocialLinks from "./SocialLinks";
import { useAccount } from 'wagmi';
import { useState, useCallback, useEffect } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { getContracts, publicClient } from '@/utils/contract';
import { formatUnits } from 'viem';
import Link from "next/link";

interface UserStats {
  currentLevel: number;
  directReferrals: number;
  totalEarnings: bigint;
  directCommissionEarned: bigint;
  levelIncomeEarned: bigint;
  timestamp: number;
  isActive: boolean;
}

interface LevelInfo {
  id: number;
  level: number;
  name: string;
  amount: number;
  color: string;
}

const DashboardPage = () => {
  const { address } = useAccount();
  const [isCopied, setIsCopied] = useState(false);
  const [referrerAddress, setReferrerAddress] = useState('');
  const [isRegistered, setIsRegistered] = useState(false);
  const [currentLevel, setCurrentLevel] = useState(0);
  const [userStats, setUserStats] = useState<UserStats | null>(null);

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const checkRegistrationStatus = useCallback(async () => {
    if (!address) return;
    try {
      const { tetherWave } = getContracts();
      const statsArray = await tetherWave.publicClient.readContract({
        ...tetherWave,
        functionName: 'getUserStats',
        args: [address]
      }) as [number, number, bigint, bigint, bigint, number, boolean];

      // Convert array to object
      const stats: UserStats = {
        currentLevel: Number(statsArray[0]),
        directReferrals: Number(statsArray[1]),
        totalEarnings: statsArray[2],
        directCommissionEarned: statsArray[3],
        levelIncomeEarned: statsArray[4],
        timestamp: Number(statsArray[5]),
        isActive: statsArray[6]
      };

      if (stats.currentLevel > 0) {
        setCurrentLevel(stats.currentLevel);
        setUserStats(stats);
        setIsRegistered(true);
      }
    } catch (error) {
      console.error('Error checking registration:', error);
      setIsRegistered(false);
      setCurrentLevel(0);
    }
  }, [address]);

  useEffect(() => {
    if (address) {
      checkRegistrationStatus();
    }
  }, [address, checkRegistrationStatus]);

  // Handle Registration
  const handleRegister = async () => {
    if (!address || !referrerAddress) return;

    try {
      const { tetherWave, usdt } = getContracts();

      // First approve USDT
      const approveAmount = BigInt(11 * 10 ** 6); // 11 USDT with 6 decimals
      const approveHash = await usdt.walletClient.writeContract({
        ...usdt,
        functionName: 'approve',
        args: [tetherWave.address, approveAmount],
        account: address as `0x${string}`
      });
      await publicClient.waitForTransactionReceipt({ hash: approveHash });

      // Then register
      const { request } = await tetherWave.publicClient.simulateContract({
        ...tetherWave,
        functionName: 'register',
        args: [referrerAddress],
        account: address as `0x${string}`
      });

      const registerHash = await tetherWave.walletClient.writeContract(request);
      await publicClient.waitForTransactionReceipt({ hash: registerHash });

      // Update state after successful registration
      setIsRegistered(true);
      setCurrentLevel(1);
      await checkRegistrationStatus(); // Refresh stats
      alert('Registration successful!');
    } catch (error) {
      console.error('Registration error:', error);
      if (error && typeof error === 'object' && 'message' in error && typeof error.message === 'string' && error.message.includes('Invalid registration')) {
        await checkRegistrationStatus();
      }
      alert(`Registration failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  // Handle Upgrade
  const handleUpgrade = async (targetLevel: number, amount: number) => {
    if (!address) return;

    try {
      const { tetherWave, usdt } = getContracts();

      // First approve USDT
      const approveAmount = BigInt(amount * 10 ** 18); // Using 6 decimals for USDT
      const approveHash = await usdt.walletClient.writeContract({
        ...usdt,
        functionName: 'approve',
        args: [tetherWave.address, approveAmount],
        account: address as `0x${string}`
      });
      await publicClient.waitForTransactionReceipt({ hash: approveHash });

      // Then upgrade
      const upgradeHash = await tetherWave.walletClient.writeContract({
        ...tetherWave,
        functionName: 'upgrade',
        args: [targetLevel],
        account: address as `0x${string}`
      });
      await publicClient.waitForTransactionReceipt({ hash: upgradeHash });

      setCurrentLevel(targetLevel);
      alert('Upgrade successful!');
      await checkRegistrationStatus();
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
            <ProfileItem icon={Crown} label="Rank" value="Gold" />
            <ProfileItem
              icon={Calendar}
              label="Activation Date"
              value="2023-01-15"
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

      {/* Registration Section - Only show if not registered */}
      {!isRegistered && (
        <section className="mt-4">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-semibold mb-4 text-black">Registration</h2>
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

      {/* Upgrade Section - Only show if registered */}
      {isRegistered && (
        <div className="drop-shadow-lg p-4 bg-white lg:rounded-lg">
          <div className="flex items-center space-x-2 text-lg font-bold">
            <Boxes className="h-5 w-5" />
            <span>Packages (Current Level: {currentLevel})</span>
          </div>
          <div className="grid grid-cols-5 gap-4 mt-4">
            {LEVELS.map((levelInfo) => {
              // Ensure all values are numbers
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
                flex flex-col justify-center items-center p-1 rounded-full w-24 h-24
                transition-all duration-300
                ${isCompleted ? 'bg-green-200' : 'bg-yellow-200'}
                ${isNextLevel ? 'hover:scale-105 cursor-pointer' : 'opacity-50 cursor-not-allowed'}
              `}
                  >
                    <p className="text-sm font-bold">Level {levelInfo.level}</p>
                    <p className="text-xs font-bold">{levelInfo.name}</p>
                    <p className="text-sm font-bold">{levelInfo.amount} USD</p>
                  </button>

                  {isCompleted && (
                    <span className="mt-2 text-green-500">✓ Completed</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* User Stats Section - Only show if registered */}
      {isRegistered && userStats && (
        <section className="flex flex-col lg:flex-row justify-between items-start gap-4 w-full mt-4">
          <div className="drop-shadow-lg p-4 bg-white lg:rounded-lg w-full">
            <p className="text-lg font-bold">Total Income</p>
            <p>{userStats?.totalEarnings ? formatUnits(userStats.totalEarnings, 6) : '0'} USDT</p>
          </div>
          <div className="drop-shadow-lg p-4 bg-white lg:rounded-lg w-full">
            <p className="text-lg font-bold">Referral Income</p>
            <p>{userStats?.directCommissionEarned ? formatUnits(userStats.directCommissionEarned, 6) : '0'} USDT</p>
          </div>
          <div className="drop-shadow-lg p-4 bg-white lg:rounded-lg w-full">
            <p className="text-lg font-bold">Level Income</p>
            <p>{userStats?.levelIncomeEarned ? formatUnits(userStats.levelIncomeEarned, 6) : '0'} USDT</p>
          </div>
          <div className="drop-shadow-lg p-4 bg-white lg:rounded-lg w-full">
            <p className="text-lg font-bold">Direct Referral</p>
            <p>{userStats?.directReferrals?.toString() || '0'}</p>
          </div>
        </section>
      )}

      <section className="mt-4">
        <div className="drop-shadow-lg p-4 bg-white lg:rounded-lg ">
          <div className="flex items-center space-x-2 text-lg font-bold">
            <Boxes className="h-5 w-5" />
            <span>Rank Income</span>
          </div>
          <div className="grid gap-4 md:grid-cols-2 mt-4">
            {rankData.map((item) => (
              <div
                key={item.id}
                className="rounded-lg px-4 py-3 bg-gradient-to-r border from-yellow-100 to-blue-50"
              >
                <div className="flex justify-between items-center">
                  <span className="">{item.rank}</span>
                  <span className="bg-yellow-300 px-2 py-1 rounded font-medium">
                    {item.amount} BNB
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="drop-shadow-lg p-4 bg-white rounded-lg mt-4">
        <div className="flex items-center space-x-2 text-lg font-bold">
          <Boxes className="h-5 w-5" />
          <span>Recent Income</span>
        </div>
        <div className="overflow-y-auto text-nowrap">
          <table className="w-full mt-4 border-collapse ">
            <thead className="overflow-y-auto">
              <tr className="">
                <th className="bg-yellow-200 py-2 px-4 text-left">From</th>
                <th className="bg-yellow-200 py-2 px-4 text-left">Amount</th>
                <th className="bg-yellow-200 py-2 px-4 text-left">
                  Rank Level
                </th>
                <th className="bg-yellow-200 py-2 px-4 text-left">Layer</th>
                <th className="bg-yellow-200 py-2 px-4 text-left">Time</th>
              </tr>
            </thead>
            <tbody>
              {recentIncome.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 border-b">
                  <td className="py-2 px-4">{item.from}</td>
                  <td className="py-2 px-4">{item.amount} BNB</td>
                  <td className="py-2 px-4">{item.rankLevel}</td>
                  <td className="py-2 px-4">{item.layer}</td>
                  <td className="py-2 px-4">{item.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <div className="text-center text-sm font-semibold mt-4">
        <p>RideBNB Contract opbnb.bscscan</p>
        <Link href="https://opbnb.bscscan.com/address/" className="text-yellow-700 hover:underline">
          (0xc0d396da...d212340)
        </Link>
      </div>
    </div>
  );
};

export default DashboardPage;

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

const LEVELS: LevelInfo[] = [
  { id: 1, level: 1, name: "Starter", amount: 11, color: "bg-blue-500" },
  { id: 2, level: 2, name: "Bronze", amount: 22, color: "bg-amber-600" },
  { id: 3, level: 3, name: "Silver", amount: 44, color: "bg-gray-400" },
  { id: 4, level: 4, name: "Gold", amount: 88, color: "bg-yellow-500" },
  { id: 5, level: 5, name: "Diamond", amount: 176, color: "bg-purple-500" },
  { id: 6, level: 6, name: "Platinum", amount: 352, color: "bg-pink-500" },
  { id: 7, level: 7, name: "Titanium", amount: 704, color: "bg-orange-500" },
  { id: 8, level: 8, name: "Crown", amount: 1408, color: "bg-purple-500" },
  { id: 9, level: 9, name: "Royal", amount: 2816, color: "bg-pink-500" },
  { id: 10, level: 10, name: "Ambassador", amount: 5632, color: "bg-orange-500" },
];

const rankData = [
  { id: 1, rank: "Beginner", amount: 0.005684 },
  { id: 2, rank: "Bronze", amount: 0.015684 },
  { id: 3, rank: "Silver", amount: 0.035684 },
  { id: 4, rank: "Gold", amount: 0.075684 },
  { id: 5, rank: "Platinum", amount: 0.155684 },
  { id: 6, rank: "Diamond", amount: 0.315684 },
  { id: 7, rank: "Master", amount: 0.635684 },
  { id: 8, rank: "Grandmaster", amount: 1.275684 },
  { id: 9, rank: "Legend", amount: 2.555684 },
  { id: 10, rank: "Mythic", amount: 5.115684 },
];

const recentIncome = [
  {
    id: 1,
    from: "12378",
    amount: 0.024,
    rankLevel: "Ambassador",
    layer: "Layer 1",
    time: "20/01/2023",
  },
  {
    id: 2,
    from: "84913",
    amount: 0.048,
    rankLevel: "Pioneer",
    layer: "Layer 2",
    time: "20/01/2023",
  },
  {
    id: 3,
    from: "94208",
    amount: 0.012,
    rankLevel: "Achiever",
    layer: "Layer 3",
    time: "20/01/2023",
  },
  {
    id: 4,
    from: "88754",
    amount: 0.024,
    rankLevel: "Ambassador",
    layer: "Layer 4",
    time: "20/01/2023",
  },
];
