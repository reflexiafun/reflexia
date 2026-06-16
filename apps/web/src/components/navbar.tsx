"use client"

import Link from "next/link"
import { WalletConnectButton } from "@/components/connect-button"

export function Navbar() {
  return (
    <header className="sticky top-0 w-full max-w-7xl mx-auto z-50 flex justify-between items-center px-6 py-3 bg-[#fff8f7]/80 backdrop-blur-md rounded-b-2xl border-b-4 border-white shadow-[0_10px_20px_rgba(0,0,0,0.05)] gap-4">
      <div className="flex items-center gap-3 shrink-0">
        <div className="w-10 h-10 rounded-full border-2 border-[#81515a] bg-[#ffc0cb] overflow-hidden shadow-[inset_0_4px_0_rgba(255,255,255,0.8)] shrink-0">
          <img src="/logo.png" alt="Lucky Reflex Logo" className="w-full h-full object-cover" />
        </div>
        <Link href="/" className="hidden sm:inline font-bold text-lg text-[#81515a] hover:opacity-80 transition-opacity whitespace-nowrap">
          Lucky Reflex
        </Link>
      </div>

      <div className="flex items-center gap-4 shrink-0">
        <WalletConnectButton />
      </div>
    </header>
  )
}
