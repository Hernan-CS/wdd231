import { saveSetting, getSetting } from './modules/storage.js';

document.addEventListener('DOMContentLoaded', init);

function init() {
  setupHeader();
  swapLogos();
  populateLastModified();
  restoreState();
}

/* Responsive Logo */
function swapLogos(){
  const headerLogo = document.getElementById("header-logo");
  const footerLogo = document.getElementById("footer-logo");

  function updateLogo(){
    if (window.matchMedia("(min-width:900px)").matches){
      headerLogo.src = "images/myg-large-logo.png";
      footerLogo.src = "images/myg-logo.png";
    } else {
      headerLogo.src = "images/myg-logo.png";
      footerLogo.src = "images/myg-logo.png";
    }
  }

  updateLogo();
  window.addEventListener("resize", updateLogo);
}

/* Header Nav Toggle & Active Page */
function setupHeader(){
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.getElementById('main-nav');
  const links = document.querySelectorAll('.main-nav .nav-link');

  toggle?.addEventListener('click', () => {
    const expanded = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!expanded));
    nav.style.display = expanded ? 'none' : 'block';
  });

  const current = location.pathname.split('/').pop();
  links.forEach(link => {
    const page = link.dataset.page;
    if (current.includes(page)) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    }
  });
}

/* Footer Last Modified */
function populateLastModified(){
  const lastEl = document.getElementById('last-mod');
  const yearEl = document.getElementById('year');
  if (lastEl) lastEl.textContent = document.lastModified;
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}

/* Saved State */
function restoreState(){
  const lastCTA = getSetting('lastCTA');
  if (lastCTA) console.log('Last CTA at', lastCTA);
}

(function(){
  const links = document.querySelectorAll('a.btn');
  for (const link of links) {
    link.addEventListener('click', e => {
    });
  }
})();
