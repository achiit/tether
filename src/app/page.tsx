import { GradientCursor } from "@/components/ui/gradient-cursor"
import { FlipWords } from "@/components/ui/flip-words"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import HowItWorks from "../components/how-it-works"
import Image from "next/image"

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-white">
      <GradientCursor />
      <Header />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center px-4 md:px-6 pt-16">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative aspect-square">
              <Image
                src="/placeholder.svg"
                alt="tether Logo Animation"
                fill
                className="object-contain"
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
                description: "Utilize your stETH - lend it out or borrow against it to access liquidity through third-parties when needed.",
                stats: "Over $12B in TVL",
                bg: "bg-green-50"
              },
              {
                title: "Diversified Rewards",
                description: "Discover multimodal DeFi options for stETH with dynamic rebalancing and flexible operation.",
                stats: "Over $21M in TVL",
                bg: "bg-pink-50"
              },
              {
                title: "Restaking",
                description: "Use stETH as collateral in restaking for third-party rewards.",
                stats: "Over $592M in TVL",
                bg: "bg-blue-50"
              },
              {
                title: "Leveraged staking",
                description: "stETH can be used as collateral and leverage ETH using native rate feeds.",
                stats: "Coming soon",
                bg: "bg-white"
              }
            ].map((feature) => (
              <div key={feature.title} className={`${feature.bg} rounded-3xl p-8`}>
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
  )
}

