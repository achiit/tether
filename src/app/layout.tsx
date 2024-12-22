import type { Metadata } from "next"
import { Inter } from 'next/font/google'
import "./globals.css"
import localFont from 'next/font/local'

const glacier = localFont({
  src: '../../public/fonts/Glacier-Regular.ttf',
  variable: '--font-glacier',
  display: 'swap',
})

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "tether - Liquid staking for digital assets",
  description: "Stake your digital assets and earn daily rewards",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${glacier.variable}`}>
      <body className={inter.className}>{children}</body>
    </html>
  )
}

