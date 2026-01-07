"use client";

import React, { useState } from "react";
import { PageBackground } from "@/components/layout/PageBackground";
import { WakanLogo } from "@/components/ui/WakanLogo";
import { InputField } from "@/components/ui/InputField";
import { Button } from "@/components/ui/Button";
import { Separator } from "@/components/ui/Separator";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { GlassCard } from "@/components/ui/GlassCard";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const router = useRouter();
    const supabase = createClient();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });
            if (error) throw error;
            router.push("/");
            router.refresh();
        } catch (err: any) {
            console.error("Login error:", err);
            setError(err.message || "Erreur lors de la connexion.");
        } finally {
            setLoading(false);
        }
    };

    const handleSocialLogin = async (provider: 'google' | 'apple') => {
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider,
                options: {
                    redirectTo: `${window.location.origin}/auth/callback`,
                    queryParams: {
                        access_type: 'offline',
                        prompt: 'consent',
                    },
                },
            });
            if (error) throw error;
        } catch (err: any) {
            console.error("Social login error:", err);
            setError(err.message || "Erreur lors de la connexion sociale.");
        }
    };

    return (
        <div className="min-h-screen w-full relative flex flex-col items-center justify-center p-4">
            {/* Background */}
            <PageBackground imageSrc="/backgrounds/home.png" alt="Wakan Background" />

            {/* Main Container */}
            <main className="relative z-10 w-full max-w-md flex flex-col items-center gap-6 animate-in fade-in zoom-in duration-500">

                {/* Logo */}
                <div className="mb-4">
                    <WakanLogo />
                </div>

                {/* Login Form Card */}
                <GlassCard className="w-full p-8 flex flex-col gap-6 border-none"
                    style={{
                        background: 'linear-gradient(180deg, rgba(24, 39, 46, 0.40) 0%, rgba(24, 39, 46, 0.70) 50%, rgba(24, 39, 46, 0.95) 100%)',
                        backdropFilter: 'blur(12px)',
                        WebkitBackdropFilter: 'blur(12px)'
                    }}
                >
                    <div className="text-center space-y-2">
                        <h1 className="title-med text-[var(--text-primary)]">Bon retour parmi nous</h1>
                        <p className="para text-[var(--text-tertiary)]">Connectez-vous pour retrouver votre espace.</p>
                    </div>

                    {error && (
                        <div className="bg-[var(--ui-alert)] text-[var(--ui-on-alert)] p-3 rounded-lg text-center text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="flex flex-col gap-4 w-full items-center">
                        <InputField
                            label="Email"
                            type="email"
                            placeholder="votre@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            icon="carbon:email"
                            className="w-full"
                            autoComplete="email"
                        />

                        <div className="flex flex-col gap-1 w-full">
                            <InputField
                                label="Mot de passe"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                icon="carbon:password"
                                className="w-full"
                                autoComplete="current-password"
                            />
                            <div className="flex justify-end mt-1">
                                <Link href="/forgot-password" className="text-[var(--text-tertiary)] hover:text-[var(--text-primary)] para-lit transition-colors underline">
                                    Mot de passe oublié ?
                                </Link>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="mt-2 shadow-[0px_4px_14.1px_0px_rgba(246,174,49,0.40)] w-fit px-8"
                            disabled={!email || !password || loading}
                        >
                            {loading ? "Connexion..." : "Se connecter"}
                        </Button>
                    </form>

                    <div className="w-full flex items-center gap-4 my-2">
                        <div className="h-[1px] bg-[var(--background-400)] flex-1"></div>
                        <span className="text-[var(--text-tertiary)] para-lit uppercase tracking-wider">Ou</span>
                        <div className="h-[1px] bg-[var(--background-400)] flex-1"></div>
                    </div>

                    <div className="flex gap-4 w-full justify-center">
                        <Button
                            variant="secondary"
                            className="w-14 h-14 p-0 rounded-xl relative !bg-white !text-black border-none hover:!bg-gray-100 flex items-center justify-center"
                            onClick={() => handleSocialLogin('google')}
                            title="Continuer avec Google"
                            aria-label="Continuer avec Google"
                        >
                            <Icon icon="logos:google-icon" className="w-6 h-6" />
                        </Button>

                        <Button
                            variant="secondary"
                            className="w-14 h-14 p-0 rounded-xl relative !bg-black !text-white border-none hover:!bg-gray-900 flex items-center justify-center"
                            onClick={() => handleSocialLogin('apple')}
                            title="Continuer avec Apple"
                            aria-label="Continuer avec Apple"
                        >
                            <Icon icon="logos:apple" className="w-6 h-6 invert text-white" />
                        </Button>
                    </div>

                    <div className="text-center mt-2">
                        <p className="para-big text-[var(--text-tertiary)]">
                            Pas encore de compte ?{" "}
                            <Link href="/register" className="text-[var(--accent-500)] font-bold underline">
                                S'inscrire
                            </Link>
                        </p>
                    </div>


                </GlassCard>
            </main>

            <footer className="relative z-10 mt-8 text-center opacity-60">
                <p className="legend text-[var(--text-tertiary)]">Wakan V2 - Tous droits réservés</p>
            </footer>
        </div>
    );
}
