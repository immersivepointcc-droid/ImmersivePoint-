/**
 * Vignette renderer — builds A-Frame scenes for each RIASEC question.
 * Detailed vignettes for all 10 environments; generic fallback for any future additions.
 */

import { buildCNCShopScene, buildServerRoomScene, buildWarehouseScene, buildOutdoorSiteScene } from './vignettes-industrial.js';

const ENV_PRESETS = {
  welding:    { preset: 'threetowers', skyType: 'gradient', skyColor: '#111424', horizonColor: '#2b314d', lighting: 'none', fog: 0.7 },
  clinic:     { preset: 'default',     skyType: 'gradient', skyColor: '#c8e8ff', horizonColor: '#eef6ff', lighting: 'none', fog: 0.85 },
  cnc:        { preset: 'tron',        skyType: 'gradient', skyColor: '#0a0a20', horizonColor: '#1a1a3e', lighting: 'none', fog: 0.6 },
  studio:     { preset: 'japan',       skyType: 'gradient', skyColor: '#f5f0e8', horizonColor: '#e8ddc8', lighting: 'none', fog: 0.9 },
  server:     { preset: 'tron',        skyType: 'gradient', skyColor: '#000011', horizonColor: '#001133', lighting: 'none', fog: 0.5 },
  community:  { preset: 'forest',      skyType: 'gradient', skyColor: '#87CEEB', horizonColor: '#b8d8b8', lighting: 'none', fog: 0.8 },
  warehouse:  { preset: 'goaland',     skyType: 'gradient', skyColor: '#b0b0b0', horizonColor: '#808888', lighting: 'none', fog: 0.7 },
  lab:        { preset: 'default',     skyType: 'gradient', skyColor: '#e8f0ff', horizonColor: '#d0e0f8', lighting: 'none', fog: 0.85 },
  startup:    { preset: 'japan',       skyType: 'gradient', skyColor: '#fafafa', horizonColor: '#e8e0d0', lighting: 'none', fog: 0.9 },
  outdoor:    { preset: 'goldmine',    skyType: 'gradient', skyColor: '#ff8844', horizonColor: '#cc6622', lighting: 'none', fog: 0.6 }
};

function envString(env) {
  const c = ENV_PRESETS[env] || ENV_PRESETS.welding;
  return Object.entries(c).map(([k, v]) => `${k}: ${v}`).join('; ');
}

// ---------------------------------------------------------------------------
// WELDING BAY — full detail
// ---------------------------------------------------------------------------
function buildWeldingBayScene() {
  return `
    <a-entity id="welding-env">
      <a-entity environment="${envString('welding')}"></a-entity>

      <!-- Lighting rig -->
      <a-entity light="type: ambient; color: #ff6600; intensity: 0.25"></a-entity>
      <a-entity light="type: spot; color: #ff8844; intensity: 2; angle: 40; penumbra: 0.4; decay: 1.5"
                position="0 5.5 -2" rotation="-90 0 0"></a-entity>
      <a-entity light="type: spot; color: #ffaa66; intensity: 1; angle: 55; penumbra: 0.5"
                position="-3 5 -3" rotation="-80 20 0"></a-entity>
      <a-entity light="type: point; color: #ff4400; intensity: 0.6; distance: 4"
                position="-0.4 1.35 -2"></a-entity>

      <!-- Concrete floor -->
      <a-plane position="0 0.01 0" rotation="-90 0 0" width="14" height="14"
               color="#2a2a2a" metalness="0.85" roughness="0.35"></a-plane>

      <!-- Walls -->
      <a-plane position="0 3.5 -7" width="14" height="7" color="#3a3028"
               metalness="0.3" roughness="0.9"></a-plane>
      <a-plane position="-7 3.5 0" rotation="0 90 0" width="14" height="7" color="#3a3028"
               metalness="0.3" roughness="0.9"></a-plane>
      <a-plane position="7 3.5 0" rotation="0 -90 0" width="14" height="7" color="#3a3028"
               metalness="0.3" roughness="0.9"></a-plane>

      <!-- Heavy steel welding table -->
      <a-box position="0 0.45 -2" width="2.2" height="0.9" depth="1.1" color="#4a4a4a"
             metalness="0.95" roughness="0.2"></a-box>
      <a-box position="-0.9 0.04 -1.5" width="0.12" height="0.08" depth="0.12" color="#333"></a-box>
      <a-box position="0.9 0.04 -1.5" width="0.12" height="0.08" depth="0.12" color="#333"></a-box>
      <a-box position="-0.9 0.04 -2.5" width="0.12" height="0.08" depth="0.12" color="#333"></a-box>
      <a-box position="0.9 0.04 -2.5" width="0.12" height="0.08" depth="0.12" color="#333"></a-box>

      <!-- Steel workpiece on table -->
      <a-box position="0.3 1.0 -2" width="0.6" height="0.08" depth="0.3" color="#777"
             metalness="0.95" roughness="0.15" rotation="0 15 0"></a-box>
      <a-box position="0.3 1.04 -1.9" width="0.08" height="0.15" depth="0.25" color="#666"
             metalness="0.9" roughness="0.2" rotation="0 15 0"></a-box>

      <!-- Welding clamps -->
      <a-entity position="-0.1 1.0 -2.2">
        <a-box width="0.06" height="0.12" depth="0.15" color="#cc4400" metalness="0.7"></a-box>
        <a-box width="0.06" height="0.03" depth="0.2" color="#aa3300" position="0 -0.06 0.02"></a-box>
      </a-entity>

      <!-- === TORCH (interactive) === -->
      <a-entity id="spatial-torch" class="interactive-target" data-target="torch"
                position="-0.5 1.05 -2">
        <!-- Handle -->
        <a-cylinder radius="0.025" height="0.22" color="#cc8800" rotation="0 0 -25"
                    metalness="0.6" roughness="0.4"></a-cylinder>
        <!-- Neck -->
        <a-cylinder radius="0.015" height="0.15" color="#888888" position="0.06 0.15 0"
                    rotation="0 0 -10" metalness="0.9"></a-cylinder>
        <!-- Tip glow -->
        <a-sphere radius="0.018" position="0.08 0.22 0" color="#ff4400"
                  material="emissive: #ff2200; emissiveIntensity: 1.5"
                  animation="property: material.emissiveIntensity; from: 0.8; to: 2; dur: 300; dir: alternate; loop: true"></a-sphere>
        <!-- Hose -->
        <a-cylinder radius="0.012" height="0.5" color="#333333" position="-0.15 -0.15 0"
                    rotation="0 0 70" metalness="0.3"></a-cylinder>
        <a-text value="Grab the torch" position="0 0.35 0" align="center" width="1.8"
                color="#ffcc00" visible="false" class="hover-label"></a-text>
      </a-entity>

      <!-- Sparks from weld point -->
      <a-entity position="0.3 1.15 -2"
                particle-system="preset: dust; color: #ff6600,#ffaa00,#ffdd44; particleCount: 80;
                                 size: 0.04,0.08; maxAge: 0.4; velocityValue: 0 3 0;
                                 velocitySpread: 2 1 2; opacity: 0.9; blending: 2"></a-entity>

      <!-- === QUALITY CHART (interactive) === -->
      <a-entity id="spatial-chart" class="interactive-target" data-target="chart"
                position="2.5 1.6 -6.85">
        <!-- Clipboard backing -->
        <a-box width="0.9" height="1.2" depth="0.04" color="#8B7355" metalness="0.1" roughness="0.9"></a-box>
        <!-- Paper -->
        <a-plane width="0.78" height="1.05" color="#f5f0e0" position="0 -0.02 0.025"></a-plane>
        <!-- Header -->
        <a-text value="WELD QUALITY\nINSPECTION" position="0 0.35 0.03" align="center"
                width="0.7" color="#222222" font="kelsonsans"></a-text>
        <!-- Chart bars -->
        <a-box width="0.12" height="0.25" depth="0.01" color="#cc0000" position="-0.2 0 0.03"></a-box>
        <a-box width="0.12" height="0.4" depth="0.01" color="#00aa00" position="0 0 0.03"></a-box>
        <a-box width="0.12" height="0.3" depth="0.01" color="#0066cc" position="0.2 0 0.03"></a-box>
        <!-- Grid lines -->
        <a-plane width="0.6" height="0.002" color="#999999" position="0 -0.2 0.03"></a-plane>
        <a-plane width="0.6" height="0.002" color="#999999" position="0 -0.05 0.03"></a-plane>
        <a-plane width="0.6" height="0.002" color="#999999" position="0 0.1 0.03"></a-plane>
        <!-- Clip -->
        <a-box width="0.15" height="0.06" depth="0.06" color="#888888" position="0 0.6 0"
               metalness="0.9" roughness="0.2"></a-box>
        <a-text value="Inspect the chart" position="0 -0.75 0" align="center" width="1.8"
                color="#ffcc00" visible="false" class="hover-label"></a-text>
      </a-entity>

      <!-- === BLUEPRINT TABLE (interactive) === -->
      <a-entity id="spatial-blueprint" class="interactive-target" data-target="blueprint"
                position="-3.5 0 -4">
        <!-- Drafting table -->
        <a-box width="1.6" height="0.06" depth="1" color="#8B6914" position="0 0.88 0"
               rotation="-8 0 0" metalness="0.2" roughness="0.8"></a-box>
        <!-- Legs -->
        <a-cylinder radius="0.035" height="0.88" color="#5a4a2a" position="-0.7 0.44 -0.4"></a-cylinder>
        <a-cylinder radius="0.035" height="0.88" color="#5a4a2a" position="0.7 0.44 -0.4"></a-cylinder>
        <a-cylinder radius="0.035" height="0.8" color="#5a4a2a" position="-0.7 0.4 0.4"></a-cylinder>
        <a-cylinder radius="0.035" height="0.8" color="#5a4a2a" position="0.7 0.4 0.4"></a-cylinder>
        <!-- Blueprint paper -->
        <a-plane width="1.3" height="0.8" color="#d4e4ff" position="0 0.92 0"
                 rotation="-98 0 0"></a-plane>
        <a-text value="STRUCTURAL BRACKET\nREV 2.1  —  SCALE 1:4" position="0 0.93 0.02"
                rotation="-98 0 0" align="center" width="0.9" color="#1a3a6a"></a-text>
        <!-- Line drawings on blueprint -->
        <a-plane width="0.6" height="0.002" color="#1a3a8a" position="-0.1 0.93 -0.15"
                 rotation="-98 0 0"></a-plane>
        <a-plane width="0.002" height="0.35" color="#1a3a8a" position="0.15 0.93 -0.1"
                 rotation="-98 0 0"></a-plane>
        <!-- Pencil -->
        <a-cylinder radius="0.008" height="0.18" color="#ffcc00" position="0.5 0.94 0.1"
                    rotation="-8 25 85"></a-cylinder>
        <a-text value="Sketch a new design" position="0 1.3 0" align="center" width="1.8"
                color="#ffcc00" visible="false" class="hover-label"></a-text>
      </a-entity>

      <!-- Tool rack on left wall -->
      <a-entity position="-6.85 1.8 -2">
        <!-- Pegboard -->
        <a-box width="0.08" height="2.2" depth="1.8" color="#5a5040" metalness="0.1" roughness="0.9"></a-box>
        <!-- Hooks + tools -->
        <a-cylinder radius="0.015" height="0.25" color="#888" position="0.08 0.6 -0.3" rotation="0 0 90"></a-cylinder>
        <a-cylinder radius="0.015" height="0.25" color="#888" position="0.08 0.6 0.3" rotation="0 0 90"></a-cylinder>
        <a-cylinder radius="0.015" height="0.25" color="#888" position="0.08 0.1 0" rotation="0 0 90"></a-cylinder>
        <a-cylinder radius="0.015" height="0.25" color="#888" position="0.08 -0.4 -0.4" rotation="0 0 90"></a-cylinder>
        <a-cylinder radius="0.015" height="0.25" color="#888" position="0.08 -0.4 0.4" rotation="0 0 90"></a-cylinder>
        <!-- Hanging hammer -->
        <a-cylinder radius="0.015" height="0.3" color="#8B6914" position="0.15 0.45 -0.3" rotation="0 0 0"></a-cylinder>
        <a-box width="0.08" height="0.04" depth="0.04" color="#555" position="0.15 0.6 -0.3" metalness="0.9"></a-box>
        <!-- Hanging wrench -->
        <a-box width="0.04" height="0.25" depth="0.015" color="#999" position="0.15 0.45 0.3" metalness="0.8"></a-box>
      </a-entity>

      <!-- Gas cylinders -->
      <a-entity position="4 0 -5">
        <a-cylinder radius="0.14" height="1.3" color="#006600" position="0 0.65 0" metalness="0.7" roughness="0.3"></a-cylinder>
        <a-cylinder radius="0.04" height="0.1" color="#444" position="0 1.35 0" metalness="0.9"></a-cylinder>
        <a-cylinder radius="0.14" height="1.3" color="#000066" position="0.38 0.65 0" metalness="0.7" roughness="0.3"></a-cylinder>
        <a-cylinder radius="0.04" height="0.1" color="#444" position="0.38 1.35 0" metalness="0.9"></a-cylinder>
        <!-- Hose connections -->
        <a-cylinder radius="0.01" height="0.6" color="#333" position="0.19 1.2 0.15" rotation="0 0 30"></a-cylinder>
      </a-entity>

      <!-- Welding helmet on table edge -->
      <a-entity position="0.8 1.05 -1.5">
        <a-sphere radius="0.12" color="#222" metalness="0.8" theta-start="0" theta-length="180"></a-sphere>
        <a-plane width="0.15" height="0.12" color="#1a3a00" position="0 -0.02 0.1" rotation="-15 0 0"
                 material="opacity: 0.7"></a-plane>
      </a-entity>

      <!-- Safety sign on back wall -->
      <a-entity position="-2 2.8 -6.9">
        <a-plane width="0.8" height="0.5" color="#ffcc00"></a-plane>
        <a-text value="WELDING IN\nPROGRESS" position="0 0 0.01" align="center"
                width="0.7" color="#000000" font="kelsonsans"></a-text>
      </a-entity>
    </a-entity>
  `;
}

// ---------------------------------------------------------------------------
// CLINIC FLOOR — full detail
// ---------------------------------------------------------------------------
function buildClinicFloorScene() {
  return `
    <a-entity id="clinic-env">
      <a-entity environment="${envString('clinic')}"></a-entity>

      <!-- Lighting -->
      <a-entity light="type: ambient; color: #e8f0ff; intensity: 0.6"></a-entity>
      <a-entity light="type: directional; color: #ffffff; intensity: 0.9" position="1 5 2"></a-entity>
      <!-- Overhead fluorescents -->
      <a-entity light="type: point; color: #f0f8ff; intensity: 0.8; distance: 8" position="0 3.8 -2"></a-entity>
      <a-entity light="type: point; color: #f0f8ff; intensity: 0.6; distance: 6" position="-3 3.8 -4"></a-entity>
      <a-entity light="type: point; color: #f0f8ff; intensity: 0.6; distance: 6" position="3 3.8 -4"></a-entity>

      <!-- Floor — linoleum tile pattern -->
      <a-plane position="0 0.01 0" rotation="-90 0 0" width="16" height="16"
               color="#c8d8c4" metalness="0.1" roughness="0.6"></a-plane>
      <!-- Tile accent strips -->
      <a-plane position="0 0.015 -2" rotation="-90 0 0" width="16" height="0.03" color="#88aa88"></a-plane>
      <a-plane position="0 0.015 -5" rotation="-90 0 0" width="16" height="0.03" color="#88aa88"></a-plane>

      <!-- Walls -->
      <a-plane position="0 2.5 -8" width="16" height="5" color="#e8ebe8"></a-plane>
      <a-plane position="-8 2.5 0" rotation="0 90 0" width="16" height="5" color="#eaede8"></a-plane>
      <a-plane position="8 2.5 0" rotation="0 -90 0" width="16" height="5" color="#eaede8"></a-plane>

      <!-- Ceiling panels -->
      <a-plane position="0 4 -4" rotation="90 0 0" width="16" height="10" color="#f0f0ee"></a-plane>
      <!-- Fluorescent light fixtures -->
      <a-box position="0 3.95 -2" width="1.2" height="0.04" depth="0.3" color="#ffffff"
             material="emissive: #f8f8ff; emissiveIntensity: 0.5"></a-box>
      <a-box position="-3 3.95 -5" width="1.2" height="0.04" depth="0.3" color="#ffffff"
             material="emissive: #f8f8ff; emissiveIntensity: 0.4"></a-box>
      <a-box position="3 3.95 -5" width="1.2" height="0.04" depth="0.3" color="#ffffff"
             material="emissive: #f8f8ff; emissiveIntensity: 0.4"></a-box>

      <!-- ============================================ -->
      <!-- RECEPTION / CHECK-IN DESK                    -->
      <!-- ============================================ -->
      <a-entity position="0 0 1">
        <!-- Desk body -->
        <a-box width="3" height="1.1" depth="0.7" color="#6a8a9a" position="0 0.55 0"
               metalness="0.1" roughness="0.7"></a-box>
        <!-- Counter top -->
        <a-box width="3.1" height="0.05" depth="0.8" color="#b8c8d0" position="0 1.12 0"
               metalness="0.3" roughness="0.5"></a-box>
        <!-- Sign -->
        <a-text value="CHECK-IN" position="0 1.4 0.01" align="center" width="2"
                color="#2a6a8a" font="kelsonsans"></a-text>
      </a-entity>

      <!-- ============================================ -->
      <!-- VITALS MONITOR (interactive)                 -->
      <!-- ============================================ -->
      <a-entity id="spatial-monitor" class="interactive-target" data-target="monitor"
                position="3.5 0 -3">
        <!-- Rolling cart -->
        <a-box width="0.6" height="0.8" depth="0.5" color="#d0d0d0" position="0 0.4 0"
               metalness="0.4" roughness="0.5"></a-box>
        <!-- Wheels -->
        <a-sphere radius="0.04" color="#333" position="-0.25 0.04 -0.2"></a-sphere>
        <a-sphere radius="0.04" color="#333" position="0.25 0.04 -0.2"></a-sphere>
        <a-sphere radius="0.04" color="#333" position="-0.25 0.04 0.2"></a-sphere>
        <a-sphere radius="0.04" color="#333" position="0.25 0.04 0.2"></a-sphere>
        <!-- Monitor pole -->
        <a-cylinder radius="0.025" height="0.8" color="#aaaaaa" position="0 1.2 0" metalness="0.7"></a-cylinder>
        <!-- Monitor screen -->
        <a-box width="0.55" height="0.4" depth="0.04" color="#1a1a2a" position="0 1.7 0"
               metalness="0.3"></a-box>
        <!-- Screen content — vitals readout -->
        <a-plane width="0.5" height="0.35" color="#0a1a0a" position="0 1.7 0.025"></a-plane>
        <!-- Heart rate line -->
        <a-text value="HR: 72 bpm" position="-0.18 1.8 0.03" width="0.4" color="#00ff44"
                font="kelsonsans"></a-text>
        <a-text value="BP: 120/80" position="-0.18 1.73 0.03" width="0.4" color="#00ccff"></a-text>
        <a-text value="SpO2: 98%" position="-0.18 1.66 0.03" width="0.4" color="#ffcc00"></a-text>
        <!-- Heart rate blip animation -->
        <a-sphere radius="0.008" color="#00ff44" position="0.15 1.8 0.03"
                  animation="property: position; from: 0.05 1.8 0.03; to: 0.22 1.8 0.03; dur: 1200; loop: true; easing: linear"></a-sphere>
        <!-- Label -->
        <a-text value="Check patient vitals" position="0 2.1 0" align="center" width="2"
                color="#ffcc00" visible="false" class="hover-label"></a-text>
      </a-entity>

      <!-- ============================================ -->
      <!-- WAITING AREA WITH PATIENTS (interactive)     -->
      <!-- ============================================ -->
      <a-entity id="spatial-patients" class="interactive-target" data-target="patients"
                position="-3 0 -3">
        <!-- Row of chairs -->
        <a-entity position="-0.7 0 0">
          <a-box width="0.5" height="0.45" depth="0.5" color="#4a7a9a" position="0 0.22 0"></a-box>
          <a-box width="0.5" height="0.5" depth="0.06" color="#4a7a9a" position="0 0.55 -0.22"></a-box>
        </a-entity>
        <a-entity position="0 0 0">
          <a-box width="0.5" height="0.45" depth="0.5" color="#4a7a9a" position="0 0.22 0"></a-box>
          <a-box width="0.5" height="0.5" depth="0.06" color="#4a7a9a" position="0 0.55 -0.22"></a-box>
        </a-entity>
        <a-entity position="0.7 0 0">
          <a-box width="0.5" height="0.45" depth="0.5" color="#4a7a9a" position="0 0.22 0"></a-box>
          <a-box width="0.5" height="0.5" depth="0.06" color="#4a7a9a" position="0 0.55 -0.22"></a-box>
        </a-entity>
        <!-- Seated patient figures (abstract) -->
        <a-entity position="-0.7 0.6 0">
          <a-sphere radius="0.1" color="#e8c8a0" position="0 0.5 0"></a-sphere>
          <a-cylinder radius="0.08" height="0.35" color="#5588aa" position="0 0.25 0"></a-cylinder>
        </a-entity>
        <a-entity position="0.7 0.6 0">
          <a-sphere radius="0.1" color="#d4a878" position="0 0.5 0"></a-sphere>
          <a-cylinder radius="0.08" height="0.35" color="#aa5566" position="0 0.25 0"></a-cylinder>
        </a-entity>
        <!-- Magazine table -->
        <a-cylinder radius="0.3" height="0.5" color="#8B7355" position="0 0.25 0.8"></a-cylinder>
        <a-box width="0.2" height="0.01" depth="0.15" color="#ffffff" position="0.05 0.51 0.8"
               rotation="0 -20 0"></a-box>
        <a-box width="0.2" height="0.01" depth="0.15" color="#eeddcc" position="-0.08 0.52 0.8"
               rotation="0 15 0"></a-box>
        <!-- Label -->
        <a-text value="Greet the patients" position="0 1.5 0" align="center" width="2"
                color="#ffcc00" visible="false" class="hover-label"></a-text>
      </a-entity>

      <!-- ============================================ -->
      <!-- TRAINING ROOM SCHEDULE (interactive)         -->
      <!-- ============================================ -->
      <a-entity id="spatial-schedule" class="interactive-target" data-target="schedule"
                position="1 1.5 -7.9">
        <!-- Whiteboard -->
        <a-box width="1.8" height="1.2" depth="0.05" color="#f8f8f0" position="0 0 0"></a-box>
        <!-- Whiteboard frame -->
        <a-box width="1.85" height="0.04" depth="0.06" color="#888888" position="0 0.6 0" metalness="0.6"></a-box>
        <a-box width="1.85" height="0.04" depth="0.06" color="#888888" position="0 -0.6 0" metalness="0.6"></a-box>
        <a-box width="0.04" height="1.2" depth="0.06" color="#888888" position="-0.92 0 0" metalness="0.6"></a-box>
        <a-box width="0.04" height="1.2" depth="0.06" color="#888888" position="0.92 0 0" metalness="0.6"></a-box>
        <!-- Tray -->
        <a-box width="0.8" height="0.03" depth="0.08" color="#aaaaaa" position="0 -0.65 0.04"
               metalness="0.5"></a-box>
        <!-- Markers in tray -->
        <a-cylinder radius="0.012" height="0.12" color="#cc0000" position="-0.1 -0.59 0.04" rotation="0 0 85"></a-cylinder>
        <a-cylinder radius="0.012" height="0.12" color="#0000cc" position="0 -0.59 0.04" rotation="0 0 85"></a-cylinder>
        <a-cylinder radius="0.012" height="0.12" color="#008800" position="0.1 -0.59 0.04" rotation="0 0 85"></a-cylinder>
        <!-- Schedule text -->
        <a-text value="TRAINING SCHEDULE" position="0 0.4 0.03" align="center"
                width="1.2" color="#2244aa" font="kelsonsans"></a-text>
        <a-text value="Mon: CPR Certification\nTue: EHR Systems\nWed: Phlebotomy Lab\nThu: Patient Communication\nFri: Emergency Protocols"
                position="0 0.05 0.03" align="center" width="1" color="#333333"></a-text>
        <a-text value="Review the schedule" position="0 -0.85 0" align="center" width="2"
                color="#ffcc00" visible="false" class="hover-label"></a-text>
      </a-entity>

      <!-- Exam room door (background detail) -->
      <a-entity position="5.5 0 -7.9">
        <a-box width="0.9" height="2.2" depth="0.08" color="#b8a888" position="0 1.1 0"></a-box>
        <a-sphere radius="0.035" color="#c0a030" position="0.35 1.05 0.05" metalness="0.8"></a-sphere>
        <a-text value="EXAM 1" position="0 1.8 0.05" align="center" width="0.6" color="#555"></a-text>
      </a-entity>
      <a-entity position="7 0 -7.9">
        <a-box width="0.9" height="2.2" depth="0.08" color="#b8a888" position="0 1.1 0"></a-box>
        <a-sphere radius="0.035" color="#c0a030" position="0.35 1.05 0.05" metalness="0.8"></a-sphere>
        <a-text value="EXAM 2" position="0 1.8 0.05" align="center" width="0.6" color="#555"></a-text>
      </a-entity>

      <!-- Hand sanitizer dispenser -->
      <a-entity position="-7.9 1.4 -3">
        <a-box width="0.12" height="0.2" depth="0.1" color="#dddddd" rotation="0 90 0" metalness="0.3"></a-box>
        <a-text value="SANITIZE" position="0.01 -0.18 0" rotation="0 90 0" align="center"
                width="0.4" color="#2a8a4a"></a-text>
      </a-entity>

      <!-- Health poster on wall -->
      <a-entity position="-4 2.2 -7.9">
        <a-plane width="0.7" height="0.9" color="#e8f0e8"></a-plane>
        <a-text value="WASH\nYOUR\nHANDS" position="0 0.1 0.01" align="center"
                width="0.5" color="#228844" font="kelsonsans"></a-text>
      </a-entity>

      <!-- Water cooler -->
      <a-entity position="-6 0 -1">
        <a-cylinder radius="0.18" height="1.1" color="#aaccdd" position="0 0.55 0" metalness="0.3"></a-cylinder>
        <a-cylinder radius="0.2" height="0.25" color="#dddddd" position="0 1.15 0"></a-cylinder>
        <a-cylinder radius="0.15" height="0.4" color="#8888cc" position="0 1.4 0" opacity="0.4"></a-cylinder>
      </a-entity>
    </a-entity>
  `;
}

// ---------------------------------------------------------------------------
// GENERIC — environment-component backdrop with floating choice objects
// ---------------------------------------------------------------------------
function buildGenericScene(env, question) {
  const positions = [
    { x: -2.5, y: 1.2, z: -3.5 },
    { x: 2.5, y: 1.2, z: -3.5 },
    { x: 0, y: 1.2, z: -5 }
  ];

  const colors = ['#ff6644', '#44aaff', '#44dd88'];

  const choiceEntities = question.choices.map((choice, i) => {
    const pos = positions[i];
    const color = colors[i];
    return `
      <a-entity id="spatial-${choice.spatialTarget}" class="interactive-target"
                data-target="${choice.spatialTarget}" position="${pos.x} ${pos.y} ${pos.z}">
        <a-box width="0.9" height="0.9" depth="0.9" color="${color}" opacity="0.85"
               metalness="0.3" roughness="0.6"
               animation="property: rotation; to: 0 360 0; dur: 10000; loop: true; easing: linear"
               animation__hover="property: position; to: ${pos.x} 1.4 ${pos.z}; startEvents: mouseenter; dur: 300; easing: easeOutQuad"
               animation__unhover="property: position; to: ${pos.x} 1.2 ${pos.z}; startEvents: mouseleave; dur: 300; easing: easeOutQuad"></a-box>
        <a-text value="${choice.label}" position="0 0.75 0" align="center" width="2.2"
                color="#ffffff"></a-text>
        <a-text value="Select" position="0 -0.75 0" align="center" width="1.5"
                color="#ffcc00" visible="false" class="hover-label"></a-text>
      </a-entity>
    `;
  }).join('');

  return `
    <a-entity id="${question.environment}-env">
      <a-entity environment="${envString(env)}"></a-entity>
      <a-entity light="type: ambient; color: #ffffff; intensity: 0.5"></a-entity>
      <a-entity light="type: directional; color: #ffffff; intensity: 0.7" position="2 5 2"></a-entity>
      ${choiceEntities}
    </a-entity>
  `;
}

function buildVignetteScene(question) {
  switch (question.environment) {
    case 'welding':   return buildWeldingBayScene();
    case 'clinic':    return buildClinicFloorScene();
    case 'cnc':       return buildCNCShopScene();
    case 'server':    return buildServerRoomScene();
    case 'warehouse': return buildWarehouseScene();
    case 'outdoor':   return buildOutdoorSiteScene();
    default:          return buildGenericScene(question.environment, question);
  }
}

export { buildVignetteScene, ENV_PRESETS };
