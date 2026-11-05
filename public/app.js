let currentCard = null;
let sessionCount = 0;
let correctCount = 0;
let wrongCount = 0;
let totalCards = null; // from /api/cards/stats, used for the "1 / 1000" progress badge

const speechSupported = 'speechSynthesis' in window;
let ptVoice = null; // cached once voices load, may stay null if no pt voice is installed

function pickPortugueseVoice() {
  if (!speechSupported) return;
  const voices = speechSynthesis.getVoices();
  ptVoice =
    voices.find((v) => v.lang === 'pt-PT') ||
    voices.find((v) => v.lang && v.lang.toLowerCase().startsWith('pt')) ||
    null;
}

if (speechSupported) {
  pickPortugueseVoice();
  // Voice list loads asynchronously in some browsers (notably Chrome).
  speechSynthesis.addEventListener('voiceschanged', pickPortugueseVoice);
}

function speakPortuguese(text) {
  if (!speechSupported || !text) return;
  speechSynthesis.cancel(); // stop anything already playing
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'pt-PT';
  if (ptVoice) utterance.voice = ptVoice;
  speechSynthesis.speak(utterance);
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

async function loadStats() {
  try {
    const res = await fetch('/api/cards/stats');
    if (!res.ok) throw new Error('stats request failed');
    const data = await res.json();
    totalCards = Number(data.totalCards) || null;
    document.getElementById('statWords').textContent = data.totalCards;
    document.getElementById('statCategories').textContent = data.totalCategories;
  } catch (err) {
    console.error('Could not load stats:', err);
    document.getElementById('statWords').textContent = '—';
    document.getElementById('statCategories').textContent = '—';
  }
  updateSessionProgress();
}

function updateSessionProgress() {
  const position = sessionCount + 1;
  document.getElementById('tabRight').textContent =
    totalCards ? `${position} / ${totalCards}` : `Card ${position}`;
  document.getElementById('sessionTally').textContent =
    sessionCount > 0 ? `Correct: ${correctCount} · Wrong: ${wrongCount}` : '';
}

function showCategory(text) {
  const tabLeft = document.getElementById('tabLeft');
  tabLeft.textContent = text;
  tabLeft.classList.toggle('show', !!text);
}

async function loadCard() {
  const cardBody = document.getElementById('cardBody');
  showCategory('');
  cardBody.innerHTML = '<div class="word">Loading&hellip;</div>';
  document.getElementById('actionsQuestion').classList.remove('-hidden');
  document.getElementById('actionsAnswer').classList.add('-hidden');

  try {
    const res = await fetch('/api/cards/random');
    if (!res.ok) throw new Error('cards request failed');
    currentCard = await res.json();
    showCategory(currentCard.category || 'Word');
    cardBody.innerHTML = `<div class="word">${escapeHtml(currentCard.english)}</div>`;
  } catch (err) {
    console.error('Could not load card:', err);
    cardBody.innerHTML = '<div class="word">Couldn\u2019t load a card. Try again shortly.</div>';
    currentCard = null;
  }
  updateSessionProgress();
}

document.getElementById('btnShow').addEventListener('click', () => {
  if (!currentCard) return;

  const listenButton = speechSupported
    ? `<button type="button" class="listen-btn" id="btnListen" aria-label="Listen to pronunciation">
         <span class="listen-icon" aria-hidden="true">&#128266;</span> Listen
       </button>`
    : '';

  document.getElementById('cardBody').innerHTML =
    `<div class="answer">${escapeHtml(currentCard.portuguese)}</div>` +
    `<div class="subword">${escapeHtml(currentCard.english)}</div>` +
    listenButton;

  document.getElementById('actionsQuestion').classList.add('-hidden');
  document.getElementById('actionsAnswer').classList.remove('-hidden');

  if (speechSupported) {
    document.getElementById('btnListen').addEventListener('click', () => {
      speakPortuguese(currentCard.portuguese);
    });
  }
});

async function submitScore(correct) {
  if (!currentCard) return;
  sessionCount += 1;
  if (correct) correctCount += 1; else wrongCount += 1;

  try {
    await fetch('/api/cards/score', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ card_id: currentCard.id, correct })
    });
  } catch (err) {
    console.error('Could not save score:', err);
  }
  loadCard();
}

document.getElementById('btnCorrect').addEventListener('click', () => submitScore(true));
document.getElementById('btnWrong').addEventListener('click', () => submitScore(false));

// Mobile drawer
const sidebar = document.getElementById('sidebar');
const backdrop = document.getElementById('backdrop');
const menuBtn = document.getElementById('menuBtn');
function setDrawer(open) {
  sidebar.classList.toggle('open', open);
  backdrop.classList.toggle('open', open);
  menuBtn.setAttribute('aria-expanded', String(open));
}
menuBtn.addEventListener('click', () => setDrawer(!sidebar.classList.contains('open')));
backdrop.addEventListener('click', () => setDrawer(false));
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setDrawer(false); });

// View navigation (Dashboard <-> Study Cards)
document.querySelectorAll('[data-view]').forEach((el) => {
  el.addEventListener('click', (e) => {
    e.preventDefault();
    const target = el.getAttribute('data-view');

    document.querySelectorAll('.view').forEach((v) => v.classList.remove('active'));
    document.getElementById('view-' + target).classList.add('active');

    document.querySelectorAll('.navitem[data-view]').forEach((n) => n.classList.remove('active'));
    const navMatch = document.querySelector(`.navitem[data-view="${target}"]`);
    if (navMatch) navMatch.classList.add('active');
    setDrawer(false);
  });
});

// Initial load
loadStats();
loadCard();
