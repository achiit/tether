import Link from "next/link"
import { Facebook, Instagram, Twitter } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-gray-100 py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center gap-8">
          {/* Logo and Description */}
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Tether Ventures</h2>
            <p className="text-xl text-gray-600">Building Networks, Growing Wealth Together</p>
          </div>

          {/* Navigation Links */}
          <nav className="flex gap-12">
            <Link href="#" className="text-lg text-gray-600 hover:text-[#f3ba2f]">
              Learn
            </Link>
            <Link href="#" className="text-lg text-gray-600 hover:text-[#f3ba2f]">
              FAQ
            </Link>
            <Link href="#" className="text-lg text-gray-600 hover:text-[#f3ba2f]">
              Support
            </Link>
          </nav>

          {/* Social Links */}
          <div className="flex gap-8">
            <Link href="#" className="text-gray-600 hover:text-[#f3ba2f]">
              <Facebook className="w-8 h-8" />
            </Link>
            <Link href="#" className="text-gray-600 hover:text-[#f3ba2f]">
              <Twitter className="w-8 h-8" />
            </Link>
            <Link href="#" className="text-gray-600 hover:text-[#f3ba2f]">
              <Instagram className="w-8 h-8" />
            </Link>
          </div>

          {/* Copyright */}
          <div className="text-lg text-gray-600">
            © 2024 Tether Ventures. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  )
}

