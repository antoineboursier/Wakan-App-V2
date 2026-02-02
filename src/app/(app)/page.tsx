"use client";

import { PageBackground } from "@/components/layout/PageBackground";
import { PremiumCard } from "@/components/ui/PremiumCard";
import { Separator } from "@/components/ui/Separator";
import { WakanLogo } from "@/components/ui/WakanLogo";
import { Button } from "@/components/ui/Button";
import Image from "next/image";
import { Icon } from "@iconify/react";
import { GlassCard } from "@/components/ui/GlassCard";


import { useState, useEffect, useRef } from "react";
import { useUserProfile } from "@/hooks/useUserProfile";

export default function DashboardPage() {
  const { profile, isLoaded } = useUserProfile();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [lunarData, setLunarData] = useState<any>(null);
  const dateInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function fetchLunarData() {
      try {
        // Formater la date sélectionnée en YYYY-MM-DD
        const dateStr = selectedDate.toISOString().split('T')[0];

        // Appeler l'API avec le paramètre date
        const res = await fetch(`/api/dashboard?date=${dateStr}`);
        if (res.ok) {
          const data = await res.json();
          setLunarData(data);
        }
      } catch (error) {
        console.error("Failed to fetch lunar data", error);
      }
    }
    fetchLunarData();
  }, [selectedDate]);

  const handlePrevDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() - 1);
    setSelectedDate(newDate);
  };

  const handleNextDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() + 1);
    setSelectedDate(newDate);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(date);
  };

  return (
    <div className="min-h-screen font-body relative" id="dashboard-page">

      {/* --- BACKGROUND SYSTEM --- */}
      <PageBackground imageSrc="/backgrounds/home.png" alt="Dashboard Cactus Moon" />

      {/* --- HEADER (LOGO) --- */}
      <header className="relative w-full z-20 flex justify-center mt-16" id="dashboard-header">
        <h1 className="sr-only">Wakan - Tableau de bord</h1>
        <div className="flex flex-col items-center gap-2">
          {isLoaded && (
            <span className="title-lit text-[var(--accent-500)] animate-in fade-in slide-in-from-top-2">
              Bonjour {profile.firstName || 'Voyageur'}
            </span>
          )}
          {process.env.NEXT_PUBLIC_APP_VERSION && (
            <span className="legend text-[var(--text-tertiary)] opacity-60">
              v.{process.env.NEXT_PUBLIC_APP_VERSION}
            </span>
          )}
          {/* Composant Logo Animé */}
          <WakanLogo />
        </div>
      </header>

      {/* --- MAIN CONTENT --- */}
      <div id="dashboard-main" className="relative z-10 w-full max-w-md mx-auto flex flex-col gap-6 px-4">

        {/* --- DATE SELECTOR --- */}
        <div className="w-full flex items-center justify-between mb-6 px-1">
          <button
            onClick={handlePrevDay}
            className="p-2 rounded-full text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--background-600)] transition-colors"
            aria-label="Jour précédent"
          >
            <Icon icon="el:chevron-left" width="24" height="24" />
          </button>

          <div
            onClick={() => dateInputRef.current?.showPicker?.()}
            className="relative flex items-center justify-center px-6 py-2 rounded-[16px] bg-[var(--background-800)] border border-[var(--background-500)] shadow-inner text-[var(--text-primary)] font-body para capitalize w-full mx-3 text-center overflow-hidden cursor-pointer"
            style={{
              boxShadow: "inset 0 1px 2px rgba(0,0,0,0.2)"
            }}
          >
            {/* Input Date Natif Invisible (Overlay) */}
            <input
              ref={dateInputRef}
              type="date"
              value={selectedDate.toISOString().split('T')[0]}
              onChange={(e) => {
                if (e.target.value) {
                  setSelectedDate(new Date(e.target.value));
                }
              }}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10
                [&::-webkit-calendar-picker-indicator]:opacity-0
                [&::-webkit-calendar-picker-indicator]:absolute
                [&::-webkit-calendar-picker-indicator]:inset-0
                [&::-webkit-calendar-picker-indicator]:w-full
                [&::-webkit-calendar-picker-indicator]:h-full
                [&::-webkit-calendar-picker-indicator]:cursor-pointer
              "
              aria-label="Choisir une date"
            />

            {/* Affichage Stylisé (Visible) */}
            <div className="pointer-events-none flex items-center justify-center gap-2">
              <span>{formatDate(selectedDate)}</span>
              <Icon
                icon="bxs:calendar"
                width="20"
                height="20"
                className="text-[var(--text-secondary)] opacity-80"
              />
            </div>
          </div>

          <button
            onClick={handleNextDay}
            className="p-2 rounded-full text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--background-600)] transition-colors"
            aria-label="Jour suivant"
          >
            <Icon icon="el:chevron-right" width="24" height="24" />
          </button>
        </div>

        {/* ZONE B: Moon Cards */}
        <section id="zone-b-moon-dashboard" className="grid grid-cols-2 gap-3 w-full">

          {/* Col 1: Cycle Day + Distance */}
          <div className="flex flex-col gap-3">

            {/* Widget Cycle Day */}
            <GlassCard
              id="widget-moon-cycle"
              className="flex flex-col items-center justify-center p-2 h-40 border-none"
              style={{
                background: 'linear-gradient(180deg, rgba(24, 39, 46, 0.30) 0%, rgba(24, 39, 46, 0.60) 50%, rgba(24, 39, 46, 0.90) 100%)',
                backdropFilter: 'blur(4px)',
                WebkitBackdropFilter: 'blur(4px)'
              }}
            >
              <div className="relative w-28 h-28 flex items-center justify-center">
                {/* Dynamique SVG Circle */}
                <svg className="absolute inset-0 w-full h-full overflow-visible -rotate-90 transform transition-all duration-1000 ease-out" viewBox="0 0 100 100">
                  <defs>
                    <linearGradient id="cycleGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="var(--rich-yellow)" />
                      <stop offset="100%" stopColor="var(--accent-700)" />
                    </linearGradient>
                  </defs>
                  <circle cx="50" cy="50" r="40" stroke="rgba(255,255,255,0.05)" strokeWidth="4" fill="none" />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="url(#cycleGradient)"
                    strokeWidth="4"
                    fill="none"
                    strokeLinecap="round"
                    className="effect-glow-yellow"
                    style={{
                      strokeDasharray: 251.2,
                      strokeDashoffset: 251.2 - (251.2 * ((lunarData?.cycle_day || 0) / 29.5)),
                      transition: "stroke-dashoffset 1.5s ease-out"
                    }}
                  />
                </svg>

                <div className="text-center z-10 flex flex-col items-center leading-tight">
                  <span className="title-med text-[var(--text-primary)] drop-shadow-lg">
                    J{lunarData?.cycle_day ?? "-"}
                  </span>
                  <span className="para-lit text-[var(--text-secondary)] w-16 leading-3 opacity-80">du cycle lunaire</span>
                </div>
              </div>
            </GlassCard>

            {/* Widget Distance (Périgée/Apogée) */}
            <GlassCard
              id="widget-distance"
              className="flex items-center justify-between px-5 py-0 h-16 border-none"
              style={{
                background: 'linear-gradient(180deg, rgba(24, 39, 46, 0.30) 0%, rgba(24, 39, 46, 0.60) 50%, rgba(24, 39, 46, 0.90) 100%)',
                backdropFilter: 'blur(4px)',
                WebkitBackdropFilter: 'blur(4px)'
              }}
            >
              <span className={`para-lit w-12 text-left transition-colors duration-300 ${(lunarData?.perigee_apogee_ratio ?? 0.5) < 0.4 ? 'text-[var(--text-primary)]' : (lunarData?.perigee_apogee_ratio ?? 0.5) > 0.6 ? 'text-[var(--text-tertiary)]' : 'text-[var(--text-secondary)]'}`}>Périgée</span>

              {/* Simple Line Slider */}
              <div className="flex-1 mx-2 h-full flex items-center relative">
                <div className="w-full h-[2px] bg-[var(--text-tertiary)] opacity-20 rounded-full"></div>
                {/* Dot Indicator */}
                <div
                  id="distance-indicator"
                  className="absolute top-1/2 w-4 h-4 bg-[rgba(246,174,49,0.4)] rounded-full shadow-[0_0_10px_rgba(246,174,49,0.6)] border border-[var(--rich-yellow)] z-10"
                  style={{
                    left: `${(lunarData?.perigee_apogee_ratio ?? 0.5) * 100}%`,
                    transform: `translate(-50%, -50%) scale(${1.4 - ((lunarData?.perigee_apogee_ratio ?? 0.5) * 0.6)})`,
                    transition: "left 30ms ease-out, transform 30ms ease-out"
                  }}
                ></div>
              </div>

              <span className={`para-lit w-12 text-right transition-colors duration-300 ${(lunarData?.perigee_apogee_ratio ?? 0.5) > 0.6 ? 'text-[var(--text-primary)]' : (lunarData?.perigee_apogee_ratio ?? 0.5) < 0.4 ? 'text-[var(--text-tertiary)]' : 'text-[var(--text-secondary)]'}`}>Apogée</span>
            </GlassCard>

          </div>

          {/* Col 2: Phase Lunaire */}
          <GlassCard
            id="widget-moon-phase"
            className="flex flex-col items-center justify-center p-5 text-center min-h-[236px] border-none"
            style={{
              background: 'linear-gradient(180deg, rgba(24, 39, 46, 0.30) 0%, rgba(24, 39, 46, 0.60) 50%, rgba(24, 39, 46, 0.90) 100%)',
              backdropFilter: 'blur(4px)',
              WebkitBackdropFilter: 'blur(4px)'
            }}
          >

            <div className="space-y-1 z-10 duration-300 mb-4">
              <span className="para-lit text-[var(--text-secondary)] tracking-wider">Phase lunaire</span>
            </div>

            {/* Carousel Images Phase */}
            <div className="mb-6 h-[80px] w-full relative flex items-center justify-center perspective-[1000px]">

              {(() => {
                // Mapping phases (ordre cyclique)
                const phases = [
                  { name: "New Moon", fr: "Nouvelle Lune", file: "nouvellelune.svg" },
                  { name: "Waxing Crescent", fr: "Premier croissant", file: "1ercroissant.svg" },
                  { name: "First Quarter", fr: "Premier quartier", file: "premierquartier.svg" },
                  { name: "Waxing Gibbous", fr: "Gibbeuse croissante", file: "lunegibbeuse1.svg" },
                  { name: "Full Moon", fr: "Pleine Lune", file: "pleinelune.svg" },
                  { name: "Waning Gibbous", fr: "Gibbeuse décroissante", file: "lunegibbeuse2.svg" },
                  { name: "Last Quarter", fr: "Dernier quartier", file: "dernierquartier.svg" },
                  { name: "Waning Crescent", fr: "Dernier croissant", file: "derniercroissant.svg" }
                ];

                const N = phases.length;

                // Normalisation pour trouver l'index actuel
                const currentPhaseName = lunarData?.phase_name || "Nouvelle Lune";
                let currentIndex = phases.findIndex(p =>
                  p.fr.toLowerCase() === currentPhaseName.toLowerCase() ||
                  p.name.toLowerCase() === currentPhaseName.toLowerCase()
                );

                if (currentIndex === -1) currentIndex = 0;

                return phases.map((phase, i) => {
                  // Calcul de la distance cyclique (shortest path)
                  // Ex: si current=0. i=1 -> diff=1. i=7 -> diff=-1.
                  let diff = (i - currentIndex + N) % N;
                  if (diff > N / 2) diff -= N;

                  // On n'affiche que les voisins proches (-2 à +2) pour la performance et le look
                  // Mais pour l'animation, on les rend tous, on cache juste ceux hors champ via opacity
                  const isVisible = Math.abs(diff) <= 2;

                  // Configuration visuelle selon la distance
                  const isActive = diff === 0;
                  const scale = isActive ? 1.1 : 1 - (Math.abs(diff) * 0.40);
                  const opacity = isActive ? 1 : 1 - (Math.abs(diff) * 0.6);
                  let xOffset = diff * 48;
                  if (diff > 0) xOffset += 8; // Pousse vers la droite
                  if (diff < 0) xOffset -= 8; // Pousse vers la gauche

                  const zIndex = 10 - Math.abs(diff);

                  return (
                    <div
                      key={phase.name}
                      className="absolute top-1/2 left-1/2 flex items-center justify-center transition-all duration-700 ease-[cubic-bezier(0.25,0.8,0.25,1)]"
                      style={{
                        width: "48px",
                        height: "48px",
                        opacity: isVisible ? opacity : 0,
                        zIndex: zIndex,
                        transform: `translate(-50%, -50%) translateX(${xOffset}px) scale(${scale})`,
                        pointerEvents: "none"
                      }}
                    >
                      {/* Cercle rotatif UNIQUEMENT pour la lune centrale active */}
                      {isActive && (
                        <div className="absolute border border-dashed border-[var(--accent-900)] rounded-full animate-spin w-[64px] h-[64px]"></div>
                      )}

                      <img
                        src={`/moon_phases/${phase.file}`}
                        alt={phase.fr}
                        className={`object-contain drop-shadow-xl ${isActive ? 'effect-glow-yellow' : ''}`}
                        style={{
                          width: "100%",
                          height: "100%",
                        }}
                      />
                    </div>
                  );
                });
              })()}
            </div>

            <div className="space-y-1 z-10 transition-opacity duration-300 h-[3em] flex items-center justify-center">
              <h3 className="title-lit text-[var(--text-primary)] leading-tight max-w-[120px] mx-auto">
                {lunarData?.phase_name ?? "Chargement..."}
              </h3>
            </div>
          </GlassCard>

        </section>

        {/* ZONE C: Astro Cards */}
        <section id="zone-c-astro-cards" className="grid grid-cols-2 gap-3 mt-6 w-full pb-4">

          {/* Widget: Signe Lunaire */}
          <GlassCard
            id="widget-zodiac"
            className="col-span-1 flex flex-col items-center justify-center px-4 py-2 h-auto border-none"
            style={{
              background: 'linear-gradient(180deg, rgba(24, 39, 46, 0.30) 0%, rgba(24, 39, 46, 0.60) 50%, rgba(24, 39, 46, 0.90) 100%)',
              backdropFilter: 'blur(4px)',
              WebkitBackdropFilter: 'blur(4px)'
            }}
          >
            <div className="flex flex-col items-center gap-2">
              <img
                src={`/zodiac/${lunarData?.moon_zodiac_sign?.toLowerCase() ?? 'bélier'}.svg`}
                alt={lunarData?.moon_zodiac_sign}
                width={48}
                height={48}
                className="effect-glow-yellow"
              />

              <div className="text-center">
                <span className="para-lit text-[var(--text-secondary)] block">Lune en</span>
                <h3 className="title-lit text-[var(--text-primary)]">
                  {lunarData?.moon_zodiac_sign ?? "-"}
                </h3>
              </div>
            </div>
          </GlassCard>

          {/* Widgets: Element & Node */}
          <div className="col-span-1 flex flex-col gap-3 h-full">

            {/* Élément */}
            <GlassCard
              className="w-full p-4 flex items-center justify-between border-none"
              style={{
                background: 'linear-gradient(180deg, rgba(24, 39, 46, 0.30) 0%, rgba(24, 39, 46, 0.60) 50%, rgba(24, 39, 46, 0.90) 100%)',
                backdropFilter: 'blur(4px)',
                WebkitBackdropFilter: 'blur(4px)'
              }}
            >
              <div className="flex flex-col items-start z-10">
                <span className="para-lit text-[var(--text-secondary)]">Élément</span>
                <span className="para-big text-[var(--text-primary)] capitalize font-bold">
                  {lunarData?.moon_element ?? "-"}
                </span>
              </div>
              <div>
                <img
                  src={`/element/${lunarData?.moon_element ?? 'Feu'}.svg`}
                  alt={lunarData?.moon_element}
                  width={24}
                  height={24}
                  className="effect-glow-yellow"
                />
              </div>
            </GlassCard>

            {/* Noeud Lunaire */}
            <GlassCard
              className="w-full p-4 flex flex-col justify-center gap-1.5 flex-1 border-none"
              style={{
                background: 'linear-gradient(180deg, rgba(24, 39, 46, 0.30) 0%, rgba(24, 39, 46, 0.60) 50%, rgba(24, 39, 46, 0.90) 100%)',
                backdropFilter: 'blur(4px)',
                WebkitBackdropFilter: 'blur(4px)'
              }}
            >
              <span className="para-lit text-[var(--text-secondary)] mb-1">Noeuds Lunaires</span>

              <div className="flex items-center justify-between pb-1">
                <div className="flex items-baseline gap-1 ">
                  <span className="text-[11px] tracking-wider opacity-80 text-[var(--text-secondary)]">
                    Nord :
                  </span>
                  <span className="para-med text-[var(--text-primary)] capitalize font-bold text-sm">
                    {lunarData?.lunar_node_north_sign ?? lunarData?.lunar_node_sign ?? "-"}
                  </span>
                </div>
                <img
                  src={`/zodiac/${(lunarData?.lunar_node_north_sign ?? lunarData?.lunar_node_sign ?? 'capricorne').toLowerCase()}.svg`}
                  alt="Nord"
                  width={20}
                  height={20}
                  className="effect-glow-yellow opacity-90"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-baseline gap-1">
                  <span className="text-[11px] tracking-wider opacity-80 text-[var(--text-secondary)]">
                    Sud :
                  </span>
                  <span className="para-med text-[var(--text-primary)] capitalize font-bold text-sm">
                    {lunarData?.lunar_node_south_sign ?? "-"}
                  </span>
                </div>
                <img
                  src={`/zodiac/${(lunarData?.lunar_node_south_sign ?? 'vierge').toLowerCase()}.svg`}
                  alt="Sud"
                  width={20}
                  height={20}
                  className="effect-glow-yellow opacity-90"
                />
              </div>
            </GlassCard>

          </div>
        </section>

        {/* ZONE D: Actions & Separator */}
        <section id="zone-d-astro-cta" className="w-full flex flex-col items-center gap-2 mt-2 mb-0">

          {/* Nouveau Bouton Composant */}
          <Button
            variant="primary"
            icon={<Icon icon="fa-solid:sun" width="24" height="24" />}
            className="shadow-[0px_4px_14.1px_0px_rgba(246,174,49,0.40)] w-full max-w-[200px]"
          >
            Astro du jour
          </Button>

          <p className="text-[var(--text-primary)] text-sm font-body opacity-90">
            10 tirages gratuits/mois - 8 restants
          </p>
        </section>

        <div id="separator-container" className="w-full">
          <Separator />
        </div>

        {/* ZONE E: Premium */}
        <section id="zone-e-premium" className="w-full mb-8">
          <PremiumCard />
        </section>

      </div>
    </div >
  );
}
