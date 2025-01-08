import { LEVELS } from "@/lib/constants/levels";
import type { RankIncomeProps } from "@/types/contract";
import { Landmark } from "lucide-react";
import { memo, useMemo } from "react";
import { formatUnits } from "viem"; 

const RankCard = memo(({ 
  title, 
  amount 
}: { 
  title: string; 
  amount: string;
}) => (
  <div className="rounded-lg px-4 py-3 drop-shadow-md shadow-inner bg-white/40 dark:bg-white/5 backdrop-blur-md">
    <div className="flex justify-between items-center">
      <span className="font-semibold">{title}</span>
      <span className="bg-gradient-button text-white overflow-hidden px-2 py-1 rounded font-medium">
        {amount} USDT
      </span>
    </div>
  </div>
));

RankCard.displayName = 'RankCard';

const RankIncome = memo(({ userStats, levelIncomes }: RankIncomeProps) => {
  const directCommission = useMemo(() => 
    userStats?.directCommissionEarned 
      ? formatUnits(userStats.directCommissionEarned, 18) 
      : "0",
    [userStats?.directCommissionEarned]
  );

  const formattedLevelIncomes = useMemo(() => 
    LEVELS.slice(1).map((level, index) => ({
      id: level.id,
      name: level.name,
      amount: levelIncomes[index + 1] 
        ? formatUnits(levelIncomes[index + 1], 18) 
        : "0"
    })),
    [levelIncomes]
  );

  return (
    <div className="mt-4 lg:mt-8 w-full">
      <div className="rounded-lg drop-shadow-lg shadow bg-light-gradient dark:bg-dark-gradient">
        <div className="flex items-center space-x-2 text-lg font-bold px-4 lg:px-6 pt-4 pb-2 lg:pt-6">
          <Landmark className="h-5 w-5" />
          <span>Rank Income</span>
        </div>
        <div className="p-4 lg:px-6 lg:pb-6 grid gap-4 md:grid-cols-2 h-80 lg:h-auto overflow-auto">
          <RankCard title={LEVELS[0].name} amount={directCommission} />
          {formattedLevelIncomes.map(level => (
            <RankCard
              key={level.id}
              title={level.name}
              amount={level.amount}
            />
          ))}
        </div>
      </div>
    </div>
  );
});

RankIncome.displayName = 'RankIncome';

export default RankIncome;
