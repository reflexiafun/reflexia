import type { Metadata } from 'next';
import { Quicksand } from 'next/font/google';
import './globals.css';

import { Navbar } from '@/components/navbar';
import { WalletProvider } from "@/components/wallet-provider"

const quicksand = Quicksand({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'Reflexia - Casual Reflex & Reward Game',
  description: 'Challenge your reflexes with cute targets and earn rewards on Celo blockchain!',
  icons: {
    icon: '/favicon.ico',
  },
  other: {
    'talentapp:project_verification': '386fea5851f51c08a3cb8a5ab24de8495724340251cda86888655df2efec98d782a74074ccc9b9903f4c29f1b3531a54c387c2c8a1571391f425d4cc0c5f2f19',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
      </head>
      <body className={quicksand.className}>
        <div className="relative flex min-h-screen flex-col">
          <WalletProvider>
            <Navbar />
            <main className="flex-1">
              {children}
            </main>
          </WalletProvider>
        </div>
      </body>
    </html>
  );
}
