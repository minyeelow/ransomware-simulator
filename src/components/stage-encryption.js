/**
 * Stage 3: Single-file AES-256 protection guide.
 * Generates commands for the user to run locally; the browser never reads or
 * modifies the selected file.
 */
import { sound } from '../sound.js';

export function renderEncryption(container) {
  const values = container._encryptionGuide || {
    targetFile: '',
    password: '',
    commands: ''
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
            value="${escapeHtml(values.password)}"
            placeholder="Enter a strong password"
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

      ${values.commands ? `
        <div class="cyber-panel mt-3 animate-fade-in">
          <div class="panel-header">
            <div class="panel-title">
              <span class="panel-icon">📋</span>
              <span>Step-by-step terminal instructions</span>
            </div>
            <button type="button" class="btn-primary-confirm" id="btn-copy-encryption-guide">Copy commands</button>
          </div>
          <div class="panel-body">
            <ol class="guide-steps">
              <li>Open Terminal on macOS/Linux, or use a shell with OpenSSL installed.</li>
              <li>Paste the encryption command below. It creates a new <code>.aes256</code> file and preserves the original.</li>
              <li>Keep the password safe. You need the same password to decrypt the protected copy.</li>
              <li>Use the final command only when you intentionally want to restore a copy.</li>
            </ol>
            <textarea
              id="encryption-command-output"
              class="cyber-textarea font-mono"
              rows="9"
              readonly
              aria-label="Generated terminal commands"
            >${escapeHtml(values.commands)}</textarea>
            <div class="text-xs text-amber mt-2">
              Warning: commands containing passwords may be visible in terminal
              history. For important data, use a password prompt instead.
            </div>
          </div>
        </div>
      ` : ''}

      <div class="cyber-panel defense-panel mt-3">
        <div class="panel-header">
          <div class="panel-title">
            <span class="panel-icon">🛡️</span>
            <span>Safe file-protection practices</span>
          </div>
          <span class="defense-badge font-mono">AES-256-GCM ALTERNATIVE</span>
        </div>
        <div class="panel-body defense-body">
          <div class="defense-card">
            <div class="defense-title">Protect a copy first</div>
            <div class="defense-desc">Verify the output file opens correctly before moving or deleting any original data.</div>
          </div>
          <div class="defense-card">
            <div class="defense-title">Use a unique password</div>
            <div class="defense-desc">A strong, unique password is the practical decryption key. If it is lost, recovery may not be possible.</div>
          </div>
          <div class="defense-card">
            <div class="defense-title">Check OpenSSL availability</div>
            <div class="defense-desc">Run <code>openssl version</code> before using the generated commands.</div>
          </div>
        </div>
      </div>
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
      commands: ''
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
      commands: buildTerminalCommands(targetFile, password)
    };
    sound.playClick();
    renderEncryption(container);
  });

  const copyBtn = container.querySelector('#btn-copy-encryption-guide');
  copyBtn?.addEventListener('click', async () => {
    const output = container.querySelector('#encryption-command-output');
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
}

function buildTerminalCommands(targetFile, password) {
  const input = shellQuote(targetFile);
  const output = shellQuote(`${targetFile}.aes256`);
  const secret = shellQuote(password);

  return `# Check that OpenSSL is installed
openssl version

# Encrypt one file with AES-256-CBC and PBKDF2
openssl enc -aes-256-cbc -salt -pbkdf2 -iter 200000 -in ${input} -out ${output} -pass pass:${secret}

# Decrypt the protected copy when needed
openssl enc -d -aes-256-cbc -pbkdf2 -iter 200000 -in ${output} -out ${input}.decrypted -pass pass:${secret}`;
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
