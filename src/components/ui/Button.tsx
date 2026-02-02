import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary";
    /** Icône optionnelle à afficher à droite du texte (par défaut) */
    icon?: React.ReactNode;
    /** Si true, le bouton prend la largeur 100% du conteneur */
    fullWidth?: boolean;
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
    fullWidth,
    ...props
}: ButtonProps) {

    // Choix de la classe de base selon la variante
    const baseClass = variant === "primary" ? "btn-wakan-primary" : "btn-wakan-secondary";
    // Largeur: full -> w-full + flex (pour écraser inline-flex), sinon w-fit par défaut
    // Utilisation de ! pour surcharger le display: inline-flex du CSS global si nécessaire
    const widthClass = fullWidth ? "!flex" : "w-fit";

    return (
        <button
            className={`${baseClass} ${widthClass} ${className || ""}`}
            disabled={disabled}
            {...props}
        >
            {/* Le texte */}
            <span>{children}</span>

            {/* L'icône (si présente) */}
            {icon && (
                <span className="flex items-center justify-center shrink-0 w-5 h-5 text-current" aria-hidden="true">
                    {icon}
                </span>
            )}
        </button>
    );
}
