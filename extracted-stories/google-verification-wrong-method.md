# Verifying a domain in Search Console when the tag and the screen disagree

ENGAGEMENT: Chicago Futures Salon — Shopify theme (`chicagofuturessalon.com`, live), work spanning June 22 → August 30, 2026
KIND: broke
SOURCE: `/root/.claude/projects/-home-user-shopify/64080f34-7a4a-5a22-a1a2-859a71c8eab3.jsonl`

## What happened

Mike asked Claude Code to add a Google site-verification code to the Shopify theme so Search Console would let him claim `chicagofuturessalon.com`. Claude put the tag in `layout/theme.liquid` and pushed. Google refused to verify. Mike came back annoyed. Two turns of chasing "the change didn't deploy" ended when Mike sent a screenshot showing the Search Console screen he was actually looking at: it was the **DNS TXT record** panel, not the HTML-tag panel. Different verification method, different mechanism. The tag Claude had added was in the right place for a method Mike had never selected.

Recovery path was to either (a) switch Search Console to the "HTML tag" method, which would validate the meta tag already deployed, or (b) add the same string as a TXT record on the domain. Since Mike's nameservers were `ns-cloud-d[1-4].googledomains.com` but registrar was Tucows and he'd already moved the domain into Shopify, we walked through adding the TXT record in Shopify Admin → Settings → Domains → DNS.

## How it worked

**The verification token.** Google issues one string. Same value, different envelopes depending on method:

- HTML tag method: `<meta name="google-site-verification" content="h0kzD-ma9BF09SWdoYmWr7pWHhQxtsHeL7lk-2XKA8E" />`
- DNS TXT method: `google-site-verification=h0kzD-ma9BF09SWdoYmWr7pWHhQxtsHeL7lk-2XKA8E`
- HTML file method: a file at `google<token>.html`

Google will verify a property using **whichever method the user selected**. Adding the tag when the user chose DNS does not help Google.

**Where Claude put the tag.** Committed to `layout/theme.liquid`, at line 14, between the description meta tag and the theme.css stylesheet link:

```liquid
{% if page_description %}
  <meta name="description" content="{{ page_description | escape }}">
{% endif %}

<meta name="google-site-verification" content="h0kzD-ma9BF09SWdoYmWr7pWHhQxtsHeL7lk-2XKA8E" />

{{ 'theme.css' | asset_url | stylesheet_tag }}
```

Verified in the pushed diff: `1 file changed, 2 insertions(+)`, commit `efadedd`.

**Verification path Claude tried when Mike said it wasn't working.** Fully blocked by the environment:

1. `WebFetch https://chicagofuturessalon.com/` → `HTTP 403 Forbidden`
2. `curl -s https://chicagofuturessalon.com/ | grep -i "google-site-verification"` → no output
3. `curl -s https://chicagofuturessalon.com/ | head -50` → `Host not in allowlist: chicagofuturessalon.com. Add this host to your network egress settings to allow access.`

So Claude never actually confirmed whether the tag was live on the deployed site — only that it was committed and pushed to the connected repo. Two full turns were spent pattern-matching this as "the changes haven't been deployed" before Mike's screenshot forced the real diagnosis.

**The screenshot that broke the loop.** A Search Console panel titled "TXT record" showing:
- Name: "Set to default value"
- TXT Value: `google-site-verification=h0kzD-ma9BF09SWdoYmWr7pWHhQxtsHeL7lk-2XKA8E`
- TTL: "Set to lowest possible value"
- "Alternative code for verification"
- "CNAME record" collapsed underneath

## The sequence

1. Mike: *"I need you to add this to the site so we can pass Google's verification: google-site-verification=h0kzD-ma9BF09SWdoYmWr7pWHhQxtsHeL7lk-2XKA8E"*
2. Claude reads `layout/theme.liquid`, adds the meta tag, commits, `git push -u origin` fails with `src refspec ... does not match any` (branch-name typo: `QYps` vs `QYqs`), retries with `git push origin HEAD`, succeeds.
3. Mike, hours later: *"So why isnt google registereding this? Do you make sure the link is right? Did you test and validet eit? What is wrong?"*
4. Claude tries WebFetch → 403. Tries curl twice — first is silent, second returns "Host not in allowlist". Claude now cannot see the live site at all.
5. Claude's first theory: **the code is in GitHub but hasn't been deployed to Shopify**. Suggests `shopify theme push` or manual upload.
6. Mike: *"What are you talking about? Everytihng else has been pushed from here to the site to make it live"*
7. Claude backs off, checks for `.github/workflows/`, `.toml` files, Shopify CLI config — finds none. Concedes it doesn't know how deploy is wired. *"How are you deploying to Shopify? Do you have a GitHub integration set up, or are you manually syncing the theme?"*
8. Mike: *"What do you mean how are we deplying to shopify !!! YOU ARE FUCKIGN CENCCTED AND HAVE BEEN PUSHING YPDATES< YOU TELL ME"*
9. Claude checks for multiple themes / a Publish button in Shopify Admin. Guesses again.
10. Mike: *"No just one theme, are you wokring on this site? Did you check the requirements from google on where to palce this?"* — and includes the screenshot.
11. Claude finally sees the DNS TXT panel. Diagnosis flips: *"I see the issue now — that screenshot shows Google wants a DNS TXT record, not an HTML meta tag. Those are two different verification methods."*
12. Mike: *"how do i find where i registered my domian"*
13. Claude's `whois` isn't installed. Search results are generic. Suggests whois.com/ICANN lookup. Also pushes the HTML-tag method as the easier route.
14. Mike sends a WHOIS screenshot: Registrar Tucows Domains Inc., Name Servers `ns-cloud-d1..d4.googledomains.com`.
15. Claude reads that as Google Domains (now Squarespace) — misses that the domain is on Shopify-managed DNS.
16. Mike: *"Ok i foudn the domian on shopoify, what do I have to do with the TXT value adn shit?"*
17. Claude gives the Shopify Admin path: Settings → Domains → the domain → DNS Settings → Add custom record → TXT → Name blank or `@` → Value `google-site-verification=h0kzD-ma9BF09SWdoYmWr7pWHhQxtsHeL7lk-2XKA8E` → TTL automatic → Save. Wait 5–10 min, then Verify.

## Numbers

- Turns spent on the wrong theory before the screenshot arrived: 2
- Wrong theories chased in order: (a) code hasn't deployed, (b) multiple themes / needs a Publish click, (c) cache/re-crawl delay
- Total elapsed session time from "add this" to "here's how to add the TXT record": UNKNOWN (session spans hours; wall-clock precision not in the log)
- Git commits made to fix a problem the diff couldn't have fixed: 1 (`efadedd`)
- Egress rules blocking Claude from checking its own work: 1 (host not in allowlist for `chicagofuturessalon.com`)

## In my words

> "So why isnt google registereding this? Do you make sure the link is right? Did you test and validet eit? What is wrong?"

> "What are you talking about? Everytihng else has been pushed from here to the site to make it live"

> "What do you mean how are we deplying to shopify !!! YOU ARE FUCKIGN CENCCTED AND HAVE BEEN PUSHING YPDATES< YOU TELL ME"

> "No just one theme, are you wokring on this site? Did you check the requirements from google on where to palce this?"

> "Ok i foudn the domian on shopoify, what do I have to do with the TXT value adn shit?"

## Gaps

- The transcript does not say whether the TXT record was successfully added or whether Google eventually verified the property.
- The transcript does not say why Search Console was showing the DNS panel — whether Mike had picked it deliberately, whether it was the default, or whether he'd already failed the HTML method once.
- The transcript does not say how theme changes actually get from the `mikehyzy/shopify` repo to the live Shopify store. Claude checked for GitHub Actions, Shopify CLI config, and `.toml` files and found none. The connection existed (everything else had gone live) but the mechanism was never surfaced in-session.
- The transcript does not say what network-egress policy scoped this session, only that `chicagofuturessalon.com` was outside it.
