import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { ClientProviders } from "@/lib/ClientProviders";
import { ThemeProviders } from "@/lib/ThemeProviders";
import { FrontendIdProvider } from "@/contexts/FrontendIdContext";
import { Toaster } from 'react-hot-toast';

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
  title: {
    default: "Tether - Liquid staking for digital assets",
    template: "%s | Tether - Liquid staking for digital assets",
  },
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
          <FrontendIdProvider>
            <ThemeProviders>{children}</ThemeProviders>
          </FrontendIdProvider>
        </ClientProviders>
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
