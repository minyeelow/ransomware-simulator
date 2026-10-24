/**
 * Sidebar Component
 * Features:
 * 1. Ransomware Steps Progress Indicator.
 * 2. Simulation controls (Reset, Sound toggle).
 */
import { STAGES } from '../state.js';
import { sound } from '../sound.js';

export function renderSidebar(container, state, actions) {
  const currentStageIndex = STAGES.findIndex(s => s.id === state.currentStageId);
  
  // Progress calculation
  const activeStepNum = currentStageIndex >= 0 ? currentStageIndex + 1 : 1;
  const progressPct = Math.round((activeStepNum / STAGES.length) * 100);
  const progressLabel = `STEP ${activeStepNum} OF 5`;

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
          <div class="brand-name">SMU Cybersecurity Ransomware Simulator</div>
          <div class="brand-sub">Attack Lifecycle &amp; Kill Chain</div>
        </div>
      </div>

      <!-- Kill Chain Stepper Section (Progress Bar & Non-Clickable Step Tracker) -->
      <div class="stepper-section">
        <div class="stepper-header">
          <span class="stepper-heading">RANSOMWARE PROGRESS</span>
          <span class="stepper-progress-text font-mono">${progressLabel}</span>
        </div>

        <!-- Progress Track Bar -->
        <div class="killchain-progress-track" title="Kill chain execution progress: ${progressPct}%">
          <div class="killchain-progress-fill" style="width: ${progressPct}%;"></div>
        </div>

        <!-- The 5 Steps Progress List (Display only - not clickable tabs) -->
        <div class="steps-progress-list" id="steps-progress-list" aria-label="Ransomware lifecycle progress steps">
          ${STAGES.map((stage) => {
            const isActive = stage.id === state.currentStageId;
            const isCompleted = state.stagesCompleted[stage.id];
            
            // Badge states
            let badgeText = 'LOCKED';
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
                <!-- Number / Checkmark Bubble -->
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

  // Reset Simulation button
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
