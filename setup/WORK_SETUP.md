# Open Brain — Setup på arbetsdator

Databasen ligger i Supabase (molnet) så du når samma tankar från alla datorer.

**MCP-servern är installerad på**: `~/.claude/mcps/open-brain/`

---

## 1. Virtualenv & beroenden (redan installerade)

```bash
cd ~/.claude/mcps/open-brain
.venv/bin/pip install -r requirements.txt
```

Om du behöver uppdatera beroenden senare:

```bash
cd ~/.claude/mcps/open-brain
.venv/bin/pip install -r requirements.txt --upgrade
```

## 2. Sätt environment-variabler

Skapa en `.env`-fil i `~/.claude/mcps/open-brain/`:

```bash
cd ~/.claude/mcps/open-brain
cp .env.example .env
# Redigera sedan .env och fyll i:
# SUPABASE_URL=https://your-project.supabase.co
# SUPABASE_KEY=your-service-role-key
```

## 3. Testa servern

```bash
cd ~/.claude/mcps/open-brain
source .venv/bin/activate
python mcp_server.py
```

Du ska se att servern startar utan fel. Tryck `Ctrl+C` för att avsluta.

---

## 3. Konfigurera VS Code (GitHub Copilot)

1. Ta filen `vscode-mcp-template.json` från det här projektet
2. Ersätt `DITT_ANVÄNDARNAMN` med ditt faktiska användarnamn (kör `whoami` i terminalen om du är osäker)
3. Spara den som `~/.vscode/mcp.json`

```bash
# Ta reda på ditt användarnamn
whoami

# Skapa filen (ersätt DITT_ANVÄNDARNAMN nedan)
mkdir -p ~/.vscode
sed 's/DITT_ANVÄNDARNAMN/$(whoami)/g' ~/open-brain/vscode-mcp-template.json > ~/.vscode/mcp.json
```

Eller manuellt:
```bash
cp ~/open-brain/vscode-mcp-template.json ~/.vscode/mcp.json
# Redigera sedan ~/.vscode/mcp.json och byt ut DITT_ANVÄNDARNAMN
```

4. Aktivera MCP i VS Code:
   - Öppna Settings (`Cmd+,`)
   - Sök efter `chat.mcp.enabled`
   - Sätt den till `true`
   - Starta om VS Code

5. Öppna Copilot Chat → klicka på verktygsikonen (🔧) → `open-brain` ska synas i listan

---

## 4. Konfigurera Claude Code (CLI och VS Code)

Använd `--scope user` för att registrera servern globalt — fungerar då i både terminalen och Claude Code-extensionen i VS Code oavsett vilket projekt du har öppet:

```bash
claude mcp add open-brain \
  --scope user \
  -- /Users/oml/.claude/mcps/open-brain/.venv/bin/python /Users/oml/.claude/mcps/open-brain/mcp_server.py
```

Lägg in environment-variabler via `~/.claude/settings.json`:

```json
{
  "mcpServers": {
    "open-brain": {
      "env": {
        "SUPABASE_URL": "https://your-project.supabase.co",
        "SUPABASE_KEY": "your-service-role-key"
      }
    }
  }
}
```

Eller lägg variabler direkt i kommandot:

```bash
claude mcp add open-brain \
  --scope user \
  -e SUPABASE_URL="https://your-project.supabase.co" \
  -e SUPABASE_KEY="your-service-role-key" \
  -- /Users/oml/.claude/mcps/open-brain/.venv/bin/python /Users/oml/.claude/mcps/open-brain/mcp_server.py
```

Verifiera:
```bash
claude mcp list
```

`open-brain` ska visas som `✓ Connected`.

---

## 5. Claude Desktop-app

Kopiera `claude_desktop_config.json` från detta projekt till `~/.claude/claude_desktop_config.json`:

```bash
cp ~/Projects/open-brain/claude_desktop_config.json ~/.claude/claude_desktop_config.json
```

Starta Claude Desktop-appen på nytt.

## Felsökning

**Servern startar inte** — kontrollera att Python-sökvägen stämmer:
```bash
ls /Users/oml/.claude/mcps/open-brain/.venv/bin/python
```

**"Module not found"** — uppdatera pip:
```bash
/Users/oml/.claude/mcps/open-brain/.venv/bin/pip install -r /Users/oml/.claude/mcps/open-brain/requirements.txt --upgrade
```

**MCP visas inte i Claude Desktop** — starta om appen och kontrollera `/Users/oml/.claude/claude_desktop_config.json`

## Säkerhet

`SUPABASE_KEY` är en service-role-nyckel med full åtkomst till databasen.
- Dela den **ALDRIG** offentligt (GitHub, Slack, etc.)
- Lägg **ALDRIG** `.env` eller hemliga nycklar i versionshantering
- Använd `~/.claude/settings.json` för personliga environment-variabler
