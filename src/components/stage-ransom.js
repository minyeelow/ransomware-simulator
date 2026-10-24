/**
 * Stage 4: Training-only negotiation portal.
 * No real payment is processed and the wallet shown is fictional.
 */
import { sound } from '../sound.js';

const DECRYPTION_COMMAND = `openssl enc -d -aes-256-cbc -pbkdf2 \\
  -pass pass:'ProfPleaseGiveUsA+' \\
  -in "$HOME/Downloads/IS613CourseOutline.pdf.enc" \\
  -out "$HOME/Downloads/IS613CourseOutline_decrypted.pdf"`;

export function renderRansom(container, state, actions) {
  const { ransom } = state;
  const paymentConfirmed = ransom.paymentConfirmed === true;
  const commandRevealed = container._decryptCommandRevealed === true;

  container.innerHTML = `
    <div class="stage-view-container animate-fade-in" id="stage-ransom">
      <div class="stage-header-bar">
        <div class="stage-title-group">
          <div class="stage-eyebrow text-crimson">STEP 04 OF 05 // NEGOTIATION PORTAL</div>
          <h1 class="stage-main-title">Recovery Negotiation Portal</h1>
          <p class="stage-description">
            This is a training-only representation of a ransomware negotiation
            portal. The wallet and payment controls below are fictional.
          </p>
        </div>
        <div class="stage-action-cta">
          <div class="status-pill ${paymentConfirmed ? 'status-pill-warn' : 'status-pill-danger'}">
            <span class="pulsing-dot ${paymentConfirmed ? 'yellow' : 'red'}"></span>
            ${paymentConfirmed ? 'Simulated Payment Recorded' : 'Payment Required'}
          </div>
        </div>
      </div>

      <div class="cyber-panel ransom-portal-card mt-3">
        <div class="panel-header">
          <div class="panel-title">
            <span class="panel-icon">🧅</span>
            <span>Encrypted File Recovery Desk</span>
          </div>
          <span class="panel-tag font-mono">TRAINING PORTAL</span>
        </div>
        <div class="panel-body">
          <div class="ransom-portal-banner">
            <div class="text-danger font-mono">RECOVERY SESSION ${ransom.victimId}</div>
            <h2 class="mt-1">Your practice file is ready for recovery</h2>
            <p class="text-sm text-muted">
              Complete the simulated payment step to unlock the training recovery
              instructions. No cryptocurrency transaction will be sent.
            </p>
          </div>

          <div class="ransom-payment-grid mt-3">
            <div class="ransom-detail-card">
              <div class="metric-label">Requested amount</div>
              <div class="metric-value font-mono text-danger">${ransom.ransomBtc}</div>
              <div class="metric-sub">${ransom.ransomAmountUsd}</div>
            </div>
            <div class="ransom-detail-card">
              <div class="metric-label">Fictional wallet</div>
              <code class="wallet-address">bc1q-training-only-wallet-never-pay</code>
              <div class="metric-sub">Do not send funds to any address.</div>
            </div>
            <div class="ransom-detail-card">
              <div class="metric-label">Protected file</div>
              <div class="metric-value font-mono">IS613CourseOutline.pdf.enc</div>
              <div class="metric-sub">Expected location: ~/Downloads</div>
            </div>
          </div>

          <div class="simulation-warning-panel mt-3">
            <strong class="text-amber">Training simulation only:</strong>
            this portal does not connect to a blockchain, process payments, or
            contact a threat actor.
          </div>

          <div class="stage-footer-actions mt-3">
            <button
              type="button"
              class="action-btn-primary glow-crimson"
              id="btn-simulated-payment"
              ${paymentConfirmed ? 'disabled' : ''}
            >
              ${paymentConfirmed ? '✓ Simulated Payment Complete' : 'Mark Simulated Payment Complete'}
            </button>
            <button
              type="button"
              class="btn-next-step"
              id="btn-reveal-decrypt"
              ${paymentConfirmed ? '' : 'disabled'}
            >
              ${commandRevealed ? 'Recovery Command Revealed' : 'Decrypt Practice File'}
            </button>
          </div>

          ${commandRevealed ? `
            <div class="cyber-panel mt-3 animate-fade-in">
              <div class="panel-header">
                <div class="panel-title">
                  <span class="panel-icon">🔓</span>
                  <span>Recovery command</span>
                </div>
                <button type="button" class="btn-primary-confirm" id="btn-copy-decrypt-command">
                  Copy command
                </button>
              </div>
              <div class="panel-body">
                <p class="text-sm text-muted">
                  Run this locally after confirming that the encrypted practice
                  file exists in your Downloads folder.
                </p>
                <textarea
                  id="ransom-decryption-command"
                  class="cyber-textarea font-mono mt-2"
                  rows="5"
                  readonly
                  aria-label="Practice file decryption command"
                >${escapeHtml(DECRYPTION_COMMAND)}</textarea>
              </div>
            </div>
          ` : ''}
        </div>
      </div>

      <div class="stage-footer-actions mt-3">
        <button type="button" class="btn-next-step" id="btn-goto-step-5">
          <span>Continue to Step 5: Decryption &amp; Incident Remediation</span>
          <svg class="btn-icon" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 010-2h11.586l-2.293-2.293a1 1 0 011.414 0z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  `;

  const paymentButton = container.querySelector('#btn-simulated-payment');
  paymentButton?.addEventListener('click', () => {
    sound.playSuccess();
    actions.onConfirmSimulatedPayment();
  });

  const revealButton = container.querySelector('#btn-reveal-decrypt');
  revealButton?.addEventListener('click', () => {
    container._decryptCommandRevealed = true;
    sound.playClick();
    renderRansom(container, state, actions);
  });

  const copyButton = container.querySelector('#btn-copy-decrypt-command');
  copyButton?.addEventListener('click', async () => {
    const command = container.querySelector('#ransom-decryption-command');
    if (!command) return;

    try {
      await navigator.clipboard.writeText(command.value);
      copyButton.textContent = 'Copied';
      sound.playSuccess();
    } catch (error) {
      command.select();
      copyButton.textContent = 'Select and copy';
      console.warn('Clipboard access was unavailable:', error);
    }
  });

  const gotoStep5Button = container.querySelector('#btn-goto-step-5');
  gotoStep5Button?.addEventListener('click', () => {
    sound.playStageChange();
    actions.onSelectStage('decryption');
  });
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
