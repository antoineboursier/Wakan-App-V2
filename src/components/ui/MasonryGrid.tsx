"use client";

import React, { ReactNode, useEffect, useState, useRef } from "react";

interface MasonryGridProps {
    children: ReactNode;
    className?: string;
}

export function MasonryGrid({ children, className = "" }: MasonryGridProps) {
    const [columns, setColumns] = useState(1);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const updateColumns = () => {
            const width = window.innerWidth;
            // Breakpoints optimisés pour masonry avec largeur max 1200px
            if (width >= 1024) {
                setColumns(3); // 3 colonnes sur grands écrans
            } else if (width >= 700) {
                setColumns(2); // 2 colonnes au-dessus de 700px
            } else {
                setColumns(1); // 1 colonne sur mobile
            }
        };

        updateColumns();
        window.addEventListener("resize", updateColumns);
        return () => window.removeEventListener("resize", updateColumns);
    }, []);

    const items = React.Children.toArray(children);

    // Distribution "intelligente" pour minimiser les écarts de hauteur
    // On répartit les items dans la colonne la plus courte
    const distributeItems = () => {
        const columnHeights = Array(columns).fill(0);
        const columnItems: ReactNode[][] = Array.from({ length: columns }, () => []);

        items.forEach((item, index) => {
            // Trouver la colonne avec la hauteur minimale
            const minHeightIndex = columnHeights.indexOf(Math.min(...columnHeights));

            // Ajouter l'item à cette colonne
            columnItems[minHeightIndex].push(item);

            // Incrémenter la hauteur (approximation par index pour distribution uniforme)
            // Dans un vrai masonry, on mesurerait la hauteur réelle après le rendu
            columnHeights[minHeightIndex] += 1;
        });

        return columnItems;
    };

    const columnWrapper = distributeItems();

    return (
        <div
            ref={containerRef}
            className={`w-full max-w-[1200px] mx-auto px-4 ${className}`}
        >
            <div className="flex gap-4 md:gap-6 items-start justify-center">
                {columnWrapper.map((col, colIndex) => (
                    <div
                        key={colIndex}
                        className="flex flex-col gap-4 md:gap-6 flex-1 min-w-0"
                        style={{
                            // Chaque colonne prend un espace égal
                            maxWidth: columns === 1 ? '100%' : columns === 2 ? '500px' : '380px'
                        }}
                    >
                        {col.map((item, itemIndex) => (
                            <div key={itemIndex} className="w-full">
                                {item}
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}
