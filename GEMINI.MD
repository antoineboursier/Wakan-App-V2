# Wakan V2 - Configuration Gemini

## User Rules & Preferences

- Parle en français
- Démarre une vue web en local dès que c'est possible
- Si tu dois me demander des actions en terminal, rappelle moi à chaque fois le nom du dossier
- Consulte toujours les règles de /design_system_rules avant de travailler
- Quand tu crées de nouveaux pages ou popin, pour le back office ou la prod, ne démarre pas de zéro : duplique les règles d'une source existante à modifier, afin de conserver au maximum une structure cohérente de construction sur un front ou un back office.
- Utilise des composants existants au maximum. S'ils n'existent pas, crée ce nouveau composant. Si possible, en te référant à un existant (ex : un bouton secondaire peut être inspiré d'un primaire...)

## Project Structure

- **Frontend**: Next.js avec TypeScript
- **Backend**: Supabase (PostgreSQL)
- **Design System**: Variables CSS dans `src/app/globals.css`
- **Admin**: Pages dans `src/app/admin/`
- **Components**: `src/components/`

## MCP Servers Actifs

1. **Figma Dev Mode** - Intégration design
2. **Supabase** - Gestion base de données
   - Project ID: `mmrqlfijwfbkvutaaxid`
   - URL: `https://mmrqlfijwfbkvutaaxid.supabase.co`

## Workflows

- `/design_system_rules` - Rules for UI development and Design System usage
- `/master_plan` - Master Plan Wakan V2 - PWA First

## Notes Importantes

- **Proxy EDF** : Si problème de connexion, vérifier proxy PAC (http://pac-ad-edf.proxy.edf.fr)
- **Migrations Supabase** : Toujours utiliser `mcp_supabase-mcp-server_apply_migration`
- **Design System** : Utiliser les variables CSS, pas de valeurs en dur
