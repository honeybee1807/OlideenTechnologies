// ===========================
// Olideen Technologies — Floating Code Fragments Background
// TWEAKED: 80 fragments, bigger text, more visible, faster drift
// ===========================

(function () {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);

  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 0.1, 500);
  camera.position.z = 80;

  // ── Code fragments pool — expanded with more Olideen-specific code ──
  const FRAGMENTS = [
    // HTML
    '<div class="hero">',
    '</section>',
    '<nav>',
    'href="#contact"',
    '<footer>',
    '<canvas id="bg">',
    '<img src="logo.png">',
    'class="btn-primary"',
    'rel="stylesheet"',
    // CSS
    'display: flex;',
    'border-radius: 8px;',
    'z-index: 1000;',
    'opacity: 0.9;',
    'transition: all 0.3s',
    'grid-template-columns',
    'backdrop-filter: blur',
    'var(--cyan)',
    'var(--navy)',
    '@keyframes fadeIn',
    'position: fixed;',
    // JavaScript
    'const api = fetch()',
    'async function()',
    'return response;',
    'addEventListener()',
    'querySelector()',
    'JSON.stringify()',
    'console.log(data)',
    '.then(res => res)',
    'export default App',
    'import { useState }',
    'localStorage.get()',
    'window.scrollY',
    // Three.js specific
    'new THREE.Scene()',
    'renderer.render()',
    'requestAnimationFrame',
    'new THREE.Mesh()',
    // General dev
    'npm install',
    'git commit -m',
    'localhost:3000',
    'SELECT * FROM db',
    '01001101 01100101',
    '0xFF00D9FF',
    'SSH-2.0-OpenSSH',
    'HTTP/2 200 OK',
    '{ padding: 0 }',
    '[ ...spread ]',
    '===',
    '=>',
    '//',
    '/* Olideen */',
    'olideentech.com',
  ];

  // ── Colour palette ───────────────────────────────────────
  const COLOURS = [
    '#00D9FF', // cyan
    '#00D9FF',
    '#38BDF8', // blue
    '#38BDF8',
    '#7C3AED', // purple
    '#FFFFFF', // white
    '#4ADE80', // green — strings
    '#64748B', // dim grey — comments
  ];

  // ── Create canvas texture for each fragment ──────────────
  function makeFragmentTexture(text, colour, fontSize) {
    const off = document.createElement('canvas');
    const pad = 14;
    const ctx = off.getContext('2d');
    ctx.font   = `bold ${fontSize}px "Courier New", monospace`;
    const w    = ctx.measureText(text).width + pad * 2;
    const h    = fontSize + pad * 2;
    off.width  = w;
    off.height = h;
    ctx.font        = `bold ${fontSize}px "Courier New", monospace`;
    ctx.fillStyle   = colour;
    ctx.shadowColor = colour;
    ctx.shadowBlur  = 10;
    ctx.fillText(text, pad, fontSize + pad * 0.6);
    const tex = new THREE.CanvasTexture(off);
    return { tex, aspect: w / h };
  }

  // ── Spawn fragments ──────────────────────────────────────
  const FRAG_COUNT = 80;   // ← increased from 55
  const SPREAD_X   = 110;
  const SPREAD_Y   = 85;
  const SPREAD_Z   = 65;
  const fragments  = [];

  for (let i = 0; i < FRAG_COUNT; i++) {
    const text   = FRAGMENTS[Math.floor(Math.random() * FRAGMENTS.length)];
    const colour = COLOURS[Math.floor(Math.random() * COLOURS.length)];
    const size   = 16 + Math.floor(Math.random() * 14); // ← bigger: 16–30px (was 12–22)
    const { tex, aspect } = makeFragmentTexture(text, colour, size);

    const h   = 5 + Math.random() * 5;  // slightly taller planes
    const w   = h * aspect;
    const geo = new THREE.PlaneGeometry(w, h);
    const baseOpacity = 0.20;Math.random() * 0.12;// ← more visible (was 0.12–0.45)
    const mat = new THREE.MeshBasicMaterial({
      map: tex,
      transparent: true,
      opacity: baseOpacity,
      depthWrite: false,
    });

    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(
      (Math.random() - 0.5) * SPREAD_X,
      (Math.random() - 0.5) * SPREAD_Y,
      (Math.random() - 0.5) * SPREAD_Z
    );
    mesh.rotation.z = (Math.random() - 0.5) * 0.35;

    scene.add(mesh);

    fragments.push({
      mesh,
      vx: (Math.random() - 0.5) * 0.032, // ← faster (was 0.018)
      vy: (Math.random() - 0.5) * 0.022, // ← faster (was 0.012)
      vz: (Math.random() - 0.5) * 0.014, // ← faster (was 0.008)
      vRot: (Math.random() - 0.5) * 0.003,
      baseOpacity,
      pulseSpeed:  0.004 + Math.random() * 0.009,
      pulseOffset: Math.random() * Math.PI * 2,
      mat,
    });
  }

  // ── Mouse parallax ───────────────────────────────────────
  let targetX = 0, targetY = 0;
  document.addEventListener('mousemove', e => {
    targetX = (e.clientX / window.innerWidth  - 0.5) * 14;
    targetY = (e.clientY / window.innerHeight - 0.5) * -7;
  });

  // ── Resize ───────────────────────────────────────────────
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  // ── Animation loop ───────────────────────────────────────
  let t = 0;

  function animate() {
    requestAnimationFrame(animate);
    t += 0.016;

    for (const f of fragments) {
      const m = f.mesh;

      m.position.x += f.vx;
      m.position.y += f.vy;
      m.position.z += f.vz;
      m.rotation.z += f.vRot;

      // Wrap around bounds
      if (m.position.x >  SPREAD_X / 2) m.position.x = -SPREAD_X / 2;
      if (m.position.x < -SPREAD_X / 2) m.position.x =  SPREAD_X / 2;
      if (m.position.y >  SPREAD_Y / 2) m.position.y = -SPREAD_Y / 2;
      if (m.position.y < -SPREAD_Y / 2) m.position.y =  SPREAD_Y / 2;
      if (m.position.z >  SPREAD_Z / 2) m.position.z = -SPREAD_Z / 2;
      if (m.position.z < -SPREAD_Z / 2) m.position.z =  SPREAD_Z / 2;

      // Breathing pulse
      const pulse = Math.sin(t * f.pulseSpeed * 60 + f.pulseOffset) * 0.18;
      f.mat.opacity = Math.max(0.08, Math.min(0.75, f.baseOpacity + pulse));
    }

    // Smooth camera parallax
    camera.position.x += (targetX - camera.position.x) * 0.035;
    camera.position.y += (targetY - camera.position.y) * 0.035;
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
  }

  animate();
})();