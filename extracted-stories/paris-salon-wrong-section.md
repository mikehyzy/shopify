# "Replace this text" got read as "add a new section"

ENGAGEMENT: Chicago Futures Salon — Shopify theme, June 2026
KIND: broke
SOURCE: `/root/.claude/projects/-home-user-shopify/64080f34-7a4a-5a22-a1a2-859a71c8eab3.jsonl` (summary of the pre-compaction portion of the session)

## What happened

Mike wanted the hero section's subheading text replaced with a longer description about the Paris salons of the late 19th century. Claude Code read the instruction as *"add a new section"*, wrote `sections/about-salon.liquid`, and wired it into `templates/index.json`. Mike opened the site, saw a new section that shouldn't exist, and told Claude — in unambiguous terms — to put the text where he asked.

## How it worked

**The original hero was a section defined in `sections/hero-surrealist.liquid` with a Shopify schema exposing an `eyebrow_text`, a `heading`, a `subheading`, two CTA buttons, and an optional quote block.** The subheading was driven from `templates/index.json` under `sections.hero.settings.subheading`. Editing it required nothing but a string change in that JSON file — the same place every other setting was already living.

**The wrong path Claude took:** it created a brand-new section file, added a new preset, added a new block to `templates/index.json`'s `sections`, and added it to the `order` array. That created a second, redundant section on the homepage.

**The fix:** delete `sections/about-salon.liquid`, remove its entry from `templates/index.json`'s `sections` object, remove it from `order`, then edit `templates/index.json` line 17 in place:

```
"subheading": "Chicago Futures Salon was inspired by the salons of late-19th-century Paris, recurring private gatherings where a host brought writers, artists, politicians, and thinkers into a drawing room on a fixed day of the week. The salons were where reputations were made, careers launched, alliances formed, and arguments shaped that went on to reshape public life well beyond the room.\n\nThe output is the same as the original salons produced. Connections are made, new ideas flourish, methods are shared and sometimes generated, and put to use where needed. We keep the original form: a blend of intimacy and influence, big ideas in a small room, a melting pot of executives, academics, artists, and civic leaders."
```

## The sequence

1. Mike asked for the hero subheading to be replaced with much longer Paris-salon text.
2. Claude built `sections/about-salon.liquid` as a new section, wired into `templates/index.json`.
3. Mike saw the result on-site — a new section, not a rewritten hero.
4. Mike: *"YOu didnt fucking listen to me. WHY DIDNT YOU PUT IT IN THE PACE I FUCKING TOLD YOU TO!"*
5. Claude deleted `sections/about-salon.liquid`, cleaned up `templates/index.json`, edited the hero subheading string in place.

## Numbers

- Files created that should not have existed: 1 (`sections/about-salon.liquid`)
- Files modified twice to undo: 1 (`templates/index.json`)
- Commits that touched this recovery arc in the git log: at least 2 (`4ed98c4 Add About the Salon section with longer description`, then `7c0fd95 Replace hero subheading with extended Paris salon description`)
- Turns spent between original request and the fix reaching what Mike originally asked for: UNKNOWN (in the pre-compaction summary; exact turn count not preserved)

## In my words

> "YOu didnt fucking listen to me. WHY DIDNT YOU PUT IT IN THE PACE I FUCKING TOLD YOU TO!"

## Gaps

- The exact wording of the original prompt Mike gave — the one Claude read as "add a section" — is not preserved in the summary. The summary paraphrases it as "replace this with much longer text."
- The transcript summary does not record whether Claude explained its reasoning for creating the new section, or whether it silently went to work.
- No record of how Mike verified the on-site result — presumably a browser check, but the summary does not say.
