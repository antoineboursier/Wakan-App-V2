"use client";

import React from "react";

export function WakanLogo() {
    // Centre du logo pour la rotation (cx="70.558" cy="60.6258")
    const centerOrigin = "70.558px 60.6258px";

    return (
        <div className="relative w-48 h-auto flex items-center justify-center select-none mb-32" aria-label="Logo Wakan">
            <svg
                width="90%"
                height="90%"
                viewBox="0 0 120 120"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="overflow-visible"
            >
                <defs>
                    <filter id="filter0_d_180_1400" x="93.459" y="30.5024" width="47.2388" height="65.0673" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                        <feFlood floodOpacity="0" result="BackgroundImageFix" />
                        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                        <feOffset dy="2.18009" />
                        <feGaussianBlur stdDeviation="6.54028" />
                        <feComposite in2="hardAlpha" operator="out" />
                        <feColorMatrix type="matrix" values="0 0 0 0 0.0941176 0 0 0 0 0.152941 0 0 0 0 0.180392 0 0 0 0.6 0" />
                        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_180_1400" />
                        <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_180_1400" result="shape" />
                    </filter>
                    <filter id="filter1_d_180_1400" x="0.302487" y="30.5024" width="59.7907" height="65.0673" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                        <feFlood floodOpacity="0" result="BackgroundImageFix" />
                        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                        <feOffset dy="2.18009" />
                        <feGaussianBlur stdDeviation="6.54028" />
                        <feComposite in2="hardAlpha" operator="out" />
                        <feColorMatrix type="matrix" values="0 0 0 0 0.0941176 0 0 0 0 0.152941 0 0 0 0 0.180392 0 0 0 0.6 0" />
                        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_180_1400" />
                        <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_180_1400" result="shape" />
                    </filter>
                    <filter id="filter2_d_180_1400" x="72.2646" y="30.5024" width="48.4154" height="65.0673" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                        <feFlood floodOpacity="0" result="BackgroundImageFix" />
                        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                        <feOffset dy="2.18009" />
                        <feGaussianBlur stdDeviation="6.54028" />
                        <feComposite in2="hardAlpha" operator="out" />
                        <feColorMatrix type="matrix" values="0 0 0 0 0.0941176 0 0 0 0 0.152941 0 0 0 0 0.180392 0 0 0 0.6 0" />
                        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_180_1400" />
                        <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_180_1400" result="shape" />
                    </filter>
                    <filter id="filter3_d_180_1400" x="29.827" y="30.5024" width="48.4154" height="65.0673" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                        <feFlood floodOpacity="0" result="BackgroundImageFix" />
                        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                        <feOffset dy="2.18009" />
                        <feGaussianBlur stdDeviation="6.54028" />
                        <feComposite in2="hardAlpha" operator="out" />
                        <feColorMatrix type="matrix" values="0 0 0 0 0.0941176 0 0 0 0 0.152941 0 0 0 0 0.180392 0 0 0 0.6 0" />
                        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_180_1400" />
                        <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_180_1400" result="shape" />
                    </filter>
                    <filter id="filter4_d_180_1400" x="51.563" y="30.5024" width="49.8939" height="65.0673" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                        <feFlood floodOpacity="0" result="BackgroundImageFix" />
                        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                        <feOffset dy="2.18009" />
                        <feGaussianBlur stdDeviation="6.54028" />
                        <feComposite in2="hardAlpha" operator="out" />
                        <feColorMatrix type="matrix" values="0 0 0 0 0.0941176 0 0 0 0 0.152941 0 0 0 0 0.180392 0 0 0 0.6 0" />
                        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_180_1400" />
                        <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_180_1400" result="shape" />
                    </filter>
                </defs>

                {/* Cercle Extérieur (Bleu) - Heartbeat Lent */}
                <path
                    className="animate-heartbeat"
                    style={{ transformOrigin: centerOrigin }}
                    d="M101.594 60.6256C101.594 77.7661 87.6988 91.6612 70.5584 91.6612C53.4179 91.6612 39.5229 77.7661 39.5229 60.6256C39.5229 43.4852 53.4179 29.5901 70.5584 29.5901C87.6988 29.5901 101.594 43.4852 101.594 60.6256Z"
                    stroke="#467990"
                    strokeWidth="1.63507"
                />

                {/* Cercle Intermédiaire (Orange) - Animation Reverse */}
                <path
                    className="animate-shrink-grow"
                    style={{ transformOrigin: centerOrigin }}
                    d="M96.7169 60.6258C96.7169 75.0729 85.0052 86.7846 70.5581 86.7846C56.111 86.7846 44.3993 75.0729 44.3993 60.6258C44.3993 46.1788 56.111 34.4671 70.5581 34.4671C85.0052 34.4671 96.7169 46.1788 96.7169 60.6258Z"
                    stroke="#F6AE31"
                    strokeWidth="0.545024"
                />

                {/* Cercle Interne (Bleu) - Shrink Grow avec délai */}
                <path
                    className="animate-shrink-grow"
                    style={{ transformOrigin: centerOrigin }}
                    d="M113.66 60.6256C113.66 84.4301 94.363 103.727 70.5585 103.727C46.754 103.727 27.4566 84.4301 27.4566 60.6256C27.4566 36.8211 46.754 17.5237 70.5585 17.5237C94.363 17.5237 113.66 36.8211 113.66 60.6256Z"
                    stroke="#467990"
                    strokeWidth="0.545024"
                />

                {/* Ellipse Pointillée (Orange) - Animation Clockwise */}
                <ellipse
                    className="animate-spin"
                    style={{ transformOrigin: centerOrigin }}
                    cx="70.558" cy="60.6258" rx="35.2417" ry="35.2417"
                    stroke="#F6AE31"
                    strokeWidth="1.09005"
                    strokeLinecap="round"
                    strokeDasharray="1.09 2.73"
                />

                {/* Oiseau et Formes Centrales */}
                <path className="animate-shrink-grow-slow" fillRule="evenodd" clipRule="evenodd" d="M78.1714 81.3776C89.6841 77.0733 95.5277 64.2511 91.2234 52.7384C86.9191 41.2257 74.0969 35.3821 62.5842 39.6864C51.0715 43.9907 45.228 56.8129 49.5322 68.3256C53.8365 79.8383 66.6587 85.6818 78.1714 81.3776ZM62.8186 63.3584C59.379 54.1585 64.0174 43.9163 73.1822 40.4243C69.9435 39.9697 66.5483 40.2932 63.2696 41.519C52.769 45.4449 47.4392 57.1398 51.365 67.6404C55.2909 78.141 66.9859 83.4709 77.4865 79.545C80.7651 78.3192 83.5396 76.336 85.6857 73.8683C76.478 77.2452 66.2581 72.5581 62.8186 63.3584Z" fill="#F6AE31" />

                {/* Lettres WAKAN avec filtres */}
                <g filter="url(#filter0_d_180_1400)">
                    <path d="M112.628 80.309H107.031C106.74 80.309 106.594 80.1816 106.594 79.9267L106.54 41.8397C106.54 41.5484 106.685 41.4028 106.976 41.4028H112.027L121.474 63.436L121.201 41.8397C121.201 41.5484 121.365 41.4028 121.692 41.4028H127.235C127.453 41.4028 127.563 41.5484 127.563 41.8397L127.617 79.9813C127.617 80.1998 127.526 80.309 127.344 80.309H122.43L112.737 59.7228L113.147 79.8721C113.147 80.1634 112.974 80.309 112.628 80.309Z" fill="#F4EFEB" />
                </g>
                <g filter="url(#filter1_d_180_1400)">
                    <path d="M27.0453 80.309H20.2742C20.1104 80.309 20.0194 80.218 20.0012 80.0359L13.394 41.6213C13.3576 41.4756 13.4122 41.4028 13.5578 41.4028H19.8374C19.983 41.4028 20.074 41.4756 20.1104 41.6213L23.687 66.8761L27.3729 41.6213C27.4093 41.4756 27.5185 41.4028 27.7005 41.4028H32.7515C32.8971 41.4028 32.9881 41.4756 33.0245 41.6213L36.6558 66.8761L40.287 41.6213C40.3234 41.4756 40.4144 41.4028 40.56 41.4028H46.785C46.967 41.4028 47.0398 41.4756 47.0034 41.6213L40.3416 80.0359C40.3234 80.1088 40.2688 80.1725 40.1778 80.2271L40.0686 80.309H33.2975C33.1883 80.309 33.0973 80.218 33.0245 80.0359L30.1577 59.9686L27.3183 80.0359C27.3001 80.218 27.2091 80.309 27.0453 80.309Z" fill="#F4EFEB" />
                </g>
                <g filter="url(#filter2_d_180_1400)">
                    <path d="M85.3452 80.0359L92.2801 41.6213C92.3165 41.4756 92.4075 41.4028 92.5531 41.4028H100.662C100.808 41.4028 100.899 41.4756 100.935 41.6213L107.597 80.0359C107.615 80.218 107.542 80.309 107.378 80.309H101.181C100.999 80.309 100.899 80.218 100.88 80.0359L100.28 75.9406H92.6623L92.0616 80.0359C92.0434 80.218 91.9524 80.309 91.7886 80.309H85.5636C85.418 80.309 85.3452 80.218 85.3452 80.0359ZM96.2935 54.2623L93.7817 69.9613H99.1603L96.8669 54.2623L96.5393 52.1873L96.2935 54.2623Z" fill="#F4EFEB" />
                </g>
                <g filter="url(#filter3_d_180_1400)">
                    <path d="M42.9076 80.0359L49.8424 41.6213C49.8788 41.4756 49.9699 41.4028 50.1155 41.4028H58.2243C58.3699 41.4028 58.4609 41.4756 58.4974 41.6213L65.1592 80.0359C65.1774 80.218 65.1046 80.309 64.9408 80.309H58.7431C58.5611 80.309 58.4609 80.218 58.4427 80.0359L57.8421 75.9406H50.2247L49.624 80.0359C49.6058 80.218 49.5148 80.309 49.351 80.309H43.126C42.9804 80.309 42.9076 80.218 42.9076 80.0359ZM53.8559 54.2623L51.3441 69.9613H56.7227L54.4293 54.2623L54.1016 52.1873L53.8559 54.2623Z" fill="#F4EFEB" />
                </g>
                <g className="animate-heartbeat" filter="url(#filter4_d_180_1400)">
                    <path d="M71.1962 80.309H64.862C64.7164 80.309 64.6436 80.218 64.6436 80.0359L64.7528 41.6759C64.7528 41.4938 64.8256 41.4028 64.9712 41.4028H71.2508C71.3964 41.4028 71.4692 41.4938 71.4692 41.6759V54.9176L80.2333 41.6213C80.3789 41.4756 80.5154 41.4028 80.6429 41.4028H87.059C87.2228 41.4028 87.2592 41.4756 87.1682 41.6213L77.5031 57.0472L88.3422 80.0906C88.4332 80.2362 88.3422 80.309 88.0691 80.309H81.2435C81.0615 80.309 80.9523 80.2362 80.9159 80.0906L73.3531 63.6544L71.4146 66.7123V80.0359C71.4146 80.218 71.3418 80.309 71.1962 80.309Z" fill="#F4EFEB" />
                </g>

                {/* Oiseau */}
                <path d="M64.5753 7.31007C62.082 5.44942 53.3369 2.50959 48.8713 2.39795C48.8713 3.77483 53.6718 5.33778 56.9094 8.53811C54.5153 8.45127 50.5162 8.53066 53.6718 9.54286C56.8275 10.5551 59.4523 12.7928 60.3702 13.7851C59.1794 14.455 60.519 15.6086 61.561 16.0179C62.3946 16.3454 64.6125 17.494 65.6172 18.0274C66.0266 19.2555 67.2918 21.3394 68.5198 22.9023C69.7479 24.4653 70.1572 24.0187 71.3108 24.5025C72.4644 24.9863 72.0179 26.0655 72.1667 26.2143C72.3156 26.3632 73.7669 26.2515 74.1762 26.2143C74.5856 26.1771 75.0693 27.033 75.5159 27.033C75.9625 27.033 76.4462 24.1304 76.7811 23.5722C77.1161 23.014 77.1161 22.0092 78.9395 22.5674C80.7629 23.1256 83.6656 23.3489 83.4795 22.5674C83.2934 21.786 77.5998 15.683 75.5159 14.455C73.8488 13.4726 71.1248 14.5666 69.9712 15.2365C69.0036 13.2145 66.5699 8.7986 64.5753 7.31007Z" fill="#F4EFEB" />
                <ellipse cx="74.8831" cy="18.8463" rx="0.930327" ry="0.930327" fill="#1C3039" />
                <path d="M81.7673 5.56114C81.1347 6.45426 77.3017 11.0687 75.2178 13.8969C75.379 13.9341 75.776 14.0606 76.0737 14.269C76.3714 14.4774 77.2149 15.2738 77.5994 15.6459C78.4181 14.7156 80.1597 12.7879 80.5765 12.52C81.0974 12.1851 85.3397 9.91507 85.8607 9.61737C86.2775 9.3792 85.4638 8.74906 85.0048 8.46376C85.6374 7.64507 88.6145 6.15655 89.9169 5.97049C91.2194 5.78442 93.7127 5.56114 92.0381 4.81688C90.3635 4.07262 88.0563 4.66803 87.9446 4.10983C87.833 3.55164 92.1125 1.09557 92.7079 0.165246C93.3033 -0.765081 84.9304 2.50967 83.814 3.10508C82.6976 3.70049 82.3999 4.66803 81.7673 5.56114Z" fill="#F4EFEB" />
                <path d="M64.7611 22.7908C64.0541 22.8652 61.598 27.7401 61.598 28.4472C60.7545 27.9758 58.7326 27.0256 57.3929 26.9958C55.7183 26.9586 53.2995 28.4472 53.039 29.117C52.7785 29.7868 57.7651 30.7544 60.2583 31.4614C62.7516 32.1685 61.598 33.3965 63.5703 34.2896C65.5426 35.1827 65.1332 33.2849 65.5054 32.5778C65.8775 31.8708 65.096 30.6799 64.7611 29.117C64.4262 27.554 65.4682 22.7163 64.7611 22.7908Z" fill="#F4EFEB" />
            </svg>
        </div>
    );
}
