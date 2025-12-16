import React from 'react';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    className?: string;
    variant?: 'default' | 'dark' | 'highlight'; // Pour plus tard si besoin
}

export function GlassCard({ children, className = '', style, variant = 'default', ...props }: GlassCardProps) {

    // Styles de base communs
    const baseStyles: React.CSSProperties = {
        background: "linear-gradient(145deg, rgba(30, 41, 59, 0.7), rgba(15, 23, 42, 0.9))",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(255,255,255,0.08)",
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
    };

    return (
        <div
            className={`rounded-lg relative overflow-hidden ${className}`}
            style={{ ...baseStyles, ...style }}
            {...props}
        >
            {children}
        </div>
    );
}
