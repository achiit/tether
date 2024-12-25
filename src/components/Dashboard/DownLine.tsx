"use client";

import { Loader } from "lucide-react";
import React, { useState, useEffect } from "react";

interface IncomeData {
  id: string;
  address: string;
  sponsorId: number;
}

const DownLine = () => {
  const [selectedNumber, setSelectedNumber] = useState<number | null>(1); // Set the first button as default
  const [isLoading, setIsLoading] = useState<boolean>(true); // Add loading state

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer); // Cleanup timer on unmount
  }, []);

  return (
    <div>
      <div className="drop-shadow-lg p-4 bg-white lg:rounded-lg">
        <div className="flex justify-start gap-4 overflow-x-auto">
          {Object.keys(recentIncome).map((number) => (
            <button
              key={number}
              onClick={() => setSelectedNumber(Number(number))}
              className={`py-2 px-4 rounded ${
                selectedNumber === Number(number)
                  ? "bg-yellow-700 text-white"
                  : "bg-yellow-500"
              }`}
            >
              {number}
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
                <th className="bg-yellow-200 py-2 px-4 text-left">ID</th>
                <th className="bg-yellow-200 py-2 px-4 text-left">Address</th>
                <th className="bg-yellow-200 py-2 px-4 text-left">
                  Sponsor ID
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr className="w-full">
                  <td colSpan={4} className="text-center w-full py-4">
                    <span className="flex justify-center items-center">
                      <Loader className="animate-spin mr-2" />
                      Loading data...
                    </span>
                  </td>
                </tr>
              ) : (
                selectedNumber &&
                recentIncome[selectedNumber]?.map((item, index) => (
                  <tr key={item.id} className="hover:bg-gray-50 border-b">
                    <td className="py-2 px-4">{index + 1}</td>
                    <td className="py-2 px-4">{item.id}</td>
                    <td className="py-2 px-4">{item.address}</td>
                    <td className="py-2 px-4">{item.sponsorId.toFixed(3)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          {!selectedNumber && (
            <p className="text-gray-500 text-center mt-4">
              Select a number to view data.
            </p>
          )}
        </div>
      </section>
    </div>
  );
};

export default DownLine;

const recentIncome: Record<number, IncomeData[]> = {
  1: [
    { id: "1", address: "12378", sponsorId: 0.024 },
    { id: "2", address: "12479", sponsorId: 0.035 },
  ],
  2: [
    { id: "3", address: "45689", sponsorId: 0.032 },
    { id: "4", address: "45890", sponsorId: 0.028 },
  ],
  3: [
    { id: "5", address: "78945", sponsorId: 0.015 },
    { id: "6", address: "78456", sponsorId: 0.02 },
  ],
  4: [
    { id: "7", address: "16234", sponsorId: 0.018 },
    { id: "8", address: "16789", sponsorId: 0.045 },
  ],
  5: [
    { id: "9", address: "47589", sponsorId: 0.05 },
    { id: "10", address: "47890", sponsorId: 0.038 },
  ],
  6: [
    { id: "11", address: "99871", sponsorId: 0.027 },
    { id: "12", address: "99672", sponsorId: 0.03 },
  ],
  7: [
    { id: "13", address: "23456", sponsorId: 0.033 },
    { id: "14", address: "23987", sponsorId: 0.042 },
  ],
};
