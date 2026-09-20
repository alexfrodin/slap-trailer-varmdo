# Släp & Trailer Värmdö — Implementation Plan

**Status:** Planning only. Do not treat this document as a license to invent business facts. Replace every `[PLACEHOLDER]` before launch.

**Visible website language:** Swedish (`lang="sv"`).  
**This document language:** English (architecture, file names, developer notes).  
**Stack:** Astro + TypeScript + Tailwind CSS + Vercel.  
**Likely production domain:** `https://slapochtrailervarmdo.se` (keep configurable).

---

## Decisions made during planning

These are the important challenges to the original brief. An implementing agent should follow this refined version, not the first-draft sitemap.

| Original idea | Decision | Why |
|---|---|---|
| `/slapvagnsservice-varmdo` as a separate page | **Do not build it** | It would duplicate the homepage for the same intent (“släpvagnsservice Värmdö”). Two similar pages dilute rankings and confuse Ads. The homepage **is** the local service landing page. |
| Optional `/el-belysning-slapvagn` | **Build it** | Lighting/electrical faults are a distinct, high-intent problem. Not a thin doorway page if written around symptoms and repair. |
| Optional `/infor-besiktning` | **Build it** | Swedish trailer inspection is a real seasonal job with different intent from general repair. |
| `/svetsning-slapvagn` | **Build it** | Distinct offering, not a keyword variant of “service”. |
| CMS / content collections | **Do not use** | Six similar service pages belong in one typed TypeScript data module. Collections add ceremony without an editor workflow. |
| React/Vue/Svelte | **Do not use** | No interactive UI that justifies a framework. Native HTML form + a few small scripts. |
| Google Analytics 4 at launch | **Do not add** | In Sweden, analytics cookies need prior opt-in. GA4 also overlaps Google Ads tagging. Use cookieless analytics plus an optional Ads tag behind a flag. |
| FAQPage JSON-LD | **Do not add** | Google retired FAQ rich results on 7 May 2026. Visible FAQ content still belongs on pages; the markup does not earn a Google SERP feature and is not worth maintaining for this site. |
| `AutoRepair` schema | **Do not use** | Schema.org defines it as a *car* repair business. This workshop does not repair cars. Use `AutomotiveBusiness` (parent type: automotive repair/sales/parts) which is the most specific honest type. |
| Embedded Google Map iframe | **Do not embed at launch** | Third-party map iframes hurt performance and typically involve non-essential cookies/network calls. Use NAP + a static map image + a Google Maps directions link. |
| Fixed prices on the site | **Quote-based at launch** | Trailer jobs vary by brand, axle, brake type, and corrosion. Architecture still supports optional price hints later. |
| Review section at launch | **Hide until real reviews exist** | Never fabricate testimonials. Do not put self-serving `Review` / `AggregateRating` JSON-LD on the site. |
| `/om-oss` | **Do not build** | Trust copy lives on the homepage. An about page would be thin. |
| Cookie banner | **Avoid unless Ads/GA tags are enabled** | If the site sets no non-essential cookies, do not ship a banner. |

**Final public sitemap (8 indexable pages + 1 thank-you page):**

1. `/` — homepage / local service hub  
2. `/batslap-service`  
3. `/hjullager-slapvagn`  
4. `/bromsservice-slapvagn`  
5. `/el-belysning-slapvagn`  
6. `/svetsning-slapvagn`  
7. `/infor-besiktning`  
8. `/kontakt`  
9. `/integritetspolicy`  
10. `/tack` — form success, `noindex`

That is **7 commercial pages** (home + 6 services) plus contact and privacy. Within the requested 5–8 high-quality commercial pages.

---

## Assumptions (architecture does not depend on these)

Mark these in copy until the owner confirms. None of them change the tech stack.

1. **Drop-off workshop, not mobile service.** Customers bring the trailer to Värmdö unless later told otherwise. Do not promise pickup or on-site repair.
2. **Boat + trailer can be handled together.** The USP “lämna båten på service, vi går igenom trailern” is only true if the boat workshop and trailer work share a yard or a practical handoff. Confirm before using that headline. If false, keep boat-trailer skill as the USP instead of simultaneous servicing.
3. **Owner answers the phone and the form inbox personally.** No ticketing system, CRM, or auto-reply beyond a simple confirmation page.
4. **No logo / brand colours exist yet.** Use the palette direction in this plan; tokens must be easy to swap.
5. **No published price list.** Show “vi återkommer med pris” / quote after inspection.
6. **No reviews at launch.**
7. **Swedish only.** No `hreflang`, no English version.
8. **Service area is “come to us”.** Mention Nacka, Gustavsberg, Ingarö, and eastern Stockholm as places customers travel from — not as separate landing pages.
9. **Photo uploads are useful** for the owner (lights, rust, bearings, cracks). Keep them optional.
10. **Google Ads will run** against the service pages after or at launch.

---

## Placeholders (must be replaced before launch)

| Token | Meaning |
|---|---|
| `[COMPANY_NAME]` | Legal Aktiebolag name (without “AB” duplicated if already in the name) |
| `[ORG_NUMBER]` | Swedish organisation number, format `XXXXXX-XXXX` |
| `[PHONE]` | Display number, e.g. `08-XXX XX XX` |
| `[PHONE_E164]` | `tel:` target, e.g. `+468XXXXXXX` |
| `[EMAIL]` | Public inbox, preferably on the site domain |
| `[ADDRESS_STREET]` | Street + number |
| `[ADDRESS_POSTAL]` | Postcode |
| `[ADDRESS_CITY]` | Locality, expected `Värmdö` or `Gustavsberg` etc. |
| `[GEO_LAT]` / `[GEO_LNG]` | Workshop coordinates, ≥5 decimal places for schema |
| `[OPENING_HOURS]` | Human-readable hours, Swedish |
| `[OPENING_HOURS_SCHEMA]` | Structured weekly hours in `site.ts` |
| `[SITE_URL]` | Canonical origin, default `https://slapochtrailervarmdo.se` |
| `[MAPS_DIRECTIONS_URL]` | Google Maps directions URL to the workshop |
| `[GBP_URL]` | Google Business Profile public URL, when it exists |
| `[BOAT_COMPANY_URL]` | Existing boat-company site, if a cross-link is wanted |

Until real values exist, `src/data/site.ts` should hold the tokens as typed strings so pages compile, and a pre-launch checklist must fail if any token remains.

---

# 1. Executive summary

Build a small, mostly static Swedish website whose only job is to turn a local trailer problem into a phone call or a short service request.

The site is a workshop brochure with sharp service landing pages, not a web app. Astro prerenders every page to HTML. The only server code is one Vercel function that validates a lead form, checks spam protections, and emails the owner via Resend. There is no database, no CMS, no login, and no client framework.

Conversion design is mobile-first: a visible `tel:` number in the header, a sticky mobile bar (`Ring` / `Boka service`), and the same short form on the homepage, contact page, and every service page. Copy stays practical — symptoms, what gets fixed, how booking works, where the workshop is.

SEO is local and honest. The homepage owns “släpvagnsservice Värmdö”. Each other commercial page owns one problem (bearings, brakes, electrics, welding, boat trailers, pre-inspection). Nearby places are mentioned in body copy, never as doorway pages. Structured data describes an `AutomotiveBusiness` at a real address. Reviews are omitted until they are real.

Analytics stay cookieless (Vercel Analytics + Plausible). Google Ads conversion tags are optional and must not load without consent. If Ads are off, the site needs no cookie banner.

One developer should be able to ship this in a short sequence of phases, then leave it alone. Business facts live in one config file; services live in one typed module; pages are thin templates.

---

# 2. Technical architecture

## 2.1 Framework

**Astro (current stable at implementation time; expect 5.x) + TypeScript.**

- Default output: **static**.
- Adapter: `@astrojs/vercel` so a single API route can opt out of prerendering.
- Integrations: `@astrojs/sitemap`, `@astrojs/tailwind` **or** Tailwind v4 Vite plugin (use whichever is the documented Astro default at install time). `@astrojs/image` is unnecessary; use built-in `astro:assets`.

Do not add React, Vue, Svelte, MDX, content collections, or a UI kit.

## 2.2 Hosting and deployment

- **Vercel**, connected to GitHub.
- Production branch: `main`.
- Preview deployments: every pull request / non-main branch.
- Framework preset: Astro.
- Node: **22.x**.
- Region for the serverless function: `arn1` (Stockholm) if the project can pin it; otherwise default is acceptable for this volume.

Domain:

- Production: `[SITE_URL]` / likely `slapochtrailervarmdo.se` + `www` redirect to apex (or the reverse — pick **apex as canonical**).
- HTTPS via Vercel certificates.
- Keep `site` in `astro.config` and `site.url` in `src/data/site.ts` driven from `PUBLIC_SITE_URL` so a domain change is one env var + DNS.

## 2.3 Rendering strategy

| Route | Mode | Reason |
|---|---|---|
| All pages | Prerendered static HTML | Speed, cheap hosting, excellent CWV |
| `/sitemap-index.xml` (integration) | Build-time | Standard |
| `/robots.txt` | Static file in `public/` | Simple |
| `/api/contact` | `export const prerender = false` | Needs secrets, validation, email |

`astro.config` should remain `output: 'static'` (Astro’s default) with the Vercel adapter attached. Only the contact endpoint sets `prerender = false`.

No ISR. No server islands. No middleware unless needed later for security headers (prefer `vercel.json` headers).

## 2.4 Styling

**Tailwind CSS** + a small `src/styles/global.css` for:

- CSS variables (colour tokens, font, header offset, sticky-bar height)
- Base typography (`lang=sv` hyphenation, measure)
- Focus styles
- Reduced-motion

Use utility classes in components. Do not introduce CSS modules, styled-components, or a design-system package.

Self-host fonts as `.woff2` (latin + latin-ext for å/ä/ö). Do **not** load Google Fonts from the CDN.

## 2.5 Forms

**Custom Astro endpoint + Resend + Cloudflare Turnstile + honeypot.**

See Section 12 for the full recommendation and rejected alternatives.

## 2.6 Analytics

**Launch default (no cookie banner):**

1. **Vercel Web Analytics** — page views + Core Web Vitals, first-party, no banner.
2. **Plausible** (EU cloud) — page stats + custom events: `tel_click`, `form_submit`, `cta_boka`. Cookie-free, ~1–2 KB.

**Optional, env-flagged, consent-gated:**

3. **Google Ads tag** (`PUBLIC_GOOGLE_ADS_ID`) on `/tack` and optionally on `tel:` clicks. Load only after explicit consent. Never ship GA4 unless a later decision requires it.

See Section 13.

## 2.7 SEO mechanics

- `astro.config` `site` set to `[SITE_URL]`
- `@astrojs/sitemap` excluding `/tack`
- `public/robots.txt` allowing `/` and pointing to the sitemap
- Canonical URL on every page via a `Seo` component
- One `<h1>` per page
- Open Graph + Twitter card via the same `Seo` component
- JSON-LD via a `JsonLd` component fed from `site.ts` / `services.ts`
- Trailing slash: pick **no trailing slash** and configure Astro + Vercel consistently (`trailingSlash: 'never'`)

## 2.8 Important technical decisions

1. **Static first.** A trailer workshop site does not need per-request HTML.
2. **One serverless function, not a backend.** Email is the CRM.
3. **Typed data modules instead of Markdown.** The owner will not log into a CMS. A developer editing `services.ts` is the real workflow.
4. **Progressive enhancement for the form.** Native `POST` + 303 redirect to `/tack`. JavaScript only for Turnstile, image compression, and inline error UX.
5. **No third-party map/runtime widgets** on first load besides Turnstile on pages that include the form.
6. **Config in one file.** Phone, address, hours, legal name — never hardcoded in components.
7. **Swedish in the UI, English in code.** Component names, comments, git messages in English. All user-visible strings in Swedish, preferably colocated in data files so copy review is easy.

---

# 3. Information architecture

## 3.1 Primary navigation

Keep nav short. Six services do not all belong in the top bar.

**Desktop header links:**

- Tjänster (dropdown or simple mega of the 6 services — on mobile this is an accordion in the drawer)
- båttrailer (`/batslap-service`) — promoted because it is the USP
- Inför besiktning (`/infor-besiktning`)
- Kontakt (`/kontakt`)

Plus always-visible: phone number + button **Boka service** (scrolls to `#forfragan` on the current page, or goes to `/kontakt#forfragan`).

**Footer links:** all 6 services, kontakt, integritetspolicy, phone, address, legal line.

## 3.2 Sitemap

```
/                         Home — local SEO + conversion
/batslap-service          Boat trailers
/hjullager-slapvagn       Wheel bearings / hubs
/bromsservice-slapvagn    Brakes / overrun
/el-belysning-slapvagn    Electrics / lighting
/svetsning-slapvagn       Welding / metal repair
/infor-besiktning         Pre-inspection
/kontakt                  NAP + form + hours
/integritetspolicy        Privacy
/tack                     Thank you (noindex, not in sitemap)
```

**Intentionally omitted:** `/slapvagnsservice-varmdo`, `/om-oss`, city pages (`/nacka`, `/ingarö`, …), blog, price list, gallery.

**Future URLs that the structure must not block:**

- `/priser`
- `/galleri`
- `/guider/[slug]`
- additional `/[slug]` service pages by appending to `services.ts`

## 3.3 URL rules

- Lowercase, hyphenated, no diacritics (`ä→a`, `ö→o`).
- Do not stuff `varmdo` into every slug. Locality belongs in titles and body copy.
- Do not change slugs after launch without redirects.

---

# 4. Page specifications

All title tags should stay under ~60 characters where possible. Meta descriptions ~140–155 characters. Include the phone number in metas only if it still reads naturally; otherwise keep the description action-oriented (“Ring eller skicka en förfrågan”).

Primary keyword targeting is **one topic per page**. Nearby place names appear in copy, not in every H1.

Shared **primary CTAs** unless a page says otherwise:

- Primary: **Boka service** → `#forfragan`
- Secondary: **Ring oss** → `tel:[PHONE_E164]`

---

### 4.1 Home — `/`

**Purpose:** Rank for local generic service queries and convert immediately. Prove this is a real Värmdö workshop that fixes trailers, including boat trailers.

**Search intent:** Local commercial — “I need trailer service near Värmdö / Gustavsberg”.

**Primary topic:** släpvagnsservice Värmdö / släpvagn service Värmdö / släpvagn verkstad Värmdö.

**Title:** `Släpvagnsservice på Värmdö | Släp & Trailer Värmdö`  
**Meta:** `Service och reparation av släpvagnar och båttrailer på Värmdö. Hjullager, bromsar, el och svets. Ring eller skicka en förfrågan.`  
**H1:** `Service och reparation av släpvagnar på Värmdö`

**Sections:** see Section 5 (homepage wireframe).

**Internal links:** all six service pages, `/kontakt`, `#forfragan`.

**FAQ ideas (visible, no FAQ schema):**

- Vilka släp tar ni emot?
- Behöver jag boka tid?
- Kan ni serva och reparera båttrailer?
- Kan ni hjälpa till ute på plats?

---

### 4.2 Boat trailers — `/batslap-service`

**Purpose:** Convert boat-trailer owners; support Ads group “båttrailer”; explain the simultaneous-service USP without making the whole brand boat-only.

**Intent:** Commercial — “båttrailer service / reparation / hjullager Värmdö”.

**Primary topic:** båttrailer service Värmdö.

**Title:** `båttrailer service på Värmdö | Släp & Trailer Värmdö`  
**Meta:** `Service av båttrailer på Värmdö: rullar, vinsch, stödhjul, hjullager, bromsar och belysning. Lämna gärna trailern när båten är inne.`  
**H1:** `Service och reparation av båttrailer`

**Sections:**

1. Compact hero + CTAs  
2. USP: *Lämna båten på service – låt oss gå igenom trailern samtidigt.* (only if assumption 2 is true)  
3. What we check on a boat trailer: rullar, vinsch, stödhjul, hjullager, bromsar, belysning, däck  
4. Water-launch wear (bearings/brakes after ramp use)  
5. Process / drop-off  
6. Link out: still welcome ordinary släp — “Vi servar även vanliga släpvagnar” → `/`  
7. FAQ  
8. Related: hjullager, bromsar, el  
9. Form  

**FAQ:**

- Hur ofta bör hjullager på båttrailer kontrolleras?
- Kan ni byta rullar och vinsch?
- Behöver trailern vara tom?
- Kan ni se över trailern medan båten är på service?

**Ads mapping:** båttrailer service/reparation, byta hjullager båttrailer.

---

### 4.3 Wheel bearings — `/hjullager-slapvagn`

**Purpose:** High-intent problem page. People searching this usually already have noise, play, or a seized hub.

**Intent:** Commercial investigation / emergency repair.

**Primary topic:** byta hjullager släpvagn / hjullager båttrailer.

**Title:** `Byta hjullager på släpvagn | Släp & Trailer Värmdö`  
**Meta:** `Vi byter hjullager, nav och tätningar på släpvagnar och båttrailer. Om släpet låter, glappar eller går trögt – hör av dig.`  
**H1:** `Hjullager och nav till släpvagn`

**Sections:**

1. Hero: problem-aware (“Låter det, glappar det eller har lagret skurit?”)  
2. Symptoms  
3. What we do (inspect, replace bearings/seals/hub as needed, grease, check play)  
4. Boat trailers + water (short cross-link to `/batslap-service`)  
5. Can I still drive it? — cautious, not legal advice: if it howls, has play, or has seized, do not drive; call.  
6. FAQ  
7. Related: bromsar, besiktning, båttrailer  
8. Form  

**FAQ:**

- Hur vet jag att hjullagret är dåligt?
- Kan ni byta hjullager på alla fabrikat?
- Måste båda sidor bytas?
- Hur lång tid tar det?

---

### 4.4 Brakes — `/bromsservice-slapvagn`

**Purpose:** Overrun brakes, cables, shoes, parking brake — a safety-critical search.

**Intent:** Commercial.

**Primary topic:** släpvagn bromsar service / påskjutsbroms.

**Title:** `Bromsservice för släpvagn | Släp & Trailer Värmdö`  
**Meta:** `Service av påskjutsbroms, bromsvajrar och parkeringsbroms på släpvagnar och båttrailer. Vi justerar, felsöker och reparerar.`  
**H1:** `Bromsar och påskjutare till släpvagn`

**Sections:**

1. Hero  
2. Symptoms (pulls, no brakes, seized, cable stretch, parking brake)  
3. What we service  
4. Safety note: do not trailer-load if brakes feel wrong  
5. FAQ  
6. Related: hjullager, besiktning  
7. Form  

**FAQ:**

- Hur vet jag att påskjutsbromsen är dålig?
- Kan ni byta bromsvajrar?
- Tar ni båttrailer med bromsar?
- Behöver jag lämna släpet hela dagen?

---

### 4.5 Electrics — `/el-belysning-slapvagn`

**Purpose:** The most common “it failed on the way / before inspection” job.

**Intent:** Commercial / problem (“belysning släpvagn”, “ingen belysning släp”).

**Primary topic:** el och belysning släpvagn.

**Title:** `El och belysning på släpvagn | Släp & Trailer Värmdö`  
**Meta:** `Felsökning av belysning, släpkontakt, jordfel och kablar på släpvagnar och båttrailer. Vi hittar felet och lagar det.`  
**H1:** `El och belysning till släpvagn`

**Sections:**

1. Hero  
2. Symptoms (one lamp out, flickering, blown fuse in the car, 7/13-pin, wet plugs)  
3. What we do  
4. Besiktning cross-link (lights are a common fail)  
5. FAQ  
6. Related: besiktning, båttrailer  
7. Form  

**FAQ:**

- Kan ni felsöka belysningen?
- Min bil säkring går – kan det vara släpet?
- Lagar ni både 7-polig och 13-polig kontakt?
- Kan korrosion i kontakten vara orsaken?

---

### 4.6 Welding — `/svetsning-slapvagn`

**Purpose:** Structural/metalwork jobs that general “service” pages cannot cover well.

**Intent:** Commercial — cracked bracket, fender, frame repair.

**Primary topic:** svetsning släpvagn.

**Title:** `Svetsning och reparation av släp | Släp & Trailer Värmdö`  
**Meta:** `Vi svetsar och lagar fästen, stänkskärmar och andra skador på släpvagnar. Bedömning på plats i verkstaden på Värmdö.`  
**H1:** `Svetsning och reparation av släpvagn`

**Sections:**

1. Hero — honest about what is reasonable to repair vs replace  
2. Typical jobs (brackets, fenders, supports, cracks)  
3. We inspect first; not every rusted frame is worth welding  
4. FAQ  
5. Related: besiktning, båttrailer  
6. Form  

**FAQ:**

- Kan ni svetsa mitt släp?
- Svetsar ni rostskador?
- Behöver jag ha med reservdelar?
- Kan ni laga stänkskärmar och stödben?

Do **not** claim certified vehicle-body reconstruction or that every chassis is repairable.

---

### 4.7 Pre-inspection — `/infor-besiktning`

**Purpose:** Seasonal, high-intent local page. People want to avoid a failed inspection.

**Intent:** Commercial / preparatory.

**Primary topic:** släpvagn besiktning / kontroll inför besiktning.

**Title:** `Kontroll av släpvagn inför besiktning | Släp & Trailer Värmdö`  
**Meta:** `Vi går igenom belysning, bromsar, däck och vanliga anmärkningar innan besiktning. Lämna släpet på Värmdö.`  
**H1:** `Inför besiktning av släpvagn`

**Sections:**

1. Hero  
2. What we typically check (lights, brakes, tires, rust, VIN plate, safety chains — only list what the shop actually does)  
3. Common fail points  
4. Not an official inspection — we prepare the trailer; Besiktningsbolaget still does the statutory test  
5. FAQ  
6. Related: el, bromsar, hjullager  
7. Form  

**FAQ:**

- Kan ni kontrollera släpet inför besiktning?
- Är det samma sak som besiktning?
- Hur lång tid innan bör jag lämna in?
- Kan ni laga det som behövs innan?

---

### 4.8 Contact — `/kontakt`

**Purpose:** NAP page, conversion page, Google Business website link target.

**Intent:** Navigational / “ring släpvagnsservice Värmdö”.

**Title:** `Kontakt | Släp & Trailer Värmdö`  
**Meta:** `Ring [PHONE] eller skicka en serviceförfrågan. Verkstad på Värmdö. [ADDRESS_STREET], [ADDRESS_POSTAL] [ADDRESS_CITY].`  
**H1:** `Kontakta oss`

**Sections:**

1. Immediate phone + hours  
2. Address + directions link + static map image  
3. Full form (`#forfragan`)  
4. Short “how booking works”  
5. Legal company line  

**Internal links:** home, services.

No FAQ required.

---

### 4.9 Privacy — `/integritetspolicy`

**Purpose:** GDPR transparency. Linked from footer and form.

**Title:** `Integritetspolicy | Släp & Trailer Värmdö`  
**Meta:** `Så behandlar Släp & Trailer Värmdö personuppgifter när du ringer eller skickar en serviceförfrågan.`  
**H1:** `Integritetspolicy`

**Indexable.** No CTA except contact. Write in Swedish, in the first person plural, with `[COMPANY_NAME] AB` as personuppgiftsansvarig.

---

### 4.10 Thank you — `/tack`

**Purpose:** Form success + optional Ads conversion pixel (consent-gated).

**Title:** `Tack för din förfrågan | Släp & Trailer Värmdö`  
**H1:** `Vi har tagit emot din förfrågan`

**Robots:** `noindex, nofollow`. Exclude from sitemap.

Copy: we will call; if urgent, ring `[PHONE]`. No form.

---

# 5. Homepage wireframe

Mobile-first. Desktop is the same sections in a wider grid, not a different story.

Global chrome (every page except `/tack` may omit the sticky bar if it fights the confirmation message):

- **Header**
- **Sticky mobile action bar** (visible `md:hidden`): `Ring` | `Boka service`
- **Footer**

Hide the sticky bar when a form field is focused so iOS Safari keyboard + bar do not cover inputs. Respect `env(safe-area-inset-bottom)`.

---

### 5.1 Header

**Mobile**

- Left: wordmark `Släp & Trailer Värmdö` (text logo is fine at launch)
- Right: `tel:` icon-button (visible, 44px min) + menu button
- Drawer: services list, båttrailer, besiktning, kontakt, full phone number, **Boka service**

**Desktop**

- Wordmark | nav | visible number `[PHONE]` | button **Boka service**

No transparent-on-hero tricks. Solid background, high contrast, no blur.

---

### 5.2 Hero

**Layout**

- **Mobile:** full-width photo (workshop or trailer, real) → text block → two stacked buttons.
- **Desktop:** 50/50 or 55/45 text left, photo right. No full-viewport cinematic hero.

**Copy**

- Eyebrow: `Släp & Trailer Värmdö`
- H1: `Service och reparation av släpvagnar på Värmdö`
- Lead: `Hjullager, bromsar, el, svetsning och service av båttrailer.`
- Primary button: `Boka service` → `#forfragan`
- Secondary button: `Ring oss` → `tel:`
- Micro line under buttons: `Verkstad på Värmdö · [ADDRESS_CITY]`

Do not put a paragraph of marketing under the H1. One short sentence is enough.

---

### 5.3 Trust strip (new vs original brief)

A single row, not icons-with-lorem.

**Mobile:** stacked lines. **Desktop:** 3 columns.

- `Lokal verkstad på Värmdö`
- `Trailer, släp, hästsläp och maskinsläp`
- `Ring [PHONE]`

This replaces a fluffy “why us” above the fold. Proof comes later with photos.

---

### 5.4 Key services

Heading: `Vad vi hjälper dig med`

Six cards (same data as service pages):

| Card title | Links to |
|---|---|
| Hjullager & nav | `/hjullager-slapvagn` |
| Bromsar & påskjutsbroms | `/bromsservice-slapvagn` |
| El & belysning | `/el-belysning-slapvagn` |
| Svetsning & reparation | `/svetsning-slapvagn` |
| båttrailer | `/batslap-service` |
| Inför besiktning | `/infor-besiktning` |

Each card: short Swedish sentence (symptoms or outcome), not a keyword dump. Entire card is a link.

**Mobile:** 1 column. **Desktop:** 3×2 grid.

---

### 5.5 Boat trailer USP

Heading: `Service och reparation av släp och trailers`  
*(swap heading if the shared-yard assumption is false: `Vi kan släp – och vi kan båttrailer`)*

Body: 2–4 sentences. List the check: hjullager, bromsar, belysning, vinsch, rullar, däck, stödhjul.

CTA text link: `Läs mer om båttrailer` → `/batslap-service`

One real photo (boat on trailer or rollers), not a stock sunset archipelago shot.

**Mobile:** image then text. **Desktop:** image + text side by side, opposite of the hero to avoid a repeating pattern.

---

### 5.6 How booking works

Heading: `Så går det till`

Three steps, numbered, short:

1. **Hör av dig** — ring eller skicka en förfrågan.  
2. **Vi stämmer av** — vad som behövs, när du kan lämna släpet, ungefärligt upplägg.  
3. **Lämna släpet** — vi gör jobbet i verkstaden och hör av oss när det är klart.

No calendar widget. No “book a slot” fiction.

---

### 5.7 Why this workshop (short)

Heading: `En lokal verkstad på Värmdö`

Three concrete points, not values-theatre:

- Service och reparation på plats — lager, bromsar, el och svets.  
- båttrailer är en naturlig del av arbetet, inte ett sidospår.  
- Lokal service på Värmdö på Värmdö.

If the existing boat company is public, one sentence may mention it **without** turning this into that company’s site.

Skip this section if it starts to sound like a brand manifesto. Prefer cutting it over padding it.

---

### 5.8 Workshop photography

Heading optional (`Från verkstaden`) or none — a small gallery of 3–4 real photos with descriptive alt text.

`loading="lazy"` + `astro:assets`. Do not use a JS lightbox at launch. Clicking can open the image URL or do nothing.

If photos are missing at build time, omit the section. Never ship stock-people-with-clipboards.

---

### 5.9 Geographic coverage

Heading: `Värmdö med omnejd – och hjälp ute på plats`

Copy model:

>  Vi hjälper kunder från hela närområdet och kan även utföra vissa service- och reparationsarbeten ute på plats när det passar bättre än att ta släpet till verkstaden.

Hör av dig och berätta vad du behöver hjälp med, så hittar vi en lösning som passar.

Do not list 20 islands. Do not imply a service-area business that drives to the customer.

---

### 5.10 Service request form

`id="forfragan"`

Heading: `Skicka en serviceförfrågan`  
Lead: `Beskriv kort vad du behöver hjälp med.`

Then the form (Section 12). Beside it on **desktop only**: phone card (“Snabbare att ringa?” + large `tel:`).

**Mobile:** form full width; phone is already in header + sticky bar.

---

### 5.11 Location

Heading: `Hitta hit`

- Address  
- Hours  
- `Öppna i Google Maps` (external, `rel="noopener"`)  
- Static map image (OpenStreetMap static or a locally exported map screenshot) with alt `Karta över verkstaden på [ADDRESS]`

No iframe.

---

### 5.12 Footer

See design system. Includes legal brand line:

`Släp & Trailer Värmdö är ett varumärke som drivs av [COMPANY_NAME] AB, org.nr [ORG_NUMBER].`

---

### 5.13 What was dropped from the original homepage list

- **Reviews:** hidden until real.  
- **Long “why choose us” feature grid:** replaced by trust strip + short proof.  
- **Duplicate contact methods scattered without hierarchy:** phone is always chrome; form is once, near the bottom, with a sticky jump link.

---

# 6. Component architecture

Astro components only. No shared JS state library.

## 6.1 Layout (app shell)

| Component | Responsibility | Shared? |
|---|---|---|
| `layouts/BaseLayout.astro` | `html lang="sv"`, fonts, global CSS, skip link, Header, main, Footer, StickyMobileCTA, optional analytics snippets | Yes |
| `Seo.astro` | title, description, canonical, robots, OG, Twitter, theme-color | Yes |
| `JsonLd.astro` | prints a JSON-LD `<script>` from a serialisable object | Yes |

## 6.2 Global chrome

| Component | Responsibility |
|---|---|
| `Header.astro` | Wordmark, nav, phone, desktop CTA, menu toggle |
| `MobileNav.astro` | Accessible drawer: focus trap, Escape, `aria-expanded`, inert background |
| `Footer.astro` | Services, contact, legal, privacy |
| `StickyMobileCTA.astro` | Two-button bar; hidden on `/tack` and when `data-hide-sticky` on focused forms |
| `PhoneLink.astro` | Consistent `tel:` + optional click event hook (`data-plausible-event` or similar) |
| `CTAButton.astro` | Visual variants: `primary`, `secondary`, `phone`. Renders `<a>` or `<button>` based on `href` vs `type` |

## 6.3 Content sections (shared)

| Component | Responsibility |
|---|---|
| `Hero.astro` | Optional image, eyebrow, H1, lead, slot for CTAs. Used on home (large) and service pages (compact) via a `size` prop |
| `ServiceCard.astro` | One service teaser |
| `ServicesGrid.astro` | Maps `services.ts` |
| `BoatUSP.astro` | Homepage + optionally a compact variant on non-boat service pages |
| `HowItWorks.astro` | 3 steps |
| `LocationBlock.astro` | NAP, hours, map image, directions |
| `ContactForm.astro` | Fields, honeypot, Turnstile slot, file input, privacy note |
| `FAQ.astro` | Semantic `<h2>` + list of `<details>`/`<button>` accordion. Keyboardable. Not JSON-LD |
| `PageIntro.astro` | Service-page intro block (H1 already in Hero) |
| `RelatedServices.astro` | 2–3 cards from `relatedSlugs` |
| `Notice.astro` | Optional callout (e.g. “Vi är inte ett besiktningsbolag”) |

## 6.4 Page-specific (keep out of global)

- Homepage-only photo strip: `WorkshopGallery.astro`
- Privacy page: can be a single `.astro` page with prose, no CMS
- Thank-you: tiny page, no extra component required

## 6.5 What not to componentise

Do not create `Container`, `Stack`, `Text`, `Heading` primitives. Tailwind on the page/section is enough.

Do not create a `Button` *and* `CTAButton` *and* `LinkButton`. One `CTAButton` plus raw `<a>` for text links.

---

# 7. Proposed project / file structure

```
slap-trailer-varmdo/
├── astro.config.ts
├── package.json
├── tsconfig.json
├── vercel.json                 # headers, trailing slash
├── .env.example
├── .gitignore
├── IMPLEMENTATION_PLAN.md      # this file
├── public/
│   ├── favicon.ico
│   ├── favicon.svg
│   ├── apple-touch-icon.png
│   ├── robots.txt
│   ├── og-default.jpg          # 1200×630
│   └── images/
│       └── map-workshop.jpg    # static map, optional
├── src/
│   ├── env.d.ts
│   ├── styles/
│   │   └── global.css
│   ├── data/
│   │   ├── site.ts             # NAP, legal, CTAs, hours
│   │   ├── services.ts         # all service pages
│   │   └── navigation.ts       # header/footer derived from services + extras
│   ├── lib/
│   │   ├── schema.ts           # JSON-LD builders
│   │   ├── seo.ts              # title helpers, absolute URLs
│   │   ├── validation.ts       # shared form schema (used by API)
│   │   └── turnstile.ts        # server verify helper
│   ├── layouts/
│   │   └── BaseLayout.astro
│   ├── components/
│   │   ├── Seo.astro
│   │   ├── JsonLd.astro
│   │   ├── Header.astro
│   │   ├── MobileNav.astro
│   │   ├── Footer.astro
│   │   ├── StickyMobileCTA.astro
│   │   ├── PhoneLink.astro
│   │   ├── CTAButton.astro
│   │   ├── Hero.astro
│   │   ├── ServiceCard.astro
│   │   ├── ServicesGrid.astro
│   │   ├── BoatUSP.astro
│   │   ├── HowItWorks.astro
│   │   ├── LocationBlock.astro
│   │   ├── ContactForm.astro
│   │   ├── FAQ.astro
│   │   ├── RelatedServices.astro
│   │   ├── WorkshopGallery.astro
│   │   └── Analytics.astro     # Plausible + optional Ads (consent)
│   ├── assets/                 # photos imported via astro:assets
│   │   └── photos/
│   └── pages/
│       ├── index.astro
│       ├── kontakt.astro
│       ├── integritetspolicy.astro
│       ├── tack.astro
│       ├── [slug].astro        # service pages from services.ts
│       └── api/
│           └── contact.ts
└── README.md                   # setup, env, deploy — English
```

`[slug].astro` uses `getStaticPaths()` from `services.ts`. Static routes (`kontakt`, `tack`, …) take precedence over the dynamic route in Astro — keep service slugs from colliding (`kontakt`, `integritetspolicy`, `tack`, `api`).

**Out of scope folders:** `content/`, `store/`, `hooks/`, `context/`.

---

# 8. Content / data model

## 8.1 `src/data/site.ts`

Single source of truth. Example shape (implementing agent should type this strictly):

```ts
export const site = {
  brandName: 'Släp & Trailer Värmdö',
  legalName: '[COMPANY_NAME] AB',
  orgNumber: '[ORG_NUMBER]',
  url: import.meta.env.PUBLIC_SITE_URL,
  locale: 'sv_SE',
  language: 'sv',
  phoneDisplay: '[PHONE]',
  phoneE164: '[PHONE_E164]',
  email: '[EMAIL]',
  address: {
    street: '[ADDRESS_STREET]',
    postalCode: '[ADDRESS_POSTAL]',
    city: '[ADDRESS_CITY]',
    region: 'Stockholm',
    country: 'SE',
    countryName: 'Sverige',
  },
  geo: { lat: '[GEO_LAT]', lng: '[GEO_LNG]' },
  mapsUrl: '[MAPS_DIRECTIONS_URL]',
  gbpUrl: '[GBP_URL]' | undefined,
  openingHoursLabel: '[OPENING_HOURS]',
  openingHours: [
    // { days: ['Monday', ...], opens: '07:00', closes: '16:00' }
  ],
  serviceAreaNote:
    'Verkstad på Värmdö. Välkommen med släp från Gustavsberg, Ingarö, Nacka och östra Stockholm.',
  social: {
    facebook: undefined as string | undefined,
    instagram: undefined as string | undefined,
  },
  defaultOgImage: '/og-default.jpg',
  form: {
    maxPhotos: 3,
    maxPhotoBytes: 1_000_000, // after client compress; server must enforce
    acceptedMime: ['image/jpeg', 'image/png', 'image/webp'],
  },
} as const;
```

Components import `site.phoneE164`, never a raw string.

## 8.2 `src/data/services.ts`

```ts
export type Service = {
  slug: string;
  navLabel: string;          // short, for nav/footer
  cardTitle: string;
  cardBlurb: string;         // 1 sentence
  h1: string;
  title: string;             // document title, without brand suffix if helper adds it
  description: string;
  heroLead: string;
  sections: {
    symptomsTitle?: string;
    symptoms?: string[];     // short bullet copy
    whatWeDo: string[];
    notes?: string[];        // caveats
  };
  faqs: { q: string; a: string }[];
  relatedSlugs: string[];
  schemaServiceType: string; // e.g. 'Hjullagerbyte släpvagn'
  adsGroup: string;          // documentation only
  priceHint?: string;        // unused at launch; optional later
};
```

Home page imports the array for the grid. `[slug].astro` looks up one item. Related services are slugs, not duplicated objects.

**Do not put Markdown files in `src/content` unless a blog is added later.** If a non-developer later needs to edit FAQs, *then* consider collections. Not now.

## 8.3 SEO title helper

`lib/seo.ts`:

- `pageTitle(title)` → `${title} | Släp & Trailer Värmdö` if brand not already present
- `absoluteUrl(path)` using `site.url`

## 8.4 Copy ownership

Swedish strings live in `site.ts` and `services.ts`, not scattered inside class-heavy markup. Layout chrome (header labels) can live in `navigation.ts`.

Implementing agent should write natural Swedish. Ban translated calques such as “Vi är passionerade över släpvagnar”, “skräddarsydda lösningar”, “i världsklass”, “boka din upplevelse”.

---

# 9. Local SEO plan

## 9.1 Positioning

- **Primary geo:** Värmdö  
- **Secondary mentions:** Gustavsberg, Ingarö, Nacka, östra Stockholm  
- **Do not:** city doorway pages, GBP name stuffing (`Släp & Trailer Värmdö Släpvagnsservice Nacka Stockholm`)

## 9.2 Google Business Profile (launch-critical)

Owner must create/claim this. The website cannot replace it.

Checklist:

- [ ] Business name **exactly** `Släp & Trailer Värmdö` (same as `<title>` brand and schema `name`)
- [ ] Primary category: closest match to trailer repair / släpvagnsverkstad (Swedish GBP UI). If no perfect match, a vehicle repair category plus accurate services is better than a boat-dealer category.
- [ ] Secondary categories only if accurate (e.g. related trailer/boat services)
- [ ] Address = website address = schema address
- [ ] Phone = website `tel:` = schema `telephone` (E.164 in schema)
- [ ] Website = `[SITE_URL]`
- [ ] Hours match the site
- [ ] Services listed (hjullager, bromsar, el, svets, båttrailer, besiktningsgenomgång)
- [ ] Real photos: exterior, interior, trailers, signage
- [ ] Description in Swedish, no keyword spam
- [ ] Enable messaging only if the owner will actually answer
- [ ] Ask real customers for Google reviews after jobs — never buy reviews
- [ ] UTM on the website link is optional; the canonical website URL should still be clean

## 9.3 NAP consistency

Use one formatted address string everywhere (footer, contact, schema, GBP, later Hitta/Eniro).

Phone display format: Swedish grouping, one format only.

## 9.4 On-site local signals

- `Värmdö` in homepage H1, title, first paragraph, footer  
- Service pages: “i vår verkstad på Värmdö” once, naturally  
- `areaServed` in schema: Värmdö municipality + Nacka as named places, not 40 islands  
- Embedded directions link, not a fake map widget  
- Organisation legal name in footer (E-commerce Act / company identification)

## 9.5 Technical SEO launch checklist

- [ ] `site` URL correct (https, no trailing slash mismatch)
- [ ] Sitemap submitted in Search Console
- [ ] `robots.txt` allows Googlebot, references sitemap
- [ ] Canonicals self-referencing
- [ ] 404 page in Swedish (Astro `404.astro`) with phone CTA
- [ ] Redirect `www` ↔ apex
- [ ] HTTP → HTTPS
- [ ] Open Graph image
- [ ] Favicon + Apple touch icon
- [ ] `og:locale` = `sv_SE`
- [ ] No `hreflang`
- [ ] JSON-LD validates in Rich Results Test (Local business)
- [ ] No `Review` schema
- [ ] Images have width/height (Astro Image)
- [ ] Unique titles/descriptions
- [ ] One H1, logical H2s
- [ ] Internal links from home ↔ all services ↔ contact

## 9.6 Search Console

- [ ] Verify domain (DNS) or URL prefix
- [ ] Submit sitemap
- [ ] Set user to owner’s Google account
- [ ] Inspect homepage after launch
- [ ] Monitor “Unparsable structured data”

## 9.7 Off-site (not built in code)

- Hitta.se / Eniro / Merinfo — consistent NAP  
- Link from the existing boat-company website (“släp & trailer”)  
- Local boat clubs, harbour noticeboards, Facebook page if used  
- Do not buy spam directories

## 9.8 Social metadata

- Default OG image: workshop photo + readable wordmark, 1200×630, under 300 KB if possible  
- `og:type` = `website`  
- Twitter `summary_large_image`  
- No requirement to open Facebook/Instagram at launch; omit empty icons

---

# 10. Google Ads landing-page strategy

The site supports Search campaigns. It does not replace campaign hygiene (negatives, location bid, call extensions).

## 10.1 Shared landing rules

Every Ads landing page already:

- Matches the query in H1  
- Shows phone immediately  
- Contains the form on the **same URL** (no extra click)  
- Loads fast on mobile  
- Mentions Värmdö without bait-and-switch  
- Has a clear next step

Do **not** build Ads-only duplicate pages. Use the organic service URLs. If a campaign ever needs a stripped variant, add `?utm_…` on the same page rather than a second slug.

Use **call extensions** and **location extensions** in Google Ads so calls can happen from the SERP itself.

## 10.2 Recommended initial structure

One Search campaign, geo-limited (Värmdö municipality + Nacka + nearby east, radius around the workshop). Language: Swedish.

| Ad group | Example queries (themes) | Landing page |
|---|---|---|
| **Local service** | släpvagnsservice värmdö, släpvagn service värmdö, släpvagn verkstad värmdö, släpvagn reparation nacka | `/` |
| **Boat trailer** | båttrailer service värmdö, båttrailer reparation, service båttrailer | `/batslap-service` |
| **Wheel bearings** | byta hjullager släpvagn, hjullager båttrailer, hjullager släp | `/hjullager-slapvagn` |
| **Brakes** | släpvagn bromsar service, påskjutsbroms, bromsar släp | `/bromsservice-slapvagn` |
| **Electrics** | belysning släpvagn, släp belysning fungerar inte, felsök släpkontakt | `/el-belysning-slapvagn` |
| **Welding** | svetsa släpvagn, laga släp, sprucken stänkskärm släp | `/svetsning-slapvagn` |
| **Inspection prep** | släpvagn besiktning, inför besiktning släp | `/infor-besiktning` |

**Do not advertise** generic `släpvagn` (buy/rent/classified intent).

## 10.3 Conversion actions the site must support

1. **Form submit** — fire on `/tack` (consent-gated Google tag if Ads is on)  
2. **Click-to-call** from the website — Plausible always; Google Ads call conversion if using forwarding numbers or click conversion with consent  
3. **Google-hosted calls** from call extensions — configured in Ads, not on-site

Primary optimisation: **calls + qualified form leads**, not page views.

## 10.4 Ad copy alignment

Headlines should reuse page H1 language (`Släpvagnsservice på Värmdö`, `Byta hjullager`, `båttrailer service`) so Quality Score landing-page experience is coherent.

---

# 11. Conversion strategy

Two actions matter. Everything else is supporting.

## 11.1 Call

Surfaces:

- Header (icon on mobile, full number on desktop)  
- Sticky bar `Ring`  
- Hero secondary button  
- Desktop form sidebar  
- Footer  
- Contact page top  
- `tel:` in schema  

All `tel:` links use `[PHONE_E164]`. Display uses `[PHONE]`.

Track clicks with Plausible `tel_click` (and Ads if enabled).

## 11.2 Service request

Surfaces:

- `#forfragan` form on **home, contact, and every service page**  
- Sticky bar `Boka service` → `#forfragan`  
- Header `Boka service`  
- End of every service page  

Do not use popups, slide-ins, or exit intent.

## 11.3 CTA copy (Swedish, pick from this set)

- `Ring oss`  
- `Boka service`  
- `Skicka förfrågan`  
- `Få hjälp med ditt släp` (hero alternative, not the sticky bar)

Sticky bar labels stay short: **Ring** | **Boka service**.

## 11.4 Mobile specifics

- Tap targets ≥ 44×44 px  
- Sticky bar always available except form-focus and `/tack`  
- No click-to-call buried in a hamburger-only number (the icon sits outside the menu)  
- After form success, `/tack` still shows the phone number for urgency

## 11.5 What not to do

- Chat widgets  
- Callback-scheduling SaaS  
- Multi-step wizards  
- “Get a free quote in 30 seconds” gimmicks  
- Mandatory account or email

---

# 12. Contact form architecture

## 12.1 Recommendation

**Implement:** native HTML form → `POST /api/contact` (Astro endpoint on Vercel) → validate → verify Turnstile → send email with **Resend** → `303` redirect to `/tack`.

**Why this over Formspree / Getform / Basin**

- Volume is tiny; a SaaS form inbox is an extra vendor and extra monthly cost for little gain.  
- File uploads on hosted form products often sit behind paid plans.  
- We already deploy on Vercel; one function is the natural backend.  
- Resend has a Vercel integration, a straightforward API, a free tier that far exceeds workshop lead volume, and sending from `@slapochtrailervarmdo.se` (or the real domain) looks professional.  
- Full control of Swedish confirmation copy and owner-facing email layout.

**Why not Astro Actions as the primary path**

Actions are fine, but a plain `APIRoute` is more obvious for a progressive-enhancement POST, file uploads, and a 303 redirect. Do not pull in Actions unless the implementer strongly prefers them; behaviour should stay the same.

**Why Resend over Nodemailer/SMTP**

SMTP from serverless is brittle. Resend is HTTP, designed for this.

## 12.2 Fields

| Field | Name attr | Required | Notes |
|---|---|---|---|
| Namn | `name` | Yes | 2–80 chars |
| Telefonnummer | `phone` | Yes | Normalize Swedish numbers; allow `07…`, `08…`, `+46…` |
| E-post | `email` | No | If present, must be a valid email |
| Registreringsnummer | `regNumber` | No | Uppercase, strip spaces; do not over-validate (trailers + unregistered frames exist) |
| Typ av släp | `trailerType` | Yes | `<select>`: `båttrailer`, `Släpkärra`, `Maskinsläp`, `Hästtransport`, `Annat` |
| Vad behöver du hjälp med? | `message` | Yes | 10–2000 chars |
| Lägg till bilder | `photos` | No | Max 3, image only |
| Website (honeypot) | `company` | Must be empty | `autocomplete="off"`, visually hidden, not `display:none` alone if it hurts a11y — use the `aria-hidden` + off-screen pattern and `tabindex="-1"` |
| Timestamp | `startedAt` | Hidden | Reject if submitted in under ~3 seconds |
| Turnstile token | `cf-turnstile-response` | Yes | Server-verified |

Form `action="/api/contact"` `method="POST"` `enctype="multipart/form-data"` `novalidate` only if JS validation is present; otherwise keep native required.

Privacy line under the button: `Genom att skicka förfrågan godkänner du att vi behandlar uppgifterna enligt vår integritetspolicy.` with link.

Submit button: `Skicka förfrågan`.

## 12.3 Photo handling

Vercel request body limit is **4.5 MB**. Resend attachments can be larger, but the function never sees files that big if they arrive in the POST.

Plan:

1. `accept="image/jpeg,image/png,image/webp"`  
2. Optional small client script: compress each image to JPEG, longest edge 1600px, target ≤ 800–1000 KB.  
3. Server: reject if count > 3, MIME not in allowlist, magic-bytes sniff if practical, each file > 1.2 MB, or total multipart > ~3.5 MB.  
4. Attach to the owner email as files (`filename: foto-1.jpg`). **Do not store** in Vercel Blob / S3 at launch. The mailbox is the record.  
5. Privacy policy: photos may show registration plates / surroundings; retained in email only as long as needed to perform the job.

If compression JS fails, native file input still works as long as the user picks small photos; show helper text: `Gärna 1–3 bilder, max ca 1 MB styck.`

## 12.4 Spam protection (layered, low friction)

1. **Cloudflare Turnstile** (managed / invisible). Privacy-friendlier than checkbox captchas; free. Verify `https://challenges.cloudflare.com/turnstile/v0/siteverify` server-side with IP if available.  
2. **Honeypot** `company`.  
3. **Time trap** `startedAt`.  
4. **Server validation** (reject garbage).  
5. **No public API key** for Resend.

Skip rate-limit infrastructure (Redis/Upstash) at launch. Add only if abused. Vercel Firewall / Turnstile will stop almost all bots at this scale.

## 12.5 Email delivery

**Owner email (to `[EMAIL]`):**

Subject: `Förfrågan: {trailerType} — {name}`  
Body (plain text + simple HTML): all fields, timestamp, user agent optional.  
`reply_to`: visitor email if provided, else omit.  
From: `Släp & Trailer Värmdö <forfragan@…>` on a **verified Resend domain** (the site domain). Until DNS is ready, Resend onboarding domain is OK for preview only — **not** production.

**Visitor auto-reply:** skip at launch (more GDPR surface, more “this is a bot” feel). `/tack` is enough.

Log Resend errors server-side; never echo API errors to the client.

## 12.6 Validation rules (server is authoritative)

Reuse `src/lib/validation.ts` so rules are documented in one place.

- Trim all strings  
- Phone: after stripping spaces/dashes, match a pragmatic Swedish pattern; do not require a perfect Liber checksum  
- Email optional  
- Strip control characters from message  
- Do not render visitor HTML in the owner email — escape  

## 12.7 Success / error UX

**Success:** HTTP 303 `Location: /tack`. `/tack` copy:

> Tack. Vi har tagit emot din förfrågan och hör av oss så snart vi kan.  
> Behöver du få tag på oss direkt? Ring **[PHONE]**.

**Validation error:** 303 back to `/kontakt?fel=1` is a poor experience if they submitted from a service page. Better:

- API responds `400` with JSON if `Accept: application/json` (JS fetch path)  
- Otherwise `303` to the `Referer` path + `#forfragan` + `?fel=validering`  
- `ContactForm` reads `Astro.url.searchParams` and shows: `Kontrollera namn, telefon och beskrivning.`

**Turnstile / spam:** generic `Vi kunde inte skicka formuläret. Ring oss på [PHONE] eller försök igen.`

**Server / Resend down:** HTTP 500 page or same generic error + phone. Never lose the “call us” escape hatch.

**JS enhancement (optional, small):** `fetch` with `FormData`, disable submit button, announce status with `role="status"`. If fetch fails, fall back to phone.

No toast libraries. No modal.

## 12.8 Environment variables

```
PUBLIC_SITE_URL=
RESEND_API_KEY=
CONTACT_TO_EMAIL=
CONTACT_FROM_EMAIL=
TURNSTILE_SECRET_KEY=
PUBLIC_TURNSTILE_SITE_KEY=
PUBLIC_PLAUSIBLE_DOMAIN=          # optional
PUBLIC_GOOGLE_ADS_ID=             # optional
PUBLIC_GOOGLE_ADS_CONVERSION_LABEL=  # optional, form conversion
```

Preview deployments may send to a test inbox (`CONTACT_TO_EMAIL` per environment).

---

# 13. Analytics / conversion tracking

## 13.1 Recommended minimal setup

| Tool | Role | Cookies | Consent |
|---|---|---|---|
| Vercel Analytics | Traffic + Web Vitals | No (default) | Not required |
| Plausible | Pages + events | No | Not required |
| Google Ads tag | Ads conversions | Yes (typical) | **Required in Sweden** if used |
| GA4 | — | — | **Do not install at launch** |

This avoids a sitewide cookie banner while still measuring what the owner cares about.

## 13.2 Plausible events

- `tel_click` — all `PhoneLink` / sticky Ring  
- `cta_boka` — Boka service that jumps to form  
- `form_submit` — fire on `/tack` (pageview of `/tack` may be enough; a dedicated event is clearer)

Goals in Plausible UI: those three + `/tack` pageviews.

## 13.3 Vercel Analytics

`@vercel/analytics` in `BaseLayout`. Web Analytics in the Vercel project. Speed Insights optional (can add a small JS); **skip Speed Insights at launch** if we want the smallest possible JS. Vercel Analytics pageviews are enough; Lighthouse in QA covers lab CWV.

## 13.4 Google Ads (optional flag)

If `PUBLIC_GOOGLE_ADS_ID` is unset: inject nothing.

If set:

1. Show a **minimal** consent bar only for advertising measurement (not a CMP product):  
   Swedish copy: *Vi vill mäta om våra annonser leder till samtal och förfrågningar. Godkänn* / *Avvisa*. Equal visual weight.  
2. Persist `ads_consent=1|0` in `localStorage`.  
3. Load `gtag` only when `1`.  
4. Fire `ads_conversion` on `/tack`.  
5. Optional: conversion on `tel:` click with a separate label.

Do **not** use Cookiebot. Do **not** pre-tick accept. Do **not** load Google tags before consent.

Call-only campaigns can use Google’s own call reporting without the website tag; still prefer website call + form tracking when the site is the landing page.

## 13.5 What we will not do

- Facebook/Meta pixel  
- Hotjar / session replay  
- Tag Manager soup  
- Enhanced ecommerce  
- Cross-domain tracking  

---

# 14. Structured data

Emit JSON-LD in the layout (global business entity) plus page-specific graph nodes. One `@id` for the business: `${site.url}/#business`.

## 14.1 Type choice

**Use `AutomotiveBusiness`.**

Reasoning:

- Google: use the most specific `LocalBusiness` subtype that is accurate.  
- `AutoRepair` = “Car repair business” — **inaccurate** (no car repair claimed).  
- `AutoBodyShop` = too narrow (welding only).  
- `MotorcycleRepair` = wrong.  
- There is no `TrailerRepair` type.  
- `AutomotiveBusiness` = “Car repair, sales, or parts” — still car-worded, but it is the honest parent for a road-vehicle equipment workshop (trailers), and it is a Google-supported Local Business subtype.  
- Do **not** also claim `AutoRepair` in a `@type` array.

`description` and `name` must make the trailer focus explicit so the type is not interpreted as a car workshop.

`parentOrganization`: `[COMPANY_NAME] AB` with `taxID`: `[ORG_NUMBER]`.

## 14.2 Global `AutomotiveBusiness` (all indexable pages)

Required (Google): `name`, `address`.

Also include:

- `url`, `telephone` (E.164), `image` (workshop photos when they exist)
- `geo` (5+ decimals)
- `openingHoursSpecification`
- `priceRange` only if true; otherwise omit (do not invent `$$`)
- `areaServed`: `Värmdö`, `Nacka`, `Gustavsberg`, `Ingarö` as `AdministrativeArea` / `City`
- `parentOrganization`
- `hasMap`: `[MAPS_DIRECTIONS_URL]`
- `sameAs`: GBP URL and real social profiles only

Do **not** include `aggregateRating` or `review`. Google’s Local Business `review` field is for sites that review *other* businesses; self-serving review markup is a guideline risk anyway.

## 14.3 `Service` (service pages + optional home list)

On each service page:

```json
{
  "@type": "Service",
  "name": "…",
  "serviceType": "…",
  "provider": { "@id": "https://…/#business" },
  "areaServed": ["Värmdö", "Nacka"],
  "url": "https://…/hjullager-slapvagn"
}
```

Do not add `offers` / prices unless real prices exist.

Homepage may include `hasOfferCatalog` with the six services **or** skip catalog markup to keep JSON-LD small. Prefer listing `makesOffer` as six `Service` nodes with `@id`s matching the pages. Keep it accurate and short.

## 14.4 `BreadcrumbList`

On all pages except home:

`Hem > [Page]`  
Service example: `Hem > Hjullager och nav`

## 14.5 `WebSite`

Optional on homepage only: `WebSite` with `name`, `url`. **No** `SearchAction` (there is no site search).

## 14.6 Do not implement

- `FAQPage` (Google FAQ rich results retired 7 May 2026; visible FAQs remain)  
- `QAPage` (not a forum)  
- `HowTo` unless a genuine step-by-step guide is added later  
- `Product`  
- Fake `OpeningHours`  
- `AutoRepair`

Validate with Google Rich Results Test (Local business) and schema.org validator.

---

# 15. Performance plan

Target: Lighthouse Performance ≥ 95 on mobile for homepage and a service page, in lab conditions with production build.

## 15.1 Images

- Store in `src/assets/photos`, use `import` + `<Image />` from `astro:assets`
- Formats: AVIF/WebP where Astro emits them, fallback as configured
- Hero: explicit `width`/`height`, high `priority` / no lazy on LCP image only
- Below-fold: `loading="lazy"` `decoding="async"`
- Card images: fixed aspect ratio to avoid CLS
- OG image is separate; not the LCP image
- Compress sources before commit (do not check in 8k phone dumps)

## 15.2 Fonts

- Two weights max (400, 600 or 700)
- `font-display: swap`
- Preload the woff2 used by the H1 if it is not system UI
- latin-ext subset

**Typography direction:** system UI for body is acceptable and fastest. If a webfont is used, **IBM Plex Sans** (industrial, not SaaS-rounded) or **Archivo**. Do not use Inter, Geist, or display serifs.

## 15.3 JavaScript budget

Allowed on first load:

- Tiny header/menu script (or `<details>`-based mobile nav with almost no JS — prefer **details/summary or a few lines** over a framework)
- Turnstile on pages with a form
- Plausible script (`defer`)
- Vercel Analytics (small)

Not allowed: carousels, parallax, GSAP, icon JS libraries, cookie CMP at launch, Google Maps JS API, React.

Prefer CSS for the mobile drawer if possible; if JS is needed, load it with `defer` and keep it under a few KB.

## 15.4 CSS

- Tailwind with content paths limited to `src/**`
- No huge icon font
- Avoid `backdrop-filter` and large box-shadows

## 15.5 Hosting

- Static files on Vercel CDN
- One serverless function, cold start acceptable for forms
- Cache-Control for hashed assets is automatic

## 15.6 Layout stability

- Reserve sticky bar height as `padding-bottom` on `body` for mobile
- Reserve header height
- Form file input must not jump the page

## 15.7 Third parties

Turnstile only where the form exists. Plausible from `plausible.io` or a custom proxy later if desired (not required at launch).

---

# 16. Accessibility plan

Target **WCAG 2.2 AA** where practical.

## 16.1 Structure

- Landmark: skip link “Hoppa till innehåll”, `header`, `nav`, `main`, `footer`  
- One H1; H2 for sections; never skip levels for style  
- Lists for services and FAQs  
- Language: `<html lang="sv">`

## 16.2 Keyboard and focus

- Visible `:focus-visible` rings (token colour, 2px+, not `outline-none` globally)  
- Mobile nav: focus trap, Escape closes, return focus to toggle  
- Sticky bar does not hide focused form controls (hide on focus)  
- `CTAButton` as link vs button correctly (no `<div onclick>`)

## 16.3 Forms

- Visible `<label>` for every control (placeholder is not a label)  
- `aria-describedby` for hints and errors  
- Errors associated with fields, not only a banner  
- Required fields indicated in text (“obligatorisk”), not colour alone  
- Select has a default “Välj typ av släp” option that is invalid on submit  

## 16.4 Contrast and motion

- Text vs background ≥ 4.5:1; large text 3:1  
- Buttons: do not use low-contrast rust-on-olive without checking  
- `prefers-reduced-motion: reduce` disables transitions  

## 16.5 Images and names

- Informative photos: Swedish alt (`båttrailer på ramper i verkstaden`)  
- Decorative gallery extras: empty alt only if truly decorative  
- SVG icons in buttons: `aria-hidden` + text, or `aria-label` if icon-only (`Ring`)

## 16.6 Target size (2.2)

- 24px minimum, 44px preferred for call/CTA  

## 16.7 Testing

- Keyboard-only pass on home, a service page, form submit path  
- VoiceOver or NVDA spot-check of nav + form  
- axe / Lighthouse a11y on home + form page  
- Zoom 200% — no overlapping sticky bar destroying content  

---

# 17. Legal / privacy considerations

Not legal advice. Swedish/EU local service site, B2C.

## 17.1 Company identification

Footer on every page:

`Släp & Trailer Värmdö är ett varumärke som drivs av [COMPANY_NAME] AB, org.nr [ORG_NUMBER].`

Plus address, email, phone. That covers the practical need to identify the trader.

## 17.2 Privacy policy (Swedish page)

Must explain:

- Personuppgiftsansvarig: `[COMPANY_NAME] AB`, address, `[EMAIL]`  
- Data: name, phone, email, reg number, trailer type, message, photos, technical metadata (IP only if Turnstile/logs require it — minimise)  
- Purpose: answering the request and performing the job  
- Legal basis: **åtgärder innan avtal** (GDPR art. 6.1.b) and/or **berättigat intresse** to reply to a request. Do not claim consent as the basis for the form unless the copy is true consent. The “godkänner du…” line is transparency + link, not a marketing opt-in.  
- Recipients: Resend as processor (email delivery); Cloudflare (Turnstile); Vercel (hosting). Name them.  
- Transfers: US processors (Resend, Vercel) — mention SCC/DPF as applicable at implementation time; do not invent.  
- Retention: e.g. emails kept as long as needed for the job and bookkeeping, then deleted  
- Rights: access, rectification, erasure, complaint to IMY  
- No sale of data, no newsletter at launch  

## 17.3 Cookies / LEK

Sweden (LEK 9:28): non-essential cookies need **prior** opt-in. No analytics cookie exemption like some EU countries.

**Launch path without banner:** no GA4, no Ads tag, no map iframe, no marketing pixels. Plausible + Vercel Analytics without cookies. Turnstile may set a cookie required for security — treat as strictly necessary if used only to protect the form; mention it in the privacy policy.

**If Google Ads tag is enabled:** first-layer accept **and** reject, equal prominence, no pre-ticked boxes, tags blocked until accept.

Do not ship Cookiebot “for safety” — it adds cookies and friction.

## 17.4 Photos

License plates are personal data. Purpose-limit them. Do not publish customer photos on the site.

## 17.5 Accessibility / marketing claims

Do not claim “bästa släpvagnsverkstaden i Stockholm”. Do not claim official Besiktningsbolaget status.

## 17.6 Form without accounts

Correct. No profiles, no passwords.

---

# 18. Content needed from the business owner

## 18.1 Blocking for launch

- [ ] Legal company name  
- [ ] Organisation number  
- [ ] Public phone  
- [ ] Public email  
- [ ] Full visiting address  
- [ ] Coordinates (or a Maps pin to derive them)  
- [ ] Opening hours, including weekend/holiday reality  
- [ ] Confirmation: drop-off only vs pickup  
- [ ] Confirmation: can boat service and trailer service happen in the same visit?  
- [ ] Which trailer types they **refuse** (e.g. heavy HGV trailers, caravans) — do not advertise what they will not do  
- [ ] Welding limits (structural chassis vs brackets)  
- [ ] 5–15 real photos: facade, bay, trailer on stands, bearing/brake work, boat trailer rollers, welding (if they want it shown)  
- [ ] Whether a logo exists (file: SVG/PNG)  
- [ ] Domain DNS access for Vercel + Resend SPF/DKIM  
- [ ] Google account for GBP + Search Console + Ads  

## 18.2 Strongly desired

- [ ] Existing brand colours  
- [ ] Photos of typical jobs (before/after later)  
- [ ] Example turnaround times (“ofta samma dag / inom X dagar”) only if true  
- [ ] Payment methods if they want them listed  
- [ ] Link to boat-company site  
- [ ] Facebook/Instagram if actively used  
- [ ] Any already-written service descriptions to preserve voice  

## 18.3 Not required

- Price list  
- Reviews  
- Staff bios  
- Stock photos  
- English copy  

---

# 19. Implementation phases

Each phase has tasks and acceptance criteria. Do not start a later phase until the previous criteria pass, except where noted (copy placeholders can remain until Phase 8).

---

### Phase 1 — Project setup and design foundation

**Tasks**

- `npm create astro@latest` (empty / minimal, TypeScript, no framework)  
- Add Tailwind, Vercel adapter, sitemap  
- `output` static; adapter configured  
- `src/styles/global.css` with CSS variables (palette direction below)  
- Self-hosted font  
- `src/data/site.ts` + `services.ts` stubs with placeholders  
- `.env.example`  
- `vercel.json` security headers  
- README: install, `npm run dev`, env vars  
- 404 page  

**Acceptance**

- `astro check` / `tsc` clean  
- `npm run build` produces static pages  
- Tokens exist; changing `--color-accent` in CSS changes buttons  
- No React dependency in `package.json`

---

### Phase 2 — Global layout and components

**Tasks**

- `BaseLayout`, `Seo`, `Header`, `MobileNav`, `Footer`, `StickyMobileCTA`, `PhoneLink`, `CTAButton`  
- Accessible mobile nav  
- Footer legal line  
- Skip link  

**Acceptance**

- Keyboard can open/close menu  
- Phone links use `site.phoneE164`  
- Sticky bar only below `md` and has safe-area padding  
- Layout looks workshop-like, not a SaaS landing (no gradient hero, no glass nav)

---

### Phase 3 — Homepage

**Tasks**

- Implement Section 5 structure  
- `ServicesGrid`, `BoatUSP`, `HowItWorks`, `LocationBlock`, `WorkshopGallery`  
- Real images if available; otherwise solid colour placeholders **labelled as temporary**, not stock photos  

**Acceptance**

- All homepage sections present in the specified order  
- `#forfragan` exists (form can be a non-wired dummy until Phase 5, but visually complete)  
- Internal links to all service slugs (pages may 404 until Phase 4 — or stub pages)  
- Mobile: hero CTAs tappable without zoom  

---

### Phase 4 — Service pages

**Tasks**

- `[slug].astro` + `getStaticPaths`  
- Shared template: compact hero, symptoms, what we do, FAQ, related, form anchor  
- Fill Swedish copy in `services.ts` from Section 4  
- Breadcrumb component or inline nav  

**Acceptance**

- Six URLs resolve  
- Each has unique title, description, H1  
- No lorem ipsum  
- Related links do not point to self  

---

### Phase 5 — Form and contact

**Tasks**

- `ContactForm` + `/api/contact` + `/tack` + `/kontakt`  
- Resend + Turnstile  
- Client image compression script (optional but recommended)  
- Error query handling  
- Privacy sentence + `/integritetspolicy` first draft  

**Acceptance**

- Preview deploy: submit a real test lead to a test inbox with and without photos  
- Honeypot / empty Turnstile rejected  
- Success lands on `/tack` with `noindex`  
- Works with JS disabled except Turnstile (document this limitation)  
- Validation errors shown in Swedish  

---

### Phase 6 — SEO and schema

**Tasks**

- Sitemap, robots, canonical, OG  
- `schema.ts` builders  
- Favicons  
- Default OG image  
- `404.astro` useful in Swedish  

**Acceptance**

- Rich Results Test: Local business on `/` and `/kontakt`  
- No FAQPage, no Review  
- Sitemap omits `/tack`  
- `curl -I` shows security headers on production/preview  

---

### Phase 7 — Analytics

**Tasks**

- Vercel Analytics  
- Plausible snippet + event attributes  
- Ads tag behind env + consent **only if IDs provided**  

**Acceptance**

- Local/preview: Plausible debug or network shows events on tel click and `/tack`  
- No Google requests in the network panel when Ads env is unset  
- No cookie banner when Ads unset  

---

### Phase 8 — QA and deployment

**Tasks**

- Replace remaining placeholders  
- Lighthouse mobile on `/` and `/hjullager-slapvagn`  
- Keyboard + form + sticky bar on iOS Safari if a device is available  
- Connect `slapochtrailervarmdo.se` (or real domain)  
- Resend domain authentication  
- Search Console + GBP (owner)  
- README updated with production URLs  

**Acceptance**

- No `[COMPANY_NAME]`-style tokens visible in HTML  
- Form email arrives from the branded domain  
- `www` redirect works  
- Lighthouse a11y and performance in the green on the two URLs  
- Owner can complete the journey on a phone: find number in < 3 seconds, submit form  

---

# 20. Launch checklist

## Technical

- [ ] Production build on Vercel from `main`  
- [ ] Node 22  
- [ ] Env vars set on Production and Preview  
- [ ] Function region documented  
- [ ] Security headers: `Content-Security-Policy` (allow Turnstile, Plausible, Vercel analytics), `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `X-Frame-Options: DENY`, `Permissions-Policy` disabling camera/mic/geo  
- [ ] CSP updated if Ads later enabled  
- [ ] Trailing-slash policy consistent  
- [ ] Custom 404  
- [ ] `/tack` noindex  

## Content

- [ ] All placeholders gone  
- [ ] Swedish copy reviewed by a human (owner)  
- [ ] Services match what the shop actually does  
- [ ] Photos are real and licensed by the owner  
- [ ] Boat USP wording matches operations  
- [ ] Opening hours correct  

## SEO

- [ ] Titles/metas unique  
- [ ] Canonical domain chosen  
- [ ] Sitemap in Search Console  
- [ ] Robots.txt  
- [ ] JSON-LD valid  
- [ ] Internal linking complete  
- [ ] OG image  
- [ ] Favicon  

## Google Business Profile

- [ ] Claimed/verified  
- [ ] NAP match  
- [ ] Categories + services  
- [ ] Photos  
- [ ] Website URL  
- [ ] Review asking process (offline, after jobs)  

## Analytics

- [ ] Vercel Analytics on  
- [ ] Plausible domain live, goals saved  
- [ ] Ads tag off **or** consent working  

## Forms

- [ ] Test submission from production  
- [ ] Photos arrive  
- [ ] Spam: empty/honeypot fails  
- [ ] Owner knows which inbox to watch  
- [ ] Resend domain verified (SPF, DKIM, DMARC as appropriate)  

## Mobile testing

- [ ] iOS Safari: call, sticky bar, form, keyboard vs bar  
- [ ] Android Chrome  
- [ ] Thumb reach to Ring  
- [ ] No horizontal scroll  
- [ ] Tap targets  

## Accessibility

- [ ] Keyboard nav  
- [ ] Focus visible  
- [ ] Form labels  
- [ ] Contrast  
- [ ] Alt text  
- [ ] Reduced motion  

## Domain / DNS / Vercel

- [ ] Apex + www  
- [ ] HTTPS  
- [ ] Preview vs production env  
- [ ] GitHub integration  

## Search Console

- [ ] Verified  
- [ ] Sitemap submitted  
- [ ] Homepage inspected  

---

# Appendix A — Design system (implementation tokens)

Not a final brand. Easy to retune via CSS variables.

## A.1 Direction

Workshop + harbour practicality: concrete, oil, painted steel, rope — **not** yacht lacquer, **not** SaaS indigo, **not** dealership chrome gradients.

## A.2 Palette (starting tokens)

```css
:root {
  --color-bg: #f3efe8;          /* warm concrete */
  --color-bg-elevated: #fffcf7;
  --color-ink: #1c1e1b;         /* greasy charcoal */
  --color-ink-muted: #4f554d;
  --color-line: #d4cfc4;
  --color-accent: #2f4a43;      /* dark marine green, headers/links */
  --color-cta: #b54724;         /* oxide / workshop orange for primary buttons */
  --color-cta-ink: #fffaf6;
  --color-focus: #1c5c8c;
}
```

Primary **actions** use `--color-cta` (call/book). Accent green is identity, not the only button colour — a rust CTA reads more “verkstad” than a teal SaaS pill.

If the owner supplies colours, replace these three: `--color-accent`, `--color-cta`, `--color-bg`.

## A.3 Type

- Body: `system-ui, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif` **or** IBM Plex Sans  
- Headings: same family, semibold; slightly tighter tracking  
- Max measure: ~38rem for body  
- Modular scale: 14 / 16 / 18 / 24 / 32 / 40 — no 72px hero type on mobile  

## A.4 Spacing

Tailwind default scale. Section padding: `py-12 md:py-20`. Avoid `py-32` empty luxury.

## A.5 Buttons

1. **Primary:** filled CTA rust, radius `4px` or `6px` (not `9999px`)  
2. **Secondary:** outline on ink/accent  
3. **Phone:** same as primary on mobile sticky; on desktop can be the outline + phone icon  

No shadows, no gradient fills, no bounce hover. Hover: slight darken. Active: translateY(1px) optional.

## A.6 Cards

1px `--color-line` border, `--color-bg-elevated` fill, no shadow. Image on top, text, no “Learn more →” startup pattern — the card title is enough.

## A.7 Icons

Inline SVG, 24px stroke 1.75, currentColor. Custom simple: phone, wrench, trailer, waves (boat). **Do not** add Lucide as a runtime package; if needed, copy 8 SVGs into `src/components/icons/`.

## A.8 Photography

Documentary, available light or workshop fluorescent, real dirt OK. Crop tight on parts (hub, roller, weld) for service cards. Wide shot of the yard for location. Avoid handshakes, headset operators, and aerial archipelago clichés.

## A.9 Mobile nav

Full-screen or 100% width drawer from top/right, solid `--color-bg-elevated`, large tap rows, phone repeated at the top of the drawer.

## A.10 Footer

4 bands on desktop: brand blurb (2 lines), services, contact, legal. Mobile stacked. Darker than page (`#242821` background, light text) is acceptable if contrast holds — alternatively keep light footer to stay humble. Prefer **light footer** to avoid “agency dark slab”.

---

# Appendix B — Security notes

- Validate and size-limit uploads; never `eval` or store files on the public web  
- Resend key only on the server  
- CSP: `form-action 'self'`; Turnstile domains per Cloudflare docs  
- Dependencies: `npm audit` at launch; few packages (astro, tailwind, vercel adapter, resend, maybe nothing else)  
- Turnstile secret never `PUBLIC_`  
- Do not log full form bodies in Vercel logs (reg numbers + phones)  
- Rate limiting later if needed; Turnstile first  

---

# Appendix C — Future extensibility (do not build now)

| Later feature | How the current design absorbs it |
|---|---|
| More services | New object in `services.ts` |
| Price list | `priceHint` or `/priser.astro` reading the same module |
| Gallery | `WorkshopGallery` + new page; still static images |
| Reviews | Section component behind `site.reviews.length > 0`; link out to GBP rather than scraping |
| Online booking | Still a form; extra fields. Not Cal.com unless asked |
| Second location | `site.locations[]` would require a small refactor — acceptable later |
| Blog | Then add content collections |

Do not add `locations[]` or a review type now.

---

# Appendix D — Copy tone (for the implementing writer)

Write as a mechanic talking to someone with a trailer on the drive.

**Yes:** “Om lagret brummar eller hjulet glappar ska du inte dra släpet. Ring oss.”  
**No:** “Vårt team av experter levererar premium-service dygnet runt.”

Short sentences. Name the part. Name Värmdö. Offer the phone number.

---

# Appendix E — Homepage vs deleted hub page

Ads group “Local service” lands on `/`. Organic queries for `släpvagnsservice värmdö` should also land on `/`. If Search Console later shows cannibalisation (it should not, because the extra URL is gone), adjust titles — do not resurrect `/slapvagnsservice-varmdo` without a redirect strategy.

If a stakeholder insists on that URL for “pretty” Ads paths, implement it as a **301 to `/`**, not as a second page.

---

*End of plan. Implement in the phase order in Section 19. Do not expand scope without updating this document.*
