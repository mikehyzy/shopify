# Building the Chicago Futures Salon Shopify theme from scratch: 52 commits, one arc

ENGAGEMENT: Chicago Futures Salon — Shopify theme (`chicagofuturessalon.com`), spanning the whole build
KIND: built
SOURCE: `git log` on branch `claude/shopify-chicago-futures-theme-011CUhoihHXMXjZmPYXwkQqs` in `mikehyzy/shopify`; final files in `/home/user/shopify/*`; pre-compaction session summary in `/root/.claude/projects/-home-user-shopify/64080f34-….jsonl`

## What happened

Mike stood up the Chicago Futures Salon store as a **fully custom Shopify theme** — no purchased theme, no theme framework beyond Shopify's Online Store 2.0 (JSON templates + Liquid sections + block-driven customization). The build is a single feature branch, 52 commits, one continuous arc — from `Initial commit` and `Initial Chicago Futures Salon Shopify theme` at the tail all the way through to `Add Google site verification meta tag` at the head. It shows the moves: pick a stack, discover the stack is fantasy, throw the aesthetic out, redo everything as pure black-and-white with real content, add the nonprofit structure, add the manifesto, plumb the forms, iterate the hero, add the event page, finish with the verification meta tag.

## How it worked

**Shopify OS 2.0, straight.** Templates are JSON files under `templates/`. Each references sections defined in `sections/*.liquid`. Each section carries a `{% schema %}` block that exposes settings (text, textareas, checkboxes, image pickers, link lists, etc.) editable from the Shopify theme editor. `blocks` inside a section (like the accordion panels or events on the timeline) are the primitive Shopify uses to let store owners add repeatable content without touching code.

**Repo structure (final):**

```
/home/user/shopify/
├── assets/              # Compiled CSS
├── config/              # settings_data.json (theme editor state), settings_schema.json (currently near-empty: "[]")
├── layout/              # theme.liquid — one file, wraps every page
├── locales/
├── sections/            # hero-surrealist, manifesto-accordion, events-timeline, games-showcase, corporation, invitation-form, footer, spectacle-recap, header, ...
├── snippets/
├── src/                 # Tailwind input, PostCSS config
├── templates/           # index.json, page.the-spectacle.json, collection templates, cart, product, etc.
├── tailwind.config.js
├── postcss.config.js
├── vite.config.js
├── package.json
└── README.md
```

**`layout/theme.liquid` — the top-level wrapper, final state, quoted verbatim:**

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

**`templates/index.json` — the home page, driven entirely from section settings.** Six sections in this order: `hero` (hero-surrealist), `manifesto` (manifesto-accordion), `games` (games-showcase), `events` (events-timeline), `corporation`, `invitation` (invitation-form). Every piece of copy on the homepage lives in this JSON. Full content of hero and manifesto blocks is captured in the sibling stories (`paris-salon-wrong-section.md`, `hero-line-breaks.md`).

**Notable sections built:**

- `hero-surrealist.liquid` — full-viewport hero with eyebrow, headline, subheading, two CTA buttons, optional pull-quote. Black background, white type, Open Sans. Data attributes (`data-gsap="fadeIn"`, `data-gsap="typewriter"`, `data-gsap="slideUp"`) are present in the markup as animation hooks — the actual JS was intended to live in `assets/main.js`.
- `manifesto-accordion.liquid` — collapsible panels with per-panel title + HTML body. Four panels: "Futures Thinking", "Invitation-Only Community", "Experimental Methods", "Chicago Focus". Header text on the section iterated: "Our Manifesto" → "IN A NUTSHELL" → "TL;DR" → "Overview".
- `events-timeline.liquid` — repeated `event` blocks. Each block has title, date, time, location, description, RSVP flag, RSVP link. Live event list at the time of the last touch: THE SPECTACLE (May 14, 2026 — RSVP `https://luma.com/93lc25b0`), June/July/August monthly salons + Sept + Oct — some routing to a Google Form, some to a Luma link.
- `games-showcase.liquid` — product grid pulled from a collection (default `frontpage`). Header iterated: "Explore Games" → "View All Games" → "Explore Provocations" / "View all Provocations".
- `corporation.liquid` — the 509(a)(2) nonprofit section, with a donation-heading, donation text, and a `donation_url` that ended up pointing at `https://givebutter.com/the-spectacle-be1tgp`. Copy in the section is on-voice: *"For a group rooted in surrealist and situationist traditions, 'lawful activities' is doing a lot of heavy lifting in our Articles of Incorporation. Our lawyers assure us détournement is not yet a felony."*
- `invitation-form.liquid` — the request-invitation form. Full evolution captured in `formsubmit-outage-shopify-native.md`.
- `footer.liquid` — three-column footer (About, Quick Links, Connect + Newsletter), copyright, footer quote, optional payment icons.
- `spectacle-recap.liquid` — the event recap page (its own story: `spectacle-recap-page.md`).

**The stack story — README vs. actual repo.** The README promises a maximalist stack: GSAP, Alpine.js, Tailwind CSS, React (via CDN), Vite, ESLint, Prettier. `package.json` echoes it. Devcolors in `config/settings_data.json` reference an original palette:
- Midnight `#0a0a0a`
- Deep Blue `#1a1a2e`
- Brass `#d4af37`
- Electric `#00d4ff`
- Dream Purple `#9b4dca`
- Chicago Grey `#6c757d`

None of that survived. Halfway through the build, the whole theme was reset to pure black and white on Open Sans. The colored palette lives on only in `settings_data.json` as vestigial config. Same with React and Vite — declared as dependencies, not actually used in the shipped sections. Alpine and GSAP are still loaded from CDN in `theme.liquid`, but most sections opt for straight CSS and inline styles.

## The sequence (commit log, in order, oldest → newest — the whole 52-commit arc)

```
fcd558b Initial commit
ae2fec1 Initial Chicago Futures Salon Shopify theme
466e5d9 Add required Shopify theme files and templates
e013439 Update from Shopify for theme shopify/claude/...
bc25e65 Fix 404 error - simplify theme structure
b29c797 Merge branch 'claude/...' of http://127.0.0.1:56458/git/mikehyzy/shopify into ...
ef1fb1d Build full Tailwind CSS and restore beautiful homepage
9dbc560 Fix colors and fonts - pure black background with Open Sans
5259e9f COMPLETE FIX: Remove ALL colors - pure black and white only
a60b9fd Convert all sections to pure black and white design
084d9e8 COMPLETE FIX: Remove ALL colors - pure black and white only
228af31 Build complete working sections with full content and functionality
4fca75a Add real content blocks to index.json - sections now have actual data
d0269be Update from Shopify for theme shopify/claude/...
e2837e3 Update 'View All Games' button to 'View all Provocations'
34711f4 Make products centered and fully mobile responsive
a0e5d50 Fix 'View all Provocations' button to link to all products page
2ccbb5c Create collection page template to fix 404 on View all Provocations
59cd786 Update 'Explore Games' button to 'Explore Provocations'
005164c Update from Shopify for theme shopify/claude/...
7f87daa Add 501(c)(3) nonprofit section and update branding
6a7ada2 Fix product and cart pages for Shopify OS 2.0
6d2a136 Improve leadership section spacing and add fun descriptions
619ba8e Fix leadership section spacing and correct LinkedIn URLs
8d3a09b Add Chicago Futures Salon Manifesto with accordion menu
3f6f809 Change manifesto heading to "IN A NUTSHELL"
47cdf8c Change top manifesto heading to "TL;DR"
68d6c60 Update organization status from 501(c)(3) to 509(a)(2)
10ed2f1 Fix invitation form to actually submit data
6c50b6b Set up form to email submissions directly via FormSubmit
cb3fd11 Update from Shopify for theme shopify/claude/...
2098304 Update from Shopify for theme shopify/claude/...
568b7a2 Update form notification email to mike.hyzy@gmail.com
3567935 Add CC recipients to invitation form
91e077f Fix all missing templates and functionality
4ed98c4 Add About the Salon section with longer description
7c0fd95 Replace hero subheading with extended Paris salon description
6c5c4bf Add paragraph breaks to hero subheading for readability
b0695d0 Widen hero section for better text layout
523002e Enable line break rendering in hero subheading
36fd587 Remove scroll indicator from hero section
f1b7312 Change top manifesto heading to Overview
5e93bf9 Add Givebutter donation URL
745bfe7 Remove Surrealist/Situationist paragraph from hero
0306c2d Switch forms to Shopify's built-in contact system
ceae2c5 Remove April Monthly Salon event
d2d9bc3 Create The Spectacle event recap page
f1decf4 Add first 3 video embeds to The Spectacle page
d244d21 Replace workshop video with Explore Provocations CTA
dd5072a Add all remaining video embeds to The Spectacle page
c06c4f9 Update Spectacle intro to mention sold out tickets
efadedd Add Google site verification meta tag
```

Distinct arcs visible in the log, in order:
1. **Scaffolding** (`fcd558b` → `466e5d9`): initial + required Shopify files + templates.
2. **First 404 fix** (`e013439` → `bc25e65`): theme structure was breaking on the store.
3. **Style reset** (`ef1fb1d` → `084d9e8`): Tailwind rebuild, then three commits titled some flavor of "COMPLETE FIX: Remove ALL colors" — the color palette was killed.
4. **Real content in** (`228af31`, `4fca75a`): sections stopped being placeholders.
5. **Provocations rebrand** (`e2837e3` → `59cd786`): "Games" was renamed to "Provocations" across CTAs and collections.
6. **Nonprofit + leadership** (`7f87daa` → `619ba8e`): 501(c)(3) section added, leadership spacing/LinkedIn fixes.
7. **Manifesto** (`8d3a09b` → `47cdf8c`): accordion menu added; heading iterated "IN A NUTSHELL" → "TL;DR".
8. **Nonprofit status correction** (`68d6c60`): 501(c)(3) → 509(a)(2). The eyebrow on the hero and the corporation section both flipped.
9. **Forms first pass** (`10ed2f1` → `3567935`): form submits, third-party (FormSubmit), notification email, CCs.
10. **Content push** (`4ed98c4` → `745bfe7`): Paris salon rewrite, paragraph breaks, widen hero, `white-space: pre-line`, remove scroll indicator, "Overview" heading, Givebutter donate URL, remove Surrealist paragraph.
11. **Forms rewrite** (`0306c2d`): FormSubmit outage → cut over to Shopify native.
12. **Event page** (`ceae2c5` → `c06c4f9`): remove April salon, build recap page, wire videos + CTA, final copy pass.
13. **Verification** (`efadedd`): Google site-verification meta tag added — story `google-verification-wrong-method.md`.

## Numbers

- Commits on the feature branch: 52
- Sections in the final `index.json` order: 6 (hero, manifesto, games, events, corporation, invitation)
- Colors in `settings_data.json` that are no longer used: 6 (`midnight`, `deep_blue`, `brass`, `electric`, `dream_purple`, `chicago_grey`)
- Times the manifesto section header changed: 4 ("Our Manifesto" → "IN A NUTSHELL" → "TL;DR" → "Overview")
- Times the games CTA/heading changed: 3 ("Explore Games" → "View All Games" → "Explore Provocations" / "View all Provocations")
- Nonprofit classification correction: 501(c)(3) → 509(a)(2)
- Fonts that survived the reset: 1 (Open Sans)
- Live event blocks on the events timeline at the last touch: 6 (THE SPECTACLE + June/July/August/Sept/Oct monthly salons — April removed)
- JS libraries loaded from CDN by `theme.liquid`: 3 (GSAP core, ScrollTrigger, Alpine.js)
- npm dependencies declared but unused in shipped Liquid: React, ReactDOM, react-hook-form, Swiper, Vite plugins (declared in `package.json`, no imports in `sections/*` or `assets/main.js`)
- Recipient email on the store: `mike.hyzy@gmail.com` (Store contact email in Shopify Admin — the destination for all `{% form 'contact' %}` submissions)

## In my words

The transcript captures only the endgame of the build directly — most of the commit-log arcs come from earlier sessions this session can only see through commit messages and the compacted summary. Direct quotes preserved from this session:

> "The donetae button should head to this URL: https://givebutter.com/the-spectacle-be1tgp"

> "Cut this text from the top of the page: The Chicago Salon also channels creativity from the Surrealists..."

> "Also the there are two manifestos, the top one shoul dbe overview instead of our manifesto"

> "The explore button in burried in the quote, remove it"

> "https://chicagofuturessalon.com/"

## Gaps

- The build spans multiple Claude Code sessions. Only one session's transcript is preserved in this environment; earlier sessions where the theme was scaffolded, the colored aesthetic was tried and abandoned, and the leadership/manifesto sections were added, are only visible through commit messages.
- The `Update from Shopify for theme …` commits (there are several — `e013439`, `d0269be`, `005164c`, `cb3fd11`, `2098304`) are Shopify's theme-editor round-tripping edits back into the repo. The transcript does not describe how that sync is wired.
- No `.github/workflows/`, no `shopify.theme.toml`, no Shopify CLI config file in the repo. Whatever deploys these commits to the live store is not committed with them; the mechanism was surfaced only as "everything else has been pushed from here to the site to make it live" (Mike's words).
- No records here of what the pre-black-and-white theme looked like, or what made Mike (or a prior Claude session) throw the palette out. The commit titles ("COMPLETE FIX: Remove ALL colors") communicate urgency but not reason.
- No performance numbers, no analytics.
- No indication of how much of the build was done by Claude Code vs. by hand.
