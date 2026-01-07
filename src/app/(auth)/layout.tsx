import type { Metadata } from "next";
import { Skranji, League_Spartan } from "next/font/google";
import { TransitionProvider } from "@/components/layout/TransitionProvider";
import "../globals.css";

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
    title: "Wakan - Connexion",
    description: "Connectez-vous à votre espace Wakan",
};

export default function AuthLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="fr" className="dark">
            <body className={`${skranji.variable} ${leagueSpartan.variable} antialiased min-h-screen bg-[var(--background-900)] text-[var(--text-primary)] font-body`} suppressHydrationWarning>
                <TransitionProvider>
                    {children}
                </TransitionProvider>
            </body>
        </html>
    );
}
