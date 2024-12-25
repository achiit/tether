"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';

import DashboardPage from "@/components/Dashboard/DashboardPage";
import SocialLinks from "@/components/Dashboard/SocialLinks";
import DownLine from "@/components/Dashboard/DownLine";
import Referrals from "@/components/Dashboard/Referrals";

const tabs = [
  { id: "dashboard", label: "Dashboard" },
  { id: "referrals", label: "Referrals" },
  { id: "downline", label: "Downline" },
];

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const { isConnected } = useAccount();
  const router = useRouter();

  useEffect(() => {
    if (!isConnected) {
      router.push('/');
    }
  }, [isConnected, router]);

  if (!isConnected) {
    return null;
  }

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardPage />;
      case "referrals":
        return <Referrals />;
      case "downline":
        return <DownLine />;
      default:
        return <div>Select a tab to view content.</div>;
    }
  };

  return (
    <div className="relative lg:h-screen flex flex-col bg-gray-100">
      <div className="relative flex flex-col lg:flex-row lg:h-screen lg:p-4 pe-0 lg:pe-0">
        <div className="w-full lg:w-1/5 drop-shadow-lg  bg-white lg:rounded-lg">
          <div className="border-b px-4 py-2.5">
            <BrandLogo />
          </div>

          <div className="absolute top-4 lg:top-auto right-0 lg:right-auto lg:bottom-8 px-4 flex justify-end items-end lg:w-full">
            <button className="p-2.5 lg:p-4 px-8 font-semibold cursor-pointer bg-gray-400 hover:bg-red-600 rounded-lg w-full transition-all duration-300">
              Logout
            </button>
          </div>
          <ul className="flex lg:flex-col gap-4 p-4 mt-2 lg:mt-4 overflow-y-auto">
            {tabs.map((tab) => (
              <li
                key={tab.id}
                className={`p-2.5 lg:p-4 px-8 font-semibold cursor-pointer hover:bg-[#f3ba2f] rounded-lg ${
                  activeTab === tab.id ? "bg-[#f3ba2f] " : "bg-[#f3ba2f]/50"
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </li>
            ))}
          </ul>
        </div>
        <div className="w-full lg:w-4/5 lg:px-4 flex flex-col gap-4 overflow-y-auto mt-4 lg:mt-0">
          <section className="hidden lg:flex justify-between items-center drop-shadow-lg lg:p-4 py-4 bg-white lg:rounded-lg">
            <div className="">
              <h1 className="text-2xl font-bold capitalize">{activeTab}</h1>
            </div>
            <div className="ps-4">
              <SocialLinks />
            </div>
          </section>
          <div className="py-4">{renderContent()}</div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

const BrandLogo = () => (
  <div className="w-12 h-12 rounded-full overflow-hidden bg-white flex items-center justify-center">
    <Image
      src="/images/logo.jpg"
      alt="Logo"
      width={400}
      height={400}
      quality={100}
      className="object-cover w-full h-full"
    />
  </div>
);
