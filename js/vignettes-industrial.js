/**
 * Industrial vignettes — CNC Shop, Server Room, Warehouse, Outdoor Job Site.
 * Each builder returns a template literal of A-Frame entities.
 */

// ---------------------------------------------------------------------------
// CNC SHOP — precision machining floor
// ---------------------------------------------------------------------------
export function buildCNCShopScene() {
  return `
    <a-entity id="cnc-env">
      <a-entity environment="preset: tron; skyType: gradient; skyColor: #0a0a20; horizonColor: #1a1a3e; lighting: none; fog: 0.6"></a-entity>

      <!-- Lighting rig -->
      <a-entity light="type: ambient; color: #8888cc; intensity: 0.2"></a-entity>
      <a-entity light="type: spot; color: #aaccff; intensity: 2.2; angle: 50; penumbra: 0.4; decay: 1.2"
                position="0 6 -3" rotation="-90 0 0"></a-entity>
      <a-entity light="type: spot; color: #88aaff; intensity: 1.5; angle: 45; penumbra: 0.5"
                position="-4 5.5 -5" rotation="-80 25 0"></a-entity>
      <a-entity light="type: point; color: #00ccff; intensity: 0.8; distance: 5"
                position="0 1.6 -2.5"></a-entity>
      <a-entity light="type: point; color: #ffaa44; intensity: 0.4; distance: 3"
                position="4 2 -6"></a-entity>

      <!-- Polished concrete floor -->
      <a-plane position="0 0.01 0" rotation="-90 0 0" width="16" height="16"
               color="#1a1a2a" metalness="0.9" roughness="0.25"></a-plane>
      <!-- Floor safety line markings -->
      <a-plane position="0 0.02 -1" rotation="-90 0 0" width="12" height="0.08" color="#cccc00"></a-plane>
      <a-plane position="0 0.02 -6" rotation="-90 0 0" width="12" height="0.08" color="#cccc00"></a-plane>
      <a-plane position="-3 0.02 -3.5" rotation="-90 90 0" width="5" height="0.08" color="#cccc00"></a-plane>
      <a-plane position="3 0.02 -3.5" rotation="-90 90 0" width="5" height="0.08" color="#cccc00"></a-plane>

      <!-- Walls -->
      <a-plane position="0 3.5 -8" width="16" height="7" color="#14142a"
               metalness="0.4" roughness="0.7"></a-plane>
      <a-plane position="-8 3.5 0" rotation="0 90 0" width="16" height="7" color="#14142a"
               metalness="0.4" roughness="0.7"></a-plane>
      <a-plane position="8 3.5 0" rotation="0 -90 0" width="16" height="7" color="#14142a"
               metalness="0.4" roughness="0.7"></a-plane>

      <!-- Ceiling with industrial beams -->
      <a-plane position="0 7 -4" rotation="90 0 0" width="16" height="12" color="#0e0e1e"></a-plane>
      <a-box position="-4 6.8 -4" width="0.2" height="0.4" depth="12" color="#2a2a3a" metalness="0.7"></a-box>
      <a-box position="0 6.8 -4" width="0.2" height="0.4" depth="12" color="#2a2a3a" metalness="0.7"></a-box>
      <a-box position="4 6.8 -4" width="0.2" height="0.4" depth="12" color="#2a2a3a" metalness="0.7"></a-box>

      <!-- Overhead fluorescent light strips -->
      <a-box position="-2 6.5 -3" width="1.8" height="0.05" depth="0.15" color="#ddeeff"
             material="emissive: #aaccff; emissiveIntensity: 0.6"></a-box>
      <a-box position="2 6.5 -3" width="1.8" height="0.05" depth="0.15" color="#ddeeff"
             material="emissive: #aaccff; emissiveIntensity: 0.6"></a-box>
      <a-box position="0 6.5 -6" width="1.8" height="0.05" depth="0.15" color="#ddeeff"
             material="emissive: #aaccff; emissiveIntensity: 0.5"></a-box>

      <!-- ============================================ -->
      <!-- CNC MACHINE with CONTROL PANEL (interactive) -->
      <!-- ============================================ -->
      <a-entity id="spatial-cnc-panel" class="interactive-target" data-target="cnc-panel"
                position="0 0 -3">
        <!-- Machine body -->
        <a-box width="2.8" height="2.2" depth="2" color="#2a2a3a" position="0 1.1 0"
               metalness="0.85" roughness="0.2"></a-box>
        <!-- Machine top enclosure -->
        <a-box width="2.6" height="0.6" depth="1.8" color="#333348" position="0 2.5 0"
               metalness="0.8" roughness="0.25"></a-box>
        <!-- Viewing window -->
        <a-plane width="1.2" height="0.8" color="#0a2a3a" position="0 1.8 1.01"
                 material="opacity: 0.6; metalness: 0.1"></a-plane>
        <!-- Control panel — angled console -->
        <a-box width="0.9" height="0.5" depth="0.4" color="#1a1a2e" position="1.2 1.2 1.1"
               rotation="-20 0 0" metalness="0.6" roughness="0.3"></a-box>
        <!-- Digital readout screen -->
        <a-plane width="0.7" height="0.3" color="#001100" position="1.2 1.35 1.25"
                 rotation="-20 0 0"></a-plane>
        <a-text value="G-CODE READY\nX: 0.000  Y: 0.000\nZ: 12.450  F: 2400" position="1.2 1.38 1.27"
                rotation="-20 0 0" align="center" width="0.6" color="#00ff44" font="kelsonsans"></a-text>
        <!-- Blinking status LED -->
        <a-sphere radius="0.015" color="#00ff00" position="1.5 1.5 1.28"
                  material="emissive: #00ff00; emissiveIntensity: 1"
                  animation="property: material.emissiveIntensity; from: 0.3; to: 1.5; dur: 800; dir: alternate; loop: true"></a-sphere>
        <!-- Button cluster on panel -->
        <a-cylinder radius="0.025" height="0.02" color="#cc0000" position="0.9 1.25 1.3" rotation="-20 0 0"></a-cylinder>
        <a-cylinder radius="0.025" height="0.02" color="#00cc00" position="0.95 1.25 1.3" rotation="-20 0 0"></a-cylinder>
        <a-cylinder radius="0.02" height="0.015" color="#ffcc00" position="1.0 1.25 1.3" rotation="-20 0 0"></a-cylinder>
        <!-- Spindle visible inside window -->
        <a-cylinder radius="0.03" height="0.4" color="#aaaacc" position="0 1.6 0"
                    metalness="0.95" roughness="0.1"></a-cylinder>
        <!-- Chuck at spindle end -->
        <a-cylinder radius="0.06" height="0.08" color="#888899" position="0 1.38 0"
                    metalness="0.9"></a-cylinder>
        <!-- Coolant hose -->
        <a-cylinder radius="0.015" height="0.6" color="#445566" position="-0.4 1.8 0.5"
                    rotation="30 0 -20"></a-cylinder>
        <a-text value="Program the CNC" position="0.6 3.1 0.5" align="center" width="2"
                color="#ffcc00" visible="false" class="hover-label"></a-text>
      </a-entity>

      <!-- ============================================ -->
      <!-- MEASUREMENT STATION (interactive)            -->
      <!-- ============================================ -->
      <a-entity id="spatial-caliper" class="interactive-target" data-target="caliper"
                position="4 0 -5">
        <!-- Inspection bench -->
        <a-box width="1.4" height="0.85" depth="0.7" color="#3a3a4a" position="0 0.425 0"
               metalness="0.6" roughness="0.4"></a-box>
        <!-- Granite surface plate on bench -->
        <a-box width="1" height="0.1" depth="0.5" color="#1a1a1a" position="0 0.9 0"
               metalness="0.3" roughness="0.1"></a-box>
        <!-- Digital caliper -->
        <a-entity position="0.1 1.0 0" rotation="0 -10 0">
          <!-- Main beam -->
          <a-box width="0.35" height="0.008" depth="0.04" color="#ccccdd" metalness="0.9" roughness="0.1"></a-box>
          <!-- Fixed jaw -->
          <a-box width="0.008" height="0.06" depth="0.04" color="#ccccdd" position="-0.17 0.03 0" metalness="0.9"></a-box>
          <!-- Sliding jaw -->
          <a-box width="0.008" height="0.06" depth="0.04" color="#ccccdd" position="-0.05 0.03 0" metalness="0.9"></a-box>
          <!-- Digital display -->
          <a-plane width="0.08" height="0.03" color="#002200" position="0.08 0.025 0.021"></a-plane>
          <a-text value="25.40" position="0.08 0.025 0.022" align="center" width="0.12"
                  color="#00ff44" font="kelsonsans"></a-text>
        </a-entity>
        <!-- Micrometer next to caliper -->
        <a-entity position="-0.3 0.98 0.1">
          <a-cylinder radius="0.015" height="0.12" color="#aaaacc" rotation="0 0 90" metalness="0.9"></a-cylinder>
          <a-cylinder radius="0.025" height="0.05" color="#888899" rotation="0 0 90" position="0.06 0 0" metalness="0.85"></a-cylinder>
        </a-entity>
        <!-- Parts to be measured -->
        <a-cylinder radius="0.04" height="0.08" color="#888899" position="0.3 0.98 -0.1"
                    metalness="0.9" roughness="0.1"></a-cylinder>
        <a-box width="0.06" height="0.03" depth="0.06" color="#999aaa" position="0.35 0.97 0.1"
               metalness="0.85"></a-box>
        <!-- Height gauge in back -->
        <a-cylinder radius="0.015" height="0.5" color="#aaaaaa" position="-0.5 1.15 -0.15"
                    metalness="0.8"></a-cylinder>
        <a-box width="0.06" height="0.02" depth="0.04" color="#888" position="-0.5 1.3 -0.15"
               metalness="0.7"></a-box>
        <a-text value="Run measurements" position="0 1.6 0" align="center" width="2"
                color="#ffcc00" visible="false" class="hover-label"></a-text>
      </a-entity>

      <!-- ============================================ -->
      <!-- NEW HIRE at entrance (interactive)           -->
      <!-- ============================================ -->
      <a-entity id="spatial-new-hire" class="interactive-target" data-target="new-hire"
                position="-4.5 0 0.5">
        <!-- Person figure — abstract -->
        <a-cylinder radius="0.2" height="1" color="#3366aa" position="0 0.7 0"></a-cylinder>
        <a-sphere radius="0.14" color="#e8c8a0" position="0 1.4 0"></a-sphere>
        <!-- Hard hat (new, bright) -->
        <a-sphere radius="0.16" color="#ffcc00" position="0 1.55 0"
                  theta-start="0" theta-length="120"></a-sphere>
        <!-- Clipboard in hand -->
        <a-box width="0.15" height="0.22" depth="0.02" color="#8B7355" position="0.25 0.9 0.1"
               rotation="0 0 -5"></a-box>
        <a-plane width="0.12" height="0.18" color="#f5f0e0" position="0.25 0.9 0.12"
                 rotation="0 0 -5"></a-plane>
        <!-- Safety glasses perched on hat -->
        <a-entity position="0 1.55 0.15">
          <a-box width="0.1" height="0.025" depth="0.02" color="#333" opacity="0.6"></a-box>
        </a-entity>
        <!-- Name badge -->
        <a-plane width="0.08" height="0.05" color="#ffffff" position="0.12 1.1 0.2"></a-plane>
        <a-text value="NEW" position="0.12 1.1 0.21" align="center" width="0.15" color="#cc0000"></a-text>
        <a-text value="Show the new hire" position="0 2.0 0" align="center" width="2"
                color="#ffcc00" visible="false" class="hover-label"></a-text>
      </a-entity>

      <!-- ============================================ -->
      <!-- ENVIRONMENTAL DETAIL                         -->
      <!-- ============================================ -->

      <!-- Chip bins near CNC -->
      <a-entity position="-2 0 -4">
        <a-box width="0.8" height="0.7" depth="0.6" color="#3a4a3a" position="0 0.35 0"
               metalness="0.5" roughness="0.6"></a-box>
        <a-text value="CHIPS" position="0 0.75 0.31" align="center" width="0.5" color="#aaaaaa"></a-text>
        <!-- Metal shavings peeking out -->
        <a-box width="0.6" height="0.05" depth="0.4" color="#888899" position="0 0.72 0"
               metalness="0.9" roughness="0.3"></a-box>
      </a-entity>

      <!-- Second chip bin -->
      <a-entity position="-2.2 0 -5.2">
        <a-box width="0.8" height="0.7" depth="0.6" color="#3a4a3a" position="0 0.35 0"
               metalness="0.5" roughness="0.6"></a-box>
      </a-entity>

      <!-- Tool holder rack on wall -->
      <a-entity position="-7.9 1.6 -4">
        <a-box width="0.1" height="1.5" depth="2" color="#2a2a3a" metalness="0.6" roughness="0.5"></a-box>
        <!-- Tool holders in slots -->
        <a-cylinder radius="0.025" height="0.2" color="#aaaacc" position="0.12 0.4 -0.6" rotation="0 0 90" metalness="0.9"></a-cylinder>
        <a-cylinder radius="0.025" height="0.2" color="#aaaacc" position="0.12 0.4 -0.3" rotation="0 0 90" metalness="0.9"></a-cylinder>
        <a-cylinder radius="0.025" height="0.2" color="#aaaacc" position="0.12 0.4 0" rotation="0 0 90" metalness="0.9"></a-cylinder>
        <a-cylinder radius="0.025" height="0.2" color="#aaaacc" position="0.12 0.4 0.3" rotation="0 0 90" metalness="0.9"></a-cylinder>
        <a-cylinder radius="0.025" height="0.2" color="#aaaacc" position="0.12 0.4 0.6" rotation="0 0 90" metalness="0.9"></a-cylinder>
        <a-cylinder radius="0.025" height="0.2" color="#aaaacc" position="0.12 0 -0.6" rotation="0 0 90" metalness="0.9"></a-cylinder>
        <a-cylinder radius="0.025" height="0.2" color="#aaaacc" position="0.12 0 -0.3" rotation="0 0 90" metalness="0.9"></a-cylinder>
        <a-cylinder radius="0.025" height="0.2" color="#aaaacc" position="0.12 0 0" rotation="0 0 90" metalness="0.9"></a-cylinder>
        <a-cylinder radius="0.025" height="0.2" color="#aaaacc" position="0.12 -0.4 -0.4" rotation="0 0 90" metalness="0.9"></a-cylinder>
        <a-cylinder radius="0.025" height="0.2" color="#aaaacc" position="0.12 -0.4 0.2" rotation="0 0 90" metalness="0.9"></a-cylinder>
      </a-entity>

      <!-- Coolant tank and hose -->
      <a-entity position="2.5 0 -4.5">
        <a-box width="0.5" height="0.6" depth="0.4" color="#225588" position="0 0.3 0"
               metalness="0.3" roughness="0.6"></a-box>
        <a-cylinder radius="0.012" height="1" color="#224466" position="0.1 0.9 0"
                    rotation="15 0 -30"></a-cylinder>
        <a-text value="COOLANT" position="0 0.35 0.21" align="center" width="0.35" color="#88bbdd"></a-text>
      </a-entity>

      <!-- Safety glasses station on wall -->
      <a-entity position="5 1.5 -7.9">
        <a-box width="0.4" height="0.5" depth="0.08" color="#dddddd" metalness="0.2"></a-box>
        <a-text value="SAFETY\nGLASSES" position="0 0.1 0.05" align="center" width="0.3" color="#cc0000" font="kelsonsans"></a-text>
        <!-- Glasses hanging -->
        <a-box width="0.1" height="0.025" depth="0.04" color="#333" position="-0.08 -0.12 0.05" opacity="0.6"></a-box>
        <a-box width="0.1" height="0.025" depth="0.04" color="#333" position="0.08 -0.12 0.05" opacity="0.6"></a-box>
      </a-entity>

      <!-- Parts rack with finished pieces -->
      <a-entity position="6 0 -3">
        <!-- Rack frame -->
        <a-cylinder radius="0.03" height="2" color="#555566" position="-0.5 1 -0.3" metalness="0.7"></a-cylinder>
        <a-cylinder radius="0.03" height="2" color="#555566" position="0.5 1 -0.3" metalness="0.7"></a-cylinder>
        <a-cylinder radius="0.03" height="2" color="#555566" position="-0.5 1 0.3" metalness="0.7"></a-cylinder>
        <a-cylinder radius="0.03" height="2" color="#555566" position="0.5 1 0.3" metalness="0.7"></a-cylinder>
        <!-- Shelves -->
        <a-box width="1.1" height="0.03" depth="0.7" color="#444455" position="0 0.5 0" metalness="0.6"></a-box>
        <a-box width="1.1" height="0.03" depth="0.7" color="#444455" position="0 1.1 0" metalness="0.6"></a-box>
        <a-box width="1.1" height="0.03" depth="0.7" color="#444455" position="0 1.7 0" metalness="0.6"></a-box>
        <!-- Parts on shelves -->
        <a-cylinder radius="0.05" height="0.08" color="#aaaacc" position="-0.2 0.57 0" metalness="0.9"></a-cylinder>
        <a-box width="0.1" height="0.06" depth="0.1" color="#999aaa" position="0.15 0.55 0.05" metalness="0.85"></a-box>
        <a-cylinder radius="0.04" height="0.12" color="#bbbbcc" position="0 1.17 -0.1" metalness="0.9"></a-cylinder>
        <a-box width="0.08" height="0.08" depth="0.08" color="#aaaacc" position="-0.25 1.15 0.05" metalness="0.85"></a-box>
      </a-entity>

      <!-- Safety sign: EYE PROTECTION REQUIRED -->
      <a-entity position="-3 3 -7.95">
        <a-plane width="0.8" height="0.5" color="#0044aa"></a-plane>
        <a-text value="EYE PROTECTION\nREQUIRED" position="0 0 0.01" align="center"
                width="0.65" color="#ffffff" font="kelsonsans"></a-text>
      </a-entity>

      <!-- Fire extinguisher -->
      <a-entity position="7.85 0.6 -1">
        <a-cylinder radius="0.07" height="0.45" color="#cc0000" rotation="0 0 0" metalness="0.6"></a-cylinder>
        <a-cylinder radius="0.02" height="0.08" color="#222" position="0 0.25 0" metalness="0.8"></a-cylinder>
      </a-entity>
    </a-entity>
  `;
}

// ---------------------------------------------------------------------------
// SERVER ROOM — cool-toned data center
// ---------------------------------------------------------------------------
export function buildServerRoomScene() {
  return `
    <a-entity id="server-env">
      <a-entity environment="preset: tron; skyType: gradient; skyColor: #000011; horizonColor: #001133; lighting: none; fog: 0.5"></a-entity>

      <!-- Lighting rig — cool blue data-center feel -->
      <a-entity light="type: ambient; color: #112244; intensity: 0.2"></a-entity>
      <a-entity light="type: spot; color: #4488ff; intensity: 1.8; angle: 60; penumbra: 0.5; decay: 1"
                position="0 5 -3" rotation="-90 0 0"></a-entity>
      <a-entity light="type: point; color: #0066ff; intensity: 0.6; distance: 6"
                position="-3 3 -5"></a-entity>
      <a-entity light="type: point; color: #0044cc; intensity: 0.5; distance: 5"
                position="3 3 -5"></a-entity>
      <a-entity light="type: point; color: #ff3300; intensity: 0.4; distance: 3"
                position="0 2 -2.5"></a-entity>

      <!-- Raised floor tiles -->
      <a-plane position="0 0.01 0" rotation="-90 0 0" width="16" height="16"
               color="#181828" metalness="0.85" roughness="0.2"></a-plane>
      <!-- Floor tile grid lines -->
      <a-plane position="0 0.015 -2" rotation="-90 0 0" width="16" height="0.02" color="#2a2a4a"></a-plane>
      <a-plane position="0 0.015 -4" rotation="-90 0 0" width="16" height="0.02" color="#2a2a4a"></a-plane>
      <a-plane position="0 0.015 -6" rotation="-90 0 0" width="16" height="0.02" color="#2a2a4a"></a-plane>
      <a-plane position="-2 0.015 -4" rotation="-90 90 0" width="8" height="0.02" color="#2a2a4a"></a-plane>
      <a-plane position="0 0.015 -4" rotation="-90 90 0" width="8" height="0.02" color="#2a2a4a"></a-plane>
      <a-plane position="2 0.015 -4" rotation="-90 90 0" width="8" height="0.02" color="#2a2a4a"></a-plane>

      <!-- Walls -->
      <a-plane position="0 3 -8" width="16" height="6" color="#0a0a1a"
               metalness="0.3" roughness="0.8"></a-plane>
      <a-plane position="-8 3 0" rotation="0 90 0" width="16" height="6" color="#0a0a1a"
               metalness="0.3" roughness="0.8"></a-plane>
      <a-plane position="8 3 0" rotation="0 -90 0" width="16" height="6" color="#0a0a1a"
               metalness="0.3" roughness="0.8"></a-plane>

      <!-- Ceiling with cable trays -->
      <a-plane position="0 5.5 -4" rotation="90 0 0" width="16" height="12" color="#080818"></a-plane>
      <!-- Cable trays running across ceiling -->
      <a-box position="-3 5.2 -4" width="0.6" height="0.1" depth="10" color="#333344" metalness="0.6"></a-box>
      <a-box position="0 5.2 -4" width="0.6" height="0.1" depth="10" color="#333344" metalness="0.6"></a-box>
      <a-box position="3 5.2 -4" width="0.6" height="0.1" depth="10" color="#333344" metalness="0.6"></a-box>

      <!-- ============================================ -->
      <!-- ROW OF SERVER RACKS (left side — background) -->
      <!-- ============================================ -->
      <a-entity position="-5 0 -4">
        <!-- Rack 1 -->
        <a-box width="0.8" height="4" depth="0.9" color="#111122" position="0 2 0" metalness="0.7" roughness="0.3"></a-box>
        <!-- Server units -->
        <a-box width="0.7" height="0.08" depth="0.85" color="#1a1a2e" position="0 0.5 0.03" metalness="0.8"></a-box>
        <a-box width="0.7" height="0.08" depth="0.85" color="#1a1a2e" position="0 0.7 0.03" metalness="0.8"></a-box>
        <a-box width="0.7" height="0.08" depth="0.85" color="#1a1a2e" position="0 0.9 0.03" metalness="0.8"></a-box>
        <a-box width="0.7" height="0.08" depth="0.85" color="#1a1a2e" position="0 1.1 0.03" metalness="0.8"></a-box>
        <a-box width="0.7" height="0.08" depth="0.85" color="#1a1a2e" position="0 1.5 0.03" metalness="0.8"></a-box>
        <a-box width="0.7" height="0.08" depth="0.85" color="#1a1a2e" position="0 1.7 0.03" metalness="0.8"></a-box>
        <a-box width="0.7" height="0.08" depth="0.85" color="#1a1a2e" position="0 2.1 0.03" metalness="0.8"></a-box>
        <a-box width="0.7" height="0.08" depth="0.85" color="#1a1a2e" position="0 2.3 0.03" metalness="0.8"></a-box>
        <!-- Blinking LEDs -->
        <a-sphere radius="0.01" color="#00ff44" position="-0.28 0.5 0.47"
                  material="emissive: #00ff44; emissiveIntensity: 1"
                  animation="property: material.emissiveIntensity; from: 0.2; to: 1.5; dur: 600; dir: alternate; loop: true"></a-sphere>
        <a-sphere radius="0.01" color="#00ff44" position="-0.28 0.9 0.47"
                  material="emissive: #00ff44; emissiveIntensity: 1"
                  animation="property: material.emissiveIntensity; from: 0.4; to: 1.5; dur: 900; dir: alternate; loop: true"></a-sphere>
        <a-sphere radius="0.01" color="#00ff44" position="-0.28 1.5 0.47"
                  material="emissive: #00ff44; emissiveIntensity: 1"
                  animation="property: material.emissiveIntensity; from: 0.3; to: 1.5; dur: 750; dir: alternate; loop: true"></a-sphere>
        <a-sphere radius="0.01" color="#ffaa00" position="-0.28 2.1 0.47"
                  material="emissive: #ffaa00; emissiveIntensity: 1"
                  animation="property: material.emissiveIntensity; from: 0.5; to: 1.5; dur: 500; dir: alternate; loop: true"></a-sphere>
      </a-entity>

      <!-- Rack 2 -->
      <a-entity position="-5 0 -5.5">
        <a-box width="0.8" height="4" depth="0.9" color="#111122" position="0 2 0" metalness="0.7" roughness="0.3"></a-box>
        <a-box width="0.7" height="0.08" depth="0.85" color="#1a1a2e" position="0 0.6 0.03" metalness="0.8"></a-box>
        <a-box width="0.7" height="0.08" depth="0.85" color="#1a1a2e" position="0 0.8 0.03" metalness="0.8"></a-box>
        <a-box width="0.7" height="0.08" depth="0.85" color="#1a1a2e" position="0 1.2 0.03" metalness="0.8"></a-box>
        <a-box width="0.7" height="0.08" depth="0.85" color="#1a1a2e" position="0 1.6 0.03" metalness="0.8"></a-box>
        <a-box width="0.7" height="0.08" depth="0.85" color="#1a1a2e" position="0 2.0 0.03" metalness="0.8"></a-box>
        <a-sphere radius="0.01" color="#00ff44" position="-0.28 0.6 0.47"
                  material="emissive: #00ff44; emissiveIntensity: 1"
                  animation="property: material.emissiveIntensity; from: 0.2; to: 1.5; dur: 1100; dir: alternate; loop: true"></a-sphere>
        <a-sphere radius="0.01" color="#00ff44" position="-0.28 1.2 0.47"
                  material="emissive: #00ff44; emissiveIntensity: 1"
                  animation="property: material.emissiveIntensity; from: 0.5; to: 1.5; dur: 700; dir: alternate; loop: true"></a-sphere>
      </a-entity>

      <!-- ============================================ -->
      <!-- MONITORING DASHBOARD (interactive)           -->
      <!-- ============================================ -->
      <a-entity id="spatial-dashboard" class="interactive-target" data-target="dashboard"
                position="0 0 -3">
        <!-- Standing desk / monitoring station -->
        <a-box width="2.2" height="1" depth="0.7" color="#1a1a2e" position="0 0.5 0"
               metalness="0.5" roughness="0.5"></a-box>
        <!-- Dual monitors -->
        <a-entity position="-0.5 1.4 -0.1">
          <a-box width="0.7" height="0.45" depth="0.03" color="#0a0a1a" metalness="0.5"></a-box>
          <a-plane width="0.65" height="0.4" color="#001100" position="0 0 0.02"></a-plane>
          <!-- Alert content -->
          <a-text value="SECURITY ALERT" position="0 0.12 0.025" align="center" width="0.55"
                  color="#ff2200" font="kelsonsans"
                  animation="property: visible; from: true; to: false; dur: 500; dir: alternate; loop: true"></a-text>
          <a-text value="Unauthorized access\nPort 443 — 14:32:07\nSource: 192.168.4.117" position="0 -0.05 0.025"
                  align="center" width="0.5" color="#ff8844"></a-text>
          <!-- Monitor stand -->
          <a-cylinder radius="0.03" height="0.3" color="#333344" position="0 -0.38 0" metalness="0.7"></a-cylinder>
          <a-box width="0.2" height="0.015" depth="0.15" color="#333344" position="0 -0.52 0.03" metalness="0.6"></a-box>
        </a-entity>
        <!-- Second monitor — normal traffic -->
        <a-entity position="0.5 1.4 -0.1">
          <a-box width="0.7" height="0.45" depth="0.03" color="#0a0a1a" metalness="0.5"></a-box>
          <a-plane width="0.65" height="0.4" color="#000a11" position="0 0 0.02"></a-plane>
          <a-text value="NETWORK TRAFFIC\nNodes: 247 active\nBandwidth: 82%\nUptime: 99.97%" position="0 0.02 0.025"
                  align="center" width="0.5" color="#00aaff"></a-text>
          <a-cylinder radius="0.03" height="0.3" color="#333344" position="0 -0.38 0" metalness="0.7"></a-cylinder>
          <a-box width="0.2" height="0.015" depth="0.15" color="#333344" position="0 -0.52 0.03" metalness="0.6"></a-box>
        </a-entity>
        <!-- Keyboard -->
        <a-box width="0.45" height="0.015" depth="0.15" color="#222233" position="0 1.02 0.15"
               metalness="0.4" roughness="0.6"></a-box>
        <!-- Mouse -->
        <a-box width="0.06" height="0.02" depth="0.1" color="#222233" position="0.4 1.02 0.15"
               metalness="0.4" roughness="0.6" geometry="primitive: box; width: 0.06; height: 0.02; depth: 0.1"></a-box>
        <!-- Coffee mug -->
        <a-cylinder radius="0.035" height="0.1" color="#443322" position="-0.85 1.07 0.1"></a-cylinder>
        <a-text value="Investigate alert" position="0 2.1 0" align="center" width="2"
                color="#ffcc00" visible="false" class="hover-label"></a-text>
      </a-entity>

      <!-- ============================================ -->
      <!-- MESSY CABLE RACK (interactive)               -->
      <!-- ============================================ -->
      <a-entity id="spatial-rack" class="interactive-target" data-target="rack"
                position="4 0 -5">
        <!-- Rack frame -->
        <a-box width="0.8" height="4" depth="0.9" color="#111122" position="0 2 0" metalness="0.7" roughness="0.3"></a-box>
        <!-- Tangled cables — front face chaos -->
        <a-cylinder radius="0.01" height="1.2" color="#ff4444" position="-0.15 2.0 0.46"
                    rotation="15 0 25"></a-cylinder>
        <a-cylinder radius="0.01" height="1.5" color="#4444ff" position="0 1.8 0.46"
                    rotation="-10 5 -15"></a-cylinder>
        <a-cylinder radius="0.01" height="0.9" color="#44ff44" position="0.1 2.3 0.46"
                    rotation="20 -8 10"></a-cylinder>
        <a-cylinder radius="0.01" height="1.1" color="#ffff44" position="-0.1 1.5 0.46"
                    rotation="-5 12 -20"></a-cylinder>
        <a-cylinder radius="0.01" height="1.3" color="#ff44ff" position="0.2 1.9 0.46"
                    rotation="8 -3 30"></a-cylinder>
        <a-cylinder radius="0.01" height="0.8" color="#44ffff" position="-0.2 2.5 0.46"
                    rotation="-12 0 -10"></a-cylinder>
        <a-cylinder radius="0.01" height="1.0" color="#ff8844" position="0.15 1.3 0.46"
                    rotation="25 10 -5"></a-cylinder>
        <!-- Some cable ties on floor below -->
        <a-cylinder radius="0.003" height="0.12" color="#222" position="-0.1 0.02 0.5" rotation="90 0 0"></a-cylinder>
        <a-cylinder radius="0.003" height="0.12" color="#222" position="0.1 0.02 0.5" rotation="90 30 0"></a-cylinder>
        <!-- Server units behind cable mess -->
        <a-box width="0.7" height="0.08" depth="0.8" color="#1a1a2e" position="0 0.8 0" metalness="0.8"></a-box>
        <a-box width="0.7" height="0.08" depth="0.8" color="#1a1a2e" position="0 1.0 0" metalness="0.8"></a-box>
        <a-box width="0.7" height="0.08" depth="0.8" color="#1a1a2e" position="0 1.4 0" metalness="0.8"></a-box>
        <a-box width="0.7" height="0.08" depth="0.8" color="#1a1a2e" position="0 2.6 0" metalness="0.8"></a-box>
        <a-text value="Cable-manage the rack" position="0 4.3 0" align="center" width="2"
                color="#ffcc00" visible="false" class="hover-label"></a-text>
      </a-entity>

      <!-- ============================================ -->
      <!-- TEAM HUDDLE AREA (interactive)               -->
      <!-- ============================================ -->
      <a-entity id="spatial-team" class="interactive-target" data-target="team"
                position="-3 0 -0.5">
        <!-- Small whiteboard -->
        <a-entity position="-0.5 1.5 -1">
          <a-box width="1.2" height="0.8" depth="0.03" color="#f0f0ee"></a-box>
          <a-box width="1.25" height="0.03" depth="0.04" color="#666666" position="0 0.4 0" metalness="0.5"></a-box>
          <a-box width="1.25" height="0.03" depth="0.04" color="#666666" position="0 -0.4 0" metalness="0.5"></a-box>
          <a-text value="INCIDENT RESPONSE\n1. Isolate affected nodes\n2. Capture forensic image\n3. Notify stakeholders"
                  position="0 0.05 0.02" align="center" width="0.9" color="#333366"></a-text>
          <!-- Stand -->
          <a-cylinder radius="0.025" height="1.1" color="#555566" position="0 -0.95 0" metalness="0.6"></a-cylinder>
          <a-box width="0.4" height="0.02" depth="0.4" color="#555566" position="0 -1.5 0" metalness="0.5"></a-box>
        </a-entity>
        <!-- Team member figures (abstract) -->
        <a-entity position="0.5 0 0.3">
          <a-cylinder radius="0.15" height="0.9" color="#334466" position="0 0.65 0"></a-cylinder>
          <a-sphere radius="0.12" color="#e0c8a0" position="0 1.3 0"></a-sphere>
        </a-entity>
        <a-entity position="-0.3 0 0.6">
          <a-cylinder radius="0.15" height="0.9" color="#663344" position="0 0.65 0"></a-cylinder>
          <a-sphere radius="0.12" color="#d4a878" position="0 1.3 0"></a-sphere>
        </a-entity>
        <a-entity position="0.8 0 -0.3">
          <a-cylinder radius="0.15" height="0.9" color="#446633" position="0 0.65 0"></a-cylinder>
          <a-sphere radius="0.12" color="#c8b890" position="0 1.3 0"></a-sphere>
        </a-entity>
        <a-text value="Brief the team" position="0 2.2 0" align="center" width="2"
                color="#ffcc00" visible="false" class="hover-label"></a-text>
      </a-entity>

      <!-- ============================================ -->
      <!-- ENVIRONMENTAL DETAIL                         -->
      <!-- ============================================ -->

      <!-- Right side rack row (background) -->
      <a-entity position="5 0 -3">
        <a-box width="0.8" height="4" depth="0.9" color="#111122" position="0 2 0" metalness="0.7"></a-box>
        <a-box width="0.7" height="0.08" depth="0.85" color="#1a1a2e" position="0 0.5 0.03" metalness="0.8"></a-box>
        <a-box width="0.7" height="0.08" depth="0.85" color="#1a1a2e" position="0 1.0 0.03" metalness="0.8"></a-box>
        <a-box width="0.7" height="0.08" depth="0.85" color="#1a1a2e" position="0 1.5 0.03" metalness="0.8"></a-box>
        <a-box width="0.7" height="0.08" depth="0.85" color="#1a1a2e" position="0 2.0 0.03" metalness="0.8"></a-box>
        <a-sphere radius="0.01" color="#00ff44" position="-0.28 1.0 0.47"
                  material="emissive: #00ff44; emissiveIntensity: 1"
                  animation="property: material.emissiveIntensity; from: 0.3; to: 1.5; dur: 850; dir: alternate; loop: true"></a-sphere>
        <a-sphere radius="0.01" color="#00ff44" position="-0.28 1.5 0.47"
                  material="emissive: #00ff44; emissiveIntensity: 1"
                  animation="property: material.emissiveIntensity; from: 0.4; to: 1.5; dur: 650; dir: alternate; loop: true"></a-sphere>
      </a-entity>

      <!-- Cooling vent on floor -->
      <a-entity position="1 0.02 -6">
        <a-box width="0.6" height="0.02" depth="0.6" color="#222233" metalness="0.7"></a-box>
        <!-- Grate lines -->
        <a-plane width="0.5" height="0.01" color="#111122" position="0 0.02 -0.15" rotation="-90 0 0"></a-plane>
        <a-plane width="0.5" height="0.01" color="#111122" position="0 0.02 0" rotation="-90 0 0"></a-plane>
        <a-plane width="0.5" height="0.01" color="#111122" position="0 0.02 0.15" rotation="-90 0 0"></a-plane>
      </a-entity>

      <!-- Access card reader by door -->
      <a-entity position="7.9 1.3 0.5" rotation="0 -90 0">
        <a-box width="0.12" height="0.18" depth="0.03" color="#222233" metalness="0.4"></a-box>
        <a-sphere radius="0.015" color="#ff0000" position="0 0.05 0.02"
                  material="emissive: #ff0000; emissiveIntensity: 0.8"></a-sphere>
        <a-text value="SCAN\nBADGE" position="0 -0.03 0.02" align="center" width="0.12" color="#888899"></a-text>
      </a-entity>

      <!-- UPS battery unit -->
      <a-entity position="6.5 0 -7">
        <a-box width="0.6" height="1.2" depth="0.5" color="#1a1a2a" position="0 0.6 0" metalness="0.5"></a-box>
        <a-text value="UPS" position="0 0.8 0.26" align="center" width="0.4" color="#448844"></a-text>
        <a-sphere radius="0.012" color="#00ff00" position="0.2 1.0 0.26"
                  material="emissive: #00ff00; emissiveIntensity: 1"></a-sphere>
      </a-entity>

      <!-- Fire suppression sign -->
      <a-entity position="3 2.8 -7.95">
        <a-plane width="0.7" height="0.35" color="#cc0000"></a-plane>
        <a-text value="FM-200 FIRE SUPPRESSION" position="0 0 0.01" align="center"
                width="0.6" color="#ffffff" font="kelsonsans"></a-text>
      </a-entity>
    </a-entity>
  `;
}

// ---------------------------------------------------------------------------
// WAREHOUSE — large logistics hub
// ---------------------------------------------------------------------------
export function buildWarehouseScene() {
  return `
    <a-entity id="warehouse-env">
      <a-entity environment="preset: goaland; skyType: gradient; skyColor: #b0b0b0; horizonColor: #808888; lighting: none; fog: 0.7"></a-entity>

      <!-- Lighting — industrial overhead -->
      <a-entity light="type: ambient; color: #ccccbb; intensity: 0.35"></a-entity>
      <a-entity light="type: spot; color: #ffffee; intensity: 2; angle: 60; penumbra: 0.4; decay: 1"
                position="0 8 -4" rotation="-90 0 0"></a-entity>
      <a-entity light="type: point; color: #ffeecc; intensity: 0.7; distance: 10"
                position="-4 7 -5"></a-entity>
      <a-entity light="type: point; color: #ffeecc; intensity: 0.7; distance: 10"
                position="4 7 -5"></a-entity>
      <a-entity light="type: point; color: #ffddaa; intensity: 0.5; distance: 6"
                position="0 3 -2"></a-entity>

      <!-- Concrete warehouse floor -->
      <a-plane position="0 0.01 0" rotation="-90 0 0" width="24" height="24"
               color="#7a7a72" metalness="0.15" roughness="0.8"></a-plane>
      <!-- Floor lane markings -->
      <a-plane position="0 0.02 -4" rotation="-90 0 0" width="20" height="0.12" color="#ddcc00"></a-plane>
      <a-plane position="0 0.02 -8" rotation="-90 0 0" width="20" height="0.12" color="#ddcc00"></a-plane>
      <a-plane position="-5 0.02 -6" rotation="-90 90 0" width="8" height="0.12" color="#ddcc00"></a-plane>
      <a-plane position="5 0.02 -6" rotation="-90 90 0" width="8" height="0.12" color="#ddcc00"></a-plane>
      <!-- Pedestrian crossing stripes -->
      <a-plane position="-1 0.025 -4" rotation="-90 0 0" width="0.3" height="0.8" color="#ffffff"></a-plane>
      <a-plane position="-0.5 0.025 -4" rotation="-90 0 0" width="0.3" height="0.8" color="#ffffff"></a-plane>
      <a-plane position="0 0.025 -4" rotation="-90 0 0" width="0.3" height="0.8" color="#ffffff"></a-plane>
      <a-plane position="0.5 0.025 -4" rotation="-90 0 0" width="0.3" height="0.8" color="#ffffff"></a-plane>
      <a-plane position="1 0.025 -4" rotation="-90 0 0" width="0.3" height="0.8" color="#ffffff"></a-plane>

      <!-- Corrugated metal walls -->
      <a-plane position="0 4.5 -12" width="24" height="9" color="#8a8a82"
               metalness="0.6" roughness="0.5"></a-plane>
      <a-plane position="-12 4.5 0" rotation="0 90 0" width="24" height="9" color="#888880"
               metalness="0.6" roughness="0.5"></a-plane>
      <a-plane position="12 4.5 0" rotation="0 -90 0" width="24" height="9" color="#888880"
               metalness="0.6" roughness="0.5"></a-plane>

      <!-- High ceiling with trusses -->
      <a-plane position="0 9 -6" rotation="90 0 0" width="24" height="18" color="#666660"></a-plane>
      <!-- Steel trusses -->
      <a-box position="-6 8.5 -6" width="0.15" height="0.4" depth="18" color="#555550" metalness="0.7"></a-box>
      <a-box position="0 8.5 -6" width="0.15" height="0.4" depth="18" color="#555550" metalness="0.7"></a-box>
      <a-box position="6 8.5 -6" width="0.15" height="0.4" depth="18" color="#555550" metalness="0.7"></a-box>

      <!-- High-bay light fixtures -->
      <a-entity position="-3 8.2 -4">
        <a-cylinder radius="0.2" height="0.15" color="#ddddcc" material="emissive: #ffeecc; emissiveIntensity: 0.5"></a-cylinder>
      </a-entity>
      <a-entity position="3 8.2 -4">
        <a-cylinder radius="0.2" height="0.15" color="#ddddcc" material="emissive: #ffeecc; emissiveIntensity: 0.5"></a-cylinder>
      </a-entity>
      <a-entity position="0 8.2 -8">
        <a-cylinder radius="0.2" height="0.15" color="#ddddcc" material="emissive: #ffeecc; emissiveIntensity: 0.4"></a-cylinder>
      </a-entity>

      <!-- ============================================ -->
      <!-- DISPATCH BOARD (interactive)                 -->
      <!-- ============================================ -->
      <a-entity id="spatial-dispatch-board" class="interactive-target" data-target="dispatch-board"
                position="2.5 0 -2">
        <!-- Whiteboard stand -->
        <a-cylinder radius="0.03" height="2.2" color="#666666" position="-0.6 1.1 -0.15" metalness="0.6"></a-cylinder>
        <a-cylinder radius="0.03" height="2.2" color="#666666" position="0.6 1.1 -0.15" metalness="0.6"></a-cylinder>
        <!-- Board -->
        <a-box width="1.5" height="1.2" depth="0.04" color="#f0f0e8" position="0 1.6 0"></a-box>
        <!-- Board frame -->
        <a-box width="1.55" height="0.03" depth="0.05" color="#444444" position="0 2.2 0" metalness="0.5"></a-box>
        <a-box width="1.55" height="0.03" depth="0.05" color="#444444" position="0 1.0 0" metalness="0.5"></a-box>
        <!-- Shipping schedule header -->
        <a-text value="DISPATCH SCHEDULE" position="0 2.0 0.025" align="center"
                width="1" color="#cc0000" font="kelsonsans"></a-text>
        <!-- Schedule rows -->
        <a-text value="BAY 1: Truck 4401 — 08:00 LOADED\nBAY 2: Truck 2287 — 09:30 STAGING\nBAY 3: Truck 6610 — 10:15 PENDING\nBAY 4: Truck 1198 — 11:00 DELAYED"
                position="0 1.55 0.025" align="center" width="0.9" color="#333333"></a-text>
        <!-- Colored magnets -->
        <a-sphere radius="0.02" color="#00cc00" position="-0.55 1.82 0.025"></a-sphere>
        <a-sphere radius="0.02" color="#ffaa00" position="-0.55 1.72 0.025"></a-sphere>
        <a-sphere radius="0.02" color="#cc0000" position="-0.55 1.52 0.025"></a-sphere>
        <!-- Marker tray -->
        <a-box width="0.5" height="0.025" depth="0.06" color="#888888" position="0 0.97 0.04" metalness="0.5"></a-box>
        <a-cylinder radius="0.012" height="0.1" color="#0000cc" position="-0.1 1.0 0.04" rotation="0 0 85"></a-cylinder>
        <a-cylinder radius="0.012" height="0.1" color="#cc0000" position="0.05 1.0 0.04" rotation="0 0 85"></a-cylinder>
        <a-text value="Optimize loading" position="0 2.6 0" align="center" width="2"
                color="#ffcc00" visible="false" class="hover-label"></a-text>
      </a-entity>

      <!-- ============================================ -->
      <!-- FORKLIFT with PALLET (interactive)           -->
      <!-- ============================================ -->
      <a-entity id="spatial-forklift" class="interactive-target" data-target="forklift"
                position="-3 0 -6" rotation="0 30 0">
        <!-- Forklift body -->
        <a-box width="1.2" height="0.5" depth="2" color="#ddaa00" position="0 0.6 0"
               metalness="0.4" roughness="0.5"></a-box>
        <!-- Cab / overhead guard -->
        <a-entity position="0 1.2 0.3">
          <a-cylinder radius="0.04" height="1" color="#333333" position="-0.5 0.5 -0.5" metalness="0.7"></a-cylinder>
          <a-cylinder radius="0.04" height="1" color="#333333" position="0.5 0.5 -0.5" metalness="0.7"></a-cylinder>
          <a-cylinder radius="0.04" height="1" color="#333333" position="-0.5 0.5 0.5" metalness="0.7"></a-cylinder>
          <a-cylinder radius="0.04" height="1" color="#333333" position="0.5 0.5 0.5" metalness="0.7"></a-cylinder>
          <a-box width="1.1" height="0.06" depth="1.1" color="#333333" position="0 1 0" metalness="0.6"></a-box>
        </a-entity>
        <!-- Seat -->
        <a-box width="0.5" height="0.1" depth="0.5" color="#222222" position="0 0.9 0.3"></a-box>
        <a-box width="0.5" height="0.4" depth="0.06" color="#222222" position="0 1.15 0.05"></a-box>
        <!-- Steering wheel -->
        <a-torus radius="0.12" radius-tubular="0.015" color="#222222" position="0 1.2 0.7"
                 rotation="-60 0 0" metalness="0.5"></a-torus>
        <!-- Mast -->
        <a-box width="0.08" height="2.5" depth="0.08" color="#333333" position="-0.3 1.25 -0.95" metalness="0.7"></a-box>
        <a-box width="0.08" height="2.5" depth="0.08" color="#333333" position="0.3 1.25 -0.95" metalness="0.7"></a-box>
        <!-- Forks -->
        <a-box width="0.1" height="0.05" depth="1.2" color="#555555" position="-0.2 0.12 -1.5" metalness="0.8"></a-box>
        <a-box width="0.1" height="0.05" depth="1.2" color="#555555" position="0.2 0.12 -1.5" metalness="0.8"></a-box>
        <!-- Pallet on forks -->
        <a-box width="1" height="0.12" depth="1" color="#8B7355" position="0 0.2 -1.8"></a-box>
        <!-- Boxes stacked on pallet -->
        <a-box width="0.4" height="0.35" depth="0.4" color="#bb8844" position="-0.2 0.45 -1.8"></a-box>
        <a-box width="0.4" height="0.35" depth="0.4" color="#aa7733" position="0.2 0.45 -1.8"></a-box>
        <a-box width="0.35" height="0.3" depth="0.35" color="#bb8844" position="0 0.78 -1.8"></a-box>
        <!-- Wheels -->
        <a-cylinder radius="0.15" height="0.12" color="#222222" position="-0.5 0.15 0.6" rotation="0 0 90"></a-cylinder>
        <a-cylinder radius="0.15" height="0.12" color="#222222" position="0.5 0.15 0.6" rotation="0 0 90"></a-cylinder>
        <a-cylinder radius="0.1" height="0.1" color="#222222" position="-0.3 0.1 -0.7" rotation="0 0 90"></a-cylinder>
        <a-cylinder radius="0.1" height="0.1" color="#222222" position="0.3 0.1 -0.7" rotation="0 0 90"></a-cylinder>
        <!-- Warning light -->
        <a-sphere radius="0.06" color="#ff8800" position="0 2.35 0.3"
                  material="emissive: #ff6600; emissiveIntensity: 0.8"
                  animation="property: material.emissiveIntensity; from: 0.3; to: 1.5; dur: 400; dir: alternate; loop: true"></a-sphere>
        <a-text value="Drive the forklift" position="0 2.8 0" align="center" width="2"
                color="#ffcc00" visible="false" class="hover-label"></a-text>
      </a-entity>

      <!-- ============================================ -->
      <!-- BRIEFING PODIUM (interactive)                -->
      <!-- ============================================ -->
      <a-entity id="spatial-podium" class="interactive-target" data-target="podium"
                position="0 0 -9">
        <!-- Podium / lectern -->
        <a-box width="0.7" height="1.1" depth="0.5" color="#5a4a3a" position="0 0.55 0"
               metalness="0.2" roughness="0.8"></a-box>
        <!-- Slanted reading surface -->
        <a-box width="0.65" height="0.03" depth="0.35" color="#6a5a4a" position="0 1.15 0.05"
               rotation="-15 0 0"></a-box>
        <!-- Notes on podium -->
        <a-plane width="0.3" height="0.4" color="#f5f5e0" position="0 1.18 0.08"
                 rotation="-15 0 0"></a-plane>
        <a-text value="SHIFT BRIEFING\n- Safety topic\n- Load priorities\n- Zone assignments"
                position="0 1.2 0.1" rotation="-15 0 0" align="center" width="0.3" color="#333333"></a-text>
        <!-- Workers gathered (abstract figures) -->
        <a-entity position="-1.2 0 1.5">
          <a-cylinder radius="0.15" height="0.9" color="#3366aa" position="0 0.65 0"></a-cylinder>
          <a-sphere radius="0.12" color="#e0c8a0" position="0 1.3 0"></a-sphere>
          <a-sphere radius="0.14" color="#ff8800" position="0 1.42 0" theta-start="0" theta-length="120"></a-sphere>
        </a-entity>
        <a-entity position="0 0 2">
          <a-cylinder radius="0.15" height="0.9" color="#446633" position="0 0.65 0"></a-cylinder>
          <a-sphere radius="0.12" color="#d4a878" position="0 1.3 0"></a-sphere>
          <a-sphere radius="0.14" color="#ffcc00" position="0 1.42 0" theta-start="0" theta-length="120"></a-sphere>
        </a-entity>
        <a-entity position="1.2 0 1.5">
          <a-cylinder radius="0.15" height="0.9" color="#663344" position="0 0.65 0"></a-cylinder>
          <a-sphere radius="0.12" color="#c8b890" position="0 1.3 0"></a-sphere>
          <a-sphere radius="0.14" color="#ffffff" position="0 1.42 0" theta-start="0" theta-length="120"></a-sphere>
        </a-entity>
        <a-entity position="-0.6 0 2.5">
          <a-cylinder radius="0.15" height="0.9" color="#aa6633" position="0 0.65 0"></a-cylinder>
          <a-sphere radius="0.12" color="#e8c8a0" position="0 1.3 0"></a-sphere>
          <a-sphere radius="0.14" color="#ff8800" position="0 1.42 0" theta-start="0" theta-length="120"></a-sphere>
        </a-entity>
        <a-entity position="0.6 0 2.5">
          <a-cylinder radius="0.15" height="0.9" color="#334466" position="0 0.65 0"></a-cylinder>
          <a-sphere radius="0.12" color="#d0b888" position="0 1.3 0"></a-sphere>
          <a-sphere radius="0.14" color="#ffcc00" position="0 1.42 0" theta-start="0" theta-length="120"></a-sphere>
        </a-entity>
        <a-text value="Lead the briefing" position="0 1.8 0" align="center" width="2"
                color="#ffcc00" visible="false" class="hover-label"></a-text>
      </a-entity>

      <!-- ============================================ -->
      <!-- ENVIRONMENTAL DETAIL                         -->
      <!-- ============================================ -->

      <!-- Tall shelving rack left -->
      <a-entity position="-8 0 -6">
        <!-- Uprights -->
        <a-cylinder radius="0.04" height="6" color="#4466aa" position="-0.6 3 -0.4" metalness="0.6"></a-cylinder>
        <a-cylinder radius="0.04" height="6" color="#4466aa" position="0.6 3 -0.4" metalness="0.6"></a-cylinder>
        <a-cylinder radius="0.04" height="6" color="#4466aa" position="-0.6 3 0.4" metalness="0.6"></a-cylinder>
        <a-cylinder radius="0.04" height="6" color="#4466aa" position="0.6 3 0.4" metalness="0.6"></a-cylinder>
        <!-- Shelf beams -->
        <a-box width="1.3" height="0.04" depth="0.9" color="#5577bb" position="0 1.2 0" metalness="0.5"></a-box>
        <a-box width="1.3" height="0.04" depth="0.9" color="#5577bb" position="0 2.5 0" metalness="0.5"></a-box>
        <a-box width="1.3" height="0.04" depth="0.9" color="#5577bb" position="0 3.8 0" metalness="0.5"></a-box>
        <a-box width="1.3" height="0.04" depth="0.9" color="#5577bb" position="0 5.1 0" metalness="0.5"></a-box>
        <!-- Boxes on shelves -->
        <a-box width="0.4" height="0.35" depth="0.35" color="#bb8844" position="-0.3 1.42 0" ></a-box>
        <a-box width="0.4" height="0.35" depth="0.35" color="#aa7733" position="0.2 1.42 0.1"></a-box>
        <a-box width="0.5" height="0.4" depth="0.4" color="#997744" position="0 2.72 0"></a-box>
        <a-box width="0.35" height="0.3" depth="0.3" color="#bb8844" position="-0.3 4.0 -0.1"></a-box>
        <a-box width="0.45" height="0.35" depth="0.4" color="#aa7733" position="0.2 4.0 0"></a-box>
        <a-box width="0.4" height="0.3" depth="0.35" color="#997744" position="0 5.28 0"></a-box>
      </a-entity>

      <!-- Tall shelving rack right -->
      <a-entity position="8 0 -6">
        <a-cylinder radius="0.04" height="6" color="#4466aa" position="-0.6 3 -0.4" metalness="0.6"></a-cylinder>
        <a-cylinder radius="0.04" height="6" color="#4466aa" position="0.6 3 -0.4" metalness="0.6"></a-cylinder>
        <a-cylinder radius="0.04" height="6" color="#4466aa" position="-0.6 3 0.4" metalness="0.6"></a-cylinder>
        <a-cylinder radius="0.04" height="6" color="#4466aa" position="0.6 3 0.4" metalness="0.6"></a-cylinder>
        <a-box width="1.3" height="0.04" depth="0.9" color="#5577bb" position="0 1.2 0" metalness="0.5"></a-box>
        <a-box width="1.3" height="0.04" depth="0.9" color="#5577bb" position="0 2.5 0" metalness="0.5"></a-box>
        <a-box width="1.3" height="0.04" depth="0.9" color="#5577bb" position="0 3.8 0" metalness="0.5"></a-box>
        <a-box width="1.3" height="0.04" depth="0.9" color="#5577bb" position="0 5.1 0" metalness="0.5"></a-box>
        <a-box width="0.45" height="0.35" depth="0.4" color="#bb8844" position="0 1.42 0"></a-box>
        <a-box width="0.4" height="0.4" depth="0.35" color="#997744" position="-0.2 2.72 0.1"></a-box>
        <a-box width="0.4" height="0.35" depth="0.35" color="#aa7733" position="0.2 2.72 -0.1"></a-box>
        <a-box width="0.5" height="0.4" depth="0.4" color="#bb8844" position="0 4.0 0"></a-box>
      </a-entity>

      <!-- Dock door (back wall, right) -->
      <a-entity position="6 0 -11.9">
        <a-box width="3" height="3.5" depth="0.15" color="#555550" position="0 1.75 0" metalness="0.5"></a-box>
        <!-- Horizontal slats -->
        <a-box width="2.8" height="0.08" depth="0.05" color="#666660" position="0 0.5 0.1" metalness="0.6"></a-box>
        <a-box width="2.8" height="0.08" depth="0.05" color="#666660" position="0 1.0 0.1" metalness="0.6"></a-box>
        <a-box width="2.8" height="0.08" depth="0.05" color="#666660" position="0 1.5 0.1" metalness="0.6"></a-box>
        <a-box width="2.8" height="0.08" depth="0.05" color="#666660" position="0 2.0 0.1" metalness="0.6"></a-box>
        <a-box width="2.8" height="0.08" depth="0.05" color="#666660" position="0 2.5 0.1" metalness="0.6"></a-box>
        <a-box width="2.8" height="0.08" depth="0.05" color="#666660" position="0 3.0 0.1" metalness="0.6"></a-box>
        <a-text value="BAY 3" position="0 3.8 0.1" align="center" width="2" color="#ffffff" font="kelsonsans"></a-text>
      </a-entity>

      <!-- Dock door (back wall, left) -->
      <a-entity position="-6 0 -11.9">
        <a-box width="3" height="3.5" depth="0.15" color="#555550" position="0 1.75 0" metalness="0.5"></a-box>
        <a-box width="2.8" height="0.08" depth="0.05" color="#666660" position="0 0.5 0.1" metalness="0.6"></a-box>
        <a-box width="2.8" height="0.08" depth="0.05" color="#666660" position="0 1.0 0.1" metalness="0.6"></a-box>
        <a-box width="2.8" height="0.08" depth="0.05" color="#666660" position="0 1.5 0.1" metalness="0.6"></a-box>
        <a-box width="2.8" height="0.08" depth="0.05" color="#666660" position="0 2.0 0.1" metalness="0.6"></a-box>
        <a-box width="2.8" height="0.08" depth="0.05" color="#666660" position="0 2.5 0.1" metalness="0.6"></a-box>
        <a-box width="2.8" height="0.08" depth="0.05" color="#666660" position="0 3.0 0.1" metalness="0.6"></a-box>
        <a-text value="BAY 1" position="0 3.8 0.1" align="center" width="2" color="#ffffff" font="kelsonsans"></a-text>
      </a-entity>

      <!-- Pallet jack on floor -->
      <a-entity position="3 0 -6.5" rotation="0 -15 0">
        <a-box width="0.6" height="0.08" depth="1.4" color="#dd8800" position="0 0.08 0" metalness="0.5"></a-box>
        <!-- Forks -->
        <a-box width="0.08" height="0.04" depth="0.8" color="#dd8800" position="-0.15 0.03 -0.9" metalness="0.6"></a-box>
        <a-box width="0.08" height="0.04" depth="0.8" color="#dd8800" position="0.15 0.03 -0.9" metalness="0.6"></a-box>
        <!-- Handle -->
        <a-cylinder radius="0.02" height="1" color="#444444" position="0 0.5 0.65" rotation="-30 0 0" metalness="0.6"></a-cylinder>
      </a-entity>

      <!-- Safety signs on wall -->
      <a-entity position="0 3.5 -11.9">
        <a-plane width="0.9" height="0.6" color="#ddcc00"></a-plane>
        <a-text value="FORKLIFT\nTRAFFIC AREA" position="0 0 0.01" align="center"
                width="0.7" color="#000000" font="kelsonsans"></a-text>
      </a-entity>

      <!-- Shrink-wrapped pallet on floor -->
      <a-entity position="6 0 -3">
        <a-box width="1" height="0.12" depth="1" color="#8B7355" position="0 0.06 0"></a-box>
        <a-box width="0.9" height="0.8" depth="0.9" color="#ccddee" position="0 0.52 0" opacity="0.6"></a-box>
      </a-entity>

      <!-- Fire extinguisher on wall -->
      <a-entity position="-11.9 1 -2" rotation="0 90 0">
        <a-cylinder radius="0.07" height="0.45" color="#cc0000" metalness="0.6"></a-cylinder>
        <a-cylinder radius="0.02" height="0.08" color="#222" position="0 0.25 0" metalness="0.8"></a-cylinder>
      </a-entity>

      <!-- EXIT sign above door area -->
      <a-entity position="11 4.5 -0.5" rotation="0 -90 0">
        <a-plane width="0.6" height="0.25" color="#006600"
                 material="emissive: #004400; emissiveIntensity: 0.5"></a-plane>
        <a-text value="EXIT" position="0 0 0.01" align="center" width="0.5"
                color="#ffffff" font="kelsonsans"></a-text>
      </a-entity>
    </a-entity>
  `;
}

// ---------------------------------------------------------------------------
// OUTDOOR JOB SITE — golden-hour construction
// ---------------------------------------------------------------------------
export function buildOutdoorSiteScene() {
  return `
    <a-entity id="outdoor-env">
      <a-entity environment="preset: goldmine; skyType: gradient; skyColor: #ff8844; horizonColor: #cc6622; lighting: none; fog: 0.6"></a-entity>

      <!-- Golden hour lighting -->
      <a-entity light="type: ambient; color: #ffaa66; intensity: 0.4"></a-entity>
      <a-entity light="type: directional; color: #ff9944; intensity: 1.2" position="-3 4 2"></a-entity>
      <a-entity light="type: point; color: #ffcc88; intensity: 0.6; distance: 8"
                position="0 3 -2"></a-entity>
      <a-entity light="type: point; color: #ffbb77; intensity: 0.4; distance: 6"
                position="4 2 -5"></a-entity>

      <!-- Dirt ground -->
      <a-plane position="0 0.01 0" rotation="-90 0 0" width="30" height="30"
               color="#8a7a5a" metalness="0.05" roughness="0.95"></a-plane>
      <!-- Tire tracks / ruts -->
      <a-plane position="-2 0.015 -4" rotation="-90 10 0" width="1" height="12" color="#7a6a4a"
               metalness="0.02" roughness="0.98"></a-plane>
      <a-plane position="2 0.015 -4" rotation="-90 -5 0" width="1" height="12" color="#7a6a4a"
               metalness="0.02" roughness="0.98"></a-plane>

      <!-- Gravel area -->
      <a-plane position="5 0.02 -2" rotation="-90 0 0" width="6" height="6"
               color="#9a9080" metalness="0.1" roughness="0.9"></a-plane>

      <!-- ============================================ -->
      <!-- SURVEYOR'S LEVEL on TRIPOD (interactive)     -->
      <!-- ============================================ -->
      <a-entity id="spatial-level" class="interactive-target" data-target="level"
                position="-3 0 -3">
        <!-- Tripod legs -->
        <a-cylinder radius="0.02" height="1.4" color="#cc8800" position="-0.35 0.65 -0.2"
                    rotation="8 0 -12" metalness="0.3" roughness="0.7"></a-cylinder>
        <a-cylinder radius="0.02" height="1.4" color="#cc8800" position="0.35 0.65 -0.2"
                    rotation="8 0 12" metalness="0.3" roughness="0.7"></a-cylinder>
        <a-cylinder radius="0.02" height="1.4" color="#cc8800" position="0 0.65 0.35"
                    rotation="-10 0 0" metalness="0.3" roughness="0.7"></a-cylinder>
        <!-- Tripod head plate -->
        <a-cylinder radius="0.08" height="0.03" color="#555555" position="0 1.25 0"
                    metalness="0.7" roughness="0.3"></a-cylinder>
        <!-- Level instrument body -->
        <a-box width="0.2" height="0.12" depth="0.12" color="#dddd00" position="0 1.35 0"
               metalness="0.4" roughness="0.5"></a-box>
        <!-- Telescope / scope -->
        <a-cylinder radius="0.025" height="0.25" color="#888888" position="0 1.38 0"
                    rotation="0 0 90" metalness="0.8" roughness="0.2"></a-cylinder>
        <!-- Eyepiece -->
        <a-cylinder radius="0.02" height="0.04" color="#333333" position="0.14 1.38 0"
                    rotation="0 0 90" metalness="0.7"></a-cylinder>
        <!-- Leveling screws -->
        <a-cylinder radius="0.012" height="0.04" color="#aaaaaa" position="-0.06 1.27 -0.06"
                    metalness="0.8"></a-cylinder>
        <a-cylinder radius="0.012" height="0.04" color="#aaaaaa" position="0.06 1.27 -0.06"
                    metalness="0.8"></a-cylinder>
        <a-cylinder radius="0.012" height="0.04" color="#aaaaaa" position="0 1.27 0.06"
                    metalness="0.8"></a-cylinder>
        <!-- Bubble level on top -->
        <a-cylinder radius="0.02" height="0.008" color="#88cc88" position="0 1.42 0"
                    material="opacity: 0.7"></a-cylinder>
        <a-text value="Set up the level" position="0 1.9 0" align="center" width="2"
                color="#ffcc00" visible="false" class="hover-label"></a-text>
      </a-entity>

      <!-- ============================================ -->
      <!-- BLUEPRINTS on TRUCK TAILGATE (interactive)   -->
      <!-- ============================================ -->
      <a-entity id="spatial-blueprints" class="interactive-target" data-target="blueprints"
                position="4 0 -3">
        <!-- Pickup truck (simplified) -->
        <!-- Truck bed -->
        <a-box width="2" height="0.6" depth="1.8" color="#445566" position="0 0.5 0"
               metalness="0.5" roughness="0.4"></a-box>
        <!-- Bed walls -->
        <a-box width="2" height="0.4" depth="0.06" color="#4a5a6a" position="0 1.0 -0.87"
               metalness="0.5"></a-box>
        <a-box width="0.06" height="0.4" depth="1.8" color="#4a5a6a" position="-0.97 1.0 0"
               metalness="0.5"></a-box>
        <a-box width="0.06" height="0.4" depth="1.8" color="#4a5a6a" position="0.97 1.0 0"
               metalness="0.5"></a-box>
        <!-- Tailgate (open / dropped flat) -->
        <a-box width="2" height="0.06" depth="0.5" color="#4a5a6a" position="0 0.82 1.15"
               metalness="0.5" roughness="0.4"></a-box>
        <!-- Cab silhouette -->
        <a-box width="1.9" height="0.9" depth="1.2" color="#3a4a5a" position="0 1.15 -1.4"
               metalness="0.5" roughness="0.4"></a-box>
        <!-- Windshield -->
        <a-plane width="1.6" height="0.6" color="#445588" position="0 1.35 -0.78"
                 rotation="12 0 0" material="opacity: 0.5; metalness: 0.3"></a-plane>
        <!-- Wheels -->
        <a-cylinder radius="0.3" height="0.2" color="#222222" position="-1 0.3 -1.2" rotation="0 0 90"></a-cylinder>
        <a-cylinder radius="0.3" height="0.2" color="#222222" position="1 0.3 -1.2" rotation="0 0 90"></a-cylinder>
        <a-cylinder radius="0.3" height="0.2" color="#222222" position="-1 0.3 0.4" rotation="0 0 90"></a-cylinder>
        <a-cylinder radius="0.3" height="0.2" color="#222222" position="1 0.3 0.4" rotation="0 0 90"></a-cylinder>
        <!-- Blueprints spread on tailgate -->
        <a-plane width="1.4" height="0.9" color="#d4e4ff" position="0 0.88 1.15"
                 rotation="-90 0 5"></a-plane>
        <!-- Blueprint drawing lines -->
        <a-plane width="0.8" height="0.002" color="#1a3a8a" position="-0.1 0.885 1.0"
                 rotation="-90 0 5"></a-plane>
        <a-plane width="0.002" height="0.5" color="#1a3a8a" position="0.3 0.885 1.15"
                 rotation="-90 0 5"></a-plane>
        <a-plane width="0.5" height="0.002" color="#1a3a8a" position="0.1 0.885 1.3"
                 rotation="-90 0 5"></a-plane>
        <a-text value="SITE PLAN — PHASE 2\nSCALE 1:200" position="0 0.89 1.4"
                rotation="-90 0 5" align="center" width="0.7" color="#1a3a6a"></a-text>
        <!-- Blueprint title block -->
        <a-plane width="0.3" height="0.2" color="#c0d0ee" position="0.5 0.886 1.35"
                 rotation="-90 0 5"></a-plane>
        <!-- Rolled-up blueprint tube on truck bed -->
        <a-cylinder radius="0.03" height="1" color="#d0d8e8" position="-0.6 0.85 -0.3"
                    rotation="0 25 90"></a-cylinder>
        <!-- Pencil on blueprints -->
        <a-cylinder radius="0.008" height="0.18" color="#ffcc00" position="-0.3 0.9 1.2"
                    rotation="-90 15 0"></a-cylinder>
        <a-text value="Study the blueprints" position="0 2.0 1" align="center" width="2"
                color="#ffcc00" visible="false" class="hover-label"></a-text>
      </a-entity>

      <!-- ============================================ -->
      <!-- CREW GATHERED (interactive)                  -->
      <!-- ============================================ -->
      <a-entity id="spatial-crew" class="interactive-target" data-target="crew"
                position="0 0 -7">
        <!-- Crew figures in a loose group -->
        <a-entity position="-0.8 0 0">
          <a-cylinder radius="0.18" height="1" color="#336699" position="0 0.7 0"></a-cylinder>
          <a-sphere radius="0.13" color="#e0c8a0" position="0 1.4 0"></a-sphere>
          <a-sphere radius="0.15" color="#ff8800" position="0 1.55 0" theta-start="0" theta-length="120"></a-sphere>
        </a-entity>
        <a-entity position="0.8 0 0.3">
          <a-cylinder radius="0.18" height="1" color="#996633" position="0 0.7 0"></a-cylinder>
          <a-sphere radius="0.13" color="#d4a878" position="0 1.4 0"></a-sphere>
          <a-sphere radius="0.15" color="#ffcc00" position="0 1.55 0" theta-start="0" theta-length="120"></a-sphere>
        </a-entity>
        <a-entity position="-0.2 0 0.8">
          <a-cylinder radius="0.18" height="1" color="#444466" position="0 0.7 0"></a-cylinder>
          <a-sphere radius="0.13" color="#c8b890" position="0 1.4 0"></a-sphere>
          <a-sphere radius="0.15" color="#ffffff" position="0 1.55 0" theta-start="0" theta-length="120"></a-sphere>
        </a-entity>
        <a-entity position="0.4 0 -0.5">
          <a-cylinder radius="0.18" height="1" color="#663344" position="0 0.7 0"></a-cylinder>
          <a-sphere radius="0.13" color="#e8c8a0" position="0 1.4 0"></a-sphere>
          <a-sphere radius="0.15" color="#ff8800" position="0 1.55 0" theta-start="0" theta-length="120"></a-sphere>
        </a-entity>
        <a-entity position="-1.2 0 -0.4">
          <a-cylinder radius="0.18" height="1" color="#668833" position="0 0.7 0"></a-cylinder>
          <a-sphere radius="0.13" color="#d0b888" position="0 1.4 0"></a-sphere>
          <a-sphere radius="0.15" color="#ddaa00" position="0 1.55 0" theta-start="0" theta-length="120"></a-sphere>
        </a-entity>
        <a-text value="Rally the crew" position="0 2.2 0" align="center" width="2"
                color="#ffcc00" visible="false" class="hover-label"></a-text>
      </a-entity>

      <!-- ============================================ -->
      <!-- ENVIRONMENTAL DETAIL                         -->
      <!-- ============================================ -->

      <!-- Safety cones -->
      <a-entity position="-1 0 -1">
        <a-cone radius-bottom="0.15" radius-top="0.02" height="0.5" color="#ff6600"
                position="0 0.25 0"></a-cone>
        <a-plane width="0.2" height="0.06" color="#ffffff" position="0 0.3 0.14" rotation="5 0 0"></a-plane>
      </a-entity>
      <a-entity position="1 0 -1">
        <a-cone radius-bottom="0.15" radius-top="0.02" height="0.5" color="#ff6600"
                position="0 0.25 0"></a-cone>
        <a-plane width="0.2" height="0.06" color="#ffffff" position="0 0.3 0.14" rotation="5 0 0"></a-plane>
      </a-entity>
      <a-entity position="0 0 0.5">
        <a-cone radius-bottom="0.15" radius-top="0.02" height="0.5" color="#ff6600"
                position="0 0.25 0"></a-cone>
        <a-plane width="0.2" height="0.06" color="#ffffff" position="0 0.3 0.14" rotation="5 0 0"></a-plane>
      </a-entity>

      <!-- Caution tape between cones -->
      <a-plane width="2.5" height="0.06" color="#ffcc00" position="0 0.42 -0.25"
               rotation="0 0 0"></a-plane>
      <a-text value="CAUTION" position="0 0.42 -0.22" align="center" width="1" color="#000000"
              font="kelsonsans"></a-text>

      <!-- Steel beams stacked on ground -->
      <a-entity position="-6 0 -5">
        <a-box width="4" height="0.2" depth="0.2" color="#777788" position="0 0.1 0" metalness="0.8" roughness="0.2"></a-box>
        <a-box width="4" height="0.2" depth="0.2" color="#777788" position="0 0.3 0" metalness="0.8" roughness="0.2"></a-box>
        <a-box width="4" height="0.2" depth="0.2" color="#777788" position="0 0.1 0.3" metalness="0.8" roughness="0.2"></a-box>
        <a-box width="4" height="0.2" depth="0.2" color="#777788" position="0 0.3 0.3" metalness="0.8" roughness="0.2"></a-box>
        <a-box width="4" height="0.2" depth="0.2" color="#777788" position="0 0.5 0.15" metalness="0.8" roughness="0.2"></a-box>
      </a-entity>

      <!-- Excavator silhouette in background -->
      <a-entity position="8 0 -10">
        <!-- Tracks -->
        <a-box width="3" height="0.5" depth="1" color="#3a3a2a" position="0 0.25 0" metalness="0.5"></a-box>
        <!-- Body / cab -->
        <a-box width="2" height="1.2" depth="1.5" color="#cc8800" position="0 1.1 0"
               metalness="0.4" roughness="0.5"></a-box>
        <!-- Cab window -->
        <a-plane width="0.8" height="0.6" color="#446688" position="0 1.4 0.76"
                 material="opacity: 0.5"></a-plane>
        <!-- Boom arm (simplified) -->
        <a-box width="0.2" height="2.5" depth="0.2" color="#cc8800" position="0.5 2.8 -0.3"
               rotation="0 0 25" metalness="0.4"></a-box>
        <!-- Stick -->
        <a-box width="0.15" height="2" depth="0.15" color="#cc8800" position="1.8 3.5 -0.3"
               rotation="0 0 60" metalness="0.4"></a-box>
        <!-- Bucket -->
        <a-box width="0.8" height="0.3" depth="0.4" color="#555544" position="2.8 2.6 -0.3"
               rotation="0 0 10" metalness="0.6"></a-box>
      </a-entity>

      <!-- Porta-potty -->
      <a-entity position="-8 0 -2">
        <a-box width="1.1" height="2.3" depth="1.1" color="#2266aa" position="0 1.15 0"
               metalness="0.2" roughness="0.7"></a-box>
        <!-- Door outline -->
        <a-box width="0.7" height="1.8" depth="0.04" color="#1a5588" position="0 1.0 0.55"></a-box>
        <!-- Ventilation slits at top -->
        <a-plane width="0.3" height="0.02" color="#114477" position="0 2.0 0.56"></a-plane>
        <a-plane width="0.3" height="0.02" color="#114477" position="0 2.1 0.56"></a-plane>
        <a-plane width="0.3" height="0.02" color="#114477" position="0 2.15 0.56"></a-plane>
      </a-entity>

      <!-- Hard hat rack (near entrance area) -->
      <a-entity position="2 0 1">
        <!-- Vertical post -->
        <a-cylinder radius="0.03" height="1.5" color="#555555" position="0 0.75 0" metalness="0.6"></a-cylinder>
        <!-- Base -->
        <a-cylinder radius="0.25" height="0.04" color="#555555" position="0 0.02 0" metalness="0.5"></a-cylinder>
        <!-- Pegs -->
        <a-cylinder radius="0.015" height="0.15" color="#666666" position="0.1 1.3 0" rotation="0 0 90" metalness="0.6"></a-cylinder>
        <a-cylinder radius="0.015" height="0.15" color="#666666" position="-0.1 1.3 0" rotation="0 0 -90" metalness="0.6"></a-cylinder>
        <a-cylinder radius="0.015" height="0.15" color="#666666" position="0 1.3 0.1" rotation="90 0 0" metalness="0.6"></a-cylinder>
        <!-- Hard hats hanging -->
        <a-sphere radius="0.13" color="#ffcc00" position="0.2 1.3 0" theta-start="0" theta-length="140"></a-sphere>
        <a-sphere radius="0.13" color="#ff8800" position="-0.2 1.3 0" theta-start="0" theta-length="140"></a-sphere>
        <a-sphere radius="0.13" color="#ffffff" position="0 1.3 0.2" theta-start="0" theta-length="140"></a-sphere>
      </a-entity>

      <!-- Water cooler / jug on stand -->
      <a-entity position="-5 0 0">
        <a-box width="0.5" height="0.8" depth="0.5" color="#888877" position="0 0.4 0"></a-box>
        <a-cylinder radius="0.15" height="0.4" color="#4488cc" position="0 1.0 0" opacity="0.6"></a-cylinder>
        <!-- Paper cup stack -->
        <a-cylinder radius="0.04" height="0.15" color="#ffffff" position="0.3 0.88 0"></a-cylinder>
      </a-entity>

      <!-- Construction sign -->
      <a-entity position="6 0 1">
        <a-cylinder radius="0.03" height="2" color="#888888" position="0 1 0" metalness="0.6"></a-cylinder>
        <a-plane width="0.8" height="0.6" color="#ff8800" position="0 2.2 0" rotation="0 0 45"></a-plane>
        <a-text value="SITE\nENTRY" position="0 2.2 0.02" rotation="0 0 45" align="center"
                width="0.5" color="#000000" font="kelsonsans"></a-text>
      </a-entity>

      <!-- Dirt mound from excavation -->
      <a-sphere radius="1.5" color="#7a6a4a" position="10 -0.5 -6"
                theta-start="0" theta-length="90" phi-length="360"></a-sphere>
    </a-entity>
  `;
}
