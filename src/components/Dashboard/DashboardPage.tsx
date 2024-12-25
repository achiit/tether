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
import { useState } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';

const DashboardPage = () => {
  const { address } = useAccount();
  const [isCopied, setIsCopied] = useState(false);
  const [referrerAddress, setReferrerAddress] = useState('');
  const [isRegistered, setIsRegistered] = useState(false);

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

  const handleRegister = async () => {
    if (!signer || !referrerAddress) return;

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      setSigner(signer);

      const { tetherWave, usdt } = getContracts(signer);

      // First approve USDT spending
      const approveTx = await usdt.approve(
        tetherWave.address,
        ethers.utils.parseUnits('11', 18)
      );
      await approveTx.wait();

      // Then register
      const tx = await tetherWave.register(referrerAddress);
      await tx.wait();

      // Update registration status and level
      setIsRegistered(true);
      setCurrentLevel(1);
      alert('Registration successful!');

      // Refresh user stats
      await checkRegistrationStatus();
    } catch (error) {
      console.error('Registration error:', error);
      alert('Registration failed!');
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
                    console.log("account?.displayBalance", account?.displayBalance);

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
                              ? ` (${account.displayBalance})`
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
            disabled={isRegistered}
            className={`bg-green-500 text-white px-6 py-2 rounded-lg 
                  ${isRegistered ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-600'}`}
          >
            {isRegistered ? 'Already Registered' : 'Register'}
          </button>
        </div>
        <div className="drop-shadow-lg p-4 bg-white lg:rounded-lg ">
          <div className="flex items-center space-x-2 text-lg font-bold">
            <Boxes className="h-5 w-5" />
            <span>Packages</span>
          </div>
          <div className="flex justify-start items-center flex-wrap gap-4 lg:gap-8 mt-4">
            {levels.map((item, index) => (
              <div
                key={index}
                className="flex flex-col justify-center items-center bg-yellow-200 p-1 cursor-pointer rounded-full w-24 h-24 "
              >
                <p className="text-sm font-bold">{item.level}</p>
                <p className="text-xs font-bold">{item.currency}</p>
                <p className="text-sm font-bold">{item.amount}USD</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="flex flex-col lg:flex-row justify-between items-start gap-4  w-full mt-4">
        <div className="drop-shadow-lg p-4 bg-white lg:rounded-lg w-full">
          <p className="text-lg font-bold">Total Income</p>
          <p>0.005684 BNB</p>
        </div>
        <div className="drop-shadow-lg p-4 bg-white lg:rounded-lg w-full">
          <p className="text-lg font-bold">Referral Income</p>
          <p>0.005684 BNB</p>
        </div>
        <div className="drop-shadow-lg p-4 bg-white lg:rounded-lg w-full">
          <p className="text-lg font-bold">Level Income</p>
          <p>0.005684 BNB</p>
        </div>
        <div className="drop-shadow-lg p-4 bg-white lg:rounded-lg w-full">
          <p className="text-lg font-bold">Direct Referral</p>
          <p>8</p>
        </div>
      </section>

      <section className="mt-4">
        <div className="drop-shadow-lg p-4 bg-white lg:rounded-lg ">
          <div className="flex items-center space-x-2 text-lg font-bold">
            <Boxes className="h-5 w-5" />
            <span>Rank Income</span>
          </div>
          <div className="grid gap-4 md:grid-cols-2 mt-4">
            {rankData.map((item) => (
              <div
                key={item.rank}
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
              {recentIncome.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50 border-b">
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
        <a href="#" className="text-yellow-700 hover:underline">
          (0xc0d396da...d212340)
        </a>
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

const levels = [
  { level: "Level 1", currency: "BNB", amount: 11 },
  { level: "Level 2", currency: "BNB", amount: 11 },
  { level: "Level 3", currency: "BNB", amount: 11 },
  { level: "Level 1", currency: "BNB", amount: 11 },
  { level: "Level 2", currency: "BNB", amount: 11 },
  { level: "Level 3", currency: "BNB", amount: 11 },
  { level: "Level 1", currency: "BNB", amount: 11 },
  { level: "Level 2", currency: "BNB", amount: 11 },
  { level: "Level 3", currency: "BNB", amount: 11 },
];

const rankData = [
  { rank: "Beginner", amount: 0.005684 },
  { rank: "Bronze", amount: 0.015684 },
  { rank: "Silver", amount: 0.035684 },
  { rank: "Gold", amount: 0.075684 },
  { rank: "Platinum", amount: 0.155684 },
  { rank: "Diamond", amount: 0.315684 },
  { rank: "Master", amount: 0.635684 },
  { rank: "Grandmaster", amount: 1.275684 },
  { rank: "Legend", amount: 2.555684 },
  { rank: "Mythic", amount: 5.115684 },
];

const recentIncome = [
  {
    from: "12378",
    amount: 0.024,
    rankLevel: "Ambassador",
    layer: "Layer 1",
    time: "20/01/2023",
  },
  {
    from: "84913",
    amount: 0.048,
    rankLevel: "Pioneer",
    layer: "Layer 2",
    time: "20/01/2023",
  },
  {
    from: "94208",
    amount: 0.012,
    rankLevel: "Achiever",
    layer: "Layer 3",
    time: "20/01/2023",
  },
  {
    from: "88754",
    amount: 0.024,
    rankLevel: "Ambassador",
    layer: "Layer 4",
    time: "20/01/2023",
  },
];
