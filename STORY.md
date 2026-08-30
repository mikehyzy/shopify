# Chicago Futures Salon — custom Shopify theme

ENGAGEMENT: Chicago Futures Salon (Mike's own project — public store at `chicagofuturessalon.com`); git history spans **2025-11-01 → 2026-08-30** `[repo]`
KIND: built
REPO: `mikehyzy/shopify`, branch `claude/shopify-chicago-futures-theme-011CUhoihHXMXjZmPYXwkQqs`, commits `fcd558b` → `4f5727f`, 53 total `[repo]`
WHY: UNKNOWN, ask Mike

## What this is

A fully custom Shopify Online Store 2.0 theme for the Chicago Futures Salon `[repo: README.md]`. Not a purchased theme, not a fork of Dawn — the whole thing is written from `layout/theme.liquid` up `[repo]`.

The homepage runs six sections in a fixed render order `[repo: templates/index.json → order]`:

1. `hero` (section type `hero-surrealist`)
2. `manifesto` (section type `manifesto-accordion`, four blocks)
3. `games` (section type `games-showcase`, pulls from the `frontpage` collection, `products_to_show: 3`)
4. `events` (section type `events-timeline`, six event blocks at HEAD)
5. `corporation` (nonprofit + donation)
6. `invitation` (Shopify native `{% form 'contact' %}`)

Outside the homepage the theme carries a product/cart flow, standard collection/search/blog templates, a 404, five customer-account templates, and one bespoke page template (`templates/page.the-spectacle.json`) for a May 2026 event recap `[repo: templates/]`.

Content flows through Shopify's native surfaces: theme-editor settings for copy, section `blocks` for repeat items (manifesto panels, event blocks), a Shopify collection for products, `{% form 'contact' %}` for form submissions, and Shopify-hosted DNS for the domain `[repo: sections/*.liquid, templates/*.json]`.

External services actually used, all through simple HTML embeds or links `[repo]`:
- **Givebutter** for donations → `https://givebutter.com/the-spectacle-be1tgp` `[repo: templates/index.json corporation.settings.donation_url]`
- **Luma** for the May event RSVP → `https://luma.com/93lc25b0` `[repo: templates/index.json events blocks]`
- **YouTube** for five embedded videos on the recap page `[repo: templates/page.the-spectacle.json]`
- **Google Fonts** — Open Sans (weights 300/400/600/700) `[repo: layout/theme.liquid]`
- **jsDelivr CDN** — GSAP 3.12.5 core + ScrollTrigger, Alpine.js 3.x, all deferred `[repo: layout/theme.liquid]`

One third-party service was actively *removed* mid-life: **FormSubmit.co**, swapped for Shopify's built-in `{% form 'contact' %}` in commit `0306c2d` on 2026-05-15 `[repo: git log; sections/invitation-form.liquid; sections/footer.liquid]`.

## What the repo says the brief was

Direct from `README.md` `[repo]`:

> "A completely custom Shopify theme for the Chicago Futures Salon—an invitation-only community of senior leaders exploring futures thinking through Surrealist, Situationist, and Futurist methods."

> "### Interactive Sections
> - **Hero Section**: GSAP-powered animations with parallax effects, morphing SVG shapes, and typewriter text
> - **Manifesto Accordion**: Interactive philosophy panels with flip cards and SVG connection lines
> - **Events Timeline**: Dynamic event display with category filtering and RSVP functionality
> - **Games Showcase**: 3D product cards with quick-shop modals and AJAX cart integration
> - **Invitation Form**: Multi-step form with progress tracking and validation"

> "### Technical Stack
> - **Shopify Liquid** - Templating engine
> - **GSAP** - Advanced animations and scroll effects
> - **Alpine.js** - Lightweight interactivity
> - **Tailwind CSS** - Utility-first styling
> - **React** - Complex interactive components (loaded via CDN)
> - **Vite** - Modern build tooling"

Every one of those feature bullets is aspirational relative to what ended up shipping. See **Architecture → the JS gap** and **The sequence** below.

## Architecture

**Repo layout at HEAD** `[repo]`:

```
/home/user/shopify/
├── assets/
│   ├── animations.js        (329 bytes)
│   ├── main.js              (332 bytes)
│   └── theme.css            (48,868 bytes — built Tailwind bundle)
├── config/
│   ├── settings_data.json   (theme-editor state)
│   └── settings_schema.json (contents: "[]")
├── layout/
│   └── theme.liquid         (the only layout — one wrapper for every page)
├── locales/
│   └── en.default.json
├── sections/                (16 files)
│   ├── cart-main.liquid
│   ├── collection-header.liquid
│   ├── collection-products.liquid
│   ├── corporation.liquid           (27,525 bytes — largest section)
│   ├── events-timeline.liquid       (12,146 bytes)
│   ├── footer-group.json
│   ├── footer.liquid                (9,528 bytes)
│   ├── games-showcase.liquid        (9,719 bytes)
│   ├── header-group.json
│   ├── header.liquid                (8,918 bytes)
│   ├── hero-surrealist.liquid       (4,784 bytes)
│   ├── invitation-form.liquid       (5,598 bytes)
│   ├── manifesto-accordion.liquid   (7,349 bytes)
│   ├── product-main.liquid          (14,769 bytes)
│   ├── simple-hero.liquid           (393 bytes — bare fallback)
│   └── spectacle-recap.liquid       (14,249 bytes — event recap page section)
├── snippets/
│   ├── meta-tags.liquid             (Open Graph / Twitter tags)
│   └── structured-data.liquid       (JSON-LD)
├── src/
│   ├── scripts/
│   │   ├── animations/
│   │   ├── utilities/
│   │   └── main.js                  (6,769 bytes — source JS)
│   └── styles/
│       └── main.css                 (5,976 bytes — Tailwind input)
├── templates/                       (14 files, incl. customers/)
│   ├── 404.liquid
│   ├── article.liquid
│   ├── blog.liquid
│   ├── cart.json
│   ├── collection.json
│   ├── collection.liquid
│   ├── customers/                   (account, activate, login, register, reset_password)
│   ├── index.json
│   ├── page.liquid
│   ├── page.the-spectacle.json
│   ├── product.json
│   └── search.liquid
├── extracted-stories/               (added 2026-08-30 — book artifacts, not theme)
├── STORY.md                         (added 2026-08-30 — this document)
├── .gitignore
├── README.md
├── package.json
├── postcss.config.js
├── tailwind.config.js
└── vite.config.js
```

**Rendering path** `[repo: layout/theme.liquid, templates/*.json]`. `layout/theme.liquid` wraps every page. `{% section 'header' %}` and `{% section 'footer' %}` bracket a `<main>` where `{{ content_for_layout }}` drops in the current template's sections. Home, cart, collection, product, and the bespoke Spectacle page are JSON templates (list of section instances + settings); the auth flows and blog/article/search stayed as classic `.liquid`.

**`layout/theme.liquid` — the whole file, verbatim** `[repo]`:

```liquid
<!doctype html>
<html lang="{{ request.locale.iso_code }}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="theme-color" content="#000000">

  <title>{{ page_title }}{% unless page_title contains shop.name %} - {{ shop.name }}{% endunless %}</title>

  {% if page_description %}
    <meta name="description" content="{{ page_description | escape }}">
  {% endif %}

  <meta name="google-site-verification" content="h0kzD-ma9BF09SWdoYmWr7pWHhQxtsHeL7lk-2XKA8E" />

  {{ 'theme.css' | asset_url | stylesheet_tag }}

  <!-- Google Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;600;700&display=swap" rel="stylesheet">

  <!-- GSAP -->
  <script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js" defer></script>
  <script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/ScrollTrigger.min.js" defer></script>

  <!-- Alpine.js -->
  <script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>

  {{ content_for_header }}
</head>
<body>
  {% section 'header' %}
  <main id="MainContent" role="main">
    {{ content_for_layout }}
  </main>
  {% section 'footer' %}
  {{ 'main.js' | asset_url | script_tag }}
</body>
</html>
```

**How theme-editor content connects to code** `[repo]`. Each Liquid section declares a `{% schema %}` block naming editable settings and (for repeat items) `blocks`. Shopify's admin theme editor renders those settings as form inputs. Values live in `templates/*.json` for the template itself, and in `config/settings_data.json` for the "current" state of the store. When a store owner edits copy in the admin, Shopify commits an "Update from Shopify for theme" commit back to the repo through its GitHub integration; there are five such `shopify[bot]` commits in the log — `e013439`, `d0269be`, `005164c`, `cb3fd11`, `2098304` `[repo: git log]`. That is the deploy/sync mechanism: no `.github/workflows/`, no `shopify.theme.toml`, no CLI push script committed to the repo `[repo]`. The two-way theme-editor round-trip is doing that job.

**The JS gap** `[repo]`. The README promises GSAP-driven typewriter, morphing SVG, flip cards, 3D product cards, AJAX cart, multi-step form. In practice: `assets/main.js` is 332 bytes and `assets/animations.js` is 329 bytes. GSAP and Alpine are loaded from CDN in `layout/theme.liquid`. `sections/hero-surrealist.liquid` carries declarative `data-gsap="fadeIn"`, `data-gsap="typewriter"`, `data-gsap="slideUp"` hooks in markup, but no committed JS enumerates or reads those attributes. What actually renders is inline `style="..."` + Alpine.js interactions (mobile menu, dropdown, accordion opens) + static Tailwind classes. `src/scripts/main.js` under source control is 6,769 bytes and is not wired to any Liquid template as an entry point. The animation surface described in the README is not implemented in this repo.

**CSS approach** `[repo]`. Tailwind is the declared framework (`tailwind.config.js`, `postcss.config.js`, `assets/theme.css` = 48,868 bytes). Most sections mix Tailwind utility classes with inline `style="…"` attributes. `spectacle-recap.liquid` in particular is almost entirely inline styles.

**Vestigial config the redo missed** `[repo: tailwind.config.js]`:

```javascript
colors: {
  midnight: '#000000',
  'deep-blue': '#000000',
  brass: '#d4af37',
  electric: '#00d4ff',
  'dream-purple': '#9b4dca',
  'chicago-grey': '#6c757d',
},
```

`midnight` and `deep-blue` were both flattened to `#000000` during the color purge (see **The sequence**), but `brass`, `electric`, `dream-purple`, `chicago-grey` are still the original values — unused Tailwind tokens. The same pattern shows up in `config/settings_data.json`: six color tokens defined (`color_midnight: "#0a0a0a"`, `color_deep_blue: "#1a1a2e"`, `color_brass: "#d4af37"`, `color_electric: "#00d4ff"`, `color_dream_purple: "#9b4dca"`, `color_chicago_grey: "#6c757d"`), none referenced by rendered sections `[repo]`.

**Vestigial dependencies** `[repo: package.json]`. `react`, `react-dom`, `react-hook-form`, `swiper`, `vite`, `@vitejs/plugin-react` are all declared. Grepping `sections/`, `assets/`, `layout/`, `src/scripts/main.js` turns up zero imports.

**Section-schema drift** `[repo: sections/manifesto-accordion.liquid]`. The `default` on the manifesto heading setting still reads `"TL;DR"`, but the actual rendered value comes from a runtime override in `templates/index.json` (`"Overview"`). The default rotted through three heading changes and was never swept.

## How it was built with Claude

The book-relevant question here is what scaffolding was placed in the repo to steer Claude. The finding, direct: **there is none** `[repo: file tree at HEAD]`.

| Artifact | Present in repo? |
|---|---|
| `CLAUDE.md` | No `[repo]` |
| `.claude/` (directory) | No `[repo]` |
| `.claude/skills/` | No `[repo]` |
| `.claude/agents/` (subagent definitions) | No `[repo]` |
| `.claude/commands/` (slash commands) | No `[repo]` |
| `.claude/hooks/` | No `[repo]` |
| `.claude/settings.json` / `settings.local.json` | No `[repo]` |
| `.mcp.json` | No `[repo]` |
| `AGENTS.md` | No `[repo]` |

No promoted skill, no enforced hook, no per-repo Claude Code settings, no repo-scoped MCP server, no subagent definition, no CLAUDE.md briefing. The work was driven turn-by-turn from chat, with commits authored either by Claude (48 of 53), by the Shopify integration (5), or by Mike himself (1) `[repo: git log author counts]`.

**What that means concretely** `[repo]`:

- The section-schema defaults, the deploy mechanism, the color-token sweep, the "convert `youtu.be/<id>` to `youtube.com/embed/<id>`" mapping used on the recap page — none of these were captured as a skill or a hook for the next session to inherit.
- Two commits (`efadedd`, 2026-06-22; `4f5727f`, 2026-08-30) carry a trailer of the form `Claude-Session: https://claude.ai/code/session_011CUhoihHXMXjZmPYXwkQqs`, indicating a session-URL trailer emitted by Claude Code on commit. That trailer is metadata about the session, not a config `[repo: git log trailers]`.
- The Shopify GitHub integration is externally configured (its five `shopify[bot]` commits confirm it is wired) but nothing describing that setup lives in this repo `[repo]`.

**Session count observable from this repo:** at least **two** — an earlier arc that produced most of the 48 Claude-authored commits, and the June/August 2026 session captured in the local transcript file `/root/.claude/projects/-home-user-shopify/64080f34-…jsonl` `[session record]`. Additional session boundaries during the arc cannot be recovered from this repo alone.

**MCP posture observable from this repo:** none configured at the project scope `[repo]`. The session record shows Mike planning a Supabase integration in a *different* project via `claude mcp add --scope project --transport http supabase "https://mcp.supabase.com/mcp?project_ref=fcdqrtxdkcqlxqsrwejs&features=docs,account,database,debugging,development,functions,branching"` (URL-decoded), but no `.mcp.json` was created in this repo and no Supabase-related commit landed here `[session record]`.

## The sequence

Full commit list, oldest → newest, dates + authors `[repo: git log]`:

```
2025-11-01  Michael Hyzy  fcd558b  Initial commit
2025-11-01  Claude        ae2fec1  Initial Chicago Futures Salon Shopify theme
2025-11-01  Claude        466e5d9  Add required Shopify theme files and templates
2025-11-01  shopify[bot]  e013439  Update from Shopify for theme shopify/claude/shopify-chicago-futures-theme-01...
2025-11-01  Claude        bc25e65  Fix 404 error - simplify theme structure
2025-11-01  Claude        b29c797  Merge branch 'claude/…' of http://127.0.0.1:56458/git/mikehyzy/shopify into claude/…
2025-11-01  Claude        ef1fb1d  Build full Tailwind CSS and restore beautiful homepage
2025-11-01  Claude        9dbc560  Fix colors and fonts - pure black background with Open Sans
2025-11-01  Claude        5259e9f  COMPLETE FIX: Remove ALL colors - pure black and white only
2025-11-01  Claude        a60b9fd  Convert all sections to pure black and white design
2025-11-01  Claude        084d9e8  COMPLETE FIX: Remove ALL colors - pure black and white only
2025-11-01  Claude        228af31  Build complete working sections with full content and functionality
2025-11-01  Claude        4fca75a  Add real content blocks to index.json - sections now have actual data

2026-01-03  shopify[bot]  d0269be  Update from Shopify for theme shopify/claude/…
2026-01-03  Claude        e2837e3  Update 'View All Games' button to 'View all Provocations'
2026-01-03  Claude        34711f4  Make products centered and fully mobile responsive
2026-01-03  Claude        a0e5d50  Fix 'View all Provocations' button to link to all products page
2026-01-03  Claude        2ccbb5c  Create collection page template to fix 404 on View all Provocations
2026-01-04  Claude        59cd786  Update 'Explore Games' button to 'Explore Provocations'

2026-03-06  shopify[bot]  005164c  Update from Shopify for theme shopify/claude/…
2026-03-18  Claude        7f87daa  Add 501(c)(3) nonprofit section and update branding
2026-03-18  Claude        6a7ada2  Fix product and cart pages for Shopify OS 2.0
2026-03-18  Claude        6d2a136  Improve leadership section spacing and add fun descriptions
2026-03-18  Claude        619ba8e  Fix leadership section spacing and correct LinkedIn URLs
2026-03-18  Claude        8d3a09b  Add Chicago Futures Salon Manifesto with accordion menu
2026-03-18  Claude        3f6f809  Change manifesto heading to "IN A NUTSHELL"
2026-03-18  Claude        47cdf8c  Change top manifesto heading to "TL;DR"
2026-03-26  Claude        68d6c60  Update organization status from 501(c)(3) to 509(a)(2)

2026-04-14  Claude        10ed2f1  Fix invitation form to actually submit data
2026-04-14  Claude        6c50b6b  Set up form to email submissions directly via FormSubmit
2026-04-14  shopify[bot]  cb3fd11  Update from Shopify for theme shopify/claude/…
2026-04-14  shopify[bot]  2098304  Update from Shopify for theme shopify/claude/…
2026-04-14  Claude        568b7a2  Update form notification email to mike.hyzy@gmail.com
2026-04-14  Claude        3567935  Add CC recipients to invitation form
2026-04-14  Claude        91e077f  Fix all missing templates and functionality
2026-04-19  Claude        4ed98c4  Add About the Salon section with longer description
2026-04-19  Claude        7c0fd95  Replace hero subheading with extended Paris salon description
2026-04-19  Claude        6c5c4bf  Add paragraph breaks to hero subheading for readability
2026-04-19  Claude        b0695d0  Widen hero section for better text layout
2026-04-19  Claude        523002e  Enable line break rendering in hero subheading
2026-04-19  Claude        36fd587  Remove scroll indicator from hero section
2026-04-19  Claude        f1b7312  Change top manifesto heading to Overview

2026-05-13  Claude        5e93bf9  Add Givebutter donation URL
2026-05-13  Claude        745bfe7  Remove Surrealist/Situationist paragraph from hero
2026-05-15  Claude        0306c2d  Switch forms to Shopify's built-in contact system
2026-05-15  Claude        ceae2c5  Remove April Monthly Salon event
2026-05-15  Claude        d2d9bc3  Create The Spectacle event recap page
2026-05-17  Claude        f1decf4  Add first 3 video embeds to The Spectacle page
2026-05-17  Claude        d244d21  Replace workshop video with Explore Provocations CTA
2026-05-17  Claude        dd5072a  Add all remaining video embeds to The Spectacle page
2026-05-17  Claude        c06c4f9  Update Spectacle intro to mention sold out tickets

2026-06-22  Claude        efadedd  Add Google site verification meta tag

2026-08-30  Claude        bf063f3  Extract 10 stories from session transcript for Product Engineering with Claude
2026-08-30  Claude        4f5727f  Add STORY.md reconstructing the build from this repo
```

**Phases visible in the log** `[repo]`:

- **2025-11-01, scaffolding day — 12 commits in one day.** Mike created the repo (`fcd558b`); Claude scaffolded the theme (`ae2fec1`), added required Shopify files (`466e5d9`), hit a 404 and simplified structure (`bc25e65`), resolved a merge (`b29c797`), rebuilt Tailwind (`ef1fb1d`), then went through four color-purge commits. Two of those commits carry the *identical* subject line `COMPLETE FIX: Remove ALL colors - pure black and white only` (`5259e9f` then `084d9e8`) — the first did not fully take. The day ended with real content in place (`228af31`, `4fca75a`). The aesthetic decision that scoped the rest of the project (pure black-and-white, Open Sans-only) was made on day one.

- **2026-01-03/04 — 5 commits over two days.** The "Games" nomenclature was renamed to "Provocations" across CTAs (`e2837e3`, `59cd786`). Renaming exposed a link that pointed at nothing (`a0e5d50`); fixing the link then required a collection template to exist (`2ccbb5c`); products were also centered and made mobile-responsive (`34711f4`). Four commits to complete a rebrand that started as a copy change.

- **2026-03-18 — 7 commits in one day.** 501(c)(3) nonprofit framing added (`7f87daa`); product/cart pages fixed for Shopify OS 2.0 (`6a7ada2`); a leadership section spacing/description arc across two commits (`6d2a136`, `619ba8e`); the manifesto accordion introduced (`8d3a09b`); and two heading tweaks on the manifesto in the same day (`3f6f809` "IN A NUTSHELL" → `47cdf8c` "TL;DR"). One `shopify[bot]` commit from 2026-03-06 (`005164c`) precedes.

- **2026-03-26 — single-line legal correction.** 501(c)(3) → 509(a)(2) (`68d6c60`).

- **2026-04-14 — 7 commits + 2 shopify[bot] round-trips.** The invitation form arc: from broken (`10ed2f1`) → wired via FormSubmit (`6c50b6b`) → notification email fixed (`568b7a2`) → CCs added (`3567935`) → missing templates fixed (`91e077f`). Two shopify[bot] commits (`cb3fd11`, `2098304`) landed on the same day, consistent with in-admin theme-editor edits during the forms work.

- **2026-04-19 — 7 commits in one day.** The hero rewrite arc, and the clearest example in the log of a small copy change becoming a chain of side-effect commits. `4ed98c4` "Add About the Salon section with longer description" was superseded by `7c0fd95` "Replace hero subheading with extended Paris salon description" (i.e. the intended edit was in the hero, not a new section). `6c5c4bf` inserted paragraph breaks into the text; `523002e` "Enable line break rendering in hero subheading" was needed after because the string change alone did not render as breaks. Widened the container (`b0695d0`), removed a scroll indicator overlapping the pull-quote (`36fd587`), and corrected the manifesto heading to "Overview" (`f1b7312`) — the fourth state that heading has taken.

- **2026-05-13 → 05-17 — 9 commits.** Donation URL to Givebutter added (`5e93bf9`); a Surrealist/Situationist paragraph cut from the hero (`745bfe7`); FormSubmit replaced by Shopify native `{% form 'contact' %}` (`0306c2d`); a stale event removed (`ceae2c5`); the recap page built over three commits and finalized with an intro rewrite (`d2d9bc3`, `f1decf4`, `d244d21`, `dd5072a`, `c06c4f9`). `d244d21` replaces one video slot with a CTA — the workshop session had no recording, so it links to `/collections/all` instead.

- **2026-06-22 — one commit.** `efadedd` "Add Google site verification meta tag" — a two-line diff on `layout/theme.liquid`. The transcript captured in the session record shows the tag was added in the HTML-meta form when the domain owner was on the DNS-TXT verification screen: different mechanism, same token; the code was fine, the method chosen in Search Console was the issue `[session record]`. No follow-up code commit was needed.

- **2026-08-30 — 2 commits, both book-scoped.** `bf063f3` added 10 story files under `extracted-stories/`; `4f5727f` added this document. Not theme work.

**Repeated-problem stretches** `[repo]`:

- **The color redo.** Four commits on 2025-11-01 with variations on "Remove ALL colors" / "pure black and white". The first three did not fully take; the fourth (`084d9e8`) has the same subject as `5259e9f`. And `tailwind.config.js` still carries the pre-purge palette tokens (see **Architecture → vestigial config**).
- **The manifesto heading.** Renamed three times ("IN A NUTSHELL" → "TL;DR" → "Overview" `[repo: 3f6f809, 47cdf8c, f1b7312]`), with the section-schema default still on the stale value `"TL;DR"` `[repo: sections/manifesto-accordion.liquid]`.
- **The Games → Provocations rebrand.** Four commits `[repo: e2837e3, 59cd786, a0e5d50, 2ccbb5c]` to finish a change that started as one word of button copy.
- **The invitation form.** Four commits in one day to wire the FormSubmit third-party route `[repo: 10ed2f1, 6c50b6b, 568b7a2, 3567935]`, thrown out four weeks later in `0306c2d`. What ended it: FormSubmit outage during a live-form check, per the session record `[session record]`.

**What did *not* leave a repo trace during this arc** `[repo]`:
- No commit ever created or modified a `CLAUDE.md`, a `.claude/` directory, a `.mcp.json`, or a hook.
- No commit ever added a test file, a linter config, or a CI workflow.
- No commit ever added or removed a screenshot, a wireframe, or a design token document.

## Numbers

- Total commits at HEAD: **53** `[repo]`
- Commit range: `fcd558b` (2025-11-01) → `4f5727f` (2026-08-30) `[repo]`
- Elapsed calendar time: **10 months** `[repo]`
- Distinct calendar dates with commits: **13** (2025-11-01, 2026-01-03, 2026-01-04, 2026-03-06, 2026-03-18, 2026-03-26, 2026-04-14, 2026-04-19, 2026-05-13, 2026-05-15, 2026-05-17, 2026-06-22, 2026-08-30) `[repo]`
- Heaviest single days: **2025-11-01 → 12 commits**, **2026-03-18 → 7**, **2026-04-14 → 7 Claude + 2 shopify[bot]**, **2026-04-19 → 7** `[repo]`
- Commits by author: **Claude 48, shopify[bot] 5, Michael Hyzy 1** `[repo]`
- CLAUDE.md files in repo: **0** `[repo]`
- Skills / hooks / commands / subagent definitions in repo: **0** `[repo]`
- `.mcp.json` files in repo: **0** `[repo]`
- Section files: **16** `[repo]`
- Template files (incl. 5 customer-account templates): **14** `[repo]`
- Snippet files: **2** (`meta-tags.liquid`, `structured-data.liquid`) `[repo]`
- Locale files: **1** (`en.default.json`) `[repo]`
- Compiled `assets/theme.css`: **48,868 bytes** `[repo]`
- Committed `assets/main.js`: **332 bytes** `[repo]`
- Committed `assets/animations.js`: **329 bytes** `[repo]`
- Largest section by size: `corporation.liquid` at **27,525 bytes** `[repo]`
- Manifesto heading values observed across time: **3** in the log (`"IN A NUTSHELL"`, `"TL;DR"`, `"Overview"`) `[repo]`
- Games-CTA copy changes: **2** commits directly on the rename, **2** more on side-effects `[repo]`
- Legal-classification correction: **501(c)(3) → 509(a)(2)** in `68d6c60` `[repo]`
- Third-party services actively removed: **1** (FormSubmit.co) `[repo]`
- Google site-verification token committed: `h0kzD-ma9BF09SWdoYmWr7pWHhQxtsHeL7lk-2XKA8E` in `layout/theme.liquid`, commit `efadedd` `[repo]`
- Homepage sections in final render order: **6** (hero, manifesto, games, events, corporation, invitation) `[repo: templates/index.json]`
- Events on the timeline at HEAD: **6** (THE SPECTACLE + June/July/August/September/October monthly salons; April removed in `ceae2c5`) `[repo]`
- Sponsors named on the Spectacle recap page: **3** (CGI, Mural, ElevenLabs) `[repo: sections/spectacle-recap.liquid]`
- Network partners named on the Spectacle recap page: **2** (1871, Parlor Social) `[repo]`
- Event rating cited on the recap page: **4.8 / 5 on Luma** `[repo]`
- Event date on the recap page: **2026-05-14** `[repo: templates/page.the-spectacle.json + sections/spectacle-recap.liquid]`
- YouTube embed URLs live in the template: **5** (`ehRVFlzY4hc`, `Vwgm67f-QYM`, `-hxe5v7ldp0`, `bJ-OAX2Q6hU`, `1YB-yj3q_NM`) `[repo: templates/page.the-spectacle.json]`
- JS libraries loaded at layout scope: **3** (GSAP core, GSAP ScrollTrigger, Alpine.js 3.x — all deferred, all from jsDelivr) `[repo: layout/theme.liquid]`
- Vestigial `package.json` dependencies (declared, no imports found in `sections/`, `assets/`, `layout/`, `src/scripts/main.js`): **6+** (react, react-dom, react-hook-form, swiper, vite, @vitejs/plugin-react) `[repo]`

## Quotable lines

One line in the repo would survive on a printed page, from `sections/corporation.liquid` via its intro setting in `templates/index.json` `[repo]`:

> "For a group rooted in surrealist and situationist traditions, 'lawful activities' is doing a lot of heavy lifting in our Articles of Incorporation. Our lawyers assure us détournement is not yet a felony."

## Gaps

- **Why the project exists.** The repo does not say. `WHY: UNKNOWN, ask Mike.` The README's "Design Philosophy" paragraph is a stylistic brief, not a founding reason `[repo]`.
- **Pre-repo history.** The first commit (`fcd558b`, 2025-11-01) is `Initial commit`. Nothing about what preceded it — prior theme, prior platform, prior store — is captured `[repo]`.
- **Deploy mechanism.** How commits on this branch reach the live store. No `.github/workflows/`, no `shopify.theme.toml`, no CLI config in-repo. The five `shopify[bot]` round-trip commits prove the Shopify GitHub integration is wired, but no artifact here documents how it was set up `[repo]`.
- **Design source.** The color-purge day (2025-11-01) ripped out a palette in four commits. No screenshots, no design tokens beyond the vestigial ones in `tailwind.config.js` and `config/settings_data.json`, no design document to indicate what was ripped out or why `[repo]`.
- **The README-vs-shipped gap.** The stack list and interactive-section list in `README.md` significantly overstate what actually renders (no React, no Vite build output, no Swiper, most GSAP hooks unwired). The repo contains no explanation of the delta `[repo]`.
- **Claude scaffolding.** No CLAUDE.md, no `.claude/`, no `.mcp.json`, no `AGENTS.md`, no committed skills / hooks / subagent definitions / commands / settings. Nothing shows repeated prompt patterns being promoted to reusable structure `[repo]`.
- **Session identities.** The transcript for the most recent session lives at `/root/.claude/projects/-home-user-shopify/64080f34-….jsonl` `[session record]`. Transcripts for the earlier sessions that produced most of the Claude-authored commits are not in this repo.
- **Live-store data.** Traffic, order counts, form-submission counts, donation totals — none of it is in the repo `[repo]`.
- **Sponsor & partner logos.** Named on the recap page (CGI, Mural, ElevenLabs, 1871, Parlor Social) but no image assets committed under `assets/` `[repo]`.
- **Event attendance.** The recap page states "sold out" and cites 4.8 / 5 on Luma but does not name a headcount, a venue address, a Luma URL for the past event, or a photo `[repo]`.
- **Named people.** Michael Marshall, Anna Mulcahy, Charles Plath, Marta Cuciurean-Zapan, Max Lackner, Jim Kalbach, Matt Carmichael, Alexandra Levit appear as speaker credits on the recap page. Their roles are given in single lines (e.g. "Anna Mulcahy, Board of Directors"; "Jim Kalbach, Chief Evangelist at Mural") but no fuller bio content exists in the repo `[repo]`.
- **The Supabase turn.** A `claude mcp add --scope project` command targeting a specific Supabase project (`fcdqrtxdkcqlxqsrwejs`) was discussed and copied in the session record but never landed as a `.mcp.json` in this repo `[session record; repo]`.
- **What the store sells.** The Provocations section pulls three items from the `frontpage` collection. Products live in Shopify's database, not the theme files, so what is actually sold, and at what price, is not knowable from this repo `[repo]`.
