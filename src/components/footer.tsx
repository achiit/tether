import Link from 'next/link'
import { DiscIcon as Discord, TextIcon as Telegram, Twitter } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t border-gray-200 py-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-8 gap-8">
          {/* First Column */}
          <div className="lg:col-span-2">
            <h3 className="text-[#666666] text-2xl font-normal mb-4">Staking</h3>
            <ul className="space-y-2">
              <li><Link href="#" className="text-gray-900">Stake ETH</Link></li>
              <li><Link href="#" className="text-blue-500">tether Institutional</Link></li>
              <li><Link href="#" className="text-gray-900">tether on Polygon</Link></li>
            </ul>
          </div>

          {/* Second Column */}
          <div className="lg:col-span-2">
            <h3 className="text-[#666666] text-2xl font-normal mb-4">Integrations</h3>
            <ul className="space-y-2">
              <li><Link href="#" className="text-gray-900">stETH in DeFi</Link></li>
              <li><Link href="#" className="text-gray-900">tether Multichain</Link></li>
              <li><Link href="#" className="text-gray-900">Ecosystem</Link></li>
            </ul>
          </div>

          {/* Third Column */}
          <div className="lg:col-span-2">
            <h3 className="text-[#666666] text-2xl font-normal mb-4">Node operators</h3>
            <ul className="space-y-2">
              <li><Link href="#" className="text-gray-900">Node Operator Portal</Link></li>
              <li><Link href="#" className="text-gray-900">Apply to be a Node Operator</Link></li>
              <li><Link href="#" className="text-gray-900">Existing tether Operators Resources</Link></li>
            </ul>
          </div>

          {/* Fourth Column */}
          <div className="lg:col-span-2">
            <h3 className="text-[#666666] text-2xl font-normal mb-4">tether DAO</h3>
            <ul className="space-y-2">
              <li><Link href="#" className="text-gray-900">Governance Process</Link></li>
              <li><Link href="#" className="text-gray-900">LEGO grants</Link></li>
              <li><Link href="#" className="text-gray-900">Research Forum</Link></li>
              <li><Link href="#" className="text-gray-900">Snapshot Voting</Link></li>
              <li><Link href="#" className="text-gray-900">On-chain Voting</Link></li>
              <li><Link href="#" className="text-gray-900">Easy Track Voting</Link></li>
            </ul>
          </div>

          {/* Fifth Column */}
          <div className="lg:col-span-2">
            <h3 className="text-[#666666] text-2xl font-normal mb-4">About</h3>
            <div className="flex gap-4 mb-4">
              <Link href="#" className="rounded-full bg-white border border-gray-200 p-3">
                <Discord className="w-5 h-5" />
              </Link>
              <Link href="#" className="rounded-full bg-white border border-gray-200 p-3">
                <Telegram className="w-5 h-5" />
              </Link>
              <Link href="#" className="rounded-full bg-white border border-gray-200 p-3">
                <Twitter className="w-5 h-5" />
              </Link>
            </div>
            <div className="space-y-2">
              <div className="text-gray-900">Opportunities</div>
              <div className="flex items-center gap-2 text-gray-900">
                Press Kit
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7 10L12 15L17 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
            <Link href="https://tether.fi/institutional" className="inline-block mt-4 px-4 py-1 bg-[#141414] text-white text-sm rounded-full">
              tether.fi/institutional
            </Link>
          </div>

          {/* Sixth Column */}
          <div className="lg:col-span-2">
            <h3 className="text-[#666666] text-2xl font-normal mb-4">Analytics</h3>
            <ul className="space-y-2">
              <li><Link href="#" className="text-gray-900">All-in-one tether Analytics</Link></li>
              <li><Link href="#" className="text-gray-900">tether Morning Coffee</Link></li>
              <li><Link href="#" className="text-gray-900">(w)stETH in DeFi</Link></li>
            </ul>
          </div>

          {/* Seventh Column */}
          <div className="lg:col-span-2">
            <h3 className="text-[#666666] text-2xl font-normal mb-4">Developers</h3>
            <ul className="space-y-2">
              <li><Link href="#" className="text-gray-900">GitHub</Link></li>
              <li><Link href="#" className="text-gray-900">Bug Bounty</Link></li>
              <li><Link href="#" className="text-gray-900">Audits</Link></li>
              <li><Link href="#" className="text-gray-900">tether tokens integration guide</Link></li>
              <li><Link href="#" className="text-gray-900">SDK</Link></li>
              <li><Link href="#" className="text-gray-900">Docs</Link></li>
            </ul>
          </div>

          {/* Eighth Column */}
          <div className="lg:col-span-2">
            <h3 className="text-[#666666] text-2xl font-normal mb-4">Learn</h3>
            <ul className="space-y-2">
              <li><Link href="#" className="text-gray-900">Help Center</Link></li>
              <li><Link href="#" className="text-gray-900">FAQ</Link></li>
              <li><Link href="#" className="text-gray-900">Blog</Link></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  )
}

