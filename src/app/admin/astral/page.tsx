"use client";

import Link from "next/link";
import { Icon } from "@iconify/react";

export default function AstralProfilesAdminPage() {
    const modules = [
        {
            id: 'zodiac',
            title: 'Profil Zodiac',
            description: 'Gestion des 12 signes du zodiaque (textes, images, icônes).',
            icon: 'mdi:zodiac-leo',
            link: '/admin/astral/zodiac',
            count: 12
        },
        // Placeholder for future modules
        {
            id: 'lunar',
            title: 'Profil Lunaire',
            description: 'Gestion des phases et signes lunaires (Bientôt).',
            icon: 'mdi:moon-waning-crescent',
            link: '#',
            disabled: true
        }
    ];

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            <header>
                <h1 className="text-3xl font-bold text-white mb-2">Profils Astraux</h1>
                <p className="text-slate-400">Gérez les contenus des différents modules astrologiques.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {modules.map((module) => (
                    <Link
                        key={module.id}
                        href={module.link}
                        className={`group relative bg-slate-800 rounded-xl border border-slate-700 p-6 transition-all ${module.disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-blue-500 hover:shadow-lg'}`}
                        onClick={e => module.disabled && e.preventDefault()}
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className={`p-3 rounded-lg ${module.disabled ? 'bg-slate-700 text-slate-500' : 'bg-blue-500/10 text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-colors'}`}>
                                <Icon icon={module.icon} width={32} />
                            </div>
                            {module.count && (
                                <span className="bg-slate-900 border border-slate-700 text-slate-300 text-xs font-medium px-2 py-1 rounded-full">
                                    {module.count} entrées
                                </span>
                            )}
                        </div>

                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                            {module.title}
                        </h3>
                        <p className="text-sm text-slate-400">
                            {module.description}
                        </p>

                        {!module.disabled && (
                            <div className="mt-4 flex items-center text-blue-400 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0">
                                Gérer <Icon icon="mdi:arrow-right" className="ml-1" />
                            </div>
                        )}
                    </Link>
                ))}
            </div>
        </div>
    );
}
