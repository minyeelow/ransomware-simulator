/**
 * Pre-Setup Screen Component
 * Prompts user to select or point to a local directory before Step 1 starts.
 * Opens native OS directory chooser (Finder / Explorer) without uploading files.
 */
import { sound } from '../sound.js';
import { openLocalDirectoryPicker } from '../folderPicker.js';

export function renderPreSetup(container, state, actions) {
  const currentPath = state.targetFolder?.path || '';

  container.innerHTML = `
    <div class="stage-view-container animate-fade-in" id="stage-pre-setup">
      <!-- Hidden Fallback Input for Browsers without showDirectoryPicker -->
      <input type="file" id="pre-setup-fallback-folder-input" webkitdirectory directory multiple style="display: none;" />

      <!-- Pre-Setup Hero Banner -->
      <div class="pre-setup-hero-card">
        <div class="pre-setup-badge font-mono">
          <span class="pulsing-dot yellow"></span> PRE-SETUP REQUIRED // AWAITING LOCAL DIRECTORY
        </div>
        <h1 class="pre-setup-headline">Select Simulation Target Directory</h1>
        <p class="pre-setup-subtext">
          Before initiating the ransomware kill chain, point the simulator to a local folder on your computer.
          <br>
          <strong class="text-cyan">Zero Upload Guarantee:</strong> Clicking "Open Folder Chooser" opens your native operating system file dialog (Finder / Explorer). No files are uploaded to any server — the simulator strictly takes the folder pointer.
        </p>

        <!-- Visual Pointer to Sidebar -->
        <div class="sidebar-pointer-callout font-mono">
          <div class="callout-arrow animate-bounce-left">👈</div>
          <div class="callout-content">
            <span class="callout-heading">EASY ACCESS:</span>
            <span>You can also click <strong>"Browse"</strong> in the <strong>TARGET FOLDER POINTER</strong> box in the left sidebar anytime.</span>
          </div>
        </div>
      </div>

      <!-- Main Directory Selector Card -->
      <div class="cyber-panel pre-setup-form-panel mt-3">
        <div class="panel-header">
          <div class="panel-title">
            <span class="panel-icon">📂</span>
            <span>Local Directory Specification</span>
          </div>
          <span class="panel-tag font-mono text-cyan">LOCAL POINTER</span>
        </div>

        <div class="panel-body">
          <div class="directory-selection-cta-grid">
            <!-- Primary Action: Open Native OS Folder Dialog -->
            <div class="os-picker-action-card">
              <div class="cta-icon-box">📁</div>
              <div class="cta-text-content">
                <div class="cta-title">Open Native Operating System Folder Picker</div>
                <div class="cta-desc text-muted text-xs">
                  Opens your computer's native file window (macOS Finder or Windows File Explorer) to select any local folder.
                </div>
              </div>
              <button type="button" class="action-btn-primary glow-cyan btn-large" id="btn-open-native-folder-picker">
                <svg class="btn-icon" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"/>
                </svg>
                <span>Browse Folder on My Computer</span>
              </button>
            </div>

            <!-- Secondary Option: Or Type / Paste Path Manually -->
            <div class="manual-path-box mt-3">
              <label class="text-xs font-mono text-muted block mb-1" for="main-target-path-input">
                OR TYPE / PASTE PATH MANUALLY:
              </label>
              <div class="pre-setup-input-row">
                <input 
                  type="text" 
                  id="main-target-path-input" 
                  class="cyber-input font-mono" 
                  placeholder="e.g. C:\\Users\\Target\\Documents\\Finance or /Users/name/data" 
                  value="${escapeHtml(currentPath)}"
                />
                <button type="button" class="btn-primary-confirm font-mono" id="btn-manual-confirm-path">
                  <span>Link &amp; Proceed ➔</span>
                </button>
              </div>
            </div>

            <!-- Quick Preset Suggestions -->
            <div class="preset-suggestions-section mt-3">
              <span class="text-xs font-mono text-muted block mb-1">QUICK TEST PRESETS:</span>
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
          </div>

          <!-- Kill Chain Lock Preview -->
          <div class="locked-killchain-preview mt-4">
            <div class="preview-header font-mono text-xs text-muted">
              <span>SIMULATION WILL AUTOMATICALLY PROCEED TO STEP 1 ONCE FOLDER IS POINTED:</span>
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
    return (str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  // 1. Native OS Folder Picker Button Click Handler
  const openPickerBtn = container.querySelector('#btn-open-native-folder-picker');
  const fallbackInput = container.querySelector('#pre-setup-fallback-folder-input');

  if (openPickerBtn) {
    openPickerBtn.addEventListener('click', async () => {
      sound.playClick();
      const result = await openLocalDirectoryPicker(fallbackInput);
      if (result && result.path) {
        sound.playStageChange();
        actions.onLinkFolder(result.path);
      }
    });
  }

  // 2. Manual text path input handler
  const pathInput = container.querySelector('#main-target-path-input');
  const confirmBtn = container.querySelector('#btn-manual-confirm-path');

  const handleManualLink = () => {
    const raw = pathInput ? pathInput.value.trim() : '';
    if (!raw) {
      if (pathInput) pathInput.focus();
      return;
    }
    sound.playClick();
    actions.onLinkFolder(raw);
  };

  if (confirmBtn) {
    confirmBtn.addEventListener('click', handleManualLink);
  }

  if (pathInput) {
    pathInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        handleManualLink();
      }
    });
  }

  // 3. Preset pills
  container.querySelectorAll('.preset-pill').forEach(btn => {
    btn.addEventListener('click', () => {
      const preset = btn.getAttribute('data-preset');
      if (pathInput) pathInput.value = preset;
      sound.playClick();
      actions.onLinkFolder(preset);
    });
  });
}
