/**
 * Vignette renderer — builds A-Frame scenes for each RIASEC question.
 * Welding bay is fully built; other environments use generated layouts.
 */

const ENV_CONFIGS = {
  welding: {
    sky: '#1a0a00',
    ambientLight: '#ff6600',
    ambientIntensity: 0.3,
    ground: '#2a2a2a',
    particles: 'sparks'
  },
  clinic: {
    sky: '#e8f4f8',
    ambientLight: '#ffffff',
    ambientIntensity: 0.8,
    ground: '#d4e8d4',
    particles: null
  },
  cnc: {
    sky: '#1a1a2e',
    ambientLight: '#88aacc',
    ambientIntensity: 0.5,
    ground: '#3a3a3a',
    particles: null
  },
  studio: {
    sky: '#f5f0e8',
    ambientLight: '#ffffff',
    ambientIntensity: 0.9,
    ground: '#e8e0d0',
    particles: null
  },
  server: {
    sky: '#0a0a1a',
    ambientLight: '#0066ff',
    ambientIntensity: 0.3,
    ground: '#1a1a2a',
    particles: 'leds'
  },
  community: {
    sky: '#87CEEB',
    ambientLight: '#ffffff',
    ambientIntensity: 0.7,
    ground: '#8B7355',
    particles: null
  },
  warehouse: {
    sky: '#c0c0c0',
    ambientLight: '#ffdd88',
    ambientIntensity: 0.6,
    ground: '#808080',
    particles: null
  },
  lab: {
    sky: '#f0f8ff',
    ambientLight: '#ccddff',
    ambientIntensity: 0.8,
    ground: '#e0e8f0',
    particles: null
  },
  startup: {
    sky: '#fafafa',
    ambientLight: '#ffffff',
    ambientIntensity: 0.85,
    ground: '#e0d8c8',
    particles: null
  },
  outdoor: {
    sky: '#ff8844',
    ambientLight: '#ffaa44',
    ambientIntensity: 0.6,
    ground: '#8B6914',
    particles: null
  }
};

function buildWeldingBayScene() {
  return `
    <!-- Welding Bay Environment -->
    <a-entity id="welding-env">
      <!-- Floor -->
      <a-plane position="0 0 0" rotation="-90 0 0" width="12" height="12"
               color="#2a2a2a" metalness="0.8" roughness="0.4"></a-plane>

      <!-- Back wall -->
      <a-plane position="0 3 -6" width="12" height="6" color="#3a3028"></a-plane>

      <!-- Side walls -->
      <a-plane position="-6 3 0" rotation="0 90 0" width="12" height="6" color="#3a3028"></a-plane>
      <a-plane position="6 3 0" rotation="0 -90 0" width="12" height="6" color="#3a3028"></a-plane>

      <!-- Welding table -->
      <a-box position="0 0.5 -2" width="2" height="1" depth="1" color="#555555"
             metalness="0.9" roughness="0.3"></a-box>

      <!-- Torch (interactive) -->
      <a-entity id="spatial-torch" class="interactive-target" data-target="torch"
                position="-0.5 1.1 -2">
        <a-cylinder radius="0.03" height="0.3" color="#cc8800" rotation="0 0 -30"></a-cylinder>
        <a-sphere radius="0.02" position="0.08 0.15 0" color="#ff4400"
                  animation="property: material.emissiveIntensity; from: 0.5; to: 1; dur: 500; dir: alternate; loop: true"></a-sphere>
        <a-text value="Pick up torch" position="0 0.25 0" align="center" width="1.5"
                color="#ffcc00" visible="false" class="hover-label"></a-text>
      </a-entity>

      <!-- Quality chart (interactive) -->
      <a-entity id="spatial-chart" class="interactive-target" data-target="chart"
                position="2 1.8 -5.9">
        <a-plane width="1.2" height="0.8" color="#ffffff"></a-plane>
        <a-text value="WELD QUALITY\nSTANDARDS" position="0 0.1 0.01" align="center"
                width="1" color="#333333"></a-text>
        <a-text value="Inspect chart" position="0 -0.55 0" align="center" width="1.5"
                color="#ffcc00" visible="false" class="hover-label"></a-text>
      </a-entity>

      <!-- Blueprint table (interactive) -->
      <a-entity id="spatial-blueprint" class="interactive-target" data-target="blueprint"
                position="-3 0.9 -3">
        <a-box width="1.5" height="0.8" depth="0.8" color="#555555" metalness="0.7"></a-box>
        <a-plane position="0 0.41 0" rotation="-90 0 0" width="1.3" height="0.7" color="#d4e4ff"></a-plane>
        <a-text value="BRACKET\nDESIGN v2" position="0 0.42 0" rotation="-90 0 0"
                align="center" width="0.8" color="#1a3a6a"></a-text>
        <a-text value="Sketch design" position="0 0.7 0" align="center" width="1.5"
                color="#ffcc00" visible="false" class="hover-label"></a-text>
      </a-entity>

      <!-- Spark particles -->
      <a-entity id="sparks" position="0 1.2 -2"
                particle-system="preset: dust; color: #ff6600,#ffaa00; particleCount: 50;
                                 size: 0.05; maxAge: 0.5; velocityValue: 0 2 0;
                                 velocitySpread: 1 1 1; opacity: 0.8">
      </a-entity>

      <!-- Overhead lights -->
      <a-entity light="type: spot; color: #ff8844; intensity: 1.5; angle: 45; penumbra: 0.3"
                position="0 5 -2" rotation="-90 0 0"></a-entity>
      <a-entity light="type: spot; color: #ffaa66; intensity: 0.8; angle: 60"
                position="-3 5 -3" rotation="-90 0 0"></a-entity>

      <!-- Tool rack on wall -->
      <a-entity position="-5.9 2 -2">
        <a-box width="0.1" height="2" depth="0.5" color="#444444"></a-box>
        <a-cylinder radius="0.02" height="0.4" color="#888888" position="0.1 0.5 0" rotation="0 0 90"></a-cylinder>
        <a-cylinder radius="0.02" height="0.4" color="#888888" position="0.1 0 0" rotation="0 0 90"></a-cylinder>
        <a-cylinder radius="0.02" height="0.4" color="#888888" position="0.1 -0.5 0" rotation="0 0 90"></a-cylinder>
      </a-entity>

      <!-- Gas tanks -->
      <a-entity position="3 0 -4">
        <a-cylinder radius="0.15" height="1.2" color="#006600" position="0 0.6 0"></a-cylinder>
        <a-cylinder radius="0.15" height="1.2" color="#000066" position="0.4 0.6 0"></a-cylinder>
      </a-entity>
    </a-entity>
  `;
}

function buildGenericScene(config, question) {
  const positions = [
    { x: -2, y: 1.2, z: -3 },
    { x: 2, y: 1.2, z: -3 },
    { x: 0, y: 1.2, z: -4 }
  ];

  const choiceEntities = question.choices.map((choice, i) => {
    const pos = positions[i];
    return `
      <a-entity id="spatial-${choice.spatialTarget}" class="interactive-target"
                data-target="${choice.spatialTarget}" position="${pos.x} ${pos.y} ${pos.z}">
        <a-box width="0.8" height="0.8" depth="0.8" color="#ffffff" opacity="0.9"
               metalness="0.2" roughness="0.8"
               animation="property: rotation; to: 0 360 0; dur: 8000; loop: true; easing: linear"></a-box>
        <a-text value="${choice.label}" position="0 0.7 0" align="center" width="2"
                color="#ffffff"></a-text>
        <a-text value="Select" position="0 -0.7 0" align="center" width="1.5"
                color="#ffcc00" visible="false" class="hover-label"></a-text>
      </a-entity>
    `;
  }).join('');

  return `
    <a-entity id="${question.environment}-env">
      <a-plane position="0 0 0" rotation="-90 0 0" width="14" height="14"
               color="${config.ground}" metalness="0.3" roughness="0.7"></a-plane>
      <a-plane position="0 3.5 -7" width="14" height="7" color="${config.sky}" opacity="0.5"></a-plane>
      <a-entity light="type: ambient; color: ${config.ambientLight}; intensity: ${config.ambientIntensity}"></a-entity>
      <a-entity light="type: directional; color: #ffffff; intensity: 0.6" position="2 4 1"></a-entity>
      ${choiceEntities}
    </a-entity>
  `;
}

function buildVignetteScene(question) {
  if (question.environment === 'welding') {
    return buildWeldingBayScene();
  }
  const config = ENV_CONFIGS[question.environment] || ENV_CONFIGS.welding;
  return buildGenericScene(config, question);
}

export { buildVignetteScene, ENV_CONFIGS };
