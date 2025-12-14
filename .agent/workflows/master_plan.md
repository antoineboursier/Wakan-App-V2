---
description: Master Plan Wakan V2 - PWA First
---

# 📘 CAHIER DES CHARGES COMPLET — WAKAN V1
(PWA Web + Android encapsulé + iOS encapsulé V2)

## 0. Vision générale
Wakan est une application spirituelle permettant à l’utilisateur d’accéder à :
- un dashboard astral personnalisé,
- des tirages (runes, cartes, oracles),
- des quiz spirituels,
- un profil astral calculé à partir des données de naissance,
- un blog / journal mystique.

Objectif clé : une seule base front, sans Expo, sans RN, basée exclusivement sur Next.js 15.

## 1. Architecture technique

### 1.1 Frontend principal
- Next.js 15 (App Router, TypeScript)
- React 19
- TailwindCSS + variables CSS (design tokens)
- PWA (manifest.json + service worker)
- MCP Server Figma
- Vercel pour build/deploy

### 1.2 Backend / données
- Supabase (Postgres + Auth + Storage)
- Supabase Auth : Email/password, OAuth Google, OAuth Apple
- Tables : users, lunar_data, tarot_runes, quiz, quiz_questions, quiz_answers, astro_profiles, content_pages, themes

### 1.3 Back-office
- Next.js admin séparé ou route protégée
- CRUD quiz, tirages, textes, thèmes

## 2. Design System (DS)
Source unique : Figma via MCP.
Tokens obligatoires : Couleurs, Espacements, Radii, Ombres, Typos.

## 3. Thèmes
- Default, Forest, Aura.
- Switch de thème fluide.

## 4. Pages V1
- / (Dashboard)
- /tirages & /tirages/[id]
- /quiz & /quiz/[id]
- /profil
- /journal

## 11. Roadmap

### Phase 1 — Socle (Semaine 1)
- [x] Repo Next propre (wakan-pwa)
- [x] DS installé (Skeleton Tailwind + Variables CSS)
- [x] Auth Supabase (Config + Client/Server Utils)
- [x] Navigation (Figma Integrated)
- [x] Skeleton pages (Styled from Figma)

### Phase 2 — Dashboard + thèmes (Semaine 2)
- [x] Dashboard complet (UI Only)
- [ ] Thèmes fonctionnels

### Phase 3 — Quiz + tirages (Semaine 3)
- [ ] Quiz complet
- [ ] Tirages complets
- [ ] Journal

### Phase 4 — PWA + Android (Semaine 4)
- [ ] Manifest & Service Worker
- [ ] PWABuilder
- [ ] Android TWA

### Phase 5 — iOS (V2)
- [ ] Capacitor
- [ ] App Store
