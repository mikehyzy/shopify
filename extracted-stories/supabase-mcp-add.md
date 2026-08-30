# The `claude mcp add` command that attaches a Supabase project scoped to the repo

ENGAGEMENT: Chicago Futures Salon — extending the Shopify site with a Supabase backend, August 1, 2026
KIND: decided
SOURCE: `/root/.claude/projects/-home-user-shopify/64080f34-7a4a-5a22-a1a2-859a71c8eab3.jsonl`

## What happened

Mike said he was building something new that would need to connect Supabase to Shopify, asked whether to start a fresh Claude chat for it. Claude said yes — this session was scoped to the Shopify theme repo and a Supabase integration is a separate project, better to spin up a fresh session with the right MCP wiring from the start.

Immediately after, Mike pasted the exact CLI command he intended to run:

```
claude mcp add --scope project --transport http supabase "https://mcp.supabase.com/mcp?project_ref=fcdqrtxdkcqlxqsrwejs&features=docs%2Caccount%2Cdatabase%2Cdebugging%2Cdevelopment%2Cfunctions%2Cbranching"
```

Claude walked through the shape of what that command does: registers the Supabase MCP server named `supabase`, transport HTTP, `--scope project` (so it lands in `.mcp.json` in the repo and is shared with anyone who clones the repo), connected to a specific project ref, with an explicit feature list.

## How it worked

**Anatomy of the command:**
- `claude mcp add` — the Claude Code CLI's MCP-server registration verb.
- `--scope project` — writes the server config to `.mcp.json` in the project rather than to a user-level config. Anyone opening the repo in Claude Code will see the server.
- `--transport http` — MCP-over-HTTP rather than stdio.
- `supabase` — the local name/handle the server will be registered under.
- Server URL: `https://mcp.supabase.com/mcp` with two query parameters:
  - `project_ref=fcdqrtxdkcqlxqsrwejs` — pins this MCP endpoint to one specific Supabase project. The project ref is short-lived-secret-adjacent (not a token, but points at a specific tenant).
  - `features=docs%2Caccount%2Cdatabase%2Cdebugging%2Cdevelopment%2Cfunctions%2Cbranching` — URL-encoded list of enabled feature groups. Decoded: `docs, account, database, debugging, development, functions, branching`.

**Enabled feature groups, plain:**
- `docs` — Supabase docs search
- `account` — org/project account operations
- `database` — table and query operations
- `debugging` — logs and diagnostics
- `development` — local dev workflow
- `functions` — Edge Functions
- `branching` — Supabase branch environments

**Post-install requirements Claude flagged:**
1. Supabase OAuth flow (browser) to authenticate the CLI against the project.
2. Restart Claude Code in the project directory so the new MCP registration loads.
3. Verify with `/mcp` in-session that the `supabase` server shows connected.

**Public-repo caveat Claude flagged:** `--scope project` commits the MCP config into git. `project_ref` itself is not a secret, but anyone with repo access will see it — worth naming if the repo is public.

**Why start a new chat.** Claude's reasoning to Mike, verbatim:

> "1. **This session is scoped to your Shopify theme repo** - I'm working in `/home/user/shopify` on the Chicago Futures Salon theme. A new Supabase-to-Shopify integration is a different project.
> 2. **Fresh context helps** - A new chat lets you set up the right repo/environment from the start (Supabase project connected, proper tooling, etc.) instead of fighting the current session's setup.
> 3. **Different tools needed** - Supabase integration work needs the Supabase MCP tools active and connected to your specific project. Better to start fresh with that configured."

## The sequence

1. Mike: *"I'm building something new. Should I start a new chat in claude so you understnadn. We re gong hto ahve to conecnt the supbase site to shopfy"*
2. Claude said yes, listed the four things to have ready before starting the new chat: what you're building, Supabase project URL/details, Shopify admin access, whether it's a new repo or an extension of the existing theme.
3. Mike, without waiting, pasted the exact `claude mcp add` command he was going to run.
4. Claude explained what the command did, flagged the OAuth-then-restart flow, and named the public-repo caveat on `--scope project`.

## Numbers

- Supabase project ref pinned by the command: `fcdqrtxdkcqlxqsrwejs`
- Feature groups enabled: 7 (`docs, account, database, debugging, development, functions, branching`)
- Config target: `.mcp.json` at project root (committed to git)

## In my words

> "I'm building something new. Should I start a new chat in claude so you understnadn. We re gong hto ahve to conecnt the supbase site to shopfy"

> `claude mcp add --scope project --transport http supabase "https://mcp.supabase.com/mcp?project_ref=fcdqrtxdkcqlxqsrwejs&features=docs%2Caccount%2Cdatabase%2Cdebugging%2Cdevelopment%2Cfunctions%2Cbranching"`

## Gaps

- The transcript does not say what Mike is actually building — customer data sync, product mirror, auth, webhooks, something else. Claude asked; the transcript ends before an answer.
- No confirmation the command was ever run.
- No confirmation the Supabase OAuth flow succeeded, no `/mcp` output showing the server connected.
- No indication whether the target project (`fcdqrtxdkcqlxqsrwejs`) is the store's production Supabase or a new dev project.
- The transcript does not indicate whether Mike's new session got started, or where.
