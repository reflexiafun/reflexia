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
  metadataBase: new URL('https://reflexia.fun'),
  title: {
    default: 'Reflexia - Casual Reflex & Reward Game',
    template: '%s | Reflexia',
  },
  description: 'Challenge your reflexes with cute targets and earn daily rewards on Celo blockchain! Play Reflexia now on MiniPay.',
  keywords: ['Reflexia', 'Celo', 'MiniPay', 'Casual Game', 'Play to Earn', 'USDm', 'Reflex Game', 'Vicky Adi Firmansyah'],
  icons: {
    icon: '/favicon.ico',
  },
  alternates: {
    canonical: 'https://reflexia.fun',
  },
  openGraph: {
    title: 'Reflexia - Casual Reflex & Reward Game',
    description: 'Challenge your reflexes with cute targets and earn daily rewards on Celo blockchain! Play Reflexia now on MiniPay.',
    url: 'https://reflexia.fun',
    siteName: 'Reflexia Game',
    images: [
      {
        url: 'https://reflexia.fun/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Reflexia - Casual Reflex & Reward Game',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Reflexia - Casual Reflex & Reward Game',
    description: 'Challenge your reflexes with cute targets and earn daily rewards on Celo blockchain! Play Reflexia now on MiniPay.',
    images: ['https://reflexia.fun/og-image.png'],
  },
  other: {
    'talentapp:project_verification': '386fea5851f51c08a3cb8a5ab24de8495724340251cda86888655df2efec98d782a74074ccc9b9903f4c29f1b3531a54c387c2c8a1571391f425d4cc0c5f2f19',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebApplication',
      '@id': 'https://reflexia.fun/#webapp',
      name: 'Reflexia',
      url: 'https://reflexia.fun',
      applicationCategory: 'GameApplication',
      operatingSystem: 'All',
      browserRequirements: 'Requires HTML5',
      author: {
        '@type': 'Person',
        name: 'Vicky Adi Firmansyah',
        url: 'https://vickyadi.site',
      },
    },
    {
      '@type': 'VideoGame',
      '@id': 'https://reflexia.fun/#game',
      name: 'Reflexia',
      url: 'https://reflexia.fun',
      description: 'A fast-paced, cute, and casual mobile-first reflex game designed for the MiniPay ecosystem on the Celo network.',
      genre: 'Casual Game, Reflex Game',
      playMode: 'SinglePlayer',
      author: {
        '@type': 'Person',
        name: 'Vicky Adi Firmansyah',
        url: 'https://vickyadi.site',
      },
    }
  ]
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
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
