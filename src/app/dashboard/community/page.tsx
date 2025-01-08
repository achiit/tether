import React from "react";
import type { Metadata } from "next";
import CommunityPage from "@/components/Dashboard/CommunityPage";

export const metadata: Metadata = {
  title: "Community",
};

const Community = () => {
  return <CommunityPage />;
};

export default Community;
