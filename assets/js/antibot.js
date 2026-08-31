/* Kyle & Co lightweight anti-bot for MailerLite forms.
   Two free signals, no CAPTCHA:
   1) Honeypot: a hidden "website" field bots fill and humans never see.
   2) Time-trap: block submits that happen under 2.5s after the first field focus.
   Guards at document capture so it runs before inline/React submit handlers.
   Only touches forms whose action points at mailerlite.com. */
(function () {
  var MIN_MS = 2500;
  var HP = 'website';

  function isML(f) {
    var a = f && f.getAttribute && f.getAttribute('action');
    return !!a && /mailerlite\.com/i.test(a);
  }

  // Inject the honeypot for plain-HTML forms. React forms carry it in their
  // own markup, so this skips them (querySelector finds it) and never mutates
  // React-managed DOM.
  function addHoneypot(f) {
    if (f.__kcoHP) return;
    f.__kcoHP = true;
    if (f.querySelector('input[name="' + HP + '"]')) return;
    var w = document.createElement('div');
    w.setAttribute('aria-hidden', 'true');
    w.style.cssText = 'position:absolute;left:-9999px;top:auto;width:1px;height:1px;overflow:hidden;';
    var i = document.createElement('input');
    i.type = 'text';
    i.name = HP;
    i.tabIndex = -1;
    i.autocomplete = 'off';
    i.setAttribute('aria-hidden', 'true');
    w.appendChild(i);
    f.appendChild(w);
  }

  function scan() {
    var fs = document.getElementsByTagName('form');
    for (var i = 0; i < fs.length; i++) { if (isML(fs[i])) addHoneypot(fs[i]); }
  }

  document.addEventListener('DOMContentLoaded', scan);

  // First interaction stamps the form so we can measure time-to-submit.
  document.addEventListener('focusin', function (e) {
    var f = e.target && e.target.form;
    if (f && isML(f) && !f.__kcoTouch) f.__kcoTouch = Date.now();
  });

  document.addEventListener('submit', function (e) {
    var f = e.target;
    if (!f || f.tagName !== 'FORM' || !isML(f)) return;
    var hp = f.querySelector('input[name="' + HP + '"]');
    var filled = hp && hp.value;
    var fast = f.__kcoTouch && (Date.now() - f.__kcoTouch) < MIN_MS;
    if (filled || fast) {
      e.preventDefault();
      e.stopImmediatePropagation();
    }
  }, true);
})();
