"use client";

import { PageBackground } from "@/components/layout/PageBackground";
import { PremiumCard } from "@/components/ui/PremiumCard";
import { Separator } from "@/components/ui/Separator";
import { WakanLogo } from "@/components/ui/WakanLogo";
import { Button } from "@/components/ui/Button";
import Image from "next/image";

// Icône Soleil pour le bouton Astro (Style Iconify/Lucide)
const SunIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    viewBox="0 0 24 24"
    fill="currentColor" /* Utilisation de fill currentColor pour Iconify style souvent plein ou stroke */
  >
    {/* Version Solaire Simple (similaire à Iconify ph:sun-bold ou solar:sun-bold) */}
    <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41M12 17a5 5 0 1 0 0-10a5 5 0 0 0 0 10Z" />
  </svg>
);

export default function DashboardPage() {
  return (
    <div className="min-h-screen font-body relative" id="dashboard-page">

      {/* --- BACKGROUND SYSTEM --- */}
      <PageBackground imageSrc="/images/tableau-de-bord-bg.png" alt="Dashboard Cactus Moon" />

      {/* --- HEADER (LOGO) --- */}
      <header className="relative w-full z-20 flex justify-center pt-8" id="dashboard-header">
        <h1 className="sr-only">Wakan - Tableau de bord</h1>
        {/* Composant Logo Animé */}
        <WakanLogo />
      </header>

      {/* --- MAIN CONTENT --- */}
      <main className="relative z-10 flex flex-col items-center px-4 w-full max-w-md mx-auto pb-32" id="dashboard-main-content">

        {/* ZONE B: Widgets Lunaires */}
        <section id="zone-b-moon-grid" className="grid grid-cols-2 gap-3 h-auto w-full">

          {/* Col 1: Cycle + Périgée */}
          <div className="flex flex-col gap-3">

            {/* Widget J2 Cycle */}
            <div
              id="widget-moon-cycle"
              className="flex flex-col items-center justify-center p-3 rounded-3xl relative overflow-hidden aspect-square"
              style={{
                background: "linear-gradient(90deg, rgba(24, 39, 46, 0.30) 0%, rgba(24, 39, 46, 0.60) 50%, rgba(24, 39, 46, 0.90) 100%)",
                backdropFilter: "blur(2px)",
                border: "1px solid rgba(255,255,255,0.05)"
              }}
            >
              {/* SVG Circular Progress */}
              <div className="relative w-24 h-24 flex items-center justify-center">
                {/* Background Track */}
                <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="6" />
                  {/* Active Progress */}
                  <circle
                    cx="50" cy="50" r="40"
                    fill="none"
                    stroke="var(--accent-500)"
                    strokeWidth="6"
                    strokeDasharray="251.2"
                    strokeDashoffset="230"
                    strokeLinecap="round"
                  />
                </svg>

                <div className="text-center z-10 flex flex-col items-center leading-tight">
                  <span className="font-heading text-3xl text-[var(--text-primary)] drop-shadow-md">J2</span>
                  <span className="text-[10px] font-bold uppercase text-[var(--text-secondary)] w-16 leading-3">du cycle lunaire</span>
                </div>
              </div>
            </div>

            {/* Widget Périgée / Apogée */}
            <div
              id="widget-perigee-apogee"
              className="flex flex-col items-center justify-center p-3 rounded-2xl h-20"
              style={{
                background: "linear-gradient(90deg, rgba(24, 39, 46, 0.30) 0%, rgba(24, 39, 46, 0.60) 50%, rgba(24, 39, 46, 0.90) 100%)",
                backdropFilter: "blur(2px)",
                border: "1px solid rgba(255,255,255,0.05)"
              }}
            >
              <div className="w-full px-2 relative h-6 flex items-center">
                <div className="absolute left-0 right-0 h-0.5 bg-[var(--background-600)] top-1/2 -translate-y-1/2 rounded-full"></div>
                <div className="absolute left-[20%] top-1/2 -translate-y-1/2 w-0.5 h-2 bg-[var(--background-400)]"></div>
                <div className="absolute right-[20%] top-1/2 -translate-y-1/2 w-4 h-4 bg-[var(--accent-500)] rounded-full shadow-[0_0_8px_var(--accent-500)] border-2 border-[var(--background-800)] z-10 flex items-center justify-center">
                  <div className="w-1 h-3 bg-[var(--background-800)]"></div>
                </div>
              </div>
              <div className="flex justify-between w-full text-[10px] text-[var(--text-secondary)] mt-1 px-1 font-medium">
                <span>Périgée</span>
                <span>Apogée</span>
              </div>
            </div>

          </div>

          {/* Col 2: Phase Lunaire - Gibbeuse */}
          <div
            id="widget-moon-phase"
            className="flex flex-col items-center justify-between p-4 rounded-3xl text-center"
            style={{
              background: "linear-gradient(90deg, rgba(24, 39, 46, 0.30) 0%, rgba(24, 39, 46, 0.60) 50%, rgba(24, 39, 46, 0.90) 100%)",
              backdropFilter: "blur(2px)",
              border: "1px solid rgba(255,255,255,0.05)"
            }}
          >
            <span className="text-xs text-[var(--text-tertiary)] opacity-80 mt-2">Phase lunaire</span>

            <div className="flex items-center justify-center gap-3 my-2">
              <div className="w-4 h-8 bg-[var(--text-tertiary)] opacity-20 rounded-l-full"></div>
              <div className="w-6 h-10 bg-[var(--text-tertiary)] opacity-40 rounded-l-full border-r border-black/20"></div>
              <div className="relative w-14 h-14">
                <div className="absolute inset-0 border border-dashed border-[var(--accent-500)] rounded-full animate-spin opacity-50"></div>
                <div className="absolute inset-2 bg-[var(--rich-yellow)] rounded-full shadow-[0_0_20px_rgba(246,174,49,0.5)] flex items-center justify-center overflow-hidden">
                  <div className="w-full h-full bg-[var(--background-900)] rounded-full translate-x-1/3 scale-90"></div>
                  <div className="absolute inset-0 bg-[var(--rich-yellow)] rounded-full mix-blend-overlay"></div>
                </div>
              </div>
              <div className="w-8 h-8 rounded-full bg-[var(--text-tertiary)] opacity-40"></div>
              <div className="w-4 h-8 bg-[var(--text-tertiary)] opacity-20 rounded-r-full"></div>
            </div>

            <div className="mb-2">
              <h3 className="title-med text-[var(--text-primary)] leading-tight">
                Gibbeuse <br /> décroissante
              </h3>
            </div>
          </div>

        </section>

        {/* ZONE C: Astro Cards */}
        <section id="zone-c-astro-cards" className="grid grid-cols-2 gap-3 h-auto mt-3 w-full">

          {/* Widget: Signe Lunaire */}
          <div
            id="card-lunar-sign"
            className="col-span-1 flex flex-col items-center justify-center p-4 rounded-3xl text-center aspect-square relative overflow-hidden"
            style={{
              background: "linear-gradient(135deg, rgba(28, 48, 57, 0.6) 0%, rgba(28, 48, 57, 0.9) 100%)",
              backdropFilter: "blur(4px)",
              border: "1px solid rgba(255,255,255,0.05)"
            }}
          >
            <div className="mb-2 relative">
              <div className="absolute inset-0 bg-[var(--accent-500)] blur-xl opacity-20 rounded-full"></div>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[var(--accent-500)] relative z-10 drop-shadow-[0_0_8px_rgba(246,174,49,0.5)]">
                <path d="M7 6C7 4.89543 7.89543 4 9 4C10.1046 4 11 4.89543 11 6V12C11 12 11 13 12 13C13 13 13 12 13 12V6C13 4.89543 13.8954 4 15 4C16.1046 4 17 4.89543 17 6V12C17 14.2091 18.7909 16 21 16V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <path d="M5 6V16C5 16 5 18 2 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <path d="M21 16L23 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <path d="M21 16L19 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <div className="space-y-1">
              <span className="text-xs font-body text-[var(--text-tertiary)] tracking-wide">Lune en</span>
              <h3 className="text-2xl font-heading text-[var(--text-primary)] leading-none">Scorpion</h3>
            </div>
          </div>

          {/* Widgets: Element & Node */}
          <div className="col-span-1 flex flex-col gap-3">
            <div
              id="card-element"
              className="flex items-center justify-between px-4 py-3 rounded-2xl flex-1 relative overflow-hidden"
              style={{
                background: "linear-gradient(90deg, rgba(28, 48, 57, 0.6) 0%, rgba(28, 48, 57, 0.9) 100%)",
                backdropFilter: "blur(4px)",
                border: "1px solid rgba(255,255,255,0.05)"
              }}
            >
              <div className="flex flex-col items-start z-10">
                <span className="text-[10px] font-body text-[var(--text-secondary)]">Élément</span>
                <span className="text-lg font-heading text-[var(--text-primary)]">Feu</span>
              </div>
              <div className="relative">
                <div className="absolute inset-0 bg-[var(--rich-pink)] blur-lg opacity-30 rounded-full"></div>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" className="text-[var(--rich-pink)] relative z-10 drop-shadow-[0_0_5px_rgba(255,43,124,0.6)]">
                  <path d="M8.5 14.5A2.5 2.5 0 0 0 11 17C12.3807 17 13.5 15.8807 13.5 14.5C13.5 13.1193 12.3807 12 11 12C9.61929 12 8.5 13.1193 8.5 14.5Z" fill="currentColor" fillOpacity="0.4" />
                  <path d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z" stroke="currentColor" strokeWidth="0" />
                  <path d="M10 18.5C6.5 15.5 7 10 12 3C15 8 18 13 14 18.5C13 19.5 10 19.5 10 18.5Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" fill="currentColor" fillOpacity="0.2" />
                </svg>
              </div>
            </div>

            <div
              id="card-node"
              className="flex items-center justify-between px-4 py-3 rounded-2xl flex-1 relative overflow-hidden"
              style={{
                background: "linear-gradient(90deg, rgba(28, 48, 57, 0.6) 0%, rgba(28, 48, 57, 0.9) 100%)",
                backdropFilter: "blur(4px)",
                border: "1px solid rgba(255,255,255,0.05)"
              }}
            >
              <div className="flex flex-col items-start z-10">
                <span className="text-[10px] font-body text-[var(--text-secondary)]">Noeud</span>
                <span className="text-sm font-heading text-[var(--text-primary)] overflow-hidden text-ellipsis whitespace-nowrap max-w-[80px]">Capricorne</span>
              </div>
              <div className="relative">
                <div className="absolute inset-0 bg-[var(--accent-500)] blur-lg opacity-20 rounded-full"></div>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" className="text-[var(--accent-500)] relative z-10">
                  <path d="M17 7V17C17 19 14 19 14 17V12C14 10 12 10 12 12V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M12 15C12 17.5 10 18 7 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <path d="M15 15C17 17.5 20 17 21 14.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <circle cx="20.5" cy="14" r="1.5" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              </div>
            </div>
          </div>

        </section>

        {/* ZONE D: Actions & Separator */}
        <section id="zone-d-actions" className="flex flex-col items-center w-full mt-8">

          {/* Nouveau Bouton Composant */}
          <Button
            variant="primary"
            icon={SunIcon}
            className="mb-3"
          >
            Astro du jour
          </Button>

          <p className="text-[var(--text-primary)] text-sm font-body opacity-90 mb-0">
            10 tirages gratuits/mois - 8 restants
          </p>

          <div id="separator-container" className="w-full">
            <Separator />
          </div>
        </section>

        {/* ZONE E: Premium */}
        <section id="zone-e-premium" className="w-full mb-8">
          <PremiumCard />
        </section>

      </main>
    </div>
  );
}
