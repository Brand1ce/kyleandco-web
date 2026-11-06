(function () {
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* Access gate. A known email goes straight to the PDF (MailerLite via api/gate.php; fails open).
     Once someone has been through the gate, a localStorage flag makes every button a direct PDF link. */
  var KEYS = ['yb26_access', 'ii_report_access'];   // the Interview Intelligence flag also counts: that reader is already on the list
  var SET = 'yb26_access', ENDPOINT = 'api/gate.php';
  var pdf = $('#gateOpen').getAttribute('href');
  var forms = $('#gateForms'), done = $('#gateDone');
  var email = $('#gateEmail'), s1 = $('#gateEmailForm'), s2 = $('#gateNewForm');

  function known() {
    try { return KEYS.some(function (k) { return localStorage.getItem(k) === '1'; }); } catch (e) { return false; }
  }
  function direct() {
    $$('[data-pdf]').forEach(function (a) { a.innerHTML = 'Read the Yearbook <span aria-hidden="true">→</span>'; });
  }
  function openForm() {
    $('#gateOpen').hidden = true; forms.hidden = false;
    $('#gate').scrollIntoView({ behavior: 'smooth', block: 'center' });
    setTimeout(function () { email.focus(); }, 250);
  }
  function unlock() {
    try { localStorage.setItem(SET, '1'); } catch (e) {}
    if (window.gtag) window.gtag('event', 'generate_lead', { content_type: 'report_gate', item_id: 'talent_class_of_2026' });
    forms.hidden = true; done.hidden = false; direct();
    setTimeout(function () { window.location.href = pdf; }, 400);
  }

  if (known()) { direct(); return; }

  $$('[data-pdf]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      if (known()) return;                 // flag set in another tab: let the link through
      e.preventDefault();
      if (forms.hidden && done.hidden) openForm(); else { $('#gate').scrollIntoView({ behavior: 'smooth', block: 'center' }); }
    });
  });

  function post(body) {
    return fetch(ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      .then(function (r) { return r.json(); });
  }
  s1.addEventListener('submit', function (e) {
    e.preventDefault();
    var b = $('#gateEmailSubmit'), label = b.innerHTML; b.disabled = true; b.textContent = '…';
    post({ email: email.value.trim() })
      .then(function (d) {
        if (d && d.status === 'new') { s1.hidden = true; s2.hidden = false; $('input', s2).focus(); }
        else if (d && d.status === 'error') { email.setCustomValidity('Please enter a valid email'); email.reportValidity(); email.setCustomValidity(''); }
        else unlock();
      })
      .catch(unlock)
      .then(function () { b.disabled = false; b.innerHTML = label; });
  });
  s2.addEventListener('submit', function (e) {
    e.preventDefault();
    var v = function (n) { return (s2.querySelector('[name="' + n + '"]').value || '').trim(); };
    $('#gateNewSubmit').disabled = true;
    post({ email: email.value.trim(), subscribe: true, name: v('name'), last_name: v('last_name'), company: v('company') })
      .then(unlock, unlock);
  });
})();
