# The `\n\n` that wasn't a paragraph break

ENGAGEMENT: Chicago Futures Salon — Shopify theme, June 2026
KIND: solved
SOURCE: `/root/.claude/projects/-home-user-shopify/64080f34-7a4a-5a22-a1a2-859a71c8eab3.jsonl` (pre-compaction summary)

## What happened

After the hero subheading was replaced with the long Paris-salon description, it read as one wall of text. Mike said it needed breaks. Claude edited the string in `templates/index.json` to include `\n\n` between paragraphs. In the browser, the text still rendered as one continuous block. Mike came back: *"YOu didnt break the text, what is worng?"*

The fix was one CSS property on the paragraph that rendered the subheading. HTML collapses whitespace by default; a literal `\n` in text content is treated as a single space unless the containing element opts in. Adding `style="white-space: pre-line;"` to the `<p>` element tells the browser to preserve newlines while still collapsing runs of spaces.

## How it worked

**The Liquid template that renders the subheading (`sections/hero-surrealist.liquid`, lines 30–37, in its final form):**

```liquid
<!-- Subtitle -->
{% if section.settings.subheading != blank %}
  <p class="hero-subtitle text-xl md:text-2xl text-white font-body mb-12 max-w-5xl mx-auto"
     style="white-space: pre-line;"
     data-gsap="slideUp">
    {{ section.settings.subheading }}
  </p>
{% endif %}
```

**The data feeding it (`templates/index.json` sections.hero.settings.subheading):**

A single JSON string containing literal `\n\n` between the two paragraphs. When Liquid interpolates that into the DOM, `pre-line` on the `<p>` causes each `\n` to become a rendered line break.

**Two related tweaks that shipped in the same arc:**
- Container width raised from `max-w-5xl` to `max-w-7xl` on the outer `div` (`sections/hero-surrealist.liquid`, line 13).
- Subheading paragraph width raised from `max-w-3xl` to `max-w-5xl` on the `<p>` (line 32).

## The sequence

1. Mike: *"I need you to make some breaks in there, its too much to read at once"*
2. Claude edited the subheading string in `templates/index.json` to insert `\n\n`.
3. Mike checked the site. Still one paragraph.
4. Mike: *"YOu didnt break the text, what is worng?"*
5. Claude added `style="white-space: pre-line;"` to the subtitle `<p>` in `sections/hero-surrealist.liquid`.
6. Mike then asked to widen the text area — `max-w-5xl` → `max-w-7xl` on the container, `max-w-3xl` → `max-w-5xl` on the paragraph.

Commit log for the arc, in order:
- `6c5c4bf` Add paragraph breaks to hero subheading for readability
- `b0695d0` Widen hero section for better text layout
- `523002e` Enable line break rendering in hero subheading

## Numbers

- Commits to get from "add breaks" to "breaks that actually render": 3
- Files touched: 2 (`templates/index.json`, `sections/hero-surrealist.liquid`)
- CSS property that resolved the whole thing: 1 (`white-space: pre-line`)

## In my words

> "I need you to make some breaks in there, its too much to read at once"

> "YOu didnt break the text, what is worng?"

> "Can you widen the areas too?"

## Gaps

- The transcript does not record whether Claude explained the `\n` → `pre-line` mechanism at the time, or just applied it.
- No record of whether Claude first tried an alternative (e.g., splitting the string into two `<p>` elements in the Liquid template) before landing on the CSS approach.
