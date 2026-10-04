// ── i18n ──
const strings = {
  es: {
    nav_menu: 'Carta', nav_schedule: 'Horario', nav_about: 'Nosotros',
    status_open: 'Abierto', status_closed: 'Cerrado',
    about_text: '\nSomos Moto Burger.\n\nNacimos de la pasión por las smash burgers de verdad, carne aplastada a fuego vivo, queso bien fundido y sabor sin rodeos.\n\nEncontramos nuestro sitio en el corazón de Sevilla.'
  },
  en: {
    nav_menu: 'Menu', nav_schedule: 'Hours', nav_about: 'About',
    status_open: 'Open', status_closed: 'Closed',
    about_text: '\nWe are Moto Burger.\n\nBorn from a passion for real smash burgers, meat pressed on high heat, perfectly melted cheese and flavor with no shortcuts.\n\nWe found our home in the heart of Seville.'
  }
};

let lang = localStorage.getItem('mb-lang') || 'es';

function applyLang() {
  document.documentElement.lang = lang;
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    if (strings[lang][key]) el.textContent = strings[lang][key];
  });
  document.getElementById('lang-toggle').textContent = lang === 'es' ? 'EN' : 'ES';
  renderMenu();
  renderSchedule();
  updateStatus();
}

document.getElementById('lang-toggle').addEventListener('click', () => {
  lang = lang === 'es' ? 'en' : 'es';
  localStorage.setItem('mb-lang', lang);
  applyLang();
});

// ── Navbar scroll effect ──
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

// ── Menu ──
async function renderMenu() {
  const data = await fetch('data/menu.json').then(r => r.json());
  document.getElementById('menu-list').innerHTML = data.categories.map(cat => `
    <div class="menu-category-header">${typeof cat.name === 'object' ? cat.name[lang] : cat.name}</div>
    <div class="menu-grid">
      ${cat.items.map(item => {
    const name = typeof item.name === 'object' ? item.name[lang] : item.name;
    const desc = item.description[lang];
    const badgeHtml = item.badge ? `<div class="menu-card-badge">${item.badge[lang]}</div>` : '';
    const imgHtml = item.image
      ? `<img class="menu-card-img" src="${item.image}" alt="${name}" loading="lazy">`
      : `<div class="menu-card-no-img">🍔</div>`;
    return `
          <div class="menu-card">
            ${imgHtml}
            <div class="menu-card-overlay">
              <div class="menu-card-top">
                <div class="menu-card-title">${name}</div>
                ${badgeHtml}
              </div>
              <div class="menu-card-glass">
                <div class="menu-card-desc">${desc}</div>
                <div class="menu-card-price">${item.price.toFixed(2).replace('.', ',')}€</div>
              </div>
            </div>
          </div>`;
  }).join('')}
    </div>
  `).join('');

  // Mobile tap: toggle active (click again to collapse)
  document.querySelectorAll('.menu-card').forEach(card => {
    card.addEventListener('click', () => {
      const isActive = card.classList.contains('active');
      document.querySelectorAll('.menu-card').forEach(c => c.classList.remove('active'));
      if (!isActive) card.classList.add('active');
    });
  });
}

// ── Schedule ──
const DAY_KEYS = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];

async function renderSchedule() {
  const data = await fetch('data/schedule.json').then(r => r.json());
  const todayKey = DAY_KEYS[new Date().getDay()];
  document.getElementById('schedule-grid').innerHTML = Object.entries(data.days).map(([key, day]) => `
    <div class="schedule-row ${key === todayKey ? 'today' : ''}">
      <span>${day[lang]}</span>
      <span class="schedule-hours">${day.lunch} &nbsp;|&nbsp; ${day.dinner}</span>
    </div>
  `).join('');
}

// ── Open / Closed ──
async function updateStatus() {
  const data = await fetch('data/schedule.json').then(r => r.json());
  const todayKey = DAY_KEYS[new Date().getDay()];
  const today = data.days[todayKey];
  const badge = document.getElementById('status-badge');
  const open = checkIfOpen(today);
  badge.className = open ? 'open' : 'closed';
  document.getElementById('status-text').textContent = strings[lang][open ? 'status_open' : 'status_closed'];
}

function parseTime(str) {
  const [h, m] = str.split(':').map(Number);
  return h * 60 + m;
}

function checkIfOpen(day) {
  if (!day) return false;
  const now = new Date();
  const cur = now.getHours() * 60 + now.getMinutes();
  for (const period of [day.lunch, day.dinner]) {
    const [start, end] = period.split('–').map(parseTime);
    if (end < start) { if (cur >= start || cur <= end) return true; }
    else { if (cur >= start && cur <= end) return true; }
  }
  return false;
}

// ── Audio Synthesis ──
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playSound(type) {
  if (audioCtx.state === 'suspended') audioCtx.resume();
  
  const osc = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();
  
  osc.connect(gainNode);
  gainNode.connect(audioCtx.destination);
  
  const now = audioCtx.currentTime;
  
  if (type === 'niam') {
    // "ñam" sound
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(150, now);
    osc.frequency.exponentialRampToValueAtTime(100, now + 0.1);
    
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.3, now + 0.05);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
    
    osc.start(now);
    osc.stop(now + 0.2);
  } else if (type === 'clink') {
    // "clink" sound
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1200, now);
    osc.frequency.exponentialRampToValueAtTime(2000, now + 0.05);
    
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.1, now + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
    
    osc.start(now);
    osc.stop(now + 0.4);
  }
}

// ── Mascot Animation ──
const mascot = document.getElementById('hero-mascot');
let isEating = false;

mascot.addEventListener('click', () => {
  if (isEating) return;
  isEating = true;
  mascot.classList.add('is-eating');
  
  // Sounds scheduling
  const duration = 5000;
  
  // s2-bocado1 12%
  setTimeout(() => playSound('niam'), duration * 0.12);
  // s3-bocado2 24%
  setTimeout(() => playSound('niam'), duration * 0.24);
  // s4-bocado3 36%
  setTimeout(() => playSound('niam'), duration * 0.36);
  // desaparece (sin bocado) 54%
  setTimeout(() => playSound('niam'), duration * 0.54);
  // guino 64% (espera de 0.5s en 5s total)
  setTimeout(() => playSound('clink'), duration * 0.64);
  
  // Remove class after animation
  setTimeout(() => {
    mascot.classList.remove('is-eating');
    isEating = false;
  }, duration);
});

// ── Init ──
applyLang();
