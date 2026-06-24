/**
 * Professional vignette builders — Design Studio, Community Center,
 * Biotech Lab, and Startup Office.  Each returns a template-literal
 * string of A-Frame entities ready to inject into the scene.
 */

const ENV_PRESETS = {
  studio:    { preset: 'japan',    skyType: 'gradient', skyColor: '#f5f0e8', horizonColor: '#e8ddc8', lighting: 'none', fog: 0.9 },
  community: { preset: 'forest',   skyType: 'gradient', skyColor: '#87CEEB', horizonColor: '#b8d8b8', lighting: 'none', fog: 0.8 },
  lab:       { preset: 'default',  skyType: 'gradient', skyColor: '#e8f0ff', horizonColor: '#d0e0f8', lighting: 'none', fog: 0.85 },
  startup:   { preset: 'japan',    skyType: 'gradient', skyColor: '#fafafa', horizonColor: '#e8e0d0', lighting: 'none', fog: 0.9 }
};

function envString(env) {
  const c = ENV_PRESETS[env];
  return Object.entries(c).map(([k, v]) => `${k}: ${v}`).join('; ');
}

// ---------------------------------------------------------------------------
// 1. DESIGN STUDIO — bright, airy creative space
// ---------------------------------------------------------------------------
export function buildDesignStudioScene() {
  return `
    <a-entity id="studio-env">
      <a-entity environment="${envString('studio')}"></a-entity>

      <!-- Lighting rig -->
      <a-entity light="type: ambient; color: #fff8ee; intensity: 0.55"></a-entity>
      <a-entity light="type: directional; color: #ffffff; intensity: 0.8" position="2 6 2"></a-entity>
      <a-entity light="type: spot; color: #ffe8cc; intensity: 1.2; angle: 50; penumbra: 0.5"
                position="-2 5 -2" rotation="-80 0 0"></a-entity>
      <a-entity light="type: point; color: #ffeedd; intensity: 0.5; distance: 5"
                position="0 2.5 -3"></a-entity>
      <a-entity light="type: point; color: #ddeeff; intensity: 0.4; distance: 4"
                position="3 2 -5"></a-entity>

      <!-- Polished concrete floor -->
      <a-plane position="0 0.01 0" rotation="-90 0 0" width="14" height="14"
               color="#d8d0c8" metalness="0.15" roughness="0.5"></a-plane>

      <!-- Walls — white/cream -->
      <a-plane position="0 3.5 -7" width="14" height="7" color="#f0ece4"
               metalness="0.05" roughness="0.9"></a-plane>
      <a-plane position="-7 3.5 0" rotation="0 90 0" width="14" height="7" color="#eee8e0"
               metalness="0.05" roughness="0.9"></a-plane>
      <a-plane position="7 3.5 0" rotation="0 -90 0" width="14" height="7" color="#eee8e0"
               metalness="0.05" roughness="0.9"></a-plane>

      <!-- Ceiling -->
      <a-plane position="0 4.5 -3" rotation="90 0 0" width="14" height="10" color="#f8f6f0"></a-plane>
      <!-- Track lighting fixtures -->
      <a-box position="-2 4.45 -2" width="1.5" height="0.03" depth="0.08" color="#333333" metalness="0.8"></a-box>
      <a-cylinder radius="0.04" height="0.15" color="#333" position="-2.4 4.35 -2" metalness="0.7"></a-cylinder>
      <a-cylinder radius="0.04" height="0.15" color="#333" position="-1.6 4.35 -2" metalness="0.7"></a-cylinder>
      <a-box position="2 4.45 -4" width="1.5" height="0.03" depth="0.08" color="#333333" metalness="0.8"></a-box>
      <a-cylinder radius="0.04" height="0.15" color="#333" position="1.6 4.35 -4" metalness="0.7"></a-cylinder>
      <a-cylinder radius="0.04" height="0.15" color="#333" position="2.4 4.35 -4" metalness="0.7"></a-cylinder>

      <!-- Large windows (back wall, left half) -->
      <a-plane position="-3 2.8 -6.95" width="3.5" height="3" color="#c8dde8" opacity="0.3"></a-plane>
      <a-box position="-3 2.8 -6.94" width="0.04" height="3" depth="0.02" color="#666"></a-box>
      <a-box position="-4.75 2.8 -6.94" width="0.04" height="3" depth="0.02" color="#666"></a-box>
      <a-box position="-1.25 2.8 -6.94" width="0.04" height="3" depth="0.02" color="#666"></a-box>
      <a-box position="-3 4.3 -6.94" width="3.5" height="0.04" depth="0.02" color="#666"></a-box>
      <a-box position="-3 1.3 -6.94" width="3.5" height="0.04" depth="0.02" color="#666"></a-box>

      <!-- ============================================ -->
      <!-- DRAWING TABLET (interactive)                 -->
      <!-- ============================================ -->
      <a-entity id="spatial-tablet" class="interactive-target" data-target="tablet"
                position="-2.5 0 -2.5">
        <!-- Sleek desk -->
        <a-box width="1.6" height="0.05" depth="0.8" color="#f0ece4" position="0 0.78 0"
               metalness="0.2" roughness="0.5"></a-box>
        <!-- Desk legs (hairpin style) -->
        <a-cylinder radius="0.015" height="0.78" color="#222222" position="-0.7 0.39 -0.3"></a-cylinder>
        <a-cylinder radius="0.015" height="0.78" color="#222222" position="0.7 0.39 -0.3"></a-cylinder>
        <a-cylinder radius="0.015" height="0.78" color="#222222" position="-0.7 0.39 0.3"></a-cylinder>
        <a-cylinder radius="0.015" height="0.78" color="#222222" position="0.7 0.39 0.3"></a-cylinder>
        <!-- Drawing tablet -->
        <a-box width="0.5" height="0.02" depth="0.35" color="#2a2a2a" position="-0.1 0.82 0"
               metalness="0.6" roughness="0.3"></a-box>
        <!-- Tablet screen glow -->
        <a-plane width="0.44" height="0.29" color="#1a1a2a" position="-0.1 0.835 0"
                 rotation="-90 0 0"></a-plane>
        <!-- Sketch on screen -->
        <a-plane width="0.38" height="0.24" color="#222233" position="-0.1 0.836 0"
                 rotation="-90 0 0"></a-plane>
        <a-text value="SKETCH v3.2" position="-0.25 0.837 -0.1" rotation="-90 0 0"
                width="0.3" color="#66aaff"></a-text>
        <!-- Stylus pen -->
        <a-cylinder radius="0.006" height="0.16" color="#555555" position="0.25 0.84 0.05"
                    rotation="5 -20 75" metalness="0.5"></a-cylinder>
        <!-- Desk lamp -->
        <a-entity position="0.55 0.82 -0.2">
          <a-cylinder radius="0.05" height="0.02" color="#222" position="0 0 0"></a-cylinder>
          <a-cylinder radius="0.01" height="0.45" color="#222" position="0 0.23 0" rotation="0 0 -8"></a-cylinder>
          <a-cone radius-bottom="0.08" radius-top="0.03" height="0.1" color="#ffcc44"
                  position="-0.03 0.48 0" rotation="0 0 15"
                  material="emissive: #ffaa22; emissiveIntensity: 0.4"></a-cone>
        </a-entity>
        <!-- Coffee mug -->
        <a-cylinder radius="0.035" height="0.09" color="#cc4444" position="0.5 0.85 0.15"></a-cylinder>
        <a-torus radius="0.03" radius-tubular="0.006" color="#cc4444" position="0.54 0.86 0.15"
                rotation="0 0 90"></a-torus>
        <a-text value="Start sketching on the tablet" position="0 1.35 0" align="center" width="2"
                color="#ffcc00" visible="false" class="hover-label"></a-text>
      </a-entity>

      <!-- ============================================ -->
      <!-- 3D PRINTER (interactive)                     -->
      <!-- ============================================ -->
      <a-entity id="spatial-printer" class="interactive-target" data-target="printer"
                position="2.5 0 -2">
        <!-- Printer frame -->
        <a-box width="0.6" height="0.7" depth="0.6" color="#e8e0d8" position="0 0.85 0"
               metalness="0.2" roughness="0.6"></a-box>
        <!-- Printer stand/table -->
        <a-box width="0.8" height="0.04" depth="0.7" color="#c8bfb0" position="0 0.48 0"></a-box>
        <a-cylinder radius="0.025" height="0.48" color="#888" position="-0.35 0.24 -0.3"></a-cylinder>
        <a-cylinder radius="0.025" height="0.48" color="#888" position="0.35 0.24 -0.3"></a-cylinder>
        <a-cylinder radius="0.025" height="0.48" color="#888" position="-0.35 0.24 0.3"></a-cylinder>
        <a-cylinder radius="0.025" height="0.48" color="#888" position="0.35 0.24 0.3"></a-cylinder>
        <!-- Glass walls (transparent) -->
        <a-plane width="0.56" height="0.55" color="#aaccdd" opacity="0.15" position="0 0.88 0.29"></a-plane>
        <a-plane width="0.56" height="0.55" color="#aaccdd" opacity="0.15" position="0.29 0.88 0"
                 rotation="0 90 0"></a-plane>
        <!-- Print bed -->
        <a-box width="0.4" height="0.02" depth="0.4" color="#444444" position="0 0.56 0"
               metalness="0.8"></a-box>
        <!-- Half-printed object (abstract vase shape) -->
        <a-cylinder radius="0.06" height="0.12" color="#44bbdd" position="0 0.64 0"
                    metalness="0.1" roughness="0.8"></a-cylinder>
        <a-cylinder radius="0.07" height="0.04" color="#44bbdd" position="0 0.72 0"
                    metalness="0.1"></a-cylinder>
        <!-- Nozzle assembly -->
        <a-box width="0.08" height="0.04" depth="0.08" color="#333" position="0.05 0.76 0.05"
               metalness="0.7"></a-box>
        <!-- Print head glow -->
        <a-sphere radius="0.008" color="#ff4400" position="0.05 0.74 0.05"
                  material="emissive: #ff2200; emissiveIntensity: 1.2"
                  animation="property: material.emissiveIntensity; from: 0.6; to: 1.8; dur: 400; dir: alternate; loop: true"></a-sphere>
        <!-- Filament spool on side -->
        <a-torus radius="0.06" radius-tubular="0.025" color="#44bbdd" position="0.4 1.0 0"
                rotation="0 0 90"></a-torus>
        <a-text value="Check the 3D printer output" position="0 1.55 0" align="center" width="2"
                color="#ffcc00" visible="false" class="hover-label"></a-text>
      </a-entity>

      <!-- ============================================ -->
      <!-- CLIENT MEETING AREA (interactive)            -->
      <!-- ============================================ -->
      <a-entity id="spatial-client" class="interactive-target" data-target="client"
                position="0 0 -5.5">
        <!-- Presentation screen -->
        <a-box width="2" height="1.2" depth="0.04" color="#1a1a1a" position="0 1.8 -0.5"
               metalness="0.5"></a-box>
        <a-plane width="1.85" height="1.05" color="#222244" position="0 1.8 -0.475"></a-plane>
        <!-- Slide content -->
        <a-text value="CONCEPT A — Urban Flow" position="0 2.15 -0.47" align="center"
                width="1.2" color="#ffffff" font="kelsonsans"></a-text>
        <a-box width="0.5" height="0.35" depth="0.01" color="#5588aa" position="-0.4 1.65 -0.47"></a-box>
        <a-box width="0.5" height="0.35" depth="0.01" color="#88aa55" position="0.4 1.65 -0.47"></a-box>
        <!-- Screen stand -->
        <a-cylinder radius="0.03" height="0.4" color="#444" position="0 1.15 -0.5" metalness="0.7"></a-cylinder>
        <a-box width="0.4" height="0.02" depth="0.25" color="#444" position="0 0.95 -0.5" metalness="0.6"></a-box>
        <!-- Meeting table -->
        <a-box width="2" height="0.04" depth="0.8" color="#8B6914" position="0 0.74 0"
               metalness="0.15" roughness="0.7"></a-box>
        <a-cylinder radius="0.03" height="0.74" color="#6a5010" position="-0.9 0.37 -0.3"></a-cylinder>
        <a-cylinder radius="0.03" height="0.74" color="#6a5010" position="0.9 0.37 -0.3"></a-cylinder>
        <a-cylinder radius="0.03" height="0.74" color="#6a5010" position="-0.9 0.37 0.3"></a-cylinder>
        <a-cylinder radius="0.03" height="0.74" color="#6a5010" position="0.9 0.37 0.3"></a-cylinder>
        <!-- Client chairs -->
        <a-entity position="-0.6 0 0.6">
          <a-box width="0.45" height="0.42" depth="0.45" color="#886644" position="0 0.21 0"></a-box>
          <a-box width="0.45" height="0.4" depth="0.05" color="#886644" position="0 0.5 -0.2"></a-box>
        </a-entity>
        <a-entity position="0.6 0 0.6">
          <a-box width="0.45" height="0.42" depth="0.45" color="#886644" position="0 0.21 0"></a-box>
          <a-box width="0.45" height="0.4" depth="0.05" color="#886644" position="0 0.5 -0.2"></a-box>
        </a-entity>
        <!-- Client figure (abstract) -->
        <a-entity position="0.6 0.55 0.6">
          <a-sphere radius="0.1" color="#e0c090" position="0 0.5 0"></a-sphere>
          <a-cylinder radius="0.08" height="0.35" color="#336688" position="0 0.25 0"></a-cylinder>
        </a-entity>
        <!-- Mood board on wall behind -->
        <a-box width="1.4" height="1" depth="0.03" color="#c8b898" position="1.8 1.8 -0.5"></a-box>
        <a-plane width="0.25" height="0.2" color="#ff6644" position="1.5 2.0 -0.47"></a-plane>
        <a-plane width="0.25" height="0.2" color="#44aaff" position="1.8 2.0 -0.47"></a-plane>
        <a-plane width="0.25" height="0.2" color="#ffcc22" position="2.1 2.0 -0.47"></a-plane>
        <a-plane width="0.25" height="0.15" color="#88cc66" position="1.5 1.7 -0.47"></a-plane>
        <a-plane width="0.55" height="0.15" color="#eeddcc" position="1.95 1.7 -0.47"></a-plane>
        <!-- Notebook + pen on table -->
        <a-box width="0.18" height="0.015" depth="0.24" color="#f5f0e0" position="-0.3 0.77 0.1"></a-box>
        <a-cylinder radius="0.005" height="0.14" color="#222" position="-0.15 0.78 0.1"
                    rotation="0 -30 85"></a-cylinder>
        <a-text value="Present concepts to the client" position="0 2.7 0" align="center" width="2.2"
                color="#ffcc00" visible="false" class="hover-label"></a-text>
      </a-entity>

      <!-- ============================================ -->
      <!-- ENVIRONMENTAL DETAIL                         -->
      <!-- ============================================ -->

      <!-- Inspiration wall (left wall) — pinned sketches & swatches -->
      <a-entity position="-6.9 2 -3">
        <!-- Cork board backing -->
        <a-box width="0.06" height="1.8" depth="2.5" color="#b89868" metalness="0.05" roughness="0.95"></a-box>
        <!-- Pinned sketches -->
        <a-plane width="0.35" height="0.25" color="#f8f4ec" position="0.04 0.5 -0.8" rotation="0 90 0"></a-plane>
        <a-plane width="0.3" height="0.4" color="#f0ece0" position="0.04 0.3 -0.2" rotation="0 90 2"></a-plane>
        <a-plane width="0.2" height="0.15" color="#e8e0d0" position="0.04 -0.2 -0.5" rotation="0 90 -3"></a-plane>
        <!-- Color swatches -->
        <a-plane width="0.06" height="0.06" color="#ff4444" position="0.04 -0.4 0.4" rotation="0 90 0"></a-plane>
        <a-plane width="0.06" height="0.06" color="#44aa88" position="0.04 -0.4 0.5" rotation="0 90 0"></a-plane>
        <a-plane width="0.06" height="0.06" color="#4466cc" position="0.04 -0.4 0.6" rotation="0 90 0"></a-plane>
        <a-plane width="0.06" height="0.06" color="#ffaa22" position="0.04 -0.4 0.7" rotation="0 90 0"></a-plane>
        <!-- Photo references -->
        <a-plane width="0.25" height="0.18" color="#c8b898" position="0.04 0.1 0.6" rotation="0 90 -5"></a-plane>
        <!-- Push pins -->
        <a-sphere radius="0.012" color="#cc2222" position="0.06 0.65 -0.8"></a-sphere>
        <a-sphere radius="0.012" color="#2222cc" position="0.06 0.5 -0.2"></a-sphere>
        <a-sphere radius="0.012" color="#22cc22" position="0.06 0.22 0.6"></a-sphere>
      </a-entity>

      <!-- Bookshelf with design books (right wall) -->
      <a-entity position="6.85 0 -4">
        <!-- Shelf frame -->
        <a-box width="0.35" height="2" depth="1.2" color="#8B6914" position="0 1 0"
               metalness="0.1" roughness="0.8"></a-box>
        <!-- Shelves -->
        <a-box width="0.34" height="0.02" depth="1.18" color="#7a5a10" position="0 0.6 0"></a-box>
        <a-box width="0.34" height="0.02" depth="1.18" color="#7a5a10" position="0 1.2 0"></a-box>
        <a-box width="0.34" height="0.02" depth="1.18" color="#7a5a10" position="0 1.8 0"></a-box>
        <!-- Books (varied colors) -->
        <a-box width="0.18" height="0.26" depth="0.04" color="#cc3333" position="-0.05 0.74 -0.4" rotation="0 5 0"></a-box>
        <a-box width="0.18" height="0.24" depth="0.04" color="#3366cc" position="-0.05 0.73 -0.34" rotation="0 0 0"></a-box>
        <a-box width="0.18" height="0.28" depth="0.05" color="#228844" position="-0.05 0.75 -0.27" rotation="0 -3 0"></a-box>
        <a-box width="0.18" height="0.22" depth="0.04" color="#ffaa00" position="-0.05 0.72 -0.2" rotation="0 2 0"></a-box>
        <a-box width="0.18" height="0.25" depth="0.04" color="#884488" position="-0.05 0.73 0.2" rotation="0 0 0"></a-box>
        <a-box width="0.18" height="0.27" depth="0.05" color="#444444" position="-0.05 0.74 0.28" rotation="0 -2 0"></a-box>
        <!-- Upper shelf books -->
        <a-box width="0.18" height="0.24" depth="0.04" color="#dd6622" position="-0.05 1.33 -0.3" rotation="0 0 0"></a-box>
        <a-box width="0.18" height="0.26" depth="0.04" color="#2288aa" position="-0.05 1.34 -0.24" rotation="0 4 0"></a-box>
        <a-box width="0.18" height="0.22" depth="0.04" color="#aa2255" position="-0.05 1.32 0.1" rotation="0 0 -12"></a-box>
      </a-entity>

      <!-- Potted plant -->
      <a-entity position="-5.5 0 -1">
        <a-cylinder radius="0.15" height="0.35" color="#8a6a4a" position="0 0.175 0"></a-cylinder>
        <a-sphere radius="0.25" color="#338833" position="0 0.55 0"></a-sphere>
        <a-sphere radius="0.18" color="#44aa44" position="0.1 0.7 0.05"></a-sphere>
        <a-sphere radius="0.15" color="#339933" position="-0.08 0.75 -0.05"></a-sphere>
      </a-entity>

      <!-- Rug under meeting area -->
      <a-plane position="0 0.02 -5" rotation="-90 0 0" width="3.5" height="2.5"
               color="#8a6a5a" metalness="0" roughness="1"></a-plane>

      <!-- Wall clock -->
      <a-entity position="4 3.2 -6.95">
        <a-circle radius="0.2" color="#f0ece4"></a-circle>
        <a-ring radius-inner="0.19" radius-outer="0.21" color="#333" position="0 0 0.01"></a-ring>
        <!-- Clock hands -->
        <a-box width="0.008" height="0.12" depth="0.005" color="#222" position="0 0.05 0.01"></a-box>
        <a-box width="0.006" height="0.15" depth="0.005" color="#222" position="0.04 0 0.01" rotation="0 0 -60"></a-box>
      </a-entity>
    </a-entity>
  `;
}

// ---------------------------------------------------------------------------
// 2. COMMUNITY CENTER — warm after-school space
// ---------------------------------------------------------------------------
export function buildCommunityCenterScene() {
  return `
    <a-entity id="community-env">
      <a-entity environment="${envString('community')}"></a-entity>

      <!-- Lighting — warm and inviting -->
      <a-entity light="type: ambient; color: #fff0dd; intensity: 0.5"></a-entity>
      <a-entity light="type: directional; color: #ffffff; intensity: 0.6" position="1 5 2"></a-entity>
      <a-entity light="type: point; color: #ffeecc; intensity: 0.7; distance: 8" position="0 3.5 -3"></a-entity>
      <a-entity light="type: point; color: #ffeedd; intensity: 0.5; distance: 6" position="-3 3 -5"></a-entity>
      <a-entity light="type: point; color: #ffeedd; intensity: 0.5; distance: 6" position="3 3 -1"></a-entity>

      <!-- Hardwood floor -->
      <a-plane position="0 0.01 0" rotation="-90 0 0" width="14" height="14"
               color="#b08850" metalness="0.1" roughness="0.7"></a-plane>

      <!-- Walls — warm cream/yellow -->
      <a-plane position="0 3.5 -7" width="14" height="7" color="#f5e8c8"
               metalness="0.02" roughness="0.95"></a-plane>
      <a-plane position="-7 3.5 0" rotation="0 90 0" width="14" height="7" color="#f0e4c0"
               metalness="0.02" roughness="0.95"></a-plane>
      <a-plane position="7 3.5 0" rotation="0 -90 0" width="14" height="7" color="#f0e4c0"
               metalness="0.02" roughness="0.95"></a-plane>

      <!-- Ceiling -->
      <a-plane position="0 4 -3" rotation="90 0 0" width="14" height="10" color="#f5f0e8"></a-plane>
      <!-- Ceiling lights — round pendant style -->
      <a-entity position="0 3.95 -3">
        <a-cylinder radius="0.15" height="0.06" color="#ffeecc" position="0 0 0"
                    material="emissive: #ffeebb; emissiveIntensity: 0.5"></a-cylinder>
        <a-cylinder radius="0.005" height="0.3" color="#888" position="0 0.18 0"></a-cylinder>
      </a-entity>
      <a-entity position="-3 3.95 -5">
        <a-cylinder radius="0.15" height="0.06" color="#ffeecc"
                    material="emissive: #ffeebb; emissiveIntensity: 0.4"></a-cylinder>
        <a-cylinder radius="0.005" height="0.3" color="#888" position="0 0.18 0"></a-cylinder>
      </a-entity>

      <!-- ============================================ -->
      <!-- TUTORING TABLE (interactive)                 -->
      <!-- ============================================ -->
      <a-entity id="spatial-tutoring-table" class="interactive-target" data-target="tutoring-table"
                position="-2.5 0 -2.5">
        <!-- Round table -->
        <a-cylinder radius="0.8" height="0.04" color="#c89050" position="0 0.6 0"
                    metalness="0.1" roughness="0.7"></a-cylinder>
        <a-cylinder radius="0.06" height="0.6" color="#8a6a3a" position="0 0.3 0"></a-cylinder>
        <a-cylinder radius="0.35" height="0.03" color="#8a6a3a" position="0 0.02 0"></a-cylinder>
        <!-- Chairs around the table -->
        <a-entity position="-0.7 0 0.3">
          <a-box width="0.35" height="0.38" depth="0.35" color="#cc6633" position="0 0.19 0"></a-box>
          <a-box width="0.35" height="0.35" depth="0.04" color="#cc6633" position="0 0.45 -0.16"></a-box>
        </a-entity>
        <a-entity position="0.7 0 0.3">
          <a-box width="0.35" height="0.38" depth="0.35" color="#cc6633" position="0 0.19 0"></a-box>
          <a-box width="0.35" height="0.35" depth="0.04" color="#cc6633" position="0 0.45 -0.16"></a-box>
        </a-entity>
        <a-entity position="0 0 -0.8">
          <a-box width="0.35" height="0.38" depth="0.35" color="#cc6633" position="0 0.19 0"></a-box>
          <a-box width="0.35" height="0.35" depth="0.04" color="#cc6633" position="0 0.45 0.16"></a-box>
        </a-entity>
        <!-- Kid figures (abstract, seated) -->
        <a-entity position="-0.7 0.5 0.3">
          <a-sphere radius="0.08" color="#e0c098" position="0 0.38 0"></a-sphere>
          <a-cylinder radius="0.06" height="0.28" color="#4488cc" position="0 0.18 0"></a-cylinder>
        </a-entity>
        <a-entity position="0.7 0.5 0.3">
          <a-sphere radius="0.08" color="#c8a070" position="0 0.38 0"></a-sphere>
          <a-cylinder radius="0.06" height="0.28" color="#cc4466" position="0 0.18 0"></a-cylinder>
        </a-entity>
        <!-- Books on table -->
        <a-box width="0.2" height="0.03" depth="0.15" color="#4466aa" position="-0.2 0.64 -0.1"
               rotation="0 10 0"></a-box>
        <a-box width="0.18" height="0.03" depth="0.14" color="#cc5533" position="0.2 0.64 0.15"
               rotation="0 -15 0"></a-box>
        <a-box width="0.2" height="0.02" depth="0.15" color="#44aa66" position="0 0.65 -0.2"
               rotation="0 5 0"></a-box>
        <!-- Pencils scattered -->
        <a-cylinder radius="0.005" height="0.12" color="#ffcc00" position="0.15 0.64 -0.05"
                    rotation="0 40 85"></a-cylinder>
        <a-cylinder radius="0.005" height="0.12" color="#ff6644" position="-0.1 0.64 0.2"
                    rotation="0 -20 85"></a-cylinder>
        <a-text value="Sit with the kids and tutor" position="0 1.5 0" align="center" width="2.2"
                color="#ffcc00" visible="false" class="hover-label"></a-text>
      </a-entity>

      <!-- ============================================ -->
      <!-- MURAL WALL (interactive)                     -->
      <!-- ============================================ -->
      <a-entity id="spatial-mural" class="interactive-target" data-target="mural"
                position="0 0 -6.85">
        <!-- Half-painted mural — colorful shapes on wall -->
        <!-- Painted section (left half complete) -->
        <a-plane width="3" height="2.5" color="#f5e8c8" position="0 2 0"></a-plane>
        <a-circle radius="0.4" color="#ff6644" position="-0.8 2.3 0.01"></a-circle>
        <a-circle radius="0.25" color="#ffaa22" position="-0.3 1.6 0.01"></a-circle>
        <a-plane width="0.5" height="0.8" color="#4488cc" position="-1.0 1.5 0.01"
                 rotation="0 0 15"></a-plane>
        <a-plane width="0.6" height="0.3" color="#aa44cc" position="0.5 1.3 0.01"
                 rotation="0 0 -8"></a-plane>
        <!-- Unpainted guideline sketch (right half) -->
        <a-circle radius="0.35" color="#e8dcc0" position="1.0 2.2 0.01"
                  material="wireframe: true; color: #999"></a-circle>
        <a-box width="0.4" height="0.5" depth="0.001" color="#e8dcc0" position="0.9 1.4 0.01"
               material="wireframe: true; color: #999"></a-box>
        <!-- Paint cans on drop cloth -->
        <a-plane position="0 0.02 0.8" rotation="-90 0 0" width="2" height="1.5" color="#d8d0c0"></a-plane>
        <a-cylinder radius="0.08" height="0.14" color="#ff4444" position="-0.4 0.08 0.6" metalness="0.5"></a-cylinder>
        <a-cylinder radius="0.08" height="0.14" color="#4488ff" position="-0.15 0.08 0.7" metalness="0.5"></a-cylinder>
        <a-cylinder radius="0.08" height="0.14" color="#ffcc00" position="0.1 0.08 0.55" metalness="0.5"></a-cylinder>
        <a-cylinder radius="0.08" height="0.14" color="#44cc88" position="0.35 0.08 0.65" metalness="0.5"></a-cylinder>
        <!-- Paint brushes -->
        <a-cylinder radius="0.008" height="0.25" color="#8B6914" position="0.5 0.06 0.6"
                    rotation="80 0 15"></a-cylinder>
        <a-cylinder radius="0.008" height="0.25" color="#8B6914" position="0.55 0.06 0.5"
                    rotation="85 20 0"></a-cylinder>
        <!-- Step ladder -->
        <a-entity position="0.8 0 0.5">
          <a-box width="0.04" height="1.2" depth="0.04" color="#aa8833" position="-0.2 0.6 0" rotation="0 0 -5"></a-box>
          <a-box width="0.04" height="1.2" depth="0.04" color="#aa8833" position="0.2 0.6 0" rotation="0 0 5"></a-box>
          <a-box width="0.36" height="0.03" depth="0.12" color="#aa8833" position="0 0.4 0"></a-box>
          <a-box width="0.32" height="0.03" depth="0.12" color="#aa8833" position="0 0.7 0"></a-box>
        </a-entity>
        <a-text value="Finish painting the mural" position="0 3.5 0" align="center" width="2.2"
                color="#ffcc00" visible="false" class="hover-label"></a-text>
      </a-entity>

      <!-- ============================================ -->
      <!-- BUDGET DESK (interactive)                    -->
      <!-- ============================================ -->
      <a-entity id="spatial-budget-desk" class="interactive-target" data-target="budget-desk"
                position="3.5 0 -4.5">
        <!-- Office desk -->
        <a-box width="1.4" height="0.04" depth="0.7" color="#8a7050" position="0 0.74 0"
               metalness="0.15" roughness="0.7"></a-box>
        <a-box width="0.06" height="0.74" depth="0.06" color="#7a6040" position="-0.65 0.37 -0.3"></a-box>
        <a-box width="0.06" height="0.74" depth="0.06" color="#7a6040" position="0.65 0.37 -0.3"></a-box>
        <a-box width="0.06" height="0.74" depth="0.06" color="#7a6040" position="-0.65 0.37 0.3"></a-box>
        <a-box width="0.06" height="0.74" depth="0.06" color="#7a6040" position="0.65 0.37 0.3"></a-box>
        <!-- Drawer unit -->
        <a-box width="0.35" height="0.45" depth="0.5" color="#7a6040" position="0.45 0.5 0"></a-box>
        <a-box width="0.28" height="0.01" depth="0.005" color="#bba870" position="0.45 0.6 0.26"></a-box>
        <a-box width="0.28" height="0.01" depth="0.005" color="#bba870" position="0.45 0.42 0.26"></a-box>
        <!-- Spreadsheet papers -->
        <a-box width="0.3" height="0.005" depth="0.4" color="#f5f0e0" position="-0.2 0.77 -0.05"></a-box>
        <a-text value="FY2026 PROGRAM BUDGET" position="-0.2 0.775 -0.15" rotation="-90 0 0"
                width="0.3" color="#333" font="kelsonsans"></a-text>
        <!-- Grid lines on spreadsheet -->
        <a-box width="0.25" height="0.001" depth="0.001" color="#888" position="-0.2 0.776 0.0"></a-box>
        <a-box width="0.25" height="0.001" depth="0.001" color="#888" position="-0.2 0.776 0.05"></a-box>
        <!-- Calculator -->
        <a-box width="0.08" height="0.01" depth="0.12" color="#222222" position="0.15 0.76 0.1"
               metalness="0.4"></a-box>
        <a-plane width="0.06" height="0.03" color="#88aa88" position="0.15 0.77 0.07"
                 rotation="-90 0 0"></a-plane>
        <!-- Pen holder -->
        <a-cylinder radius="0.03" height="0.08" color="#444488" position="0.35 0.8 -0.2"></a-cylinder>
        <a-cylinder radius="0.005" height="0.1" color="#222" position="0.35 0.86 -0.2"></a-cylinder>
        <a-cylinder radius="0.005" height="0.1" color="#cc2222" position="0.36 0.86 -0.19"
                    rotation="0 0 5"></a-cylinder>
        <!-- Office chair -->
        <a-entity position="0 0 0.7">
          <a-box width="0.45" height="0.06" depth="0.45" color="#333366" position="0 0.42 0"></a-box>
          <a-box width="0.45" height="0.4" depth="0.05" color="#333366" position="0 0.65 -0.2"></a-box>
          <a-cylinder radius="0.03" height="0.38" color="#555" position="0 0.2 0" metalness="0.6"></a-cylinder>
          <a-cylinder radius="0.2" height="0.02" color="#555" position="0 0.02 0" metalness="0.6"></a-cylinder>
        </a-entity>
        <a-text value="Balance the program budget" position="0 1.4 0" align="center" width="2.2"
                color="#ffcc00" visible="false" class="hover-label"></a-text>
      </a-entity>

      <!-- ============================================ -->
      <!-- ENVIRONMENTAL DETAIL                         -->
      <!-- ============================================ -->

      <!-- Bulletin board on right wall -->
      <a-entity position="6.9 1.8 -3" rotation="0 -90 0">
        <a-box width="1.4" height="1" depth="0.04" color="#b89060"></a-box>
        <!-- Flyers -->
        <a-plane width="0.25" height="0.3" color="#ffcccc" position="-0.4 0.2 0.03" rotation="0 0 3"></a-plane>
        <a-plane width="0.2" height="0.25" color="#ccddff" position="0 0.25 0.03" rotation="0 0 -2"></a-plane>
        <a-plane width="0.3" height="0.2" color="#ffffcc" position="0.4 0.1 0.03" rotation="0 0 5"></a-plane>
        <a-plane width="0.22" height="0.28" color="#ccffcc" position="-0.2 -0.2 0.03" rotation="0 0 -4"></a-plane>
        <a-text value="SIGN UP\nFOR SOCCER!" position="0 -0.15 0.04" align="center"
                width="0.5" color="#2244aa"></a-text>
        <!-- Push pins -->
        <a-sphere radius="0.012" color="#ff2222" position="-0.4 0.35 0.04"></a-sphere>
        <a-sphere radius="0.012" color="#22cc22" position="0 0.38 0.04"></a-sphere>
        <a-sphere radius="0.012" color="#ffcc00" position="0.4 0.22 0.04"></a-sphere>
      </a-entity>

      <!-- Basketball in corner -->
      <a-sphere radius="0.12" color="#dd8833" position="5.5 0.12 -6"
                metalness="0.05" roughness="0.8"></a-sphere>
      <a-ring radius-inner="0.115" radius-outer="0.12" color="#333"
              position="5.5 0.12 -5.88" rotation="0 0 0"></a-ring>

      <!-- Water fountain on left wall -->
      <a-entity position="-6.9 1 -5" rotation="0 90 0">
        <a-box width="0.4" height="0.5" depth="0.25" color="#cccccc" metalness="0.5" roughness="0.4"></a-box>
        <a-box width="0.3" height="0.06" depth="0.2" color="#dddddd" position="0 0.15 0"
               metalness="0.6"></a-box>
      </a-entity>

      <!-- Cubbies with backpacks (back wall, right side) -->
      <a-entity position="5 0 -6.85">
        <!-- Cubby unit -->
        <a-box width="1.2" height="1.5" depth="0.4" color="#c89850" position="0 0.75 0"
               metalness="0.05" roughness="0.9"></a-box>
        <!-- Dividers -->
        <a-box width="0.02" height="1.4" depth="0.38" color="#b08840" position="-0.3 0.75 0"></a-box>
        <a-box width="0.02" height="1.4" depth="0.38" color="#b08840" position="0.3 0.75 0"></a-box>
        <a-box width="1.18" height="0.02" depth="0.38" color="#b08840" position="0 0.75 0"></a-box>
        <!-- Backpacks (abstract blobs) -->
        <a-box width="0.22" height="0.28" depth="0.15" color="#2244cc" position="-0.45 0.4 0.05"
               rotation="0 5 0"></a-box>
        <a-box width="0.2" height="0.25" depth="0.14" color="#cc2244" position="0 1.1 0.05"
               rotation="0 -3 0"></a-box>
        <a-box width="0.24" height="0.26" depth="0.14" color="#22aa44" position="0.45 0.38 0.05"
               rotation="0 8 0"></a-box>
      </a-entity>

      <!-- Motivational poster -->
      <a-entity position="-4 2.5 -6.93">
        <a-plane width="0.6" height="0.8" color="#222244"></a-plane>
        <a-text value="DREAM\nBIG" position="0 0.05 0.01" align="center"
                width="0.5" color="#ffcc44" font="kelsonsans"></a-text>
        <a-text value="You can do it." position="0 -0.25 0.01" align="center"
                width="0.45" color="#aaaacc"></a-text>
      </a-entity>

      <!-- Clock -->
      <a-entity position="2 3 -6.95">
        <a-circle radius="0.2" color="#ffffff"></a-circle>
        <a-ring radius-inner="0.19" radius-outer="0.21" color="#222"></a-ring>
        <a-box width="0.008" height="0.12" depth="0.005" color="#222" position="0 0.05 0.01"></a-box>
        <a-box width="0.006" height="0.15" depth="0.005" color="#222" position="0.05 0 0.01"
               rotation="0 0 -90"></a-box>
      </a-entity>
    </a-entity>
  `;
}

// ---------------------------------------------------------------------------
// 3. BIOTECH LAB — clean, precise laboratory
// ---------------------------------------------------------------------------
export function buildBiotechLabScene() {
  return `
    <a-entity id="lab-env">
      <a-entity environment="${envString('lab')}"></a-entity>

      <!-- Lighting — cool, clinical fluorescents -->
      <a-entity light="type: ambient; color: #e0e8ff; intensity: 0.5"></a-entity>
      <a-entity light="type: directional; color: #ffffff; intensity: 0.7" position="1 6 2"></a-entity>
      <a-entity light="type: point; color: #f0f4ff; intensity: 0.8; distance: 8" position="0 3.8 -3"></a-entity>
      <a-entity light="type: point; color: #f0f4ff; intensity: 0.6; distance: 6" position="-3 3.8 -5"></a-entity>
      <a-entity light="type: point; color: #f0f4ff; intensity: 0.6; distance: 6" position="3 3.8 -2"></a-entity>

      <!-- Epoxy-coated floor -->
      <a-plane position="0 0.01 0" rotation="-90 0 0" width="14" height="14"
               color="#d4d8dc" metalness="0.25" roughness="0.4"></a-plane>

      <!-- Walls — clean white -->
      <a-plane position="0 3.5 -7" width="14" height="7" color="#e8ecf0"
               metalness="0.05" roughness="0.8"></a-plane>
      <a-plane position="-7 3.5 0" rotation="0 90 0" width="14" height="7" color="#eaecf0"
               metalness="0.05" roughness="0.8"></a-plane>
      <a-plane position="7 3.5 0" rotation="0 -90 0" width="14" height="7" color="#eaecf0"
               metalness="0.05" roughness="0.8"></a-plane>

      <!-- Ceiling -->
      <a-plane position="0 4.2 -3" rotation="90 0 0" width="14" height="10" color="#f0f0f0"></a-plane>
      <!-- Fluorescent panels -->
      <a-box position="-1.5 4.15 -2" width="1.2" height="0.03" depth="0.6" color="#ffffff"
             material="emissive: #f0f4ff; emissiveIntensity: 0.6"></a-box>
      <a-box position="1.5 4.15 -4" width="1.2" height="0.03" depth="0.6" color="#ffffff"
             material="emissive: #f0f4ff; emissiveIntensity: 0.5"></a-box>
      <a-box position="-3 4.15 -5" width="1.2" height="0.03" depth="0.6" color="#ffffff"
             material="emissive: #f0f4ff; emissiveIntensity: 0.5"></a-box>

      <!-- ============================================ -->
      <!-- MICROSCOPE STATION (interactive)             -->
      <!-- ============================================ -->
      <a-entity id="spatial-microscope" class="interactive-target" data-target="microscope"
                position="-2.5 0 -2.5">
        <!-- Lab bench -->
        <a-box width="2" height="0.04" depth="0.8" color="#e0e4e8" position="0 0.88 0"
               metalness="0.4" roughness="0.3"></a-box>
        <a-box width="0.06" height="0.88" depth="0.06" color="#aab0b8" position="-0.9 0.44 -0.35"></a-box>
        <a-box width="0.06" height="0.88" depth="0.06" color="#aab0b8" position="0.9 0.44 -0.35"></a-box>
        <a-box width="0.06" height="0.88" depth="0.06" color="#aab0b8" position="-0.9 0.44 0.35"></a-box>
        <a-box width="0.06" height="0.88" depth="0.06" color="#aab0b8" position="0.9 0.44 0.35"></a-box>
        <!-- Under-bench cabinet -->
        <a-box width="0.7" height="0.6" depth="0.55" color="#d0d4d8" position="0.5 0.32 0.05"></a-box>
        <a-box width="0.6" height="0.01" depth="0.005" color="#999" position="0.5 0.45 0.34"></a-box>
        <!-- Microscope -->
        <a-entity position="-0.2 0.9 0">
          <!-- Base -->
          <a-box width="0.18" height="0.04" depth="0.22" color="#222233" metalness="0.7" roughness="0.3"></a-box>
          <!-- Stage -->
          <a-cylinder radius="0.06" height="0.02" color="#333344" position="0 0.08 0" metalness="0.8"></a-cylinder>
          <!-- Arm -->
          <a-box width="0.04" height="0.3" depth="0.04" color="#222233" position="0 0.18 -0.08"
                 metalness="0.7"></a-box>
          <!-- Head -->
          <a-box width="0.06" height="0.06" depth="0.1" color="#222233" position="0 0.34 -0.04"
                 metalness="0.7"></a-box>
          <!-- Eyepieces -->
          <a-cylinder radius="0.018" height="0.08" color="#111122" position="-0.02 0.4 0"
                      rotation="20 0 0" metalness="0.8"></a-cylinder>
          <a-cylinder radius="0.018" height="0.08" color="#111122" position="0.02 0.4 0"
                      rotation="20 0 0" metalness="0.8"></a-cylinder>
          <!-- Objective lens -->
          <a-cylinder radius="0.012" height="0.04" color="#333" position="0 0.06 0" metalness="0.9"></a-cylinder>
          <!-- LED indicator -->
          <a-sphere radius="0.005" color="#00ff44" position="0.09 0.04 0.1"
                    material="emissive: #00ff44; emissiveIntensity: 1.5"></a-sphere>
        </a-entity>
        <!-- Slide box -->
        <a-box width="0.12" height="0.03" depth="0.08" color="#ddddee" position="0.2 0.91 0.15"
               metalness="0.2"></a-box>
        <!-- Individual slides -->
        <a-box width="0.075" height="0.002" depth="0.025" color="#e8e8f0" position="0.3 0.9 -0.1"
               opacity="0.7"></a-box>
        <a-box width="0.075" height="0.002" depth="0.025" color="#e8e8f0" position="0.35 0.9 -0.05"
               opacity="0.7" rotation="0 15 0"></a-box>
        <!-- Lab stool -->
        <a-entity position="-0.2 0 0.7">
          <a-cylinder radius="0.16" height="0.04" color="#333355" position="0 0.6 0"></a-cylinder>
          <a-cylinder radius="0.03" height="0.55" color="#888" position="0 0.3 0" metalness="0.6"></a-cylinder>
          <a-cylinder radius="0.2" height="0.02" color="#888" position="0 0.02 0" metalness="0.6"></a-cylinder>
        </a-entity>
        <a-text value="Analyze the sample under the scope" position="0 1.55 0" align="center" width="2.5"
                color="#ffcc00" visible="false" class="hover-label"></a-text>
      </a-entity>

      <!-- ============================================ -->
      <!-- PROTOCOL BINDER STATION (interactive)        -->
      <!-- ============================================ -->
      <a-entity id="spatial-protocol-binder" class="interactive-target" data-target="protocol-binder"
                position="3 0 -2">
        <!-- Side station counter -->
        <a-box width="1.4" height="0.04" depth="0.65" color="#e0e4e8" position="0 0.88 0"
               metalness="0.4" roughness="0.3"></a-box>
        <a-box width="0.06" height="0.88" depth="0.06" color="#aab0b8" position="-0.6 0.44 -0.25"></a-box>
        <a-box width="0.06" height="0.88" depth="0.06" color="#aab0b8" position="0.6 0.44 -0.25"></a-box>
        <a-box width="0.06" height="0.88" depth="0.06" color="#aab0b8" position="-0.6 0.44 0.25"></a-box>
        <a-box width="0.06" height="0.88" depth="0.06" color="#aab0b8" position="0.6 0.44 0.25"></a-box>
        <!-- Protocol binder -->
        <a-entity position="-0.25 0.92 0" rotation="0 10 0">
          <a-box width="0.28" height="0.06" depth="0.32" color="#2244aa" metalness="0.2" roughness="0.6"></a-box>
          <!-- Ring binder spine -->
          <a-cylinder radius="0.015" height="0.28" color="#cccccc" position="-0.12 0.03 0"
                      rotation="0 0 90" metalness="0.7"></a-cylinder>
          <!-- Tab dividers sticking up -->
          <a-box width="0.01" height="0.02" depth="0.035" color="#ff4444" position="0.14 0.04 -0.12"></a-box>
          <a-box width="0.01" height="0.02" depth="0.035" color="#44bb44" position="0.14 0.04 0"></a-box>
          <a-box width="0.01" height="0.02" depth="0.035" color="#ffaa22" position="0.14 0.04 0.12"></a-box>
          <a-text value="SOP MANUAL\nv4.2" position="0 0.032 -0.03" rotation="-90 10 0"
                  width="0.22" color="#ffffff" font="kelsonsans"></a-text>
        </a-entity>
        <!-- Laptop -->
        <a-entity position="0.3 0.9 0" rotation="0 -5 0">
          <!-- Base -->
          <a-box width="0.32" height="0.015" depth="0.22" color="#cccccc" metalness="0.5" roughness="0.3"></a-box>
          <!-- Screen -->
          <a-box width="0.32" height="0.22" depth="0.01" color="#cccccc" position="0 0.12 -0.105"
                 rotation="-75 0 0" metalness="0.4"></a-box>
          <a-plane width="0.29" height="0.18" color="#1a2a44" position="0 0.12 -0.1"
                   rotation="-75 0 0"></a-plane>
          <!-- Screen content -->
          <a-text value="Protocol Editor" position="0 0.17 -0.095" rotation="-75 0 0"
                  width="0.22" color="#44aaff"></a-text>
          <a-text value="Step 1: Prepare sample\nStep 2: Add reagent\nStep 3: Incubate 30 min"
                  position="0 0.1 -0.09" rotation="-75 0 0" width="0.2" color="#88ccff"></a-text>
        </a-entity>
        <!-- Lab stool -->
        <a-entity position="0.1 0 0.7">
          <a-cylinder radius="0.16" height="0.04" color="#333355" position="0 0.6 0"></a-cylinder>
          <a-cylinder radius="0.03" height="0.55" color="#888" position="0 0.3 0" metalness="0.6"></a-cylinder>
          <a-cylinder radius="0.2" height="0.02" color="#888" position="0 0.02 0" metalness="0.6"></a-cylinder>
        </a-entity>
        <a-text value="Update the lab protocols" position="0 1.55 0" align="center" width="2.2"
                color="#ffcc00" visible="false" class="hover-label"></a-text>
      </a-entity>

      <!-- ============================================ -->
      <!-- PRESENTATION WHITEBOARD (interactive)        -->
      <!-- ============================================ -->
      <a-entity id="spatial-whiteboard" class="interactive-target" data-target="whiteboard"
                position="0 0 -6">
        <!-- Whiteboard on wall -->
        <a-box width="2.4" height="1.4" depth="0.04" color="#f0f0ee" position="0 1.7 -0.8"></a-box>
        <!-- Frame -->
        <a-box width="2.45" height="0.04" depth="0.05" color="#888888" position="0 2.4 -0.8" metalness="0.5"></a-box>
        <a-box width="2.45" height="0.04" depth="0.05" color="#888888" position="0 1.0 -0.8" metalness="0.5"></a-box>
        <a-box width="0.04" height="1.4" depth="0.05" color="#888888" position="-1.22 1.7 -0.8" metalness="0.5"></a-box>
        <a-box width="0.04" height="1.4" depth="0.05" color="#888888" position="1.22 1.7 -0.8" metalness="0.5"></a-box>
        <!-- Tray -->
        <a-box width="1" height="0.03" depth="0.08" color="#aaa" position="0 0.96 -0.76" metalness="0.4"></a-box>
        <!-- Markers -->
        <a-cylinder radius="0.012" height="0.12" color="#cc0000" position="-0.15 1.01 -0.76" rotation="0 0 85"></a-cylinder>
        <a-cylinder radius="0.012" height="0.12" color="#0000cc" position="0 1.01 -0.76" rotation="0 0 85"></a-cylinder>
        <a-cylinder radius="0.012" height="0.12" color="#008800" position="0.15 1.01 -0.76" rotation="0 0 85"></a-cylinder>
        <!-- Data charts drawn on board -->
        <a-text value="RESULTS — Q2 Analysis" position="0 2.2 -0.77" align="center"
                width="1.5" color="#2244aa" font="kelsonsans"></a-text>
        <!-- Bar chart -->
        <a-box width="0.12" height="0.35" depth="0.01" color="#2266cc" position="-0.5 1.5 -0.77"></a-box>
        <a-box width="0.12" height="0.55" depth="0.01" color="#22aa66" position="-0.25 1.6 -0.77"></a-box>
        <a-box width="0.12" height="0.4" depth="0.01" color="#cc6622" position="0 1.52 -0.77"></a-box>
        <a-box width="0.12" height="0.65" depth="0.01" color="#cc2244" position="0.25 1.65 -0.77"></a-box>
        <!-- Axis lines -->
        <a-plane width="0.8" height="0.003" color="#333" position="-0.12 1.3 -0.77"></a-plane>
        <a-plane width="0.003" height="0.8" color="#333" position="-0.62 1.7 -0.77"></a-plane>
        <!-- Annotations -->
        <a-text value="p < 0.01 *" position="0.6 1.95 -0.77" width="0.6" color="#cc2222"></a-text>
        <!-- Presenter podium / small table -->
        <a-box width="0.5" height="0.7" depth="0.4" color="#8a7050" position="1.5 0.35 -0.5"
               metalness="0.1" roughness="0.8"></a-box>
        <a-box width="0.25" height="0.01" depth="0.18" color="#f5f0e0" position="1.5 0.71 -0.5"></a-box>
        <a-text value="Findings Summary" position="1.5 0.72 -0.45" rotation="-90 0 0"
                width="0.2" color="#333"></a-text>
        <a-text value="Present findings to the PI" position="0 2.7 -0.5" align="center" width="2.2"
                color="#ffcc00" visible="false" class="hover-label"></a-text>
      </a-entity>

      <!-- ============================================ -->
      <!-- ENVIRONMENTAL DETAIL                         -->
      <!-- ============================================ -->

      <!-- Centrifuge on bench (left wall area) -->
      <a-entity position="-5.5 0.9 -5">
        <a-cylinder radius="0.18" height="0.22" color="#dddddd" metalness="0.5" roughness="0.3"></a-cylinder>
        <a-cylinder radius="0.15" height="0.02" color="#aaaaaa" position="0 0.12 0" metalness="0.7"></a-cylinder>
        <!-- Control panel -->
        <a-box width="0.08" height="0.04" depth="0.02" color="#222" position="0.15 0.05 0.15"></a-box>
        <a-sphere radius="0.006" color="#00ff00" position="0.18 0.06 0.16"
                  material="emissive: #00ff00; emissiveIntensity: 1"></a-sphere>
        <!-- Bench under it -->
        <a-box width="1.5" height="0.04" depth="0.65" color="#e0e4e8" position="0 -0.02 0" metalness="0.4"></a-box>
        <a-box width="0.06" height="0.88" depth="0.06" color="#aab0b8" position="-0.65 -0.46 -0.25"></a-box>
        <a-box width="0.06" height="0.88" depth="0.06" color="#aab0b8" position="0.65 -0.46 -0.25"></a-box>
        <a-box width="0.06" height="0.88" depth="0.06" color="#aab0b8" position="-0.65 -0.46 0.25"></a-box>
        <a-box width="0.06" height="0.88" depth="0.06" color="#aab0b8" position="0.65 -0.46 0.25"></a-box>
      </a-entity>

      <!-- Fume hood (back wall left) -->
      <a-entity position="-5 0 -6.5">
        <!-- Hood body -->
        <a-box width="1.2" height="1.8" depth="0.8" color="#d8dce0" position="0 0.9 0"
               metalness="0.3" roughness="0.5"></a-box>
        <!-- Glass sash (partly open) -->
        <a-plane width="1.1" height="0.6" color="#c8dde8" opacity="0.25" position="0 1.3 0.38"></a-plane>
        <!-- Interior light -->
        <a-box width="0.8" height="0.02" depth="0.3" color="#fff" position="0 1.75 0"
               material="emissive: #f8f8ff; emissiveIntensity: 0.3"></a-box>
        <!-- FUME HOOD label -->
        <a-text value="FUME HOOD" position="0 1.85 0.42" align="center" width="0.6"
                color="#444" font="kelsonsans"></a-text>
      </a-entity>

      <!-- Pipette rack on main bench area -->
      <a-entity position="-2.5 0.92 -2.5">
        <a-box width="0.15" height="0.12" depth="0.06" color="#4466aa" position="0.65 0 -0.25"></a-box>
        <!-- Pipettes -->
        <a-cylinder radius="0.008" height="0.2" color="#ddd" position="0.62 0.1 -0.25" metalness="0.4"></a-cylinder>
        <a-cylinder radius="0.008" height="0.2" color="#ddd" position="0.66 0.1 -0.25" metalness="0.4"></a-cylinder>
        <a-cylinder radius="0.008" height="0.2" color="#ddd" position="0.70 0.1 -0.25" metalness="0.4"></a-cylinder>
      </a-entity>

      <!-- Chemical bottles on shelf -->
      <a-entity position="5.5 1.5 -6.9">
        <!-- Shelf -->
        <a-box width="1.5" height="0.03" depth="0.25" color="#d0d4d8" metalness="0.3"></a-box>
        <!-- Bottles -->
        <a-cylinder radius="0.035" height="0.15" color="#884422" position="-0.5 0.09 0"
                    metalness="0.3"></a-cylinder>
        <a-cylinder radius="0.03" height="0.18" color="#ffffff" position="-0.2 0.1 0"
                    metalness="0.2"></a-cylinder>
        <a-cylinder radius="0.04" height="0.12" color="#2244aa" position="0.1 0.08 0"
                    metalness="0.3"></a-cylinder>
        <a-cylinder radius="0.03" height="0.16" color="#228844" position="0.4 0.1 0"
                    metalness="0.3"></a-cylinder>
      </a-entity>

      <!-- Biohazard bin -->
      <a-entity position="5 0 -4">
        <a-cylinder radius="0.2" height="0.6" color="#cc2222" position="0 0.3 0" metalness="0.3"></a-cylinder>
        <a-cylinder radius="0.21" height="0.04" color="#aa1111" position="0 0.62 0" metalness="0.4"></a-cylinder>
        <a-text value="BIOHAZARD" position="0 0.35 0.21" align="center" width="0.3"
                color="#ffcc00" font="kelsonsans"></a-text>
      </a-entity>

      <!-- Safety shower sign -->
      <a-entity position="-6.95 2.8 -1" rotation="0 90 0">
        <a-plane width="0.4" height="0.3" color="#228833"></a-plane>
        <a-text value="SAFETY\nSHOWER" position="0 0 0.01" align="center"
                width="0.3" color="#ffffff" font="kelsonsans"></a-text>
      </a-entity>

      <!-- Glove box (right wall) -->
      <a-entity position="6.5 0.9 -2">
        <a-box width="0.8" height="0.5" depth="0.6" color="#dddddd" metalness="0.3" roughness="0.4"></a-box>
        <!-- Viewing window -->
        <a-plane width="0.6" height="0.3" color="#aaccdd" opacity="0.25" position="0 0.05 0.31"></a-plane>
        <!-- Glove ports -->
        <a-circle radius="0.06" color="#222" position="-0.15 -0.05 0.31"></a-circle>
        <a-circle radius="0.06" color="#222" position="0.15 -0.05 0.31"></a-circle>
      </a-entity>

      <!-- Emergency eyewash station sign -->
      <a-entity position="6.95 2.8 -5" rotation="0 -90 0">
        <a-plane width="0.4" height="0.3" color="#2255bb"></a-plane>
        <a-text value="EYEWASH\nSTATION" position="0 0 0.01" align="center"
                width="0.3" color="#ffffff" font="kelsonsans"></a-text>
      </a-entity>
    </a-entity>
  `;
}

// ---------------------------------------------------------------------------
// 4. STARTUP OFFICE — energetic open-plan space
// ---------------------------------------------------------------------------
export function buildStartupOfficeScene() {
  return `
    <a-entity id="startup-env">
      <a-entity environment="${envString('startup')}"></a-entity>

      <!-- Lighting — bright, modern -->
      <a-entity light="type: ambient; color: #fff8f0; intensity: 0.5"></a-entity>
      <a-entity light="type: directional; color: #ffffff; intensity: 0.7" position="2 5 1"></a-entity>
      <a-entity light="type: point; color: #ffeedd; intensity: 0.6; distance: 7" position="-2 3.5 -3"></a-entity>
      <a-entity light="type: point; color: #ffeedd; intensity: 0.6; distance: 7" position="2 3.5 -4"></a-entity>
      <a-entity light="type: spot; color: #ffcc88; intensity: 0.8; angle: 45; penumbra: 0.5"
                position="0 4.5 -5" rotation="-85 0 0"></a-entity>

      <!-- Polished concrete floor -->
      <a-plane position="0 0.01 0" rotation="-90 0 0" width="14" height="14"
               color="#c8c0b8" metalness="0.2" roughness="0.45"></a-plane>

      <!-- Exposed brick wall (back) -->
      <a-plane position="0 3.5 -7" width="14" height="7" color="#9a5a3a"
               metalness="0.05" roughness="0.95"></a-plane>
      <!-- Brick texture lines (horizontal mortar) -->
      <a-plane position="0 1.5 -6.98" width="14" height="0.02" color="#b08060"></a-plane>
      <a-plane position="0 2.0 -6.98" width="14" height="0.02" color="#b08060"></a-plane>
      <a-plane position="0 2.5 -6.98" width="14" height="0.02" color="#b08060"></a-plane>
      <a-plane position="0 3.0 -6.98" width="14" height="0.02" color="#b08060"></a-plane>
      <a-plane position="0 3.5 -6.98" width="14" height="0.02" color="#b08060"></a-plane>
      <a-plane position="0 4.0 -6.98" width="14" height="0.02" color="#b08060"></a-plane>

      <!-- Side walls — white drywall -->
      <a-plane position="-7 3.5 0" rotation="0 90 0" width="14" height="7" color="#f0ece4"
               metalness="0.03" roughness="0.9"></a-plane>
      <a-plane position="7 3.5 0" rotation="0 -90 0" width="14" height="7" color="#f0ece4"
               metalness="0.03" roughness="0.9"></a-plane>

      <!-- Ceiling with exposed ductwork -->
      <a-plane position="0 4.8 -3" rotation="90 0 0" width="14" height="10" color="#2a2a2a"></a-plane>
      <!-- Exposed ducts -->
      <a-cylinder radius="0.15" height="8" color="#888888" position="-2 4.4 -3"
                  rotation="0 0 90" metalness="0.6" roughness="0.3"></a-cylinder>
      <a-cylinder radius="0.1" height="6" color="#777777" position="2 4.5 -4"
                  rotation="90 0 0" metalness="0.5"></a-cylinder>
      <!-- Pendant lights (industrial bulb style) -->
      <a-entity position="-1 3.8 -3">
        <a-cylinder radius="0.003" height="0.8" color="#222" position="0 0.4 0"></a-cylinder>
        <a-sphere radius="0.06" color="#ffdd88" position="0 0 0"
                  material="emissive: #ffcc66; emissiveIntensity: 0.6"></a-sphere>
      </a-entity>
      <a-entity position="1 3.8 -5">
        <a-cylinder radius="0.003" height="0.8" color="#222" position="0 0.4 0"></a-cylinder>
        <a-sphere radius="0.06" color="#ffdd88" position="0 0 0"
                  material="emissive: #ffcc66; emissiveIntensity: 0.5"></a-sphere>
      </a-entity>
      <a-entity position="3 3.8 -2">
        <a-cylinder radius="0.003" height="0.8" color="#222" position="0 0.4 0"></a-cylinder>
        <a-sphere radius="0.06" color="#ffdd88" position="0 0 0"
                  material="emissive: #ffcc66; emissiveIntensity: 0.5"></a-sphere>
      </a-entity>

      <!-- ============================================ -->
      <!-- ELECTRONICS WORKBENCH (interactive)          -->
      <!-- ============================================ -->
      <a-entity id="spatial-workbench" class="interactive-target" data-target="workbench"
                position="-3 0 -2.5">
        <!-- Workbench -->
        <a-box width="1.8" height="0.05" depth="0.8" color="#8B6914" position="0 0.82 0"
               metalness="0.15" roughness="0.75"></a-box>
        <!-- Legs (sawhorse style) -->
        <a-box width="0.06" height="0.82" depth="0.06" color="#6a5010" position="-0.8 0.41 -0.3"
               rotation="0 0 3"></a-box>
        <a-box width="0.06" height="0.82" depth="0.06" color="#6a5010" position="0.8 0.41 -0.3"
               rotation="0 0 -3"></a-box>
        <a-box width="0.06" height="0.82" depth="0.06" color="#6a5010" position="-0.8 0.41 0.3"
               rotation="0 0 3"></a-box>
        <a-box width="0.06" height="0.82" depth="0.06" color="#6a5010" position="0.8 0.41 0.3"
               rotation="0 0 -3"></a-box>
        <!-- Breadboard -->
        <a-box width="0.2" height="0.015" depth="0.12" color="#e8e4d0" position="-0.3 0.86 0"
               metalness="0.1"></a-box>
        <!-- Components on breadboard -->
        <a-box width="0.015" height="0.02" depth="0.015" color="#222" position="-0.32 0.87 0.02"></a-box>
        <a-box width="0.015" height="0.02" depth="0.015" color="#cc2222" position="-0.28 0.87 -0.02"></a-box>
        <a-cylinder radius="0.004" height="0.015" color="#2288ff" position="-0.35 0.87 -0.03"></a-cylinder>
        <!-- LED on breadboard (blinking) -->
        <a-sphere radius="0.006" color="#ff0000" position="-0.3 0.88 0.04"
                  material="emissive: #ff0000; emissiveIntensity: 1"
                  animation="property: material.emissiveIntensity; from: 0.2; to: 1.5; dur: 500; dir: alternate; loop: true"></a-sphere>
        <!-- Jumper wires (colorful) -->
        <a-cylinder radius="0.003" height="0.08" color="#ff0000" position="-0.33 0.87 0.01"
                    rotation="20 0 60"></a-cylinder>
        <a-cylinder radius="0.003" height="0.06" color="#0044ff" position="-0.27 0.87 -0.01"
                    rotation="-15 30 45"></a-cylinder>
        <!-- Multimeter -->
        <a-entity position="0.15 0.85 0.1">
          <a-box width="0.1" height="0.02" depth="0.14" color="#ffaa00" metalness="0.3"></a-box>
          <a-plane width="0.06" height="0.04" color="#1a2a1a" position="0 0.012 -0.02"
                   rotation="-90 0 0"></a-plane>
          <a-text value="3.3V" position="0 0.015 -0.02" rotation="-90 0 0" width="0.06"
                  color="#44ff44"></a-text>
          <!-- Probes -->
          <a-cylinder radius="0.003" height="0.15" color="#cc0000" position="0.06 0 0.08"
                      rotation="70 0 20"></a-cylinder>
          <a-cylinder radius="0.003" height="0.15" color="#111111" position="-0.05 0 0.08"
                      rotation="75 0 -15"></a-cylinder>
        </a-entity>
        <!-- Soldering iron (resting) -->
        <a-entity position="0.5 0.85 -0.15">
          <a-cylinder radius="0.008" height="0.18" color="#444" rotation="0 20 80" metalness="0.5"></a-cylinder>
          <a-cylinder radius="0.015" height="0.08" color="#222" position="-0.08 -0.01 0"
                      rotation="0 20 80"></a-cylinder>
        </a-entity>
        <!-- Tangled charging cables (under bench) -->
        <a-entity position="0.6 0.05 0.2">
          <a-cylinder radius="0.004" height="0.4" color="#222" rotation="80 30 0"></a-cylinder>
          <a-cylinder radius="0.004" height="0.35" color="#eee" rotation="60 -20 40"></a-cylinder>
          <a-cylinder radius="0.004" height="0.3" color="#222" rotation="70 50 20"></a-cylinder>
        </a-entity>
        <a-text value="Tinker with the prototype" position="0 1.45 0" align="center" width="2"
                color="#ffcc00" visible="false" class="hover-label"></a-text>
      </a-entity>

      <!-- ============================================ -->
      <!-- PITCH DECK SCREEN (interactive)              -->
      <!-- ============================================ -->
      <a-entity id="spatial-screen" class="interactive-target" data-target="screen"
                position="2.5 0 -3">
        <!-- Large monitor on stand -->
        <a-box width="2" height="1.2" depth="0.04" color="#1a1a1a" position="0 1.6 0"
               metalness="0.5"></a-box>
        <a-plane width="1.9" height="1.1" color="#1a1a2a" position="0 1.6 0.025"></a-plane>
        <!-- Slide content -->
        <a-text value="Series A" position="0 2.0 0.03" align="center" width="1.3"
                color="#ffffff" font="kelsonsans"></a-text>
        <a-text value="$2.5M Raise" position="0 1.8 0.03" align="center" width="1.8"
                color="#44ddff" font="kelsonsans"></a-text>
        <!-- Traction graph -->
        <a-plane width="0.6" height="0.002" color="#555" position="-0.3 1.4 0.03"></a-plane>
        <a-plane width="0.002" height="0.35" color="#555" position="-0.6 1.4 0.03"></a-plane>
        <!-- Growth bars -->
        <a-box width="0.08" height="0.08" depth="0.005" color="#44bbff" position="-0.5 1.28 0.03"></a-box>
        <a-box width="0.08" height="0.15" depth="0.005" color="#44bbff" position="-0.35 1.31 0.03"></a-box>
        <a-box width="0.08" height="0.22" depth="0.005" color="#44bbff" position="-0.2 1.35 0.03"></a-box>
        <a-box width="0.08" height="0.3" depth="0.005" color="#44ddff" position="-0.05 1.39 0.03"></a-box>
        <!-- Slide indicator dots -->
        <a-sphere radius="0.012" color="#ffffff" position="-0.05 1.05 0.03"></a-sphere>
        <a-sphere radius="0.012" color="#555555" position="0 1.05 0.03"></a-sphere>
        <a-sphere radius="0.012" color="#555555" position="0.05 1.05 0.03"></a-sphere>
        <!-- Monitor stand -->
        <a-cylinder radius="0.04" height="0.5" color="#333" position="0 0.75 0" metalness="0.7"></a-cylinder>
        <a-box width="0.5" height="0.02" depth="0.3" color="#333" position="0 0.5 0" metalness="0.6"></a-box>
        <!-- Standing desk surface -->
        <a-box width="1.4" height="0.04" depth="0.6" color="#d8d0c0" position="0 0.48 0"></a-box>
        <a-box width="0.06" height="0.48" depth="0.06" color="#aaa" position="-0.6 0.24 -0.25" metalness="0.5"></a-box>
        <a-box width="0.06" height="0.48" depth="0.06" color="#aaa" position="0.6 0.24 -0.25" metalness="0.5"></a-box>
        <a-box width="0.06" height="0.48" depth="0.06" color="#aaa" position="-0.6 0.24 0.25" metalness="0.5"></a-box>
        <a-box width="0.06" height="0.48" depth="0.06" color="#aaa" position="0.6 0.24 0.25" metalness="0.5"></a-box>
        <!-- Wireless keyboard -->
        <a-box width="0.32" height="0.01" depth="0.12" color="#ddd" position="-0.15 0.5 0.15"
               metalness="0.3"></a-box>
        <!-- Mouse -->
        <a-box width="0.05" height="0.02" depth="0.08" color="#ddd" position="0.25 0.5 0.15"
               metalness="0.3" roughness="0.4"></a-box>
        <a-text value="Refine the pitch deck" position="0 2.5 0" align="center" width="2"
                color="#ffcc00" visible="false" class="hover-label"></a-text>
      </a-entity>

      <!-- ============================================ -->
      <!-- BUSINESS MODEL WHITEBOARD (interactive)      -->
      <!-- ============================================ -->
      <a-entity id="spatial-whiteboard" class="interactive-target" data-target="whiteboard"
                position="0 0 -6.2">
        <!-- Large whiteboard on brick wall -->
        <a-box width="2.8" height="1.6" depth="0.04" color="#f0f0ee" position="0 1.8 -0.6"></a-box>
        <!-- Frame -->
        <a-box width="2.85" height="0.04" depth="0.05" color="#555" position="0 2.6 -0.6" metalness="0.5"></a-box>
        <a-box width="2.85" height="0.04" depth="0.05" color="#555" position="0 1.0 -0.6" metalness="0.5"></a-box>
        <a-box width="0.04" height="1.6" depth="0.05" color="#555" position="-1.42 1.8 -0.6" metalness="0.5"></a-box>
        <a-box width="0.04" height="1.6" depth="0.05" color="#555" position="1.42 1.8 -0.6" metalness="0.5"></a-box>
        <!-- Business Model Canvas grid lines -->
        <a-plane width="0.003" height="1.3" color="#888" position="-0.7 1.8 -0.575"></a-plane>
        <a-plane width="0.003" height="1.3" color="#888" position="0 1.8 -0.575"></a-plane>
        <a-plane width="0.003" height="1.3" color="#888" position="0.7 1.8 -0.575"></a-plane>
        <a-plane width="2.5" height="0.003" color="#888" position="0 1.5 -0.575"></a-plane>
        <a-plane width="2.5" height="0.003" color="#888" position="0 2.1 -0.575"></a-plane>
        <!-- Section headers -->
        <a-text value="Key Partners" position="-1.05 2.4 -0.57" width="0.5" color="#555"></a-text>
        <a-text value="Key Activities" position="-0.35 2.4 -0.57" width="0.5" color="#555"></a-text>
        <a-text value="Value Prop" position="0.35 2.4 -0.57" width="0.5" color="#555"></a-text>
        <a-text value="Channels" position="1.05 2.4 -0.57" width="0.5" color="#555"></a-text>
        <!-- Sticky notes (various colors) -->
        <a-plane width="0.15" height="0.12" color="#ffee44" position="-1.0 2.1 -0.57" rotation="0 0 -3"></a-plane>
        <a-plane width="0.15" height="0.12" color="#ffee44" position="-0.85 1.8 -0.57" rotation="0 0 5"></a-plane>
        <a-plane width="0.15" height="0.12" color="#ff88aa" position="-0.3 2.15 -0.57" rotation="0 0 2"></a-plane>
        <a-plane width="0.15" height="0.12" color="#ff88aa" position="-0.4 1.85 -0.57" rotation="0 0 -4"></a-plane>
        <a-plane width="0.15" height="0.12" color="#88ddff" position="0.3 2.1 -0.57" rotation="0 0 -2"></a-plane>
        <a-plane width="0.15" height="0.12" color="#88ddff" position="0.4 1.7 -0.57" rotation="0 0 6"></a-plane>
        <a-plane width="0.15" height="0.12" color="#88ff88" position="1.0 2.15 -0.57" rotation="0 0 3"></a-plane>
        <a-plane width="0.15" height="0.12" color="#88ff88" position="1.1 1.85 -0.57" rotation="0 0 -5"></a-plane>
        <a-plane width="0.15" height="0.12" color="#ffcc88" position="0.2 1.35 -0.57" rotation="0 0 2"></a-plane>
        <!-- Markers on tray -->
        <a-box width="0.8" height="0.03" depth="0.06" color="#aaa" position="0 0.96 -0.56" metalness="0.4"></a-box>
        <a-cylinder radius="0.01" height="0.11" color="#222" position="-0.1 1.01 -0.56" rotation="0 0 85"></a-cylinder>
        <a-cylinder radius="0.01" height="0.11" color="#cc2222" position="0 1.01 -0.56" rotation="0 0 85"></a-cylinder>
        <a-cylinder radius="0.01" height="0.11" color="#2222cc" position="0.1 1.01 -0.56" rotation="0 0 85"></a-cylinder>
        <a-text value="Map out the business model" position="0 2.85 -0.3" align="center" width="2.2"
                color="#ffcc00" visible="false" class="hover-label"></a-text>
      </a-entity>

      <!-- ============================================ -->
      <!-- ENVIRONMENTAL DETAIL                         -->
      <!-- ============================================ -->

      <!-- Bean bag chairs -->
      <a-entity position="-5 0 -5">
        <a-sphere radius="0.4" color="#cc4444" position="0 0.25 0"
                  scale="1 0.6 1"></a-sphere>
        <a-sphere radius="0.35" color="#cc4444" position="0 0.5 -0.15"
                  scale="1 0.7 0.8"></a-sphere>
      </a-entity>
      <a-entity position="-4 0 -5.5">
        <a-sphere radius="0.4" color="#4444cc" position="0 0.25 0"
                  scale="1 0.6 1"></a-sphere>
        <a-sphere radius="0.35" color="#4444cc" position="0 0.5 -0.15"
                  scale="1 0.7 0.8"></a-sphere>
      </a-entity>

      <!-- Ping pong table -->
      <a-entity position="5 0 -1.5">
        <!-- Table top -->
        <a-box width="1.5" height="0.04" depth="0.8" color="#1a5533" position="0 0.76 0"
               metalness="0.2" roughness="0.5"></a-box>
        <!-- White line markings -->
        <a-plane width="1.48" height="0.005" color="#ffffff" position="0 0.775 0"
                 rotation="-90 0 0"></a-plane>
        <a-plane width="0.005" height="0.78" color="#ffffff" position="0 0.775 0"
                 rotation="-90 0 0"></a-plane>
        <!-- Net -->
        <a-box width="0.02" height="0.16" depth="0.82" color="#cccccc" position="0 0.84 0"
               material="opacity: 0.5"></a-box>
        <!-- Legs -->
        <a-cylinder radius="0.025" height="0.76" color="#333" position="-0.7 0.38 -0.35" metalness="0.5"></a-cylinder>
        <a-cylinder radius="0.025" height="0.76" color="#333" position="0.7 0.38 -0.35" metalness="0.5"></a-cylinder>
        <a-cylinder radius="0.025" height="0.76" color="#333" position="-0.7 0.38 0.35" metalness="0.5"></a-cylinder>
        <a-cylinder radius="0.025" height="0.76" color="#333" position="0.7 0.38 0.35" metalness="0.5"></a-cylinder>
        <!-- Paddle on table -->
        <a-entity position="0.5 0.8 0.2">
          <a-circle radius="0.06" color="#cc2222" rotation="-90 0 0"></a-circle>
          <a-cylinder radius="0.012" height="0.08" color="#8a6a3a" position="0 0 0.07"
                      rotation="85 0 0"></a-cylinder>
        </a-entity>
        <!-- Ball -->
        <a-sphere radius="0.018" color="#ffaa00" position="-0.3 0.8 -0.1"></a-sphere>
      </a-entity>

      <!-- Coffee machine -->
      <a-entity position="-6 0 -1">
        <!-- Counter -->
        <a-box width="0.8" height="0.9" depth="0.5" color="#d0c8b8" position="0 0.45 0"
               metalness="0.1" roughness="0.7"></a-box>
        <!-- Machine -->
        <a-box width="0.3" height="0.4" depth="0.3" color="#333333" position="-0.1 1.1 0"
               metalness="0.5" roughness="0.3"></a-box>
        <a-box width="0.06" height="0.04" depth="0.08" color="#222" position="-0.1 0.92 0.1"></a-box>
        <!-- Water tank -->
        <a-box width="0.12" height="0.3" depth="0.1" color="#aaccdd" opacity="0.4"
               position="-0.1 1.15 -0.12"></a-box>
        <!-- Mugs -->
        <a-cylinder radius="0.03" height="0.08" color="#ffffff" position="0.2 0.94 0.1"></a-cylinder>
        <a-cylinder radius="0.03" height="0.08" color="#4466aa" position="0.28 0.94 0.05"></a-cylinder>
      </a-entity>

      <!-- "SHIP IT" poster on brick wall -->
      <a-entity position="4.5 2.8 -6.95">
        <a-plane width="0.7" height="0.45" color="#222222"></a-plane>
        <a-text value="SHIP IT" position="0 0 0.01" align="center"
                width="0.6" color="#ff4444" font="kelsonsans"></a-text>
      </a-entity>

      <!-- Another motivational poster -->
      <a-entity position="-3 2.8 -6.95">
        <a-plane width="0.7" height="0.45" color="#ffffff"></a-plane>
        <a-text value="MOVE FAST\n& LEARN" position="0 0 0.01" align="center"
                width="0.55" color="#333333" font="kelsonsans"></a-text>
      </a-entity>

      <!-- Pizza box (on floor near bean bags) -->
      <a-entity position="-4.5 0 -4.5">
        <a-box width="0.4" height="0.04" depth="0.4" color="#c8a050" position="0 0.04 0"
               metalness="0.05" roughness="0.95"></a-box>
        <a-box width="0.36" height="0.005" depth="0.36" color="#e8d8b0" position="0 0.065 0"></a-box>
        <a-text value="PIZZA" position="0 0.07 0.01" rotation="-90 0 0" width="0.25"
                color="#cc4422"></a-text>
      </a-entity>

      <!-- Small plant -->
      <a-entity position="5.5 0 -5.5">
        <a-cylinder radius="0.08" height="0.15" color="#f0e8d8" position="0 0.075 0"></a-cylinder>
        <a-sphere radius="0.12" color="#44aa44" position="0 0.25 0"></a-sphere>
        <a-sphere radius="0.08" color="#339933" position="0.04 0.33 0.02"></a-sphere>
      </a-entity>

      <!-- Shared long desk (background) -->
      <a-entity position="-5.5 0 1">
        <a-box width="2.5" height="0.04" depth="0.7" color="#d8d0c0" position="0 0.74 0"></a-box>
        <a-box width="0.06" height="0.74" depth="0.06" color="#aaa" position="-1.15 0.37 -0.3" metalness="0.5"></a-box>
        <a-box width="0.06" height="0.74" depth="0.06" color="#aaa" position="1.15 0.37 -0.3" metalness="0.5"></a-box>
        <a-box width="0.06" height="0.74" depth="0.06" color="#aaa" position="-1.15 0.37 0.3" metalness="0.5"></a-box>
        <a-box width="0.06" height="0.74" depth="0.06" color="#aaa" position="1.15 0.37 0.3" metalness="0.5"></a-box>
        <!-- Laptop (closed) -->
        <a-box width="0.32" height="0.02" depth="0.22" color="#cccccc" position="-0.5 0.77 0"
               metalness="0.4"></a-box>
        <!-- Monitor -->
        <a-box width="0.45" height="0.3" depth="0.03" color="#222" position="0.5 1.1 -0.15" metalness="0.4"></a-box>
        <a-cylinder radius="0.03" height="0.3" color="#888" position="0.5 0.9 -0.15" metalness="0.5"></a-cylinder>
      </a-entity>
    </a-entity>
  `;
}
