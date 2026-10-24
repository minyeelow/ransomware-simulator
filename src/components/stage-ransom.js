/**
 * Stage 4: Ransom & Extortion Component
 * Simulates Desktop Lock Screen, HOW_TO_RECOVER_FILES.txt, and the Tor Onion Payment Portal.
 */
import { sound } from '../sound.js';

export function renderRansom(container, state, actions) {
  const { ransom, encryption } = state;
  const isDeployed = ransom.ransomNoteDeployed;
  const activeTab = ransom.activeTab || 'wallpaper';

  container.innerHTML = `
    <div class="stage-view-container animate-fade-in" id="stage-ransom">
      <!-- Stage Header -->
      <div class="stage-header-bar">
        <div class="stage-title-group">
          <div class="stage-eyebrow text-crimson">STEP 04 OF 05 // EXTORTION & DEMAND</div>
          <h1 class="stage-main-title">Ransom Note & Dark Web Portal</h1>
          <p class="stage-description">
            Modern ransomware employs <strong>Double Extortion</strong>: encrypting enterprise file assets and threatening 
            to publicly leak exfiltrated intellectual property on Dark Web blogs unless a cryptocurrency ransom is paid.
          </p>
        </div>
        <div class="stage-action-cta">
          ${isDeployed ? `
            <div class="status-pill status-pill-danger">
              <span class="pulsing-dot red"></span> Extortion Countdown Active (48h)
            </div>
          ` : `
            <button type="button" class="action-btn-primary glow-crimson" id="btn-deploy-ransom">
              <svg class="btn-icon" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
              </svg>
              <span>Deploy Extortion Notice</span>
            </button>
          `}
        </div>
      </div>

      <!-- Tab View Switcher: Wallpaper vs Tor Portal vs Text Note -->
      <div class="vector-selector-tabs" role="tablist">
        <button type="button" class="vector-tab ${activeTab === 'wallpaper' ? 'active' : ''}" data-tab="wallpaper" role="tab">
          <span class="vector-tab-title">🖥️ Desktop Lock Screen</span>
          <span class="vector-tab-mitre font-mono">Registry Wallpaper Defacement</span>
        </button>
        <button type="button" class="vector-tab ${activeTab === 'tor' ? 'active' : ''}" data-tab="tor" role="tab">
          <span class="vector-tab-title">🧅 Tor Onion Negotiation Portal</span>
          <span class="vector-tab-mitre font-mono">Payment Gateway &amp; Live Chat</span>
        </button>
        <button type="button" class="vector-tab ${activeTab === 'note' ? 'active' : ''}" data-tab="note" role="tab">
          <span class="vector-tab-title">📄 HOW_TO_RECOVER_FILES.txt</span>
          <span class="vector-tab-mitre font-mono">Dropped Ransom Readme</span>
        </button>
      </div>

      <!-- Main Stage Area -->
      <div class="ransom-main-viewport">
        ${renderActiveRansomTab(activeTab, ransom, encryption)}
      </div>

      <!-- Advance Step Action Row -->
      <div class="stage-footer-actions mt-3">
        <button type="button" class="btn-next-step" id="btn-goto-step-5">
          <span>Advance to Step 5: Decryption &amp; Incident Remediation</span>
          <svg class="btn-icon" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>

      <!-- Blue Team Mitigation Reference -->
      <div class="cyber-panel defense-panel mt-3">
        <div class="panel-header">
          <div class="panel-title">
            <span class="panel-icon">🛡️</span>
            <span>Blue Team Defenses: Responding to Extortion Demands</span>
          </div>
          <span class="defense-badge font-mono">INCIDENT COMMAND</span>
        </div>
        <div class="panel-body defense-body">
          <div class="defense-card">
            <div class="defense-title">Never Pay Without Law Enforcement Consultation</div>
            <div class="defense-desc">OFAC sanctions prohibit payments to sanctioned threat groups. Furthermore, statistics show paying does not guarantee complete data recovery.</div>
          </div>
          <div class="defense-card">
            <div class="defense-title">Data Loss Prevention (DLP) &amp; Egress Monitoring</div>
            <div class="defense-desc">Ransomware gangs exfiltrate data days before encrypting. Detecting abnormal outbound gigabyte-scale transfers (Rclone / Mega / MegaSync) stops the extortion leverage.</div>
          </div>
          <div class="defense-card">
            <div class="defense-title">Isolate Impacted Network Segments Immediately</div>
            <div class="defense-desc">Sever lateral SMB connections, isolate infected VLANs, and revoke compromised domain service account Kerberos tickets (KRBTGT double reset).</div>
          </div>
        </div>
      </div>
    </div>
  `;

  function renderActiveRansomTab(tab, ransomState, encState) {
    if (tab === 'wallpaper') {
      return `
        <div class="ransom-lockscreen-frame animate-glitch">
          <div class="lockscreen-overlay">
            <div class="lockscreen-skull">
              <svg viewBox="0 0 24 24" width="72" height="72" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M12 2C7.58 2 4 5.58 4 10c0 3.31 2.01 6.16 4.9 7.37.1.33.27.63.48.9.4.52 1 .83 1.62.83h2c.62 0 1.22-.31 1.62-.83.21-.27.38-.57.48-.9C17.99 16.16 20 13.31 20 10c0-4.42-3.58-8-8-8z"/>
                <circle cx="9" cy="10" r="1.5" fill="currentColor"/>
                <circle cx="15" cy="10" r="1.5" fill="currentColor"/>
                <path d="M10 16v2m4-2v2m-6-1h8"/>
              </svg>
            </div>
            <h2 class="lockscreen-headline font-mono">YOUR CRITICAL DATA HAS BEEN ENCRYPTED!</h2>
            <div class="lockscreen-sub font-mono">
              ALL DATABASES, SPREADSHEETS, VIRTUAL DISKS &amp; BACKUPS ARE SEALED WITH MILITARY-GRADE AES-256 + RSA-4096.
            </div>

            <!-- Victim Details Banner -->
            <div class="lockscreen-details-box font-mono">
              <div class="detail-row">
                <span class="detail-k">TARGET IDENTIFIER:</span>
                <span class="detail-v text-highlight">${ransomState.victimId}</span>
              </div>
              <div class="detail-row">
                <span class="detail-k">RANSOM REQUIREMENT:</span>
                <span class="detail-v text-danger">${ransomState.ransomBtc} (${ransomState.ransomAmountUsd})</span>
              </div>
              <div class="detail-row">
                <span class="detail-k">LEAK DEADLINE:</span>
                <span class="detail-v text-danger timer-pulse">47 HOURS 58 MINUTES REMAINING</span>
              </div>
              <div class="detail-row">
                <span class="detail-k">NEGOTIATION PORTAL:</span>
                <span class="detail-v text-cyan font-mono">${ransomState.onionUrl}</span>
              </div>
            </div>

            <p class="lockscreen-warning">
              DO NOT rename locked files. DO NOT attempt to use third-party decryptors or you will corrupt the RSA header permanently.
              Visit our Tor negotiation portal using the Tor Browser to claim your private key.
            </p>
          </div>
        </div>
      `;
    } else if (tab === 'tor') {
      return `
        <div class="tor-portal-frame">
          <div class="tor-browser-chrome font-mono">
            <span class="tor-onion-badge">🧅 TOR BROWSER SECURE</span>
            <span class="tor-url-bar">${ransomState.onionUrl}</span>
            <span class="tor-status text-emerald">● CONNECTED (Relays: DE &gt; NL &gt; IS)</span>
          </div>

          <div class="tor-portal-body">
            <!-- Tor Portal Header -->
            <div class="tor-header-hero">
              <div class="tor-portal-logo">
                <span class="portal-emblem">⚡</span>
                <div>
                  <h3 class="portal-title">LOCKBIT 3.0 // VICTIM NEGOTIATION PORTAL</h3>
                  <div class="portal-id font-mono text-muted">Session: ${ransomState.victimId}</div>
                </div>
              </div>
              <div class="tor-countdown-card font-mono">
                <div class="countdown-title">PRICE DOUBLES IN:</div>
                <div class="countdown-digits text-danger">47:58:14</div>
              </div>
            </div>

            <!-- Tor Split: Payment & Free Decrypt vs Live Operator Chat -->
            <div class="tor-grid-split">
              <div class="cyber-panel mt-3 simulation-warning-panel">
                <div class="panel-body text-sm">
                  <strong class="text-amber">Training simulation:</strong>
                  This portal and wallet are fictional. Do not send cryptocurrency
                  or interact with a real ransom demand.
                </div>
              </div>

              <!-- Left: Proof of Decryption & Double Extortion Threat -->
              <div class="tor-card">
                <h4 class="tor-card-title">1. Proof of Decryption (Test 1 File Free)</h4>
                <p class="text-sm text-muted">
                  To guarantee our decryptor functions, we will decrypt 1 non-vital file for free.
                </p>
                
                <div class="free-decrypt-selector mt-2">
                  <label class="text-xs font-mono text-muted">SELECT SAMPLE FILE TO DECRYPT:</label>
                  <select class="cyber-select font-mono" id="free-decrypt-select" ${ransomState.freeDecryptUsed ? 'disabled' : ''}>
                    ${encState.files.filter(f => !f.name.endsWith('.dit') && !f.name.endsWith('.sql')).map(f => `
                      <option value="${f.id}" ${ransomState.freeDecryptedFileId === f.id ? 'selected' : ''}>
                        ${f.name} (${f.size})
                      </option>
                    `).join('')}
                  </select>
                  <button type="button" class="btn-primary-small mt-2" id="btn-test-free-decrypt" ${ransomState.freeDecryptUsed ? 'disabled' : ''}>
                    ${ransomState.freeDecryptUsed ? '✓ Free Decrypt Verified' : '🔓 Decrypt Sample File (Free)'}
                  </button>
                </div>

                <div class="double-extortion-notice mt-3">
                  <div class="threat-header font-mono text-danger">⚠️ DOUBLE EXTORTION ARCHIVE:</div>
                  <div class="threat-body text-xs text-muted">
                    We downloaded <strong>42.8 GB</strong> of your internal files (Executive emails, payroll, and unreleased source code). 
                    If payment is not received before timer expires, files will be published to the Dark Web DLS blog.
                  </div>

                  <div class="payment-card mt-3">
                    <div class="payment-label font-mono">SIMULATED PAYMENT DESTINATION</div>
                    <code class="payment-wallet">bc1q-training-only-wallet-never-pay</code>
                    <div class="text-xs text-muted mt-1">Example wallet for classroom use only.</div>
                    <button type="button" class="btn-primary-small mt-2" id="btn-simulated-payment" ${ransomState.paymentConfirmed ? 'disabled' : ''}>
                      ${ransomState.paymentConfirmed ? '✓ Simulated Payment Marked Complete' : 'Mark Simulated Payment Complete'}
                    </button>
                  </div>

                  ${ransomState.paymentConfirmed ? `
                    <div class="cyber-panel mt-3 animate-fade-in">
                      <div class="panel-body">
                        <div class="folder-field-label">Recovery command revealed after simulated payment</div>
                        <div class="code-copy-row mt-1">
                          <textarea id="ransom-decryption-command" class="cyber-textarea font-mono" rows="4" readonly aria-label="Decryption command">openssl enc -d -aes-256-cbc -pbkdf2 \
  -pass pass:'ProfPleaseGiveUsA+' \
  -in "$HOME/Downloads/IS613CourseOutline.pdf.enc" \
  -out "$HOME/Downloads/IS613CourseOutline_decrypted.pdf"</textarea>
                          <button type="button" class="btn-primary-confirm copy-command-btn" data-copy-target="ransom-decryption-command">Copy</button>
                        </div>
                      </div>
                    </div>
                  ` : ''}
                </div>
              </div>

              <!-- Right: Live Threat Actor Chat -->
              <div class="tor-card chat-card">
                <h4 class="tor-card-title">2. Live Operator Negotiation</h4>
                <div class="chat-messages-container" id="chat-messages-box">
                  ${ransomState.chatMessages.map(m => `
                    <div class="chat-msg ${m.sender === 'operator' ? 'operator-msg' : 'victim-msg'} font-mono">
                      <div class="chat-msg-meta">${m.sender === 'operator' ? 'Threat Actor [Support #104]' : 'Victim Admin'} • ${m.time}</div>
                      <div class="chat-msg-text">${m.text}</div>
                    </div>
                  `).join('')}
                </div>
                <div class="chat-input-row">
                  <input type="text" class="chat-text-input font-mono" id="chat-user-input" placeholder="Type a message to the threat actor..." />
                  <button type="button" class="btn-chat-send" id="btn-send-chat">Send</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
    } else {
      return `
        <div class="ransom-note-editor font-mono">
          <div class="notepad-titlebar">HOW_TO_RECOVER_FILES.txt - Notepad</div>
          <div class="notepad-body">
<pre>
========================================================================================
                          >>>>> LOCKBIT 3.0 RANSOM NOTE &lt;&lt;&lt;&lt;&lt;
========================================================================================

YOUR NETWORK HAS BEEN COMPROMISED AND YOUR DATA HAS BEEN STRONGLY ENCRYPTED.

All your files, databases, documents, and backups have been encrypted using 
unbreakable hybrid AES-256 + RSA-4096 cryptographic algorithms.

All Volume Shadow Copies have been purged. Reinstalling Windows or restarting 
servers will NOT restore your files and may corrupt key metadata.

========================================================================================
                                WHAT HAPPENED TO YOUR DATA?
========================================================================================
1. Encryption: All target workstations and servers in MEGACORP.LOCAL domain locked.
2. Exfiltration: 42.8 GB of confidential accounting audits, client contracts, 
   and source code repositories were downloaded before encryption commenced.

========================================================================================
                              HOW TO RECOVER YOUR FILES?
========================================================================================
1. Download Tor Browser: https://www.torproject.org/
2. Open your unique victim negotiation portal:
   http://lockbit37x...ransomportal.onion/victim/8849
3. Follow the instructions to purchase the private key decryptor.

YOUR UNIQUE VICTIM ID: VICTIM-#8849-AF91-US
PAYMENT DEADLINE: 48 HOURS FROM INCIDENT TRIGGER

* WARNING: Editing file extensions (.ransom_locked) will permanently corrupt decryption keys!
========================================================================================
</pre>
          </div>
        </div>
      `;
    }
  }

  // Attach Event Listeners
  container.querySelectorAll('.vector-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      sound.playClick();
      const tabName = tab.getAttribute('data-tab');
      actions.onSelectRansomTab(tabName);
    });
  });

  const deployBtn = container.querySelector('#btn-deploy-ransom');
  if (deployBtn) {
    deployBtn.addEventListener('click', () => {
      sound.playAlert();
      actions.onDeployRansom();
    });
  }

  const freeDecryptBtn = container.querySelector('#btn-test-free-decrypt');
  if (freeDecryptBtn) {
    freeDecryptBtn.addEventListener('click', () => {
      sound.playSuccess();
      const select = container.querySelector('#free-decrypt-select');
      if (select) {
        actions.onTestFreeDecrypt(select.value);
      }

      const simulatedPaymentBtn = container.querySelector('#btn-simulated-payment');
      if (simulatedPaymentBtn) {
        simulatedPaymentBtn.addEventListener('click', () => {
          sound.playSuccess();
          actions.onConfirmSimulatedPayment();
        });
      }

      container.querySelectorAll('.copy-command-btn').forEach((copyBtn) => {
        copyBtn.addEventListener('click', async () => {
          const output = container.querySelector(`#${copyBtn.dataset.copyTarget}`);
          if (!output) return;

          try {
            await navigator.clipboard.writeText(output.value);
            copyBtn.textContent = 'Copied';
          } catch (error) {
            output.select();
            copyBtn.textContent = 'Select and copy';
            console.warn('Clipboard access was unavailable:', error);
          }
        });
      });
    });
  }

  const sendChatBtn = container.querySelector('#btn-send-chat');
  const chatInput = container.querySelector('#chat-user-input');
  if (sendChatBtn && chatInput) {
    const handleSend = () => {
      const text = chatInput.value.trim();
      if (text) {
        sound.playClick();
        actions.onSendChat(text);
        chatInput.value = '';
      }
    };
    sendChatBtn.addEventListener('click', handleSend);
    chatInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') handleSend();
    });
  }

  const gotoStep5Btn = container.querySelector('#btn-goto-step-5');
  if (gotoStep5Btn) {
    gotoStep5Btn.addEventListener('click', () => {
      sound.playStageChange();
      actions.onSelectStage('decryption');
    });
  }
}
