(function () {
  var SEARCH = {"Can interviewers tell if you are using AI?": "Only 36 percent always ask every candidate the same core questions against a defined rubric.", "Is it okay to use AI during an interview?": "Two candidates can use the same tools in the same way and receive different treatment because their interviewers apply different rules.", "Why do companies go silent after an interview?": "Ghosting often reveals a gap in ownership: the decision has been made, but nobody is clearly responsible for communicating it.", "How should I give feedback to rejected candidates?": "Making feedback available on request can sound reasonable while producing an uneven result.", "Is 4 rounds of interviews too much?": "Interview stages can accumulate like organizational scar tissue: one bad hire creates a hurdle that every subsequent candidate has to clear.", "Which is more reliable, a structured or unstructured interview?": "Structured interviews have ranked at or near the top of selection-validity research for decades", "Do you need consent to record with AI?": "Recording an interview between people and assigning AI responsibility for conducting or evaluating it are materially different uses of technology.", "How to measure quality of hire": "Our research suggests why the distance between priority and practice persists", "Interview intelligence ROI": "Establishing whether it improves hiring takes a different kind of evidence."};
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var norm = function (t) { return t.replace(/\s+/g, ' ').trim(); };
  var html = document.documentElement;
  html.style.scrollBehavior = 'smooth';

  /* ---- progress, current section ---- */
  var prog = $('#progress'), tb = $('#tbSec'), links = $$('#side [data-sec]');
  function onScroll() {
    var y = window.pageYOffset;
    prog.style.width = (100 * y / Math.max(1, html.scrollHeight - html.clientHeight)) + '%';
  }
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (!e.isIntersecting) return;
      var id = e.target.id;
      links.forEach(function (a) { var on = a.dataset.sec === id; a.classList.toggle('on', on); if (on) a.scrollIntoView({ block: 'nearest' }); });
      if (tb) tb.textContent = e.target.dataset.name || '';
    });
  }, { rootMargin: '-40% 0px -55% 0px' });
  $$('main section[id]').forEach(function (s) { io.observe(s); });

  /* ---- arrived from the summary: offer the way back to the same card ---- */
  var from = (location.search.match(/[?&]from=([\w-]+)/) || [])[1];
  var back = $('#back-sum'), backSide = $('#back-sum-side');
  if (from && back) {
    back.href = 'index.html#' + from; back.hidden = false;
    if (backSide) backSide.href = back.href;
    var sec = document.getElementById(from.replace(/^l-/, ''));
    if (sec) $$('details.more', sec).forEach(function (d) { d.open = true; });
  }

  /* ---- phone menu ---- */
  var side = $('#side'), mb = $('#menu-btn');
  mb.addEventListener('click', function () { var o = side.classList.toggle('open'); mb.setAttribute('aria-expanded', o); });
  $$('#side a').forEach(function (a) { a.addEventListener('click', function () { side.classList.remove('open'); mb.setAttribute('aria-expanded', false); }); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') side.classList.remove('open'); });

  /* ---- search callouts scroll to the answering sentence ---- */
  function jumpTo(hit) {
    var dd = hit.closest('details'); while (dd) { dd.open = true; dd = dd.parentElement && dd.parentElement.closest('details'); }
    hit.scrollIntoView({ behavior: 'smooth', block: 'center' });
    hit.classList.remove('flash'); void hit.offsetWidth; hit.classList.add('flash');
    setTimeout(function () { hit.classList.remove('flash'); }, 2600);
  }
  $$('.qbar').forEach(function (b) {
    b.addEventListener('click', function () {
      var ans = SEARCH[norm(b.dataset.q)]; if (!ans) return;
      var hit = $$('.hl').filter(function (h) { return norm(h.textContent).indexOf(ans) === 0; })[0];
      if (hit) jumpTo(hit);
    });
  });

  /* ---- tiles open their finding ---- */
  function openTo(id) {
    var el = document.getElementById(id); if (!el) return false;
    if (el.tagName === 'DETAILS') el.open = true;
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    return true;
  }
  $$('a[href^="#mf-"], a[href^="#tk-"]').forEach(function (a) {
    a.addEventListener('click', function (e) { if (openTo(a.getAttribute('href').slice(1))) e.preventDefault(); });
  });
  if (location.hash) setTimeout(function () { openTo(location.hash.slice(1)); }, 200);

  /* ---- maturity model: pick a level ---- */
  $$('.mm').forEach(function (mm) {
    $$('.mm-step', mm).forEach(function (b) {
      b.addEventListener('click', function () {
        $$('.mm-step', mm).forEach(function (x) { x.setAttribute('aria-pressed', x === b); });
        $$('.mm-d', mm).forEach(function (d) { d.hidden = d.dataset.l !== b.dataset.l; });
      });
    });
  });

  /* ---- reveal + charts draw in ---- */
  $$('.mc-group').forEach(function (g, i) { $$('.mc-row', g).forEach(function (b, k) { b.style.setProperty('--i', k + (i % 8)); }); });
  $$('.stairs .step, .mstair .ms-step').forEach(function (s, i) { s.style.setProperty('--i', i % 5); });
  var rv = new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); rv.unobserve(e.target); } });
  }, { rootMargin: '0px 0px -8% 0px' });
  $$('.reveal').forEach(function (r) { rv.observe(r); });
  var draw = new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('go'); draw.unobserve(e.target); } });
  }, { threshold: .3 });
  $$('.art, .stairs, .stair-wrap, .mm').forEach(function (a) { draw.observe(a); });

  /* ---- report highlights: the page cut down to the 50 highlighted sentences, by section ---- */
  var hb = $('#hl-btn'), hv = $('#highlights'), savedY = 0;
  if (!hb || !hv) return;
  function hlMode(on) {
    if (on) savedY = window.pageYOffset;
    document.body.classList.toggle('hl-mode', on); hv.hidden = !on; hb.setAttribute('aria-pressed', on);
    html.style.scrollBehavior = 'auto';
    if (on) window.scrollTo(0, 0); else window.scrollTo(0, savedY);
    html.style.scrollBehavior = 'smooth';
  }
  hb.addEventListener('click', function () { side.classList.remove('open'); hlMode(!document.body.classList.contains('hl-mode')); });
  $('#hl-close').addEventListener('click', function () { hlMode(false); });
  $$('.hxs').forEach(function (a) {
    a.addEventListener('click', function (e) {
      e.preventDefault();
      var t = norm(a.textContent); hlMode(false);
      var hit = $$('.hl').filter(function (h) { return norm(h.textContent) === t; })[0]; if (hit) jumpTo(hit);
    });
  });
})();
