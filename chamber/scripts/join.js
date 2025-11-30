document.addEventListener('DOMContentLoaded', function () {
  const ts = document.getElementById('timestamp');
  if (ts) {
    const now = new Date();
    ts.value = now.toISOString();
  }

  const openButtons = document.querySelectorAll('.open-modal');
  const modals = document.querySelectorAll('.modal');
  let lastFocusedEl = null;

  function openModal(modal) {
    if (!modal) return;
    lastFocusedEl = document.activeElement;
    modal.setAttribute('aria-hidden', 'false');
    modal.style.display = 'flex';
    const closeBtn = modal.querySelector('.modal-close');
    if (closeBtn) closeBtn.focus();
    document.body.style.overflow = 'hidden';
  }

  function closeModal(modal) {
    if (!modal) return;
    modal.setAttribute('aria-hidden', 'true');
    modal.style.display = 'none';
    document.body.style.overflow = '';
    if (lastFocusedEl) lastFocusedEl.focus();
  }

  openButtons.forEach(btn => {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.dataset.target;
      const modal = document.getElementById(targetId);
      openModal(modal);
    });
  });

  modals.forEach(modal => {
    const close = modal.querySelector('.modal-close');
    close && close.addEventListener('click', () => closeModal(modal));

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal(modal);
      }
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      modals.forEach(m => {
        if (m.getAttribute('aria-hidden') === 'false') closeModal(m);
      });
    }
  });

  const cards = document.querySelectorAll('.card');
  cards.forEach(card => {
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        const targetId = card.dataset.modal;
        const modal = document.getElementById(targetId);
        if (modal) {
          e.preventDefault();
          openModal(modal);
        }
      }
    });
  });

  const form = document.getElementById('joinForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      const orgTitle = form.querySelector('input[name="orgTitle"]');
      if (orgTitle && orgTitle.value.trim() !== '') {
        const pattern = new RegExp(orgTitle.getAttribute('pattern'));
        if (!pattern.test(orgTitle.value)) {
          e.preventDefault();
          orgTitle.focus();
          alert('The Title must be at least 7 characters and use only letters, spaces, or hyphens.');
        }
      }
    });
  }
});

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
        });
    }
});