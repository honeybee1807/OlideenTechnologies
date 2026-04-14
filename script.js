// ===========================
// Olideen Technologies — script.js
// ===========================

gsap.registerPlugin(ScrollTrigger);

// ── Custom Cursor ────────────────────────────────────────
const dot  = document.querySelector('.cursor-dot');
const ring = document.querySelector('.cursor-ring');

if (dot && ring) {
  let rx = 0, ry = 0;
  document.addEventListener('mousemove', (e) => {
    dot.style.left  = e.clientX + 'px';
    dot.style.top   = e.clientY + 'px';

    // Ring follows with lag
    rx += (e.clientX - rx) * 0.15;
    ry += (e.clientY - ry) * 0.15;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
  });

  // Animate lag continuously
  function animateCursor() {
    requestAnimationFrame(animateCursor);
    const ringX = parseFloat(ring.style.left || 0);
    const ringY = parseFloat(ring.style.top  || 0);
    const dotX  = parseFloat(dot.style.left  || 0);
    const dotY  = parseFloat(dot.style.top   || 0);
    ring.style.left = (ringX + (dotX - ringX) * 0.12) + 'px';
    ring.style.top  = (ringY + (dotY - ringY) * 0.12) + 'px';
  }
  animateCursor();

  // Hover effects
  document.querySelectorAll('a, button, .service-card, .stat-card, .tdot').forEach(el => {
    el.addEventListener('mouseenter', () => {
      ring.style.width  = '56px';
      ring.style.height = '56px';
      ring.style.borderColor = 'var(--cyan)';
      ring.style.background  = 'rgba(0,217,255,0.05)';
      dot.style.transform = 'translate(-50%,-50%) scale(2)';
    });
    el.addEventListener('mouseleave', () => {
      ring.style.width  = '36px';
      ring.style.height = '36px';
      ring.style.borderColor = 'rgba(0,217,255,0.5)';
      ring.style.background  = 'transparent';
      dot.style.transform = 'translate(-50%,-50%) scale(1)';
    });
  });
}

// ── Navbar scroll effect ─────────────────────────────────
const navbar = document.getElementById('navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  });
}

// ── Hamburger ────────────────────────────────────────────
const hamburger = document.getElementById('hamburger');
const navLinks  = document.querySelector('.nav-links');
if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });
}

// ── Scroll Reveal ────────────────────────────────────────
const reveals = document.querySelectorAll('.reveal, .reveal-card');
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add('visible');
        entry.target.style.transitionDelay = '';
      }, entry.target.classList.contains('reveal-card') ? i * 80 : 0);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

reveals.forEach(el => observer.observe(el));

// ── Testimonials ─────────────────────────────────────────
const cards = document.querySelectorAll('.testimonial-card');
const dots  = document.querySelectorAll('.tdot');
let current = 0;

function showTestimonial(idx) {
  cards.forEach(c => c.classList.remove('active'));
  dots.forEach(d => d.classList.remove('active'));
  if (cards[idx]) cards[idx].classList.add('active');
  if (dots[idx])  dots[idx].classList.add('active');
  current = idx;
}

dots.forEach(dot => {
  dot.addEventListener('click', () => showTestimonial(+dot.dataset.i));
});

if (cards.length > 0) {
  setInterval(() => showTestimonial((current + 1) % cards.length), 4000);
}

// ── Contact Form Validation ──────────────────────────────
const form = document.getElementById('contactForm');
if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    let valid = true;

    ['name','email','message'].forEach(field => {
      const el = document.getElementById(field);
      const err = document.getElementById(field + 'Error');
      if (el) el.style.borderColor = '';
      if (err) err.textContent = '';
    });

    const name    = document.getElementById('name');
    const email   = document.getElementById('email');
    const message = document.getElementById('message');

    if (name && !name.value.trim()) {
      document.getElementById('nameError').textContent = 'Please enter your name.';
      name.style.borderColor = '#f87171';
      valid = false;
    }

    const emailRe = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;
    if (email && (!email.value.trim() || !emailRe.test(email.value))) {
      document.getElementById('emailError').textContent = 'Please enter a valid email.';
      email.style.borderColor = '#f87171';
      valid = false;
    }

    if (message && !message.value.trim()) {
      document.getElementById('messageError').textContent = 'Please describe your project.';
      message.style.borderColor = '#f87171';
      valid = false;
    }

    if (!valid) return;

    // Submit to Formspree
    const submitBtn = form.querySelector('[type=submit]');
    submitBtn.textContent = 'Sending…';
    submitBtn.disabled = true;

    try {
      const res = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      });

      const banner = document.getElementById('successBanner');
      if (res.ok) {
        form.reset();
        if (banner) {
          banner.style.display = 'block';
          banner.textContent = '✅ Message sent! We\'ll reply within 24 hours.';
        }
      } else {
        if (banner) {
          banner.style.display = 'block';
          banner.style.borderColor = '#f87171';
          banner.style.color = '#f87171';
          banner.textContent = '❌ Something went wrong. Please email us directly.';
        }
      }
    } catch {
      const banner = document.getElementById('successBanner');
      if (banner) {
        banner.style.display = 'block';
        banner.style.color = '#f87171';
        banner.textContent = '❌ Network error. Please try WhatsApp or email.';
      }
    }

    submitBtn.textContent = 'Send Message';
    submitBtn.disabled = false;
  });

  form.querySelectorAll('input, textarea').forEach(el => {
    el.addEventListener('input', () => { el.style.borderColor = ''; });
  });
}

// ── GSAP Navbar entrance ─────────────────────────────────
gsap.from('.navbar', { y: -80, opacity: 0, duration: 1, ease: 'power3.out' });
// ── Portfolio Live Preview — lazy-load iframes on first hover ──
document.querySelectorAll('.portfolio-card.pf-live').forEach(card => {
  let loaded = false;

  card.addEventListener('mouseenter', () => {
    if (loaded) return;
    loaded = true;

    const iframe = card.querySelector('.pf-iframe');
    if (!iframe) return;

    // Swap data-src → src to kick off the load
    iframe.src = iframe.dataset.src;

    iframe.addEventListener('load', () => {
      iframe.classList.add('loaded');
    }, { once: true });

    // Fallback: mark loaded after 4s in case iframe is blocked
    setTimeout(() => iframe.classList.add('loaded'), 4000);
  });
});
// ── Animated Stats Counter ────────────────────────────────
const statNums = document.querySelectorAll('.sstat-num');
if (statNums.length) {
  const countObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      if (el.dataset.symbol) return; // ∞ — no animation needed
      const target = parseInt(el.dataset.target, 10);
      const suffix = el.dataset.suffix || '';
      const duration = 1600;
      const start = performance.now();
      function tick(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
        el.textContent = Math.round(eased * target) + suffix;
        if (progress < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
      countObserver.unobserve(el);
    });
  }, { threshold: 0.5 });

  statNums.forEach(el => countObserver.observe(el));
}