// ===========================
// Olideen Technologies — Three.js Background
// Animated particle network with glowing nodes
// ===========================

(function () {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 80;

  // Colour palette matching the site
  const CYAN = new THREE.Color(0x00D9FF);
  const BLUE = new THREE.Color(0x38BDF8);
  const PURPLE = new THREE.Color(0x7C3AED);

  // ── Particles ──────────────────────────────────────────
  const PARTICLE_COUNT = 180;
  const positions = [];
  const velocities = [];
  const colors = [];

  const particleGeometry = new THREE.BufferGeometry();
  const posArray = new Float32Array(PARTICLE_COUNT * 3);
  const colArray = new Float32Array(PARTICLE_COUNT * 3);

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const x = (Math.random() - 0.5) * 200;
    const y = (Math.random() - 0.5) * 200;
    const z = (Math.random() - 0.5) * 60;
    positions.push(new THREE.Vector3(x, y, z));
    velocities.push(new THREE.Vector3(
      (Math.random() - 0.5) * 0.04,
      (Math.random() - 0.5) * 0.04,
      0
    ));

    posArray[i * 3]     = x;
    posArray[i * 3 + 1] = y;
    posArray[i * 3 + 2] = z;

    // Mix cyan and blue randomly
    const t = Math.random();
    const c = t < 0.5 ? CYAN : (t < 0.8 ? BLUE : PURPLE);
    colArray[i * 3]     = c.r;
    colArray[i * 3 + 1] = c.g;
    colArray[i * 3 + 2] = c.b;
  }

  particleGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
  particleGeometry.setAttribute('color', new THREE.BufferAttribute(colArray, 3));

  const particleMaterial = new THREE.PointsMaterial({
    size: 0.7,
    vertexColors: true,
    transparent: true,
    opacity: 0.85,
    sizeAttenuation: true,
  });

  const particleMesh = new THREE.Points(particleGeometry, particleMaterial);
  scene.add(particleMesh);

  // ── Connection Lines ────────────────────────────────────
  const LINE_DISTANCE = 28;
  const MAX_LINES = 300;

  const linePositions = new Float32Array(MAX_LINES * 6);
  const lineColors    = new Float32Array(MAX_LINES * 6);

  const lineGeometry = new THREE.BufferGeometry();
  lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
  lineGeometry.setAttribute('color',    new THREE.BufferAttribute(lineColors,    3));

  const lineMaterial = new THREE.LineSegments(
    lineGeometry,
    new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.25 })
  );
  scene.add(lineMaterial);

  // ── Mouse parallax ─────────────────────────────────────
  let mouseX = 0, mouseY = 0;
  document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth  - 0.5) * 0.4;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 0.4;
  });

  // ── Resize ─────────────────────────────────────────────
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  // ── Animation Loop ─────────────────────────────────────
  let frameId;
  const clock = new THREE.Clock();

  function animate() {
    frameId = requestAnimationFrame(animate);
    const t = clock.getElapsedTime();

    // Move particles
    const pos = particleGeometry.attributes.position.array;
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      positions[i].add(velocities[i]);

      // Wrap around bounds
      if (positions[i].x >  100) positions[i].x = -100;
      if (positions[i].x < -100) positions[i].x =  100;
      if (positions[i].y >  100) positions[i].y = -100;
      if (positions[i].y < -100) positions[i].y =  100;

      pos[i * 3]     = positions[i].x;
      pos[i * 3 + 1] = positions[i].y;
      pos[i * 3 + 2] = positions[i].z;
    }
    particleGeometry.attributes.position.needsUpdate = true;

    // Draw connection lines
    let lineIdx = 0;
    const lp = lineGeometry.attributes.position.array;
    const lc = lineGeometry.attributes.color.array;

    for (let i = 0; i < PARTICLE_COUNT && lineIdx < MAX_LINES; i++) {
      for (let j = i + 1; j < PARTICLE_COUNT && lineIdx < MAX_LINES; j++) {
        const dx = positions[i].x - positions[j].x;
        const dy = positions[i].y - positions[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < LINE_DISTANCE) {
          const alpha = 1 - dist / LINE_DISTANCE;

          lp[lineIdx * 6]     = positions[i].x;
          lp[lineIdx * 6 + 1] = positions[i].y;
          lp[lineIdx * 6 + 2] = positions[i].z;
          lp[lineIdx * 6 + 3] = positions[j].x;
          lp[lineIdx * 6 + 4] = positions[j].y;
          lp[lineIdx * 6 + 5] = positions[j].z;

          lc[lineIdx * 6]     = CYAN.r * alpha;
          lc[lineIdx * 6 + 1] = CYAN.g * alpha;
          lc[lineIdx * 6 + 2] = CYAN.b * alpha;
          lc[lineIdx * 6 + 3] = BLUE.r * alpha;
          lc[lineIdx * 6 + 4] = BLUE.g * alpha;
          lc[lineIdx * 6 + 5] = BLUE.b * alpha;

          lineIdx++;
        }
      }
    }

    // Zero out unused lines
    for (let k = lineIdx; k < MAX_LINES; k++) {
      for (let m = 0; m < 6; m++) lp[k * 6 + m] = 0;
    }
    lineGeometry.attributes.position.needsUpdate = true;
    lineGeometry.attributes.color.needsUpdate = true;
    lineGeometry.setDrawRange(0, lineIdx * 2);

    // Subtle camera parallax
    camera.position.x += (mouseX * 10 - camera.position.x) * 0.03;
    camera.position.y += (-mouseY * 10 - camera.position.y) * 0.03;
    camera.lookAt(scene.position);

    // Slowly rotate the whole scene
    scene.rotation.z = Math.sin(t * 0.05) * 0.03;

    renderer.render(scene, camera);
  }

  animate();
})();
