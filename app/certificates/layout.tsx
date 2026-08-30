import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Verify AI Engineering Credentials & Certificates — Botmartz",
  description:
    "Instant cryptographic certificate verification portal. Look up official Botmartz credentials for 45-Day Virtual AI Internships, AI Frontier Summits, and Bootcamp cohorts.",
  keywords: [
    "verify Botmartz certificate",
    "AI internship certificate verification",
    "verifiable AI credentials",
    "Botmartz credential lookup",
  ],
  alternates: { canonical: "/certificates" },
  openGraph: {
    title: "Verify AI Engineering Credentials | Botmartz",
    description: "Official public lookup for verified Botmartz AI certificates and internship credentials.",
    url: "https://community.botmartz.com/certificates",
    images: [{ url: "/logo.png", width: 1200, height: 630 }],
  },
};

export default function CertificatesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
