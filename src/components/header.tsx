"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "../components/ui/button";

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm border-b border-gray-100">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-12">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/placeholder.svg"
                alt="tether Logo"
                width={32}
                height={32}
              />
              <span className="font-semibold text-xl">tether</span>
            </Link>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <Link href="#" className="text-gray-600 hover:text-gray-900">
              Staking
            </Link>
            <Link href="#" className="text-gray-600 hover:text-gray-900">
              Integrations
            </Link>
            <Link href="#" className="text-gray-600 hover:text-gray-900">
              Node Operators
            </Link>
            <Link href="#" className="text-gray-600 hover:text-gray-900">
              tether DAO
            </Link>
          </nav>
          <Button
            variant="default"
            className="bg-[#f3ba2f] text-black hover:bg-[#f3ba2f] h-10"
          >
            Connect Wallet
          </Button>
        </div>
      </div>
    </header>
  );
}
