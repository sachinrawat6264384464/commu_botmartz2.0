import type { Metadata } from "next";
import "./globals.css";
import ClientLayout from "./client-layout";

export const metadata: Metadata = {
  metadataBase: new URL("https://community.botmartz.com"),
  title: {
    default: "Botmartz — 45-Day Project-Based Virtual AI Internship & Engineering Playground",
    template: "%s | Botmartz AI Platform",
  },
  description:
    "Join the 45-Day Virtual AI Internship & Engineering Playground. Pick from 50 production systems in Generative AI, Defence, RAG, and Systems. Ship daily GitHub proof-of-work, pass strict SLA benchmarks, and unlock 15 partner company referrals.",
  keywords: [
    "virtual AI internship",
    "project based AI internship",
    "remote AI engineering internship",
    "generative AI internship",
    "AI engineering portfolio projects",
    "AI engineer roadmap 2026",
    "LangGraph multi agent projects",
    "RAG systems virtual work experience",
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
    url: "https://community.botmartz.com",
    siteName: "Botmartz Community & AI Engineering Arena",
    title: "Botmartz — 45-Day Project-Based Virtual AI Internship & Engineering Playground",
    description:
      "Pick from 50 production systems in AI, Defence, FinTech, and Systems. Ship daily proof-of-work on GitHub and get referred directly to 15 partner companies.",
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
      "@id": "https://community.botmartz.com/#organization",
      name: "Botmartz AI Solution Pvt Ltd",
      url: "https://community.botmartz.com",
      logo: "https://community.botmartz.com/logo.png",
      sameAs: [
        "https://www.botmartz.com",
        "https://linkedin.com/company/botmartz",
        "https://github.com/soham2710",
      ],
      description:
        "Botmartz is an AI engineering solution provider and builder platform hosting the 45-Day Project-Based Virtual AI Internship Playground.",
    },
    {
      "@type": "WebSite",
      "@id": "https://community.botmartz.com/#website",
      url: "https://community.botmartz.com",
      name: "Botmartz Community & AI Engineering Arena",
      publisher: {
        "@id": "https://community.botmartz.com/#organization",
      },
      potentialAction: {
        "@type": "SearchAction",
        target: "https://community.botmartz.com/arena?search={search_term_string}",
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
      <body className="bg-[#FAFCFF] text-slate-900 min-h-screen flex flex-col antialiased overflow-x-hidden max-w-full" suppressHydrationWarning={true}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
