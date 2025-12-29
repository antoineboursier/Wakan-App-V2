"use client";

import { Icon } from "@iconify/react";

interface ShareButtonProps {
    title: string;
    text: string;
    url?: string;
    className?: string;
}

export function ShareButton({ title, text, url, className = "" }: ShareButtonProps) {
    const handleShare = async () => {
        const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '');

        const shareData = {
            title,
            text,
            url: shareUrl,
        };

        if (navigator.share) {
            try {
                await navigator.share(shareData);
            } catch (err) {
                // User cancelled or share failed
                console.log('Share cancelled:', err);
            }
        } else {
            // Fallback: copy to clipboard
            try {
                await navigator.clipboard.writeText(`${text}\n${shareUrl}`);
                alert('Lien copié dans le presse-papier !');
            } catch {
                alert('Impossible de partager');
            }
        }
    };

    return (
        <button
            type="button"
            onClick={handleShare}
            className={`flex items-center gap-[var(--sizes-xs)] text-[var(--text-secondary)] hover:text-[var(--accent-500)] transition-colors ${className}`}
            aria-label="Partager"
        >
            <Icon icon="solar:share-bold" width="20" />
            <span className="para-lit pt-[4px]">Partager</span>
        </button>
    );
}
