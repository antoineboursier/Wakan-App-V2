import React from 'react';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    className?: string;
    variant?: 'default' | 'dark' | 'highlight';
}

export function GlassCard({ children, className = '', style, variant = 'default', ...props }: GlassCardProps) {

    // Removed default inline styles (baseStyles) to allow full control via className.
    // The previously enforced background gradient prevented overriding with bg utility classes.

    // Usage Note:
    // If you want the "default" glass look, apply appropriate Tailwind classes (e.g., backdrop-blur, bg-white/10) 
    // or pass inclusive inline styles in the implementation.

    return (
        <div
            className={`rounded-lg relative overflow-hidden border border-white/10 ${className}`}
            style={style}
            {...props}
        >
            {children}
        </div>
    );
}
