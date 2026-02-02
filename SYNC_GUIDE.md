# 🚀 Wakan V2 - Guide de Synchronisation

Ce fichier documente les configurations et packages importants pour maintenir une synchronisation parfaite entre les machines de développement.

---

## 📦 Installation initiale

Après un `git pull`, exécuter :

```bash
npm install --legacy-peer-deps
```

> ⚠️ L'option `--legacy-peer-deps` est nécessaire car certains packages ont des peer dependencies strictes.

---

## 🔧 Packages installés (hors package.json standard)

### WYSIWYG Editor (Back Office)
```bash
npm install @tiptap/react @tiptap/starter-kit @tiptap/extension-placeholder @tiptap/extension-color @tiptap/extension-text-style --legacy-peer-deps
```

**Fichier concerné :** `src/components/admin/RichTextEditor.tsx`

**Usage :** Éditeur de texte enrichi pour les descriptions dans le BO (gras, italique, listes, couleurs).

---

## 📁 Structure des dossiers clés

```
src/
├── app/
│   ├── (app)/          # Pages front-end (utilisateur connecté)
│   ├── admin/          # Back Office
│   └── api/            # Routes API
├── components/
│   ├── admin/          # Composants BO (RichTextEditor, etc.)
│   ├── astral/         # Composants astrologiques (AstralCards, ZodiacProfileView)
│   ├── profile/        # Composants profil (ZodiacProfileCard)
│   └── ui/             # Composants UI réutilisables (Button, Modal, etc.)
├── hooks/              # Hooks personnalisés
├── types/              # Types TypeScript
└── utils/              # Utilitaires (calculs astro, etc.)
```

---

## 🎨 Design System

### Variables CSS principales

Définies dans `src/app/globals.css` :

| Variable | Valeur | Usage |
|----------|--------|-------|
| `--accent-900` | `#f6ae31` | Actions principales, highlights |
| `--accent-700` | `#f1ba5b` | Textes secondaires accent |
| `--text-primary` | `#f4efeb` | Texte principal |
| `--text-secondary` | `#cdbcae` | Sous-titres |
| `--background-900` | `#18272e` | Fond principal |
| `--background-800` | `#1c3039` | Cards, navigation |

### Classes CSS personnalisées

| Classe | Usage |
|--------|-------|
| `.rich-content` | Rendu HTML riche (WYSIWYG) |
| `.btn-wakan-primary` | Bouton primaire |
| `.btn-wakan-secondary` | Bouton secondaire |
| `.title-big`, `.title-med`, `.title-lit` | Titres |
| `.para-big`, `.para`, `.para-lit` | Paragraphes |

---

## 🗄️ Base de données (Supabase)

### Tables astrologiques

- `zodiac_signs` - Signes du zodiaque (avec `display_name`, `description_main`, `hero_image`, `icon_glow`)
- `zodiac_sign_planet_rulers` - Planètes maîtresses par signe
- `zodiac_sign_decans` - Décans (3 par signe)
- `zodiac_sign_seasons` - Saisons astrologiques
- `zodiac_planets` - Planètes (données de référence)

### Champs HTML riche

Les champs suivants contiennent du HTML (WYSIWYG) :
- `zodiac_signs.description_main`
- `zodiac_sign_planet_rulers.description`
- `zodiac_sign_decans.description`
- `zodiac_sign_decans.planet_description`
- `zodiac_sign_seasons.content`

---

## ⚙️ Composants importants

### RichTextEditor (`src/components/admin/RichTextEditor.tsx`)
- WYSIWYG léger basé sur TipTap
- Fonctionnalités : Gras, Italique, Listes, Couleurs (Accent, Secondary)
- Output : HTML avec variables CSS

### AstralCards (`src/components/astral/AstralCards.tsx`)
- `AstralCardMain` - Card principale (signe + décan + planète décan)
- `AstralCardGraphic` - Card avec hero image (planète maîtresse)
- `AstralCardSimple` - Card simple (saison)
- ⚠️ Utilisent `dangerouslySetInnerHTML` pour le rendu HTML

### ZodiacProfileCard (`src/components/profile/ZodiacProfileCard.tsx`)
- Card résumé du profil zodiacal
- Tri automatique des data points (rempli > manquant > premium)
- Props `fullWidth` sur Button pour layout correct

### Button (`src/components/ui/Button.tsx`)
- Prop `fullWidth` pour largeur 100%
- Utilise `!flex` pour override du display inline-flex CSS

---

## 🐛 Problèmes connus et solutions

### TipTap SSR Error
**Erreur :** `SSR has been detected, please set immediatelyRender`  
**Solution :** Ajouter `immediatelyRender: false` dans `useEditor()`

### Import TipTap Extensions
**Erreur :** `Export default doesn't exist`  
**Solution :** Utiliser les imports nommés : `import { TextStyle } from '@tiptap/extension-text-style'`

### Button width issues
**Problème :** Button ne prend pas toute la largeur  
**Solution :** Utiliser prop `fullWidth` et classes `!w-full !flex` pour override CSS

---

## 📝 Notes de développement

- **Toujours consulter** les règles de `/design_system_rules` avant modifications UI
- **Dupliquer les composants existants** pour créer de nouvelles pages/popin
- **Les couleurs WYSIWYG** utilisent des variables CSS (`var(--accent-900)`) pour s'adapter aux futurs thèmes

---

## 🔄 Dernière mise à jour

Date : 2026-02-02  
Session : Implémentation WYSIWYG + refonte ZodiacProfileCard
