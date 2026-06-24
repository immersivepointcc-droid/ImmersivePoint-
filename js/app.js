/**
 * Imagination Spark XR — Main application controller.
 * Detects XR capability and renders spatial vignettes or 2D card fallback.
 */

import { RIASECEngine, VIGNETTE_QUESTIONS, DIMENSION_LABELS } from './riasec-engine.js';
import { buildVignetteScene } from './vignettes.js';
import { DigitalPassport } from './passport.js';

const engine = new RIASECEngine();
const passport = new DigitalPassport();

let isXR = false;
let currentScene = null;

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
    showWelcome();
  });
}

function showWelcome() {
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
  const scene = document.getElementById('aframe-scene');
  const sceneContent = document.getElementById('scene-content');
  const ui = document.getElementById('app-ui');

  ui.innerHTML = `
    <div class="xr-overlay">
      <div class="progress-bar">
        <div class="progress-fill" style="width: ${((engine.questionIndex) / VIGNETTE_QUESTIONS.length) * 100}%"></div>
      </div>
      <p class="vignette-title">${question.title}</p>
      <p class="vignette-prompt">${question.prompt}</p>
    </div>
  `;

  scene.style.display = 'block';
  sceneContent.innerHTML = buildVignetteScene(question);

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
        target.setAttribute('scale', '1.1 1.1 1.1');
      });

      target.addEventListener('mouseleave', () => {
        const label = target.querySelector('.hover-label');
        if (label) label.setAttribute('visible', 'false');
        target.setAttribute('scale', '1 1 1');
      });
    });
  }, 100);
}

function handleSpatialChoice(question, targetId) {
  const choice = question.choices.find(c => c.spatialTarget === targetId);
  if (!choice) return;

  engine.recordInteraction(question.id, choice.scores);

  const target = document.querySelector(`[data-target="${targetId}"]`);
  if (target) {
    target.setAttribute('animation__select', 'property: scale; to: 1.3 1.3 1.3; dur: 200');
    target.setAttribute('animation__fade', 'property: opacity; to: 0; dur: 400; delay: 200');
  }

  setTimeout(() => loadQuestion(engine.questionIndex), 700);
}

function load2DCard(question) {
  const scene = document.getElementById('aframe-scene');
  scene.style.display = 'none';

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
  const scene = document.getElementById('aframe-scene');
  scene.style.display = 'none';

  const results = engine.getResults();
  const record = passport.writeResult(results);

  const ui = document.getElementById('app-ui');
  const topDims = results.topDimensions;
  const archetype = results.archetype;
  const pathways = results.pathways;
  const scores = results.scores;

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
