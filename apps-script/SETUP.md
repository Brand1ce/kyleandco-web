# Year Two Town Hall — calendar auto-invite setup

Registrant submits the reg modal → MailerLite group **AI Council – Year Two Town Hall**
→ webhook → this Apps Script emails them a calendar invite (.ics from the live event) and
silently logs them onto the event guest list. No blast to other guests.

**Event:** The Human-Centric AI Council Year Two Town Hall · Aug 27, 2026 · 1:00–2:00pm ET
`brandice@kyleandco.com`, event id `0b98lpeee9fophk2tc6sfseagv`. Add the Meet/Zoom link to the
event whenever you like — the invite reads the link off the event at send time.

## You deploy the script (5 min)
1. https://script.google.com → **New project**. Paste in `townhall-calendar-add.gs`.
2. In `CONFIG`, set `SECRET` to a long random string (keep it; you'll reuse it below).
3. Left sidebar **Services** (+) → add **Calendar API** (advanced service).
4. Run the `authorize` function once → approve the Calendar + Gmail permissions.
5. **Deploy → New deployment → Web app.** Execute as **Me**, Who has access **Anyone**. Copy the **Web app URL**.
6. Send me the Web app URL. I'll create the MailerLite webhook pointing at
   `<web-app-url>?token=<your SECRET>` and the confirmation automation.

## What I do after you send the URL
- Create the MailerLite webhook (group joined → your web app).
- Set up the MailerLite confirmation automation (branded "you're registered" email).
- Test end-to-end with a throwaway email and confirm it lands on a calendar + in the group.

## Confirmation email — draft for your approval
Subject: **You're registered — Year Two Town Hall, Aug 27**
Body:
> You're in. The Human-Centric AI Council Year Two Town Hall is **Thursday, Aug 27 at 1:00pm ET**.
> Each pillar champion walks the room through their Year Two workstream — what they're building,
> and how HR teams and vendors can plug in.
> You've been added to the calendar; the invite (with the join link) is on its way in a separate
> email. Nothing to click.
> See you there. — The Human-Centric AI Council

## Notes
- Gmail send is from `brandice@kyleandco.com`. If you want it to send as `council@kyleandco.com`,
  add that as a send-as alias in Gmail and set `FROM_NAME`/alias in the script.
- Guest list is already hidden on the event (guests can't see each other).
- The `SECRET` is never committed — the file ships with a placeholder; you set the real value in
  the editor. `apps-script/` is excluded from the website deploy.
