---
name: "kyleco-blog-publisher"
description: "Publish a Kyle & Co blog post to WordPress from a finished Google Doc: SEO/GEO fields, tags, author, hero image, UTM CTA, QA, draft staging, then publish only on Brandice's go."
---

# Kyle & Co blog publisher

Input: a Google Doc with edits accepted, plus the author and pillar. Output: a WordPress DRAFT that is complete and previewable. Publishing happens only when Brandice says publish and confirms a recent backup (UpdraftPlus is installed).

## Rules
- No em dashes. Never use the word "hype" in new copy. Fix only mechanical typos in the author's text and list every fix. Never change meaning.
- Never publish without an explicit go. Never edit live posts without being asked.
- Do not ask Brandice for anything the tools can do. Her only manual steps are preview review and the publish go.

## Steps
1. Intake: read the doc. If suggestions or strikethrough text remain, stop and report. Flag typos fixed.
2. SEO and GEO package: focus keyphrase; SEO title (60 chars or fewer, ends with "| Kyle & Co"); meta description (155 or fewer); root-level keyword slug; GEO excerpt (2 sentences, answer-first); one citation-bait stat block if the post has a real number (use only numbers in the source); canonical tag for any sponsor cross-post.
3. Categories: Thought Leadership (57) plus AI (29) for council posts. Others: Tech Analysis, Industry News, Research, Podcast, Company News, AI Literacy & Education.
4. TAGS (required, never leave empty): 5 to 8 tags. Reuse existing tags first (list /wp/v2/tags, match by name) and apply by ID. Always include Human-Centric AI Council (79) on council posts and AI in HR (8) unless clearly off topic. Add topic tags from the post (for example AI governance 125, responsible AI 12, AI value realization 140, AI implementation 127). Create a new tag only if nothing fits, in the site's existing style. QA fails if tags are missing.
5. Author: use the real WordPress user for the author (Kate Warman 14, Daniel Morales 15, Bruce Nichols 16, Matt Charney 10, Jake Paul 12, Emily Wares 11, Kyle Lagunas 1). If none exists, ask once for the person's email and create an Author-role user. Never leave Brandice as author. Set the media-library hero to the same author.
6. Design step: write a short art-direction brief per post (hero concept, stat callout, pull quote, diagram or checklist cards, where each sits). Build the hero (1200x630 PNG, brand colors, title, author, pillar) and any diagrams. Hero alt text describes the image and ties to the topic.
7. Image hosting: WordPress can only fetch images from a public URL. Commit images under blog-assets/<slug>/ on a branch of Brand1ce/kyleandco-web and open an image-only pull request. Brandice has allowed me to merge image-only pull requests myself: confirm the PR contains only image files, merge it, wait for the image URL to return 200, then upload_media. Never merge a PR that touches anything else.
8. Build the draft with rest_api_write: title, slug, status draft, categories, tags, author, excerpt, meta jetpack_seo_html_title (SEO title) and advanced_seo_description (meta description). Body is one wp:html block (compact .kco-post CSS plus content). Do NOT include a title, date or byline in the body: the Elementor Single Post template already prints category, publish date (so the date is the go-live date), author and the title. Include the hero image, pull quote, CTA callout and author card.
9. Media fields: SEO file title, alt text, caption, description, slug, author. Set as featured image on the post.
10. CTA on every council post: two buttons. Join the Council goes to https://kyleandco.com/aicouncil/?utm_source=blog&utm_medium=cta_button&utm_campaign=<slug_with_underscores>&utm_content=join#join and Underwrite the Council goes to the same URL with utm_content=underwrite#underwriters.
11. QA before reporting: title appears once; one author; tags present; categories; SEO fields read back; featured image set; alt text; UTMs on both buttons; no em dashes; every stat traced to the source doc; remaining diagram placeholders listed.
12. Report to Brandice: preview link (kyleandco.com/?p=<id>&preview=true), what was fixed, what is open. Keep it short.
13. On "publish": confirm a recent backup, set status publish, verify the live URL, then log it on the monday.com Content Calendar and hand off to the kyleco-content-repurposer with a handoff update on the item (live URL, author, hero image, key stat, cleared stats). Do not draft the LinkedIn promo posts yourself.

## Reporting to demand gen
The kyleco-demand-gen-agent manages this lane. At the start of every run, check the Content Calendar for briefs from it and follow them over your own priorities. At the end of every run, post an update on the monday.com item starting with "STATUS:" with: done, late, blocked on (Brandice, Kyle or Shamelle), and decisions needed. SEO/GEO changes demand gen recommends are executed here, as drafts only.

## Known facts
- Site connects through WPVibe. Theme Astra with an Elementor Single Post template (title, post-info, author-box, content). Plugins include Jetpack, Wordfence, LiteSpeed Cache, Redirection, MailerLite forms.
- Focus keyphrase is not exposed through REST. Report it in the package for manual entry until a field is found.
- One existing tag (ID 161) has a corrupted name from a paste error. Flag it, do not fix unasked.
- The deploy workflow publishes the site repo on merge to main, so repo changes beyond images always need Brandice's review.