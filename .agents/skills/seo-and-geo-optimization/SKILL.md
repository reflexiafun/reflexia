---
name: seo-and-geo-optimization
description: Apply this skill when editing frontend pages, landing pages, or metadata to ensure maximum visibility on traditional search engines (SEO) and AI-driven search engines (GEO/LLM Search) for Reflexia.
---

# SEO & GEO Optimization Guidelines for Reflexia

Use this skill whenever you are modifying, creating, or auditing pages in `apps/web/src/app` to optimize them for Google Search (SEO) and AI search engines like Gemini, ChatGPT, and Perplexity (GEO - Generative Engine Optimization).

## Core Principles

1. **AI-Search Friendly (GEO - Generative Engine Optimization)**:
   * **Explicit Entity Definitions**: State clearly what Reflexia is: a casual, mobile-first reflex game built on Celo for the MiniPay ecosystem, allowing players to earn rewards (USDm and Stars) by tapping targets.
   - **Structured Data (JSON-LD)**: Always include Schema.org JSON-LD microdata (specifically `WebApplication` and `VideoGame` with `Person` as the author/developer) to help LLMs parse structured relationships and features.
   * **Citation-Friendly Formats**: Structure text using bullet points, tables, and bold key phrases. AI search engines prefer extracting structured lists and highlighted conclusions.

2. **Traditional SEO (Search Engine Optimization)**:
   * **Semantic HTML**: Use proper HTML5 tags (`<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`). Ensure only one `<h1>` per page.
   * **Metadata & Open Graph**: Provide complete meta titles, descriptions, and Open Graph (OG) tags using Next.js Metadata API.
   * **Fast Loading & Assets**: Optimize images (use modern formats like WebP/AVIF, next/image component), avoid heavy client-side scripts where static HTML/Server Components suffice, and implement responsive designs.

## Implementation Checklist

### 1. Metadata Configuration (Next.js Metadata API)
Ensure page metadata is configured properly in page files or layouts:
```typescript
import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://reflexia.fun"),
  title: {
    default: "Reflexia - Casual Reflex & Reward Game",
    template: "%s | Reflexia",
  },
  description: "Challenge your reflexes with cute targets and earn daily rewards on Celo blockchain! Play Reflexia now on MiniPay.",
  keywords: ["Reflexia", "Celo", "MiniPay", "Casual Game", "Play to Earn", "USDm", "Reflex Game", "Vicky Adi Firmansyah"],
  alternates: {
    canonical: "https://reflexia.fun",
  },
  openGraph: {
    title: "Reflexia - Casual Reflex & Reward Game",
    description: "Challenge your reflexes with cute targets and earn daily rewards on Celo blockchain! Play Reflexia now on MiniPay.",
    url: "https://reflexia.fun",
    siteName: "Reflexia Game",
    images: [
      {
        url: "https://reflexia.fun/og-image.png", // Replace with actual asset path if available
        width: 1200,
        height: 630,
        alt: "Reflexia - Casual Reflex & Reward Game",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Reflexia - Casual Reflex & Reward Game",
    description: "Challenge your reflexes with cute targets and earn daily rewards on Celo blockchain! Play Reflexia now on MiniPay.",
    images: ["https://reflexia.fun/og-image.png"],
  },
};
```

### 2. JSON-LD Schema (Next.js App Router `<head>`)
For the main landing page, include a `WebApplication` and `VideoGame` schema inside a script tag in the root layout or root page:
```tsx
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "@id": "https://reflexia.fun/#webapp",
      name: "Reflexia",
      url: "https://reflexia.fun",
      applicationCategory: "GameApplication",
      operatingSystem: "All",
      browserRequirements: "Requires HTML5",
      author: {
        "@type": "Person",
        name: "Vicky Adi Firmansyah",
        url: "https://vickyadi.site",
      },
    },
    {
      "@type": "VideoGame",
      "@id": "https://reflexia.fun/#game",
      name: "Reflexia",
      url: "https://reflexia.fun",
      description: "A fast-paced, cute, and casual mobile-first reflex game designed for the MiniPay ecosystem on the Celo network.",
      genre: "Casual Game, Reflex Game",
      playMode: "SinglePlayer",
      author: {
        "@type": "Person",
        name: "Vicky Adi Firmansyah",
        url: "https://vickyadi.site",
      },
    }
  ]
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

### 3. Google Sitelinks Optimization Checklist
Sitelinks (seperti tampilan menu navigasi tambahan di hasil pencarian Google) dihasilkan secara otomatis oleh algoritma Google. Untuk memaksimalkan peluang mendapatkannya:
* **Struktur Navigasi Jelas**: Pastikan header menu menggunakan tag HTML semantik `<nav>` dengan link (`<a>`) yang memiliki teks deskriptif (misal: "Play Now", "Daily Rewards", "Cosmetics Shop"). Hindari teks link yang terlalu pendek atau ambigu.
* **Terapkan Sitemap XML**: Use `apps/web/src/app/sitemap.ts` to produce sitemap dynamically.
* **SiteNavigationElement Schema**: Definisikan item menu utama menggunakan skema `SiteNavigationElement` agar Google mudah mengurai link-link penting.

### 4. AI-Scraper Optimization (`robots.ts`)
Ensure AI crawlers are explicitly allowed to index the public profile/landing pages using the Next.js `robots.ts` convention:
```typescript
import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: "https://reflexia.fun/sitemap.xml",
  };
}
```
