/* ═══════════════════════════════════════════════
   NovaDrop – script.js  v5
═══════════════════════════════════════════════ */

/* ── 1. CURSOR (desktop only) ── */
(function initCursor() {
  const cursor   = document.getElementById('cursor');
  const follower = document.getElementById('cursorFollower');
  if (!cursor || !follower) return;

  // Disable on touch devices
  if (!window.matchMedia('(hover: hover)').matches) return;

  let mouseX = -200, mouseY = -200, fX = -200, fY = -200;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX; mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top  = mouseY + 'px';
  });

  (function loop() {
    fX += (mouseX - fX) * 0.1;
    fY += (mouseY - fY) * 0.1;
    follower.style.left = fX + 'px';
    follower.style.top  = fY + 'px';
    requestAnimationFrame(loop);
  })();

  document.querySelectorAll('a, button, .product-card, .usp-item, .contact-card').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.style.width = '8px'; cursor.style.height = '8px';
      follower.style.width = '22px'; follower.style.height = '22px';
      follower.style.borderColor = 'rgba(255,0,0,0.85)';
      follower.style.borderRadius = '3px';
    });
    el.addEventListener('mouseleave', () => {
      cursor.style.width = '6px'; cursor.style.height = '6px';
      follower.style.width = '30px'; follower.style.height = '30px';
      follower.style.borderColor = 'rgba(255,0,0,0.5)';
      follower.style.borderRadius = '50%';
    });
  });
})();


/* ── 2. NAVBAR — scroll + active section ── */
(function initNavbar() {
  const navbar      = document.getElementById('navbar');
  const hamburger   = document.getElementById('hamburger');
  const overlay     = document.getElementById('mobileOverlay');
  const mobileClose = document.getElementById('mobileClose');
  const navLinks    = document.querySelectorAll('.nav-link');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  if (!navbar) return;

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
    updateActive();
  }, { passive: true });

  // Active nav section tracking
  const sections = Array.from(document.querySelectorAll('section[id]'));
  function updateActive() {
    let current = sections[0]?.id || '';
    sections.forEach(s => {
      if (s.getBoundingClientRect().top <= 100) current = s.id;
    });
    navLinks.forEach(a => a.classList.toggle('active', a.dataset.section === current));
  }
  updateActive();

  function openMenu() {
    overlay.classList.add('open');
    hamburger.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }
  function closeMenu() {
    overlay.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  hamburger?.addEventListener('click', () =>
    overlay.classList.contains('open') ? closeMenu() : openMenu()
  );
  mobileClose?.addEventListener('click', closeMenu);
  mobileLinks.forEach(a => a.addEventListener('click', closeMenu));

  // Click blank area of overlay to close
  overlay?.addEventListener('click', e => {
    if (e.target === overlay) closeMenu();
  });

  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
})();


/* ── 3. GRID GLOW — cursor proximity effect ── */
(function initGridGlow() {
  const glows = document.querySelectorAll('.grid-glow');
  if (!glows.length || !window.matchMedia('(hover: hover)').matches) return;

  document.addEventListener('mousemove', e => {
    glows.forEach(glow => {
      const section = glow.closest('.has-grid-bg');
      if (!section) return;
      const rect = section.getBoundingClientRect();
      if (e.clientY < rect.top - 150 || e.clientY > rect.bottom + 150) return;
      const gx = ((e.clientX - rect.left) / rect.width  * 100).toFixed(1) + '%';
      const gy = ((e.clientY - rect.top)  / rect.height * 100).toFixed(1) + '%';
      glow.style.background = `radial-gradient(circle 280px at ${gx} ${gy}, rgba(255,0,0,0.1) 0%, transparent 70%)`;
    });
  }, { passive: true });
})();


/* ── 4. ABOUT — card hover (pure CSS handles it, JS just handles touch tap) ── */
(function initUspCards() {
  const cards = document.querySelectorAll('.usp-card-item');
  if (!cards.length) return;
  // Touch devices: tap to "pin" the hovered state
  if (!window.matchMedia('(hover: hover)').matches) {
    cards.forEach(card => {
      card.addEventListener('click', () => {
        const isActive = card.classList.contains('touch-active');
        cards.forEach(c => c.classList.remove('touch-active'));
        if (!isActive) card.classList.add('touch-active');
      });
    });
  }
})();


/* ── 5. 3D CIRCULAR CAROUSEL ── */

/* ─────────────────────────────────────────────────
   PHONES CAROUSEL CONFIG  — edit freely
───────────────────────────────────────────────── */
const PHONES_CFG = {
  cardW:    200,
  cardH:    240,
  mobileCardW: 132,
  mobileCardH: 230,
  radiusMult: 1.1,
  autoDeg:  0.051,
  minRadius: 480,
};

/* ─────────────────────────────────────────────────
   ACCESSORIES CAROUSEL CONFIG  — edit freely
───────────────────────────────────────────────── */
const ACC_CFG = {
  cardW:    240,
  cardH:    300,
  mobileCardW: 158,
  mobileCardH: 280,
  radiusMult: 0.72,
  autoDeg:  0.081,
  minRadius: 320,
};

/* ─────────────────────────────────────────────────
   CAROUSEL ENGINE  — don't edit unless needed
───────────────────────────────────────────────── */
function init3DCarousel(ringId, dotsId, prevId, nextId, cfg) {
  const ring  = document.getElementById(ringId);
  const dotsC = document.getElementById(dotsId);
  const prevB = document.getElementById(prevId);
  const nextB = document.getElementById(nextId);
  if (!ring) return;

  const cards = Array.from(ring.querySelectorAll('.product-card'));
  const N     = cards.length;
  if (N === 0) return;

  const isMobile = window.innerWidth <= 768;
  const CARD_W  = (isMobile && cfg.mobileCardW) ? cfg.mobileCardW : cfg.cardW;
  const CARD_H  = (isMobile && cfg.mobileCardH) ? cfg.mobileCardH : cfg.cardH;
  const RADIUS  = Math.max(cfg.minRadius, Math.round(N * CARD_W / (2 * Math.PI) * cfg.radiusMult));
  const AUTO    = cfg.autoDeg;

  let rotation = 0, target = 0;
  let dragging = false, dragStartX = 0, dragStartRot = 0;
  let paused = false;

  /* --- Size every card: enforce fixed box so cardH is the real height --- */
  cards.forEach(c => {
    c.style.setProperty('width',      CARD_W + 'px',  'important');
    c.style.setProperty('height',     CARD_H + 'px',  'important');
    c.style.setProperty('left',       (-CARD_W / 2) + 'px', 'important');
    c.style.setProperty('top',        (-CARD_H / 2) + 'px', 'important');
    c.style.setProperty('margin',     '0',            'important');
    c.style.setProperty('min-width',  'unset',        'important');
    c.style.setProperty('max-width',  'unset',        'important');
    c.style.setProperty('min-height', 'unset',        'important');
    c.style.setProperty('max-height', 'unset',        'important');
    c.style.setProperty('flex',       'none',         'important');
    c.style.overflow  = 'hidden';
    c.style.boxSizing = 'border-box';
  });

  /* --- Progress dots --- */
  if (dotsC) {
    dotsC.innerHTML = '';
    cards.forEach((_, i) => {
      const d = document.createElement('button');
      d.className = 'carousel-progress-dot' + (i === 0 ? ' active' : '');
      d.addEventListener('click', () => { target = -(360 / N) * i; paused = true; setTimeout(() => paused = false, 2000); });
      dotsC.appendChild(d);
    });
  }

  function updateDots() {
    if (!dotsC) return;
    const dots = dotsC.querySelectorAll('.carousel-progress-dot');
    const step  = 360 / N;
    const norm  = (((-rotation % 360) + 360) % 360);
    const idx   = Math.round(norm / step) % N;
    dots.forEach((d, i) => d.classList.toggle('active', i === idx));
    cards.forEach((c, i) => c.classList.toggle('carousel-active', i === idx));
  }

  function render() {
    if (!dragging) {
      if (!paused) target -= AUTO;
      rotation += (target - rotation) * 0.06;
    }
    const step = 360 / N;
    cards.forEach((card, i) => {
      const angle = step * i + rotation;
      const rad   = angle * Math.PI / 180;
      const x     = Math.sin(rad) * RADIUS;
      const z     = Math.cos(rad) * RADIUS;
      /* z ranges -RADIUS..+RADIUS; normalise to 0..1 */
      const t     = (z + RADIUS) / (2 * RADIUS);
      const sc    = 0.45 + t * 0.55;   /* back=0.45, front=1.0 — no blowup */
      const alpha = 0.35 + t * 0.65;
      card.style.transform = `translateX(${x.toFixed(1)}px) translateZ(${z.toFixed(1)}px) scale(${sc.toFixed(3)})`;
      card.style.opacity   = alpha.toFixed(3);
      card.style.zIndex    = Math.round(t * 100);
    });
    updateDots();
    requestAnimationFrame(render);
  }

  /* Controls */
  const step = 360 / N;
  prevB?.addEventListener('click', () => { target += step; paused = true; setTimeout(() => paused = false, 2000); });
  nextB?.addEventListener('click', () => { target -= step; paused = true; setTimeout(() => paused = false, 2000); });

  /* Drag */
  const trackWrap = ring.closest('.carousel-track-wrap');
  const onStart = cx => { dragging = true; dragStartX = cx; dragStartRot = target; paused = true; };
  const onMove  = cx => { if (dragging) target = dragStartRot + (cx - dragStartX) * 0.35; };
  const onEnd   = ()  => { dragging = false; setTimeout(() => paused = false, 1800); };
  trackWrap?.addEventListener('mousedown',  e => onStart(e.clientX));
  window.addEventListener(    'mousemove',  e => onMove(e.clientX));
  window.addEventListener(    'mouseup',    onEnd);
  trackWrap?.addEventListener('touchstart', e => onStart(e.touches[0].clientX), { passive: true });
  trackWrap?.addEventListener('touchmove',  e => onMove(e.touches[0].clientX),  { passive: true });
  trackWrap?.addEventListener('touchend',   onEnd);

  /* Hover pause */
  const wrapper = ring.closest('.carousel-wrapper');
  wrapper?.addEventListener('mouseenter', () => paused = true);
  wrapper?.addEventListener('mouseleave', () => paused = false);

  /* Click card to front — or open modal if already front */
  cards.forEach((card, i) => {
    card.addEventListener('click', () => {
      if (Math.abs(target - dragStartRot) > 8) return;
      const step = 360 / N;
      const norm = (((-rotation % 360) + 360) % 360);
      const frontIdx = Math.round(norm / step) % N;
      if (i === frontIdx) {
        // Already front — open the view-all modal
        const modalId = ring.closest('#phonesTrack') ? 'phonesModal' : 'accessoriesModal';
        openModal(modalId);
      } else {
        target = -(step * i);
        paused = true;
        setTimeout(() => paused = false, 2200);
      }
    });
  });

  render();
}

(function initAllCarousels() {
  init3DCarousel('phonesRing',      'phonesDots3D', 'phonesPrev', 'phonesNext', PHONES_CFG);
  init3DCarousel('accessoriesRing', 'accDots3D',    'accPrev',    'accNext',    ACC_CFG);
})();


/* ── 6. SCROLL REVEAL ── */
(function initReveal() {
  const targets = document.querySelectorAll('.product-card, .contact-card, .section-header, .hero-trust, .usp-accordion');
  targets.forEach((el, i) => {
    el.classList.add('reveal');
    el.style.transitionDelay = (i % 5) * 0.055 + 's';
  });
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
  }, { threshold: 0.08 });
  targets.forEach(el => obs.observe(el));
})();


/* ── 7. MODAL ── */
function openModal(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.classList.add('open'); document.body.style.overflow = 'hidden';
  setTimeout(() => el.querySelector('.modal-close')?.focus(), 50);
}
function closeModal(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.classList.remove('open'); document.body.style.overflow = '';
}
function closeModalOutside(e, id) { if (e.target === e.currentTarget) closeModal(id); }
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') document.querySelectorAll('.modal-overlay.open').forEach(m => closeModal(m.id));
});


/* ── 8. IMAGE HANDLERS ── */
(function initImages() {
  document.querySelectorAll('.product-img-wrap img, .hero-phone-img-wrap img').forEach(img => {
    const wrap = img.closest('.product-img-wrap, .hero-phone-img-wrap');
    const ph   = wrap?.querySelector('.img-placeholder');
    const show = () => { if (ph) ph.style.display = 'none'; img.style.opacity = '1'; };
    const hide = () => { img.style.opacity = '0'; img.style.position = 'absolute'; if (ph) ph.style.display = 'flex'; };
    if (img.complete && img.naturalWidth > 0) show();
    else if (img.complete) hide();
    else { img.addEventListener('load', show); img.addEventListener('error', hide); }
  });
})();


/* ── 9. ENQUIRY FORM — pre-fill + category toggle + WhatsApp submit ── */

// Opens contact section and optionally pre-fills the product
function openEnquiry(btn) {
  // Scroll to contact
  document.getElementById('contact').scrollIntoView({ behavior: 'smooth', block: 'start' });

  // Try to read product name from card
  const card = btn.closest('.product-card');
  if (!card) return;

  const productName = card.querySelector('h4')?.textContent?.trim() || '';
  const brand       = card.querySelector('.brand')?.textContent?.trim() || '';

  // Determine if phone or accessory
  const phoneNames = ['iphone','galaxy','samsung','apple'];
  const isPhone = phoneNames.some(k => productName.toLowerCase().includes(k) || brand.toLowerCase().includes(k));

  setTimeout(() => {
    // Set category radio
    const radioPhone = document.querySelector('input[name="category"][value="phone"]');
    const radioAcc   = document.querySelector('input[name="category"][value="accessory"]');
    if (isPhone) {
      radioPhone.checked = true;
      toggleCategory(radioPhone);
      // Try to match in phone select
      const sel = document.getElementById('fPhone2');
      if (sel) {
        for (let i = 0; i < sel.options.length; i++) {
          if (sel.options[i].text.toLowerCase().startsWith(productName.toLowerCase())) {
            sel.selectedIndex = i; break;
          }
        }
      }
    } else {
      radioAcc.checked = true;
      toggleCategory(radioAcc);
      // Try to match in accessory select
      const sel = document.getElementById('fAcc');
      if (sel) {
        for (let i = 0; i < sel.options.length; i++) {
          if (sel.options[i].text.toLowerCase().includes(productName.toLowerCase())) {
            sel.selectedIndex = i; break;
          }
        }
      }
    }
  }, 600);
}

// Toggle phone/accessory select visibility
function toggleCategory(radio) {
  const phoneGrp = document.getElementById('phoneSelectGroup');
  const accGrp   = document.getElementById('accSelectGroup');
  if (!phoneGrp || !accGrp) return;
  if (radio.value === 'phone') {
    phoneGrp.style.display = 'block';
    accGrp.style.display   = 'none';
  } else {
    phoneGrp.style.display = 'none';
    accGrp.style.display   = 'block';
  }
}

// Build and send WhatsApp message
function sendWhatsApp() {
  const name     = document.getElementById('fName')?.value.trim();
  const phone    = document.getElementById('fPhone')?.value.trim();
  const cat      = document.querySelector('input[name="category"]:checked')?.value || 'phone';
  const product  = cat === 'phone'
    ? document.getElementById('fPhone2')?.value
    : document.getElementById('fAcc')?.value;
  const storage  = document.getElementById('fStorage')?.value;
  const colour   = document.getElementById('fColour')?.value.trim();
  const location = document.getElementById('fLocation')?.value.trim();
  const note     = document.getElementById('fNote')?.value.trim();

  // Basic validation
  if (!name) { alert('Please enter your name.'); return; }
  if (!phone) { alert('Please enter your phone number.'); return; }
  if (!product) { alert('Please select a product.'); return; }
  if (!location) { alert('Please enter your delivery location.'); return; }

  // Build message
  let msg = `🛒 *Urban Mobiles Enquiry*\n\n`;
  msg += `👤 *Name:* ${name}\n`;
  msg += `📞 *Phone:* ${phone}\n`;
  msg += `📦 *Category:* ${cat === 'phone' ? 'Smartphone' : 'Accessory'}\n`;
  msg += `📱 *Product:* ${product}\n`;
  if (storage) msg += `💾 *Storage/Variant:* ${storage}\n`;
  if (colour)  msg += `🎨 *Colour:* ${colour}\n`;
  msg += `📍 *Delivery Location:* ${location}\n`;
  if (note)    msg += `💬 *Notes:* ${note}\n`;
  msg += `\n_Sent via Urban Mobiles website_`;

  const waNumber = '919999999999'; // ← Replace with your actual WhatsApp number
  const url = `https://wa.me/${waNumber}?text=${encodeURIComponent(msg)}`;
  window.open(url, '_blank');
}

/* ── THEME TOGGLE ── */
(function initTheme() {
  const btnDesktop = document.getElementById('themeToggleDesktop');
  const btnMobile  = document.getElementById('themeToggleMobile');
  const root = document.documentElement;

  function updateLabel() {
    const label = document.querySelector('.theme-mode-label');
    if (label) label.textContent = root.classList.contains('light') ? 'Dark' : 'Light';
  }

  // Default is always dark. Only go light if user explicitly chose light.
  if (localStorage.getItem('theme') === 'light') {
    root.classList.add('light');
  } else {
    // Ensure dark — remove any stale light class
    root.classList.remove('light');
  }
  updateLabel();

  function toggleTheme() {
    root.classList.toggle('light');
    localStorage.setItem('theme', root.classList.contains('light') ? 'light' : 'dark');
    updateLabel();
  }

  btnDesktop?.addEventListener('click', toggleTheme);
  btnMobile?.addEventListener('click', toggleTheme);
})();