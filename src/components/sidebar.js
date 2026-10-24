/**
 * Sidebar Component
 * Features:
 * 1. Target Folder Pointer (top left): allows users to indicate a local folder on their computer via directory picker or path input.
 * 2. Ransomware Steps Progress Indicator (non-clickable progress bar showing which step the user is seeing right now).
 * 3. Kill chain controls (Auto-Run, Reset, Sound toggle).
 */
import { STAGES } from '../state.js';
import { sound } from '../sound.js';

export function renderSidebar(container, state, actions) {
  const currentStage = STAGES.find(s => s.id === state.currentStageId) || STAGES[0];
  const currentStageIndex = STAGES.findIndex(s => s.id === state.currentStageId);
  const completedCount = Object.values(state.stagesCompleted).filter(Boolean).length;
  const progressPct = Math.round(((currentStageIndex + 1) / STAGES.length) * 100);

  const folder = state.targetFolder || {
    path: 'C:\\Users\\Victim\\Documents\\ConfidentialData',
    name: 'ConfidentialData',
    filesCount: 6,
    isCustom: false
  };

  container.innerHTML = `
    <aside class="sidebar-wrapper" id="sidebar" role="region" aria-label="Ransomware Simulator Navigation">
      <!-- App Header & Logo -->
      <div class="sidebar-brand">
        <div class="brand-icon-wrapper">
          <svg class="brand-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            <path d="m9 12 2 2 4-4"/>
          </svg>
          <span class="brand-pulse-dot"></span>
        </div>
        <div class="brand-text">
          <div class="brand-name">RANSOMSIM<span class="brand-tag">v2.4</span></div>
          <div class="brand-sub">Attack Lifecycle & Kill Chain</div>
        </div>
      </div>

      <!-- Target Folder Pointer (Replaces Target Node Status) -->
      <div class="folder-pointer-card" id="folder-pointer-card">
        <div class="folder-card-header">
          <div class="folder-header-title-group">
            <span class="folder-icon">📁</span>
            <span class="folder-card-title font-mono">TARGET FOLDER POINTER</span>
          </div>
          <span class="folder-status-badge ${folder.isCustom ? 'badge-custom' : 'badge-default'} font-mono">
            ${folder.isCustom ? 'LOCAL LINKED' : 'READY'}
          </span>
        </div>

        <div class="folder-pointer-body">
          <label class="folder-field-label font-mono text-xs text-muted" for="folder-path-input">
            Indicate Local Directory:
          </label>

          <!-- Path Input & Browse Button -->
          <div class="folder-input-group">
            <input 
              type="text" 
              class="folder-path-input font-mono" 
              id="folder-path-input" 
              value="${folder.path}" 
              placeholder="/path/to/local/folder" 
              title="Type or edit local directory path"
            />
            <button 
              type="button" 
              class="btn-browse-folder" 
              id="btn-trigger-folder-picker" 
              title="Browse and select a folder from your local computer"
            >
              <svg class="folder-browse-icon" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"/>
              </svg>
              <span>Browse</span>
            </button>
            <!-- Hidden Native Folder Picker -->
            <input 
              type="file" 
              id="native-folder-input" 
              webkitdirectory 
              directory 
              multiple 
              style="display: none;" 
            />
          </div>

          <!-- Folder Meta & Target Summary -->
          <div class="folder-meta-grid font-mono text-xs">
            <div class="folder-meta-row">
              <span class="folder-meta-label">Folder Name:</span>
              <span class="folder-meta-val text-highlight" id="folder-display-name">${folder.name}</span>
            </div>
            <div class="folder-meta-row">
              <span class="folder-meta-label">Files Targeted:</span>
              <span class="folder-meta-val text-cyan" id="folder-display-count">${folder.filesCount} files</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Kill Chain Stepper Section (Progress Bar & Non-Clickable Step Tracker) -->
      <div class="stepper-section">
        <div class="stepper-header">
          <span class="stepper-heading">RANSOMWARE PROGRESS</span>
          <span class="stepper-progress-text font-mono">STEP ${currentStageIndex + 1} OF 5</span>
        </div>

        <!-- Progress Track Bar -->
        <div class="killchain-progress-track" title="Kill chain execution stage: Step ${currentStageIndex + 1} of 5">
          <div class="killchain-progress-fill" style="width: ${progressPct}%;"></div>
        </div>

        <!-- The 5 Steps Progress List (Display only - not clickable tabs) -->
        <div class="steps-progress-list" id="steps-progress-list" aria-label="Ransomware lifecycle progress steps">
          ${STAGES.map((stage, idx) => {
            const isActive = stage.id === state.currentStageId;
            const isCompleted = state.stagesCompleted[stage.id];
            
            // Badge states
            let badgeText = 'UPCOMING';
            let badgeClass = 'badge-upcoming';
            if (isActive) {
              badgeText = 'NOW SHOWING';
              badgeClass = 'badge-active';
            } else if (isCompleted) {
              badgeText = 'COMPLETED';
              badgeClass = 'badge-done';
            }

            return `
              <div 
                class="step-progress-item ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}" 
                id="step-indicator-${stage.id}"
                data-stage-id="${stage.id}"
              >
                <!-- Number / Checkmark Badge -->
                <div class="step-num-bubble">
                  ${isCompleted ? `
                    <svg class="check-icon" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                    </svg>
                  ` : `0${stage.num}`}
                </div>

                <!-- Step Description Details -->
                <div class="step-meta">
                  <div class="step-meta-top">
                    <span class="step-name">${stage.title}</span>
                    <span class="step-badge ${badgeClass}">${badgeText}</span>
                  </div>
                  <div class="step-sub">${stage.subtitle}</div>
                  <div class="step-mitre font-mono">${stage.mitreId}</div>
                </div>

                <!-- Active pulse bar on the right if current -->
                ${isActive ? '<div class="step-active-pip"></div>' : ''}
              </div>
            `;
          }).join('')}
        </div>
      </div>

      <!-- Sidebar Controls Footer -->
      <div class="sidebar-footer">
        <div class="simulation-actions-grid">
          <button type="button" class="ctrl-btn primary-run-btn" id="btn-run-full-simulation" title="Run all 5 ransomware steps sequentially">
            <svg class="btn-icon" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd" />
            </svg>
            <span>Auto-Run Chain</span>
          </button>
          <button type="button" class="ctrl-btn reset-btn" id="btn-reset-simulation" title="Reset all stages and files back to clean state">
            <svg class="btn-icon" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clip-rule="evenodd" />
            </svg>
            <span>Reset</span>
          </button>
        </div>

        <!-- Mute Audio / Telemetry toggle bar -->
        <div class="sidebar-utility-bar">
          <button type="button" class="utility-toggle-btn" id="btn-toggle-sound" title="Toggle tactical sound effects">
            <span id="sound-icon-status">${sound.isMuted() ? '🔇 Muted' : '🔊 Cyber SFX On'}</span>
          </button>
          <div class="version-label font-mono">MITRE ATT&CK v14.1</div>
        </div>
      </div>
    </aside>
  `;

  // Folder pointer interaction handlers
  const folderInput = container.querySelector('#native-folder-input');
  const browseBtn = container.querySelector('#btn-trigger-folder-picker');
  const pathInput = container.querySelector('#folder-path-input');

  if (browseBtn && folderInput) {
    browseBtn.addEventListener('click', () => {
      sound.playClick();
      folderInput.click();
    });

    folderInput.addEventListener('change', (e) => {
      if (e.target.files && e.target.files.length > 0) {
        sound.playClick();
        if (actions.onFolderSelected) {
          actions.onFolderSelected(e.target.files);
        }
      }
    });
  }

  if (pathInput) {
    pathInput.addEventListener('change', (e) => {
      const rawPath = e.target.value.trim();
      if (rawPath && actions.onSetFolderPath) {
        actions.onSetFolderPath(rawPath);
      }
    });

    pathInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        pathInput.blur();
      }
    });
  }

  // Auto-Run and Reset Simulation buttons
  const runAllBtn = container.querySelector('#btn-run-full-simulation');
  if (runAllBtn) {
    runAllBtn.addEventListener('click', () => {
      sound.playClick();
      actions.onRunFullChain();
    });
  }

  const resetBtn = container.querySelector('#btn-reset-simulation');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      sound.playClick();
      actions.onReset();
    });
  }

  const soundBtn = container.querySelector('#btn-toggle-sound');
  if (soundBtn) {
    soundBtn.addEventListener('click', () => {
      sound.init();
      const isMuted = sound.toggleMute();
      const statusSpan = container.querySelector('#sound-icon-status');
      if (statusSpan) {
        statusSpan.textContent = isMuted ? '🔇 Muted' : '🔊 Cyber SFX On';
      }
    });
  }
}
