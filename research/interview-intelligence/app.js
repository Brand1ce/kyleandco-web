(function () {
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var html = document.documentElement;

  /* progress + current section in the side nav */
  var prog = $('#progress');
  function onScroll() { prog.style.width = (100 * window.pageYOffset / Math.max(1, html.scrollHeight - html.clientHeight)) + '%'; }
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();
  var links = $$('#side [data-sec]');
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (!e.isIntersecting) return;
      var id = e.target.id;
      links.forEach(function (a) { var on = a.dataset.sec === id; a.classList.toggle('on', on); if (on) a.scrollIntoView({ block: 'nearest' }); });
    });
  }, { rootMargin: '-35% 0px -60% 0px' });
  $$('main section[id], main details[id]').forEach(function (s) { io.observe(s); });

  /* nav or pair links open the item they point to */
  function openTo(id) {
    var el = document.getElementById(id); if (!el) return false;
    if (el.tagName === 'DETAILS') el.open = true;
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    return true;
  }
  $$('a[href^="#"]').forEach(function (a) {
    var id = a.getAttribute('href').slice(1);
    if (!id) return;
    a.addEventListener('click', function (e) {
      var el = document.getElementById(id);
      if (el && el.tagName === 'DETAILS') { e.preventDefault(); openTo(id); history.replaceState(null, '', '#' + id); }
      side.classList.remove('open'); mb.setAttribute('aria-expanded', false);
    });
  });
  if (location.hash) setTimeout(function () { openTo(location.hash.slice(1)); }, 150);

  /* phone menu */
  var side = $('#side'), mb = $('#menu-btn');
  mb.addEventListener('click', function () { var o = side.classList.toggle('open'); mb.setAttribute('aria-expanded', o); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') side.classList.remove('open'); });

  /* maturity model */
  $$('.mm').forEach(function (mm) {
    $$('.mm-step', mm).forEach(function (b) {
      b.addEventListener('click', function () {
        $$('.mm-step', mm).forEach(function (x) { x.setAttribute('aria-pressed', x === b); });
        $$('.mm-d', mm).forEach(function (d) { d.hidden = d.dataset.l !== b.dataset.l; });
      });
    });
  });

  /* reveal + charts draw in (figures inside closed accordions draw when opened) */
  var rv = new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); rv.unobserve(e.target); } });
  }, { rootMargin: '0px 0px -8% 0px', threshold: .15 });
  $$('.reveal, .fig').forEach(function (r) { rv.observe(r); });
})();
