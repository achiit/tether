"use client";

import { useState, useEffect, useCallback } from 'react';
import { useWallet } from '@/lib/hooks/useWallet';
import { useContract } from '@/lib/hooks/useContract';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { FrontendIdDisplay } from '@/components/Dashboard/FrontendIdDisplay';
import { debounce } from 'lodash';

const CommunityPage = () => {
  const { address } = useWallet();
  const { getDownlineByDepthPaginated } = useContract();
  const [selectedLevel, setSelectedLevel] = useState(1);
  const { currentLevel } = useWallet();
  const [downlineData, setDownlineData] = useState<{
    downlineAddresses: `0x${string}`[];
    sponsorAddresses: `0x${string}`[];
    directReferralsCount: number[];
    currentLevels: number[];
    totalCount: number;
  }>({ downlineAddresses: [], sponsorAddresses: [], directReferralsCount: [], currentLevels: [], totalCount: 0 });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const debouncedFetch = useCallback(
    debounce(async (addr: string, level: number, page: number) => {
      if (!addr) return;
      try {
        const result = await getDownlineByDepthPaginated(
          addr as `0x${string}`,
          level,
          BigInt((page - 1) * 10),
          BigInt(10)
        );
        setDownlineData(result);
      } catch (error) {
        console.error('Error fetching downline data:', error);
      }
    }, 500),
    []
  );

  useEffect(() => {
    if (!address) return;
    debouncedFetch(address, selectedLevel, currentPage);
    return () => debouncedFetch.cancel();
  }, [address, selectedLevel, currentPage, debouncedFetch]);

  return (
    <div className='w-full'>
      <div className="p-4 rounded-lg drop-shadow-lg shadow bg-light-gradient dark:bg-dark-gradient w-full">
        <div className="flex justify-start gap-4 overflow-x-auto">
          {Array.from({ length: 10 }, (_, i) => i + 1).map((level) => (
            <button
              type="button"
              key={level}
              onClick={() => {
                setSelectedLevel(level);
                setCurrentPage(1);
              }}
              className={`py-2 px-6 rounded bg-gradient-button text-white ${
                selectedLevel === level
                  ? "opacity-100 "
                  : "opacity-50"
              }`}
            >
              {level}
            </button>
          ))}
        </div>
      </div>

      <section className="mt-4 p-4 rounded-lg drop-shadow-lg shadow bg-light-gradient dark:bg-dark-gradient">
        <div className="overflow-y-auto text-nowrap pb-1">
          <table className="w-full mt-4 border-collapse">
            <thead className='overflow-y-auto drop-shadow-lg shadow-inner bg-white/40 dark:bg-white/5 backdrop-blur-lg'>
              <tr>
                <th className="py-2 px-4 text-left">S.No.</th>
                <th className="py-2 px-4 text-left">Address</th>
                <th className="py-2 px-4 text-left">Sponsor</th>
                <th className="py-2 px-4 text-left">Direct Referral</th>
                <th className="py-2 px-4 text-left">Current Levels</th>
              </tr>
            </thead>
            <tbody>
              {downlineData.downlineAddresses.map((address, index) => (
                <tr key={`${index + 1}`} className='hover:bg-white/20 dark:hover:bg-white/10'>
                  <td className="py-2 px-8 text-left">{index + 1}</td>
                  <td className="py-2 px-4 text-left">
                    <FrontendIdDisplay address={address} isRegistered={currentLevel > 0} />
                  </td>
                  <td className="py-2 px-4 text-left">
                    <FrontendIdDisplay address={downlineData.sponsorAddresses[index]} isRegistered={true} />
                  </td>
                  <td className="py-2 px-16 text-left">
                    {downlineData.directReferralsCount[0]}
                  </td>
                  <td className="py-2 px-16 text-left">
                    {downlineData.currentLevels[0]}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {downlineData.downlineAddresses.length === 0 && (
            <p className="text-gray-500 text-center mt-4">
              No downline data available for this level.
            </p>
          )}

          <div className="flex justify-between items-center mt-4 gap-4 w-full">
            <div className="text-sm text-gray-500 w-full">
              Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
              {Math.min(currentPage * itemsPerPage, downlineData.totalCount)} of{' '}
              {downlineData.totalCount} entries
            </div>
            <div className="flex justify-end gap-1 lg:gap-2">
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
              <div className="px-3 py-1 rounded drop-shadow shadow bg-gradient-button text-white">
                {currentPage} of {Math.ceil(downlineData.totalCount / itemsPerPage)}
              </div>
              <button
                type="button"
                onClick={() => setCurrentPage(prev =>
                  Math.min(prev + 1, Math.ceil(downlineData.totalCount / itemsPerPage))
                )}
                disabled={currentPage === Math.ceil(downlineData.totalCount / itemsPerPage)}
                className={`px-3 py-1 rounded drop-shadow shadow ${
                  currentPage === Math.ceil(downlineData.totalCount / itemsPerPage)
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
    </div>
  );
};

export default CommunityPage;
