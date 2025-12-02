const yearEl = document.getElementById("year");
const modifiedEl = document.getElementById("lastModified");
if (yearEl) yearEl.textContent = new Date().getFullYear();
if (modifiedEl) modifiedEl.textContent = document.lastModified;

document.addEventListener('DOMContentLoaded', () => {
  const menuButton = document.getElementById('menuButton');
  const navMenu = document.getElementById('navMenu');
  if (menuButton && navMenu) {
    menuButton.addEventListener('click', () => {
      navMenu.classList.toggle('show');
      const expanded = navMenu.classList.contains('show');
      menuButton.setAttribute('aria-expanded', expanded ? 'true' : 'false');
    });
  }
});

import { places } from "../data/discover-data.mjs";

const grid = document.getElementById('discoverGrid');
const visitEl = document.getElementById('visitMessage');

function createCardHTML(place, areaName) {
  const card = document.createElement('article');
  card.className = 'card';
  card.setAttribute('data-area', areaName);
  card.setAttribute('tabindex', '0');
  card.setAttribute('aria-labelledby', `${place.id}-title`);

  const title = document.createElement('h2');
  title.id = `${place.id}-title`;
  title.textContent = place.name;

  const fig = document.createElement('figure');
  const img = document.createElement('img');
  img.src = place.image;
  img.alt = `${place.name} - ${place.address}`;
  img.loading = 'lazy';
  img.width = 300;
  img.height = 200;
  fig.appendChild(img);

  const addr = document.createElement('address');
  addr.textContent = place.address;

  const desc = document.createElement('p');
  desc.textContent = place.description;

  const actions = document.createElement('div');
  actions.className = 'actions';
  const btn = document.createElement('button');
  btn.className = 'button';
  btn.textContent = 'Learn more';
  btn.setAttribute('aria-label', `Learn more about ${place.name}`);
  btn.addEventListener('click', () => {
    const q = encodeURIComponent(`${place.name} ${place.address} Barranca Lima Peru`);
    window.open(`https://www.google.com/maps/search/?api=1&query=${q}`, '_blank', 'noopener');
  });
  actions.appendChild(btn);

  card.appendChild(title);
  card.appendChild(fig);
  card.appendChild(addr);
  card.appendChild(desc);
  card.appendChild(actions);

  return card;
}

function renderGrid() {
  if (!grid) return;
  grid.innerHTML = '';
  const areaNames = ['card1','card2','card3','card4','card5','card6','card7','card8'];
  places.forEach((p, i) => {
    const area = areaNames[i] || `card${i+1}`;
    const card = createCardHTML(p, area);
    grid.appendChild(card);
  });
}

const STORAGE_KEY = 'barranca_last_visit_ts';
function formatVisitMessage() {
  const now = Date.now();
  const prev = localStorage.getItem(STORAGE_KEY);
  let message = '';
  if (!prev) {
    message = "Welcome! Let us know if you have any questions.";
  } else {
    const prevTs = Number(prev);
    if (Number.isNaN(prevTs)) {
      message = "Welcome! Let us know if you have any questions.";
    } else {
      const msPerDay = 1000 * 60 * 60 * 24;
      const diffMs = now - prevTs;
      const days = Math.floor(diffMs / msPerDay);
      if (diffMs < msPerDay) {
        message = "Back so soon! Awesome!";
      } else if (days === 1) {
        message = `You last visited 1 day ago.`;
      } else {
        message = `You last visited ${days} days ago.`;
      }
    }
  }

  if (visitEl) {
    visitEl.textContent = message;
  }
  localStorage.setItem(STORAGE_KEY, String(now));
}

function init() {
  renderGrid();
  formatVisitMessage();
}

init();