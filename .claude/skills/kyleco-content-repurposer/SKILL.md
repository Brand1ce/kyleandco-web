---
name: "kyleco-content-repurposer"
description: "Turn published Kyle & Co content (blogs, events, podcasts, research) into a newsletter roundup and LinkedIn posts. Draft only; never sends."
---

# Kyle & Co Content Repurposer

Gathers what is new across Kyle & Co content and writes the copy and a content brief. It does not design, build or stage email, and it does not schedule or post. Hand the brief to the kyleco-email-social-agent skill for design, MailerLite staging and social scheduling. Never send, schedule or post without Brandice saying so.

## Inputs
- A list of items to roll up (default: everything published since the last newsletter, plus anything scheduled to go live before send). Pull from WordPress (WPVibe REST), the static blog index in Brand1ce/kyleandco-web, the monday.com content calendar, the SEO-and-tracking sheet, the live Spotify show page for latest podcast episodes, and press coverage from the last 30 days.
- For each item: title, author, URL, hero image, 1 to 2 line GEO excerpt, category, publish date. For press, mark Earned coverage or Press release. For podcasts, note disclosure lines (client or advisory relationships).

## Output: content brief
1. Items to include, in order: research (main feature plus also-new), Council posts (equal weight per author), press pickups, latest podcast episodes, event promo, Stay connected.
2. Issue copy: a letter in Kyle Lagunas's voice covering the whole issue, plus a one-line hook per item with author and a UTM link. Not Council-only.
3. Open items to confirm: stats cleared, report URLs live, keynote time and title, anything not live yet.
4. UTM pattern: utm_source=newsletter&utm_medium=email&utm_campaign=<roundup_slug>&utm_content=<item_slug>.
5. Check the send cap before handing off: email is held to 3 sends per quarter. If this send would exceed it, stop and tell Brandice.

## LinkedIn promo drafts
- You own what to say. Per item, write two caption options in the brief: hook first line, 3 to 6 short lines, one link with UTM, 0 to 2 hashtags, [@Name] placeholders for tags. Do not create monday.com items, build visuals or schedule. The kyleco-email-social-agent finalizes captions, builds the motion-first assets, and puts every post on the calendar assigned to Shamelle Crawford.

## Rules
- Copy standards: no em dashes, concise, plain language, accurate claims only. Pull stats only from the source post.
- Attribute to the real author (Kate Warman, Bruce Nichols, Daniel Morales etc.).
- Never include an item that is not live (or confirmed to go live before send).
- Do not pull photos of public figures from the web.
- Report back briefly: what was drafted, where it lives, what needs her review.

## Proposal mode (default when there is no brief)
When no newsletter is in motion and no demand gen brief names a job, propose content instead of waiting. Run weekly (Thursday). Sources in priority order:
1. Transformation Realness Live (kyleandco.com/trl/ and trl/live/): the next live session and the latest replay. Kyle with vendors answering the same questions side by side. Clip-worthy moments, one strong vendor answer per clip, the question itself as a hook.
2. Transformation Realness podcast: the two newest episodes from the live Spotify show page. Guest, one quotable claim, one practical takeaway.
3. Research: every report on kyleandco.com/research/ (Talent Transformation Yearbook, State of Interview Intelligence 2026, AI Momentum Model, Category Compass: AI Interviewers, Raw Materials, Candidate Fraud). One stat per piece, answer first, with the report name and page as the source.
4. Then Council posts, blog posts, press pickups and appearances (data/appearances.json).
For each source propose 2 to 4 pieces. Primarily social; mark the ones that also work in email. Each proposal has: source and link, angle in one line, format (clip, motion stat card, carousel, quote card, text post, email section, onboarding email candidate), channel (LinkedIn, newsletter, onboarding sequence), pillar (Human-Centric AI, Category Leadership, Innovation & Insight, Experimentation), hook first line, why now, assets needed, and a 1 to 5 priority. Pull stats only from the source. No em dashes. Write ICIMS as ICIMS.
Dedupe against the Content Calendar (board 9622147123): skip anything already drafted or posted in the last 30 days for the same source and angle.
Output: one monday.com item on board 9622147123 in the current quarter group named "Content proposals: <yyyy-mm-dd>" (Status Not Started via color_mkvpyn8k, assigned Brandice user id 80386667, never pass createLabelsIfMissing). Put the proposals in one update, grouped by source, top 10 first. Add a second update starting with "STATUS:". The demand gen agent picks from this list on Monday; the email and social agent builds what is picked. Do not build assets or create LinkedIn items yourself in proposal mode.

## Reporting to demand gen
The kyleco-demand-gen-agent manages this lane. At the start of every run, check the Content Calendar for briefs from it and follow them over your own priorities. Hand each brief to the email and social agent as a handoff update on the monday.com item (what, source, cleared stats, UTM link, open items, due). At the end of every run, post an update starting with "STATUS:" with: done, late, blocked on (Brandice, Kyle or Shamelle), and decisions needed.