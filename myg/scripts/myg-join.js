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

/* Form */

(function setupJoinForm(){
  const form = document.getElementById('join-form');
  if (!form) return;

  const interestBoxes = Array.from(form.querySelectorAll('input[type="checkbox"][name="interest"]'));
  interestBoxes.forEach(cb =>
    cb.addEventListener('change', () => {
      const checked = interestBoxes.filter(i => i.checked);
      if (checked.length > 3) {
        cb.checked = false;
        showTempAlert('Please select up to 3 interests only.');
      }
    })
  );

  function showTempAlert(msg){
    const existing = document.querySelector('.temp-alert');
    if (existing) existing.remove();
    const el = document.createElement('div');
    el.className = 'temp-alert';
    el.setAttribute('role','alert');
    el.style.position = 'fixed';
    el.style.right = '1rem';
    el.style.top = '1rem';
    el.style.background = '#fff';
    el.style.color = '#7A1F35';
    el.style.border = '1px solid rgba(122,31,53,0.1)';
    el.style.padding = '0.5rem 0.75rem';
    el.style.borderRadius = '8px';
    el.style.boxShadow = '0 6px 18px rgba(122,31,53,0.06)';
    el.textContent = msg;
    document.body.appendChild(el);
    setTimeout(()=> el.remove(), 3000);
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const email = form.querySelector('#email').value.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){
      showTempAlert('Please provide a valid email address.');
      return;
    }

    const data = new FormData(form);
    const payload = {};
    data.forEach((v,k) => {
      if (payload[k]) {
        if (Array.isArray(payload[k])) payload[k].push(v);
        else payload[k] = [payload[k], v];
      } else payload[k] = v;
    });

    try {
      saveSetting && saveSetting('lastCTA', new Date().toISOString());
    } catch (err) {
      console.warn('saveSetting not available or failed', err);
    }

    openConfirmationModal(payload);
  });

  form.addEventListener('reset', () => {
    showTempAlert('Form reset.');
  });
})();

function openConfirmationModal(formData){
  const modalRoot = document.getElementById('modal-root') || document.body;
  const existing = modalRoot.querySelector('.myg-modal-overlay');
  if (existing) existing.remove();

  const overlay = document.createElement('div');
  overlay.className = 'myg-modal-overlay';
  overlay.style.position = 'fixed';
  overlay.style.left = 0;
  overlay.style.top = 0;
  overlay.style.width = '100%';
  overlay.style.height = '100%';
  overlay.style.display = 'flex';
  overlay.style.alignItems = 'center';
  overlay.style.justifyContent = 'center';
  overlay.style.background = 'linear-gradient(180deg, rgba(0,0,0,0.25), rgba(0,0,0,0.35))';
  overlay.style.zIndex = 2050;

  const modal = document.createElement('div');
  modal.className = 'modal-wrap';
  modal.style.background = 'linear-gradient(180deg,#fff,#fffef8)';
  modal.style.borderRadius = '14px';
  modal.style.boxShadow = '0 18px 40px rgba(10,10,10,0.16)';
  modal.style.maxWidth = '520px';
  modal.style.width = '90%';
  modal.style.padding = '1.5rem';
  modal.style.textAlign = 'center';
  modal.setAttribute('role','dialog');
  modal.setAttribute('aria-modal','true');
  modal.setAttribute('aria-label','Join confirmation');

  const h = document.createElement('h3');
  h.textContent = 'Thank you for joining the workshop!';
  h.style.margin = '0.4rem 0';
  h.style.color = '#7A1F35';
  h.style.fontSize = '1.25rem';
  h.style.fontWeight = '900';
  modal.appendChild(h);

  const p = document.createElement('p');
  p.style.margin = '0.5rem 0 1rem';
  p.style.color = '#333';
  p.style.opacity = '0.95';
  const name = formData.firstName ? ` ${escapeHtml(String(formData.firstName))}` : '';
  p.innerHTML = `We received your information${name}. We will contact you with the schedule and next steps.`;
  modal.appendChild(p);

  const summary = document.createElement('div');
  summary.style.fontSize = '0.95rem';
  summary.style.color = '#444';
  summary.style.marginBottom = '1rem';
  summary.style.border = '1px dashed rgba(122,31,53,0.06)';
  summary.style.padding = '0.6rem';
  summary.style.borderRadius = '8px';
  const schedule = formData.schedule || '—';
  summary.innerHTML = `<strong>Schedule:</strong> ${escapeHtml(schedule)}<br><strong>Email:</strong> ${escapeHtml(formData.email || '—')}`;
  modal.appendChild(summary);

  const buttons = document.createElement('div');
  buttons.style.display = 'flex';
  buttons.style.justifyContent = 'center';
  buttons.style.gap = '0.6rem';

  const closeBtn = document.createElement('button');
  closeBtn.className = 'btn primary';
  closeBtn.textContent = 'Close';
  closeBtn.style.padding = '0.5rem 0.9rem';
  closeBtn.addEventListener('click', () => {
    overlay.remove();
    removeConfetti();
  });

  const anotherBtn = document.createElement('button');
  anotherBtn.className = 'btn ghost';
  anotherBtn.textContent = 'Register another';
  anotherBtn.style.padding = '0.5rem 0.9rem';
  anotherBtn.addEventListener('click', () => {
    overlay.remove();
    removeConfetti();
    const form = document.getElementById('join-form');
    if (form) form.reset();
    const first = form.querySelector('input, select, textarea');
    if (first) first.focus();
  });

  buttons.appendChild(anotherBtn);
  buttons.appendChild(closeBtn);
  modal.appendChild(buttons);

  overlay.appendChild(modal);
  modalRoot.appendChild(overlay);

  function onKey(e){
    if (e.key === 'Escape') {
      overlay.remove();
      removeConfetti();
      document.removeEventListener('keydown', onKey);
    }
  }
  document.addEventListener('keydown', onKey);

  launchConfetti(120);

  closeBtn.focus();
}

function escapeHtml(str) {
  return str.replace(/[&<>"']/g, function(m){ return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]); });
}

let confettiTimer = null;
function launchConfetti(count = 80){
  removeConfetti();
  const container = document.createElement('div');
  container.className = 'confetti-container';
  container.setAttribute('aria-hidden','true');

  const colors = ['#7A1F35','#F0B3B9','#F7E7A6','#ffe6f0','#C77'];
  const w = window.innerWidth;
  const h = window.innerHeight;
  for (let i=0;i<count;i++){
    const piece = document.createElement('div');
    piece.className = 'confetti-piece';
    const size = 6 + Math.random()*12;
    piece.style.width = `${size}px`;
    piece.style.height = `${size*0.6}px`;
    piece.style.background = colors[Math.floor(Math.random()*colors.length)];
    piece.style.position = 'absolute';
    piece.style.left = `${Math.random()*w}px`;
    piece.style.top = `${-Math.random()*h}px`;
    piece.style.opacity = (0.6 + Math.random()*0.4).toString();
    piece.style.borderRadius = '2px';
    piece.style.transform = `rotate(${Math.random()*360}deg)`;
    piece.style.willChange = 'transform, top, left, opacity';
    container.appendChild(piece);

    const duration = 1600 + Math.random()*1200;
    const endX = Math.random()*w;
    const endY = h + Math.random()*200;
    piece.animate([
      { transform: `translateY(0) rotate(0deg)`, top: piece.style.top, left: piece.style.left, opacity: 1 },
      { transform: `translateY(${endY}px) rotate(${Math.random()*720}deg)`, top: `${endY}px`, left: `${endX}px`, opacity: 0.4 }
    ], {
      duration: duration,
      easing: 'cubic-bezier(.2,.7,.2,1)',
      fill: 'forwards',
      iterations: 1
    });
  }
  document.body.appendChild(container);
  confettiTimer = setTimeout(removeConfetti, 3500);
}

function removeConfetti(){
  if (confettiTimer) { clearTimeout(confettiTimer); confettiTimer = null; }
  const existing = document.querySelectorAll('.confetti-container');
  existing.forEach(n => n.remove());
}