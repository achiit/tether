import type { Metadata } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const glacier = localFont({
  src: "/fonts/Manrope-VariableFont_wght.ttf",
  weight: "300",
  variable: "--font-glacier",
  display: "swap",
});

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "tether - Liquid staking for digital assets",
  description: "Stake your digital assets and earn daily rewards",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${glacier.variable} font-glacier`}>
        {children}
      </body>
    </html>
  );
}
