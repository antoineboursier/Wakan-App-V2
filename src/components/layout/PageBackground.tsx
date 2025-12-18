import React from "react";
import Image from "next/image";

interface PageBackgroundProps {
    imageSrc: string;
    alt?: string;
}

export function PageBackground({ imageSrc, alt = "Background" }: PageBackgroundProps) {
    return (
        <div
            className="fixed inset-0 z-0 select-none pointer-events-none h-[100dvh]"
            id="page-background-container"
            aria-hidden="true"
        >
            {/* Layer 1: Solid Base Color */}
            <div
                className="absolute inset-0 bg-[var(--background-900)]"
                id="bg-layer-solid"
            />

            {/* Layer 2: Background Image (Opacity 80%) */}
            <div
                className="absolute inset-0 opacity-80"
                id="bg-layer-image"
            >
                <Image
                    src={imageSrc}
                    alt={alt}
                    fill
                    className="object-cover object-center"
                    quality={90}
                    priority
                />
            </div>

            {/* Layer 3: Gradient Mask (Fade out top/bottom) */}
            {/* 0% -> Opacity 1 (Solid 900) */}
            {/* 50% -> Opacity 0 (Transparent - reveals image) */}
            {/* 100% -> Opacity 1 (Solid 900) */}
            <div
                className="absolute inset-0"
                id="bg-layer-gradient"
                style={{
                    background: `linear-gradient(180deg, 
            var(--background-900) 0%, 
            rgba(24, 39, 46, 0) 50%, 
            var(--background-900) 100%
          )`
                }}
            />
        </div>
    );
}
