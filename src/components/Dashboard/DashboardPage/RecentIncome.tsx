import { BadgeDollarSign, ChevronLeft, ChevronRight } from "lucide-react";
import React from "react";
import { FrontendIdDisplay } from "../FrontendIdDisplay";
import { RecentIncomeEvents } from "@/types/contract";
import { LEVELS } from "@/lib/constants/levels";
import { formatUnits } from "viem";

interface RecentIncomeProps {
  recentIncomes: RecentIncomeEvents;
  currentLevel: number;
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  itemsPerPage: number;
}

const RecentIncome = ({
  recentIncomes,
  currentLevel,
  currentPage,
  setCurrentPage,
  itemsPerPage,
}: RecentIncomeProps) => {
  return (
    <div className="mt-4 lg:mt-8 p-4 rounded-lg drop-shadow-lg shadow bg-light-gradient dark:bg-dark-gradient w-full">
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
              <tr
                key={`${index + 1}`}
                className="hover:bg-white/20 dark:hover:bg-white/10"
              >
                <td className="py-2 px-4">
                  <FrontendIdDisplay
                    address={address}
                    isRegistered={currentLevel > 0}
                  />
                </td>
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
                  {new Date(
                    recentIncomes.timestamps[index] * 1000
                  ).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-between items-center gap-4 mt-4 w-full">
          <div className="text-sm text-gray-500 w-full">
            Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
            {Math.min(currentPage * itemsPerPage, recentIncomes.totalCount)} of{" "}
            {recentIncomes.totalCount} entries
          </div>
          <div className="flex justify-end gap-1 lg:gap-2">
            <button
              type="button"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`px-3 py-2 rounded drop-shadow shadow ${
                currentPage === 1
                  ? "bg-gray-300 text-gray-600 dark:bg-gray-700 dark:text-gray-500 cursor-not-allowed"
                  : "bg-gray-200 text-gray-500 dark:bg-gray-600 dark:text-gray-300 hover:bg-opacity-80 dark:hover:bg-opacity-80"
              }`}
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <div className="px-3 py-1 rounded bg-gradient-button text-white">
              {currentPage} of{" "}
              {Math.ceil(recentIncomes.totalCount / itemsPerPage)}
            </div>
            <button
              type="button"
              onClick={() =>
                setCurrentPage((prev) =>
                  Math.min(
                    prev + 1,
                    Math.ceil(recentIncomes.totalCount / itemsPerPage)
                  )
                )
              }
              disabled={
                currentPage ===
                Math.ceil(recentIncomes.totalCount / itemsPerPage)
              }
              className={`px-3 py-1 rounded drop-shadow shadow ${
                currentPage ===
                Math.ceil(recentIncomes.totalCount / itemsPerPage)
                  ? "bg-gray-300 text-gray-600 dark:bg-gray-700 dark:text-gray-500 cursor-not-allowed"
                  : "bg-gray-200 text-gray-500 dark:bg-gray-600 dark:text-gray-300 hover:bg-opacity-80 dark:hover:bg-opacity-80"
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

export default RecentIncome;
