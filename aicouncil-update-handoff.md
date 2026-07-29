# Claude Code Handoff — AI Council Page Update (July 2026)

**Target file:** `aicouncil/index.html` in the `kyleandco-web` repo (single-file React/JSX page, ~2,500 lines, inline Babel; images base64-inlined or in `aicouncil/`).
**Goal:** Repurpose the page from "Cohort Zero toolkit showcase" to the Year Two launch: the new agenda goes front and center, the toolkit moves to the bottom, and the primary CTA targets vendors/underwriters.
**Content source of truth:** deck D1 (all pillar/champion/workstream/member content below was extracted from it on 7/28) — https://docs.google.com/presentation/d/15BLXXlAD8rsCUfWenmZnQIVT-7pjkHQtmq9y17PrFWI/edit

Work in a branch. Do not touch other pages in the repo.

---

## 1. Current page anatomy (verified July 28)

Section order in the rendered JSX:

| # | Section | Notes |
|---|---------|-------|
| 1 | Nav | Links: Toolkit `#library`, 2026 Work `#work`, Members `#members`, How to Participate `#join`. CTA button "Join the Council" |
| 2 | Hero | Badge: `Cohort Two · 2026 · The Year of the Human`. H1 "Stay ahead of AI innovation…". Primary CTA "Explore the Toolkit →" (`#library`) |
| 3 | About the Council | "Practitioner-led. Five pillars. One goal." — inline 5-pillar array (~line 817), no champions |
| 4 | Featured post | Links to toolkit blog `kyleandco.com/ai-toolkit-for-hr-leaders/` |
| 5 | `#library` | The AI Transformation Toolkit — currently "the star", gated resources (`const resources`, ~line 237) |
| 6 | `#events` | `const events` (~line 527) — **stale**: May 28 "Cohort Zero Toolkit Launch" still marked `upcoming` |
| 7 | `#work` | `const focusAreas` (~line 328) — 4 old focus areas, replace with the 5 priorities below |
| 8 | `#cohort2-apply-grid` | Apply section |
| 9 | `#members` | `const members` (~line 359) — 23 entries incl. Tushar Pandit (~line 466) |
| 10 | `#join` | Participation forms. MailerLite endpoints defined (~lines 212–217): `ML_APPLY_URL`, `ML_KCO_URL`, `ML_TOWNHALL_URL`, `ML_UNDERWRITER_URL`, `ML_MOMENTUM_URL` |

Other data: `const underwriters` (~line 523) = `['Workday','Findem','Warden AI','Humanly','GoodTime','Rival','isolved','Glider','CodeSignal','Gem','HiBob','SmartRecruiters']`. Analytics via `track()` — preserve and extend, don't remove.

---

## 2. Structural changes

**A. Reorder sections.** New order after hero: **About the Council (pillars + champions) → 2026 Priorities/Workstreams (`#work`) → Members → Events/Town Hall → Join/CTAs → Toolkit (`#library`) at the bottom → Former Contributing Members (also at the bottom, with the toolkit).** Kyle's directive (7/22 1:1): "what should be top and front and center is the agenda… toolkit down at the bottom." Update nav links, mobile menu, footer links, and hero CTAs to match — hero primary CTA points at `#work` or the underwriter CTA, not the toolkit. **The Toolkit keeps its top-nav link** even though the section moves to the bottom (Brandice, 7/28).

**B. Rebuild the CTA strategy.** Primary audience is now **vendors/underwriters** (Kyle, 7/22: "we need more underwriters"). Use existing `ML_UNDERWRITER_URL` form. Secondary CTA: "follow along with the council's work" subscribe (`ML_KCO_URL`). Keep the practitioner apply form but demote it.

**C. Fix `#events`.** Move the May 28 Cohort Zero Toolkit Launch to `status: 'replay'`. Add the **Year Two Launch Town Hall** entry: `date: 'August 27, 2026 · time TBA'`, `status: 'upcoming'`, wired to `ML_TOWNHALL_URL` — vendors explicitly invited. (Confirmed by Brandice 7/28; update time when set.)

**D. Copy pass on hero/meta.** **Naming decision (Brandice, 7/28): "Year Two."** Replace "Cohort Two" everywhere — hero badge (e.g. `Year Two · 2026 · The Year of the Human`), the `#cohort2-apply-grid` id, title/OG meta, and any body copy. Keep the "What is Human?" theme. Where the previous cohort is referenced, "Year One" / "Cohort Zero" per existing toolkit copy.

**E. Cohort work highlight.** Show Year One's shipped toolkit assets as proof of what the council ships, placed with the demoted toolkit section.

**F. Underwriter logo wall — split by year (CONFIRMED by Brandice, 7/28).** Two groups:
- **Year Two Underwriters (final list, 5):** isolved, Glider, CodeSignal, HiBob, GoodTime. Nothing else goes in this group — Workday, Gem, and SmartRecruiters are Year One only.
- **Year One Underwriters:** the full original list of 12 (Workday, Findem, Warden AI, Humanly, GoodTime, Rival, isolved, Glider, CodeSignal, Gem, HiBob, SmartRecruiters) under a "Year One" heading — nobody gets scrubbed from history.
Place Year Two prominently (near the underwriter CTA); Year One sits lower/smaller near the toolkit/former-members zone. Note the existing logo strips (`vendor-logos-line1.png`/`line2.png` in `aicouncil/`) bake all logos into two images — the Year Two group needs the five logos split out or a new strip; individual logo files may exist in the `Kyle & Co` folder (`Client Logos/`, `HCAIC/Underwriter logos/`).

**G. Featured post.** Kyle's Year Two announcement blog is coming shortly — keep the toolkit post in the slot; structure it so the URL swap is a one-line change. Get the URL from Brandice at run time if available.

---

## 3. Content — FINAL, from deck D1

### 3a. Pillars + Champions (pillars unchanged; add champions)

| Pillar | Champion |
|---|---|
| AI Literacy & Education | Kate Gilkey |
| AI Trust & Safety | Bruce Nichols |
| AI Value Realization | **Kate Warman** |
| AI Adoption & Change Management | **Bill Musman** |
| Forward-Thinking & Future-Ready AI | Adam Treitler |

*(Deck confirms the Fathom recap, not Kyle's 7/17 email — Warman on Value, Musman on Adoption.)* Keep existing pillar blurbs/objectives on the page; they match the deck's "Pillars & Objectives" slides.

### 3b. Replace `focusAreas` with the five Year Two priorities

Number them 01–05 as in the deck. Each card: number, title, leader, "What We'll Do" blurb, flagship outputs (trim to top 2–3 per card; full lists below for the detail modal if kept).

**01 · Map AI's Impact on HR** — Leader: Kirandeep Virdi
Track how AI is actively reshaping HR work — identifying what's being automated, augmented, and left to human judgment across the function.
Outputs: AI impact heatmap across HR functions · Human vs. AI work map (task-level) · role-by-role analysis of shifting skills and scope · "what's changing now" briefs.

**02 · Define the Human-Centered HR Operating Model** — Leader: Clayton Rodgers
Clarify how HR must be restructured as AI becomes embedded in work — building a practical model around human strengths and AI-enabled capabilities.
Outputs: role redesign guidance (TA, HRBPs, L&D, HR Ops) · HR operating model archetypes · before/after "day in the life" workflow comparisons · executive translation guide.

**03 · Build a Practical HR AI Governance & Risk Framework** — Leader: Susan Jackson
Help HR leaders govern AI responsibly in high-stakes processes — clarifying decision rights, human accountability, and how to move from "could we?" to "should we?"
Outputs: HR AI governance operating model · risk typology (where human judgment cannot be delegated: hiring, performance, pay, terminations) · AI risk index by vendor and HR process · governance maturity assessment · regulatory briefings.

**04 · Scale AI Literacy into Practical Capability** — Leader: Jelena Marjanovic
Build on Year One's foundational AI Literacy Toolkit and CodeSignal course — moving from awareness into role-specific, outcomes-anchored, Monday-morning-actionable capability.
Outputs: practitioner playbook by role and business outcome · "force multiplier" framework · use case library mapped to productivity, analytics, and cross-functional ROI · expanded CodeSignal course content.

**05 · Launch the Human-Centric AI Impact Analysis Program** — Leader: Rob Devlin
Capture how organizations are actually implementing AI in HR — going deep on what worked, what didn't, and what the human and business impact really looked like.
Outputs: dual-dimension impact framework (business ROI + human impact) · 4–6 published impact analyses across functions, industries, and company sizes · anonymous-first publishing with opt-in recognition · lessons-learned synthesis.

*(Display name confirmed by Brandice 7/28: **"Human-Centric AI Impact Analysis Program."** The deck's workstream-leader slide calls it "Human-Centric AI Case Studies" — use Impact Analysis Program in page copy.)*

### 3c. Members — rebuild `members` array from the deck roster (27 people)

**Champions** (titles NOT in deck — get from Brandice/Kyle's headshot collection; use title placeholders until then):
Kate Gilkey · Bruce Nichols · Kate Warman · Bill Musman · Adam Treitler
*(Existing page entries for Nichols, Warman, Musman, Treitler have titles/bios/photos — keep those, add champion badge. Kate Gilkey is NEW.)*

**Members by pillar (name — title, per deck):**

*AI Literacy & Education:* Jelena Marjanovic, PhD — Founder, AI at Work `NEW` · Melissa Laswell — Head of Executive Recruitment · Rachel Bourne — Vice President, AI Transformation *(title changed from "Host, The Shift Show" — update)* · Robyn Mather — Founder & CEO, Leadership State of Mind `NEW` · Sarika Lamont — Chief People & AI Enablement Officer *(title updated)*

*AI Trust & Safety:* Bradley Clark — Global Head of Talent Acquisition & Employer Brand `NEW` · Christi Anthony — Director, E&LR Governance & Compliance `NEW` · Jon Fraschetti — Director, Talent Operations, Tech & Analytics `NEW` · Susan Jackson — Executive Director, Global Talent Technology (fmr) · Tara Torres — Senior Manager, Talent Strategy & Operations (fmr)

*AI Value Realization:* Daniel Morales — Senior Manager, People Solutions & AI · Dustin Cann — Senior Director, Talent Acquisition Strategy & Ops · Rita Domarkaite — Senior Director, Talent Transformation `NEW` · Sarah Smart — SVP, Global Talent Acquisition & Workforce Strategy

*AI Adoption & Change Management:* Clayton Rodgers — Senior HRBP, HR Enablement & AI Transformation `NEW` · Johnny Sanchez — Head of Recruiting Ops & Technology `NEW` · Kaity Jacobsen — Director, Talent Engagement `NEW` · Sydney Edman — Head of People Operations `NEW`

*Forward-Thinking & Future-Ready AI:* Bob Pulver — Founder & Principal, Elevate Your AIQ · Jeremy Lyons — Co-Founder, RecOps Collective `NEW` · Kirandeep Virdi — Head of People & Culture (fmr) `NEW` · Rob Devlin — Sr Global Program Manager, TA Technology `NEW`

**Implementation notes:**
- **Headshots for all 27 members are already in `aicouncil/member-headshots/`** (extracted from the deck 7/28, 400×400, kebab-case: `kate-gilkey.jpg`, `jelena-marjanovic.jpg`, `bradley-clark.jpg`, etc.). Returning members' files were overwritten with the deck versions so the grid is visually consistent — git has the old versions if any need reverting. No avatar fallbacks needed.
- **Bios: see companion file `aicouncil-new-member-content.md`** — ready-to-insert role/photo/linkedin/bio for 7 of the 14 new members (from the HCAIC bios Google Doc, extracted 7/28); the other 7 ship with name + title + pillar only (bio field optional in the array). Returning members keep their existing bios/linkedin; update titles where the deck differs (Rachel Bourne, Sarika Lamont).
- Keep existing filename extensions: `bill-musman.png` and `bruce-nichols.png` stay `.png`; everyone else `.jpg`.
- **FORMER CONTRIBUTING MEMBERS (Brandice, 7/28):** members from the original cohort who are not in the deck roster move to a new **"Former Contributing Members"** section placed at the bottom of the page alongside the toolkit — do NOT delete them. Applies to: Tushar Pandit, Kelly Cartwright, Tiffany Clark, Amy Cropper, Martha Curioni, Adam Dayan, Logan Marsh, Alicia Miller, Manjuri Sinha, Allie Wehling (10 people). Reuse their existing photos/titles; smaller/denser cards than active members are fine.
- Consider grouping the active member grid by pillar (deck structure) instead of alphabetical — champion first in each group.
- Update any member-count copy on the page to match the final split (27 active / 10 former).

---

## 4. Open questions (do NOT guess — ask Brandice)

1. Town hall time on Aug 27 (date confirmed, time TBA).
2. Display name "Brad Clark" vs "Bradley Clark" (deck vs bios doc).

*(Resolved: Kate Gilkey = Sr. HR Systems Manager, CrowdStrike — from the bios doc.)*

*(Resolved 7/28 by Brandice: "Year Two" naming · priority 05 = "Impact Analysis Program" · underwriters split Year Two/Year One with lapsed kept in Year One only · town hall Aug 27 · former-cohort members → Former Contributing Members section · headshots local · blog URL coming soon.)*

## 5. Constraints

- Single self-contained file; keep the existing design system (Fraunces/Inter/JetBrains Mono, ivory/navy/lilac palette, `C` color object).
- Preserve all `track()` calls; add events for new CTAs (`underwriter_cta_click`, `townhall_register`, `workstream_open`).
- Preserve MailerLite form wiring and jsonbin click tracking.
- Mobile: verify reordered nav/mobile menu and member grid at small widths.
- QA before commit: all anchors resolve post-reorder; no orphaned "Explore the Toolkit" references above the fold; member count matches array; new-member cards render cleanly without photos.

## 6. Source receipts

- Deck D1 (content above): https://docs.google.com/presentation/d/15BLXXlAD8rsCUfWenmZnQIVT-7pjkHQtmq9y17PrFWI/edit
- 7/22 1:1 (Otter): page structure directive — agenda front and center, toolkit to bottom, vendor CTA, town hall late Aug.
- 7/27 1:1 (Otter): Tushar out; priority order = headshot template → website update → email campaign.
- Kyle emails 7/17 + 7/20 ("HCAIC Update: Welcome to the Steering Committee!!!"): SteerCo announcement, D1 link, 7/31 deadline for workstream leads' final copy — expect minor copy revisions after 7/31.
