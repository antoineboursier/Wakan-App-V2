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
        ? <path fillRule="evenodd" clipRule="evenodd" d="M12.0001 9.87801L17.3031 4.57501C17.5845 4.29362 17.9661 4.13553 18.3641 4.13553C18.762 4.13553 19.1437 4.29362 19.4251 4.57501C19.7065 4.85641 19.8646 5.23806 19.8646 5.63601C19.8646 6.03396 19.7065 6.41562 19.4251 6.69701L14.1201 12L19.4241 17.303C19.5634 17.4423 19.6738 17.6077 19.7492 17.7898C19.8245 17.9718 19.8633 18.1669 19.8632 18.3639C19.8632 18.5609 19.8243 18.7559 19.7489 18.9379C19.6735 19.1199 19.5629 19.2852 19.4236 19.4245C19.2843 19.5638 19.1189 19.6742 18.9368 19.7496C18.7548 19.8249 18.5597 19.8637 18.3627 19.8636C18.1657 19.8636 17.9707 19.8247 17.7887 19.7493C17.6067 19.6739 17.4414 19.5633 17.3021 19.424L12.0001 14.121L6.69709 19.424C6.55879 19.5673 6.39333 19.6817 6.21036 19.7604C6.02739 19.8391 5.83058 19.8806 5.63141 19.8824C5.43224 19.8842 5.23471 19.8463 5.05033 19.771C4.86595 19.6957 4.69842 19.5844 4.55752 19.4436C4.41661 19.3028 4.30515 19.1354 4.22964 18.9511C4.15414 18.7668 4.11609 18.5693 4.11773 18.3701C4.11936 18.171 4.16065 17.9741 4.23917 17.7911C4.3177 17.608 4.43189 17.4425 4.57509 17.304L9.88009 12L4.57609 6.69601C4.43289 6.55757 4.3187 6.392 4.24017 6.20896C4.16165 6.02592 4.12036 5.82907 4.11873 5.6299C4.11709 5.43073 4.15514 5.23323 4.23064 5.04892C4.30615 4.86461 4.41761 4.69719 4.55852 4.55642C4.69942 4.41565 4.86695 4.30435 5.05133 4.22901C5.23571 4.15368 5.43324 4.11582 5.63241 4.11764C5.83158 4.11946 6.02839 4.16094 6.21136 4.23963C6.39433 4.31833 6.55979 4.43268 6.69809 4.57601L12.0001 9.87801Z" fill="currentColor" />
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
