import { openModal } from './modules/modal.js';
import { saveSetting, getSetting } from './modules/storage.js';

const TESTIMONIES_URL = 'data/testimonies.json';

document.addEventListener('DOMContentLoaded', init);

function init() {
  setupHeader();
  swapLogos();
  loadTestimonies();
  setupCTA();
  populateLastModified();
  restoreState();
}

/* SWITCH LOGOS*/
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

/* NAV TOGGLE & WAYFINDING */
function setupHeader(){
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.getElementById('main-nav');
  const links = document.querySelectorAll('.main-nav .nav-link');

  toggle?.addEventListener('click', () => {
    const expanded = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!expanded));
    nav.style.display = expanded ? 'none' : 'block';
  });

  const current = location.pathname.split('/').pop() || 'myg-home.html';
  links.forEach(link => {
    const page = link.dataset.page;
    if (current.includes(page)) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    }
  });
}

/* CTA */
function setupCTA(){
  const cta = document.getElementById('cta-join');
  cta?.addEventListener('click', () => {
    saveSetting('lastCTA', new Date().toISOString());
    location.href = 'myg-join.html';
  });
}

/* LAST MODIFIED */
function populateLastModified(){
  const lastEl = document.getElementById('last-mod');
  const yearEl = document.getElementById('year');
  if (lastEl) lastEl.textContent = document.lastModified || 'Unknown';
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}

/* RESTORE */
function restoreState(){
  const lastCTA = getSetting('lastCTA');
  if (lastCTA) console.log('User last clicked CTA at', lastCTA);
}

/* TESTIMONIES CARD RANDOMIZER */
async function loadTestimonies(){
  const container = document.getElementById('testimony-list');
  if (!container) return;

  try {
    const res = await fetch(TESTIMONIES_URL, {cache:'no-cache'});
    if (!res.ok) throw new Error(`Failed to load: ${res.status}`);

    const data = await res.json();

    const shuffled = data.sort(() => Math.random() - 0.5);

    const selected = shuffled.slice(0, 4);

    selected.forEach((person, idx) => {
      container.appendChild(createTestimonyCard(person, idx));
    });

  } catch(err){
    console.error(err);
    container.innerHTML = `<p class="error">Sorry — we couldn't load testimonies right now.</p>`;
  }
}

/* CARD CREATOR */
function createTestimonyCard(person, idx){
  const card = document.createElement('article');
  card.className = 'testimony-card';
  card.tabIndex = 0;
  card.dataset.id = person.id || idx;

  const thumb = document.createElement('div');
  thumb.className = 'testimony-thumb';
  const img = document.createElement('img');
  img.loading = 'lazy';
  img.alt = `${person.name} portrait`;
  img.src = person.image || '';
  thumb.appendChild(img);

  const body = document.createElement('div');
  body.className = 'testimony-body';

  const meta = document.createElement('div');
  meta.className = 'testimony-meta';
  meta.textContent = `${person.name} · ${person.age} · ${person.country}`;

  const short = document.createElement('p');
  short.className = 'testimony-text';
  short.textContent =
    person.testimony.length > 120
      ? person.testimony.slice(0,120)+"…"
      : person.testimony;

  const readMore = document.createElement('button');
  readMore.className = 'read-more';
  readMore.textContent = 'Read more';
  readMore.addEventListener('click', () => {
    openModal({
      title:`${person.name} — Testimony`,
      content:`
        <p><strong>${person.name}</strong> · ${person.age} · ${person.country}</p>
        <p>${person.testimony}</p>
        <p><em>Occupation:</em> ${person.occupation || 'Student'}</p>
      `
    });
  });

  body.appendChild(meta);
  body.appendChild(short);
  body.appendChild(readMore);

  card.appendChild(thumb);
  card.appendChild(body);

  return card;
}
