import { GradientCursor } from "@/components/ui/gradient-cursor";
import { FlipWords } from "@/components/ui/flip-words";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import HowItWorks from "../components/how-it-works";
import Image from "next/image";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-white">
      <GradientCursor />
      <Header />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center px-4 md:px-6 pt-16">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative  aspect-square w-5/6">
              <Image
                src="/images/banner-img.webp"
                alt="tether Logo Animation"
                fill
                className="object-contain w-full"
              />
            </div>
            <div className="space-y-6">
              <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold">
                <FlipWords
                  words={["Decentralized", "Secure", "Efficient"]}
                  className="!text-[#f3ba2f]"
                />
                <br />
                staking with
                <br />
                stETH
              </h1>
              <p className="text-xl text-gray-600">
                Empowering and securing Ethereum since 2020
              </p>
              <div className="flex gap-4">
                <div className="text-2xl font-bold">3.0% APR</div>
                <div className="text-2xl font-bold">$32,227,733,224 TVL</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <HowItWorks />

      {/* Features Grid */}
      <section className="py-24 px-4 md:px-6 bg-gray-50">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                title: "Lending and Borrowing",
                description:
                  "Utilize your stETH - lend it out or borrow against it to access liquidity through third-parties when needed.",
                stats: "Over $12B in TVL",
                bg: "bg-[radial-gradient(129.96%_104.38%_at_43.18%_37.89%,_#d16fff33_0,_#fc6fff07_100%)]",
              },
              {
                title: "Diversified Rewards",
                description:
                  "Discover multimodal DeFi options for stETH with dynamic rebalancing and flexible operation.",
                stats: "Over $21M in TVL",
                bg: "bg-[radial-gradient(122.64%_113.99%_at_50%_50%,_#5aff882b_0,_#5aff8800_100%)]",
              },
              {
                title: "Restaking",
                description:
                  "Use stETH as collateral in restaking for third-party rewards.",
                stats: "Over $592M in TVL",
                bg: "bg-[radial-gradient(165.59%_161.07%_at_52.72%_2.21%,_#0085ff29_0,_#0085ff07_100%)]",
              },
              {
                title: "Leveraged staking",
                description:
                  "stETH can be used as collateral and leverage ETH using native rate feeds.",
                stats: "Coming soon",
                bg: "bg-[radial-gradient(130%_120%_at_50%_50%,_#ff9b8f33_0,_#ff9b8f00_100%)]",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className={`rounded-3xl px-8 py-12 drop-shadow-lg border border-black border-opacity-10 ${feature.bg}  `}
              >
                <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                <p className="text-gray-600 mb-4">{feature.description}</p>
                <div className="font-bold">{feature.stats}</div>
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
