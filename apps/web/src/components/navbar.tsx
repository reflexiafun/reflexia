"use client"

import Link from "next/link"
import { WalletConnectButton } from "@/components/connect-button"

export function Navbar() {
  return (
    <header className="sticky top-0 w-full max-w-7xl mx-auto z-50 flex justify-between items-center px-6 py-3 bg-[#fff8f7]/80 backdrop-blur-md rounded-b-2xl border-b-4 border-white shadow-[0_10px_20px_rgba(0,0,0,0.05)] gap-4">
      <div className="flex items-center gap-3 shrink-0">
        <Link href="/" className="flex items-center shrink-0 hover:opacity-80 transition-opacity">
          <img src="/logo.png" alt="Reflexia Logo" className="h-10 w-auto object-contain" />
        </Link>
      </div>

      <div className="flex items-center gap-4 shrink-0">
        <WalletConnectButton />
      </div>
    </header>
  )
}
