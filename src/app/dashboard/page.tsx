import React from "react";
import type { Metadata } from "next";
import DashboardPage from "@/components/Dashboard/DashboardPage/DashboardPage";

export const metadata: Metadata = {
  title: "Dashboard",
};

const Dashboard = () => {
  return <DashboardPage />;
};

export default Dashboard;
