# Year Two Town Hall — calendar auto-invite (adds to your existing Apps Script)

This adds a town-hall handler to your **existing "Marketing KPIs Data"** project — no new
project, no new deployment URL. It adds a `doPost`; your dashboard `doGet` is untouched.

Registrant submits the reg modal → MailerLite group **AI Council – Year Two Town Hall**
→ webhook → this handler emails them a calendar invite (.ics from the live event) and
silently logs them onto the event guest list. No notification blast to other guests.

**Event:** Aug 27, 2026 · 1:00–2:00pm ET · `brandice@kyleandco.com` · id `0b98lpeee9fophk2tc6sfseagv`.
Add the Meet/Zoom link to the event whenever — the invite reads the link off the event at send time.

## You do (in the existing project, ~5 min)
1. Open the **Marketing KPIs Data** Apps Script project.
2. **+ → Script** → name it `townhall` → paste in `townhall-calendar-add.gs`.
3. **Services (+)** in the left sidebar → add **Calendar API** (advanced service).
4. **Project Settings → Script Properties → Add**: `TOWNHALL_SECRET` = a long random string. (Keep it.)
5. Run function **`authorizeTownhall_`** once → approve the new Calendar + send-email permissions.
   - If it complains the script needs new scopes vs. `appsscript.json`, it'll prompt to add them — allow it.
6. **Deploy → Manage deployments →** edit your existing web app deployment → **New version → Deploy.**
   (Same URL. Make sure "Who has access" = **Anyone** so the webhook can reach it.)
7. Send me: the **Web app URL** + the `TOWNHALL_SECRET` value (or just tell me it's set and I'll
   generate the webhook URL for you to confirm).

## Then I do
- Create the MailerLite webhook → `<web-app-url>?token=<TOWNHALL_SECRET>` on group-join.
- Set up the MailerLite confirmation automation (branded email — draft below).
- Test end-to-end with a throwaway email; confirm it lands on a calendar + in the group.

## Confirmation email — draft for approval
Subject: **You're registered — Year Two Town Hall, Aug 27**
> You're in. The Human-Centric AI Council Year Two Town Hall is **Thursday, Aug 27 at 1:00pm ET**.
> Each pillar champion walks the room through their Year Two workstream — what they're building,
> and how HR teams and vendors can plug in.
> You've been added to the calendar; the invite (with the join link) is on its way in a separate
> email. Nothing to click. See you there. — The Human-Centric AI Council

## Notes
- Sends from `brandice@kyleandco.com`. For a `council@` send-as, that needs GmailApp + a Gmail alias — tell me and I'll switch it.
- Guest list is already hidden on the event.
- `TOWNHALL_SECRET` lives in Script Properties, never in the repo.
