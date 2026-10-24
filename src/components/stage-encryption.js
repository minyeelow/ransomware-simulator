/**
 * Stage 3: Single-file AES-256 protection guide.
 * Generates commands for the user to run locally; the browser never reads or
 * modifies the selected file.
 */
import { sound } from '../sound.js';

const COURSE_OUTLINE_FILE = 'IS613CourseOutline.pdf';
const DEFAULT_PASSWORD = 'ProfPleaseGiveUsA+';

export function renderEncryption(container) {
  const values = container._encryptionGuide || {
    password: DEFAULT_PASSWORD,
    checkCommand: '',
    protectCommand: ''
  };

  container.innerHTML = `
    <div class="stage-view-container animate-fade-in" id="stage-encryption">
      <div class="stage-header-bar">
        <div class="stage-title-group">
          <div class="stage-eyebrow text-blue">STEP 03 OF 05 // FILE PROTECTION</div>
          <h1 class="stage-main-title">Protect a Single File</h1>
          <p class="stage-description">
            Generate local OpenSSL commands that use <strong>AES-256</strong> to
            protect one file with a password. Nothing runs in the browser, and
            the original file is never deleted or overwritten.
          </p>
        </div>
      </div>

      <div class="cyber-panel mt-3">
        <div class="panel-header">
          <div class="panel-title">
            <span class="panel-icon">🔐</span>
            <span>Encryption Inputs</span>
          </div>
          <span class="panel-tag font-mono">LOCAL TERMINAL GUIDE</span>
        </div>
        <div class="panel-body">
          <div class="folder-field-label">1. Download the practice file</div>
          <a class="btn-primary-confirm" href="./${COURSE_OUTLINE_FILE}" download>
            Download ${COURSE_OUTLINE_FILE}
          </a>
          <p class="text-xs text-muted mt-1">
            Save the file to your Downloads folder so the generated command can find it.
          </p>
          <div class="folder-field-label mt-2">2. Password / decryption key</div>
          <input
            type="password"
            id="encryption-password"
            class="folder-path-input font-mono"
            value="${escapeHtml(values.password || DEFAULT_PASSWORD)}"
            placeholder="Enter a strong password or use the default"
            aria-label="Encryption password"
          />
          <p class="text-xs text-muted mt-1">
            This password is placed into the generated command. Do not share the
            command or reuse this password for another account.
          </p>
          <p class="text-xs text-amber mt-1">
            Hint: after generating the command, see if you can spot the password in it.
          </p>
          <button type="button" class="action-btn-primary glow-blue mt-3" id="btn-generate-encryption-guide">
            <span>3. Generate Terminal Commands</span>
          </button>
        </div>
      </div>

      ${values.checkCommand && values.protectCommand ? `
        <div class="cyber-panel mt-3 animate-fade-in">
          <div class="panel-header">
            <div class="panel-title">
              <span class="panel-icon">📋</span>
              <span>Step-by-step terminal instructions</span>
            </div>
          </div>
          <div class="panel-body">
            <ol class="guide-steps">
              <li>Open Terminal on macOS/Linux, or use a shell with OpenSSL installed.</li>
              <li>Run the check command first, then run the protection command.</li>
              <li>The protection command reads the downloaded file from <code>~/Downloads</code> and creates a new <code>.aes256</code> file without changing the original.</li>
            </ol>
            <div class="folder-field-label mt-2">1. Check that OpenSSL is installed</div>
            <div class="code-copy-row">
              <textarea id="openssl-check-command" class="cyber-textarea font-mono" rows="2" readonly aria-label="OpenSSL check command">${escapeHtml(values.checkCommand)}</textarea>
              <button type="button" class="btn-primary-confirm copy-command-btn" data-copy-target="openssl-check-command">Copy</button>
            </div>
            <div class="folder-field-label mt-2">2. Locate and encrypt the selected file</div>
            <div class="code-copy-row">
              <textarea id="protect-file-command" class="cyber-textarea font-mono" rows="6" readonly aria-label="File location and encryption command">${escapeHtml(values.protectCommand)}</textarea>
              <button type="button" class="btn-primary-confirm copy-command-btn" data-copy-target="protect-file-command">Copy</button>
            </div>
          </div>
        </div>
      ` : ''}
    </div>
  `;

  const generateBtn = container.querySelector('#btn-generate-encryption-guide');
  generateBtn?.addEventListener('click', () => {
    const password = container.querySelector('#encryption-password')?.value || '';

    if (!password) {
      window.alert('Enter a password before generating the commands.');
      return;
    }

    container._encryptionGuide = {
      password,
      ...buildTerminalCommands(password)
    };
    sound.playClick();
    renderEncryption(container);
  });

  container.querySelectorAll('.copy-command-btn').forEach((copyBtn) => {
    copyBtn.addEventListener('click', async () => {
    const output = container.querySelector(`#${copyBtn.dataset.copyTarget}`);
    if (!output) return;

    try {
      await navigator.clipboard.writeText(output.value);
      copyBtn.textContent = 'Copied';
      sound.playSuccess();
    } catch (error) {
      output.select();
      copyBtn.textContent = 'Select and copy';
      console.warn('Clipboard access was unavailable:', error);
    }
    });
  });
}

function buildTerminalCommands(password) {
  const secret = shellQuote(password);

  return {
    checkCommand: 'openssl version',
    protectCommand: `openssl enc -aes-256-cbc -salt -pbkdf2 -iter 200000 -in "$HOME/Downloads/${COURSE_OUTLINE_FILE}" -out "$HOME/Downloads/${COURSE_OUTLINE_FILE}.aes256" -pass pass:${secret}`
  };
}

function shellQuote(value) {
  return `'${String(value).replace(/'/g, `'\\''`)}'`;
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
