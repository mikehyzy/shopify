# A skill installed on the Mac that a remote Claude Code session can't see

ENGAGEMENT: Chicago Futures Salon — extending the Shopify site with a Supabase backend, August 1, 2026
KIND: learned
SOURCE: `/root/.claude/projects/-home-user-shopify/64080f34-7a4a-5a22-a1a2-859a71c8eab3.jsonl`

## What happened

Mike ran `npx skills add supabase/agent-skills` on his Mac. The installer pulled `supabase/agent-skills` from GitHub, offered two skills (`supabase`, `supabase-postgres-best-practices`), and installed both to `~/.agents/skills/` as symlinks intended for Claude Code and other agent hosts. Then it offered `find-skills` (from `vercel-labs/skills`) and installed that too.

He pasted the full terminal output into the chat and asked: *"Hey i just installed this, can you use it?"*

The answer was no, twice over:
1. **Scope mismatch.** Those skills live on `michaelhyzy@Michaels-Mac-Studio`, at `~/.agents/skills/`. This Claude Code session is running in a remote container, isolated from Mike's local filesystem. Whatever's on the Mac is invisible here.
2. **Wrong target platform.** The `supabase` skills are for working with a Supabase Postgres backend. The current task (Google site-verification) had nothing to do with Supabase; the store runs on Shopify.

Both were worth naming. The scope issue is the more durable lesson — anything installed against a locally-running Claude Code doesn't automatically apply to a remote session on the same account.

## How it worked

**What the installer actually did on the Mac, per the pasted output:**

- Source: `https://github.com/supabase/agent-skills.git` — cloned locally.
- Detected 2 skills in the repo: `supabase-postgres-best-practices`, `supabase`.
- Detected 75 agent hosts to install into.
- Installation scope: **Global** (`~/.agents/skills/`, not per-project).
- Installation method: **Symlink** — one canonical copy at `~/.agents/skills/<name>`, symlinked into per-host directories.
- Reported successful install into "Claude Code" via symlink.
- Then reported **failure** for the same skills into "PromptScript": *"PromptScript does not support global skill installation."* — non-fatal, that host was skipped, but the message was printed as a failure line.
- Followed with a second install pass for `vercel-labs/skills` → `find-skills`. Same shape: symlink into Claude Code succeeded, PromptScript rejected global installs.

Two independent skill packages installed. Both landed in `~/.agents/skills/`. All three (`supabase`, `supabase-postgres-best-practices`, `find-skills`) were symlinked into local Claude Code.

**Risk assessments printed by the installer:**
- `supabase` — Gen: Safe, Socket: 0 alerts, Snyk: Med Risk
- `supabase-postgres-best-practices` — Gen: Safe, Socket: 0 alerts, Snyk: Low Risk
- `find-skills` — Gen: Safe, Socket: 0 alerts, Snyk: Med Risk

Detail link (from the installer output): `https://skills.sh/supabase/agent-skills` and `https://skills.sh/vercel-labs/skills`.

**Why the remote session couldn't see them.** This container was spun up fresh for the Shopify repo (`/home/user/shopify`). It has no shared home directory with the Mac. Skills placed at `~/.agents/skills/` on the Mac live entirely on the Mac. The remote session loads its own set from its own environment; nothing crosses.

## The sequence

1. Mike ran the installer on his Mac, walked through the interactive prompts (Selected both skills; Global; Symlink; Proceed: Yes; Install find-skills: Yes).
2. Installer reported: Installed 2 skills into Claude Code (via symlink). Failed on PromptScript.
3. Second pass: Installed 1 skill (find-skills), same shape.
4. Mike pasted the full terminal transcript into the chat with the question *"Hey i just installed this, can you use it?"*.
5. Claude answered: no — the skills are on your local Mac (`michaelhyzy@Michaels-Mac-Studio`), and this remote container has no access. Also flagged that Supabase skills aren't relevant to the current Shopify + DNS-verification work.

## Numbers

- Skills installed on the Mac: 3 (`supabase`, `supabase-postgres-best-practices`, `find-skills`)
- Agent hosts the installer offered to target: 75
- Agent hosts that accepted global install: many (universal path)
- Agent hosts that rejected the global-scope install: 1 (`PromptScript` — "does not support global skill installation")
- Skills available to *this* remote session as a result of the install: 0

## In my words

> "Hey i just installed this, can you use it?"

## Gaps

- The transcript does not record what Mike was hoping to do with the Supabase skills at that moment. He mentions Supabase later ("connect the supbase site to shopfy") but the tie between installing the skill and the immediate task (finishing Google verification) is not made explicit.
- No record of whether Mike later tried the skills in a *local* Claude Code session on the Mac.
- No inspection of what's actually inside the `supabase` skill — the installer names it but nothing in the transcript quotes its contents, prompts, or triggers.
- No investigation of what Claude Code's config would need to look like to load a skill installed at `~/.agents/skills/` — the mechanism is asserted, not demonstrated.
