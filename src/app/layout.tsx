import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { ClientProviders } from "@/lib/ClientProviders";
import { ThemeProviders } from "@/lib/ThemeProviders";

const glacier = localFont({
  src: "/fonts/Manrope-VariableFont_wght.ttf",
  weight: "300",
  variable: "--font-glacier",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-manrope",
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
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.className} ${glacier.variable} ${manrope.variable} font-manrope`}
        suppressHydrationWarning
      >
        <ClientProviders>
          <ThemeProviders>{children}</ThemeProviders>
        </ClientProviders>
      </body>
    </html>
  );
}
