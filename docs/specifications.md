# Cahier des Charges - Wakan V2

## 1. Vision & Objectifs
Wakan est une application mobile et web dédiée au développement spirituel personnalisé, centrée sur :
- les cycles lunaires,
- les tirages (runes, cartes…),
- les quizz introspectifs,
- les profils astrologiques,
- les contenus mystiques éditoriaux.

La V1 vise :
- un socle solide,
- une DA forte,
- une architecture scalable,
- un back-office complet,
- une structure multi-langue prête,
- un système de thèmes avancé,
- une intégration IA fluide (MCP).

## 2. Plateformes & Architecture
### 2.1. Plateformes cibles
- **Mobile** : iOS / Android via **Expo React Native**
- **Web App** : Expo Web (même base)
- **Back-office Admin** : Next.js (web uniquement)

### 2.2. Architecture globale (monorepo)
```
root/
 ├ apps/
 │   ├ mobile/        (Expo RN + TS)
 │   └ admin/         (Next.js + TS + Tailwind)
 ├ packages/
 │   ├ ui/            (composants UI partagés)
 │   ├ tokens/        (design tokens + thèmes)
 │   └ supabase/      (client, types générés)
 └ supabase/          (migrations SQL + edge functions)
```

## 3. Design System & DA
### 3.1. Source unique : Figma (UI Kit)
Tous les styles sont tirés **exclusivement de la page “UI Kit”** du fichier Figma `App test1`.
- MCP Figma connecté.
- Aucun style hors UI Kit.

### 3.2. Design Tokens
Convertis dans `packages/tokens` + `tailwind.config.js`.

### 3.3. Direction artistique
- **Mystique sombre & dorée**.
- Dégradés sombres, texture subtile, or lumineux.

### 3.4. Prohibition IA
- L’IA ne génère jamais de picto/image sans input.

## 4. Thèmes End-User
- **default** (mystique sombre + or)
- **forest** (verts / naturel)
- **aura** (clair / lumineux)

Paramètres : palette, typo, radius, ombres, backgrounds (par écran).

## 5. Images & Assets
- Backgrounds : `/assets/themes/<theme>/backgrounds/` (cover/fixed).
- Icônes : Export Figma -> `react-native-svg` dans `packages/ui/icons`.

## 6. Pages App Mobile (V1)
- **Accueil** : Lune, Astro, Raccourcis.
- **Tirages** : Runes (1 ou 3), animation, interprétation.
- **Quiz** : Étapier, Score, Interprétation.
- **Profil Astro** : Signe, Ascendant, Élément.
- **Journal Mystique** : Articles.
- **Paramètres** : Thème, Compte, Langue.

## 7. Back-office Admin (Next.js)
- **Modules** : Quiz Manager, Tirages Manager, Astro Text Manager, Themes Manager, CMS Articles, Dashboard.

## 8. Backend (Supabase)
- **Tables** : users, quizzes, tirages, astro_texts, journal_articles, lunar_cache.
- **Multi-langue** : champ `language` default 'fr'.
- **Edge Functions** : API Lunaire.

## 9. Auth & Abo
- Email/Google.
- Table `user_subscription`.

## 10. Multi-langue
- `i18next`.
- Structure prête pour EN (V1 FR uniquement).

## 11. IA Rules
- MCP Figma : lecture UI Kit uniquement.
- MCP Supabase : lecture schema, pas de SQL destructif auto.
