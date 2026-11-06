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
#kco-topbar{position:fixed;top:0;left:0;right:0;z-index:9999;background:#F7F1EA;padding:0 2.5rem;display:flex;align-items:center;justify-content:space-between;height:60px}
#kco-topbar *{box-sizing:border-box}
.admin-bar #kco-topbar{top:32px}
#kco-topbar .topbar-brand{display:inline-flex;align-items:center;text-decoration:none}
#kco-topbar .topbar-brand img{height:24px;width:auto;display:block}
#kco-topbar .topbar-nav{display:flex;gap:.25rem;align-items:center}
#kco-topbar .topbar-nav a{font-family:'Roboto',-apple-system,system-ui,sans-serif;font-size:.9375rem;font-weight:400;color:#273752;text-decoration:none;transition:background .15s;line-height:1.4;padding:.6rem 1.1rem;border-radius:999px}
#kco-topbar .topbar-nav a:hover{background:#EAE7ED}
#kco-topbar .topbar-nav a.active{background:#EAE7ED;font-weight:500}
#kco-topbar .topbar-cta{background:#273752;color:#F7F1EA;text-decoration:none;font-size:.8rem;font-weight:500;padding:.55rem 1.15rem;border-radius:999px;white-space:nowrap;font-family:'Roboto',-apple-system,system-ui,sans-serif;transition:background .2s;line-height:1.4}
#kco-topbar .topbar-cta:hover{background:#244065;color:#F7F1EA}
#kco-topbar .nav-toggle{display:none}
#kco-topbar .topbar-nav .mobile-cta{display:none}
#kco-topbar .kco-rd{position:relative;display:inline-block}
#kco-topbar .kco-rd>a::after{content:"";display:inline-block;width:.38em;height:.38em;margin:0 0 .2em .5em;border-right:1.5px solid currentColor;border-bottom:1.5px solid currentColor;transform:rotate(45deg)}
#kco-topbar .kco-rd-menu{position:absolute;top:100%;left:0;min-width:190px;background:#fff;border-radius:20px;box-shadow:0 2px 8px rgba(39,55,82,.07);padding:.5rem;opacity:0;visibility:hidden;transition:opacity .16s ease;z-index:1000}
#kco-topbar .kco-rd:hover .kco-rd-menu,#kco-topbar .kco-rd:focus-within .kco-rd-menu{opacity:1;visibility:visible}
#kco-topbar .kco-rd .kco-rd-menu a{display:block;white-space:nowrap}
@media (max-width:900px){
  body{padding-top:56px}
  #kco-topbar{padding:0 1.25rem;height:56px}
  #kco-topbar .nav-toggle{display:flex;flex-direction:column;justify-content:center;gap:5px;background:none;border:0;cursor:pointer;padding:.5rem;margin:0 -.5rem 0 auto}
  #kco-topbar .nav-toggle span{display:block;width:22px;height:2px;background:#273752;border-radius:2px;transition:transform .25s,opacity .2s}
  #kco-topbar.nav-open .nav-toggle span:nth-child(1){transform:translateY(7px) rotate(45deg)}
  #kco-topbar.nav-open .nav-toggle span:nth-child(2){opacity:0}
  #kco-topbar.nav-open .nav-toggle span:nth-child(3){transform:translateY(-7px) rotate(-45deg)}
  #kco-topbar .topbar-cta{display:none}
  #kco-topbar .topbar-nav{display:none;position:fixed;top:56px;left:0;right:0;flex-direction:column;align-items:stretch;gap:0;background:#F7F1EA;box-shadow:0 2px 8px rgba(39,55,82,.07);padding:.25rem 1.25rem 1.25rem;max-height:calc(100vh - 56px);overflow-y:auto}
  #kco-topbar.nav-open .topbar-nav{display:flex}
  #kco-topbar .topbar-nav a{padding:.95rem 1rem;font-size:1rem}
  #kco-topbar .topbar-nav .mobile-cta{display:block;text-align:center;margin-top:1.1rem;background:#273752;color:#F7F1EA;font-size:.9rem;font-weight:500;padding:.85rem 1.15rem}
  #kco-topbar .kco-rd{display:block}
  #kco-topbar .kco-rd-menu{position:static;opacity:1;visibility:visible;box-shadow:none;background:none;padding:0 0 0 1rem;min-width:0}
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
  <a href="/insights-signup/" class="topbar-cta">Stay in the Loop</a>
</nav>
<script src="/assets/site.js" defer></script>
HTML;
});
