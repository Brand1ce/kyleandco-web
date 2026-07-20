/* Audit overlay behavior — toggle pins, open drawer, page-swap memory */
(function() {
  // Restore annotation state across pages
  const stored = localStorage.getItem('kc-annot') === '1';
  if (stored) document.body.classList.add('show-annotations');

  function init() {
    const toggle = document.querySelector('.audit-toggle');
    if (toggle) {
      toggle.addEventListener('click', function() {
        const on = document.body.classList.toggle('show-annotations');
        localStorage.setItem('kc-annot', on ? '1' : '0');
        if (!on) closeDrawer();
      });
    }

    const drawer = document.querySelector('.callout-drawer');
    const drawerPinEl = drawer && drawer.querySelector('.callout-drawer-pin');
    const drawerTitleEl = drawer && drawer.querySelector('.callout-drawer-title');
    const drawerBodyEl = drawer && drawer.querySelector('.callout-drawer-body');
    const closeBtn = drawer && drawer.querySelector('.callout-drawer-close');

    function closeDrawer() {
      if (drawer) drawer.classList.remove('is-open');
      document.querySelectorAll('.pin.is-active').forEach(p => p.classList.remove('is-active'));
    }
    if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeDrawer(); });

    document.querySelectorAll('.pin').forEach(pin => {
      pin.addEventListener('click', function(e) {
        e.stopPropagation();
        const id = pin.getAttribute('data-callout');
        const data = window.KC_CALLOUTS && window.KC_CALLOUTS[id];
        if (!data || !drawer) return;
        document.querySelectorAll('.pin.is-active').forEach(p => p.classList.remove('is-active'));
        pin.classList.add('is-active');
        drawerPinEl.textContent = pin.textContent.trim();
        drawerTitleEl.innerHTML = data.title;
        drawerBodyEl.innerHTML = data.body;
        drawer.classList.add('is-open');
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
