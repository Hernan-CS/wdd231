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

/* Exercises code */

document.addEventListener('DOMContentLoaded', () => {
  try { setupExercises(); } catch (e) { console.error(e); }
});

function setupExercises() {
  const parts = document.querySelectorAll('.part-btn');
  const exerciseArea = document.getElementById('exercise-area');
  const prevBtn = document.getElementById('prev-q');
  const nextBtn = document.getElementById('next-q');
  const checkBtn = document.getElementById('check-answer');
  const resetBtn = document.getElementById('reset-part');
  const scoreArea = document.getElementById('score-area');
  const progressCount = document.getElementById('progress-count');
  const scoreText = document.getElementById('score-text');
  const solutionArea = document.getElementById('solution-area');

  let state = {
    part: null,
    index: 0,
    correctCount: 0,
    tries: 0
  };

  const data = {
    1: { /* Multiple Choice Cloze */
      title: 'Part 1 — Multiple Choice Cloze',
      type: 'mcq',
      items: [
        {
          q: 'The machine can be very dangerous, especially when it ___________ in motion.',
          choices: { a: 'is', b: 'moves', c: 'goes', d: 'has' },
          answer: 'b',
          explanation: 'When something "moves in motion" is redundant; "moves" is the natural verb.'
        },
        {
          q: 'You should not touch the fence while the power lines ___________.',
          choices: { a: 'are running', b: 'are live', c: 'is live', d: 'runs' },
          answer: 'b',
          explanation: 'We say power lines are "live".'
        },
        {
          q: 'If the alarm ___________, evacuate immediately.',
          choices: { a: 'go', b: 'is sounding', c: 'sounds', d: 'has sounded' },
          answer: 'c',
          explanation: '"If the alarm sounds" is the correct simple conditional.'
        }
      ]
    },
    2: { /* Open Cloze */
      title: 'Part 2 — Open Cloze',
      type: 'open',
      items: [
        {
          q: "I wish you wouldn't make ___________ so many stories. I never know when to believe you!",
          answer: 'up',
          hint: 'verb + particle'
        },
        {
          q: "She promised she would come, but she ___________ last minute.",
          answer: 'cancelled',
          alt: 'canceled',
          hint: 'past simple of "cancel"'
        },
        {
          q: "They warned us not to ___________ after dark in that area.",
          answer: 'wander',
          hint: 'a verb meaning "walk without purpose"'
        }
      ]
    },
    3: { /* Word Formation */
      title: 'Part 3 — Word Formation',
      type: 'wordform',
      items: [
        {
          q: 'If you go walking around the factory, ensure you have ______________ clothing on.',
          root: 'protect',
          answer: 'protective',
          hint: 'form an adjective from "protect"'
        },
        {
          q: 'He showed great ___________ when faced with criticism.',
          root: 'patience',
          answer: 'patience',
          hint: 'use the noun derived from "patient"'
        },
        {
          q: 'The introduction of the new system was a ___________ for productivity.',
          root: 'boost',
          answer: 'boost',
          hint: 'use the noun form'
        }
      ]
    },
    4: { /* Keyword Transformation */
      title: 'Part 4 — Keyword Transformation',
      type: 'transform',
      items: [
        {
          q: 'I regret not speaking to Marge sooner.',
          keyword: 'had',
          prompt: 'I wish ______________________________ sooner.',
          answer: 'I wish I had spoken to Marge sooner.',
          hint: 'Use the keyword "had" to create a past hypothetical.'
        },
        {
          q: 'They did not invite Sam because they thought he was busy.',
          keyword: 'weren\'t',
          prompt: 'If they ____________________, they would have invited Sam.',
          answer: 'If they weren\'t mistaken, they would have invited Sam.',
          hint: 'Use the keyword "weren\'t" to show contrast.'
        },
        {
          q: 'She started studying English three years ago.',
          keyword: 'for',
          prompt: 'She has been studying English ____________________ three years.',
          answer: 'She has been studying English for three years.',
          hint: 'Use the keyword "for" to show duration.'
        }
      ]
    }
  };

  function setActivePart(partId) {
    parts.forEach(btn => {
      const sel = String(btn.dataset.part) === String(partId);
      btn.setAttribute('aria-selected', sel ? 'true' : 'false');
    });
    state.part = Number(partId);
    state.index = 0;
    state.correctCount = 0;
    state.tries = 0;
    renderPart();
  }

  function renderPart() {
    const part = data[state.part];
    if (!part) return;
    solutionArea.hidden = true;
    scoreArea.hidden = false;
    updateScore();

    const isWide = window.matchMedia('(min-width:900px)').matches;
    if (isWide) {
      exerciseArea.classList.add('wide');
    } else {
      exerciseArea.classList.remove('wide');
    }

    const item = part.items[state.index];
    const total = part.items.length;

    prevBtn.disabled = state.index === 0;
    nextBtn.disabled = state.index === total - 1;
    checkBtn.disabled = false;
    resetBtn.disabled = false;

    let html = '';
    html += '<div class="exercise-column">';
    html += `<div class="exercise-card"><p class="q-text">Q${state.index + 1}. ${escapeHTML(item.q || item.prompt)}</p>`;

    if (part.type === 'mcq') {
      html += '<div class="options">';
      for (const [key, txt] of Object.entries(item.choices)) {
        const id = `p${state.part}-q${state.index}-opt-${key}`;
        html += `<label class="option"><input name="choice" type="radio" value="${key}" id="${id}"> <span>${key}. ${escapeHTML(txt)}</span></label>`;
      }
      html += '</div>';
    } else if (part.type === 'open') {
      html += `<label for="text-answer" class="sr-only">Answer</label>`;
      html += `<input id="text-answer" class="text-answer" type="text" placeholder="Fill the missing word here">`;
      if (item.hint) html += `<p class="hint">Hint: ${escapeHTML(item.hint)}</p>`;
    } else if (part.type === 'wordform') {
      html += `<p class="muted">Root: <kbd>${escapeHTML(item.root)}</kbd></p>`;
      html += `<input id="text-answer" class="text-answer" type="text" placeholder="Write the correct form">`;
      if (item.hint) html += `<p class="hint">Hint: ${escapeHTML(item.hint)}</p>`;
    } else if (part.type === 'transform') {
      html += `<p class="muted">Keyword: <kbd>${escapeHTML(item.keyword)}</kbd></p>`;
      html += `<p class="q-text">${escapeHTML(item.prompt)}</p>`;
      html += `<input id="text-answer" class="text-answer" type="text" placeholder="Write the transformed sentence (use the keyword)">`;
      if (item.hint) html += `<p class="hint">Hint: ${escapeHTML(item.hint)}</p>`;
    }

    html += '</div>';
    html += '</div>';

    html += '<aside class="sidebar-column" aria-label="Exercise info">';
    html += `<p><strong>${escapeHTML(data[state.part].title)}</strong></p>`;
    html += `<p>Question <strong>${state.index + 1}</strong> of <strong>${total}</strong></p>`;
    html += `<p class="muted">Click <em>Check</em> to grade your answer.</p>`;
    html += `<div id="sample-area" class="sample-area"></div>`;
    html += '</aside>';

    exerciseArea.innerHTML = html;
    updateScore();

    const firstInput = exerciseArea.querySelector('input');
    if (firstInput) firstInput.focus();
  }

  function updateScore() {
    const part = data[state.part];
    if (!part) {
      scoreArea.hidden = true;
      return;
    }
    const total = part.items.length;
    progressCount.textContent = `${state.index + 1} / ${total}`;
    scoreText.textContent = `${state.correctCount} correct`;
  }

  function checkAnswer() {
    const part = data[state.part];
    const item = part.items[state.index];
    let correct = false;
    let userAnswer = '';
    let feedback = '';

    if (part.type === 'mcq') {
      const selected = exerciseArea.querySelector('input[name="choice"]:checked');
      if (!selected) {
        alert('Please select an option before checking.');
        return;
      }
      userAnswer = selected.value;
      correct = userAnswer === item.answer;
      feedback = correct ? 'Correct — well done!' : `Incorrect. The correct answer is "${item.answer}".`;
    } else {
      const input = exerciseArea.querySelector('#text-answer');
      if (!input) return;
      userAnswer = (input.value || '').trim();
      if (!userAnswer) {
        alert('Please type your answer before checking.');
        return;
      }

      if (part.type === 'open') {
        const expected = (item.answer || '').toLowerCase();
        const alt = item.alt ? item.alt.toLowerCase() : null;
        const given = userAnswer.toLowerCase();
        correct = (given === expected) || (alt && given === alt);
        feedback = correct ? 'Correct — good choice!' : `Incorrect. Expected: "${item.answer}"${item.alt ? ' or "' + item.alt + '"' : ''}.`;
      } else if (part.type === 'wordform') {
        const expected = (item.answer || '').toLowerCase();
        const given = userAnswer.toLowerCase();
        correct = (given === expected);
        feedback = correct ? 'Nice — form is correct.' : `Not quite. Expected form: "${item.answer}".`;
      } else if (part.type === 'transform') {
        const expected = normalizeString(item.answer);
        const given = normalizeString(userAnswer);
        if (given === expected) {
          correct = true;
        } else {
          const keyword = item.keyword.toLowerCase();
          const hasKeyword = userAnswer.toLowerCase().includes(keyword);
          const expectedWords = expected.split(' ').filter(Boolean);
          const givenWords = given.split(' ').filter(Boolean);
          let common = 0;
          expectedWords.forEach(w => { if (givenWords.includes(w)) common++; });
          correct = hasKeyword && common >= Math.max(2, Math.floor(expectedWords.length / 3));
        }
        feedback = correct ? 'Good transformation.' : `Expected (one possible answer): "${item.answer}"`;
      }
    }

    state.tries++;
    if (correct) state.correctCount++;

    solutionArea.hidden = false;
    solutionArea.innerHTML = `<p class="${correct ? 'correct' : 'incorrect'}">${escapeHTML(feedback)}</p>
      <p class="muted">Your answer: <strong>${escapeHTML(userAnswer)}</strong></p>
      <p class="hint">${escapeHTML(item.explanation || item.hint || '')}</p>`;

    updateScore();
    checkBtn.disabled = true;
  }

  function goNext() {
    const part = data[state.part];
    if (state.index < part.items.length - 1) {
      state.index++;
      renderPart();
    }
  }
  function goPrev() {
    if (state.index > 0) {
      state.index--;
      renderPart();
    }
  }
  function resetPart() {
    if (!confirm('Reset this part? Your progress for this part will be lost.')) return;
    state.index = 0;
    state.correctCount = 0;
    state.tries = 0;
    renderPart();
  }

  parts.forEach(btn => {
    btn.addEventListener('click', () => {
      const pid = btn.dataset.part;
      setActivePart(pid);
    });
  });

  /* Controls */
  prevBtn.addEventListener('click', () => { goPrev(); });
  nextBtn.addEventListener('click', () => { goNext(); });
  checkBtn.addEventListener('click', () => { checkAnswer(); });
  resetBtn.addEventListener('click', () => { resetPart(); });

  document.addEventListener('keydown', (e) => {
    if (!state.part) return;
    if (e.key === 'Enter') {
      const active = document.activeElement;
      if (active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA')) {
        e.preventDefault();
        checkAnswer();
      }
    }
    if (e.key === 'ArrowRight') nextBtn.click();
    if (e.key === 'ArrowLeft') prevBtn.click();
  });

  document.addEventListener('input', (e) => {
    if (!state.part) return;
    if (e.target.closest('.exercise-area')) {
      checkBtn.disabled = false;
      solutionArea.hidden = true;
    }
  });

  const last = getSetting && getSetting('lastExercisePart');
  if (last && data[last]) {
    setActivePart(last);
  } else {
    parts[0].setAttribute('aria-selected', 'false');
  }

  function persist() {
    try {
      saveSetting && saveSetting('lastExercisePart', state.part);
    } catch (e) {}
  }

  window.addEventListener('beforeunload', persist);
}

function escapeHTML(s) {
  if (s == null) return '';
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function normalizeString(s) {
  return (s || '')
    .toLowerCase()
    .replace(/[^\w\s']/g, '') /* This remove punctuation but keep apostrophes */
    .replace(/\s+/g, ' ')
    .trim();
}
