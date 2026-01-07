"use client";

import React, { useState } from "react";
import { PageBackground } from "@/components/layout/PageBackground";
import { InputField } from "@/components/ui/InputField";
import { Button } from "@/components/ui/Button";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { GlassCard } from "@/components/ui/GlassCard";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
    const router = useRouter();
    const supabase = createClient();

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        birthDate: "",
        birthCountry: ""
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // 1. Sign Up
            const { data, error: authError } = await supabase.auth.signUp({
                email: formData.email,
                password: formData.password,
                options: {
                    data: {
                        first_name: formData.firstName,
                        last_name: formData.lastName,
                    }
                }
            });

            if (authError) throw authError;

            // Note: The profile creation for email signup is handled manually here as per original code.
            // But if we use the trigger universally, we might have a conflict or duplicate effort.
            // The trigger handles "new.raw_user_meta_data", which signUp populates.
            // However, the original code had manual insertion. Since I added a trigger that handles INSERT on auth.users,
            // that trigger WILL fire when signUp creates the user.
            // The trigger does ON CONFLICT DO UPDATE.
            // So if I keep the manual insertion below, it might be redundant or race condition.
            // But the trigger relies on metadata.
            // Let's keep the manual insertion for now as a fallback/primary method for email signup, 
            // as it has more fields (birthDate, birthCountry) that the trigger might not have via metadata unless I put them there.

            if (data.user) {
                // 2. Create Profile (Manual)
                // We'll trust the manual process for email signup to be more complete (it has birthdate).
                // But wait, the trigger might overwrite or be overwritten.
                // The trigger sets birth_date to NULL.
                // If trigger runs AFTER this insert, it does ON CONFLICT UPDATE.
                // If it updates birth_date to NULL, that's bad.
                // My trigger says VALUES(..., NULL, NULL).
                // And ON CONFLICT DO UPDATE SET ... first_name, last_name.
                // It does NOT update birth_date in the ON CONFLICT clause.
                // So safe.

                const { error: profileError } = await supabase
                    .from('profiles')
                    .insert({
                        id: data.user.id,
                        first_name: formData.firstName,
                        last_name: formData.lastName,
                        email: formData.email,
                        birth_date: formData.birthDate,
                        birth_country: formData.birthCountry
                    })
                    .select(); // Ensure we wait

                if (profileError) {
                    console.error("Profile creation failed:", profileError);
                    // If profile already exists (trigger was faster), we should update it with birth date
                    if (profileError.code === '23505') { // Unique violation
                        await supabase.from('profiles').update({
                            birth_date: formData.birthDate,
                            birth_country: formData.birthCountry,
                            first_name: formData.firstName,
                            last_name: formData.lastName
                        }).eq('id', data.user.id);
                    }
                }

                // Redirect or show success
                if (!data.session) {
                    alert("Compte créé ! Veuillez vérifier vos emails pour confirmer votre inscription.");
                    router.push("/login");
                } else {
                    router.push("/");
                    router.refresh();
                }
            }

        } catch (err: any) {
            console.error("Registration error:", err);
            setError(err.message || "Une erreur est survenue lors de l'inscription.");
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
            <main className="relative z-10 w-full max-w-lg flex flex-col items-center gap-6 animate-in fade-in zoom-in duration-500 my-8">

                {/* Register Form Card */}
                <GlassCard className="w-full p-8 flex flex-col gap-6 border-none"
                    style={{
                        background: 'linear-gradient(180deg, rgba(24, 39, 46, 0.40) 0%, rgba(24, 39, 46, 0.70) 50%, rgba(24, 39, 46, 0.95) 100%)',
                        backdropFilter: 'blur(12px)',
                        WebkitBackdropFilter: 'blur(12px)'
                    }}
                >
                    <div className="text-center space-y-2">
                        <h1 className="title-med text-[var(--text-primary)]">Rejoignez le cercle</h1>
                        <p className="para text-[var(--text-secondary)]">Créez votre compte pour commencer votre voyage.</p>
                    </div>

                    {error && (
                        <div className="bg-[var(--ui-alert)] text-[var(--ui-on-alert)] p-3 rounded-lg text-center text-sm">
                            {error}
                        </div>
                    )}

                    <div className="flex gap-4 w-full justify-center">
                        <Button
                            variant="secondary"
                            className="w-full relative !bg-white !text-black border-none hover:!bg-gray-100"
                            icon={<Icon icon="logos:google-icon" />}
                            onClick={() => handleSocialLogin('google')}
                        >
                            Google
                        </Button>

                        <Button
                            variant="secondary"
                            className="w-full relative !bg-black !text-white border-none hover:!bg-gray-900"
                            icon={<Icon icon="logos:apple" className="text-white invert" />}
                            onClick={() => handleSocialLogin('apple')}
                        >
                            Apple
                        </Button>
                    </div>

                    <div className="w-full flex items-center gap-4 my-2">
                        <div className="h-[1px] bg-[var(--background-400)] flex-1"></div>
                        <span className="text-[var(--text-tertiary)] para-lit uppercase tracking-wider">Ou</span>
                        <div className="h-[1px] bg-[var(--background-400)] flex-1"></div>
                    </div>

                    <form onSubmit={handleRegister} className="flex flex-col gap-4 w-full">

                        <div className="flex gap-4">
                            <InputField
                                label="Prénom"
                                name="firstName"
                                placeholder="Votre prénom"
                                value={formData.firstName}
                                onChange={handleChange}
                                required
                                className="flex-1"
                                autoComplete="given-name"
                            />
                            <InputField
                                label="Nom"
                                name="lastName"
                                placeholder="Votre nom"
                                value={formData.lastName}
                                onChange={handleChange}
                                required
                                className="flex-1"
                                autoComplete="family-name"
                            />
                        </div>

                        <InputField
                            label="Email"
                            name="email"
                            type="email"
                            placeholder="votre@email.com"
                            value={formData.email}
                            onChange={handleChange}
                            icon="carbon:email"
                            required
                            autoComplete="email"
                        />

                        <InputField
                            label="Mot de passe"
                            name="password"
                            type="password"
                            placeholder="••••••••"
                            subtext="Minimum 6 caractères"
                            value={formData.password}
                            onChange={handleChange}
                            icon="carbon:password"
                            required
                            minLength={6}
                            autoComplete="new-password"
                        />

                        <div className="h-[1px] bg-[var(--background-400)] w-full my-2"></div>

                        <div className="grid grid-cols-2 gap-4">
                            <InputField
                                label="Date de naissance"
                                name="birthDate"
                                type="date"
                                value={formData.birthDate}
                                onChange={handleChange}
                                required
                                autoComplete="bday"
                            />
                            <InputField
                                label="Pays"
                                name="birthCountry"
                                placeholder="France"
                                value={formData.birthCountry}
                                onChange={handleChange}
                                className=""
                                required
                                autoComplete="country-name"
                            />
                        </div>

                        <Button type="submit" disabled={loading} className="w-full mt-4 shadow-[0px_4px_14.1px_0px_rgba(246,174,49,0.40)]">
                            {loading ? "Création du compte..." : "S'inscrire"}
                        </Button>
                    </form>



                    <div className="text-center mt-2">
                        <p className="para-lit text-[var(--text-secondary)]">
                            Déjà membre ?{" "}
                            <Link href="/login" className="text-[var(--accent-500)] font-bold hover:underline">
                                Se connecter
                            </Link>
                        </p>
                    </div>

                </GlassCard>
            </main>

            <footer className="relative z-10 mt-8 mb-8 text-center opacity-60">
                <p className="legend text-[var(--text-tertiary)]">Wakan V2 - Tous droits réservés</p>
            </footer>
        </div>
    );
}
