/**
 * Stage 2: Privilege Escalation Component
 * Visualizes the elevation ladder from standard domain user to SYSTEM integrity.
 */
import { sound } from '../sound.js';

export function renderPrivEsc(container, state, actions) {
  const { privEsc, targetHost } = state;
  const isExploited = privEsc.exploited;

  container.innerHTML = `
    <div class="stage-view-container animate-fade-in" id="stage-priv-esc">
      <!-- Stage Header -->
      <div class="stage-header-bar">
        <div class="stage-title-group">
          <div class="stage-eyebrow text-amber">STEP 02 OF 05 // SYSTEM ELEVATION</div>
          <h1 class="stage-main-title">Privilege Escalation</h1>
          <p class="stage-description">
            Ransomware cannot terminate antivirus services or delete volume shadow backups as an unprivileged user. 
            Operators must elevate privileges to local Administrator and <code>NT AUTHORITY\\SYSTEM</code>.
          </p>
        </div>
        <div class="stage-action-cta">
          ${isExploited ? `
            <div class="status-pill status-pill-danger">
              <span class="pulsing-dot red"></span> Elevated: NT AUTHORITY\\SYSTEM
            </div>
          ` : `
            <button type="button" class="action-btn-primary glow-amber" id="btn-trigger-privesc">
              <svg class="btn-icon" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clip-rule="evenodd" />
              </svg>
              <span>Execute Escalation Exploit</span>
            </button>
          `}
        </div>
      </div>

      <!-- Main Escalation Grid -->
      <div class="stage-split-grid">
        <!-- Left: Privilege Integrity Ladder -->
        <div class="cyber-panel">
          <div class="panel-header">
            <div class="panel-title">
              <span class="panel-icon">🪜</span>
              <span>Windows Integrity Level Ladder</span>
            </div>
            <span class="panel-tag font-mono">TOKEN PERMISSIONS</span>
          </div>

          <div class="panel-body">
            <div class="privilege-ladder">
              <!-- Tier 3: SYSTEM -->
              <div class="ladder-tier ${isExploited ? 'tier-current tier-system' : 'tier-locked'}">
                <div class="tier-indicator">
                  <span class="tier-dot"></span>
                </div>
                <div class="tier-info">
                  <div class="tier-level-header">
                    <span class="tier-level-name">Ring 0 // SYSTEM Integrity</span>
                    <span class="tier-badge ${isExploited ? 'badge-critical' : 'badge-neutral'}">
                      ${isExploited ? 'ACTIVE USER' : 'TARGET'}
                    </span>
                  </div>
                  <div class="tier-user font-mono">NT AUTHORITY\\SYSTEM</div>
                  <div class="tier-desc">Unrestricted kernel-level access. Can stop EDR services, unload mini-filter drivers, and wipe volume shadow copies.</div>
                  <div class="tier-privs font-mono">
                    Privileges: SeDebugPrivilege, SeTcbPrivilege, SeImpersonatePrivilege
                  </div>
                </div>
              </div>

              <div class="ladder-arrow-down ${isExploited ? 'active-arrow' : ''}">▲ ELEVATION PATH ▲</div>

              <!-- Tier 2: Local Admin (High Integrity) -->
              <div class="ladder-tier ${isExploited ? 'tier-passed' : 'tier-elevatable'}">
                <div class="tier-indicator">
                  <span class="tier-dot"></span>
                </div>
                <div class="tier-info">
                  <div class="tier-level-header">
                    <span class="tier-level-name">High Integrity // Local Admin</span>
                    <span class="tier-badge badge-warn">UAC BYPASSED</span>
                  </div>
                  <div class="tier-user font-mono">CORP-FIN-SRV01\\Administrator</div>
                  <div class="tier-desc">UAC bypass executed via registry hijacking (fodhelper.exe or computerdefaults.exe) without prompting the user.</div>
                </div>
              </div>

              <div class="ladder-arrow-down">▲ INGRESS BASELINE ▲</div>

              <!-- Tier 1: Standard User (Medium Integrity) -->
              <div class="ladder-tier ${isExploited ? 'tier-passed' : 'tier-current'}">
                <div class="tier-indicator">
                  <span class="tier-dot"></span>
                </div>
                <div class="tier-info">
                  <div class="tier-level-header">
                    <span class="tier-level-name">Medium Integrity // Standard User</span>
                    <span class="tier-badge badge-neutral">${isExploited ? 'ESCALATED AWAY' : 'INITIAL STATE'}</span>
                  </div>
                  <div class="tier-user font-mono">MEGACORP\\jsmith (Domain User)</div>
                  <div class="tier-desc">Limited to user profile folders. Cannot alter system files, services, or registry hives.</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right: Memory Dump & Token Impersonation Terminal -->
        <div class="cyber-panel">
          <div class="panel-header">
            <div class="panel-title">
              <span class="panel-icon">💻</span>
              <span>Exploit Execution & Credential Dump (Mimikatz)</span>
            </div>
            <span class="panel-tag font-mono ${isExploited ? 'tag-danger' : 'tag-neutral'}">
              ${isExploited ? 'EXPLOIT ARMED' : 'WAITING FOR TRIGGER'}
            </span>
          </div>

          <div class="panel-body execution-body">
            <div class="code-snippet exploit-terminal font-mono">
              <div class="terminal-line"><span class="prompt-sym">C:\\Temp&gt;</span> whoami /priv</div>
              <div class="terminal-line text-muted">PRIVILEGES INFORMATION: Standard token [SeChangeNotifyPrivilege Enabled]</div>
              <div class="terminal-line"><span class="prompt-sym">C:\\Temp&gt;</span> invoke-printspoofer.exe -i -c "cmd.exe"</div>
              
              ${isExploited ? `
                <div class="terminal-line text-amber">[+] Found token: NT AUTHORITY\\SYSTEM with SeImpersonatePrivilege</div>
                <div class="terminal-line text-amber">[+] Spawning named pipe listener: \\\\.\\pipe\\spoolss</div>
                <div class="terminal-line text-amber">[+] ImpersonateLoggedOnUser successful! Process integrity: SYSTEM</div>
                <div class="terminal-line text-emerald">[+] Dumping LSASS memory hashes via comsvcs.dll mini-dump...</div>
                <div class="terminal-line text-cyan">[!] NTLM HASH EXTRACTED:</div>
                <div class="terminal-line text-highlight">  User: DomainAdmin_SVC</div>
                <div class="terminal-line text-highlight">  Hash: 31d6cfe0d16ae931b73c59d7e0c089c0</div>
                <div class="terminal-line text-emerald">[✓] Full domain administrative delegation obtained!</div>
              ` : `
                <div class="terminal-line text-muted">[i] Awaiting exploit execution command... Click "Execute Escalation Exploit" above.</div>
              `}
            </div>

            <!-- Privilege Token Inspection Box -->
            <div class="token-inspection-card">
              <div class="token-title font-mono">ACTIVE PROCESS SECURITY DESCRIPTOR</div>
              <div class="token-grid font-mono">
                <div class="token-cell">
                  <span class="token-k">Identity:</span>
                  <span class="token-v ${isExploited ? 'text-danger' : ''}">${targetHost.currentUser}</span>
                </div>
                <div class="token-cell">
                  <span class="token-k">Integrity:</span>
                  <span class="token-v ${isExploited ? 'text-amber' : ''}">${targetHost.integrityLevel}</span>
                </div>
                <div class="token-cell">
                  <span class="token-k">Elevation:</span>
                  <span class="token-v ${isExploited ? 'text-danger' : ''}">${isExploited ? 'Full Token (TokenElevationTypeFull)' : 'Limited (TokenElevationTypeLimited)'}</span>
                </div>
                <div class="token-cell">
                  <span class="token-k">Audit Event:</span>
                  <span class="token-v">${isExploited ? 'Event 4672 (Special Privileges)' : 'Event 4624 (Type 3)'}</span>
                </div>
              </div>
            </div>

            ${isExploited ? `
              <div class="stage-next-action-row">
                <button type="button" class="btn-next-step" id="btn-goto-step-3">
                  <span>Advance to Step 3: Encryption Engine</span>
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
            <span>Blue Team Defenses: Neutralizing Privilege Escalation</span>
          </div>
          <span class="defense-badge font-mono">HARDENING CONTROLS</span>
        </div>
        <div class="panel-body defense-body">
          <div class="defense-card">
            <div class="defense-title">Enable Windows Credential Guard</div>
            <div class="defense-desc">Isolates LSASS memory within a Virtualization-based Security (VBS) enclave to prevent memory dumping tools like Mimikatz.</div>
          </div>
          <div class="defense-card">
            <div class="defense-title">LAPS (Local Admin Password Solution)</div>
            <div class="defense-desc">Rotates randomized, unique passwords for local admin accounts across every endpoint so lateral movement fails.</div>
          </div>
          <div class="defense-card">
            <div class="defense-title">Restrict SeImpersonatePrivilege</div>
            <div class="defense-desc">Remove impersonation rights from standard service accounts and prevent non-admin users from creating elevated tokens.</div>
          </div>
        </div>
      </div>
    </div>
  `;

  // Attach Event Handlers
  const triggerBtn = container.querySelector('#btn-trigger-privesc');
  if (triggerBtn) {
    triggerBtn.addEventListener('click', () => {
      sound.playElevation();
      actions.onTriggerPrivEsc();
    });
  }

  const gotoStep3Btn = container.querySelector('#btn-goto-step-3');
  if (gotoStep3Btn) {
    gotoStep3Btn.addEventListener('click', () => {
      sound.playStageChange();
      actions.onSelectStage('encryption');
    });
  }
}
