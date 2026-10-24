/**
 * Pre-Setup Screen Component
 * Displayed before Step 1 (Initial Access).
 * Prompts the user to set a local directory pointer before the simulation can begin.
 * No files are uploaded; only the local path is referenced.
 */
import { sound } from '../sound.js';

export function renderPreSetup(container, state, actions) {
  const currentPath = state.targetFolder?.path || '';

  container.innerHTML = `
    <div class="stage-view-container animate-fade-in" id="stage-pre-setup">
      <!-- Pre-Setup Hero Banner -->
      <div class="pre-setup-hero-card">
        <div class="pre-setup-badge font-mono">
          <span class="pulsing-dot yellow"></span> PRE-SETUP REQUIRED // AWAITING DIRECTORY POINTER
        </div>
        <h1 class="pre-setup-headline">Target Directory Configuration</h1>
        <p class="pre-setup-subtext">
          Before initiating the ransomware kill chain, you must indicate a local directory path to ground the simulation.
          <br>
          <strong class="text-cyan">Privacy Guarantee:</strong> No files are uploaded or transmitted. The simulator only points to the path string to contextualize target file enumeration, encryption hashes, and incident telemetry.
        </p>

        <!-- Visual Pointer to the Left Sidebar -->
        <div class="sidebar-pointer-callout font-mono">
          <div class="callout-arrow animate-bounce-left">👈</div>
          <div class="callout-content">
            <span class="callout-heading">ACTION REQUIRED:</span>
            <span>Enter a local folder path in the <strong>TARGET FOLDER POINTER</strong> box in the left sidebar, or configure it below.</span>
          </div>
        </div>
      </div>

      <!-- Central Pointer Setup Workbench -->
      <div class="cyber-panel pre-setup-form-panel mt-3">
        <div class="panel-header">
          <div class="panel-title">
            <span class="panel-icon">📂</span>
            <span>Local Directory Pointer Specification</span>
          </div>
          <span class="panel-tag font-mono text-amber">STEP 0 GATEWAY</span>
        </div>

        <div class="panel-body">
          <form id="pre-setup-path-form" class="pre-setup-form" onsubmit="return false;">
            <label class="text-xs font-mono text-muted block mb-1" for="main-target-path-input">
              LOCAL FOLDER PATH (NO UPLOAD OCCURS):
            </label>

            <div class="pre-setup-input-row">
              <div class="input-with-icon">
                <span class="input-icon">📁</span>
                <input 
                  type="text" 
                  id="main-target-path-input" 
                  class="cyber-input font-mono" 
                  placeholder="e.g. C:\\Users\\Target\\Documents\\Finance or /Users/name/data" 
                  value="${escapeHtml(currentPath)}"
                  autofocus
                />
              </div>
              <button type="submit" class="action-btn-primary glow-cyan" id="btn-confirm-path-and-start">
                <svg class="btn-icon" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
                <span>Link Folder &amp; Proceed to Step 1</span>
              </button>
            </div>

            <!-- Quick Preset Suggestions -->
            <div class="preset-suggestions-section mt-3">
              <span class="text-xs font-mono text-muted block mb-1">OR CHOOSE A SAMPLE LOCAL PATH PRESET:</span>
              <div class="presets-grid">
                <button type="button" class="preset-pill font-mono" data-preset="C:\\Users\\Admin\\Documents\\ConfidentialData">
                  <span>💻</span> C:\\Users\\Admin\\Documents\\ConfidentialData
                </button>
                <button type="button" class="preset-pill font-mono" data-preset="/Users/finance/Documents/Audit_2026">
                  <span>🍎</span> /Users/finance/Documents/Audit_2026
                </button>
                <button type="button" class="preset-pill font-mono" data-preset="D:\\Corporate\\ERP_Database_Exports">
                  <span>🗄️</span> D:\\Corporate\\ERP_Database_Exports
                </button>
              </div>
            </div>
          </form>

          <!-- Kill Chain Lock Preview -->
          <div class="locked-killchain-preview mt-4">
            <div class="preview-header font-mono text-xs text-muted">
              <span>RANSOMWARE KILL CHAIN (UNLOCKED UPON LINKING DIRECTORY):</span>
            </div>
            <div class="preview-steps-strip font-mono text-xs">
              <div class="preview-step locked">
                <span class="lock-icon">🔒</span>
                <span>01. Initial Access</span>
              </div>
              <div class="preview-arrow">➔</div>
              <div class="preview-step locked">
                <span class="lock-icon">🔒</span>
                <span>02. Privilege Escalation</span>
              </div>
              <div class="preview-arrow">➔</div>
              <div class="preview-step locked">
                <span class="lock-icon">🔒</span>
                <span>03. Encryption Engine</span>
              </div>
              <div class="preview-arrow">➔</div>
              <div class="preview-step locked">
                <span class="lock-icon">🔒</span>
                <span>04. Ransom &amp; Extortion</span>
              </div>
              <div class="preview-arrow">➔</div>
              <div class="preview-step locked">
                <span class="lock-icon">🔒</span>
                <span>05. Decryption &amp; Recovery</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  function escapeHtml(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  // Handle Form Submission
  const form = container.querySelector('#pre-setup-path-form');
  const pathInput = container.querySelector('#main-target-path-input');

  const handleLink = (pathVal) => {
    const raw = (pathVal || '').trim();
    if (!raw) {
      if (pathInput) pathInput.focus();
      return;
    }
    sound.playClick();
    actions.onLinkFolder(raw);
  };

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      handleLink(pathInput ? pathInput.value : '');
    });
  }

  // Preset buttons
  container.querySelectorAll('.preset-pill').forEach(btn => {
    btn.addEventListener('click', () => {
      const preset = btn.getAttribute('data-preset');
      if (pathInput) pathInput.value = preset;
      handleLink(preset);
    });
  });
}
