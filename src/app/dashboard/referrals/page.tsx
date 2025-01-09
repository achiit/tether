import React from "react";
import type { Metadata } from "next";
import ReferralsPage from "@/components/Dashboard/ReferralsPage";

export const metadata: Metadata = {
  title: "Referrals",
};

const Referrals = () => {
  return <ReferralsPage />;
};

export default Referrals;
