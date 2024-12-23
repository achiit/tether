"use client"

import { useRef, useEffect } from 'react'

export function SplitViewSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const leftSideRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    const leftSide = leftSideRef.current

    if (!section || !leftSide) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (leftSide && window.innerWidth >= 1024) {
          leftSide.style.position = entry.isIntersecting ? 'sticky' : 'relative'
        }
      },
      { threshold: [0, 1] }
    )

    observer.observe(section)

    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} className="relative bg-white">
      <div className="container mx-auto">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-0">
          <div className="w-full">
            <div
              ref={leftSideRef}
              className="p-6 lg:p-12 lg:top-20 lg:min-h-[calc(100vh-5rem)]"
            >
              <h2 className="text-4xl lg:text-6xl font-bold mb-6 lg:mb-8">
                Why Choose<br />Tether Ventures?
              </h2>
              <p className="text-xl lg:text-2xl text-gray-600 mb-6 lg:mb-8">
                Join the fastest growing referral network and unlock unlimited earning potential.
              </p>
              <div className="space-y-4 lg:space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-[#f3ba2f] flex items-center justify-center">
                    <span className="text-xl lg:text-2xl font-bold">$</span>
                  </div>
                  <div className="text-lg lg:text-xl font-semibold">Low Entry Barrier - Start with just $11</div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-[#f3ba2f] flex items-center justify-center">
                    <span className="text-xl lg:text-2xl font-bold">3x</span>
                  </div>
                  <div className="text-lg lg:text-xl font-semibold">Triple Referral System</div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-[#f3ba2f] flex items-center justify-center">
                    <span className="text-xl lg:text-2xl font-bold">∞</span>
                  </div>
                  <div className="text-lg lg:text-xl font-semibold">Unlimited Earning Potential</div>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full lg:border-l border-gray-200">
            <div className="p-6 lg:p-12 space-y-16 lg:space-y-32">
              <div className="space-y-4 lg:space-y-6">
                <h3 className="text-3xl lg:text-4xl font-bold">Simple 3-Step Process</h3>
                <p className="text-lg lg:text-xl text-gray-600">Getting started is easier than ever</p>
                <div className="space-y-8 lg:space-y-12">
                  <div className="space-y-2 lg:space-y-4">
                    <div className="text-2xl lg:text-3xl font-semibold">1. Initial Deposit</div>
                    <p className="text-lg lg:text-xl text-gray-600">Start your journey with just $11. This one-time deposit activates your network potential.</p>
                  </div>
                  <div className="space-y-2 lg:space-y-4">
                    <div className="text-2xl lg:text-3xl font-semibold">2. Build Your Network</div>
                    <p className="text-lg lg:text-xl text-gray-600">Invite 3 direct referrals to join your network. Each successful referral earns you $10 instantly.</p>
                  </div>
                  <div className="space-y-2 lg:space-y-4">
                    <div className="text-2xl lg:text-3xl font-semibold">3. Expand & Earn</div>
                    <p className="text-lg lg:text-xl text-gray-600">As your network grows, unlock additional rewards and bonuses at each level.</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4 lg:space-y-6">
                <h3 className="text-3xl lg:text-4xl font-bold">Reward Structure</h3>
                <p className="text-lg lg:text-xl text-gray-600">Multiple ways to earn with our platform</p>
                <div className="space-y-8 lg:space-y-12">
                  {/* ... rest of the content ... */}
                </div>
              </div>

              <div className="space-y-4 lg:space-y-6">
                <h3 className="text-3xl lg:text-4xl font-bold">Security First</h3>
                <p className="text-lg lg:text-xl text-gray-600">Your investment is protected</p>
                <div className="space-y-8 lg:space-y-12">
                  {/* ... rest of the content ... */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
} 