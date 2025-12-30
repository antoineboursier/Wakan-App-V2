"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";

interface BackButtonProps {
    href?: string; // If provided, will navigate to this URL instead of going back
    onClick?: () => void;
    label?: string;
    className?: string;
    useNativeBack?: boolean; // If true (default), uses router.back()
    variant?: "default" | "close";
}

export function BackButton({
    href,
    onClick,
    label = "Retour",
    className = "",
    useNativeBack = true,
    variant = "default"
}: BackButtonProps) {
    const router = useRouter();

    const isClose = variant === "close";
    const IconPath = isClose
        ? <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z" fill="currentColor" />
        : <path fillRule="evenodd" clipRule="evenodd" d="M12.7381 7.82912C13.2358 7.52036 13.3672 6.89884 13.0316 6.44093C12.696 5.98302 12.0204 5.86211 11.5227 6.17087L4.47422 10.5433C3.61086 11.0789 3.50703 12.2117 4.26072 12.8727L9.79173 17.7238C10.2262 18.1049 10.9143 18.0898 11.3285 17.69C11.7427 17.2903 11.7263 16.6573 11.2918 16.2762L7.55638 13L18.6521 13C19.2524 13 19.7391 12.5523 19.7391 12C19.7391 11.4477 19.2524 11 18.6521 11L7.62654 11L12.7381 7.82912Z" fill="currentColor" />;

    const buttonContent = (
        <>
            {/* SVG avec couleur contrôlée par currentColor */}
            <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="shrink-0"
            >
                {IconPath}
            </svg>
            {label && (
                <span className="para-lit pt-[4px]" style={{ color: 'var(--text-secondary)' }}>
                    {label}
                </span>
            )}
        </>
    );

    const baseStyles = "flex items-center gap-[var(--sizes-xs)] flex-1 self-stretch text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors";

    // Custom onClick handler
    if (onClick) {
        return (
            <button
                type="button"
                onClick={onClick}
                className={`${baseStyles} ${className}`}
            >
                {buttonContent}
            </button>
        );
    }

    // Native back navigation (preferred for sub-pages)
    if (useNativeBack && !href) {
        return (
            <button
                type="button"
                onClick={() => router.back()}
                className={`${baseStyles} ${className}`}
            >
                {buttonContent}
            </button>
        );
    }

    // Link to specific URL
    return (
        <Link href={href || "/"} className={`${baseStyles} ${className}`}>
            {buttonContent}
        </Link>
    );
}
