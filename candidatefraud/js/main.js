/* ============================================================
   Kyle & Co — Candidate Fraud microsite
   Vanilla JS, no dependencies.
   ============================================================ */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- Mobile nav toggle ---- */
  var toggle = document.getElementById('navToggle');
  var links = document.querySelector('.nav__links');
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      var open = links.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(open));
    });
    links.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        links.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ---- Scroll progress bar ---- */
  var progress = document.getElementById('navProgress');
  function onScroll() {
    if (!progress) return;
    var h = document.documentElement;
    var scrolled = h.scrollTop / (h.scrollHeight - h.clientHeight);
    progress.style.width = (scrolled * 100).toFixed(2) + '%';
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---- Scroll reveal ---- */
  var revealTargets = [
    '.section-head', '.two-col__body', '.two-col__aside',
    '.finding-list li', '.bignum', '.numbers__callout',
    '.lc', '.contents li', '.research__item', '.research__caveat',
    '.get__inner', '.webinar__inner', '.hero__stats div'
  ];
  var nodes = [];
  revealTargets.forEach(function (sel) {
    document.querySelectorAll(sel).forEach(function (n) { nodes.push(n); });
  });

  if (reduceMotion || !('IntersectionObserver' in window)) {
    nodes.forEach(function (n) { n.classList.add('is-in'); });
  } else {
    nodes.forEach(function (n, i) {
      n.classList.add('reveal');
      // light stagger within a group
      n.style.transitionDelay = ((i % 6) * 55) + 'ms';
    });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add('is-in');
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    nodes.forEach(function (n) { io.observe(n); });
  }

  /* ---- Stat count-up (hero) ---- */
  var stats = document.querySelectorAll('#stats dt[data-count]');
  function animateCount(el) {
    var target = parseFloat(el.getAttribute('data-count'));
    var prefix = el.getAttribute('data-prefix') || '';
    var suffix = el.getAttribute('data-suffix') || '';
    var final = el.textContent;
    if (reduceMotion || isNaN(target)) { return; }
    var dur = 1100, start = null;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      var val = Math.round(target * eased);
      el.textContent = prefix + val + suffix;
      if (p < 1) { requestAnimationFrame(step); }
      else { el.textContent = final; }
    }
    requestAnimationFrame(step);
  }
  if (stats.length && 'IntersectionObserver' in window && !reduceMotion) {
    var sObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { animateCount(en.target); sObs.unobserve(en.target); }
      });
    }, { threshold: 0.6 });
    stats.forEach(function (s) { sObs.observe(s); });
  }

  /* ---- Active section in nav ---- */
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav__links a'));
  var sections = navLinks
    .map(function (a) { return document.querySelector(a.getAttribute('href')); })
    .filter(Boolean);
  if (sections.length && 'IntersectionObserver' in window) {
    var navObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          var id = en.target.id;
          navLinks.forEach(function (a) {
            a.style.color = (a.getAttribute('href') === '#' + id) ? 'var(--navy)' : '';
          });
        }
      });
    }, { threshold: 0.5 });
    sections.forEach(function (s) { navObs.observe(s); });
  }

  /* ---- Lightweight download/CTA tracking hook ----
     Replace the console.log with your analytics call
     (e.g. window.dataLayer.push or HubSpot/Klaviyo events). */
  // Shared KPI counter (same JSONBin the marketing dashboard reads).
  var CLICKS_URL = 'https://api.jsonbin.io/v3/b/69f340c4aaba88219756240d';
  var CLICKS_KEY = '$2a$10$prZqMqXbtmzSXZyh1nHLcOt1RcJbDCcAgppQ/6J2Brax5qLkY8Ggm';
  function bumpCounter(key) {
    fetch(CLICKS_URL + '/latest', { headers: { 'X-ACCESS-KEY': CLICKS_KEY } })
      .then(function (r) { return r.json(); })
      .then(function (data) {
        var counts = data.record || {};
        counts[key] = (counts[key] || 0) + 1;
        return fetch(CLICKS_URL, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', 'X-ACCESS-KEY': CLICKS_KEY },
          body: JSON.stringify(counts)
        });
      })
      .catch(function () {});
  }

  function countDownload() {
    if (window.gtag) window.gtag('event', 'file_download', { file_name: 'Kyle-and-Co-Candidate-Fraud-Report.pdf' });
    bumpCounter('candidatefraud');
  }

  /* ---- Download gate (OFF by default; backed by api/gate.php) ----
     People already in the MailerLite database download instantly; unknown
     visitors are asked for their details first, then added. Fails OPEN: any
     backend error still delivers the report, so nobody is ever blocked. */
  var GATE_ENABLED = true;    // gate live. NOTE: real member-vs-new check needs MAILERLITE_TOKEN in api/gate.php
  var GATE_ENDPOINT = 'api/gate.php';
  var REPORT_PDF = 'downloads/Kyle-and-Co-Candidate-Fraud-Report.pdf';

  var REPORT_URL = 'report/';

  // Copy shown in the gate's email step, by destination.
  var GATE_COPY = {
    pdf:         { title: 'Where should we send it?', desc: 'Pop in your email and the report is yours. If you’re already on our list, it downloads right away.' },
    interactive: { title: 'Apologies friend, but we have to ask.', desc: 'Pop in your email to open the interactive report. If you’re already on our list, it opens right away.' }
  };

  // Remember once someone has cleared the gate, so we don't ask again.
  var ACCESS_KEY = 'cf_report_access';
  function hasReportAccess() { try { return localStorage.getItem(ACCESS_KEY) === '1'; } catch (e) { return false; } }
  function grantReportAccess() { try { localStorage.setItem(ACCESS_KEY, '1'); } catch (e) {} }

  function deliverPdf() {
    countDownload();
    var a = document.createElement('a');
    a.href = REPORT_PDF; a.setAttribute('download', '');
    document.body.appendChild(a); a.click(); a.remove();
  }
  function deliverInteractive() { window.location.href = REPORT_URL; }

  var openGate = null;  // assigned below only if the gate modal is in the DOM
  var gate = document.getElementById('gate');
  if (gate) {
    var gEmailStep  = document.getElementById('gateEmailStep');
    var gNewStep    = document.getElementById('gateNewStep');
    var gDoneStep   = document.getElementById('gateDoneStep');
    var gEmailForm  = document.getElementById('gateEmailForm');
    var gNewForm    = document.getElementById('gateNewForm');
    var gEmailInput = document.getElementById('gateEmail');
    var gTitle      = document.getElementById('gateTitle');
    var gDesc       = document.getElementById('gateDesc');
    var gLastFocus  = null;
    var gIntent     = 'pdf';

    openGate = function (intent) {
      gIntent = (intent === 'interactive') ? 'interactive' : 'pdf';
      var copy = GATE_COPY[gIntent];
      if (gTitle) gTitle.textContent = copy.title;
      if (gDesc)  gDesc.textContent  = copy.desc;
      gLastFocus = document.activeElement;
      gEmailStep.hidden = false; gNewStep.hidden = true; gDoneStep.hidden = true;
      gate.classList.add('is-open'); gate.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      if (gEmailInput) gEmailInput.focus();
    };
    function closeGate() {
      gate.classList.remove('is-open'); gate.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      if (gLastFocus) gLastFocus.focus();
    }
    gate.querySelectorAll('[data-gate-close]').forEach(function (el) { el.addEventListener('click', closeGate); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && gate.classList.contains('is-open')) closeGate();
    });

    function gateDeliver() {
      grantReportAccess();
      if (gIntent === 'interactive') { deliverInteractive(); return; }
      gEmailStep.hidden = true; gNewStep.hidden = true; gDoneStep.hidden = false;
      deliverPdf();
    }

    gEmailForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var email = (gEmailInput.value || '').trim();
      var btn = document.getElementById('gateEmailSubmit');
      if (btn) { btn.disabled = true; btn.textContent = 'Checking…'; }
      fetch(GATE_ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: email }) })
        .then(function (r) { return r.json(); })
        .then(function (d) {
          if (d && d.status === 'new') { gEmailStep.hidden = true; gNewStep.hidden = false; }
          else { gateDeliver(); }   // member, or fail-open
        })
        .catch(function () { gateDeliver(); })
        .then(function () { if (btn) { btn.disabled = false; btn.textContent = 'Get the report'; } });
    });

    gNewForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var val = function (n) { var el = gNewForm.querySelector('[name="' + n + '"]'); return el ? el.value.trim() : ''; };
      var payload = { email: (gEmailInput.value || '').trim(), subscribe: true,
        name: val('name'), last_name: val('last_name'), company: val('company') };
      fetch(GATE_ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
        .then(function () { gateDeliver(); })
        .catch(function () { gateDeliver(); });
    });

    // Opt out: deliver without subscribing.
    var gSkip = document.getElementById('gateSkip');
    if (gSkip) gSkip.addEventListener('click', function () { gateDeliver(); });
  }

  document.querySelectorAll('[data-track]').forEach(function (el) {
    el.addEventListener('click', function (e) {
      var name = el.getAttribute('data-track');
      if (window.gtag) window.gtag('event', 'select_content', { content_type: 'cta', item_id: name });
      if (!name) return;
      var isDownload = name.indexOf('download') !== -1;
      var isInteractive = name.indexOf('interactive') !== -1;
      if (isDownload || isInteractive) {
        if (GATE_ENABLED && openGate && !hasReportAccess()) { e.preventDefault(); openGate(isInteractive ? 'interactive' : 'pdf'); }
        else if (isDownload) { countDownload(); }   // gate off, or already cleared: native <a download>/link proceeds
      }
    });
  });

  /* ---- Early-access signup (pre-launch teaser) ---- */
  var early = document.getElementById('early');
  if (early) {
    var eForm      = document.getElementById('earlyForm');
    var eFormState = document.getElementById('earlyFormState');
    var eDoneState = document.getElementById('earlyDoneState');
    var eEmail     = document.getElementById('earlyEmail');
    var eLastFocus = null;

    function openEarly(e) {
      if (e) e.preventDefault();
      eLastFocus = document.activeElement;
      eFormState.hidden = false; eDoneState.hidden = true;
      early.classList.add('is-open'); early.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      if (eEmail) eEmail.focus();
    }
    function closeEarly() {
      early.classList.remove('is-open'); early.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      if (eLastFocus) eLastFocus.focus();
    }
    document.querySelectorAll('[data-earlyaccess]').forEach(function (b) { b.addEventListener('click', openEarly); });
    early.querySelectorAll('[data-early-close]').forEach(function (el) { el.addEventListener('click', closeEarly); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && early.classList.contains('is-open')) closeEarly();
    });

    eForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var val = function (n) { var el = eForm.querySelector('[name="' + n + '"]'); return el ? el.value.trim() : ''; };
      var btn = document.getElementById('earlySubmit');
      if (btn) { btn.disabled = true; btn.textContent = 'Adding you…'; }
      function done() {
        eFormState.hidden = true; eDoneState.hidden = false;
        if (window.gtag) window.gtag('event', 'sign_up', { method: 'early_access' });
      }
      var payload = { subscribe: true, list: 'early', email: (eEmail.value || '').trim(),
        name: val('name'), last_name: val('last_name') };
      fetch(GATE_ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
        .then(function () { done(); })
        .catch(function () { done(); })   // report is sent manually at launch; never block the signup
        .then(function () { if (btn) { btn.disabled = false; btn.textContent = 'Email me the report'; } });
    });
  }

  /* ============================================================
     Webinar registration modal + Add-to-Calendar
     ------------------------------------------------------------
     Single source of truth for the event. Times are UTC ('Z') so
     calendar files need no timezone tables. If the time changes,
     update start/end/whenLabel here AND regenerate the hosted .ics
     (candidatefraud/downloads/candidate-fraud-webinar.ics).
     ============================================================ */
  var WEBINAR = {
    title: 'Who owns the seam? A working session on candidate-fraud response',
    start: '20260728T170000Z',           // Tue Jul 28 2026, 1:00 PM ET (EDT = 17:00 UTC)
    end:   '20260728T180000Z',           // 60 min (45 min live + 15 min Q&A)
    whenLabel: 'Tuesday, July 28, 2026 · 1:00 PM ET',
    joinUrl: 'https://kyleandco.com/live',
    location: 'Online — link in your confirmation email',
    description: 'Kyle & Co. live working session on candidate-fraud response: the findings, the hiring funnel, and the ownership models — plus the questions to ask before your next incident. Join link: '
  };

  var modal = document.getElementById('reg');
  if (modal) {
    var dialog    = modal.querySelector('.reg__dialog');
    var formState = document.getElementById('regFormState');
    var okState   = document.getElementById('regSuccessState');
    var regForm   = document.getElementById('regForm');
    var lastFocus = null;

    // Surface the confirmed time label wherever it appears.
    ['regWhen', 'regWhenSuccess'].forEach(function (id) {
      var n = document.getElementById(id);
      if (n) n.textContent = WEBINAR.whenLabel + (id === 'regWhen' ? ' · 45 min + live Q&A' : '');
    });

    function openModal(e) {
      if (e) e.preventDefault();
      lastFocus = document.activeElement;
      modal.classList.add('is-open');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      var first = modal.querySelector('input, button');
      if (first) first.focus();
    }
    function closeModal() {
      modal.classList.remove('is-open');
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      if (lastFocus) lastFocus.focus();
    }

    document.querySelectorAll('[data-register]').forEach(function (btn) {
      btn.addEventListener('click', openModal);
    });
    modal.querySelectorAll('[data-reg-close]').forEach(function (el) {
      el.addEventListener('click', closeModal);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && modal.classList.contains('is-open')) closeModal();
    });

    /* ---- Calendar link builders ---- */
    function enc(s) { return encodeURIComponent(s); }
    function isoOffset(utc) {  // 20260728T170000Z -> 2026-07-28T17:00:00Z
      return utc.replace(/^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})Z$/,
        '$1-$2-$3T$4:$5:$6Z');
    }
    function fullDescription() { return WEBINAR.description + WEBINAR.joinUrl; }

    function googleUrl() {
      return 'https://calendar.google.com/calendar/render?action=TEMPLATE' +
        '&text=' + enc(WEBINAR.title) +
        '&dates=' + WEBINAR.start + '/' + WEBINAR.end +
        '&details=' + enc(fullDescription()) +
        '&location=' + enc(WEBINAR.joinUrl);
    }
    function outlookUrl() {
      return 'https://outlook.live.com/calendar/0/deeplink/compose?path=/calendar/action/compose&rru=addevent' +
        '&subject=' + enc(WEBINAR.title) +
        '&startdt=' + enc(isoOffset(WEBINAR.start)) +
        '&enddt=' + enc(isoOffset(WEBINAR.end)) +
        '&body=' + enc(fullDescription()) +
        '&location=' + enc(WEBINAR.joinUrl);
    }
    function icsBlobUrl() {
      function stamp(d) {
        return d.getUTCFullYear() +
          ('0' + (d.getUTCMonth() + 1)).slice(-2) +
          ('0' + d.getUTCDate()).slice(-2) + 'T' +
          ('0' + d.getUTCHours()).slice(-2) +
          ('0' + d.getUTCMinutes()).slice(-2) +
          ('0' + d.getUTCSeconds()).slice(-2) + 'Z';
      }
      var ics = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//Kyle & Co//Candidate Fraud Webinar//EN',
        'CALSCALE:GREGORIAN',
        'METHOD:PUBLISH',
        'BEGIN:VEVENT',
        'UID:candidate-fraud-webinar-20260728@kyleandco.com',
        'DTSTAMP:' + stamp(new Date()),
        'DTSTART:' + WEBINAR.start,
        'DTEND:' + WEBINAR.end,
        'SUMMARY:' + WEBINAR.title,
        'DESCRIPTION:' + fullDescription().replace(/,/g, '\\,'),
        'LOCATION:' + WEBINAR.joinUrl,
        'URL:' + WEBINAR.joinUrl,
        'END:VEVENT',
        'END:VCALENDAR'
      ].join('\r\n');
      return URL.createObjectURL(new Blob([ics], { type: 'text/calendar' }));
    }

    function wireCalendar() {
      var g = document.getElementById('calGoogle');
      var o = document.getElementById('calOutlook');
      var i = document.getElementById('calIcs');
      if (g) g.href = googleUrl();
      if (o) o.href = outlookUrl();
      if (i) i.href = icsBlobUrl();
    }

    /* ---- Submit: native POST goes to the hidden iframe (MailerLite),
            then we reveal the calendar step. ---- */
    if (regForm) {
      regForm.addEventListener('submit', function () {
        // let the native POST fire into target=reg_sink, then swap states
        wireCalendar();
        setTimeout(function () {
          formState.hidden = true;
          okState.hidden = false;
          dialog.scrollTop = 0;
          var g = document.getElementById('calGoogle');
          if (g) g.focus();
        }, 350);
        if (window.console) console.log('[track]', 'webinar-register-submit');
      });
    }
  }
})();
