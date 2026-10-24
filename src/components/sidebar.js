/**
 * Sidebar Component
 * Renders the ransomware kill chain steps, status, host profile, and simulation controls.
 */
import { STAGES } from '../state.js';
import { sound } from '../sound.js';

export function renderSidebar(container, state, actions) {
  const currentStage = STAGES.find(s => s.id === state.currentStageId) || STAGES[0];
  const completedCount = Object.values(state.stagesCompleted).filter(Boolean).length;
  const progressPct = Math.round((completedCount / STAGES.length) * 100);

  // Health status visual styles
  const healthBadgeMap = {
    'SECURE': { text: 'Nominal / Monitored', class: 'health-secure', color: 'var(--accent-emerald)' },
    'INFILTRATED': { text: 'Footprint Established', class: 'health-warn', color: 'var(--accent-amber)' },
    'PRIV_ELEVATED': { text: 'SYSTEM Rooted', class: 'health-alert', color: 'var(--accent-red)' },
    'ENCRYPTING': { text: 'Cryptographic Lock', class: 'health-critical', color: 'var(--accent-crimson)' },
    'COMPROMISED': { text: 'Double Extortion Active', class: 'health-extorted', color: 'var(--accent-purple)' },
    'RESTORED': { text: 'Remediated & Verified', class: 'health-recovered', color: 'var(--accent-cyan)' }
  };
  const hostHealth = healthBadgeMap[state.targetHost.health] || healthBadgeMap.SECURE;

  container.innerHTML = `
    <aside class="sidebar-wrapper" id="sidebar" role="navigation" aria-label="Ransomware Kill Chain Steps">
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

      <!-- Target Host Telemetry Card -->
      <div class="host-status-card" id="host-status-card">
        <div class="host-card-header">
          <div class="host-indicator-dot"></div>
          <span class="host-card-title">TARGET NODE STATUS</span>
        </div>
        <div class="host-details">
          <div class="host-row">
            <span class="host-label">Hostname</span>
            <span class="host-val font-mono" title="${state.targetHost.hostname}">${state.targetHost.hostname.split('.')[0]}</span>
          </div>
          <div class="host-row">
            <span class="host-label">Integrity</span>
            <span class="host-val font-mono">${state.targetHost.integrityLevel}</span>
          </div>
          <div class="host-row">
            <span class="host-label">Threat Level</span>
            <span class="host-badge ${hostHealth.class}">${hostHealth.text}</span>
          </div>
        </div>
      </div>

      <!-- Kill Chain Stepper Section -->
      <div class="stepper-section">
        <div class="stepper-header">
          <span class="stepper-heading">RANSOMWARE STEPS</span>
          <span class="stepper-progress-text">${completedCount} / 5 COMPLETE</span>
        </div>

        <!-- Global Progress Bar -->
        <div class="killchain-progress-track" title="Kill chain execution progress: ${progressPct}%">
          <div class="killchain-progress-fill" style="width: ${progressPct}%;"></div>
        </div>

        <!-- The 5 Steps Nav List -->
        <nav class="steps-nav-list" id="steps-nav-list" aria-label="Kill chain stages">
          ${STAGES.map((stage) => {
            const isActive = stage.id === state.currentStageId;
            const isCompleted = state.stagesCompleted[stage.id];
            
            // Determine step badge label
            let badgeText = 'PENDING';
            let badgeClass = 'badge-pending';
            if (isActive) {
              badgeText = 'ACTIVE';
              badgeClass = 'badge-active';
            } else if (isCompleted) {
              badgeText = 'EXECUTED';
              badgeClass = 'badge-done';
            }

            return `
              <button 
                type="button"
                class="step-item-btn ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}" 
                data-stage-id="${stage.id}"
                id="step-nav-${stage.id}"
                aria-current="${isActive ? 'step' : 'false'}"
              >
                <div class="step-num-bubble">
                  ${isCompleted ? `
                    <svg class="check-icon" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                    </svg>
                  ` : `0${stage.num}`}
                </div>
                <div class="step-meta">
                  <div class="step-meta-top">
                    <span class="step-name">${stage.title}</span>
                    <span class="step-badge ${badgeClass}">${badgeText}</span>
                  </div>
                  <div class="step-sub">${stage.subtitle}</div>
                  <div class="step-mitre font-mono">${stage.mitreId}</div>
                </div>
              </button>
            `;
          }).join('')}
        </nav>
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

  // Attach event listeners
  container.querySelectorAll('.step-item-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      sound.playClick();
      const stageId = btn.getAttribute('data-stage-id');
      actions.onSelectStage(stageId);
    });
  });

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
