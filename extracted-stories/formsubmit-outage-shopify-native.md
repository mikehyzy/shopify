# Third-party form service died in production, cut over to Shopify's native form + Gmail forwarding for CCs

ENGAGEMENT: Chicago Futures Salon — Shopify theme, June 2026
KIND: solved
SOURCE: `/root/.claude/projects/-home-user-shopify/64080f34-7a4a-5a22-a1a2-859a71c8eab3.jsonl` (pre-compaction summary)

## What happened

The invitation form on `chicagofuturessalon.com` submitted through **FormSubmit.co**, a third-party form-to-email relay. FormSubmit went down and returned 403 to submissions. The live form on the invitation page was broken. Mike opened the session with a screenshot: *"Hey the submit form isn't working."*

The recovery had two parts:

1. **Replace the form's backend.** Cut over from FormSubmit's hosted endpoint to Shopify's built-in `{% form 'contact' %}` — the native contact form that ships with every Shopify store and posts submissions to the address in Settings → General → Store contact email. No third-party dependency, no API key, no rate-limit story to reason about.
2. **Restore CC behavior for the two board members** (Michael Marshall and Anna Mulcahy) who had been on the FormSubmit recipient list. Shopify's native form posts to a single store contact address. The CC list had to move somewhere else. Solution: a Gmail filter on Mike's inbox that auto-forwards any message matching the invitation-form subject line to both board members.

## How it worked

**Before — FormSubmit setup:** the invitation form used a plain HTML `<form>` posting to `https://formsubmit.co/<hashed-endpoint>`, with hidden fields for subject and honeypot, and client-side JavaScript for validation and success/error handling. Recipients (Mike + Michael + Anna) were configured in FormSubmit's account settings.

**After — Shopify native form:** the `<form>` was replaced with a Liquid `{% form 'contact' %}` block. Shopify handles the POST, validates required fields, and delivers to the store contact email. Success and error rendering moved to Liquid using `form.posted_successfully?` and `form.errors`. All client-side submission JavaScript was removed.

**The cut-over touched two files:**

`sections/invitation-form.liquid` — full form block, from the final state:

```liquid
{% form 'contact' %}
  {% if form.posted_successfully? %}
    <div style="color: #00d4ff; text-align: center; padding: 1rem; border: 1px solid #00d4ff; margin-bottom: 1.5rem;">
      Thank you! Your request has been submitted. We'll be in touch soon.
    </div>
  {% endif %}

  {% if form.errors %}
    <div style="color: #ff6b6b; text-align: center; padding: 1rem; border: 1px solid #ff6b6b; margin-bottom: 1.5rem;">
      {{ form.errors | default_errors }}
    </div>
  {% endif %}

  <input type="hidden" name="contact[subject]" value="Invitation Request - Chicago Futures Salon">

  <div class="space-y-6">
    <!-- first_name, last_name, email, organization, body -->
    <input type="text" id="firstName" name="contact[first_name]" required ...>
    <input type="text" id="lastName"  name="contact[last_name]"  required ...>
    <input type="email" id="email"    name="contact[email]"      required ...>
    <input type="text" id="organization" name="contact[organization]" required ...>
    <textarea id="interest" name="contact[body]" required rows="4" ...></textarea>

    <button type="submit" class="btn btn-primary w-full">Submit Request</button>
  </div>
{% endform %}
```

Key field-name change: form inputs went from `name="firstName"` → `name="contact[first_name]"`. Shopify's contact form only accepts fields inside the `contact[...]` namespace. Anything outside it is dropped.

`sections/footer.liquid` — the newsletter form got the same treatment. FormSubmit newsletter endpoint replaced with a `{% form 'contact' %}` block using a hidden `contact[subject]` of `Newsletter Subscription - Chicago Futures Salon` and a hidden `contact[tags]` of `newsletter`.

**Schema settings removed:** both sections previously exposed a `notification_email` text field in their Shopify theme editor schema (so a theme editor could reroute submissions). That's no longer needed — Shopify handles routing. The schema was replaced with a paragraph explaining submissions go to the store contact email.

**Gmail-side CC solution.** Mike's Gmail was the store contact address. He set up filters that matched incoming mail by subject line and auto-forwarded to `michael.s.marshall8@gmail.com` and `annamulcahy5@gmail.com`. Two forwards per submission, no FormSubmit dependency.

## The sequence

1. Mike: *"Hey the submit form isn't working"* + screenshot showing FormSubmit's 403.
2. Mike: *"But this is even the email to sign up for our lists. Just make it so we Claude the email"* — i.e. don't route through a third party at all.
3. Claude replaces both `<form action="https://formsubmit.co/...">` blocks with `{% form 'contact' %}` and updates all field names to the `contact[...]` namespace.
4. Mike (later, from phone): *"I can't I'm on my phone"* — meaning he can't test right now.
5. Mike: *"Im home, can you check it tot see if its working"* — Claude walks through verifying.
6. Mike: *"Nevermind, it came to me but it needs to go to two other people as wel;l"* — first submission landed in his inbox. Now the CC problem.
7. Claude offered options; Mike picked *"ok option one"* — the Gmail filter approach.
8. Gmail filter set up to forward to both board members.

Commit log for the arc, in order:
- `10ed2f1` Fix invitation form to actually submit data
- `6c50b6b` Set up form to email submissions directly via FormSubmit
- `568b7a2` Update form notification email to mike.hyzy@gmail.com
- `3567935` Add CC recipients to invitation form
- `0306c2d` Switch forms to Shopify's built-in contact system

The commit ordering shows the arc: fix, third-party route, notification email, CCs added, then the cut-over that made all of it unnecessary.

## Numbers

- Third-party services eliminated: 1 (FormSubmit.co)
- Files rewritten: 2 (`sections/invitation-form.liquid`, `sections/footer.liquid`)
- Named recipients that had to be preserved: 3 (Mike + Michael Marshall + Anna Mulcahy)
- Gmail filters added: 1 (with two forward-to addresses)
- Field-name namespace change: `firstName` → `contact[first_name]` (Shopify requires the `contact[...]` prefix)
- Client-side JavaScript removed: all validation + submission handling
- Commits in the arc: 5

## In my words

> "Hey the submit form isn't working"

> "But this is even the email to sign up for our lists. Just make it so we Claude the email"

> "I can't I'm on my phone"

> "Im home, can you check it tot see if its working"

> "Nevermind, it came to me but it needs to go to two other people as wel;l"

> "ok option one"

## Gaps

- The transcript does not record what triggered FormSubmit's 403 — whether it was rate limiting, a paid-tier expiry, an account misconfiguration, or a general outage.
- The transcript does not record how the Gmail forwarding filter was actually configured (exact subject pattern, whether it uses "forward to" chained rules or Gmail's single-forward setting).
- No mention of what happens when Shopify's contact form itself is down or throttled.
- No confirmation that Anna and Michael actually received a test submission end-to-end after the filter was set up.
