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

      ${values.macCommands && values.windowsCommands ? `
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
            ${renderCommandSection('mac', 'Mac (Terminal)', values.macCommands, true)}
            ${renderCommandSection('windows', 'Windows (PowerShell)', values.windowsCommands)}
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
    macCommands: {
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
    },
    windowsCommands: {
      checkCommand: 'powershell -NoProfile -Command "$PSVersionTable.PSVersion"',
      protectCommands: [
        `$downloads = Join-Path $HOME "Downloads"
$pdf = Join-Path $downloads "${COURSE_OUTLINE_FILE}"
$pdfEnc = Join-Path $downloads "${COURSE_OUTLINE_FILE}.enc"
$keyEnc = Join-Path $downloads "${COURSE_OUTLINE_FILE}.key.enc"
$privKey = Join-Path $downloads "privatekey(given_after_ransom).pem"
$pubKey = Join-Path $downloads "public.pem"
$note = Join-Path $downloads "RANSOMNOTE.png"
$pass = 'ProfPleaseGiveUsA+'
# Create dummy input PDF if it does not exist
if (-not (Test-Path $pdf)) {
Set-Content -Path $pdf -Value "Sample PDF Content for IS613 Course Outline"
Write-Host "Created missing input file: $pdf" -ForegroundColor Yellow
}
try {
# 1. RSA 2048-bit Key Pair Generation
$rsa = New-Object System.Security.Cryptography.RSACryptoServiceProvider(2048)

$privBlob = $rsa.ExportCspBlob($true)
$privBase64 = [Convert]::ToBase64String($privBlob, [System.Base64FormattingOptions]::InsertLineBreaks)
$privPem = "-----BEGIN RSA PRIVATE KEY-----" + [Environment]::NewLine + $privBase64 + [Environment]::NewLine + "-----END RSA PRIVATE KEY-----"
[System.IO.File]::WriteAllText($privKey, $privPem)
$pubBlob = $rsa.ExportCspBlob($false)
$pubBase64 = [Convert]::ToBase64String($pubBlob, [System.Base64FormattingOptions]::InsertLineBreaks)
$pubPem = "-----BEGIN RSA PUBLIC KEY-----" + [Environment]::NewLine + $pubBase64 + [Environment]::NewLine + "-----END RSA PUBLIC KEY-----"
[System.IO.File]::WriteAllText($pubKey, $pubPem)
# 2. AES-256-CBC File Encryption (PBKDF2 Salted)
$salt = New-Object byte[] 8
[System.Security.Cryptography.RandomNumberGenerator]::Create().GetBytes($salt)

$kdf = New-Object System.Security.Cryptography.Rfc2898DeriveBytes($pass, $salt, 10000, [System.Security.Cryptography.HashAlgorithmName]::SHA1)
$aes = [System.Security.Cryptography.Aes]::Create()
$aes.Key = $kdf.GetBytes(32)
$aes.IV = $kdf.GetBytes(16)
$aes.Mode = [System.Security.Cryptography.CipherMode]::CBC
$aes.Padding = [System.Security.Cryptography.PaddingMode]::PKCS7
$pdfBytes = [System.IO.File]::ReadAllBytes($pdf)
$encBytes = $aes.CreateEncryptor().TransformFinalBlock($pdfBytes, 0, $pdfBytes.Length)

# OpenSSL "Salted__" header + salt + ciphertext compatibility
$header = [System.Text.Encoding]::ASCII.GetBytes("Salted__")
$payload = $header + $salt + $encBytes
[System.IO.File]::WriteAllBytes($pdfEnc, $payload)
# 3. Encrypt Passphrase with RSA Public Key
$passBytes = [System.Text.Encoding]::UTF8.GetBytes($pass)
$encPass = $rsa.Encrypt($passBytes, [System.Security.Cryptography.RSAEncryptionPadding]::Pkcs1)
[System.IO.File]::WriteAllBytes($keyEnc, $encPass)
# 4. Verify Output Files
if ((Test-Path $pdfEnc) -and ((Get-Item $pdfEnc).Length -gt 0) -and (Test-Path $keyEnc) -and ((Get-Item $keyEnc).Length -gt 0)) {
Remove-Item -Path $pdf, $pubKey -ErrorAction SilentlyContinue
Invoke-WebRequest -Uri 'https://ransomware-simulator-self.vercel.app/RANSOMNOTE.png' -OutFile $note
Start-Process $note
Write-Host "Encryption finished successfully." -ForegroundColor Green
} else {
throw "Output file verification failed."
}
} catch {
Remove-Item -Path $pdfEnc, $keyEnc -ErrorAction SilentlyContinue
Write-Host "ENCRYPTION FAILED: $_" -ForegroundColor Red
}
Read-Host -Prompt "Press Enter to exit..."`
      ]
    }
  };
}

function renderCommandSection(platform, title, commands, usesOpenSsl = false) {
  const checkLabel = usesOpenSsl
    ? "1. Check that OpenSSL is installed. If not, install it using your system's package manager."
    : '1. Confirm that PowerShell is available (Windows includes it by default).';

  return `
    <div class="folder-field-label mt-3">${title}</div>
    <div class="folder-field-label mt-2">${checkLabel}</div>
    <div class="code-copy-row">
      <textarea id="${platform}-check-command" class="cyber-textarea font-mono" rows="2" readonly aria-label="${title} check command">${escapeHtml(commands.checkCommand)}</textarea>
      <button type="button" class="btn-primary-confirm copy-command-btn" data-copy-target="${platform}-check-command">Copy</button>
    </div>
    ${commands.protectCommands.map((command, index) => `
      <div class="folder-field-label mt-2">${index + 2}. Ransomware terminal command to encrypt the practice file and generate a ransom note.</div>
      <div class="code-copy-row">
        <textarea id="${platform}-protect-command-${index}" class="cyber-textarea font-mono" rows="5" readonly aria-label="${title} protection command ${index + 1}">${escapeHtml(command)}</textarea>
        <button type="button" class="btn-primary-confirm copy-command-btn" data-copy-target="${platform}-protect-command-${index}">Copy</button>
      </div>
    `).join('')}
  `;
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
