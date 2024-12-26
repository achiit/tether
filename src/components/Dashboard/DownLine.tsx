"use client";

import { useState, useEffect } from 'react';
import { useWallet } from '@/lib/hooks/useWallet';
import { useContract } from '@/lib/hooks/useContract';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { truncateAddress } from '@/lib/utils/format';

const DownLine = () => {
  const { address } = useWallet();
  const { getDownlineByDepthPaginated } = useContract();
  const [selectedLevel, setSelectedLevel] = useState(1);
  const [downlineData, setDownlineData] = useState<{
    downlineAddresses: `0x${string}`[];
    sponsorAddresses: `0x${string}`[];
    totalCount: number;
  }>({ downlineAddresses: [], sponsorAddresses: [], totalCount: 0 });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchDownlineData = async () => {
      if (!address) return;
      
      try {
        const result = await getDownlineByDepthPaginated(
          address,
          selectedLevel,
          BigInt((currentPage - 1) * itemsPerPage),
          BigInt(itemsPerPage)
        );
        setDownlineData(result);
      } catch (error) {
        console.error('Error fetching downline data:', error);
      }
    };

    fetchDownlineData();
  }, [address, selectedLevel, currentPage, getDownlineByDepthPaginated]);

  return (
    <div>
      <div className="drop-shadow-lg p-4 bg-white lg:rounded-lg">
        <div className="flex justify-start gap-4 overflow-x-auto">
          {Array.from({ length: 10 }, (_, i) => i + 1).map((level) => (
            <button
              type="button"
              key={level}
              onClick={() => {
                setSelectedLevel(level);
                setCurrentPage(1);
              }}
              className={`py-2 px-4 rounded ${
                selectedLevel === level
                  ? "bg-yellow-700 text-white"
                  : "bg-yellow-500"
              }`}
            >
              {level}
            </button>
          ))}
        </div>
      </div>

      <section className="drop-shadow-lg p-4 bg-white lg:rounded-lg mt-4">
        <div className="overflow-y-auto text-nowrap">
          <table className="w-full mt-4 border-collapse">
            <thead>
              <tr>
                <th className="bg-yellow-200 py-2 px-4 text-left">S.No.</th>
                <th className="bg-yellow-200 py-2 px-4 text-left">Address</th>
                <th className="bg-yellow-200 py-2 px-4 text-left">Sponsor</th>
              </tr>
            </thead>
            <tbody>
              {downlineData.downlineAddresses.map((address, index) => (
                <tr key={address} className="hover:bg-gray-50 border-b">
                  <td className="py-2 px-4">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                  <td className="py-2 px-4">{truncateAddress(address)}</td>
                  <td className="py-2 px-4">{truncateAddress(downlineData.sponsorAddresses[index])}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {downlineData.downlineAddresses.length === 0 && (
            <p className="text-gray-500 text-center mt-4">
              No downline data available for this level.
            </p>
          )}

          <div className="flex justify-between items-center mt-4">
            <div className="text-sm text-gray-500">
              Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
              {Math.min(currentPage * itemsPerPage, downlineData.totalCount)} of{' '}
              {downlineData.totalCount} entries
            </div>
            <div className="flex gap-2">
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
              <div className="px-3 py-1 rounded bg-yellow-300">
                {currentPage} of {Math.ceil(downlineData.totalCount / itemsPerPage)}
              </div>
              <button
                type="button"
                onClick={() => setCurrentPage(prev =>
                  Math.min(prev + 1, Math.ceil(downlineData.totalCount / itemsPerPage))
                )}
                disabled={currentPage === Math.ceil(downlineData.totalCount / itemsPerPage)}
                className={`px-3 py-1 rounded ${
                  currentPage === Math.ceil(downlineData.totalCount / itemsPerPage)
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
    </div>
  );
};

export default DownLine;
