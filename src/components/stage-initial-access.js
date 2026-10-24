/**
 * Stage 1: Initial Access Component
 * Simulates weaponized lure delivery, macro execution, and C2 beacon ingress.
 */
import { sound } from '../sound.js';

export function renderInitialAccess(container, state, actions) {
  const { initialAccess } = state;
  const isTriggered = initialAccess.macroTriggered;

  container.innerHTML = `
    <div class="stage-view-container animate-fade-in" id="stage-initial-access">
      <!-- Stage Hero Header -->
      <div class="stage-header-bar">
        <div class="stage-title-group">
          <div class="stage-eyebrow">STEP 01 OF 05 // INFILTRATION VECTOR</div>
          <h1 class="stage-main-title">Initial Access & Foothold</h1>
          <p class="stage-description">
            Ransomware operators gain their initial organizational foothold using weaponized email lures, 
            exploiting unpatched public-facing perimeter gateways, or utilizing compromised credentials.
          </p>
        </div>
        <div class="stage-action-cta">
          ${isTriggered ? `
            <div class="status-pill status-pill-success">
              <span class="pulsing-dot green"></span> Foothold Established
            </div>
          ` : `
            <button type="button" class="action-btn-primary glow-blue" id="btn-trigger-initial-access">
              <svg class="btn-icon" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd" />
              </svg>
              <span>Detonate Ingress Vector</span>
            </button>
          `}
        </div>
      </div>

      <!-- Vector Selection Tabs -->
      <div class="vector-selector-tabs" role="tablist">
        <button type="button" class="vector-tab ${initialAccess.selectedVector === 'phishing' ? 'active' : ''}" data-vector="phishing" role="tab">
          <span class="vector-tab-title">📧 Spearphishing Lure</span>
          <span class="vector-tab-mitre font-mono">T1566.001 (78% of incidents)</span>
        </button>
        <button type="button" class="vector-tab ${initialAccess.selectedVector === 'vulnerability' ? 'active' : ''}" data-vector="vulnerability" role="tab">
          <span class="vector-tab-title">🌐 Edge VPN / RCE Exploit</span>
          <span class="vector-tab-mitre font-mono">T1190 (Citrix / Fortinet)</span>
        </button>
        <button type="button" class="vector-tab ${initialAccess.selectedVector === 'rdp' ? 'active' : ''}" data-vector="rdp" role="tab">
          <span class="vector-tab-title">🔑 Compromised RDP / Creds</span>
          <span class="vector-tab-mitre font-mono">T1133 (Initial Access Broker)</span>
        </button>
      </div>

      <!-- Main Stage Split Layout -->
      <div class="stage-split-grid">
        <!-- Left: Interactive Vector Visualizer -->
        <div class="cyber-panel vector-visualizer-panel">
          <div class="panel-header">
            <div class="panel-title">
              <span class="panel-icon">📬</span>
              <span>Vector Simulation: ${initialAccess.selectedVector.toUpperCase()}</span>
            </div>
            <span class="panel-tag font-mono">ATTACK SURFACE</span>
          </div>

          <div class="panel-body">
            ${renderVectorContent(initialAccess.selectedVector, isTriggered)}
          </div>
        </div>

        <!-- Right: Real-time Payload & Ingress Telemetry -->
        <div class="cyber-panel telemetry-execution-panel">
          <div class="panel-header">
            <div class="panel-title">
              <span class="panel-icon">⚡</span>
              <span>C2 Callback & Ingress Execution</span>
            </div>
            <span class="panel-tag font-mono ${isTriggered ? 'tag-danger' : 'tag-neutral'}">
              ${isTriggered ? 'BEACON ACTIVE' : 'AWAITING PAYLOAD'}
            </span>
          </div>

          <div class="panel-body execution-body">
            <!-- Stage Flow Timeline -->
            <div class="execution-flow">
              <div class="flow-step ${isTriggered ? 'completed' : 'pending'}">
                <div class="flow-step-icon font-mono">1</div>
                <div class="flow-step-content">
                  <div class="flow-step-title">Weaponized Payload Delivery</div>
                  <div class="flow-step-desc font-mono">Malicious macro embedded in .XLSM document disguised as vendor invoice.</div>
                </div>
              </div>

              <div class="flow-step ${isTriggered ? 'completed' : 'pending'}">
                <div class="flow-step-icon font-mono">2</div>
                <div class="flow-step-content">
                  <div class="flow-step-title">Process Injection & Evasion</div>
                  <div class="flow-step-desc font-mono">WINWORD.EXE calls cmd.exe -> powershell.exe -w hidden (AMSI Bypass).</div>
                </div>
              </div>

              <div class="flow-step ${isTriggered ? 'completed' : 'pending'}">
                <div class="flow-step-icon font-mono">3</div>
                <div class="flow-step-content">
                  <div class="flow-step-title">Encrypted C2 Beacon Ingress</div>
                  <div class="flow-step-desc font-mono">TLS 1.3 reverse shell beacon connects out to ${initialAccess.c2Server}.</div>
                </div>
              </div>
            </div>

            <!-- C2 Status Display Card -->
            <div class="c2-status-box ${isTriggered ? 'active-c2' : ''}">
              <div class="c2-header">
                <span class="c2-dot ${isTriggered ? 'c2-online' : 'c2-offline'}"></span>
                <span class="c2-label font-mono">${isTriggered ? 'C2 TUNNEL ONLINE (HTTPS/443)' : 'C2 STANDBY (LISTENING)'}</span>
              </div>
              <div class="c2-data-grid font-mono">
                <div class="c2-item">
                  <span class="c2-k">Attacker IP:</span>
                  <span class="c2-v">185.220.101.44 (Tor Exit)</span>
                </div>
                <div class="c2-item">
                  <span class="c2-k">Beacon ID:</span>
                  <span class="c2-v">${isTriggered ? initialAccess.beaconId : 'Awaiting Connection...'}</span>
                </div>
                <div class="c2-item">
                  <span class="c2-k">User Context:</span>
                  <span class="c2-v">MEGACORP\\jsmith (Std Token)</span>
                </div>
                <div class="c2-item">
                  <span class="c2-k">Sleep Jitter:</span>
                  <span class="c2-v">3000ms ± 20%</span>
                </div>
              </div>
            </div>

            ${isTriggered ? `
              <div class="stage-next-action-row">
                <button type="button" class="btn-next-step" id="btn-goto-step-2">
                  <span>Advance to Step 2: Privilege Escalation</span>
                  <svg class="btn-icon" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd" />
                  </svg>
                </button>
              </div>
            ` : ''}
          </div>
        </div>
      </div>

      <!-- Blue Team Mitigation Reference Accordion -->
      <div class="cyber-panel defense-panel">
        <div class="panel-header">
          <div class="panel-title">
            <span class="panel-icon">🛡️</span>
            <span>Blue Team Defenses: How to Break the Initial Access Step</span>
          </div>
          <span class="defense-badge font-mono">PREVENTION PLAYBOOK</span>
        </div>
        <div class="panel-body defense-body">
          <div class="defense-card">
            <div class="defense-title">Block Office Macros from the Internet</div>
            <div class="defense-desc">Deploy Microsoft GPO to block untrusted macros in downloaded documents (Mark-of-the-Web enforcement).</div>
          </div>
          <div class="defense-card">
            <div class="defense-title">Enforce Phishing-Resistant MFA</div>
            <div class="defense-desc">Mandate FIDO2 / WebAuthn security keys for all VPN, email, and external remote desktop gateways.</div>
          </div>
          <div class="defense-card">
            <div class="defense-title">Attack Surface Reduction (ASR)</div>
            <div class="defense-desc">Enable rule: <code>Block Office applications from creating child processes (D4F940AB-401B...)</code> to stop PowerShell spawns.</div>
          </div>
        </div>
      </div>
    </div>
  `;

  // Helper to render interactive vector details
  function renderVectorContent(vector, triggered) {
    if (vector === 'phishing') {
      return `
        <div class="email-mockup-container">
          <div class="email-chrome">
            <div class="email-dot red"></div>
            <div class="email-dot yellow"></div>
            <div class="email-dot green"></div>
            <span class="email-subject-bar font-mono">Inbox // Outlook Web App - Message Preview</span>
          </div>
          <div class="email-content">
            <div class="email-field"><span class="email-label">From:</span> Global Accounts Billing &lt;billing-notice@global-invoicing-gateway.com&gt;</div>
            <div class="email-field"><span class="email-label">To:</span> John Smith &lt;jsmith@megacorp.internal&gt;</div>
            <div class="email-field"><span class="email-label">Date:</span> Today, 14:12 PM</div>
            <div class="email-field"><span class="email-label">Subject:</span> <strong class="text-danger">FINAL NOTICE: Overdue Invoice #INV-2026-9941.xlsm ($84,920.00)</strong></div>
            
            <div class="email-body-text">
              <p>Dear John,</p>
              <p>Our records show your vendor contract payment is 14 days overdue. Please open the attached remittance ledger immediately to verify your wire transfer details and prevent account suspension.</p>
            </div>

            <!-- Malicious Attachment Card -->
            <div class="email-attachment-box ${triggered ? 'detonated' : ''}" id="attachment-click-target">
              <div class="attachment-icon">📊</div>
              <div class="attachment-details">
                <div class="attachment-name">Invoice_Audit_Remittance_Q4.xlsm</div>
                <div class="attachment-sub font-mono">Macro-Enabled Excel Workbook • 342 KB • Status: ${triggered ? 'EXECUTED ⚠️' : 'Ready to inspect'}</div>
              </div>
              <button type="button" class="btn-inspect-attachment" id="btn-inspect-macro">
                ${triggered ? 'Payload Detonated' : 'Inspect / Open'}
              </button>
            </div>
          </div>
        </div>
      `;
    } else if (vector === 'vulnerability') {
      return `
        <div class="vector-sub-exploit">
          <div class="exploit-header">
            <span class="cve-tag">CVE-2023-4966</span>
            <span class="exploit-name font-mono">Citrix NetScaler ADC Memory Leak (Citrix Bleed)</span>
          </div>
          <p class="exploit-text">
            Threat actors query unauthenticated endpoints to read uninitialized memory buffers, 
            extracting valid administrative session tokens without needing passwords or MFA.
          </p>
          <div class="code-snippet font-mono">
            GET /oauth/idp/.well-known/openid-configuration HTTP/1.1<br>
            Host: vpn.megacorp.internal<br>
            Header-Payload: Overflow string [0x41 0x41 0x41 ...]<br>
            <span class="text-emerald">&lt;-- Leaked Auth Token: Bearer eyJhbGciOi... (Valid Admin Session)</span>
          </div>
          <button type="button" class="btn-inspect-attachment mt-2" id="btn-trigger-exploit-alt">
            Launch Perimeter Exploit Probe
          </button>
        </div>
      `;
    } else {
      return `
        <div class="vector-sub-exploit">
          <div class="exploit-header">
            <span class="cve-tag">DARK WEB LEAK</span>
            <span class="exploit-name font-mono">RDP Credential Spray & Access Broker Sale</span>
          </div>
          <p class="exploit-text">
            Compromised corporate credentials purchased on underground dark web forums (Genesis Market / Russian Market) 
            originating from infostealer logs (RedLine / Lumma Stealer).
          </p>
          <div class="code-snippet font-mono">
            Target: 192.168.4.120:3389 (RDP Remote Desktop)<br>
            Credentials Tested: MEGACORP\\jsmith : P@ssw0rd2026!<br>
            <span class="text-emerald">&lt;-- [SUCCESS] RDP Session Established (Client: xfreerdp)</span>
          </div>
          <button type="button" class="btn-inspect-attachment mt-2" id="btn-trigger-exploit-alt">
            Simulate RDP Credential Ingress
          </button>
        </div>
      `;
    }
  }

  // Event handlers
  container.querySelectorAll('.vector-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      sound.playClick();
      const vector = tab.getAttribute('data-vector');
      actions.onSelectVector(vector);
    });
  });

  const triggerBtn = container.querySelector('#btn-trigger-initial-access');
  if (triggerBtn) {
    triggerBtn.addEventListener('click', () => {
      sound.playAlert();
      actions.onTriggerAccess();
    });
  }

  const inspectBtn = container.querySelector('#btn-inspect-macro');
  if (inspectBtn) {
    inspectBtn.addEventListener('click', () => {
      sound.playAlert();
      actions.onTriggerAccess();
    });
  }

  const altExploitBtn = container.querySelector('#btn-trigger-exploit-alt');
  if (altExploitBtn) {
    altExploitBtn.addEventListener('click', () => {
      sound.playAlert();
      actions.onTriggerAccess();
    });
  }

  const gotoStep2Btn = container.querySelector('#btn-goto-step-2');
  if (gotoStep2Btn) {
    gotoStep2Btn.addEventListener('click', () => {
      sound.playStageChange();
      actions.onSelectStage('privilege-escalation');
    });
  }
}
