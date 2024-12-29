import React, { useEffect, useState } from "react";
import { useContract } from "@/lib/hooks/useContract";
import { LEVELS } from "@/lib/constants/levels";
import { truncateAddress } from "@/lib/utils/format";
import type { ReferralData } from "@/types/contract";
import { useWallet } from "@/lib/hooks/useWallet";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Referrals = () => {
  const { getDirectReferralDataPaginated } = useContract();
  const { address } = useWallet();
  const [referralData, setReferralData] = useState<{
    referralData: ReferralData[];
    totalCount: number;
  }>({ referralData: [], totalCount: 0 });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchReferralData = async () => {
        if (!address) return;
        
        try {
            const result = await getDirectReferralDataPaginated(
                address,
                BigInt((currentPage - 1) * itemsPerPage),
                BigInt(itemsPerPage)
            );
            setReferralData(result);
        } catch (error) {
            console.error('Error fetching referral data:', error);
        }
    };

    fetchReferralData();
}, [address, currentPage, getDirectReferralDataPaginated]);

  return (
    <div className="drop-shadow-lg p-4 rounded-lg bg-[radial-gradient(130%_120%_at_50%_50%,_#b3e5fc33_0,_#ffffff_100%)]">
      <div className="overflow-y-auto text-nowrap">
        <table className="w-full">
          <thead className="overflow-y-auto drop-shadow-lg shadow-inner bg-white/40 backdrop-blur-lg">
            <tr>
              <th className="py-2 px-4 text-left">S.No</th>
              <th className="py-2 px-4 text-left">Address</th>
              <th className="py-2 px-4 text-left">
                Activation Date
              </th>
              <th className="py-2 px-4 text-left">Level</th>
              <th className="py-2 px-4 text-left">
                Direct Team
              </th>
            </tr>
          </thead>
          <tbody>
            {referralData.referralData.map((referral, index) => (
              <tr
                key={`referral-${index + 1}`}
                className="border-b hover:bg-white/10  backdrop-blur-lg"
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
        {referralData.referralData.length === 0 && (
          <p className="text-gray-500 text-center mt-4">
            No referral data available.
          </p>
        )}
      <div className="flex justify-between items-center gap-8 mt-4 w-full text-nowrap">
        <div className="text-sm text-gray-500">
          Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
          {Math.min(currentPage * itemsPerPage, referralData.totalCount)} of{' '}
          {referralData.totalCount} entries
        </div>
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={`px-3 py-1 rounded ${
              currentPage === 1
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-yellow-200 hover:bg-yellow-300'
            }`}
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <div className="px-3 py-1 rounded bg-gradient-to-br from-yellow-500 via-yellow-300 to-yellow-500">
            {currentPage} of {Math.ceil(referralData.totalCount / itemsPerPage)}
          </div>
          <button
            type="button"
            onClick={() => setCurrentPage(prev =>
              Math.min(prev + 1, Math.ceil(referralData.totalCount / itemsPerPage))
            )}
            disabled={currentPage === Math.ceil(referralData.totalCount / itemsPerPage)}
            className={`px-3 py-1 rounded ${
              currentPage === Math.ceil(referralData.totalCount / itemsPerPage)
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-yellow-200 hover:bg-yellow-300'
            }`}
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
      </div>
    </div>
  );
};

export default Referrals;
