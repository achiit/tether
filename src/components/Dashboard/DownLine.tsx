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
      <div 
       data-aos="fade-up"
      data-aos-duration={1000}
      data-aos-anchor-placement="top-bottom"
      className="drop-shadow-lg p-4 rounded-lg bg-[radial-gradient(130%_120%_at_50%_50%,_#c2e9fb33_0,_#ffffff_100%)]">
        <div className="flex justify-start gap-4 overflow-x-auto">
          {Array.from({ length: 10 }, (_, i) => i + 1).map((level) => (
            <button
              type="button"
              key={level}
              onClick={() => {
                setSelectedLevel(level);
                setCurrentPage(1);
              }}
              className={`py-2 px-4 rounded bg-gradient-to-br from-yellow-500 via-yellow-300 to-yellow-500 ${
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

      <section 
       data-aos="fade-up"
      data-aos-duration={1200}
      data-aos-anchor-placement="top-bottom"
      className="mt-4 drop-shadow-lg p-4 rounded-lg bg-[radial-gradient(130%_120%_at_50%_50%,_#b3e5fc33_0,_#ffffff_100%)]">
        <div className="overflow-y-auto text-nowrap">
          <table className="w-full mt-4 border-collapse">
            <thead className='overflow-y-auto drop-shadow-lg shadow-inner bg-white/40 backdrop-blur-lg'>
              <tr>
                <th className="py-2 px-4 text-left">S.No.</th>
                <th className="py-2 px-4 text-left">Address</th>
                <th className="py-2 px-4 text-left">Sponsor</th>
              </tr>
            </thead>
            <tbody>
              {downlineData.downlineAddresses.map((address, index) => (
                <tr key={address} className="border-b hover:bg-white/10 backdrop-blur-lg">
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
                className={`px-3 py-1 rounded ${
                  currentPage === 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-yellow-200 hover:bg-yellow-300'
                }`}
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <div className="px-3 py-1 rounded bg-gradient-to-br from-yellow-500 via-yellow-300 to-yellow-500">
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
