# AI Council Page Update — Working Checklist
*Prepared July 28, 2026 · Sources: current `kyleandco-web/aicouncil/index.html`, Kyle/Brandice 1:1s (Jul 22 + Jul 27), Kyle's SteerCo emails (Jul 17 + Jul 20), Fathom recap of Jul 20 council meeting*

## ✅ Resolved (deck D1 extracted 7/28 — content now in the handoff doc)

- [x] **Pillar champions confirmed from deck:** Gilkey→Literacy, Nichols→Trust & Safety, **Warman→Value Realization, Musman→Adoption & Change Mgmt** (Kyle's 7/17 email had these two swapped — deck + meeting recap agree, deck wins), Treitler→Forward-Thinking.
- [x] **Five priorities + workstream leaders + blurbs + flagship outputs** — pulled from deck, written into handoff §3b.
- [x] **Member roster (27 people, by pillar, with titles)** — pulled from deck, written into handoff §3c. 14 are new to the page.

## ✅ Also resolved 7/28

- [x] **Original-cohort members not in the deck → "Former Contributing Members" section** at the bottom with the toolkit (10 people incl. Tushar). Toolkit keeps its top-nav link. In handoff §2A + §3c.
- [x] **All 27 headshots extracted from the deck** and committed to `aicouncil/member-headshots/` (kebab-case, 400×400). Returning members' photos overwritten with deck versions — git has the old ones if needed.

## ✅ Decisions locked 7/28 (in handoff)

- [x] Naming: **Year Two**
- [x] Priority 05: **Human-Centric AI Impact Analysis Program**
- [x] Underwriters: **Year Two = isolved, Glider, CodeSignal, HiBob, GoodTime** (confirmed); **Year One** section keeps the full original 12
- [x] Town hall placeholder: **August 27, 2026** (time TBA)
- [x] Blog: coming soon — toolkit post holds the featured slot, one-line swap when live

## ⚠️ Still open — resolve before final ship

- [ ] **Year Two logo assets:** the page's current logo strips are baked PNGs of all 12 — the 5 Year Two logos (isolved, Glider, CodeSignal, HiBob, GoodTime) need to be split out. Check `Client Logos/` and `HCAIC/Underwriter logos/` for individual files.
- [ ] **Workstream copy may still shift ~7/31** — leads owe Kyle final "What We'll Do / How We'll Do It" by end of week. Deck copy is good enough to build with; plan a quick copy pass after.
- [ ] **Bios still missing for 7 new members** (Christi Anthony, Jon Fraschetti, Rita Domarkaite, Clayton Rodgers, Johnny Sanchez, Jeremy Lyons, Rob Devlin) — the other 7 are extracted and card-ready in `aicouncil-new-member-content.md`. Kate Gilkey's title resolved (Sr. HR Systems Manager, CrowdStrike). Chase the missing 7 in the bios doc; three workstream leaders are among them.
- [ ] **Town hall time** on Aug 27 + Kyle's blog URL when live.

## Content prep (yours)

- [ ] Write 1–2 sentence vendor CTA copy (goal: new underwriters — this is the page's revenue job now)
- [ ] Gather new member bios/photos as they come in (drop into `aicouncil/member-headshots/`)

## Page changes (what Claude Code will execute — see handoff doc)

- [ ] Restructure page order: **agenda/workstreams front and center**, toolkit demoted to bottom
- [ ] Replace 4 old `focusAreas` with the 5 Year Two priorities + leaders (content final, in handoff §3b)
- [ ] Add pillar champions to the existing 5-pillar block (pillars themselves unchanged)
- [ ] Rebuild members array from deck roster: remove Tushar, update titles (Rachel Bourne, Sarika Lamont), add 14 new members with avatar fallbacks
- [ ] New primary CTA: vendor/underwriter recruitment (form already exists on page) + secondary "follow along" subscribe
- [ ] Fix stale events section; add town hall placeholder ("Late August · date TBA")
- [ ] Update hero + meta copy for Year Two
- [ ] Verify member count claims, nav labels, and internal anchors still make sense after reorder

## Sequence

1. Answer the open questions above (the 9-removals one is the only true blocker — everything else can ship with a noted default)
2. Run the Claude Code handoff — it can now run in **one pass**; only headshots/bios and post-7/31 copy tweaks trail in
3. QA on mobile + desktop, check MailerLite forms still fire
4. Ship → then email campaign (your stated priority order: headshot template → website → email)
