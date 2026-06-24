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
    '.finding-list li', '.bignum', '.numbers__line',
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
})();
