const FOCUSABLE_SELECTORS = 'a[href], area[href], input:not([disabled]):not([type="hidden"]), button:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

let activeModal = null;
let lastFocused = null;

export function openModal({ title = '', content = '' } = {}) {
  if (activeModal) return;
  lastFocused = document.activeElement;

  const root = document.getElementById('modal-root');
  const modal = document.createElement('div');
  modal.className = 'modal-overlay';
  modal.innerHTML = `
    <div class="modal" role="dialog" aria-modal="true" aria-label="${escapeHtml(title)}">
      <div class="modal-inner">
        <header class="modal-header">
          <h3>${escapeHtml(title)}</h3>
          <button class="modal-close" aria-label="Close dialog">&times;</button>
        </header>
        <div class="modal-content">${content}</div>
      </div>
    </div>
  `;

  root.appendChild(modal);
  activeModal = modal;

  modal.querySelector('.modal-close').addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
  document.addEventListener('keydown', onKeyDown);
  trapFocus(modal);

  injectModalStyles();
}

export function closeModal() {
  if (!activeModal) return;
  document.removeEventListener('keydown', onKeyDown);
  activeModal.remove();
  activeModal = null;
  lastFocused?.focus();
}

function onKeyDown(e) {
  if (e.key === 'Escape') {
    closeModal();
  } else if (e.key === 'Tab') {
    keepFocusInside(e);
  }
}

function trapFocus(modal) {
  const focusables = Array.from(modal.querySelectorAll(FOCUSABLE_SELECTORS));
  if (focusables.length) focusables[0].focus();
}

function keepFocusInside(e) {
  if (!activeModal) return;
  const focusables = Array.from(activeModal.querySelectorAll(FOCUSABLE_SELECTORS));
  if (!focusables.length) {
    e.preventDefault();
    return;
  }
  const first = focusables[0];
  const last = focusables[focusables.length - 1];

  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault();
    last.focus();
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault();
    first.focus();
  }
}

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

function injectModalStyles(){
  if (document.getElementById('modal-styles')) return;
  const style = document.createElement('style');
  style.id = 'modal-styles';
  style.textContent = `
    .modal-overlay{
      position:fixed;inset:0;background:rgba(0,0,0,0.45);display:flex;align-items:center;justify-content:center;z-index:9999;
    }
    .modal{background:#fff;border-radius:12px;max-width:720px;width:94%;box-shadow:0 8px 30px rgba(0,0,0,0.3)}
    .modal-inner{padding:1rem}
    .modal-header{display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #eee;padding-bottom:0.5rem;margin-bottom:0.5rem}
    .modal-close{background:none;border:0;font-size:1.5rem;cursor:pointer}
    .modal-content{line-height:1.6}
  `;
  document.head.appendChild(style);
}