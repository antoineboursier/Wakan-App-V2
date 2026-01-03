"use client";

import { motion } from "framer-motion";

export function Loader({ className }: { className?: string }) {
    return (
        <svg
            width="61"
            height="38"
            viewBox="0 0 61 38"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={`overflow-visible ${className || ''}`}
        >
            <style>{`
                @keyframes loader-spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .loader-spin-slow {
                    animation: loader-spin 6s linear infinite;
                    transform-origin: 30px 19.0618px;
                }
                .loader-spin-fast {
                    animation: loader-spin 3s linear infinite;
                    transform-origin: 30px 19.0618px;
                }
            `}</style>

            {/* Center Dot - Stable */}
            <circle id="loader-center-dot" cx="30" cy="19.0618" r="2.5" fill="#F4EFEB" />

            {/* Inner Ring (Gold Strong) - Swaps with Middle */}
            <motion.circle
                id="loader-ring-inner"
                cx="30" cy="19.0618"
                stroke="#F6AE31"
                strokeWidth="1.5"
                animate={{
                    r: [8.75, 16.25, 8.75],
                    strokeWidth: [1.5, 0.5, 1.5],
                    opacity: [1, 0.2, 1]
                }}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            />

            {/* Middle Ring (Gold Soft) - Swaps with Inner */}
            <motion.circle
                id="loader-ring-middle"
                cx="30" cy="19.0618"
                stroke="#F5CE8A"
                strokeWidth="0.5"
                animate={{
                    r: [14.25, 6.75, 14.25],
                    strokeWidth: [0.5, 1.5, 0.5],
                    opacity: [0.7, 1, 0.7]
                }}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            />

            {/* Outer Ring (Dashed) - Continuous Spin via CSS */}
            <circle
                id="loader-ring-outer"
                className="loader-spin-slow"
                cx="30" cy="19.0618" r="17.5"
                stroke="#F1BA5B"
                strokeLinecap="round"
                strokeDasharray="2 3"
            />

            {/* Orbital Dots - Rotation around center via CSS */}
            <g className="loader-spin-fast">
                <circle id="loader-dot-left" cx="2" cy="19.0618" r="1.5" fill="#F4EFEB" />
                <circle id="loader-dot-right" cx="59" cy="19.0618" r="1.5" fill="#F4EFEB" />
            </g>
        </svg>
    );
}
