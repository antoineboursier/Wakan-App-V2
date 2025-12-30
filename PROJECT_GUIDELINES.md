# Wakan V2 - Guide de Développement & Bonnes Pratiques

Ce document regroupe les règles d'or, choix techniques et standards UX/UI validés pour le projet Wakan V2. Il doit être consulté avant chaque nouvelle fonctionnalité.

## 1. UX & Navigation (Système "Stack")

### Transactions de Page
L'application imite une navigation native mobile avec un système de **Stack / Overlay**.

*   **Pages Principales (Tab Bar)** : `Accueil`, `Tirages`, `Quiz`, `Profil`, `Journal`.
    *   **Transition :** AUCUNE (changement instantané ou fade très léger).
    *   **Comportement :** L'utilisateur passe de l'une à l'autre sans effet de glissement.
*   **Sous-Pages (Détails)** : ex: `/tirages/rune`, `/journal/details`
    *   **Transition Entrée (Push) :** La page arrive de la **droite vers la gauche** en surcouche (Overlay).
    *   **Fond :** La page parente reste visible en dessous (effet parallaxe/assombri), elle ne disparaît pas.
    *   **Transition Sortie (Pop) :** La page repart vers la droite, révélant la page parente.
*   **Retour Arrière :**
    *   Toujours utiliser la navigation native (`router.back()`) dans les boutons "Retour".
    *   Cela garantit le support du geste "Swipe Back" sur mobile et des boutons physiques.

### Interfaces Interactives
*   **Curseur :** Tous les éléments interactifs (`button`, `a`, `div` cliquable) doivent avoir `cursor: pointer` via une règle globale CSS.
*   **Fluidité :** Aucun "Flash" blanc ou rechargement visible lors d'une action intra-page (ex: passer d'un tirage simple à complexe).

---

## 2. Architecture & Components

### Affichage des Tirages (Pattern Unifié)
Pour éviter les clignotements (unmount/remount) lors de l'enrichissement d'une vue (ex: ajouter des cartes à un tirage) :
*   **Ne JAMAIS remplacer un composant par un autre** pour la même vue.
*   Utiliser un **composant unique** (ex: `ComplexDrawDisplay`) capable de gérer l'état initial (1 item) et l'état final (N items).
*   Lors de l'ajout d'éléments, ceux-ci s'ajoutent à la liste existante sans recharger le premier élément.

### Animations (Framer Motion)
*   **Persistance :** Les états finaux des animations (ex: Glow effect, filtres) doivent persister une fois l'animation terminée. Attention aux styles inlines qui écrasent les classes CSS.
*   **Layout :** Utiliser `mode="popLayout"` dans `AnimatePresence` pour les transitions de pages afin de gérer correctement la superposition (position absolute automatique).

---

## 3. UI & Design System

### Typographie & Couleurs
Utiliser strictement les variables CSS définies dans `globals.css` :
*   **Titres :** `title-big`, `title-med` (Font: Skranji)
*   **Corps :** `para-big`, `para`, `para-lit` (Font: League Spartan)
*   **Couleurs :** `--background-900` (Fond principal), `--accent-500` (Doré Wakan), `--text-primary` (Blanc cassé).

### Feedback Visuel
*   **Boutons :** Utiliser le composant `<Button />` standardisé (variantes primary/secondary).
*   **Chargement :** Toujours indiquer un état de chargement sur les actions asynchrones (ex: icône spinner dans le bouton).

---

## 4. Règles Globales (Ordres)
1.  **Stabilité du DOM :** Privilégier la modification de props/state plutôt que le remplacement complet de composants pour les transitions d'état.
2.  **Navigation Native :** Ne jamais bloquer ou réinventer le comportement "Précédent" du navigateur.
3.  **Zéro "Jump" :** Les transitions de pages ne doivent jamais provoquer de saut de scroll (utiliser `window.scrollTo` avec `behavior: 'instant'` si nécessaire, ou laisser le layout absolu gérer).
