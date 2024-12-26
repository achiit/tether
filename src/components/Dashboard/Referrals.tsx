import React, { useEffect, useState, useCallback } from "react";
import { useAccount } from "wagmi";
import { getContracts } from "../../utils/contract";
import { LEVELS } from "../../utils/constant";
import { truncateAddress } from "../../utils/constant";

interface ReferralData {
  userAddress: string;
  activationTime: number;
  currentLevel: number;
  directReferrals: number;
}

const Referrals = () => {
  const { address } = useAccount();
  const [referralData, setReferralData] = useState<ReferralData[]>([]);

  const fetchReferralData = useCallback(async () => {
    if (!address) return;
    try {
      const { tetherWave } = getContracts();
      const data = await tetherWave.publicClient.readContract({
        ...tetherWave,
        functionName: 'getDirectReferralData',
        args: [address]
      }) as ReferralData[];

      setReferralData(data);
    } catch (error) {
      console.error('Error fetching referral data:', error);
    }
  }, [address]);

  useEffect(() => {
    fetchReferralData();
  }, [fetchReferralData]);

  return (
    <div className="drop-shadow-lg p-4 bg-white lg:rounded-lg">
      <div className="overflow-x-auto text-nowrap">
        <table className="w-full">
          <thead>
            <tr>
              <th className="bg-yellow-200 py-2 px-4 text-left">S.No</th>
              <th className="bg-yellow-200 py-2 px-4 text-left">Address</th>
              <th className="bg-yellow-200 py-2 px-4 text-left">
                Activation Date
              </th>
              <th className="bg-yellow-200 py-2 px-4 text-left">Level</th>
              <th className="bg-yellow-200 py-2 px-4 text-left">
                Direct Team
              </th>
            </tr>
          </thead>
          <tbody>
            {referralData.map((referral, index) => (
              <tr
                key={`referral-${index + 1}`}
                className="hover:bg-gray-50 border-b"
              >
                <td className="py-2 px-4">{index + 1}</td>
                <td className="py-2 px-4">{truncateAddress(referral.userAddress)}</td>
                <td className="py-2 px-4">
                  {new Date(referral.activationTime * 1000).toLocaleDateString()}
                </td>
                <td className="py-2 px-4">
                  {LEVELS[referral.currentLevel - 1]?.name || `Level ${referral.currentLevel}`}
                </td>
                <td className="py-2 px-4">
                  {referral.directReferrals}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {referralData.length === 0 && (
          <p className="text-gray-500 text-center mt-4">
            No referral data available.
          </p>
        )}
      </div>
    </div>
  );
};

export default Referrals;
