# Kyle & Co Website Rebuild — Design Handoff

> **For Claude Code:** read this README end-to-end before touching anything else. It's self-sufficient. Everything you need to ship four production-ready pages is referenced here.

---

## What this is

A design audit and four high-fidelity HTML mockups for the Kyle & Co website rebuild. The mockups are **design references** — not production code. Your job is to recreate them as the four real pages of the live site, matching the structure, components, brand language, and copy.

Four pages in scope:

| Page | Persona register | Accent dot |
|---|---|---|
| `home.html` | The brand | cream |
| `research.html` | The archive | sky blue |
| `practitioners.html` | The room | cream |
| `vendors.html` | The boardroom | lilac |

`home.html` already exists in the codebase. The other three don't yet. Build all four in one pass.

---

## Fidelity

**Hi-fi.** Pixel-perfect mockups with final colors, type, spacing, components, and copy. Match them directly. The stylesheet in `assets/site.css` is the canonical token + component reference — use it as the foundation.

Two things in the mockups are audit chrome and must be stripped from the production pages:

1. The numbered **orange annotation pins** (the small circles with numbers on every page). They open a sidebar in the audit. Production has none of this.
2. The **callout sidebar JS** (`assets/audit.js`, the `<script>` block defining `window.KC_CALLOUTS`, the `<aside>` markup at the bottom of each page). Remove all of it.

Everything else — the topbar, the hero structure, the section components, the kc-pp profile pictures, the engagement cards, the testimonial cards, the team grid, the council section, the closer CTA, the footer — is production. Lift it.

---

## What's in this folder

```
design-handoff/
├── README.md                  ← you are here
├── mockups/
│   ├── home.html              ← Home — the brand
│   ├── research.html          ← Research — the archive
│   ├── practitioners.html     ← Practitioners — the room
│   └── vendors.html           ← Vendors — the boardroom
└── assets/
    ├── site.css               ← Global tokens + components. Canonical.
    ├── audit.css              ← Audit-only chrome (annotation pins + sidebar). Don't ship.
    ├── audit.js               ← Audit-only chrome JS. Don't ship.
    ├── colors_and_type.css    ← Lower-level design system tokens (imported by site.css)
    ├── fonts/                 ← Fraunces variable + Roboto family TTFs
    └── img/
        ├── icon-ampersand.svg ← The brand glyph. Used as corner watermark.
        ├── logo-primary.svg, logo-primary-negative.svg
        ├── mark-6.svg → mark-11.svg ← Deconstructed ampersand corner shapes
        ├── accent-1..4.png    ← Hand-drawn flowing-line accents
        ├── pattern.png        ← Ampersand pattern (tile-safe, use tone-on-tone only)
        ├── pp-cream.png, pp-lilac.png, pp-navy.png ← Profile-picture background swatches
        ├── people/
        │   ├── kyle.png, brandice.jpg, matt.jpg, jake.jpg  ← team
        │   ├── birch.jpg, katie.jpg                        ← testimonial portraits
        └── events/
            ├── council-kickoff.jpg   ← HCAIC kickoff wide shot, used in council section
            └── transform-meetup.jpg  ← available for vendors-page activation slot
```

---

## Brand foundations — the tokens

All defined in `assets/site.css`. Don't invent new values; use these vars.

### Colors

```css
--navy:        #273752  /* primary anchor, body text on light, CTAs */
--navy-dark:   #1A2438
--lilac:       #9D92AD  /* italic display type, accents */
--ivory:       #F7F1EA  /* default page background (NOT white) */
--ivory-warm:  #F1E9DE
--cream:       #FDECCD  /* highlight panel, persona accent */
--cream-deep:  #F5DDA6
--slate:       #555961  /* secondary text */
--sky:         #9AB8DC  /* Research persona accent */
--red:         #D9342B  /* signal red, "live" labels only — never decorative */
--white:       #FFFFFF  /* card surface, not page bg */
```

Default page background is **ivory sand** (`#F7F1EA`). White is a surface on top.

### Type

- **Display:** Fraunces (variable serif). Weights 400 (subheads) / 600 (headings). `font-variation-settings: "SOFT" 50, "WONK" 0`. Italic Fraunces in lilac is the signature highlight.
- **Body:** Roboto. Light 300, Regular 400, Medium 500, Bold 700. Body runs Regular 16px / 1.55 line-height.
- **Mono micro-type:** JetBrains Mono 400/500. Used for eyebrows (≤ 0.72rem, letter-spacing 0.22em, all caps). Always pair with a 7px pulse-dot in the persona color when it's a live eyebrow.

### The italic-lilac phrase

The brand's signature move. Every H1 and every H2 ends with one italicized phrase in lilac:

```html
<h1>The research firm built with <em>HR practitioners.</em></h1>
```

```css
h1 em, h2 em { font-style: italic; color: var(--lilac); font-weight: 400; }
```

On dark backgrounds, italic phrases are cream instead of lilac. On Practitioners page, alternate cream/lilac so they don't all read identical.

### Spacing, radius, shadow

- 4px base grid. Cards have generous whitespace; the brand is calm, not dense.
- Radii: cards 12px (`--r-md`) or 20px (`--r-lg`), CTAs full pills (100px), avatars perfect circles.
- Shadows: low-opacity navy-tinted. Five steps `--shadow-xs` → `--shadow-xl`. Never black.

### Animation

- Easing: `cubic-bezier(0.22, 1, 0.36, 1)` (ease-out expo).
- Timing: 0.2s for micro-interactions, 0.35–0.45s for larger transitions.
- Reveal: 0.85s with `translateY(18px) → 0` + fade.
- Live pulse-dot: 7px, scale 1 → 1.2, opacity 1 → 0.55, 2.2s infinite.
- No bounces, no springs, no scale-down on press.

---

## The six brand components (reused everywhere)

Defined in `site.css` under their own section markers. **Use these. Do not redo their styling.**

### 1. Topbar (`.topbar`)
Fixed nav. Background `rgba(247,241,234,.92)` + `backdrop-filter: blur(16px)` on scroll. Brand mark left, links center, primary CTA right.

### 2. Hero pattern (`.hero-*`)
The chosen direction is **Restrained Editorial** (Direction C in the audit). Every page hero shares this chrome:

- Ivory canvas
- 56×56px navy grid overlay at 3.5% opacity (`background-image` of two linear-gradients)
- Oversized Fraunces H1, `clamp(2.75rem, 6vw, 5.25rem)`, line-height 0.98, letter-spacing -.022em
- Italic-lilac phrase on the second line
- JetBrains Mono eyebrow with a 7px persona-colored pulse-dot
- One ampersand glyph bleeding off the bottom-right corner at 6% opacity (`<img class="corner-mark" src="icon-ampersand.svg">` positioned absolutely)
- Persona-colored dot is the only thing that differs between pages

### 3. Profile picture (`.kc-pp`)
A photo on a brand-color square. Two sizes: large (team) and small (testimonials).

```html
<div class="kc-pp bg-navy">
  <div class="kc-pp-img" style="background-image:url('assets/img/people/kyle.png');"></div>
</div>
```

Color variants: `.bg-navy`, `.bg-cream`, `.bg-lilac`. When there's no photo, fall back to a Fraunces-italic initial:

```html
<div class="kc-pp bg-lilac"><div class="kc-pp-initial">A</div></div>
```

### 4. Editorial blog card (`.kc-blog-card`)
The "Build vs Buy" stacked-block style. Title broken across navy / sky / cream / lilac horizontal blocks. Used for Research featured cards and Practitioners featured-research cards.

### 5. Cream highlight panel (`.kc-cream-panel`)
Wraps a single argument in cream so it lifts off the page. One per page, max.

### 6. Corner brand mark
`<img class="corner-mark" src="assets/img/icon-ampersand.svg">` absolutely positioned in the bottom-right of dark sections (council, closer, vendors hero) at 6–8% opacity. One per major section. **Never as pattern wash.**

---

## Page-by-page

Open the mockup file for the full structure. Quick map below.

### `home.html` — The brand
- Hero (ivory + grid + ampersand corner, cream pulse-dot)
- Logo band (10 vendor logos in two scrolling rows)
- 4-up differentiators block
- Methodology section (left text, right stats column)
- 4-up engagement-buckets section (Underwrite, Drive a moment, Build research, Thinking partner)
- Council section (navy, with HCAIC kickoff photo + italic caption + 4-up pillar grid)
- Testimonials (3 cards, italic Fraunces quote, photo avatars on lilac/navy/cream squares)
- Team grid (4 photos: Kyle/Brandice/Matt/Jake on navy/cream/lilac/navy)
- Closer CTA (ivory, with brand-mark corner)
- Footer

### `research.html` — The archive
- Hero (sky pulse-dot, 4-tile collage right side)
- Methodology section (top of page — Research's signature opener)
- Featured research card grid (6 cards, blog-card style, top-border tag color per category)
- Research library (filtered archive with topic chips)
- Transformation Realness podcast section (latest-episode embed + archive link)
- Featured elsewhere (venue/appearance cards with Kyle inset)
- Recent analysis (auto-populated blog post grid)
- Newsletter signup ("Stay sharp. No spam. Just signal.")
- Soft advisory rail

### `practitioners.html` — The room
- Hero (cream pulse-dot, "Council applications open" signal pill below lede)
- Open access section (cards for AIMM, Compass, HCAIC Toolkit, recent reports)
- Methodology section (abbreviated)
- Three Ways In section (Read · Show up · Contribute — middle card has cream-panel highlight)
- **Faces of the Council** (NEW — 6–8 council member portraits on rotating brand-color squares; **images TBD, currently letter fallbacks**)
- Council teaser (ivory-warm, single ampersand)
- Org-level rail
- Newsletter signup

### `vendors.html` — The boardroom
- Hero (lilac pulse-dot, navy-dark canvas, Asset 9 mark as bleed accent)
- The shift section
- 4-up engagement buckets (Underwriting · Activations · Research · Advisory — lilac left-border accents, numbered)
- Methodology section (with cream-panel highlight)
- Proof section (vendor logo grid + 2 photo testimonials: Katie Fairbank, Birch Faber)
- Closer CTA (brand-mark corner, sharper geometry)

---

## Voice & content rules — hard

Source of truth: `../brandice-marketer-context.md` and `../Website-Copy-Handoff.md`.

- **Copy is locked.** Use verbatim. Do not paraphrase.
- **No em dashes.** Anywhere. Use periods, commas, colons, or restructure.
- **Banned words** — kill on sight: `actually`, `genuinely`, `truly`, `really`, `simply`, `just` (as filler), `hype`, `seamless`, `robust`, `leverage` (as verb), `unlock`, `unleash`, `synergy`, `journey`, `10x`, `game-changing`, `disruptive`, `cutting-edge`. Plus the longer kill list in Brandice's context doc.
- **Sentence case** for headlines. Title Case only for proper nouns (The Human-Centric AI Council, Kyle & Co, Cohort Zero Toolkit).
- **"Just signal"** is the brand line. Appears in footer and newsletter sign-up.
- **Tagline** "Where Research Meets Reality." is locked. Use as a mid-page brand motif, not the hero.
- **Second person** ("you/your") for body copy.
- **No emoji.** Not part of the brand.

---

## Photos — what's wired, what's not

Wired in the home mockup:

| Spot | File |
|---|---|
| Kyle in team grid | `assets/img/people/kyle.png` on navy square |
| Brandice in team grid | `assets/img/people/brandice.jpg` on cream square |
| Matt in team grid | `assets/img/people/matt.jpg` on lilac square |
| Jake in team grid | `assets/img/people/jake.jpg` on navy square |
| Birch Faber testimonial | `assets/img/people/birch.jpg` on lilac square |
| Katie Fairbank testimonial | `assets/img/people/katie.jpg` on navy square |
| Council section image | `assets/img/events/council-kickoff.jpg` with navy gradient (0% → 85%) |

Still on letter-initial fallback:
- **Annamarie Andrews** testimonial — source a headshot or keep the Fraunces-italic A.

Still TBD (not in this bundle):
- 6–8 council member portraits for the Practitioners "Faces of the Council" strip
- Vendors-page event imagery (Transform meetup jpg is available — wire as needed)
- Research-page report covers (design these in the `.kc-blog-card` stacked-block style as new reports ship)
- Research-page podcast/appearance imagery

The HEIC files in `Photos to use/` (Kyle speaking, Live event podcasting, Council kickoff alt) need conversion. On Mac:

```
sips -s format jpeg "Kyle Speaking.HEIC" --out kyle-speaking.jpg
```

---

## Interaction & behavior

- **Hover on cards:** `translateY(-3px)`, border shifts to lilac, shadow deepens one step.
- **Hover on links:** underline grows 0→100% width on a 1px line, OR color shifts to lilac. Never brightness.
- **Hover on resource rows:** left-pad shifts 1rem, trailing arrow translates 6px right.
- **Press:** no scale-down. Darker navy or opacity → 0.9.
- **Fixed nav:** background → `rgba(247,241,234,.92)` + `backdrop-filter: blur(16px)` on scroll.
- **Marquees:** 45s loop, left-to-right, steady, no pause. Used for logo strips.

No bounces, no springs. Motion is considered, like a well-written sentence.

---

## Top nav (every page)

```
Home   Research   For Practitioners   For Vendors   HCAIC   Blog   Contact   [Book a discovery call →]
```

"Book a discovery call" is the primary nav CTA. It's also the closer CTA on Home and Vendors, and the "Start a conversation" CTA on Practitioners + Research routes to the same booking flow.

---

## When you're done — self-review checklist

Before declaring complete, verify on every page:

- [ ] Hero has the 56×56 navy grid overlay at 3.5%
- [ ] Hero has the ampersand corner watermark at 6%
- [ ] Hero H1 has the italic-lilac phrase treatment
- [ ] Eyebrow is JetBrains Mono, 0.22em tracking, with a 7px pulse-dot in the persona color
- [ ] Persona accent is correct: cream on Home + Practitioners, sky on Research, lilac on Vendors
- [ ] At least one H2 per page has the italic-lilac phrase
- [ ] Profile pictures are real photos on brand-color squares (where photos are available)
- [ ] Council section has the HCAIC kickoff photo wired in with the navy fade overlay
- [ ] Top nav has all seven links + the Book a discovery call CTA
- [ ] Closer CTA exists and routes to discovery-call booking
- [ ] No em dashes anywhere in the rendered copy
- [ ] No banned words from Brandice's context doc
- [ ] No emoji
- [ ] No audit chrome (numbered pins, callout sidebar) leaked into the production pages
- [ ] Audit-only stylesheets (`audit.css`, `audit.js`) are NOT linked from the production pages

---

## Build directive — one pass

Build all four pages in a single pass. Don't stop after one and wait for feedback. The mockups are the design source of truth; if a detail is ambiguous, open the relevant mockup and lift the structure directly.

When all four pages render cleanly, the headshots are wired in, the voice rules are honored, and the self-review checklist passes, the rebuild is done.
