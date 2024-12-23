"use client";

import { Coins, Droplet, Wallet } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from "@/lib/utils"

export default function HowItWorks() {
  const steps = [
    {
      icon: <Coins className="w-8 h-8" />,
      title: "Refer",
      subtitle: "Refer Your Friends",
    },
    {
      icon: <Droplet className="w-8 h-8 text-blue-400" />,
      title: "Earn",
      subtitle: "Receive Rewards and Bonuses for Each Referral",
    },
    {
      icon: <Wallet className="w-8 h-8" />,
      title: "Grow",
      subtitle: "Boost Network",
    },
  ]

  return (
    <section className="relative py-24">
      <div className="container mx-auto px-4">
        {/* Desktop View */}
        <div className="hidden md:flex justify-between items-start relative gap-8 max-w-6xl mx-auto">
          {/* Horizontal connecting line for desktop */}
          <div className="absolute top-[60px] left-[15%] right-[15%] h-[1px] bg-gray-200">
            <motion.div 
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="w-full h-full bg-gray-200"
            />
          </div>

          {steps.map((step, index) => (
            <motion.div 
              key={step.title}
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="relative z-10 text-center flex-1 px-4"
            >
              <div className="inline-flex flex-col items-center">
                <div className="bg-white p-4 rounded-full mb-8 border">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center">
                    {step.icon}
                  </div>
                </div>
                <h2 className="text-6xl font-normal mb-4">{step.title}</h2>
                <p className="text-2xl text-gray-600">{step.subtitle}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Mobile View */}
        <div className="md:hidden relative">
          {/* Vertical connecting line for mobile */}
          <div className="absolute left-[50px] top-[50px] bottom-[50px] w-[1px] bg-gradient-to-b from-gray-200/0 via-gray-200 to-gray-200/0">
            <motion.div 
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="w-full h-full bg-gradient-to-b from-gray-200/0 via-gray-200 to-gray-200/0"
            />
          </div>

          <div className="space-y-24">
            {steps.map((step, index) => (
              <motion.div 
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="relative flex items-start gap-8"
              >
                <div className="relative z-10 shrink-0">
                  <div className="w-[100px] h-[100px] rounded-full bg-white border flex items-center justify-center">
                    {step.icon}
                  </div>
                </div>
                <div className="flex-1 pt-8">
                  <h2 className="text-6xl font-light mb-4">{step.title}</h2>
                  <p className="text-2xl text-gray-600">{step.subtitle}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

