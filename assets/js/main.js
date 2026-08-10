/**
 * main.js — page bootstrap.
 *
 * Single responsibility: wire up page-level behavior (topbar shrink-on-scroll)
 * and start the language engine. Language logic itself lives in i18n.js.
 */
function initTopbarShrink(){
  const topbar = document.querySelector('.topbar');
  if(!topbar) return;
  const onScroll = () => topbar.classList.toggle('scrolled', window.scrollY > 40);
  window.addEventListener('scroll', onScroll, {passive:true});
  onScroll();
}

initTopbarShrink();
I18n.init();
