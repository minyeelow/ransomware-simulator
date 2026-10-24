/**
 * Stage 3: Encryption Engine Component
 * Simulates Volume Shadow Copy deletion and Hybrid AES-256 + RSA-4096 file locking.
 */
import { sound } from '../sound.js';

export function renderEncryption(container, state, actions) {
  const { encryption } = state;
  const isComplete = encryption.status === 'complete';
  const isInProgress = encryption.status === 'in-progress';
  const encryptedCount = encryption.files.filter(f => f.status === 'encrypted').length;

  container.innerHTML = `
    <div class="stage-view-container animate-fade-in" id="stage-encryption">
      <!-- Stage Header -->
      <div class="stage-header-bar">
        <div class="stage-title-group">
          <div class="stage-eyebrow text-red">STEP 03 OF 05 // CRYPTOGRAPHIC IMPACT</div>
          <h1 class="stage-main-title">Encryption Engine</h1>
          <p class="stage-description">
            Ransomware destroys recovery points (Volume Shadow Copies) and executes a high-speed 
            hybrid cryptographic loop: fast symmetric <strong>AES-256</strong> locks data blocks, and asymmetric <strong>RSA-4096</strong> seals the keys.
          </p>
        </div>
        <div class="stage-action-cta">
          ${isComplete ? `
            <div class="status-pill status-pill-danger">
              <span class="pulsing-dot red"></span> 6 of 6 Files Locked (.ransom_locked)
            </div>
          ` : isInProgress ? `
            <div class="status-pill status-pill-warn">
              <span class="pulsing-dot yellow"></span> Encrypting Target Volumes...
            </div>
          ` : `
            <button type="button" class="action-btn-primary glow-red" id="btn-trigger-encryption">
              <svg class="btn-icon" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
              </svg>
              <span>Execute Encryption Engine</span>
            </button>
          `}
        </div>
      </div>

      <!-- Crypto Metrics Row -->
      <div class="metrics-summary-grid">
        <div class="metric-card">
          <div class="metric-label">Algorithm</div>
          <div class="metric-value font-mono text-cyan">AES-256 + RSA-4096</div>
          <div class="metric-sub font-mono">Hybrid envelope cipher</div>
        </div>
        <div class="metric-card">
          <div class="metric-label">Target Files Locked</div>
          <div class="metric-value font-mono ${isComplete ? 'text-danger' : 'text-amber'}">${encryptedCount} / ${encryption.files.length}</div>
          <div class="metric-sub font-mono">${isComplete ? '100% volumes impacted' : 'Standing by'}</div>
        </div>
        <div class="metric-card">
          <div class="metric-label">Shannon Entropy</div>
          <div class="metric-value font-mono ${isComplete ? 'text-danger' : 'text-emerald'}">${encryption.encryptionEntropy} bits/byte</div>
          <div class="metric-sub font-mono">${isComplete ? 'High Entropy (Encrypted)' : 'Normal Data Entropy'}</div>
        </div>
        <div class="metric-card">
          <div class="metric-label">Shadow Copies (VSS)</div>
          <div class="metric-value font-mono ${encryption.shadowCopiesDeleted ? 'text-danger' : 'text-emerald'}">
            ${encryption.shadowCopiesDeleted ? 'PURGED (vssadmin)' : 'IN STORAGE'}
          </div>
          <div class="metric-sub font-mono">System Recovery Invalidation</div>
        </div>
      </div>

      <!-- Main Split: File Target Browser & Real-time Hex Stream -->
      <div class="stage-split-grid">
        <!-- Left: Target File Explorer -->
        <div class="cyber-panel">
          <div class="panel-header">
            <div class="panel-title">
              <span class="panel-icon">📂</span>
              <span>Target File System Infiltration</span>
            </div>
            <span class="panel-tag font-mono">ENUMERATION QUEUE</span>
          </div>

          <div class="panel-body">
            <div class="file-table-wrapper">
              <table class="file-status-table" id="file-target-table">
                <thead>
                  <tr>
                    <th>Target File</th>
                    <th>Size</th>
                    <th>Status</th>
                    <th>Hash / Fingerprint</th>
                  </tr>
                </thead>
                <tbody>
                  ${encryption.files.map((file, idx) => {
                    let statusClass = 'file-clean';
                    let statusLabel = 'CLEAN';
                    if (file.status === 'encrypting') {
                      statusClass = 'file-encrypting';
                      statusLabel = 'ENCRYPTING...';
                    } else if (file.status === 'encrypted') {
                      statusClass = 'file-locked';
                      statusLabel = 'LOCKED (.ransom_locked)';
                    } else if (file.status === 'restored') {
                      statusClass = 'file-restored';
                      statusLabel = 'RESTORED (Clean)';
                    }

                    return `
                      <tr class="file-row ${statusClass}" data-file-id="${file.id}">
                        <td>
                          <div class="file-name-cell">
                            <span class="file-type-icon">${getFileIcon(file.name)}</span>
                            <div>
                              <div class="file-title font-mono">${file.name}</div>
                              <div class="file-path font-mono text-muted">${file.path}</div>
                            </div>
                          </div>
                        </td>
                        <td class="font-mono text-muted">${file.size}</td>
                        <td>
                          <span class="file-badge ${statusClass}">
                            ${file.status === 'encrypting' ? '<span class="inline-spinner"></span>' : ''}
                            ${statusLabel}
                          </span>
                        </td>
                        <td class="font-mono text-xs ${file.status === 'encrypted' ? 'text-danger' : 'text-muted'}">
                          ${file.currentHash}
                        </td>
                      </tr>
                    `;
                  }).join('')}
                </tbody>
              </table>
            </div>

            <!-- Pre-Encryption Sabotage Banner -->
            <div class="shadow-copy-status-box ${encryption.shadowCopiesDeleted ? 'shadows-purged' : ''}">
              <div class="shadow-box-header font-mono">
                <span>VSSADMIN INHIBIT RECOVERY (T1490):</span>
                <span class="${encryption.shadowCopiesDeleted ? 'text-danger' : 'text-muted'}">
                  ${encryption.shadowCopiesDeleted ? 'SHADOW COPIES DESTROYED' : 'UNTOUCHED'}
                </span>
              </div>
              <div class="code-snippet font-mono text-xs mt-1">
                vssadmin.exe delete shadows /all /quiet &amp;&amp; bcdedit.exe /set {default} recoveryenabled no &amp;&amp; wbadmin delete catalog -quiet
              </div>
            </div>
          </div>
        </div>

        <!-- Right: Real-time Hex Buffer & Cryptographic Mechanism -->
        <div class="cyber-panel">
          <div class="panel-header">
            <div class="panel-title">
              <span class="panel-icon">🔐</span>
              <span>Cryptographic Transform & Hex Inspector</span>
            </div>
            <span class="panel-tag font-mono">ENTROPY INSPECTOR</span>
          </div>

          <div class="panel-body execution-body">
            <!-- Cryptographic Flow Diagram -->
            <div class="crypto-flow-diagram">
              <div class="crypto-node">
                <div class="node-title">Target File Buffer</div>
                <div class="node-val font-mono">Plaintext Data</div>
              </div>
              <div class="crypto-arrow">+ [AES-256] ➔</div>
              <div class="crypto-node">
                <div class="node-title">Ciphertext Stream</div>
                <div class="node-val font-mono text-danger">High Entropy</div>
              </div>
              <div class="crypto-arrow">+ [RSA-4096] ➔</div>
              <div class="crypto-node">
                <div class="node-title">File Footer</div>
                <div class="node-val font-mono text-cyan">Sealed AES Key</div>
              </div>
            </div>

            <!-- Hex Inspector -->
            <div class="hex-viewer-card">
              <div class="hex-card-header font-mono">
                <span>BUFFER SAMPLE: Customer_ERP_Database.sql</span>
                <span class="${isComplete ? 'text-danger' : 'text-emerald'}">
                  ${isComplete ? 'CIPHERTEXT (ENCRYPTED)' : 'PLAINTEXT (ORIGINAL)'}
                </span>
              </div>
              <div class="hex-dump font-mono">
                ${isComplete ? `
                  <div class="hex-line"><span class="hex-offset">00000000</span> <span class="hex-bytes text-danger">8A F4 19 32 BB C9 41 07 2E 9D 11 8F 3C 7A A0 55</span> <span class="hex-ascii">...2..A...&lt;z.U</span></div>
                  <div class="hex-line"><span class="hex-offset">00000010</span> <span class="hex-bytes text-danger">03 E7 BC 44 F1 99 20 B8 1A A2 CC 40 8E 71 A3 FF</span> <span class="hex-ascii">...D.. ...@.q..</span></div>
                  <div class="hex-line"><span class="hex-offset">00000020</span> <span class="hex-bytes text-danger">B5 2A C1 70 9F 48 DE 11 50 FC 33 D1 AA 90 28 6B</span> <span class="hex-ascii">.*.p.H..P.3...(k</span></div>
                  <div class="hex-line"><span class="hex-offset">00000030</span> <span class="hex-bytes text-cyan">52 53 41 45 4E 43 5F 4B 45 59 3A 20 9B 2D F0 8A</span> <span class="hex-ascii">[RSA_ENC_KEY_TAG]</span></div>
                ` : `
                  <div class="hex-line"><span class="hex-offset">00000000</span> <span class="hex-bytes text-emerald">43 52 45 41 54 45 20 54 41 42 4C 45 20 64 62 6F</span> <span class="hex-ascii">CREATE TABLE dbo</span></div>
                  <div class="hex-line"><span class="hex-offset">00000010</span> <span class="hex-bytes text-emerald">2E 55 73 65 72 73 20 28 49 44 20 49 4E 54 2C 20</span> <span class="hex-ascii">.Users (ID INT, </span></div>
                  <div class="hex-line"><span class="hex-offset">00000020</span> <span class="hex-bytes text-emerald">55 73 65 72 6E 61 6D 65 20 56 41 52 43 48 41 52</span> <span class="hex-ascii">Username VARCHAR</span></div>
                  <div class="hex-line"><span class="hex-offset">00000030</span> <span class="hex-bytes text-emerald">28 32 35 35 29 2C 20 50 61 73 73 77 6F 72 64 29</span> <span class="hex-ascii">(255), Password)</span></div>
                `}
              </div>
            </div>

            ${isComplete ? `
              <div class="stage-next-action-row">
                <button type="button" class="btn-next-step" id="btn-goto-step-4">
                  <span>Advance to Step 4: Ransom & Extortion</span>
                  <svg class="btn-icon" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd" />
                  </svg>
                </button>
              </div>
            ` : ''}
          </div>
        </div>
      </div>

      <!-- Blue Team Mitigation Reference -->
      <div class="cyber-panel defense-panel">
        <div class="panel-header">
          <div class="panel-title">
            <span class="panel-icon">🛡️</span>
            <span>Blue Team Defenses: Countering the Encryption Engine</span>
          </div>
          <span class="defense-badge font-mono">RESILIENCE STRATEGY</span>
        </div>
        <div class="panel-body defense-body">
          <div class="defense-card">
            <div class="defense-title">Air-Gapped & Immutable Backups</div>
            <div class="defense-desc">Maintain 3-2-1 backup topology with WORM (Write Once, Read Many) storage or cloud object locks that attackers cannot delete even with Domain Admin.</div>
          </div>
          <div class="defense-card">
            <div class="defense-title">Behavioral Ransomware EDR Canaries</div>
            <div class="defense-desc">Deploy hidden file traps ("canary files"). If any unapproved process alters multiple files within seconds, EDR automatically freezes the offending PID.</div>
          </div>
          <div class="defense-card">
            <div class="defense-title">Protect Volume Shadow Copies</div>
            <div class="defense-desc">Restrict access to <code>vssadmin.exe</code> and <code>wbadmin.exe</code> via AppLocker and alert on any command deleting shadows.</div>
          </div>
        </div>
      </div>
    </div>
  `;

  function getFileIcon(filename) {
    if (filename.endsWith('.xlsx')) return '📊';
    if (filename.endsWith('.sql')) return '🗄️';
    if (filename.endsWith('.pdf')) return '📄';
    if (filename.endsWith('.zip')) return '📦';
    if (filename.endsWith('.dit')) return '🔑';
    return '💾';
  }

  // Attach Event Handlers
  const triggerBtn = container.querySelector('#btn-trigger-encryption');
  if (triggerBtn) {
    triggerBtn.addEventListener('click', () => {
      sound.playAlert();
      actions.onStartEncryption();
    });
  }

  const gotoStep4Btn = container.querySelector('#btn-goto-step-4');
  if (gotoStep4Btn) {
    gotoStep4Btn.addEventListener('click', () => {
      sound.playStageChange();
      actions.onSelectStage('ransom');
    });
  }
}
