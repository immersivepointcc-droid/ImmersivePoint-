import { RIASECEngine, VIGNETTE_QUESTIONS, DIMENSION_LABELS } from './riasec-engine.js';
import { buildVignetteScene } from './vignettes.js';
import { DigitalPassport } from './passport.js';

const engine = new RIASECEngine();
const passport = new DigitalPassport();

let isXR = false;
let xrActive = false;
let fuseAnimFrame = null;
let fuseStartTime = 0;
const FUSE_DURATION = 2000;

async function detectXR() {
  if (!navigator.xr) return false;
  try {
    return await navigator.xr.isSessionSupported('immersive-vr');
  } catch {
    return false;
  }
}

function init() {
  detectXR().then(supported => {
    isXR = supported;
    document.body.setAttribute('data-mode', isXR ? 'xr' : '2d');

    if (isXR) {
      const btn = document.getElementById('xr-enter-btn');
      if (btn) btn.style.display = 'block';
    }

    buildGroundGrid();
    wireXREvents();
    showWelcome();
  });
}

function buildGroundGrid() {
  const gridEl = document.getElementById('xr-grid-lines');
  if (!gridEl) return;

  for (let r = 1; r <= 7; r++) {
    const ring = document.createElement('a-ring');
    ring.setAttribute('position', '0 0.015 0');
    ring.setAttribute('rotation', '-90 0 0');
    ring.setAttribute('radius-inner', r - 0.01);
    ring.setAttribute('radius-outer', r + 0.01);
    ring.setAttribute('material', `color: #f0a830; opacity: ${0.12 - r * 0.012}; shader: flat; transparent: true`);
    ring.setAttribute('segments-theta', '64');
    gridEl.appendChild(ring);
  }

  for (let a = 0; a < 360; a += 30) {
    const line = document.createElement('a-plane');
    line.setAttribute('position', '0 0.015 0');
    line.setAttribute('rotation', `-90 ${a} 0`);
    line.setAttribute('width', '0.008');
    line.setAttribute('height', '7');
    line.setAttribute('material', 'color: #f0a830; opacity: 0.05; shader: flat; transparent: true; side: double');
    gridEl.appendChild(line);
  }
}

function comfortFade(callback) {
  const vignette = document.getElementById('xr-vignette');
  if (!vignette || !xrActive) {
    if (callback) callback();
    return;
  }

  vignette.setAttribute('animation__fadein',
    'property: material.opacity; from: 0; to: 1; dur: 300; easing: easeInQuad');

  setTimeout(() => {
    if (callback) callback();
    setTimeout(() => {
      vignette.setAttribute('animation__fadeout',
        'property: material.opacity; from: 1; to: 0; dur: 400; easing: easeOutQuad');
    }, 100);
  }, 350);
}

function startFuseAnim() {
  const ring = document.getElementById('xr-fuse-ring');
  if (!ring) return;
  ring.setAttribute('visible', true);
  fuseStartTime = performance.now();

  function animate() {
    const elapsed = performance.now() - fuseStartTime;
    const progress = Math.min(elapsed / FUSE_DURATION, 1);
    ring.setAttribute('geometry',
      `primitive: ring; radiusInner: 0.006; radiusOuter: 0.012; thetaLength: ${progress * 360}`);

    const color = progress < 0.5 ? '#f0a830' : '#40c080';
    ring.setAttribute('material', `color: ${color}; shader: flat; opacity: 0.8; transparent: true; side: double`);

    if (progress < 1) fuseAnimFrame = requestAnimationFrame(animate);
  }
  fuseAnimFrame = requestAnimationFrame(animate);
}

function stopFuseAnim() {
  if (fuseAnimFrame) {
    cancelAnimationFrame(fuseAnimFrame);
    fuseAnimFrame = null;
  }
  const ring = document.getElementById('xr-fuse-ring');
  if (ring) {
    ring.setAttribute('visible', false);
    ring.setAttribute('geometry', 'primitive: ring; radiusInner: 0.006; radiusOuter: 0.012; thetaLength: 0');
  }
}

function updateXRHud(question) {
  const hud = document.getElementById('xr-hud');
  const qPanel = document.getElementById('xr-question-panel');
  if (!hud) return;

  hud.setAttribute('visible', true);
  if (qPanel) qPanel.setAttribute('visible', true);

  const counter = document.getElementById('xr-hud-counter');
  if (counter) counter.setAttribute('value', `${engine.questionIndex + 1} / ${VIGNETTE_QUESTIONS.length}`);

  const title = document.getElementById('xr-hud-title');
  if (title) title.setAttribute('value', question.title);

  const fillPct = (engine.questionIndex + 1) / VIGNETTE_QUESTIONS.length;
  const fillWidth = 1.6 * fillPct;
  const fillEl = document.getElementById('xr-hud-progress-fill');
  if (fillEl) {
    fillEl.setAttribute('width', Math.max(0.02, fillWidth));
    fillEl.setAttribute('position', `${-0.8 + fillWidth / 2} 0.42 0.001`);
  }

  const qText = document.getElementById('xr-q-text');
  if (qText) qText.setAttribute('value', question.prompt);
}

function hideXRHud() {
  const hud = document.getElementById('xr-hud');
  const qPanel = document.getElementById('xr-question-panel');
  const loading = document.getElementById('xr-loading');
  if (hud) hud.setAttribute('visible', false);
  if (qPanel) qPanel.setAttribute('visible', false);
  if (loading) loading.setAttribute('visible', false);
}

function showXRLoading() {
  hideXRHud();
  const loading = document.getElementById('xr-loading');
  if (loading) loading.setAttribute('visible', true);
}

function wireXREvents() {
  const scene = document.getElementById('aframe-scene');
  const enterBtn = document.getElementById('xr-enter-btn');

  if (enterBtn) {
    enterBtn.addEventListener('click', () => {
      if (scene && !scene.is('vr-mode')) scene.enterVR();
    });
  }

  if (scene) {
    scene.addEventListener('enter-vr', () => {
      xrActive = true;
      document.body.classList.add('xr-active');
    });
    scene.addEventListener('exit-vr', () => {
      xrActive = false;
      document.body.classList.remove('xr-active');
      stopFuseAnim();
    });
  }

  const cursor = document.getElementById('xr-cursor');
  if (cursor) {
    cursor.addEventListener('mouseenter', () => {
      const reticle = document.getElementById('xr-reticle');
      if (reticle) {
        reticle.setAttribute('material', 'color: #e06040; shader: flat; opacity: 1; transparent: true');
        reticle.setAttribute('geometry', 'primitive: ring; radiusInner: 0.003; radiusOuter: 0.006');
      }
    });
    cursor.addEventListener('mouseleave', () => {
      const reticle = document.getElementById('xr-reticle');
      if (reticle) {
        reticle.setAttribute('material', 'color: #f0a830; shader: flat; opacity: 0.9; transparent: true');
        reticle.setAttribute('geometry', 'primitive: ring; radiusInner: 0.002; radiusOuter: 0.004');
      }
    });
  }
}

function showWelcome() {
  hideXRHud();
  const container = document.getElementById('app-ui');
  container.innerHTML = `
    <div class="welcome-screen">
      <div class="spark-logo">
        <span class="spark-icon">✦</span>
        <h1>Imagination Spark</h1>
        <p class="subtitle">Discover Your Career DNA</p>
      </div>
      <p class="welcome-text">
        Step into 10 real-world workplaces. What catches your eye reveals
        the career pathways that fit you best.
      </p>
      <p class="mode-badge ${isXR ? 'xr-mode' : 'flat-mode'}">
        ${isXR ? '🥽 Immersive XR Mode' : '📱 Interactive Mode'}
      </p>
      <button class="btn-primary" onclick="window.sparkApp.startAssessment()">
        Begin Your Spark
      </button>
      <p class="welcome-footer">Takes about 3 minutes · Works offline · Your data stays on-device</p>
    </div>
  `;
}

function startAssessment() {
  engine.reset();
  loadQuestion(0);
}

function loadQuestion(index) {
  if (index >= VIGNETTE_QUESTIONS.length) {
    showResults();
    return;
  }

  const question = VIGNETTE_QUESTIONS[index];

  if (isXR) {
    loadXRVignette(question);
  } else {
    load2DCard(question);
  }
}

function loadXRVignette(question) {
  const sceneContent = document.getElementById('scene-content');
  const ui = document.getElementById('app-ui');

  const doLoad = () => {
    ui.innerHTML = `
      <div class="xr-overlay">
        <div class="progress-bar">
          <div class="progress-fill" style="width: ${((engine.questionIndex) / VIGNETTE_QUESTIONS.length) * 100}%"></div>
        </div>
        <p class="vignette-title">${question.title}</p>
        <p class="vignette-prompt">${question.prompt}</p>
      </div>
    `;

    sceneContent.innerHTML = buildVignetteScene(question);
    updateXRHud(question);

    setTimeout(() => {
      const targets = sceneContent.querySelectorAll('.interactive-target');
      targets.forEach(target => {
        target.addEventListener('click', () => {
          const targetId = target.getAttribute('data-target');
          handleSpatialChoice(question, targetId);
        });

        target.addEventListener('mouseenter', () => {
          const label = target.querySelector('.hover-label');
          if (label) label.setAttribute('visible', 'true');
          target.setAttribute('animation__grow', 'property: scale; to: 1.1 1.1 1.1; dur: 200; easing: easeOutQuad');
          startFuseAnim();

          const sndHover = document.getElementById('xr-snd-hover');
          if (sndHover?.components?.sound) sndHover.components.sound.playSound();
        });

        target.addEventListener('mouseleave', () => {
          const label = target.querySelector('.hover-label');
          if (label) label.setAttribute('visible', 'false');
          target.setAttribute('animation__shrink', 'property: scale; to: 1 1 1; dur: 200; easing: easeOutQuad');
          stopFuseAnim();
        });
      });
    }, 100);
  };

  if (engine.questionIndex > 0) {
    showXRLoading();
    comfortFade(() => {
      const loading = document.getElementById('xr-loading');
      if (loading) loading.setAttribute('visible', false);
      doLoad();
    });
  } else {
    doLoad();
  }
}

function handleSpatialChoice(question, targetId) {
  const choice = question.choices.find(c => c.spatialTarget === targetId);
  if (!choice) return;

  stopFuseAnim();
  engine.recordInteraction(question.id, choice.scores);

  const sndClick = document.getElementById('xr-snd-click');
  if (sndClick?.components?.sound) sndClick.components.sound.playSound();

  const allTargets = document.querySelectorAll('.interactive-target');
  allTargets.forEach(t => {
    if (t.getAttribute('data-target') === targetId) {
      t.setAttribute('animation__select', 'property: scale; to: 1.3 1.3 1.3; dur: 200; easing: easeOutQuad');
    } else {
      t.setAttribute('animation__fadeout', 'property: material.opacity; to: 0.15; dur: 300; easing: easeInQuad');
    }
  });

  setTimeout(() => loadQuestion(engine.questionIndex), 700);
}

function load2DCard(question) {
  hideXRHud();

  const ui = document.getElementById('app-ui');
  const progress = ((engine.questionIndex) / VIGNETTE_QUESTIONS.length) * 100;

  ui.innerHTML = `
    <div class="card-screen">
      <div class="progress-bar">
        <div class="progress-fill" style="width: ${progress}%"></div>
      </div>
      <div class="question-counter">${engine.questionIndex + 1} of ${VIGNETTE_QUESTIONS.length}</div>
      <div class="vignette-card">
        <h2 class="card-title">${question.title}</h2>
        <p class="card-prompt">${question.prompt}</p>
        <div class="choices">
          ${question.choices.map((choice, i) => `
            <button class="choice-btn" data-index="${i}">
              <span class="choice-text">${choice.label}</span>
              <span class="choice-arrow">→</span>
            </button>
          `).join('')}
        </div>
      </div>
    </div>
  `;

  ui.querySelectorAll('.choice-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const choiceIndex = parseInt(btn.getAttribute('data-index'));
      const choice = question.choices[choiceIndex];

      btn.classList.add('selected');
      engine.recordInteraction(question.id, choice.scores);

      setTimeout(() => loadQuestion(engine.questionIndex), 400);
    });
  });
}

function showResults() {
  hideXRHud();

  const results = engine.getResults();
  const record = passport.writeResult(results);

  const archetype = results.archetype;
  const pathways = results.pathways;
  const scores = results.scores;

  const ui = document.getElementById('app-ui');
  ui.innerHTML = `
    <div class="results-screen">
      <div class="results-header">
        <span class="spark-icon">✦</span>
        <h1>Your Spark Profile</h1>
      </div>

      <div class="archetype-card">
        <h2 class="archetype-name">${archetype.name}</h2>
        <p class="archetype-dims">
          ${DIMENSION_LABELS[archetype.primary]} + ${DIMENSION_LABELS[archetype.secondary]}
        </p>
      </div>

      <div class="riasec-chart">
        <h3>Your RIASEC Signature</h3>
        <div class="score-bars">
          ${Object.entries(scores).map(([dim, score]) => `
            <div class="score-row">
              <span class="dim-label">${DIMENSION_LABELS[dim]}</span>
              <div class="bar-track">
                <div class="bar-fill" style="width: ${score}%" data-dim="${dim}"></div>
              </div>
              <span class="dim-score">${score}</span>
            </div>
          `).join('')}
        </div>
      </div>

      <div class="pathways-section">
        <h3>Recommended Pathways</h3>
        <div class="pathway-primary">
          <span class="pathway-icon">${pathways.primary.icon}</span>
          <div>
            <strong>${pathways.primary.name}</strong>
            <span class="pathway-badge">Best Match</span>
          </div>
        </div>
        ${pathways.related.map(p => `
          <div class="pathway-related">
            <span class="pathway-icon">${p.icon}</span>
            <span>${p.name}</span>
          </div>
        `).join('')}
      </div>

      <div class="passport-status">
        <p>Saved to your Digital Passport</p>
        <small>Record ID: ${record.learnerId.slice(0, 12)}...</small>
      </div>

      <button class="btn-primary" onclick="window.sparkApp.startAssessment()">
        Retake Assessment
      </button>
    </div>
  `;

  setTimeout(() => {
    document.querySelectorAll('.bar-fill').forEach(bar => {
      bar.style.transition = 'width 0.8s ease-out';
    });
  }, 100);
}

window.sparkApp = { startAssessment };

document.addEventListener('DOMContentLoaded', init);

export { init, startAssessment };
