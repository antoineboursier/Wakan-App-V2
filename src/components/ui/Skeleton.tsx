import React from 'react';

interface SkeletonProps {
    className?: string;
    rounded?: boolean;
    shimmer?: boolean;
}

export function Skeleton({ className = '', rounded = false, shimmer = true }: SkeletonProps) {
    return (
        <div
            className={`
                bg-gradient-to-r from-[#18272E] via-[#1C3039] to-[#18272E] 
                ${shimmer ? 'animate-shimmer bg-[length:200%_100%]' : ''}
                ${rounded ? 'rounded-lg' : ''}
                ${className}
            `}
            aria-hidden="true"
        />
    );
}

/**
 * Skeleton spécifique pour les cards astrales
 */
export function AstralCardSkeleton({ className = '' }: { className?: string }) {
    return (
        <div className={`flex flex-col items-center bg-[#18272E] backdrop-blur-[2px] rounded-lg overflow-hidden ${className}`}>
            {/* Hero Image Skeleton */}
            <Skeleton className="h-[300px] md:h-[400px] w-full" rounded={false} />

            {/* Content Skeleton */}
            <div className="flex flex-col items-center gap-6 p-6 w-full -mt-10 relative z-10">
                {/* Icon */}
                <Skeleton className="w-10 h-10 rounded-full" />

                {/* Title */}
                <Skeleton className="h-8 w-32" rounded />

                {/* Legend */}
                <Skeleton className="h-4 w-48" rounded />

                {/* Description */}
                <div className="w-full space-y-2">
                    <Skeleton className="h-4 w-full" rounded />
                    <Skeleton className="h-4 w-5/6" rounded />
                    <Skeleton className="h-4 w-4/6" rounded />
                </div>
            </div>
        </div>
    );
}
