"use client";

import { PageBackground } from "@/components/layout/PageBackground";
import { PremiumCard } from "@/components/ui/PremiumCard";
import { Separator } from "@/components/ui/Separator";
import { WakanLogo } from "@/components/ui/WakanLogo";
import { Button } from "@/components/ui/Button";
import Image from "next/image";
import { Icon } from "@iconify/react";


import { useState, useEffect } from "react";

export default function DashboardPage() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [lunarData, setLunarData] = useState<any>(null);

  useEffect(() => {
    async function fetchLunarData() {
      try {
        // Formater la date sélectionnée en YYYY-MM-DD
        const dateStr = selectedDate.toISOString().split('T')[0];

        // Appeler l'API avec le paramètre date
        const res = await fetch(`/api/lunar?date=${dateStr}`);
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
    return new Intl.DateTimeFormat('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' }).format(date);
  };

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
      <main className="relative z-10 flex flex-col items-center px-4 w-full max-w-md mx-auto pb-4" id="dashboard-main-content">

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
            className="relative flex items-center justify-center px-6 py-2 rounded-[16px] bg-[var(--background-800)] border border-[var(--background-500)] shadow-inner text-[var(--text-primary)] font-body text-lg capitalize w-full mx-3 text-center overflow-hidden"
            style={{
              boxShadow: "inset 0 1px 2px rgba(0,0,0,0.2)"
            }}
          >
            {/* Input Date Natif Invisible (Overlay) */}
            <input
              type="date"
              value={selectedDate.toISOString().split('T')[0]}
              onChange={(e) => {
                if (e.target.value) {
                  setSelectedDate(new Date(e.target.value));
                }
              }}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
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
            <div
              id="widget-moon-cycle"
              className="flex flex-col items-center justify-center p-3 rounded-3xl relative overflow-hidden aspect-square"
              style={{
                background: "linear-gradient(145deg, rgba(30, 41, 59, 0.7), rgba(15, 23, 42, 0.9))",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255,255,255,0.08)",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
              }}
            >
              <div className="relative w-24 h-24 flex items-center justify-center">
                {/* Dynamique SVG Circle */}
                <svg className="absolute inset-0 w-full h-full -rotate-90 transform transition-all duration-1000 ease-out" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" stroke="rgba(255,255,255,0.05)" strokeWidth="4" fill="none" />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="var(--accent-500)"
                    strokeWidth="4"
                    fill="none"
                    strokeLinecap="round"
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
            </div>

            {/* Widget Distance (Périgée/Apogée) */}
            <div
              id="widget-distance"
              className="flex items-center justify-between px-5 py-0 h-16 rounded-[20px] relative overflow-hidden"
              style={{
                background: "linear-gradient(145deg, rgba(30, 41, 59, 0.7), rgba(15, 23, 42, 0.9))",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255,255,255,0.08)",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
              }}
            >
              <span className="para-lit text-[var(--text-tertiary)] w-12 text-left">Périgée</span>

              {/* Simple Line Slider */}
              <div className="flex-1 mx-2 h-full flex items-center relative">
                <div className="w-full h-[2px] bg-[var(--text-tertiary)] opacity-20 rounded-full"></div>
                {/* Dot Indicator */}
                <div
                  className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-[var(--rich-yellow)] rounded-full shadow-[0_0_10px_rgba(246,174,49,0.6)] border-2 border-[var(--background-800)] z-10"
                  style={{ left: "30%" }} // Mock position
                ></div>
              </div>

              <span className="para-lit text-[var(--text-tertiary)] w-12 text-right">Apogée</span>
            </div>

          </div>

          {/* Col 2: Phase Lunaire */}
          <div
            id="widget-moon-phase"
            className="flex flex-col items-center justify-center p-5 rounded-3xl text-center relative overflow-hidden"
            style={{
              background: "linear-gradient(145deg, rgba(30, 41, 59, 0.7), rgba(15, 23, 42, 0.9))",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255,255,255,0.08)",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
            }}
          >
            {/* Phase Icon Visual */}
            <div className="mb-6 flex gap-3 opacity-40">
              <div className="w-3 h-3 rounded-full border border-white"></div>
              <div className="w-4 h-4 rounded-full border border-white scale-125"></div>
              <div className="w-3 h-3 rounded-full border border-white"></div>
            </div>
            {/* Main Active Phase Halo */}
            <div className="absolute top-12 left-1/2 -translate-x-1/2 w-24 h-24 bg-[var(--rich-yellow)] opacity-5 blur-2xl rounded-full pointer-events-none"></div>

            <div className="w-16 h-16 rounded-full border-2 border-[var(--rich-yellow)] shadow-[0_0_20px_rgba(246,174,49,0.3)] flex items-center justify-center mb-6 relative z-10">
              <div className="w-full h-full rounded-full bg-gradient-to-tr from-[var(--rich-yellow)] to-[var(--background-800)] opacity-80"></div>
            </div>

            <div className="space-y-1 z-10">
              <span className="para-lit text-[var(--text-tertiary)] tracking-wider">Phase lunaire</span>
              <h3 className="title-lit text-[var(--text-primary)] leading-tight capitalize max-w-[120px] mx-auto">
                {lunarData?.phase_name ?? "Chargement..."}
              </h3>
            </div>
          </div>

        </section>

        {/* ZONE C: Astro Cards */}
        <section id="zone-c-astro-cards" className="grid grid-cols-2 gap-3 mt-6 w-full">

          {/* Widget: Signe Lunaire */}
          <div
            id="widget-zodiac"
            className="col-span-1 flex flex-col items-center justify-center p-5 rounded-3xl relative overflow-hidden aspect-square"
            style={{
              background: "linear-gradient(145deg, rgba(30, 41, 59, 0.7), rgba(15, 23, 42, 0.9))",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255,255,255,0.08)",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
            }}
          >
            <div className="absolute top-3 right-3 text-[var(--accent-500)] opacity-60">
              <Icon icon="solar:star-bold-duotone" width="14" />
            </div>

            <div className="flex flex-col items-center gap-2">
              <Icon icon="mdi:zodiac-scorpio" width="48" height="48" className="text-[var(--rich-yellow)] drop-shadow-[0_0_8px_rgba(246,174,49,0.3)]" />

              <div className="text-center">
                <span className="para-lit text-[var(--text-secondary)] block mb-0.5">Lune en</span>
                <h3 className="title-lit text-[var(--text-primary)] capitalize">
                  {lunarData?.moon_zodiac_sign ?? "-"}
                </h3>
              </div>
            </div>
          </div>

          {/* Widgets: Element & Node */}
          <div className="col-span-1 flex flex-col gap-3 h-full justify-between">

            {/* Élément */}
            <div
              className="flex-1 rounded-3xl p-4 flex items-center justify-between relative overflow-hidden"
              style={{
                background: "linear-gradient(145deg, rgba(30, 41, 59, 0.7), rgba(15, 23, 42, 0.9))",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <div className="flex flex-col items-start z-10">
                <span className="para-lit text-[var(--text-tertiary)] mb-0.5">Élément</span>
                <span className="para-big text-[var(--text-primary)] capitalize">
                  {lunarData?.moon_element ?? "-"}
                </span>
              </div>
              <div>
                <Icon icon="mdi:fire" width="24" className="text-[var(--rich-pink)] drop-shadow-[0_0_8px_var(--rich-pink)]" />
              </div>
            </div>

            {/* Noeud Lunaire */}
            <div
              className="flex-1 rounded-3xl p-4 flex items-center justify-between relative overflow-hidden"
              style={{
                background: "linear-gradient(145deg, rgba(30, 41, 59, 0.7), rgba(15, 23, 42, 0.9))",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <div className="flex flex-col items-start z-10">
                <span className="para-lit text-[var(--text-tertiary)] mb-0.5">Noeud</span>
                <span className="para-big text-[var(--text-primary)] capitalize">
                  {lunarData?.lunar_node_sign ?? "-"}
                </span>
              </div>
              <div>
                <Icon icon="mdi:zodiac-capricorn" width="24" className="text-[var(--rich-yellow)] opacity-80" />
              </div>
            </div>

          </div>
        </section>

        {/* ZONE D: Actions & Separator */}
        <section id="zone-d-astro-cta" className="w-full flex flex-col items-center gap-2 mt-6 mb-0">

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

      </main>
    </div >
  );
}
