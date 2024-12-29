"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useAccount, useDisconnect } from "wagmi";
import { useRouter } from "next/navigation";

import DashboardPage from "@/components/Dashboard/DashboardPage";
import SocialLinks from "@/components/Dashboard/SocialLinks";
import DownLine from "@/components/Dashboard/DownLine";
import Referrals from "@/components/Dashboard/Referrals";
import Container from "@/components/Container";

const tabs = [
  { id: "dashboard", label: "Dashboard" },
  { id: "referrals", label: "Referrals" },
  { id: "downline", label: "Downline" },
];

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const { isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const router = useRouter();

  useEffect(() => {
    if (!isConnected) {
      router.push('/');
    }
  }, [isConnected, router]);

  if (!isConnected) {
    return null;
  }

  const handleLogout = () => {
    disconnect();
    router.push('/');
  };

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
    <div className="relative flex flex-col bg-gray-100">
      <div className="fixed top-0  -left-8 lg:-left-16 w-80 h-96 lg:w-[550px] lg:h-[450px] rounded-r-full blur-3xl opacity-40 bg-gradient-to-r from-[#f3ba2f] to-[#f3ba2f]/20 " />
      <div className="fixed -bottom-8 -right-8 lg:-right-16 w-80 h-96 lg:w-[555px] lg:h-[450px] rounded-l-full blur-3xl opacity-40 bg-gradient-to-r from-[#f3ba2f] to-[#f3ba2f]/20" />
      {/* <div className="fixed inset-0 overflow-hidden opacity-20">
        <Image
          src="/images/background/background-1.jpg"
          alt="background"  
          width={1000}
          height={1000}
          quality={100}
          className="object-cover w-full h-full"
        />
      </div> */}
      <div className="relative flex flex-col min-h-screen">
        <section className="fixed top-0 w-full drop-shadow-2xl shadow-sm bg-white/20 backdrop-blur-md z-50">
          <Container>
            <div className="flex justify-between items-center w-full">
              <div className="flex flex-col lg:flex-row  justify-center items-center gap-4 lg:gap-8 w-full">
                <div className="flex w-full lg:w-auto pt-5 lg:pt-0">
                  <BrandLogo />
                </div>
                <div className="flex gap-4 overflow-y-auto w-full pb-4 lg:py-4">
                  {tabs.map((tab) => (
                    <button
                      type="button"
                      key={tab.id}
                      className={`p-2.5 px-4 lg:!px-8 font-semibold drop-shadow shadow cursor-pointer rounded-md  hover:bg-[#F3BA2F] transition-all duration-300 ${
                        activeTab === tab.id
                          ? "bg-[#F3BA2F]"
                          : "bg-[#F3BA2F]/40"
                      }`}
                      onClick={() => setActiveTab(tab.id)}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="absolute lg:relative right-4 lg:right-auto top-4 lg:top-auto flex justify-center items-center gap-4">
                <div className="hidden lg:block">
                  <SocialLinks />
                </div>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="p-2.5 px-4 lg:px-8 font-semibold cursor-pointer drop-shadow shadow bg-white hover:bg-red-600 hover:text-white rounded-lg w-full transition-all duration-300"
                >
                  Logout
                </button>
              </div>
            </div>
          </Container>
        </section>

        <section className="w-full flex flex-col gap-4 pt-32 lg:pt-24">
          <Container>
            <div className="flex flex-col w-full">
              <div className="hidden justify-between items-center drop-shadow-lg lg:p-4 py-4">
                <div className="">
                  <h1 className="text-2xl font-bold capitalize">{activeTab}</h1>
                </div>
                <div className="ps-4">
                  <SocialLinks />
                </div>
              </div>
              <div className="py-4">{renderContent()}</div>
            </div>
          </Container>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;

const BrandLogo = () => (
  <div className="flex items-center justify-center gap-1 overflow-hidden">
    <Image
      src="/images/logo.jpg"
      alt="Logo"
      width={400}
      height={400}
      quality={100}
      className="object-cover w-16 h-10 rounded-md"
    />
  </div>
);
