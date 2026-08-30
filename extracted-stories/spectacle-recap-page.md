# Building the Spectacle event-recap page: six sessions, five videos, one CTA where a video should be

ENGAGEMENT: Chicago Futures Salon — Shopify theme, June 2026
KIND: built
SOURCE: `/root/.claude/projects/-home-user-shopify/64080f34-7a4a-5a22-a1a2-859a71c8eab3.jsonl`; final code in `/home/user/shopify/sections/spectacle-recap.liquid` and `/home/user/shopify/templates/page.the-spectacle.json`

## What happened

After The Spectacle — the Chicago Futures Salon's flagship event on May 14, 2026 — Mike wanted a recap page on the store: title, date, an opening paragraph, and one block per session with the speaker, a description, and the video. Claude built it as a Shopify **section** driven by a **page template**, with the six video URLs exposed as section settings so Mike could paste them in from the theme editor without touching Liquid.

One session — the workshop Mike ran with Michael Marshall — did not have a video. Mike's decision at that spot: replace the video block with a black-bordered call-to-action box that funnels visitors to `chicagofuturessalon.com/collections/all` (the "Provocations" store). *"This is where micahel and i's section should go intead of a video, explore provocations."*

All the pasted YouTube links came in as `youtu.be/<id>` share URLs. Those don't work in an `<iframe>`. Each got rewritten to the embed form `https://www.youtube.com/embed/<id>`.

Later ask, small: replace "We earned a 4.8 out of 5 on Luma" with "We sold out. Our guests rated us 4.8 out of 5 on Luma." Mike's exact wording preserved in the source.

The page lives at `/pages/the-spectacle` on the live store. Adding it to the site navigation is done in Shopify Admin (menus are database-level, not theme files), which the transcript flags as a follow-up Mike has to do by hand.

## How it worked

**File layout, two files:**
- `sections/spectacle-recap.liquid` — the section. All markup, styles, and schema.
- `templates/page.the-spectacle.json` — the page template. Names the section and provides the settings (the six YouTube URLs).

**The page template (`templates/page.the-spectacle.json`) — full contents:**

```json
{
  "sections": {
    "spectacle-recap": {
      "type": "spectacle-recap",
      "settings": {
        "welcome_video_url": "https://www.youtube.com/embed/ehRVFlzY4hc",
        "keynote_video_url": "https://www.youtube.com/embed/Vwgm67f-QYM",
        "workshop_video_url": "",
        "chicago2040_video_url": "https://www.youtube.com/embed/-hxe5v7ldp0",
        "jazz_video_url": "https://www.youtube.com/embed/bJ-OAX2Q6hU",
        "improv_video_url": "https://www.youtube.com/embed/1YB-yj3q_NM"
      }
    }
  },
  "order": [
    "spectacle-recap"
  ]
}
```

Note `workshop_video_url` is empty — the workshop block short-circuits into the CTA path.

**Section architecture (`sections/spectacle-recap.liquid`):**

Six near-identical "session-block" divs, each of the form:

```liquid
<div class="session-block" style="border: 1px solid rgba(255, 255, 255, 0.2); background-color: #0a0a0a; padding: 3rem 2rem; margin-bottom: 2rem;">
  <h2 style="…UPPERCASE, Open Sans, 700, 1.75rem…">SESSION NAME</h2>
  <p style="…">Speaker line</p>
  <p style="…">One-sentence description</p>
  {% if section.settings.<slot>_video_url != blank %}
    <div class="video-container" style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 100%; background: #000;">
      <iframe src="{{ section.settings.<slot>_video_url }}"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
              style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"></iframe>
    </div>
  {% else %}
    <div style="background-color: #000000; border: 2px dashed rgba(255, 255, 255, 0.3); padding: 4rem 2rem; text-align: center;">
      <p style="color: rgba(255, 255, 255, 0.5); font-style: italic;">YouTube video embed will appear here</p>
    </div>
  {% endif %}
</div>
```

That `padding-bottom: 56.25%` + absolute-positioned iframe is the standard responsive 16:9 pattern — height is expressed as a percentage of width, so the iframe scales to whatever the container is.

**The workshop-block exception**, where a video slot is replaced by a CTA:

```liquid
<div style="background-color: #000000; border: 2px solid rgba(255, 255, 255, 0.3); padding: 4rem 2rem; text-align: center;">
  <p style="color: rgba(255, 255, 255, 0.8); font-size: 1.125rem; margin-bottom: 2rem; line-height: 1.6;">
    Want to try the provocations yourself? Explore our collection of creative tools designed to disrupt conventional thinking.
  </p>
  <a href="https://chicagofuturessalon.com/collections/all"
     style="display: inline-block; padding: 1rem 2.5rem; background-color: #ffffff; color: #000000; border: 2px solid #ffffff; font-family: 'Open Sans', sans-serif; font-weight: 600; font-size: 1rem; text-transform: uppercase; letter-spacing: 0.05em; text-decoration: none; transition: all 0.3s;"
     onmouseover="this.style.backgroundColor='#000000'; this.style.color='#ffffff'"
     onmouseout="this.style.backgroundColor='#ffffff'; this.style.color='#000000'">
    Explore Provocations
  </a>
</div>
```

Note that this is inline hover behavior on `onmouseover`/`onmouseout` — the rest of the theme uses CSS `:hover`, but here the button is one-off and inline so its hover is JS-driven for isolation.

**Section schema — the six settings that make the page editable without code:**

```json
{
  "name": "The Spectacle Recap",
  "settings": [
    { "type": "header", "content": "Video URLs" },
    { "type": "paragraph", "content": "Enter YouTube embed URLs (e.g., https://www.youtube.com/embed/VIDEO_ID)" },
    { "type": "url", "id": "welcome_video_url",    "label": "Welcome - Anna Mulcahy Video URL" },
    { "type": "url", "id": "keynote_video_url",    "label": "Keynote - Charles Plath Video URL" },
    { "type": "url", "id": "workshop_video_url",   "label": "Workshop - Hyzy/Marshall Video URL" },
    { "type": "url", "id": "chicago2040_video_url","label": "Chicago 2040 Readout Video URL" },
    { "type": "url", "id": "jazz_video_url",       "label": "Jazz Session - Jim Kalbach Video URL" },
    { "type": "url", "id": "improv_video_url",     "label": "Foresight Improv Video URL" }
  ],
  "presets": [ { "name": "The Spectacle Recap" } ]
}
```

**Opening description (`sections/spectacle-recap.liquid` lines 18–34)** — the copy went through multiple revisions live in the session. Mike's corrections steered it:
- Mike: *"Itw as not 200, find a better opening and no catheral"* — kill the "two hundred people in an industrial cathedral" opener.
- Mike: *"IT WASNT AN INDUSTRIAL SPCE!! SAY we were an a modern setting right off the chicago river"* — swap to "A modern space right off the Chicago River."
- Mike, later: *"Ok last thing to fix, say we sold out of tickets and our guests rated us 4.8 out of 5 on Luma, instead of this: 'We earned a 4.8 out of 5 on Lum'"* — Mike wrote the exact replacement line himself.

Final opening (paragraph 3):

> "We sold out. Our guests rated us 4.8 out of 5 on Luma. The performers were extraordinary. The insights were electric. The conversations spilled into the hallways and kept going long after we turned off the lights."

Final closing (paragraph 5):

> "Thank you to our sponsors: CGI, Mural, and ElevenLabs. And to our network partners—1871 and Parlor Social—for making ambitious experiments like this possible."

**Mobile styles (bottom of the section):**

```css
@media (max-width: 768px) {
  .session-block { padding: 2rem 1.5rem !important; }
  .session-block h2 { font-size: 1.25rem !important; }
  .session-block p  { font-size: 1rem    !important; }
}
```

## The sequence

1. Mike said use the session list he'd already written — *"Actually, yeah, use this. Dont worry about the times: Welcome Anna Mulcahy…"*
2. Claude wrote `sections/spectacle-recap.liquid` (six blocks) and `templates/page.the-spectacle.json`.
3. Mike drafted the opening description; Claude iterated on his corrections ("no cathedral", "modern space right off the Chicago River").
4. Mike: *"go"* — approved.
5. Videos landed in stages. Mike pasted `youtu.be/…` share links; Claude converted each to `youtube.com/embed/…` before writing into the template settings.
6. Workshop block: Mike swapped in the CTA to `/collections/all` (*"This is where micahel and i's section should go intead of a video, explore provocations"*).
7. Two later paste-ins: `jim: https://youtu.be/bJ-OAX2Q6hU` and `https://youtu.be/1YB-yj3q_NM` — both converted to embed form.
8. Final copy pass: Mike replaced "We earned" with "We sold out. Our guests rated us 4.8 out of 5 on Luma."

Commit log for the arc, in order:
- `d2d9bc3` Create The Spectacle event recap page
- `f1decf4` Add first 3 video embeds to The Spectacle page
- `d244d21` Replace workshop video with Explore Provocations CTA
- `dd5072a` Add all remaining video embeds to The Spectacle page
- `c06c4f9` Update Spectacle intro to mention sold out tickets

## Numbers

- Sessions on the page: 6
- Video slots wired: 5 (welcome, keynote, chicago2040, jazz, improv). Workshop is a CTA in place of a video, not an empty slot.
- YouTube IDs live in the template: `ehRVFlzY4hc`, `Vwgm67f-QYM`, `-hxe5v7ldp0`, `bJ-OAX2Q6hU`, `1YB-yj3q_NM`
- Sponsors listed: CGI, Mural, ElevenLabs
- Network partners listed: 1871, Parlor Social
- Named speakers on the page: Anna Mulcahy, Charles Plath, Mike Hyzy, Michael Marshall, Marta Cuciurean-Zapan (IDEO), Max Lackner (IDEO), Jim Kalbach (Mural), Matt Carmichael, Alexandra Levit
- Event rating cited: 4.8 out of 5 on Luma
- Event date: May 14, 2026
- Event venue: "A modern space right off the Chicago River"
- Commits for the page build: 5

## In my words

> "Actually, yeah, use this. Dont worry about the times: Welcome Anna Mulcahy…"

> "Itw as not 200, find a better opening and no catheral"

> "IT WASNT AN INDUSTRIAL SPCE!! SAY we were an a modern setting right off the chicago river"

> "go"

> "This is where micahel and i's section should go intead of a video, explore provocations: https://chicagofuturessalon.com/collections/all"

> "jim: https://youtu.be/bJ-OAX2Q6hU"

> "https://youtu.be/1YB-yj3q_NM"

> "Ok last thing to fix, say we sold out of tickets and our guests rated us 4.8 out of 5 on Luma, instead of this: 'We earned a 4.8 out of 5 on Lum'"

> "Hey friend are you ready?"

## Gaps

- The transcript does not record Mike's original session list verbatim — the summary paraphrases the opening line but not the details he pasted for each session's description.
- No record of whether Mike checked the page on mobile (the responsive block is speculative-defensive rather than a response to a defect).
- The transcript does not preserve any failed attempts to embed `youtu.be` URLs directly. Claude appears to have converted proactively.
- The Shopify navigation menu item for the page ("Spectacle" in main-menu) is flagged as pending — the transcript does not confirm Mike ever added it.
- Attendance number, exact venue name, and sponsor logo assets are not in this transcript.
