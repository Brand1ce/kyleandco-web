# Year Two Town Hall — calendar auto-invite (POLLING, in your existing Apps Script)

A scheduled function in the **Marketing KPIs Data** project checks the town hall group every
few minutes and, for anyone new, adds them to the event guest list (silently) and emails them a
calendar invite (.ics built from the live event, so the join link on the event flows through).

**Why polling, not a webhook:** Apps Script always answers a webhook with a `302` redirect, which
MailerLite treats as a failed delivery and auto-disables the webhook. Polling avoids that entirely,
reuses the `ML_API_KEY` already in this project, and (because time triggers run the latest saved
code) means **no redeploying** — ever.

**Event:** Aug 27, 2026 · 1:00–2:00pm ET · `brandice@kyleandco.com` · id `0b98lpeee9fophk2tc6sfseagv`.
Add the Meet/Zoom link to the event whenever — invites read the link off the event at send time.

## One-time setup (~3 min, no deployment)
1. In the **Marketing KPIs Data** project, put the code in a file (e.g. `townhall`).
2. **Services (+)** → add **Calendar API** (if not already added).
3. **Add the manifest scopes** (this project declares explicit `oauthScopes`, so new scopes must be
   added by hand). Project Settings (gear) → check "Show appsscript.json manifest file in editor" →
   open `appsscript.json` → add to `oauthScopes`:
   `https://www.googleapis.com/auth/calendar` and `https://www.googleapis.com/auth/script.send_mail`.
4. Run **`authorizeTownhall`** once → approve the new permissions. You should get a "Town hall script
   authorized" test email — that proves Calendar + mail + MailerLite access all work.
4. **Triggers** (clock icon, left sidebar) → **Add Trigger**:
   - Function: **pollTownhall**
   - Event source: **Time-driven** → **Minutes timer** → **Every 5 minutes** → Save.
5. (Optional) Run **`pollTownhall`** once by hand to invite whoever's already in the group now.

That's it. No web app deployment, no webhook.

## Confirmation email (MailerLite, separate + instant)
The branded "you're registered" email is a MailerLite automation (fires the moment they join the
group): https://dashboard.mailerlite.com/automations/194897490541020606 — design it in the editor
and activate. Draft:
> Subject: You're registered — Year Two Town Hall, Aug 27
> You're in. The Human-Centric AI Council Year Two Town Hall is Thursday, Aug 27 at 1:00pm ET.
> Each pillar champion walks the room through their Year Two workstream — what they're building,
> and how HR teams and vendors can plug in. You've been added to the calendar; the invite (with
> the join link) is on its way in a separate email. Nothing to click. — The Human-Centric AI Council

## Notes
- `pollTownhall` remembers who it's invited (Script Property `TH_PROCESSED`), so no duplicates.
- It only invites subscribers with status `active`. If the reg form is **double opt-in**, people
  must confirm before they go active (and get the invite). Switch the form to **single opt-in**
  for instant invites.
- Sends from `brandice@kyleandco.com`. For a `council@` send-as, that needs GmailApp + a Gmail alias.
- Invite delay = up to the trigger interval (5 min). The confirmation email is instant.
