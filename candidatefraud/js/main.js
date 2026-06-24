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
  document.querySelectorAll('[data-track]').forEach(function (el) {
    el.addEventListener('click', function () {
      var name = el.getAttribute('data-track');
      // TODO(Claude Code): forward to analytics
      if (window.console) console.log('[track]', name);
    });
  });

  /* ============================================================
     Webinar registration modal + Add-to-Calendar
     ------------------------------------------------------------
     ⚠️  SET THESE TWO THINGS BEFORE LAUNCH (everything else flows
     from this one block):
       1. start / end  — exact webinar time, in UTC.
       2. joinUrl      — the shared join link (Zoom / Meet / Teams).
     Times use UTC ('Z') so calendar files need no timezone tables.
     Placeholder below = Tue Jul 28 2026, 1:00 PM ET (= 17:00 UTC).
     ============================================================ */
  var WEBINAR = {
    title: 'Who owns the seam? A working session on candidate-fraud response',
    start: '20260728T170000Z',           // ⚠️ CONFIRM real start (UTC). 17:00Z = 1:00 PM ET (EDT).
    end:   '20260728T180000Z',           // 60 min (45 min live + 15 min Q&A)
    whenLabel: 'Tuesday, July 28, 2026 · 1:00 PM ET',  // ⚠️ keep in sync with start
    joinUrl: 'https://kyleandco.com/candidatefraud/',  // ⚠️ REPLACE with the live join link
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
