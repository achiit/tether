"use client";
import { Button } from '@/components/ui/button'
import { ChevronDown, Coins, Droplet, Wallet } from 'lucide-react'
import { motion } from 'framer-motion'

export default function HowItWorks() {
  return (
    <section className="relative py-24">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-start relative">
          {/* Connecting Lines */}
          <div className="absolute top-[60px] left-0 right-0 h-[1px] bg-gray-200">
            <motion.div 
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="w-full h-full bg-gray-200"
            />
          </div>
          
          {/* Stake */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="relative z-10 text-center flex-1"
          >
            <div className="inline-block bg-white p-4 rounded-full mb-8 border">
              <div className="w-16 h-16 rounded-full flex items-center justify-center">
                <Coins className="w-8 h-8" />
              </div>
            </div>
            <h2 className="text-6xl font-normal mb-4">Stake</h2>
            <p className="text-2xl text-gray-600">ETH</p>
          </motion.div>
          
          {/* Receive */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative z-10 text-center flex-1"
          >
            <div className="inline-block bg-white p-4 rounded-full mb-8 border">
              <div className="w-16 h-16 rounded-full flex items-center justify-center">
                <Droplet className="w-8 h-8 text-blue-400" />
              </div>
            </div>
            <h2 className="text-6xl font-normal mb-4">Receive</h2>
            <p className="text-2xl text-gray-600">stETH and get rewards</p>
          </motion.div>
          
          {/* Use */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="relative z-10 text-center flex-1"
          >
            <div className="inline-block bg-white p-4 rounded-full mb-8">
              <div className="flex gap-2">
                <div className="w-16 h-16 rounded-full border flex items-center justify-center">
                  <Wallet className="w-8 h-8 text-purple-500" />
                </div>
                <div className="w-16 h-16 rounded-full border flex items-center justify-center">
                  <Wallet className="w-8 h-8 text-blue-500" />
                </div>
                <div className="w-16 h-16 rounded-full border flex items-center justify-center">
                  <Wallet className="w-8 h-8 text-red-500" />
                </div>
              </div>
            </div>
            <h2 className="text-6xl font-normal mb-4">Use</h2>
            <div className="flex items-center justify-center gap-2">
              <p className="text-2xl text-gray-600">stETH in DeFi</p>
              <Button variant="outline" className="rounded-full" size="sm">
                Explore
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}