---
description: Plan de développement global Wakan V2
---

# Plan de Développement Wakan V2

### Phase 0 – Préparation produit & design
1. Clarifier le scope V1 (Validé).
2. Stabiliser la DA & le Design System (Figma).

### Phase 1 – Setup technique & repo
1. **Créer le monorepo** (En cours)
    - `apps/mobile` : Expo React Native + TypeScript
    - `apps/admin` : Next.js + TypeScript
    - `packages/ui` : composants partagés
    - `packages/tokens` : design tokens + thèmes
    - `packages/supabase` : client + types générés
2. **Initialiser Supabase**
    - Projet, base, Auth, Storage.
3. **Configurer Anti Gravity + MCP**

### Phase 2 – Design system & thèmes
1. Extraction Design System via MCP Figma.
2. Implémenter les thèmes (Tokens, Backgrounds).

### Phase 3 – Pages & composants (Mobile)
1. Connexion MCP Figma → composants (Home, Tirages, Quiz, etc.).
2. Gestion des icônes / SVG.

### Phase 4 – Modèle de données & logique métier
1. Définir le schéma Supabase.
2. Connexion mobile ↔ Supabase.
3. Intégration API lunaire (Edge Function).

### Phase 5 – Back-office (Admin)
1. Setup Next.js admin.
2. Modules V1 (Quiz, Tirages, Astro, Thèmes).

### Phase 6 – Premium & gating
1. Modèle d’abonnement.
2. Gating dans l’UI.

### Phase 7 – Multi-langue
1. i18n côté mobile + admin.
2. Filtrage données.

### Phase 8 – Finition & QA
1. Tests UX / flows.
2. Polish DA.
