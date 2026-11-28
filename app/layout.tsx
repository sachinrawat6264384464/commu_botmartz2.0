import type { Metadata } from "next";
import "./globals.css";
import ClientLayout from "./client-layout";

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://community.botmartz.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Botmartz — 45-Day Project-Based Virtual AI Internship & Engineering Playground",
    template: "%s | Botmartz AI Platform",
  },
  description:
    "Join the 45-Day Virtual AI Internship & Builder Community. Build real-world AI engineering portfolio projects with LangGraph & RAG, ship daily GitHub proof-of-work, and earn verifiable certificates.",
  keywords: [
    "virtual AI internship",
    "virtual AI internship for students",
    "virtual AI internship for freshers",
    "virtual software engineering internship India",
    "software engineer internship remote no experience",
    "free virtual job simulations",
    "SDE internship",
    "project based AI internship India",
    "online internship with certificate",
    "AI internship work from home",
    "AI summer internship 2026 India",
    "AI engineering portfolio projects",
    "multi AI agent project GitHub",
    "agentic AI projects GitHub with source code",
    "LLM RAG projects",
    "LangGraph RAG pipelines",
    "generative AI engineer",
    "evidence-backed proof of work",
    "GitHub proof of work",
    "AI builder community",
    "student developer community",
    "best tech community in Indore",
    "Indore tech community",
    "Indore developer community",
    "Indore software developer community",
    "AI developer community Indore",
    "central India developer community",
    "upcoming tech events in Indore 2026",
    "AI learning platform",
    "career path for developers",
    "job ready developer training",
    "online virtual hackathons",
    "AI builders hackathon",
    "BCA MCA BTech AI internship",
    "Botmartz community",
  ],
  authors: [{ name: "Botmartz AI Solution", url: "https://www.botmartz.com" }],
  creator: "Botmartz AI Solution Pvt Ltd",
  publisher: "Botmartz AI",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "Botmartz Community & AI Engineering Arena",
    title: "Botmartz — 45-Day Project-Based Virtual AI Internship & Engineering Playground",
    description:
      "Build production AI systems, LLM & LangGraph RAG pipelines, ship daily GitHub proof-of-work, and earn verifiable credentials.",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Botmartz AI Engineering Playground",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Botmartz — 45-Day Project-Based Virtual AI Internship",
    description:
      "Stop watching tutorials. Build 50 production AI systems, ship daily commits, and get referred to 15 hiring partner companies.",
    images: ["/logo.png"],
    creator: "@botmartz",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
    shortcut: "/logo.png",
  },
};

const jsonLdOrganization = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: "Botmartz AI Solution Pvt Ltd",
      url: SITE_URL,
      logo: `${SITE_URL}/logo.png`,
      address: {
        "@type": "PostalAddress",
        addressLocality: "Indore",
        addressRegion: "Madhya Pradesh",
        addressCountry: "IN",
      },
      areaServed: ["Indore", "India", "Global"],
      sameAs: [
        "https://www.botmartz.com",
        "https://linkedin.com/company/botmartz",
        "https://github.com/soham2710",
      ],
      description:
        "Botmartz is an AI engineering solution provider and student developer community hosting the 45-Day Project-Based Virtual AI Internship Playground.",
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: "Botmartz Community & AI Engineering Arena",
      publisher: {
        "@id": `${SITE_URL}/#organization`,
      },
      potentialAction: {
        "@type": "SearchAction",
        target: `${SITE_URL}/arena?search={search_term_string}`,
        "query-input": "required name=search_term_string",
      },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="overflow-x-hidden max-w-full" suppressHydrationWarning={true}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdOrganization) }}
        />
      </head>
      <body className="bg-[#040914] text-white min-h-screen flex flex-col antialiased overflow-x-hidden max-w-full" suppressHydrationWarning={true}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
