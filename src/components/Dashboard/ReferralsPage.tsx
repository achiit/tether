"use client";

import React, { useEffect, useState } from "react";
import { useContract } from "@/lib/hooks/useContract";
import { LEVELS } from "@/lib/constants/levels";
import type { ReferralData } from "@/types/contract";
import { useWallet } from "@/lib/hooks/useWallet";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { FrontendIdDisplay } from "@/components/Dashboard/FrontendIdDisplay";
import { useFrontendId } from "@/contexts/FrontendIdContext";

const ReferralsPage = () => {
  const { getDirectReferralDataPaginated } = useContract();
  const { address } = useWallet();
  const [referralData, setReferralData] = useState<{
    referralData: ReferralData[];
    totalCount: number;
  }>({ referralData: [], totalCount: 0 });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const { batchFetchFrontendIds } = useFrontendId();

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

  useEffect(() => {
    if (referralData.referralData.length > 0) {
        batchFetchFrontendIds(referralData.referralData.map(ref => ref.userAddress));
    }
  }, [referralData.referralData, batchFetchFrontendIds]);

  return (
    <div className="p-4 rounded-lg drop-shadow-lg shadow bg-light-gradient dark:bg-dark-gradient w-full">
      <div className="overflow-y-auto text-nowrap pb-1">
        <table className="w-full">
          <thead className="overflow-y-auto drop-shadow-lg shadow-inner bg-white/40 dark:bg-white/5 backdrop-blur-lg">
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
              <tr key={`referral-${index + 1}`} className="hover:bg-white/20 dark:hover:bg-white/10">
                <td className="py-2 px-4">{index + 1}</td>
                <td className="py-2 px-4">
                  <FrontendIdDisplay address={referral.userAddress} isRegistered={referral.currentLevel > 0} />
                </td>
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
            className={`px-3 py-1 rounded drop-shadow shadow ${
              currentPage === 1
                ? 'bg-gray-300 text-gray-600 dark:bg-gray-700 dark:text-gray-500 cursor-not-allowed'
                : 'bg-gray-200 text-gray-500 dark:bg-gray-600 dark:text-gray-300 hover:bg-opacity-80 dark:hover:bg-opacity-80'
            }`}
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <div className="px-3 py-1 rounded bg-gradient-button text-white">
            {currentPage} of {Math.ceil(referralData.totalCount / itemsPerPage)}
          </div>
          <button
            type="button"
            onClick={() => setCurrentPage(prev =>
              Math.min(prev + 1, Math.ceil(referralData.totalCount / itemsPerPage))
            )}
            disabled={currentPage === Math.ceil(referralData.totalCount / itemsPerPage)}
            className={`px-3 py-1 rounded drop-shadow shadow ${
              currentPage === Math.ceil(referralData.totalCount / itemsPerPage)
                ? 'bg-gray-300 text-gray-600 dark:bg-gray-700 dark:text-gray-500 cursor-not-allowed'
                : 'bg-gray-200 text-gray-500 dark:bg-gray-600 dark:text-gray-300 hover:bg-opacity-80 dark:hover:bg-opacity-80'
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

export default ReferralsPage;
