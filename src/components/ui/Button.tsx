import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary";
    /** Icône optionnelle à afficher à droite du texte (par défaut) */
    icon?: React.ReactNode;
}

/**
 * Composant Button Wakan
 * Utilise les classes .btn-wakan-primary et .btn-wakan-secondary définies dans globals.css
 */
export function Button({
    variant = "primary",
    icon,
    className,
    children,
    disabled,
    ...props
}: ButtonProps) {

    // Choix de la classe de base selon la variante
    const baseClass = variant === "primary" ? "btn-wakan-primary" : "btn-wakan-secondary";

    return (
        <button
            className={`${baseClass} ${className || ""}`}
            disabled={disabled}
            {...props}
        >
            {/* Le texte */}
            <span>{children}</span>

            {/* L'icône (si présente) */}
            {icon && (
                <span className="flex items-center justify-center shrink-0 w-5 h-5" aria-hidden="true">
                    {icon}
                </span>
            )}
        </button>
    );
}
