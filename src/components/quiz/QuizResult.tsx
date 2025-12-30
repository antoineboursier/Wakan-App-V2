"use client";

import { QuizProfile } from "@/types/quiz";
import { motion } from "framer-motion";

interface QuizResultProps {
    profile: QuizProfile;
    onExit: () => void;
}

export function QuizResult({ profile, onExit }: QuizResultProps) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col h-full overflow-y-auto no-scrollbar relative pt-12 pb-8 px-6 text-center"
        >
            <div className="max-w-lg mx-auto flex flex-col items-center space-y-8 my-auto w-full">
                <motion.div
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-white/50 text-sm uppercase tracking-[0.2em] font-bold"
                >
                    Ton Résultat
                </motion.div>

                {profile.image_url && (
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="w-48 h-48 rounded-full overflow-hidden border-4 border-white/10 shadow-[0_0_50px_rgba(255,255,255,0.1)] relative"
                    >
                        <img src={profile.image_url} alt={profile.name} className="w-full h-full object-cover" />
                    </motion.div>
                )}

                <motion.h1
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.4, type: "spring", bounce: 0.5 }}
                    className="text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight"
                >
                    {profile.name}
                </motion.h1>

                <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 0.6, duration: 0.8 }}
                    className="w-24 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent rounded-full opacity-70"
                />

                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="text-white/80 text-lg leading-relaxed text-justify md:text-center p-6 bg-white/5 rounded-3xl border border-white/5 shadow-2xl backdrop-blur-sm"
                >
                    {profile.description_result || "Un profil mystérieux..."}
                </motion.div>

                <motion.button
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    onClick={onExit}
                    className="mt-8 px-8 py-3 bg-white text-black font-bold rounded-full hover:scale-105 transition-transform shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] active:scale-95"
                >
                    Retour aux Quiz
                </motion.button>
            </div>
            {/* Background elements decoration */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-[500px] max-h-[500px] bg-blue-500/10 rounded-full blur-[100px] -z-10 pointer-events-none" />
        </motion.div>
    );
}
