"use client";

import { GradientCursor } from "@/components/ui/gradient-cursor";
import { FlipWords } from "@/components/ui/flip-words";
import Header from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import HowItWorks from "@/components/home/HowItWorks";
import Image from "next/image";
import { SplitViewSection } from "@/components/home/SplitViewSection";
import Container from "@/components/Container";

export default function Home() {
  return (
    <main className="relative min-h-screen bg-white text-black w-full">
      <GradientCursor />
      <Header />

      <section className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-screen w-full overflow-hidden">
        <div className="w-full h-full">
          <Image
            src="/images/bnb-bg.png"
            alt="tether Logo Animation"
            width={1000}
            height={1000}
            quality={100}
            priority
            className="object-cover relative z-10 w-full h-full opacity-10"
          />
        </div>
      </section>

      {/* Hero Section */}
      <section className="relative flex items-center pt-20 lg:pt-16 min-h-screen w-full overflow-hidden">
        <Container>
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-28 justify-center items-center h-full w-full">
            {/* Image container - centered on mobile */}
            <div className="relative">
              {/* Glow effect */}
              <div className="absolute inset-0 bg-[#f3ba2f] opacity-20 blur-3xl rounded-full animate-pulse" />

              {/* Saturn Rings */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-[120%] h-[120%] border border-[#f3ba2f]/20 rounded-full absolute animate-spin-slow" />
                <div className="w-[140%] h-[140%] border border-[#f3ba2f]/10 rounded-full absolute animate-spin-slower" />
                <div className="w-[160%] h-[160%] border border-[#f3ba2f]/5 rounded-full absolute animate-reverse-spin" />
              </div>

              {/* Main Image */}
              <div>
                <Image
                  src="/images/landingpage.png"
                  alt="tether Logo Animation"
                  width={400}
                  height={400}
                  quality={100}
                  priority
                  className="object-contain relative z-10 w-full"
                />
              </div>
            </div>

            {/* Text content */}
            <div className="space-y-3 lg:space-y-4 lg:mb-12">
              <div className="text-4xl lg:text-6xl">
                <div className="lg:text-7xl font-bold ">
                  <FlipWords
                    words={["Expand", "Excel"]}
                    className="!text-[#f3ba2f] !px-0"
                  />
                </div>

                <h1 className="font-semibold">
                  <span className="leading-tight">Earning with</span>
                  <br />
                  <span className="leading-tight font-extrabold">
                    Tether Ventures
                  </span>
                </h1>
              </div>
              <p className="lg:text-xl text-gray-600">
                Leverage Your Network for Unmatched Rewards and Opportunities.
              </p>
              <div className="flex gap-8">
                <div className="">
                  <span className="text-2xl lg:text-3xl font-semibold">
                    3.0%
                  </span>{" "}
                  <br />
                  <span>APR</span>
                </div>
                <div className="">
                  <span className="text-2xl lg:text-3xl font-semibold">
                    $32,227,733,224
                  </span>{" "}
                  <br />
                  <span>TVL</span>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Split View Section */}
      <SplitViewSection />

      {/* How it Works Section */}
      <HowItWorks />

      {/* Features Grid */}
      <section className="py-20 lg:py-24 bg-gray-50">
        <Container>
          <div className="grid lg:grid-cols-2 gap-4 lg:gap-8">
            {[
              {
                title: "Direct Referral Rewards",
                description:
                  "Earn $10 instantly for each direct referral who joins with an $11 deposit. Build your first line of network with 3 direct referrals.",
                stats: "$547,230 Total Rewards Paid",
                bg: "bg-[radial-gradient(129.96%_104.38%_at_43.18%_37.89%,_#d16fff33_0,_#fc6fff07_100%)]",
              },
              {
                title: "Network Growth Bonus",
                description:
                  "As your network grows deeper, earn additional rewards from indirect referrals. Expand your earning potential through multiple levels.",
                stats: "12,547 Active Networks",
                bg: "bg-[radial-gradient(122.64%_113.99%_at_50%_50%,_#5aff882b_0,_#5aff8800_100%)]",
              },
              {
                title: "Team Performance Rewards",
                description:
                  "Unlock special bonuses when your team reaches certain milestones. Higher network activity means greater rewards.",
                stats: "432 Top Performers",
                bg: "bg-[radial-gradient(165.59%_161.07%_at_52.72%_2.21%,_#0085ff29_0,_#0085ff07_100%)]",
              },
              {
                title: "Smart Contract Security",
                description:
                  "Your investments and rewards are secured by blockchain technology. Transparent, immutable, and automatically executed rewards system.",
                stats: "$2.3M Total TVL",
                bg: "bg-[radial-gradient(130%_120%_at_50%_50%,_#ff9b8f33_0,_#ff9b8f00_100%)]",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className={`rounded-3xl px-4 lg:px-8 py-8 lg:py-12 drop-shadow-lg border border-black border-opacity-10 ${feature.bg}`}
              >
                <h3 className="text-2xl lg:text-3xl font-bold mb-4 lg:mb-6">
                  {feature.title}
                </h3>
                <p className="lg:text-xl text-gray-600 mb-4 lg:mb-6">
                  {feature.description}
                </p>
                <div className="text-xl lg:text-2xl font-bold text-[#f3ba2f]">
                  {feature.stats}
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Footer */}
      <Footer />
    </main>
  );
}
