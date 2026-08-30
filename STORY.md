# Chicago Futures Salon — custom Shopify theme

ENGAGEMENT: Chicago Futures Salon (Mike's own project — a 509(a)(2) nonprofit's public store at `chicagofuturessalon.com`); git history spans **2025-11-01 → 2026-08-30** (10 months, ten calendar dates of activity)
KIND: built
REPO: `mikehyzy/shopify`, branch `claude/shopify-chicago-futures-theme-011CUhoihHXMXjZmPYXwkQqs`, commits `fcd558b` → `bf063f3` (52 total)
WHY: UNKNOWN, ask Mike

## What this is

A fully custom Shopify Online Store 2.0 theme for the Chicago Futures Salon. Not a purchased theme, not a fork of Dawn — the whole thing is written from `layout/theme.liquid` up. It serves a homepage that runs a hero, a four-panel manifesto accordion, a product showcase (branded "Provocations"), an events timeline, a nonprofit/donation section, and an invitation-request form; a product and cart flow; a small collection of customer-account templates; and one bespoke page template for the May 14, 2026 event recap ("The Spectacle").

Content routing runs through Shopify's native surfaces: theme editor settings for copy, section blocks for repeatable items (manifesto panels, event blocks), a store-linked `frontpage` collection for products, `{% form 'contact' %}` for form submissions delivered to `mike.hyzy@gmail.com`, and Shopify-hosted DNS for the domain. External services deliberately kept small: Givebutter for donations (`https://givebutter.com/the-spectacle-be1tgp`), Luma and Google Forms for event RSVPs, YouTube for embedded video, Google Fonts for Open Sans, jsDelivr CDN for GSAP and Alpine.js.

The only third-party service the project *removed* mid-life is FormSubmit.co, replaced by Shopify's built-in `{% form 'contact' %}` after an outage.

## What the repo says the brief was

From `README.md`, verbatim:

> ## 🎨 Design Philosophy
> This theme embodies an avant-garde, intellectual aesthetic that balances exclusivity with welcoming mystique. Every animation, interaction, and design choice is intentional, creating an experience that feels like entering a digital speakeasy for intellectual futures thinking.

> ## ✨ Key Features
> ### Interactive Sections
> - **Hero Section**: GSAP-powered animations with parallax effects, morphing SVG shapes, and typewriter text
> - **Manifesto Accordion**: Interactive philosophy panels with flip cards and SVG connection lines
> - **Events Timeline**: Dynamic event display with category filtering and RSVP functionality
> - **Games Showcase**: 3D product cards with quick-shop modals and AJAX cart integration
> - **Invitation Form**: Multi-step form with progress tracking and validation

> ### Technical Stack
> - **Shopify Liquid** - Templating engine
> - **GSAP** - Advanced animations and scroll effects
> - **Alpine.js** - Lightweight interactivity
> - **Tailwind CSS** - Utility-first styling
> - **React** - Complex interactive components (loaded via CDN)
> - **Vite** - Modern build tooling

From the top-level product description in `README.md`:

> A completely custom Shopify theme for the Chicago Futures Salon—an invitation-only community of senior leaders exploring futures thinking through Surrealist, Situationist, and Futurist methods.

Site copy the store itself commits to (from `templates/index.json` and `sections/corporation.liquid` in their final state):

> "Chicago Futures Salon was inspired by the salons of late-19th-century Paris, recurring private gatherings where a host brought writers, artists, politicians, and thinkers into a drawing room on a fixed day of the week."

> "For a group rooted in surrealist and situationist traditions, 'lawful activities' is doing a lot of heavy lifting in our Articles of Incorporation. Our lawyers assure us détournement is not yet a felony."

Every one of the README's feature bullets was aspirational relative to what ended up shipping. See **Architecture** and **The sequence** below for the delta.

## Architecture

**Repo layout, as it stands at HEAD:**

```
/home/user/shopify/
├── assets/
│   ├── animations.js        (329 bytes)
│   ├── main.js              (332 bytes)
│   └── theme.css            (48,868 bytes — the built Tailwind bundle)
├── config/
│   ├── settings_data.json   (theme-editor state; vestigial color tokens)
│   └── settings_schema.json (contents: "[]")
├── layout/
│   └── theme.liquid         (the only layout — one wrapper for every page)
├── locales/
│   └── en.default.json
├── sections/
│   ├── cart-main.liquid
│   ├── collection-header.liquid
│   ├── collection-products.liquid
│   ├── corporation.liquid           (27,525 bytes — largest section; leadership + donation + social share)
│   ├── events-timeline.liquid       (12,146 bytes)
│   ├── footer-group.json
│   ├── footer.liquid                (9,528 bytes)
│   ├── games-showcase.liquid        (9,719 bytes — "Provocations" grid)
│   ├── header-group.json
│   ├── header.liquid                (8,918 bytes — Alpine.js-driven mobile menu + dropdowns + cart badge)
│   ├── hero-surrealist.liquid       (4,784 bytes)
│   ├── invitation-form.liquid       (5,598 bytes — Shopify {% form 'contact' %})
│   ├── manifesto-accordion.liquid   (7,349 bytes)
│   ├── product-main.liquid          (14,769 bytes)
│   ├── simple-hero.liquid           (393 bytes — bare fallback)
│   └── spectacle-recap.liquid       (14,249 bytes — the event recap page)
├── snippets/
│   ├── meta-tags.liquid             (Open Graph / Twitter)
│   └── structured-data.liquid       (JSON-LD)
├── src/
│   ├── scripts/
│   │   ├── animations/
│   │   ├── utilities/
│   │   └── main.js                  (6,769 bytes — Tailwind entry / source JS)
│   └── styles/
│       └── main.css                 (5,976 bytes — Tailwind entry)
├── templates/
│   ├── 404.liquid
│   ├── article.liquid
│   ├── blog.liquid
│   ├── cart.json
│   ├── collection.json
│   ├── collection.liquid
│   ├── customers/
│   │   ├── account.liquid
│   │   ├── activate_account.liquid
│   │   ├── login.liquid
│   │   ├── register.liquid
│   │   └── reset_password.liquid
│   ├── index.json
│   ├── page.liquid
│   ├── page.the-spectacle.json
│   ├── product.json
│   └── search.liquid
├── extracted-stories/               (added 2026-08-30 — book-work artifacts, not part of the theme)
├── .gitignore
├── README.md
├── package.json
├── postcss.config.js
├── tailwind.config.js
└── vite.config.js
```

**How it renders.** `layout/theme.liquid` wraps every page. `{% section 'header' %}` and `{% section 'footer' %}` bracket a `<main>` where `{{ content_for_layout }}` drops in the current template's sections. Templates for the homepage (`templates/index.json`), the cart, the collection, the product, and the bespoke page (`templates/page.the-spectacle.json`) are JSON files — they list section instances and settings; the Liquid renders those into HTML. Templates for auth flows and blog/article/search stayed as classic `.liquid` files.

**`layout/theme.liquid` — the whole file, verbatim:**

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

**How theme-editor content connects to code.** Each Liquid section declares a `{% schema %}` block that names editable settings and (for repeat items) `blocks`. Shopify's admin theme editor renders those settings as form inputs. Values live in `templates/*.json` and — for the "current" state of the store — in `config/settings_data.json`. When a store owner edits copy in the admin, Shopify commits an "Update from Shopify for theme" commit back to the repo through its GitHub integration; there are five such `shopify[bot]` commits in the log (`e013439`, `d0269be`, `005164c`, `cb3fd11`, `2098304`). That is the deploy/sync mechanism — no GitHub Actions workflow, no `shopify.theme.toml`, no CLI push script committed to the repo. Two-way theme-editor round-trip is doing that job.

**JS loaded:** GSAP 3.12.5 (core + ScrollTrigger) and Alpine.js 3.x from jsDelivr, both with `defer`. `assets/main.js` is 332 bytes — near-empty. `assets/animations.js` is 329 bytes — same. The `src/scripts/main.js` under source control is 6,769 bytes but nothing declares it as an entry point in any Liquid template that isn't already loading `assets/main.js`. GSAP hooks exist in markup (`data-gsap="fadeIn"`, `data-gsap="typewriter"`, `data-gsap="slideUp"` on the hero) but no committed JS acts on them.

**CSS approach:** Tailwind is the declared framework (`tailwind.config.js` is present; `assets/theme.css` is 48,868 bytes — a built Tailwind bundle). But most sections mix Tailwind utility classes with hand-written inline `style="…"` attributes. `spectacle-recap.liquid` in particular is almost entirely inline styles — probably because it was written on a compact timeline and inline styles guarantee they render even if Tailwind purging drops classes.

**Vestigial config.** `tailwind.config.js` still carries the original surrealist palette:

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

`midnight` and `deep-blue` have both been forced to `#000000`. `brass`, `electric`, `dream-purple`, `chicago-grey` are still their original values. The color redo was a rip-out at the design layer but the config never got fully swept — the palette lives on as unused Tailwind tokens. Same shape in `config/settings_data.json`: `color_midnight: "#0a0a0a"`, `color_deep_blue: "#1a1a2e"`, `color_brass: "#d4af37"`, `color_electric: "#00d4ff"`, `color_dream_purple: "#9b4dca"`, `color_chicago_grey: "#6c757d"` — all defined, none used by rendered sections.

`package.json` declares `react`, `react-dom`, `react-hook-form`, `swiper`, `vite`, `@vitejs/plugin-react` — none imported anywhere in `sections/`, `assets/`, `layout/`, or `src/scripts/main.js`.

**Sections in the homepage's render order (`templates/index.json` → `order`):**

1. `hero` → `hero-surrealist` — full-viewport hero, eyebrow ("A 509(a)(2) organization"), headline ("Welcome to the Chicago Futures Salon"), Paris-salon subheading (rendered with `white-space: pre-line`), two CTA buttons, pull-quote ("The marvelous is always beautiful…" — André Breton).
2. `manifesto` → `manifesto-accordion` — heading "Overview". Four panels: Futures Thinking, Invitation-Only Community, Experimental Methods, Chicago Focus. Alpine.js `x-data="{ open: … }"` on each panel.
3. `games` → `games-showcase` — pulls from the `frontpage` collection, three products, "Explore Provocations" CTA to `shopify://collections/all`.
4. `events` → `events-timeline` — six event blocks in the final state: THE SPECTACLE (2026-05-14, RSVP `https://luma.com/93lc25b0`), then June/July/August/September/October monthly salons routing to a Google Form.
5. `corporation` → `corporation.liquid` — 509(a)(2) framing, donation CTA to `https://givebutter.com/the-spectacle-be1tgp`, social share heading, LinkedIn URL slot (empty).
6. `invitation` → `invitation-form` — Shopify native `{% form 'contact' %}` collecting first name, last name, email, organization, and interest body; delivers to the store's contact email.

**The event recap page.** Separate from the homepage flow. `templates/page.the-spectacle.json` is a JSON template naming one section (`spectacle-recap`) with six video-URL settings; the section renders a title, an opening description, and six session blocks (Welcome / Keynote / Workshop / Chicago 2040 Readout / Jazz / Foresight Improv). Five slots render YouTube iframes; the workshop slot is a hard-coded CTA to `chicagofuturessalon.com/collections/all` because that session had no video.

## How I built it with Claude

The book-relevant question here is what scaffolding Mike put in the repo to steer Claude. The answer is direct:

**None.**

- `CLAUDE.md` — does not exist in the repo.
- `.claude/` — no such directory.
- `.claude/skills/` — no such directory.
- `.claude/agents/` — no such directory.
- `.claude/commands/` — no such directory.
- `.claude/hooks/` — no such directory.
- `.claude/settings.json` / `.claude/settings.local.json` — do not exist in the tree.
- `.mcp.json` — does not exist in the repo.
- `AGENTS.md` — does not exist.

Everything Claude did on this codebase was driven turn-by-turn from chat. No promoted skill, no enforced hook, no MCP server registered at the repo scope, no subagent definition, no CLAUDE.md briefing. Every commit authored by "Claude" (49 of 52) came out of an ad-hoc session pointed at this repo. The project pattern was: open a Claude Code session, ask for something specific, review, ship. Repeat.

The one piece of Claude infrastructure that touched this repo lived outside it — the Shopify GitHub integration, which produces the five `shopify[bot]` commits (`Update from Shopify for theme shopify/claude/...`). That is Shopify's admin theme editor writing back into the branch on Mike's behalf whenever he made an in-admin edit. It is not something Claude Code configured or emitted.

**How work was actually delegated (from commit authorship and message texture):**

- 49 commits by author "Claude" (email from the git author line UNKNOWN — the commit messages carry `Co-Authored-By: Claude <noreply@anthropic.com>` in the tail of the most recent commits; earlier commits' full trailers were not inspected in-session).
- 5 commits by author "shopify[bot]" — the theme-editor round-trip.
- 1 commit by "Michael Hyzy" — the initial `Initial commit` on 2025-11-01 (`fcd558b`).
- Late commit trailers include `Claude-Session: https://claude.ai/code/session_011CUhoihHXMXjZmPYXwkQps`, which is the session-URL trailer Claude Code writes when committing from a specific session. That trailer is present on `bf063f3` (2026-08-30) and on `efadedd` (2026-06-22).

**Session count:** at least 2 (the pre-compaction Claude session that produced most of the arc, and the post-compaction session captured in `/root/.claude/projects/-home-user-shopify/64080f34-….jsonl`), possibly more — the `shopify/claude/shopify-chicago-futures-theme-01…` remote branch pattern in the `shopify[bot]` commit messages suggests Shopify's integration is aware of the Claude-authored branch name.

**What did not become a skill or a hook:** every one of these was retyped or re-prompted in-session rather than made permanent —
- The recurring "convert `youtu.be/<id>` to `youtube.com/embed/<id>`" mapping.
- The recurring nonprofit-status correction pattern (501(c)(3) → 509(a)(2)).
- The recurring "read → edit → commit → push origin HEAD" cycle whose failure mode showed up as the `git push -u` branch-name typo in `efadedd`.
- The "add `white-space: pre-line` when embedding newline-containing strings" fix.

Nothing about that pattern was captured in the repo for the next session to inherit.

## The sequence

Full commit list, oldest → newest, with dates and authors. Ninety-percent of the "how it evolved" story is in these messages verbatim.

```
2025-11-01  Michael Hyzy  fcd558b  Initial commit
2025-11-01  Claude        ae2fec1  Initial Chicago Futures Salon Shopify theme
2025-11-01  Claude        466e5d9  Add required Shopify theme files and templates
2025-11-01  shopify[bot]  e013439  Update from Shopify for theme shopify/claude/shopify-chicago-futures-theme-01...
2025-11-01  Claude        bc25e65  Fix 404 error - simplify theme structure
2025-11-01  Claude        b29c797  Merge branch 'claude/shopify-chicago-futures-theme-011CUhoihHXMXjZmPYXwkQqs' of http://127.0.0.1:56458/git/mikehyzy/shopify into claude/shopify-chicago-futures-theme-011CUhoihHXMXjZmPYXwkQqs
2025-11-01  Claude        ef1fb1d  Build full Tailwind CSS and restore beautiful homepage
2025-11-01  Claude        9dbc560  Fix colors and fonts - pure black background with Open Sans
2025-11-01  Claude        5259e9f  COMPLETE FIX: Remove ALL colors - pure black and white only
2025-11-01  Claude        a60b9fd  Convert all sections to pure black and white design
2025-11-01  Claude        084d9e8  COMPLETE FIX: Remove ALL colors - pure black and white only
2025-11-01  Claude        228af31  Build complete working sections with full content and functionality
2025-11-01  Claude        4fca75a  Add real content blocks to index.json - sections now have actual data

2026-01-03  shopify[bot]  d0269be  Update from Shopify for theme shopify/claude/shopify-chicago-futures-theme-01...
2026-01-03  Claude        e2837e3  Update 'View All Games' button to 'View all Provocations'
2026-01-03  Claude        34711f4  Make products centered and fully mobile responsive
2026-01-03  Claude        a0e5d50  Fix 'View all Provocations' button to link to all products page
2026-01-03  Claude        2ccbb5c  Create collection page template to fix 404 on View all Provocations
2026-01-04  Claude        59cd786  Update 'Explore Games' button to 'Explore Provocations'

2026-03-06  shopify[bot]  005164c  Update from Shopify for theme shopify/claude/shopify-chicago-futures-theme-01...
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
2026-04-14  shopify[bot]  cb3fd11  Update from Shopify for theme shopify/claude/shopify-chicago-futures-theme-01...
2026-04-14  shopify[bot]  2098304  Update from Shopify for theme shopify/claude/shopify-chicago-futures-theme-01...
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
```

**Distinct phases visible in this log:**

- **2025-11-01, scaffolding day (12 commits in one day).** Michael Hyzy created the repo (`fcd558b`). Claude scaffolded a Shopify theme (`ae2fec1`), added required theme files and templates (`466e5d9`), immediately hit a 404 and simplified the theme structure (`bc25e65`), resolved a branch merge (`b29c797`), rebuilt Tailwind (`ef1fb1d`), then went through a color-purge sequence — `9dbc560` "Fix colors and fonts - pure black background with Open Sans", `5259e9f` "COMPLETE FIX: Remove ALL colors - pure black and white only", `a60b9fd` "Convert all sections to pure black and white design", `084d9e8` "COMPLETE FIX: Remove ALL colors - pure black and white only" — four commits within hours ripping out the color palette. The two identical `COMPLETE FIX: Remove ALL colors` messages both landed on the same day and are literally the same subject; the first didn't fully take. Ended the day with real content in place (`228af31`, `4fca75a`). The whole aesthetic decision that scoped the rest of the project was made on day one.

- **2026-01-03/04, product-flow fixes (5 commits over two days).** Buttons renamed "Games" → "Provocations" across the site (`e2837e3`, `59cd786`), the "View all Provocations" button repointed to the all-products page (`a0e5d50`), and a collection page template was added to fix a 404 that repointing exposed (`2ccbb5c`). Product cards centered and made mobile-responsive (`34711f4`). One shopify[bot] round-trip precedes it (`d0269be`).

- **2026-03-18, nonprofit + manifesto build-out (7 commits in one day).** Big content day: 501(c)(3) nonprofit section added (`7f87daa`), product/cart pages fixed for Shopify OS 2.0 (`6a7ada2`), leadership section iterated twice (spacing + fun descriptions in `6d2a136`, then spacing + LinkedIn URL corrections in `619ba8e`), the manifesto accordion introduced (`8d3a09b`), then two heading tweaks — first to "IN A NUTSHELL" (`3f6f809`), then to "TL;DR" (`47cdf8c`) inside the same day. One shopify[bot] round-trip on 2026-03-06 (`005164c`) precedes it.

- **2026-03-26, single legal correction.** 501(c)(3) → 509(a)(2) (`68d6c60`). One-line commit, but touched section copy and probably the hero eyebrow.

- **2026-04-14, forms plumbing (7 commits + 2 shopify[bot]).** The invitation form path from broken → wired via FormSubmit.co → notification email fixed → CCs added. `10ed2f1` fixed the form to submit data at all; `6c50b6b` wired FormSubmit; `568b7a2` set the notification recipient to `mike.hyzy@gmail.com`; `3567935` added CCs. `91e077f` fixed missing templates on the same day. Two shopify[bot] round-trips landed the same day — theme-editor edits (probably form-recipient tweaks) coming back into the repo.

- **2026-04-19, hero rewrite arc (7 commits in one day).** Started with `4ed98c4` "Add About the Salon section with longer description" — the *wrong* fix, a new section rather than a hero edit. Superseded immediately by `7c0fd95` "Replace hero subheading with extended Paris salon description". Then `6c5c4bf` "Add paragraph breaks to hero subheading for readability" — which by itself did nothing, so `523002e` "Enable line break rendering in hero subheading" (the `white-space: pre-line` fix). Widened the hero (`b0695d0`), removed the scroll indicator that was overlapping the quote (`36fd587`), and finally corrected the manifesto heading from "TL;DR" to "Overview" (`f1b7312`) — the fourth heading change in that section's history. This is the day the pattern of "small text change becomes multiple commits because of the second-order side-effect" is most visible in the log.

- **2026-05-13 → 05-17, event page and forms rework (9 commits).** Two prep commits — Givebutter donation URL added (`5e93bf9`), Surrealist/Situationist paragraph cut from the hero at Mike's request (`745bfe7`). Then the FormSubmit → Shopify-native cutover (`0306c2d`), a stale event removed (`ceae2c5`), and the recap-page build-out over 05-15/05-17: create the page (`d2d9bc3`), add first three video embeds (`f1decf4`), swap the workshop video slot for a CTA button because that session had no video (`d244d21`), fill in the last videos (`dd5072a`), fix the intro copy (`c06c4f9`). This is the last operational chunk of theme work.

- **2026-06-22, Google Search Console tag.** `efadedd` "Add Google site verification meta tag" — one commit, two-line diff on `layout/theme.liquid`. The chat around that commit (captured in the session transcript) reveals the tag was placed for the wrong verification method (HTML tag vs. DNS TXT), but the *code* was fine — no follow-up commit needed on the code side.

- **2026-08-30, book work.** `bf063f3` "Extract 10 stories from session transcript for Product Engineering with Claude" — 10 markdown files added under `extracted-stories/` for the book. Not theme work; artifact work.

**Fighting-the-same-problem stretches:**

- **The color redo.** Four commits on 2025-11-01 with variations on "Remove ALL colors" or "pure black and white." The first three didn't fully take. What ended it: `084d9e8`, which had the same message as one earlier. The `tailwind.config.js` still hasn't caught up — brass/electric/dream-purple tokens are still there today.
- **The manifesto heading.** "Our Manifesto" (implied original) → "IN A NUTSHELL" (`3f6f809`) → "TL;DR" (`47cdf8c`) → "Overview" (`f1b7312`). Four states across three months. The section-schema `default` in `sections/manifesto-accordion.liquid` still reads `"TL;DR"`; the actual rendered value comes from `templates/index.json` runtime override, so the default rotted and nobody swept it.
- **The Games → Provocations rebrand.** Two commits in January to rename button text (`e2837e3`, `59cd786`), one to fix the link a rename exposed (`a0e5d50`), one to build a template a link fix required (`2ccbb5c`). Four commits to complete a rename that started as a copy tweak.
- **The invitation form.** Four commits in a day plumbing the third-party route (`10ed2f1`, `6c50b6b`, `568b7a2`, `3567935`), one commit a month later replacing all of it with native Shopify contact form (`0306c2d`). The entire "route to FormSubmit + CC list" arc ended up thrown out. What ended it: FormSubmit went down.

## Numbers

- Total commits: **52**
- Commit range: `fcd558b` (2025-11-01) → `bf063f3` (2026-08-30)
- Elapsed time: **10 months**
- Distinct calendar dates with commits: **10** (2025-11-01, 2026-01-03, 2026-01-04, 2026-03-06, 2026-03-18, 2026-03-26, 2026-04-14, 2026-04-19, 2026-05-13, 2026-05-15, 2026-05-17, 2026-06-22, 2026-08-30 — 13 dates counted; correction: 13 distinct dates)
- Correction: distinct calendar dates = **13**
- Days concentration: the two heaviest single days were **2025-11-01** (12 commits, scaffold + color purge + content) and **2026-04-19** (7 commits, hero rewrite arc). **2026-03-18** also produced 7 commits (nonprofit + manifesto build-out).
- Commits by author:
  - **Claude**: 46
  - **shopify[bot]**: 5 (`e013439`, `d0269be`, `005164c`, `cb3fd11`, `2098304`)
  - **Michael Hyzy**: 1 (`fcd558b`)
- CLAUDE.md files in the repo: **0**
- `.claude/` skills / hooks / commands / subagents: **0**
- `.mcp.json` files: **0**
- Section files: **16** (`cart-main`, `collection-header`, `collection-products`, `corporation`, `events-timeline`, `footer-group.json`, `footer`, `games-showcase`, `header-group.json`, `header`, `hero-surrealist`, `invitation-form`, `manifesto-accordion`, `product-main`, `simple-hero`, `spectacle-recap`)
- Template files: **14** (including 5 customer-account templates)
- Snippet files: **2** (`meta-tags.liquid`, `structured-data.liquid`)
- Locale files: **1** (`en.default.json`)
- Compiled `assets/theme.css`: **48,868 bytes**
- Committed `assets/main.js`: **332 bytes**
- Committed `assets/animations.js`: **329 bytes**
- Largest section by size: `corporation.liquid` at **27,525 bytes**
- Times the manifesto heading changed in the log: **3** ("IN A NUTSHELL" → "TL;DR" → "Overview"); implied original state ("Our Manifesto") makes **4** total values
- Times the games CTA changed: **2** ("Explore Games" → "Explore Provocations" via one intermediary "View All Games" → "View all Provocations")
- Legal-classification correction: **501(c)(3) → 509(a)(2)** (`68d6c60`)
- Third-party services removed: **1** (FormSubmit.co, replaced by Shopify native `{% form 'contact' %}` in `0306c2d`)
- Google site-verification token that ended up committed: `h0kzD-ma9BF09SWdoYmWr7pWHhQxtsHeL7lk-2XKA8E` in `layout/theme.liquid`, commit `efadedd`
- External services actively used: Shopify (theme + forms + DNS + `frontpage` collection), Givebutter (donations), Luma (event RSVP for The Spectacle), Google Forms (RSVP for monthly salons), YouTube (5 embed URLs on the Spectacle page), Google Fonts (Open Sans), jsDelivr CDN (GSAP + Alpine)
- Sponsors named on the Spectacle recap page: **3** (CGI, Mural, ElevenLabs)
- Network partners named on the Spectacle recap page: **2** (1871, Parlor Social)
- Event rating cited on the recap page: **4.8 / 5 on Luma**
- Event attendance cited: UNKNOWN in the code (the page does not print a headcount; the intro says "We sold out")
- Homepage sections in final render order: **6** (hero, manifesto, games, events, corporation, invitation)
- Events on the timeline at HEAD: **6** (THE SPECTACLE + June/July/August/September/October monthly salons; April was removed in `ceae2c5`)

## In my words

The commit log is the primary "in my own words" record on the code side. Direct-from-repo highlights:

Commit subjects that carry voice:

> "COMPLETE FIX: Remove ALL colors - pure black and white only" — `5259e9f` and `084d9e8` (same message, two commits, 2025-11-01)

> "Fix invitation form to actually submit data" — `10ed2f1`

> "Improve leadership section spacing and add fun descriptions" — `6d2a136`

> "Fix all missing templates and functionality" — `91e077f`

> "Change top manifesto heading to Overview" — `f1b7312` (the fourth heading state)

> "Replace workshop video with Explore Provocations CTA" — `d244d21`

> "Update Spectacle intro to mention sold out tickets" — `c06c4f9`

Copy from `sections/corporation.liquid` (the Mike-voice line that made it into the shipped site):

> "For a group rooted in surrealist and situationist traditions, 'lawful activities' is doing a lot of heavy lifting in our Articles of Incorporation. Our lawyers assure us détournement is not yet a felony."

Copy from `sections/spectacle-recap.liquid` (opening paragraph, third graf — final wording after Mike rewrote it in-session):

> "We sold out. Our guests rated us 4.8 out of 5 on Luma. The performers were extraordinary. The insights were electric. The conversations spilled into the hallways and kept going long after we turned off the lights."

From the session transcript stored under `/root/.claude/projects/-home-user-shopify/64080f34-….jsonl`, quoted verbatim (typos intact, they are the voice):

> "YOu didnt fucking listen to me. WHY DIDNT YOU PUT IT IN THE PACE I FUCKING TOLD YOU TO!"

> "YOu didnt break the text, what is worng?"

> "WHAT IS WRONG WITH YOU!!!! I NEED YOU TO FIX THIS>. WE BUILD THE SITE TEOHGETHERE YOU KNOW HOW TO DO THSIS"

> "I CANT PUSH FROM MY TERMINAL": cd: no such file or directory: /home/user/shopify"

> "No we need to fucking fix the 403, how"

> "YOu built the fucking website for me what is the probelm there"

> "So why isnt google registereding this? Do you make sure the link is right? Did you test and validet eit? What is wrong?"

> "What are you talking about? Everytihng else has been pushed from here to the site to make it live"

> "No just one theme, are you wokring on this site? Did you check the requirements from google on where to palce this?"

> "Ok i foudn the domian on shopoify, what do I have to do with the TXT value adn shit?"

> "Itw as not 200, find a better opening and no catheral"

> "IT WASNT AN INDUSTRIAL SPCE!! SAY we were an a modern setting right off the chicago river"

> "This is where micahel and i's section should go intead of a video, explore provocations: https://chicagofuturessalon.com/collections/all"

> "Ok last thing to fix, say we sold out of tickets and our guests rated us 4.8 out of 5 on Luma, instead of this: 'We earned a 4.8 out of 5 on Lum'"

> "Hey friend are you ready?"

## Gaps

- **Why the project exists.** The repo does not say why Mike started this. `WHY: UNKNOWN, ask Mike.` The README's "Design Philosophy" paragraph is a designer's brief, not a founding reason.
- **Pre-repo history.** The very first commit (`fcd558b`, 2025-11-01) is `Initial commit`. Nothing about what preceded the repo — prior theme, prior platform, prior store — is captured.
- **Deploy mechanism.** How commits on this branch reach `chicagofuturessalon.com`. No `.github/workflows/`, no `shopify.theme.toml`, no Shopify CLI config in-repo. The Shopify GitHub integration is clearly wired (the `shopify[bot]` round-trip commits confirm it) but no artifact in this repo documents how it was set up.
- **The pre-black-and-white state.** The color-purge day (2025-11-01) ripped out a palette in four commits. Nothing here shows what the previous state looked like — no screenshots, no design tokens except the vestigial ones in `tailwind.config.js` and `config/settings_data.json`, no design doc.
- **The JS gap.** The README promises GSAP-driven typewriter, morphing SVG, flip cards, 3D product cards, AJAX cart, multi-step form. `assets/main.js` is 332 bytes. `assets/animations.js` is 329 bytes. What actually renders is inline styles + Alpine.js interactions on the header and manifesto accordion + declarative `data-gsap` attributes that no committed JS acts on. The gap between README ambition and shipped behavior is not explained.
- **Any Claude scaffolding.** No CLAUDE.md, no skills, no hooks, no MCP config, no subagents, no per-repo Claude Code settings. There is no artifact showing repeated prompt patterns being promoted to reusable structure. The only Claude-adjacent trailer is `Claude-Session: https://claude.ai/code/session_011CUhoihHXMXjZmPYXwkQqs` on the two most recent commits — a session-tracking URL, not a config.
- **Session identities.** The transcript for this session is in `/root/.claude/projects/-home-user-shopify/`. Transcripts for the prior sessions that produced 46+ of the commits are not here.
- **Numbers about the live store.** Traffic, order counts, form-submission counts, donation totals — none of it is in the repo.
- **Sponsor & partner logos.** Named on the Spectacle page (CGI, Mural, ElevenLabs, 1871, Parlor Social) but no image assets committed under `assets/`.
- **Event attendance.** The Spectacle page says "sold out" and "4.8 out of 5 on Luma" but does not name a headcount, a venue, a Luma URL for the past event, or a photo.
- **Who is who.** Michael Marshall, Anna Mulcahy, Charles Plath, Marta Cuciurean-Zapan, Max Lackner, Jim Kalbach, Matt Carmichael, Alexandra Levit — named on the recap page. Their relationship to the org is inferrable from context ("Anna Mulcahy, Board of Directors" is spelled out; "Jim Kalbach, Chief Evangelist at Mural" is stated) but no leadership/bio content lives in the repo outside of these single-line role descriptions.
- **The Supabase turn.** The session transcript captures Mike planning to attach a Supabase backend and running `claude mcp add --scope project --transport http supabase "https://mcp.supabase.com/mcp?project_ref=fcdqrtxdkcqlxqsrwejs&features=…"` in a different repo. Nothing about that work landed here.
- **What the store sells.** The `games`/`Provocations` section pulls from the `frontpage` collection with `products_to_show: 3`. No product data is in the repo (products live in Shopify's DB, not the theme files). What the actual products are, or what a "provocation" costs, is UNKNOWN from this repo.
