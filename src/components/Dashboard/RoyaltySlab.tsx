import { useState } from "react";
import { Award, Medal, Trophy, ShieldCheck, Gem } from "lucide-react";

export function RoyaltySlab() {
  const slabs = [
    {
      name: "R1",
      icon: <Award className="h-6 w-6" />,
      gradient: "bg-gradient-to-br from-amber-700 via-amber-600  to-amber-700",
      textColor: "text-amber-50",
    },
    {
      name: "R2",
      icon: <Medal className="h-6 w-6" />,
      gradient: "bg-gradient-to-br from-slate-500 via-slate-400 to-slate-500",
      textColor: "text-slate-50",
    },
    {
      name: "R3",
      icon: <Trophy className="h-6 w-6" />,
      gradient:
        "bg-gradient-to-br from-yellow-500 via-yellow-400 to-yellow-500",
      textColor: "text-yellow-50",
    },
    {
      name: "R4",
      icon: <Gem className="h-6 w-6" />,
      gradient: "bg-gradient-to-br from-cyan-500 via-cyan-400 to-cyan-500",
      textColor: "text-cyan-50",
    },
  ];

  const [activeIndices, setActiveIndices] = useState([0]);

  const handleCardClick = (index: number) => {
    setActiveIndices((prev) => {
      if (prev.includes(index)) {
        return prev.filter((i) => i !== index);
      } else {
        return [...prev, index];
      }
    });
  };

  return (
    <div className="drop-shadow-lg p-4 pb-6 bg-white lg:rounded-lg">
      <div className="flex items-center space-x-2 text-lg font-bold mb-4">
        <ShieldCheck className="h-5 w-5" />
        <span>Royalty Slab</span>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {slabs.map((slab, index) => (
          <div
            key={index}
            className={`overflow-hidden transition-all duration-300 drop-shadow-lg px-4 py-2.5 cursor-pointer min-h-32 rounded-md 
                ${
                  activeIndices.includes(index) ? slab.gradient : "bg-gray-300"
                } 
                ${activeIndices.includes(index) ? "" : "opacity-50"}`}
            onClick={() => handleCardClick(index)}
          >
            <div
              className={`flex items-center justify-between ${
                activeIndices.includes(index) ? slab.textColor : "text-gray-500"
              }`}
            >
              <span className="text-lg font-semibold">{slab.name}</span>
              <div>{slab.icon}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
