# Projekt: open-brain

MCP-server för tankar och anteckningar med Supabase-backend (open-brain / pi-memory).

## Innehåll

| Fil/mapp | Innehåll |
|----------|----------|
| `app/` | Serverapplikation |
| `:memory:/` | Lokal minnesdatabas |
| `OB1/` | Konfiguration och schemas |
| `WORK_SETUP.md` | Setup-instruktioner för arbetsinstallation |
| `add_mcp.sh` | Skript för att lägga till MCP-server |
| `20260302-nate-ob-promptkit.md` | Promptkit från Nate Jones |
| `20260302-nate-ob-substack-post.md` | Substack-artikel om open-brain |

**Börja här:** `WORK_SETUP.md` → setup-instruktioner. MCP-server konfigureras via `~/.claude/CLAUDE.md`.

## Teknisk kontext

- Credentials: `~/.claude/mcps/open-brain/.env`
- MCP-konfiguration: `~/.claude/CLAUDE.md`
- Supabase-backend för persistent minne

## Syfte

Persistent kunskapslagring utanför Claude Code:s kontext. Aktivt MCP-verktyg.
