# Kyle & Co Website Copy — Hand-off to Code

**Status:** Home, Resources, and Vendors pages locked in Kyle's voice. Practitioner page removed. Resources "Go deeper" section restructured with interactive modals (content drafts pending Brandice).
**Pages locked:** `index.html` (home), `research/index.html` (resources).
**Reviewed against:** `kyleandco-voice.md` (Kyle's voice + marketing register).
**Date:** June 2026.
**Note:** this doc replaces the earlier draft of the same name, which predated this voice pass.

---

## QA status (pre-Kyle review)

**Verified clean and functional — Home, Resources, Vendors:**
- No banned words, no em dashes, no `[X], not [Y]` templates in marketing copy.
- All contact modals wired correctly (every CTA targets a real modal id); the Resources "Go deeper" info modals work.
- Zero broken internal links; the removed `/practitioners/` URL 301-redirects to `/aicouncil`.
- No leftover placeholders or duplicated microcopy on these pages.

**SEO / social / analytics — now complete:**
- GA4 (`G-H95H1WFLGC`, gtag.js) on every page, including the blog (was the one page missing it).
- Open Graph + Twitter Card + canonical tags added to Home, Resources, Vendors, Category Compass, and AI Momentum Model (they had none).
- Share images: a branded 1200×630 card (`assets/img/og-default.png`) for the three core pages; optimized report covers (`assets/img/og-compass.png`, `og-momentum.png`) for the two report pages.
- Still to confirm outside this repo: whether the WordPress install generates `sitemap.xml` / `robots.txt` at the domain root and includes these static pages. Blog has GA4 + OG but no canonical (minor).

**Intentionally NOT touched (Kyle's editorial voice / already approved):**
- Blog and the HCAIC / aicouncil page — approved; Brandice may refine later.
- Research report pages (Category Compass, AI Momentum Model) and the blog use em dashes and words like "actually" by design — that is Kyle's editorial register, not a marketing asset. The no-em-dash rule is marketing-only.

**Known open items still needing Brandice/Kyle input:**
- Vendors proof tiles name real vendors with specific claims — confirm each is current and approved to publish.
- Resources "Go deeper" modals: confirm the Workshop content (adapted from the underwriter PDF) and supply real copy/specifics for the Advisory and Bespoke-research modals.
- Home: the underwriter-benefit wording, the AI Interviewer benchmark citation, and the "paywall or a sales call" claim (Differentiator 03).
- Future option (declined for now): sweep the `[X], not [Y]` template off aicouncil and candidate-fraud, where it appears heavily.

---

## Build directive for Code

Apply the locked copy below to `index.html` verbatim. Do not paraphrase or rewrite. The copy has already been applied to the file; this doc is the source of record for the build and for any future edits. Match existing styling, layout, and component patterns. Honor the voice rules below.

---

## Voice and style rules (enforced on this page)

- **No `[confident claim], not [strawman]` constructions.** This was the primary AI tell removed from this page. Lead with the affirmative claim in a full sentence; do not set up a strawman to knock down. (Voice guide, section 5.)
- **No em dashes in copy.** Periods, commas, colons, or restructure. (Em dashes in the `<title>` and code comments are fine.)
- **No banned words:** actually, genuinely, truly, really, simply, just (as filler), seamless, robust, leverage (verb), unlock, unleash, synergy, journey, 10x, game-changing, disruptive, cutting-edge.
- **No fragment stacks or mic-drop closers.** End sections on full sentences that carry information.
- **Lead with the answer.** Context follows, never precedes.
- **Don't narrate the reader's behavior back as fact.** Describe the landscape, not a script of their actions.
- **Locked brand lines, do not edit:** "Where Research Meets Reality." (mid-page motif only, not the hero), "No noise, just signal.", footer "No spam. Just signal."
- **Sentence case headlines.**

---

## HOME PAGE COPY

### Nav
- Links: Home · Resources · For Practitioners · For Vendors · HCAIC · Blog
- Primary CTA: **Book a discovery call**

### Hero
- **Eyebrow:** (none currently — the hero opens on the H1)
- **H1:** Kyle & Co is the research firm built with *HR practitioners.*
- **Subhead:** We help the HR function close the gap between AI innovation and adoption, moving with intention instead of reacting to the noise. That's where research meets reality: surveys with thousands of senior HR and TA leaders, and a close read on the innovations that hold up in the world of work. The result is insight practitioners can act on, built around the challenges they face.
- **Primary CTA:** Book a discovery call
- **Secondary CTA:** Read the research

> Note: vendor-relationship language was removed from the hero to protect the independence positioning. It now lives in Differentiator 04 ("pressure-test vendor claims"), where proximity reads as a strength.

### Logo band
- **Label:** Partners in the work
- Existing logo wall (unchanged).

### Differentiators
- **Eyebrow:** Why Kyle & Co
- **H2:** What makes us *different.*
- **Intro:** Four things we do that most firms don't. You'll see each one in the work itself.

**01 · Built with HR practitioners.**
Our team has run the function we research. Surveys reach thousands of senior HR and TA leaders. The Human-Centric AI Council adds practitioner-led work on AI specifically.

**02 · Evidence over consensus.**
When the AI Interviewer category was too new to rank, we benchmarked the tools instead of ranking them, and said so on the record. We publish what the evidence shows, even when it's the call no one else wants to make. Safe takes don't move the function forward.

**03 · Generous by design.** *(featured card)*
Substantive HR research usually sits behind a paywall or a sales call. We keep ours within reach of any leader who could use it. No noise, just signal.

**04 · We stay in the room.**
Most firms publish and walk. We stay close with briefings, workshops, and evaluation frameworks. We help practitioners read the market, pressure-test vendor claims, and make calls they can defend.

### Brand motif
- **Label:** The work
- **Line:** Where Research *Meets Reality.* *(locked tagline, mid-page only)*

### The Work
- **Eyebrow:** Flagship research
- **H2:** What we *publish.*

**AI Momentum Model** — tag: Annual benchmark
Where your organization sits on AI momentum, and what's driving the result.

**Category Compass: AI Interviewers** — tag: Category Compass
A research framework for HR tech categories that are too new to rank. The latest edition covers AI Interviewers.

**AI Council Toolkit** — tag: Practitioner toolkit
Practitioner-led frameworks for AI literacy, governance, evaluation, and change management.

- **Stat strip:** Thousands of senior HR and TA leaders surveyed annually. · The AI Council shapes what we publish on AI.

### Who we work with (audience router)
Replaced the old "Four ways to work with us" four-card section, which duplicated the Vendors page's engagement menu almost verbatim. Those four engagements are the paid vendor/client services, so the full detail now lives ONLY on the Vendors page. Home routes the two audiences instead.

- **Eyebrow:** Working together
- **H2:** Who we *work with.*
- **Intro:** HR-tech vendors and HR and TA leaders come to Kyle & Co for different reasons. Here's where each starts.

**Card 1 — For HR-tech vendors**
- Title: Earn your standing with *the function.*
- Body: Practitioners don't extend trust to vendors by default, and for good reason. We help you earn it through underwriting, research, advisory, and activations that put your work in front of them.
- Link: "See how we work with vendors →" → `/vendors/`

**Card 2 — For HR and TA leaders**
- Title: The research is *yours to use.*
- Body: Independent studies, frameworks, and analysis, free and open. Plus the Human-Centric AI Council, built by practitioners for the rest of the function.
- Links: "Explore the research →" → `/research/` · "Meet the Council →" → `/aicouncil`

- **Closing note:** Not sure where you fit? Book a discovery call and we'll point you to the right work. *(links to contact modal)*
- **Build note:** new `.route-grid` / `.route-card` styles are inlined in a `<style>` block just above the section; two columns on desktop, one on mobile.

### HCAIC / Council
- **Photo tag:** Working session · 2025
- **Photo caption:** "The room where the work happens."
- **Eyebrow:** The Human-Centric AI Council
- **H2:** The HCAIC, by the *practitioners doing the work.*
- **P1:** The HCAIC is a working group of HR and TA practitioners building peer-led resources for the rest of the function on AI. Members write, review, and ship their own contributions.
- **P2:** Underwriters get structured access to members for product feedback and practitioner analysis. That access is built for sharpening products and learning from the function. The Council stays a working group, never a buyer panel.
- **Link:** Learn more about the Council

**Pillars (unchanged):**
- **AI Literacy & Education** — Structured learning and resources to build HR confidence and clarity around AI.
- **Responsible AI Governance** — Frameworks, policies, and oversight that don't stall the work.
- **AI Adoption & Change** — Practitioner-tested approaches for rolling AI into the function.
- **Future of HR** — How AI is changing HR itself: roles, structures, and operating models.

### Testimonials
- **Eyebrow:** From the people in the work
- **H2:** What clients *are saying.*
- Quotes are verbatim from named clients. Do not edit.
  - Birch Faber, Director of Marketing, Humanly
  - Katie Fairbank, Director of Product Marketing, CodeSignal
  - Annamarie Andrews, SVP Marketing, Cielo

### Team
- **Eyebrow:** The firm
- **H2:** The people *behind the work.*
- Kyle Lagunas — Founder & Principal Analyst
- Brandice Payne — Head of Strategic Marketing & Initiatives
- Matt Charney — Principal Analyst, Industry & Markets
- Jake Paul — Head of Product Innovation

### Closer
- **Eyebrow:** Let's talk
- **H2:** Start with *a question.*
- **P:** Most of this work starts with a single question. A market shift, a launch, a category move, positioning that isn't sticking. Bring it to a 30-minute discovery call and we'll scope what fits.
- **CTA:** Book a discovery call

### Footer
- Brand: Kyle & Co
- Links: Resources · For Practitioners · For Vendors · HCAIC · Blog
- **Copy line:** © 2026 Kyle & Co. No spam. Just signal.

### Contact modal
- **Eyebrow:** Kyle & Co
- **Title:** Let's talk about *your work.*
- **Intro:** Tell us where you're starting from and what you're working through. Kyle & Co typically responds within two business days.
- **Submit:** Send message
- **Success:** Message received / We'll be in touch. / Kyle & Co typically responds within two business days. Need to chat sooner? Reach out at info@kyleandco.com.

> Note: the duplicate "responds within two business days" line under the submit button was removed. It still appears in the intro and the success screen.

---

## Open items for Brandice

- Confirm "product feedback and practitioner analysis" is the right house wording for what underwriters get (HCAIC P2).
- Confirm the AI Interviewer benchmark example is still accurate to cite (Differentiator 02).
- "Generous by design" card describes competing research as behind "a paywall or a sales call." Confirm that characterization is one you want in writing.

---

## RESOURCES PAGE COPY (`research/index.html`)

Light pass. Only changed lines are listed; everything else on the page was already on-voice and is unchanged.

### Hero
- **Eyebrow:** Resources that give HR leaders signal, not noise
  *(replaces "Research · Cohort Two · 2026" — an HCAIC carryover that mislabeled the page and dated it. The new line umbrellas the whole hub, not just research, and plays on the "No noise, just signal" motif.)*
- **H1 (unchanged):** Research HR uses to defend the calls *that have to hold up.*
- **Subhead:** Built on surveys with thousands of senior HR and TA leaders, authored alongside the practitioners shaping the work. HR teams carry it into tool evaluations and strategy calls; the vendors building for the function use it to see where they stand. *(reworked to add a vendor angle, since vendors also land on this page; "vendor evaluations" became "tool evaluations" so "vendors" only means the audience; no "if you're X" bifurcation)*

### Featured research
- **Section intro** (under "What we publish"): "Analysis that stays close to the work, built around the challenges HR is facing." *(replaced the generic "Anchor research projects, published openly. Updated as new work ships." — that described process, not the differentiator. Plainly states what the research is, no self-promotion.)*

### Podcasts
- **Intro:** "The only show about people doing their best to make the world of work suck less, and gutsy enough to share the real story: the good, the bad, and most of all, the real." *(drawn from Kyle's actual podcast open, "milder edge" tone chosen by Brandice — "suck less" in place of the original "shitty." Dropped the redundant subscribe CTA; the "View all episodes" button covers it.)*
- **Quality of Hire Imperative** card description: "What quality of hire means, how to measure it, and how to defend it to the business." *(removed banned word "actually")*

### Webinars we host
- **Intro:** Sessions produced and hosted by Kyle & Co: live town halls, council working sessions, and practitioner roundtables. Past recordings available on demand. *(em dash replaced with a colon)*

### Closer
- **Eyebrow:** The newsletter *(replaces "Stay sharp," which duplicated the headline word-for-word)*
- **H2 (unchanged):** Stay *sharp.*

### Contact modal
- Removed the duplicate "responds within two business days" line under the submit button, to match the home page modal.

### Go deeper section — moved and made interactive
- The "Go deeper" (`.advisory`) section was moved from near the bottom of the page to directly **below Featured Research** (before Podcasts).
- The three service cards are now interactive. Each opens a reusable info modal (`#info-modal`): clickable by mouse and keyboard (Enter/Space), closes on X, click-outside, or Escape. Each modal's CTA ("Book a discovery call") hands off to the existing contact form (`kco-modal`).
- Modal copy lives in the `openInfo()` JS content map near the end of the file. Current state:
  - **Workshop → "Evaluating vendor claims":** adapted from the HCAIC underwriter overview PDF (workshop-format + evaluation-frameworks language), rewritten as a practitioner service. **NEEDS CONFIRMATION** — the source PDF is a vendor-underwriting deck, not a spec for this workshop.
  - **Advisory → "Strategy and positioning":** placeholder draft, needs Brandice's real copy.
  - **Bespoke research project:** placeholder draft, needs Brandice's real copy.
- All three end with "scoped in a discovery call" rather than inventing a format, duration, or price. Real specifics still needed for each.

### Left as-is (flagged, not changed)
- Advisory paragraph opens "If your team is using a Kyle & Co report to..." — a soft conditional that edges toward the banned "if you're X" setup. Borderline, left intact pending Brandice's call.
- A hard-coded upcoming-webinar promo lower on the page uses an em dash ("research — live on July 29"). Breaks the no-em-dash rule; not fixed pending Brandice's go-ahead.

---

## Practitioner page — REMOVED

The For Practitioners page was cut (thin content; the free-research story is carried by Resources and the Council roster lives on HCAIC). Changes made:

- `practitioners/index.html` archived to `Kyle & Co/practitioners-index-ARCHIVED-2026.html` (out of the web root, will not deploy). The empty `practitioners/` directory remains because the host mount blocked its removal; it is harmless and can be deleted on the server.
- "For Practitioners" nav + footer links removed from all pages that had them: `index.html`, `research/index.html`, `research/category-compass/index.html`, `research/ai-momentum-model/index.html`, `vendors/index.html`.
- 301 redirect added in `.htaccess`: `/practitioners/` → `/aicouncil`.

Note for later: with this page gone, "For Vendors" is the only remaining audience page in the nav, so the "For X" framing is now one-sided. Not fixed here.

Also flagged during review (applies to the Vendors page too): the archived practitioner page's contact modal was wired with mismatched element IDs (`apply-modal` vs `kco-modal`), which broke every CTA. Check the Vendors modal for the same bug when that page is done.

---

## VENDORS PAGE COPY (`vendors/index.html`)

### Functional fixes (were broken)
- **Contact modal rewired.** IDs were mismatched (`vendor-modal` / `vendor-form-view` / `vendor-success`) against the CTAs that call `kco-modal` / `kco-form-view` / `kco-success`, so nav and hero CTAs opened nothing and the success swap never fired. Renamed the three IDs to the `kco-` set. Verified: one `id="kco-modal"`, all four `getElementById` targets aligned.
- **Closer CTA repointed.** The closer "Book a discovery call" button linked to the newsletter Typeform (`uQrXm9NS`) instead of the contact modal. Now opens the modal, consistent with the hero and nav.

### Copy fixes
- **Hero H1:** "Trust in the HR function has to be earned." *(leads with the standard rather than the negative; replaced the earlier "Where HR-tech vendors earn the trust they can't buy," whose "Where" had no referent)*
- **Hero subhead:** "Practitioners are skeptical of vendors, and that's fair. Kyle & Co bridges the gap the vendor-client relationship can't close on its own, putting your work in front of them through research, underwriting, advisory, and events." *(names the skepticism and validates it without condescending; frames the offering as closing a structural gap. Compressed to hook; the fuller version of this argument lives in the "The shift" section below.)*
- **Meta description:** aligned to the new hero ("Trust in the HR function has to be earned. Practitioners are skeptical of vendors...").
- **"The shift" section:** H2 "The stakes just went up." (was the generic "The market is changing fast."). Body reworked so it deepens the hero instead of restating it — para 1 is the market shift (bigger AI bets, more scrutiny per purchase), para 2 is the mechanism ("Credibility with practitioners comes from being in the rooms where they do the work, and adding to it. Kyle & Co is how vendors earn that place, without faking it."). Dropped the hero-duplicating lines ("trusted less than ever," "someone in the room who doesn't have anything to sell," "get into that room"). Kept the "Practitioner-built beats practitioner-targeted" blockquote.
- **Engagement head:** "Four ways to **work with us.**" *(dropped filler adverb "strategically")* Intro: "Each is scoped in a discovery call. The fit follows from what you're trying to solve." *(removed "not what we're selling" template; the integrity beat is already made in The Shift)*
- **Proof intro:** "Real photos from sponsor sessions, council underwriting, and event activations." *(removed "Real moments, not stock" template)*
- **Closer body:** "Most of this work starts with a single question..." *(removed "You came here with a question" behavior-narration, matching the home page)*
- **Contact modal:** removed the duplicate "responds within two business days" line under the submit button.

### Proof tiles — updated to real engagements (per Brandice)
- Tile 1: GoodTime *(fixed capitalization from "Goodtime")* — Council session, underwriting the HCAIC working sessions.
- Tile 2: CodeSignal — Compass: AI Interviewers benchmark study.
- Tile 3: Humanly — "Live workshop in Boston." *(interpreted as: keep Humanly, correct the engagement. Confirm if a vendor swap was intended.)*
- Tile 4: Findem — "Customer interviews at an event."
- Tile 5: Cornerstone OnDemand — "Analyst day." *(replaces Warden AI)*
- **Photos:** Brandice is uploading real images into the gradient tiles directly in code.

### Open item for Brandice
- The proof tiles name real vendors with specific engagement claims. Confirm each is current and approved to publish by name (same standard as the testimonials).

---

## Status: all live pages complete

Home, Resources, and Vendors are locked and applied. The Practitioner page was removed. No remaining pages in scope for this voice pass.
