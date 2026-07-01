/* Shared site behavior. Currently: mobile nav (hamburger menu). */
(function () {
  function initNav(bar) {
    var nav = bar.querySelector('.topbar-nav');
    if (!nav || bar.dataset.navReady) return;
    bar.dataset.navReady = '1';

    // Hamburger toggle
    var btn = document.createElement('button');
    btn.className = 'nav-toggle';
    btn.type = 'button';
    btn.setAttribute('aria-label', 'Menu');
    btn.setAttribute('aria-expanded', 'false');
    btn.innerHTML = '<span></span><span></span><span></span>';
    bar.appendChild(btn);

    // Surface the primary CTA inside the open menu on mobile
    var cta = bar.querySelector('.topbar-cta');
    if (cta) {
      var mCta = cta.cloneNode(true);
      mCta.classList.add('mobile-cta');
      mCta.classList.remove('topbar-cta');
      nav.appendChild(mCta);
    }

    function close() {
      bar.classList.remove('nav-open');
      btn.setAttribute('aria-expanded', 'false');
    }

    btn.addEventListener('click', function () {
      var open = bar.classList.toggle('nav-open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });

    // Close after tapping any link/CTA in the menu
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) close();
    });

    // Reset when returning to desktop width
    window.addEventListener('resize', function () {
      if (window.innerWidth > 900) close();
    });
  }

  function init() {
    document.querySelectorAll('.topbar').forEach(initNav);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
