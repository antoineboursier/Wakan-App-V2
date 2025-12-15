import type { Metadata } from "next";
import { Skranji, League_Spartan } from "next/font/google";
import { Navigation } from "@/components/layout/Navigation";
import "./globals.css";

const skranji = Skranji({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-skranji",
});

const leagueSpartan = League_Spartan({
  subsets: ["latin"],
  variable: "--font-league-spartan",
});

export const metadata: Metadata = {
  title: "Wakan - Guide Spirituel",
  description: "Votre guide spirituel quotidien",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="dark">
      <body className={`${skranji.variable} ${leagueSpartan.variable} antialiased min-h-screen bg-[var(--background-900)] text-[var(--text-primary)] font-body`}>
        <Navigation />
        <main className="md:pb-24 md:pb-0 h-full min-h-screen relative overflow-x-hidden">
          {children}
        </main>
      </body>
    </html>
  );
}
