import { GradientCursor } from "@/components/ui/gradient-cursor";
import { FlipWords } from "@/components/ui/flip-words";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import HowItWorks from "../components/how-it-works";
import Image from "next/image";
import { SplitViewSection } from "@/components/split-view-section";

export default function Home() {
  return (
    <main className="relative min-h-screen bg-white">
      <GradientCursor />
      <Header />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center px-4 md:px-6 pt-32">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Image container - centered on mobile */}
            <div className="relative mx-auto lg:mx-0 w-[280px] md:w-[400px] lg:w-5/6 aspect-square">
              {/* Glow effect */}
              <div className="absolute inset-0 bg-[#f3ba2f] opacity-20 blur-3xl rounded-full animate-pulse" />
              
              {/* Saturn Rings */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-[120%] h-[120%] border border-[#f3ba2f]/20 rounded-full absolute animate-spin-slow" />
                <div className="w-[140%] h-[140%] border border-[#f3ba2f]/10 rounded-full absolute animate-spin-slower" />
                <div className="w-[160%] h-[160%] border border-[#f3ba2f]/5 rounded-full absolute animate-reverse-spin" />
              </div>
              
              {/* Main Image */}
              <Image
                src="/images/landingpage.png"
                alt="tether Logo Animation"
                fill
                className="object-contain relative z-10"
              />
            </div>

            {/* Text content */}
            <div className="space-y-12">
              <h1 className="text-5xl md:text-6xl lg:text-6xl font-bold space-y-2">
                <div className="h-[49px] md:h-[80px] lg:h-[50px]">
                  <FlipWords
                    words={[ "Expand", "Excel"]}
                    className="!text-[#f3ba2f]"
                  />
                </div>
                
                <div className="mt-4">
                  earning with
                </div>
                <div className="mt-4">
                  Tether Ventures
                </div>
              </h1>
              <p className="text-lg md:text-xl text-gray-600">
                Leverage Your Network for Unmatched Rewards and Opportunities.
              </p>
              <div className="flex gap-4">
                <div className="text-2xl font-bold">3.0% APR</div>
                <div className="text-2xl font-bold">$32,227,733,224 TVL</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Split View Section */}
      <div className="overflow-hidden">
        <div className="overflow-visible">
          <SplitViewSection />
        </div>
      </div>

      {/* How it Works Section */}
      <HowItWorks />

      {/* Features Grid */}
      <section className="py-24 px-4 md:px-6 bg-gray-50">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
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
                className={`rounded-3xl px-8 py-12 drop-shadow-lg border border-black border-opacity-10 ${feature.bg}`}
              >
                <h3 className="text-3xl font-bold mb-6">{feature.title}</h3>
                <p className="text-xl text-gray-600 mb-6">{feature.description}</p>
                <div className="text-2xl font-bold text-[#f3ba2f]">{feature.stats}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </main>
  );
}

