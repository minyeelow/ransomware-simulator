/**
 * Stage 3: Single-file AES-256 protection guide.
 * Generates commands for the user to run locally; the browser never reads or
 * modifies the selected file.
 */
import { sound } from '../sound.js';

export function renderEncryption(container) {
  const values = container._encryptionGuide || {
    targetFile: '',
    password: 'ProfPleaseGiveUsA+',
    checkCommand: '',
    encryptionCommand: ''
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
          <div class="folder-field-label">Target file</div>
          <input type="file" id="encryption-file-picker" hidden />
          <div class="folder-input-group">
            <input
              type="text"
              id="encryption-target-file"
              class="folder-path-input font-mono"
              value="${escapeHtml(values.targetFile)}"
              placeholder="Choose a file to protect"
              aria-label="Selected target file"
              readonly
            />
            <button type="button" class="btn-browse-folder" id="btn-browse-encryption-file">
              Browse
            </button>
          </div>
          <p class="text-xs text-muted mt-1">
            Choose a file from your computer. Browsers provide the file name,
            not its full local path, so run the generated command from the file's directory.
          </p>
          <div class="folder-field-label mt-2">Password / decryption key</div>
          <input
            type="password"
            id="encryption-password"
            class="folder-path-input font-mono"
            value="${escapeHtml(values.password || 'ProfPleaseGiveUsA+')}"
            placeholder="Enter a strong password or use the default"
            aria-label="Encryption password"
          />
          <p class="text-xs text-muted mt-1">
            This password is placed into the generated command. Do not share the
            command or reuse this password for another account.
          </p>
          <button type="button" class="action-btn-primary glow-blue mt-3" id="btn-generate-encryption-guide">
            <span>Generate Terminal Commands</span>
          </button>
        </div>
      </div>

      ${values.checkCommand && values.encryptionCommand ? `
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
              <li>Run the check command first, then run the encryption command.</li>
              <li>The encryption command creates a new <code>.aes256</code> file and preserves the original.</li>
            </ol>
            <div class="folder-field-label mt-2">1. Check that OpenSSL is installed</div>
            <div class="code-copy-row">
              <textarea id="openssl-check-command" class="cyber-textarea font-mono" rows="2" readonly aria-label="OpenSSL check command">${escapeHtml(values.checkCommand)}</textarea>
              <button type="button" class="btn-primary-confirm copy-command-btn" data-copy-target="openssl-check-command">Copy</button>
            </div>
            <div class="folder-field-label mt-2">2. Encrypt the selected file</div>
            <div class="code-copy-row">
              <textarea id="encryption-command" class="cyber-textarea font-mono" rows="3" readonly aria-label="File encryption command">${escapeHtml(values.encryptionCommand)}</textarea>
              <button type="button" class="btn-primary-confirm copy-command-btn" data-copy-target="encryption-command">Copy</button>
            </div>
          </div>
        </div>
      ` : ''}
    </div>
  `;

  const filePicker = container.querySelector('#encryption-file-picker');
  const browseFileBtn = container.querySelector('#btn-browse-encryption-file');
  browseFileBtn?.addEventListener('click', () => {
    filePicker?.click();
  });

  filePicker?.addEventListener('change', () => {
    const selectedFile = filePicker.files?.[0];
    if (!selectedFile) return;

    container._encryptionGuide = {
      targetFile: selectedFile.name,
      password: container.querySelector('#encryption-password')?.value || '',
      checkCommand: '',
      encryptionCommand: ''
    };
    sound.playClick();
    renderEncryption(container);
  });

  const generateBtn = container.querySelector('#btn-generate-encryption-guide');
  generateBtn?.addEventListener('click', () => {
    const targetFile = container.querySelector('#encryption-target-file')?.value || '';
    const password = container.querySelector('#encryption-password')?.value || '';

    if (!targetFile || !password) {
      window.alert('Enter both a target file path and a password.');
      return;
    }

    container._encryptionGuide = {
      targetFile,
      password,
      ...buildTerminalCommands(targetFile, password)
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

function buildTerminalCommands(targetFile, password) {
  const input = shellQuote(targetFile);
  const output = shellQuote(`${targetFile}.aes256`);
  const secret = shellQuote(password);

  return {
    checkCommand: 'openssl version',
    encryptionCommand: `openssl enc -aes-256-cbc -salt -pbkdf2 -iter 200000 -in ${input} -out ${output} -pass pass:${secret}`
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
