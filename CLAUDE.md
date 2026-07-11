# Projekt: open-brain

MCP-server för tankar och anteckningar med Supabase-backend (open-brain / pi-memory).

## Innehåll

| Fil/mapp | Innehåll |
|----------|----------|
| `app/` | Serverapplikation |
| `OB1/` | Konfiguration och schemas |
| `setup/` | Setup-instruktioner och config (`WORK_SETUP.md`, `add_mcp.sh`, `set_secret.sh`, `test.sh`, `claude_desktop_config.json`, `vscode-mcp-template.json`, `oml.code-workspace`) |
| `docs/` | Referensmaterial från Nate Jones (promptkit, Substack-artikel) |
| `.github/workflows/supabase-keepalive.yml` | Håller Supabase-projektet aktivt (cron, 2x/vecka) |

**Börja här:** `setup/WORK_SETUP.md` → setup-instruktioner. MCP-server konfigureras via `~/.claude/CLAUDE.md`.

## Teknisk kontext

- Credentials: `~/.claude/mcps/open-brain/.env` (bara `.env.example` finns där just nu)
- MCP-konfiguration: `~/.claude/CLAUDE.md`
- Supabase-backend för persistent minne
- Supabase project ref: `sdgmznktypkdjrmwkvqu` — hålls aktivt via GitHub Actions-workflowen ovan

## Syfte

Persistent kunskapslagring utanför Claude Code:s kontext. Aktivt MCP-verktyg.
