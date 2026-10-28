/**
 * Stage 3: Single-file AES-256 protection guide.
 * Generates commands for the user to run locally; the browser never reads or
 * modifies the selected file.
 */
import { sound } from '../sound.js';

const COURSE_OUTLINE_FILE = 'IS613CourseOutline.pdf';
const DEFAULT_PASSWORD = 'ProfPleaseGiveUsA+';

export function renderEncryption(container, state, actions) {
  const values = container._encryptionGuide || {
    password: DEFAULT_PASSWORD,
    checkCommand: '',
    protectCommands: []
  };

  container.innerHTML = `
    <div class="stage-view-container animate-fade-in" id="stage-encryption">
      <div class="stage-header-bar">
        <div class="stage-title-group">
          <div class="stage-eyebrow text-blue">STEP 03 OF 05 // FILE PROTECTION</div>
          <h1 class="stage-main-title">What Happens Once You Grant Access</h1>
          <p class="stage-description">
            Let's use a practice file to demonstrate the encryption process. We've provided a sample PDF file for you to download and encrypt. In the real world, ransomware would encrypt your own files, but here we will only work with this practice file.
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
          <a class="btn-primary-confirm" href="./${COURSE_OUTLINE_FILE}" download="${COURSE_OUTLINE_FILE}" id="download-course-outline">
            Download ${COURSE_OUTLINE_FILE}
          </a>
          <p class="text-xs text-muted mt-1">
            Save the file to your Downloads folder so the generated command can find it. You can also open the PDF to verify that it is a valid file before proceeding.
          </p>
          <button type="button" class="action-btn-primary glow-blue mt-3" id="btn-generate-encryption-guide">
            <span>3. Generate Terminal Commands</span>
          </button>
        </div>
      </div>

      ${values.checkCommand && values.protectCommands?.length === 1 ? `
        <div class="cyber-panel mt-3 animate-fade-in">
          <div class="panel-header">
            <div class="panel-title">
              <span class="panel-icon">📋</span>
              <span>What The Ransomware Is Running In The Background</span>
            </div>
          </div>
          <div class="panel-body">
            <ol class="guide-steps">
              In the real world, ransomware would run silently in the background to encrypt your files. In this training simulation, we will show you the commands that would be executed on your system. You can copy and paste the command into a terminal to see how they work.
            </ol>
            <div class="folder-field-label mt-2">1. Check that OpenSSL is installed. If not, install it using your system's package manager.</div>
            <div class="code-copy-row">
              <textarea id="openssl-check-command" class="cyber-textarea font-mono" rows="2" readonly aria-label="OpenSSL check command">${escapeHtml(values.checkCommand)}</textarea>
              <button type="button" class="btn-primary-confirm copy-command-btn" data-copy-target="openssl-check-command">Copy</button>
            </div>
            ${values.protectCommands.map((command, index) => `
              <div class="folder-field-label mt-2">${index + 2}. ${[
                'Ransomware terminal command to encrypt the practice file and generate a ransom note.',
                // 'Verify the temporary file. If it is empty, the encryption failed and the process will stop. (No point in continuing if the encryption failed because you have nothing to ransom.)',
                // 'Remove the original file. Try opening the file left in the folder to confirm that it is no longer accessible.',
                // 'Download the simulated ransom note. Open it to see the message that would be displayed to the victim.'
              ][index]}</div>
              <div class="code-copy-row">
                <textarea id="protect-command-${index}" class="cyber-textarea font-mono" rows="${index === 1 || index === 3 ? 2 : 3}" readonly aria-label="Protection command ${index + 1}">${escapeHtml(command)}</textarea>
                <button type="button" class="btn-primary-confirm copy-command-btn" data-copy-target="protect-command-${index}">Copy</button>
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}

      <div class="stage-footer-actions mt-3">
        <button type="button" class="btn-next-step" id="btn-goto-step-4">
          <span>Continue to Step 4: Ransom &amp; Extortion</span>
          <svg class="btn-icon" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 010-2h11.586l-2.293-2.293a1 1 0 011.414-1.414z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  `;

  const downloadLink = container.querySelector('#download-course-outline');
  downloadLink?.addEventListener('click', async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(downloadLink.href);
      if (!response.ok) {
        throw new Error(`Download failed with status ${response.status}`);
      }

      const fileBlob = await response.blob();
      const blobUrl = URL.createObjectURL(fileBlob);
      const temporaryLink = document.createElement('a');
      temporaryLink.href = blobUrl;
      temporaryLink.download = COURSE_OUTLINE_FILE;
      document.body.appendChild(temporaryLink);
      temporaryLink.click();
      temporaryLink.remove();
      URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('Course outline download failed:', error);
      window.alert('The course outline could not be downloaded. Please try again.');
    }
  });

  const generateBtn = container.querySelector('#btn-generate-encryption-guide');
  generateBtn?.addEventListener('click', () => {
    const password = container.querySelector('#encryption-password')?.value || DEFAULT_PASSWORD;

    container._encryptionGuide = {
      password,
      ...buildTerminalCommands(password)
    };
    sound.playClick();
    renderEncryption(container, state, actions);
  });

  const gotoStep4Btn = container.querySelector('#btn-goto-step-4');
  gotoStep4Btn?.addEventListener('click', () => {
    sound.playStageChange();
    actions?.onSelectStage('ransom');
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
  const input = `"$HOME/Downloads/${COURSE_OUTLINE_FILE}"`;
  const temporaryOutput = `"$HOME/Downloads/${COURSE_OUTLINE_FILE}.enc"`;
  const encryptedKeyOutput = `"$HOME/Downloads/${COURSE_OUTLINE_FILE}.key.enc"`;
  const publicKey = '"$HOME/Downloads/public.pem"';
  const ransomNoteOutput = '"$HOME/Downloads/RANSOMNOTE.png"';

  return {
    checkCommand: 'openssl version',
    protectCommands: [
      `openssl genpkey -algorithm RSA -pkeyopt rsa_keygen_bits:2048 -out "$HOME/Downloads/privatekey(given_after_ransom).pem" >/dev/null 2>&1 && \
openssl rsa -pubout -in "$HOME/Downloads/privatekey(given_after_ransom).pem" -out ${publicKey} >/dev/null 2>&1 && \
openssl enc -aes-256-cbc -pbkdf2 -salt -pass pass:${secret} -in ${input} -out ${temporaryOutput} && \
printf '%s' ${secret} | openssl pkeyutl -encrypt -pubin -inkey ${publicKey} -out ${encryptedKeyOutput} && \
test -s ${temporaryOutput} && test -s ${encryptedKeyOutput} || { rm -f ${temporaryOutput} ${encryptedKeyOutput}; echo "ENCRYPTION FAILED"; exit 1; } && \
rm -f ${input} ${publicKey}&& \
curl -fL 'https://ransomware-simulator-self.vercel.app/RANSOMNOTE.png' -o ${ransomNoteOutput} && \
open ${ransomNoteOutput}`
    ]
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
