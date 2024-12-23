"use client";


import {  Coins, Droplet, Wallet } from 'lucide-react'
import { motion } from 'framer-motion'

export default function HowItWorks() {
  return (
    <section className="relative py-24">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start relative gap-16 md:gap-0">
          {/* Connecting Lines */}
          <div className="absolute hidden md:block top-[60px] left-0 right-0 h-[1px] bg-gray-200">
            <motion.div 
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="w-full h-full bg-gray-200"
            />
          </div>
          
          {/* Vertical line for mobile */}
          <div className="absolute md:hidden left-1/2 transform -translate-x-1/2 top-0 bottom-0 w-[1px] bg-gray-200">
            <motion.div 
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="w-full h-full bg-gray-200"
            />
          </div>
          
          {/* Stake */}
          <motion.div 
            initial={{ opacity: 0, y: -50, x: 0 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            transition={{ duration: 0.5 }}
            className="relative z-10 text-center flex-1"
          >
            <div className="inline-block bg-white p-4 rounded-full mb-8 border">
              <div className="w-16 h-16 rounded-full flex items-center justify-center">
                <Coins className="w-8 h-8" />
              </div>
            </div>
            <h2 className="text-6xl font-normal mb-4">Refer</h2>
            <p className="text-2xl text-gray-600">Refer Your Friends</p>
          </motion.div>
          
          {/* Receive */}
          <motion.div 
            initial={{ opacity: 0, y: -50, x: 0 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative z-10 text-center flex-1"
          >
            <div className="inline-block bg-white p-4 rounded-full mb-8 border">
              <div className="w-16 h-16 rounded-full flex items-center justify-center">
                <Droplet className="w-8 h-8 text-blue-400" />
              </div>
            </div>
            <h2 className="text-6xl font-normal mb-4">Earn</h2>
            <p className="text-2xl text-gray-600">Receive Rewards and Bonuses for Each Referral</p>
          </motion.div>
          
          {/* Use */}
          <motion.div 
            initial={{ opacity: 0, y: -50, x: 0 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
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
            <h2 className="text-6xl font-normal mb-4">Grow</h2>
            <div className="flex items-center justify-center gap-2">
              <p className="text-2xl text-gray-600">Boost Network</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

