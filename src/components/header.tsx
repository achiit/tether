"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

import { Button } from "../components/ui/button";
import Container from "./Container";
import { AlignJustify, X } from "lucide-react";
import { WalletConnect } from './WalletConnect';

const navItems = [
  { name: "Staking", href: "" },
  { name: "Integrations", href: "" },
  { name: "Node Operators", href: "" },
  { name: "tether DAO", href: "" },
];

const Header: React.FC = () => {
  const pathname = usePathname();

  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  const NavLinks = ({ className }: { className?: string }) => (
    <nav
      className={`flex flex-col lg:flex-row lg:items-center gap-1 lg:gap-3 lg:text-sm ${className}`}
    >
      {navItems.map((item) => (
        <Link
          key={item.name}
          href={item.href}
          className={`font-medium px-4 py-0.5 transition-all duration-300  hover:text-gray-900 text-lg ${
            pathname === item.href ? "text-gray-900" : "text-gray-600"
          }`}
          onClick={() => isMobileMenuOpen && setMobileMenuOpen(false)}
        >
          {item.name}
        </Link>
      ))}
    </nav>
  );

  return (
    <header
      className={
        "shadow-sm fixed top-0 left-0 w-full z-50 bg-white/80  backdrop-blur-md transition-all duration-300"
      }
    >
      <Container className="py-4">
        <div className="flex justify-between items-center gap-8 w-full">
          <section>
            <BrandLogo />
          </section>
          <section className="hidden lg:block">
            <NavLinks />
          </section>
          <section>
            <button
              type="button"
              className="lg:hidden text-3xl"
              onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={28} /> : <AlignJustify size={28} />}
            </button>

            {/* <Link href="/dashboard" className="hidden lg:block">
              <Button
                variant="default"
                className="bg-[#f3ba2f] text-black hover:bg-[#f3ba2f]/90 h-10 font-semibold transition-all duration-300"
              >
                Launch App
              </Button>
            </Link> */}

            <div className="hidden lg:block">
              <WalletConnect />
            </div>
          </section>
        </div>
      </Container>

      <div
        className={`fixed inset-0 flex lg:hidden bg-white  backdrop-blur w-full h-screen z-[100] transform transition-all duration-500 ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="relative w-full h-full p-6 bg-white backdrop-blur text-black">
          <div className="px-4">
            <BrandLogo />
          </div>
          <div className="mt-8">
            <NavLinks />
          </div>

          {/* <Link href="/dashboard" className="hidden lg:block">
              <Button
                variant="default"
                className="bg-[#f3ba2f] text-black hover:bg-[#f3ba2f]/90 h-10 font-semibold transition-all duration-300"
              >
                Launch App
              </Button>
            </Link> */}

          <div className="mt-4">
            <WalletConnect />
          </div>

          <button
            type="button"
            className="absolute top-6 right-6 text-3xl"
            onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
          >
            <X size={28} />
          </button>
        </div>

        <div 
          className="flex-1" 
          onClick={() => setMobileMenuOpen(false)}
          onKeyDown={(e) => e.key === 'Escape' && setMobileMenuOpen(false)}
          role="button"
          tabIndex={0}
        />
      </div>
    </header>
  );
};

export default Header;

const BrandLogo = () => (
  <Link href="/" className="flex items-center justify-start gap-2">
    <div className="w-16 h-16 rounded-full overflow-hidden bg-white flex items-center justify-center">
      <Image
        src="/images/logo.jpg"
        alt="Logo"
        width={400}
        height={400}
        quality={100}
        className="object-cover w-full h-full"
      />
    </div>
  </Link>
);
