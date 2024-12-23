import Link from "next/link";
import { Facebook, Instagram, Twitter } from "lucide-react";
import Container from "./Container";

export function Footer() {
  return (
    <footer className="border-t border-gray-100 pt-8 lg:pt-12 pb-4 lg:pb-6 bg-white">
      <Container>
        <div className="flex flex-col items-center gap-8 w-full">
          <section className="grid lg:grid-cols-2 gap-8 w-full">
            <div className="flex flex-col justify-center lg:items-start lg:justify-start gap-4 w-full">
              <div className="text-center lg:text-start">
                <h2 className="text-3xl font-bold mb-2">Tether Ventures</h2>
                <p className="text-xl text-gray-600">
                  Building Networks, Growing Wealth Together
                </p>
              </div>
              <div className="flex justify-center items-center gap-12">
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
            </div>

            <div className="flex flex-col justify-center lg:items-end items-center lg:justify-end gap-4">
              <nav className="flex gap-8">
                <Link
                  href="#"
                  className="text-lg text-gray-600 hover:text-[#f3ba2f]"
                >
                  Learn
                </Link>
                <Link
                  href="#"
                  className="text-lg text-gray-600 hover:text-[#f3ba2f]"
                >
                  FAQ
                </Link>
                <Link
                  href="#"
                  className="text-lg text-gray-600 hover:text-[#f3ba2f]"
                >
                  Support
                </Link>
              </nav>
            </div>
          </section>
          <section className="flex justify-center items-center pt-4 lg:pt-6 border-t w-full">
            <div className=" text-gray-600">
              © {new Date().getFullYear()} Tether Ventures. All rights reserved.
            </div>
          </section>
        </div>
      </Container>
    </footer>
  );
}
