import React from "react";
import type { Metadata } from "next";
import GeneologyPage from "@/components/Dashboard/GeneologyPage";

export const metadata: Metadata = {
  title: "Geneology",
};

const Geneology = () => {
  return <GeneologyPage />;
};

export default Geneology;
