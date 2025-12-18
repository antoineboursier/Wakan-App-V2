'use client';

import Link from "next/link";
import { Icon } from "@iconify/react";

/* 
  Ce composant est le "lien discret" pour accéder au BO.
  Il ne s'affiche que si l'environnement n'est pas "production".
  (En vrai Vercel environment ou process.env.NODE_ENV)
*/
export function AdminBoLink() {
    // Astuce simple: on check NODE_ENV
    // Si on veut être strict sur "vercel preview" vs "prod", on check NEXT_PUBLIC_VERCEL_ENV

    const isDev = process.env.NODE_ENV === 'development';
    // Pour la démo user, on force peut-être true ou on laisse dev.
    // User a dit "Les boutons de triche apparaissent local, pas au déploiement".

    if (!isDev) return null;

    return (
        <Link
            href="/admin/draw-types"
            className="fixed bottom-4 right-4 z-[9999] p-3 bg-red-900/20 hover:bg-red-900/50 text-red-500 rounded-full border border-red-500/20 backdrop-blur-sm transition-all"
            title="Admin BO (Dev Only)"
        >
            <Icon icon="mdi:database-cog" className="w-6 h-6" />
        </Link>
    );
}
