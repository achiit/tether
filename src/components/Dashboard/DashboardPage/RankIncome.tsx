import { LEVELS } from "@/lib/constants/levels";
import { UserStats } from "@/types/contract";
import { Landmark } from "lucide-react";
import React from "react";
import { formatUnits } from "viem";

interface RankIncomeProps {
  userStats: UserStats | null;
  levelIncomes: bigint[];
}

const RankIncome = ({ userStats, levelIncomes }: RankIncomeProps) => {
  return (
    <div className="mt-4 lg:mt-8 w-full">
      <div className="rounded-lg drop-shadow-lg shadow bg-light-gradient dark:bg-dark-gradient">
        <div className="flex items-center space-x-2 text-lg font-bold px-4 lg:px-6 pt-4 pb-2 lg:pt-6">
          <Landmark className="h-5 w-5" />
          <span>Rank Income</span>
        </div>
        <div className="p-4 lg:px-6 lg:pb-6 grid gap-4 md:grid-cols-2 h-80 lg:h-auto overflow-auto">
          <div className="rounded-lg px-4 py-3 drop-shadow-md shadow-inner bg-white/40 dark:bg-white/5 backdrop-blur-md">
            <div className="flex justify-between items-center">
              <span className="font-semibold">{LEVELS[0].name}</span>
              <span className="bg-gradient-button text-white overflow-hidden px-2 py-1 rounded font-medium">
                {userStats?.directCommissionEarned
                  ? formatUnits(userStats.directCommissionEarned, 18)
                  : "0"}{" "}
                USDT
              </span>
            </div>
          </div>
          {LEVELS.slice(1).map((level, index) => (
            <div
              key={level.id}
              className="rounded-lg px-4 py-3 drop-shadow-md shadow-inner bg-white/40 dark:bg-white/5 backdrop-blur-md"
            >
              <div className="flex justify-between items-center">
                <span className="font-semibold">{level.name}</span>
                <span className="bg-gradient-button text-white  overflow-hidden px-2 py-1 rounded font-medium">
                  {levelIncomes[index + 1]
                    ? formatUnits(levelIncomes[index + 1], 18)
                    : "0"}{" "}
                  USDT
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RankIncome;
