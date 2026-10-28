/**
 * Stage 5: Decryption & Remediation Component
 * Simulates Master RSA Private Key injection, AES unwrapping, hash verification, and defense roadmap.
 */
import { sound } from '../sound.js';

export function renderDecryption(container, state, actions) {
  const { decryption, encryption } = state;
  const isVerified = decryption.status === 'verified';
  const isDecrypting = decryption.status === 'decrypting';
  const restoredFilesCount = encryption.files.filter(f => f.status === 'restored').length;

  container.innerHTML = `
    <div class="stage-view-container animate-fade-in" id="stage-decryption">
      <!-- Stage Header -->
      <div class="stage-header-bar">
        <div class="stage-title-group">
          <div class="stage-eyebrow text-emerald">STEP 05 OF 05 // RECOVERY & REMEDIATION</div>
          <h1 class="stage-main-title">Decryption &amp; Incident Remediation</h1>
          <p class="stage-description">
            Restoration requires injecting the corresponding <strong>RSA-4096 Master Private Key</strong> 
            to unwrap each file's AES session key, reconstituting original binary bytes, and validating cryptographic SHA-256 hash integrity.
          </p>
        </div>
        <div class="stage-action-cta">
          ${isVerified ? `
            <div class="status-pill status-pill-success">
              <span class="pulsing-dot green"></span> All Files Restored &amp; Verified
            </div>
          ` : isDecrypting ? `
            <div class="status-pill status-pill-warn">
              <span class="pulsing-dot yellow"></span> Decryption Engine Running...
            </div>
          ` : `
            <button type="button" class="action-btn-primary glow-emerald" id="btn-trigger-decryption">
              <svg class="btn-icon" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 2a5 5 0 00-5 5v2a2 2 0 00-2 2v5a2 2 0 002 2h10a2 2 0 002-2v-5a2 2 0 00-2-2H7V7a3 3 0 015.905-.75 1 1 0 001.937-.5A5.002 5.002 0 0010 2z" clip-rule="evenodd" />
              </svg>
              <span>Initialize Decryptor Engine</span>
            </button>
          `}
        </div>
      </div>

      <!-- Recovery Metrics Row -->
      <div class="metrics-summary-grid">
        <div class="metric-card">
          <div class="metric-label">Decryption Progress</div>
          <div class="metric-value font-mono ${isVerified ? 'text-emerald' : 'text-amber'}">${decryption.progress}%</div>
          <div class="metric-sub font-mono">${restoredFilesCount} / ${encryption.files.length} files reconstituted</div>
        </div>
        <div class="metric-card">
          <div class="metric-label">Private Key Validation</div>
          <div class="metric-value font-mono ${decryption.keyValid ? 'text-emerald' : 'text-muted'}">
            ${decryption.keyValid ? 'RSA-4096 VALIDATED' : 'STANDBY'}
          </div>
          <div class="metric-sub font-mono">Fingerprint matches target header</div>
        </div>
        <div class="metric-card">
          <div class="metric-label">Cryptographic Integrity</div>
          <div class="metric-value font-mono ${isVerified ? 'text-emerald' : 'text-muted'}">
            ${isVerified ? '100% SHA-256 MATCH' : 'PENDING RESTORATION'}
          </div>
          <div class="metric-sub font-mono">Zero byte corruption</div>
        </div>
        <div class="metric-card">
          <div class="metric-label">Host Remediation Status</div>
          <div class="metric-value font-mono ${isVerified ? 'text-cyan' : 'text-danger'}">
            ${isVerified ? 'CLEAN &amp; HARDENED' : 'COMPROMISED'}
          </div>
          <div class="metric-sub font-mono">Post-incident status</div>
        </div>
      </div>

      <!-- Decryption Workbench Split Grid -->
      <div class="stage-split-grid">
        <!-- Left: Private Key Injection Console & Restoration Progress -->
        <div class="cyber-panel">
          <div class="panel-header">
            <div class="panel-title">
              <span class="panel-icon">🔑</span>
              <span>Master Private Key Injection Console</span>
            </div>
            <span class="panel-tag font-mono">KEY ESCROW</span>
          </div>

          <div class="panel-body">
            <div class="key-input-container">
              <label class="text-xs font-mono text-muted mb-1 block">RSA-4096 PRIVATE MASTER KEY (PEM FORMAT):</label>
              <textarea class="cyber-textarea font-mono" id="rsa-key-input" rows="5" readonly>
-----BEGIN RSA PRIVATE KEY-----
MIIJKQIBAAKCAgEA0m9lQ5m6R4W8sX...[ATTACKER_SIGNATURE_KEY_MATCH]...
d3Z2+3F8Qp9a1Lk6Jm4V7Xy8R9w0Z2...[VICTIM_IDENTIFIER_HASH_8849]...
q1W2e3R4t5Y6u7I8o9P0a1S2d3F4g5...[SESSION_AES_UNWRAP_VALIDATED]...
-----END RSA PRIVATE KEY-----</textarea>
              <div class="key-status-row font-mono text-xs mt-1">
                <span class="text-muted">Key Fingerprint: </span>
                <span class="text-cyan">SHA256: 9b2d88a1c0f4...f08a (Matches Victim Ciphertext)</span>
              </div>
            </div>

            <!-- Recovery Progress Bar -->
            <div class="recovery-progress-box mt-3">
              <div class="progress-meta font-mono">
                <span>RESTORATION PIPELINE PROGRESS:</span>
                <span>${decryption.progress}%</span>
              </div>
              <div class="recovery-track">
                <div class="recovery-fill" style="width: ${decryption.progress}%;"></div>
              </div>
            </div>

            <!-- Restored Files Verification Table -->
            <div class="file-table-wrapper mt-3">
              <table class="file-status-table">
                <thead>
                  <tr>
                    <th>File</th>
                    <th>Status</th>
                    <th>Integrity Verification</th>
                  </tr>
                </thead>
                <tbody>
                  ${encryption.files.map((file) => {
                    const isRestored = file.status === 'restored';
                    return `
                      <tr class="file-row ${isRestored ? 'file-restored' : 'file-locked'}">
                        <td>
                          <div class="file-name-cell">
                            <span>${isRestored ? '✅' : '🔒'}</span>
                            <span class="font-mono ${isRestored ? 'text-emerald' : 'text-danger'}">${file.name}</span>
                          </div>
                        </td>
                        <td>
                          <span class="file-badge ${isRestored ? 'file-restored' : 'file-locked'}">
                            ${isRestored ? 'RESTORED' : 'LOCKED'}
                          </span>
                        </td>
                        <td class="font-mono text-xs ${isRestored ? 'text-emerald' : 'text-muted'}">
                          ${isRestored ? '✓ Original SHA-256 Matched' : 'Awaiting AES unwrap'}
                        </td>
                      </tr>
                    `;
                  }).join('')}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Right: Forensic Comparison & Mathematical Verification -->
        <div class="cyber-panel">
          <div class="panel-header">
            <div class="panel-title">
              <span class="panel-icon">🔬</span>
              <span>Forensic Byte Comparison &amp; Entropy Drop</span>
            </div>
            <span class="panel-tag font-mono">INTEGRITY CHECK</span>
          </div>

          <div class="panel-body execution-body">
            <!-- Entropy Comparison -->
            <div class="entropy-drop-comparison">
              <div class="entropy-card before">
                <div class="entropy-title font-mono">ENCRYPTED STATE</div>
                <div class="entropy-val font-mono text-danger">7.994 bits/byte</div>
                <div class="entropy-sub">Near-pure randomness (AES-256)</div>
              </div>
              <div class="entropy-arrow">➔ DECRYPT ➔</div>
              <div class="entropy-card after">
                <div class="entropy-title font-mono">RESTORED STATE</div>
                <div class="entropy-val font-mono text-emerald">4.150 bits/byte</div>
                <div class="entropy-sub">Natural language &amp; schema structure</div>
              </div>
            </div>

            <!-- SHA-256 Hash Proof Table -->
            <div class="hash-proof-box font-mono text-xs mt-3">
              <div class="hash-proof-header">CRYPTOGRAPHIC PROOF OF NON-TAMPERING:</div>
              <div class="hash-proof-row">
                <span class="hash-proof-label">Original Baseline:</span>
                <span class="hash-proof-val text-cyan">e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855</span>
              </div>
              <div class="hash-proof-row">
                <span class="hash-proof-label">Restored File Hash:</span>
                <span class="hash-proof-val ${isVerified ? 'text-emerald' : 'text-muted'}">
                  ${isVerified ? 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855' : 'Calculating...'}
                </span>
              </div>
              <div class="hash-proof-status ${isVerified ? 'text-emerald' : 'text-muted'} mt-1">
                ${isVerified ? '✓ CRYPTOGRAPHIC MATCH CONFIRMED (100% BYTE INTEGRITY)' : 'Waiting for completion...'}
              </div>
            </div>

            ${isVerified ? `
              <div class="simulation-complete-banner mt-3 animate-fade-in">
                <div class="complete-icon">🎉</div>
                <div class="complete-text">
                  <div class="complete-title font-mono">KILL CHAIN SIMULATION COMPLETE</div>
                  <div class="complete-sub text-sm text-muted">
                    You have successfully navigated through all 5 phases of ransomware: 
                    Initial Access &rarr; Privilege Escalation &rarr; Encryption &rarr; Extortion &rarr; Decryption.
                  </div>
                </div>
                <button type="button" class="btn-restart-sim mt-2" id="btn-restart-from-end">
                  Restart Simulation
                </button>
              </div>
            ` : ''}
          </div>
        </div>
      </div>

      <!-- Master Ransomware Kill Chain Matrix & Blue Team Defenses -->
      <div class="cyber-panel defense-panel mt-3">
        <div class="panel-header">
          <div class="panel-title">
            <span class="panel-icon">🛡️</span>
            <span>Complete Defense Architecture: Stopping Ransomware at Every Stage</span>
          </div>
          <span class="defense-badge font-mono">DEFENSE-IN-DEPTH</span>
        </div>
        <div class="panel-body defense-body">
          <div class="matrix-grid">
            <div class="matrix-col">
              <div class="matrix-step text-blue font-mono">1. INITIAL ACCESS</div>
              <ul class="matrix-list text-xs">
                <li>Enforce FIDO2 Phishing-resistant MFA</li>
                <li>Block macros via Mark-of-the-Web GPO</li>
                <li>Patch public VPN/Edge services within 24h</li>
              </ul>
            </div>
            <div class="matrix-col">
              <div class="matrix-step text-amber font-mono">2. PRIV ESCALATION</div>
              <ul class="matrix-list text-xs">
                <li>Deploy Windows Credential Guard (VBS)</li>
                <li>Enable LAPS for randomized local admin pass</li>
                <li>Restrict SeImpersonate from service accounts</li>
              </ul>
            </div>
            <div class="matrix-col">
              <div class="matrix-step text-red font-mono">3. ENCRYPTION</div>
              <ul class="matrix-list text-xs">
                <li>Immutable air-gapped backups (WORM storage)</li>
                <li>EDR behavioral canary file trips</li>
                <li>Protect volume shadow copy utilities</li>
              </ul>
            </div>
            <div class="matrix-col">
              <div class="matrix-step text-crimson font-mono">4. EXTORTION</div>
              <ul class="matrix-list text-xs">
                <li>DLP and egress traffic bandwidth anomaly alerts</li>
                <li>Zero-Trust network segmentation (isolate VLANs)</li>
                <li>Tested Incident Response table-top exercises</li>
              </ul>
            </div>
            <div class="matrix-col">
              <div class="matrix-step text-emerald font-mono">5. RECOVERY</div>
              <ul class="matrix-list text-xs">
                <li>Automated clean snapshot rollback pipeline</li>
                <li>Active Directory forest recovery runbook</li>
                <li>Forensic root-cause analysis before restore</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  // Attach Event Handlers
  const triggerBtn = container.querySelector('#btn-trigger-decryption');
  if (triggerBtn) {
    triggerBtn.addEventListener('click', () => {
      sound.playSuccess();
      actions.onStartDecryption();
    });
  }

  const restartBtn = container.querySelector('#btn-restart-from-end');
  if (restartBtn) {
    restartBtn.addEventListener('click', () => {
      sound.playClick();
      actions.onReset();
    });
  }
}
