const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playFreq(f, d, g, delay = 0) {
const osc = audioCtx.createOscillator();
const gain = audioCtx.createGain();
osc.type = 'sine';
osc.frequency.setValueAtTime(f, audioCtx.currentTime + delay);
gain.gain.setValueAtTime(g, audioCtx.currentTime + delay);
gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + delay + d);
osc.connect(gain); gain.connect(audioCtx.destination);
osc.start(audioCtx.currentTime + delay); osc.stop(audioCtx.currentTime + delay + d);
}

const playClick = () => { if(audioCtx.state === 'suspended') audioCtx.resume(); playFreq(600, 0.08, 0.25); };
const playTab = () => { if(audioCtx.state === 'suspended') audioCtx.resume(); playFreq(500, 0.15, 0.2); playFreq(750, 0.15, 0.2, 0.05); };
const playLoad = () => { if(audioCtx.state === 'suspended') audioCtx.resume(); playFreq(400, 0.2, 0.2); playFreq(800, 0.2, 0.2, 0.1); };
const playHover = () => { if(audioCtx.state === 'suspended') audioCtx.resume(); playFreq(900, 0.05, 0.05); };

function initStars() {
const container = document.getElementById('stars-container');
for (let i = 0; i < 120; i++) {
const star = document.createElement('div');
star.className = 'star';
const size = Math.random() * 2 + 1;
star.style.width = size + 'px';
star.style.height = size + 'px';
star.style.left = Math.random() * 100 + '%';
star.style.top = Math.random() * 100 + '%';
star.style.setProperty('--duration', (Math.random() * 3 + 2) + 's');
container.appendChild(star);
}
}

function showToast(text) {
const t = document.getElementById('toast');
t.innerText = text;
t.classList.add('visible');
setTimeout(() => t.classList.remove('visible'), 2500);
}

function switchTab(id) {
const currentActive = document.querySelector('.page.active');
if (currentActive && currentActive.id === id) return;
playTab();
document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
const target = document.getElementById(id);
if (target) target.classList.add('active');
document.querySelectorAll('.b-nav-item').forEach(el => {
el.classList.toggle('active', el.dataset.id === id);
});
window.scrollTo(0,0);
}

function setTheme(t) {
const names = {lime:'Лаймовая', yellow:'Жёлтая', blue:'Синяя', pink:'Розовая', purple:'Фиолетовая', black:'Чёрная'};
document.body.className = 'theme-' + t;
localStorage.setItem('pigeonTheme', t);
document.querySelectorAll('.theme-card').forEach(c => c.classList.toggle('active', c.dataset.theme === t));
playClick();
showToast('Тема: ' + names[t]);
}

function copyLink() {
navigator.clipboard.writeText(window.location.href);
playClick();
showToast('Ссылка скопирована');
}

function copyPrompt(btn) {
const card = btn.closest('.prompt-card');
const fullText = card.dataset.prompt;
if (!fullText) { showToast('Промт не найден'); return; }
navigator.clipboard.writeText(fullText).then(() => { showToast('Промт скопирован'); playClick(); }).catch(() => { showToast('Не удалось скопировать'); });
}

let currentModalPrompt = '';

function openModal(card) {
const title = card.querySelector('.prompt-title').innerText;
const prompt = card.dataset.prompt;
if (!prompt) { showToast('Промт не найден'); return; }
currentModalPrompt = prompt;
document.getElementById('modalTitle').innerText = title;
document.getElementById('modalBody').innerText = prompt;
document.getElementById('modal').classList.add('active');
playClick();
}

function closeModal() {
document.getElementById('modal').classList.remove('active');
playClick();
}

function copyModalPrompt() {
if (!currentModalPrompt) { showToast('Нет текста для копирования'); return; }
navigator.clipboard.writeText(currentModalPrompt).then(() => { showToast('Промт скопирован'); playClick(); }).catch(() => { showToast('Не удалось скопировать'); });
}

document.querySelectorAll('.b-nav-item').forEach(el => {
el.addEventListener('click', () => switchTab(el.dataset.id));
});

document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });
document.addEventListener('click', (e) => { if (e.target === document.getElementById('modal')) closeModal(); });

window.addEventListener('load', () => {
initStars();
document.getElementById('current-date').innerText = new Date().toLocaleDateString();

const savedTheme = localStorage.getItem('pigeonTheme') || 'yellow';
document.body.className = 'theme-' + savedTheme;
document.querySelectorAll('.theme-card').forEach(c => c.classList.toggle('active', c.dataset.theme === savedTheme));

setTimeout(() => {
document.getElementById('loader').style.opacity = '0';
setTimeout(() => {
document.getElementById('loader').style.display = 'none';
document.getElementById('main-container').classList.add('visible');
playLoad();
}, 500);
}, 800);
});

document.addEventListener('touchstart', () => { if(audioCtx.state === 'suspended') audioCtx.resume(); }, {once: true});