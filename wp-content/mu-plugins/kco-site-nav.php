<?php
/**
 * Plugin Name: Kyle & Co site nav on blog posts
 * Description: Replaces the Astra theme header on single blog posts with the same top nav the static site uses.
 * Source of truth for the nav markup and styles: index.html (.topbar) and assets/site.css. Keep in sync.
 * To turn off: replace this file's contents with "<?php" (deploys don't delete files).
 */
if (!defined('ABSPATH')) { exit; }

function kco_site_nav_active() {
  return !is_admin() && function_exists('is_singular') && is_singular('post');
}

add_action('wp_head', function () {
  if (!kco_site_nav_active()) { return; }
  echo <<<'HTML'
<style id="kco-site-nav-css">
@font-face{font-family:'Roboto';src:url('/assets/fonts/Roboto-Regular.ttf') format('truetype');font-weight:400;font-display:swap}
@font-face{font-family:'Roboto';src:url('/assets/fonts/Roboto-Medium.ttf') format('truetype');font-weight:500;font-display:swap}
#masthead,.site-header{display:none!important}
body{padding-top:60px}
#kco-topbar{position:fixed;top:0;left:0;right:0;z-index:9999;background:#F7F1EA;padding:0 2.5rem;display:flex;align-items:center;justify-content:space-between;height:60px;border-bottom:1px solid rgba(39,55,82,.08);-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px);font-family:'Roboto',-apple-system,system-ui,sans-serif;box-sizing:border-box}
#kco-topbar *{box-sizing:border-box}
.admin-bar #kco-topbar{top:32px}
#kco-topbar .topbar-brand{display:inline-flex;align-items:center;text-decoration:none}
#kco-topbar .topbar-brand img{height:24px;width:auto;display:block}
#kco-topbar .topbar-nav{display:flex;gap:1.85rem;align-items:center}
#kco-topbar .topbar-nav a{font-family:'Roboto',-apple-system,system-ui,sans-serif;font-size:.85rem;font-weight:400;color:rgba(39,55,82,.7);text-decoration:none;transition:color .15s;line-height:1.4}
#kco-topbar .topbar-nav a:hover,#kco-topbar .topbar-nav a.active{color:#273752}
#kco-topbar .topbar-cta{background:#273752;color:#F7F1EA;text-decoration:none;font-size:.8rem;font-weight:500;padding:.55rem 1.15rem;border-radius:100px;white-space:nowrap;font-family:'Roboto',-apple-system,system-ui,sans-serif;transition:background .2s;line-height:1.4}
#kco-topbar .topbar-cta:hover{background:#1A2438;color:#F7F1EA}
#kco-topbar .nav-toggle{display:none}
#kco-topbar .topbar-nav .mobile-cta{display:none}
#kco-topbar .kco-rd{position:relative;display:inline-block}
#kco-topbar .kco-rd>a::after{content:" \25BE";font-size:.7em;opacity:.6}
#kco-topbar .kco-rd-menu{position:absolute;top:100%;left:0;min-width:180px;background:#fff;border:1px solid rgba(39,55,82,.12);border-radius:10px;box-shadow:0 12px 30px rgba(39,55,82,.14);padding:.4rem;opacity:0;visibility:hidden;transform:translateY(6px);transition:opacity .16s ease,transform .16s ease;z-index:1000}
#kco-topbar .kco-rd:hover .kco-rd-menu,#kco-topbar .kco-rd:focus-within .kco-rd-menu{opacity:1;visibility:visible;transform:translateY(0)}
#kco-topbar .kco-rd .kco-rd-menu a{display:block;padding:.5rem .7rem;font-size:.88rem;line-height:1.2;color:#273752;text-decoration:none;border-radius:6px;white-space:nowrap}
#kco-topbar .kco-rd .kco-rd-menu a:hover{background:rgba(39,55,82,.07)}
@media (max-width:900px){
  body{padding-top:56px}
  #kco-topbar{padding:0 1.25rem;height:56px}
  #kco-topbar .nav-toggle{display:flex;flex-direction:column;justify-content:center;gap:5px;background:none;border:0;cursor:pointer;padding:.5rem;margin:0 -.5rem 0 auto}
  #kco-topbar .nav-toggle span{display:block;width:22px;height:2px;background:#273752;border-radius:2px;transition:transform .25s,opacity .2s}
  #kco-topbar.nav-open .nav-toggle span:nth-child(1){transform:translateY(7px) rotate(45deg)}
  #kco-topbar.nav-open .nav-toggle span:nth-child(2){opacity:0}
  #kco-topbar.nav-open .nav-toggle span:nth-child(3){transform:translateY(-7px) rotate(-45deg)}
  #kco-topbar .topbar-cta{display:none}
  #kco-topbar .topbar-nav{display:none;position:fixed;top:56px;left:0;right:0;flex-direction:column;align-items:stretch;gap:0;background:#F7F1EA;border-bottom:1px solid rgba(39,55,82,.1);box-shadow:0 8px 24px rgba(39,55,82,.10);padding:.25rem 1.25rem 1.25rem;max-height:calc(100vh - 56px);overflow-y:auto}
  #kco-topbar.nav-open .topbar-nav{display:flex}
  #kco-topbar .topbar-nav a{padding:.95rem .25rem;font-size:1rem;color:#273752;border-bottom:1px solid rgba(39,55,82,.07)}
  #kco-topbar .topbar-nav .mobile-cta{display:block;text-align:center;margin-top:1.1rem;border-bottom:0;background:#273752;color:#F7F1EA;text-decoration:none;font-size:.9rem;font-weight:500;padding:.85rem 1.15rem;border-radius:100px}
  #kco-topbar .kco-rd{display:block}
  #kco-topbar .kco-rd-menu{position:static;opacity:1;visibility:visible;transform:none;box-shadow:none;border:0;background:none;padding:0 0 0 .75rem;min-width:0}
}
@media (max-width:782px){.admin-bar #kco-topbar{top:46px}}
</style>
HTML;
}, 99);

add_action('wp_body_open', function () {
  if (!kco_site_nav_active()) { return; }
  echo <<<'HTML'
<nav class="topbar" id="kco-topbar">
  <a href="/" class="topbar-brand"><img src="/assets/img/logo-primary.svg" alt="Kyle &amp; Co"></a>
  <div class="topbar-nav">
    <a href="/">Home</a>
    <span class="kco-rd">
      <a href="/research/">Resources</a>
      <div class="kco-rd-menu">
        <a href="/research/#research">Research</a>
        <a href="/research/#podcasts">Podcasts</a>
        <a href="/research/#hosted">Webinars</a>
        <a href="/research/#appearances">Appearances</a>
      </div>
    </span>
    <a href="/vendors/">For Vendors</a>
    <a href="/aicouncil">AI Council</a>
    <a href="/blog" class="active">Blog</a>
  </div>
  <a href="/#contact" class="topbar-cta">Book a discovery call</a>
</nav>
<script src="/assets/site.js" defer></script>
HTML;
});
