import type { Metadata } from "next";
import "./globals.css";
import CommunityNavbar from "./_components/Navbar";
import CommunityFooter from "./_components/Footer";

export const metadata: Metadata = {
  title: "Botmartz Community — AI Engineers, Builders & Research Hub",
  description: "Official developer hub for Botmartz AI. Weekly Showcase Thursdays, Resume Review Wednesdays, Monthly 3rd Saturday AMAs, and AI Frontier Summits.",
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
    shortcut: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-[#FAFCFF] text-slate-900 min-h-screen flex flex-col antialiased">
        <CommunityNavbar />
        <main className="flex-1 pt-18">
          {children}
        </main>
        <CommunityFooter />
      </body>
    </html>
  );
}
