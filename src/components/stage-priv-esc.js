/**
 * Stage 2: Privilege Escalation Component
 * Simulates the Windows Privilege Execution / User Account Control (UAC) pop-up dialog.
 */
import { sound } from '../sound.js';
import { openLocalDirectoryPicker } from '../folderPicker.js';
import { downloadEncryptionScript } from '../encryptionScript.js';

export function renderPrivEsc(container, state, actions) {
  const { privEsc, targetHost, initialAccess, targetFolder } = state;
  const isExploited = privEsc.exploited;
  const downloadedSoftware = initialAccess.downloadedSoftware || 'Adobe Photoshop 2026';
  const installerExe = `${downloadedSoftware.replace(/[^a-zA-Z0-9]/g, '_')}_Setup.exe`;
  const deniedState = container._elevationDenied || false;

  container.innerHTML = `
    <div class="stage-view-container animate-fade-in" id="stage-priv-esc">
      
      <!-- Top Stage Breadcrumb -->
      <div class="adobe-stage-banner">
        <div class="stage-eyebrow font-mono text-amber">
          <span class="pulsing-dot yellow"></span> STEP 02 OF 05 // PRIVILEGE EXECUTION (WINDOWS USER ACCOUNT CONTROL)
        </div>
        <div class="text-xs text-muted font-mono mt-1">
          CONTEXT: The downloaded software installer prompts the user for administrative execution rights. 
          Without elevation, ransomware cannot terminate security mini-filters, stop database services, or wipe Volume Shadow Copies.
        </div>
      </div>

      <!-- Main UAC Dialog Container Area -->
      <div class="uac-stage-wrapper mt-3">
        
        <!-- Windows UAC Pop-up Window -->
        <div class="windows-uac-dialog ${isExploited ? 'uac-elevated' : ''}" id="windows-uac-dialog">
          
          <!-- UAC Titlebar -->
          <div class="uac-titlebar">
            <div class="uac-title-group">
              <svg class="uac-shield-icon" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3z" fill="#0078D7"/>
                <path d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91V2z" fill="#FFB900"/>
              </svg>
              <span class="uac-title-text">User Account Control</span>
            </div>
            <div class="uac-window-controls">
              <span class="uac-ctrl-btn">✕</span>
            </div>
          </div>

          <!-- UAC Main Body -->
          <div class="uac-body">
            
            ${isExploited ? `
              <!-- Elevation Success State -->
              <div class="uac-success-content animate-fade-in">
                <div class="uac-success-badge">
                  <span class="success-icon">✓</span>
                  <span>ADMINISTRATIVE PRIVILEGES GRANTED</span>
                </div>
                <h3 class="uac-headline text-emerald mt-2">Elevated: NT AUTHORITY\\SYSTEM</h3>
                <p class="uac-prompt-text text-sm text-secondary">
                  The process token has been elevated to <strong>High / SYSTEM Integrity</strong>. 
                  The payload now has kernel-level permissions to unload antivirus drivers, kill database locks, and delete system recovery points.
                </p>

                <div class="uac-token-info font-mono text-xs mt-3">
                  <div class="token-row">
                    <span class="token-k">Elevated Token:</span>
                    <span class="token-v text-danger">${targetHost.currentUser}</span>
                  </div>
                  <div class="token-row">
                    <span class="token-k">Integrity Level:</span>
                    <span class="token-v text-amber">${targetHost.integrityLevel}</span>
                  </div>
                  <div class="token-row">
                    <span class="token-k">Privileges:</span>
                    <span class="token-v text-cyan">SeDebugPrivilege, SeTcbPrivilege, SeImpersonatePrivilege</span>
                  </div>
                </div>

                <div class="cyber-panel mt-4">
                  <div class="panel-header">
                    <div class="panel-title">
                      <span class="panel-icon">📂</span>
                      <span>Authorize Encryption Target</span>
                    </div>
                    <span class="panel-tag font-mono text-cyan">STEP 02 ➔ 03 HANDOFF</span>
                  </div>
                  <div class="panel-body">
                    <p class="text-sm text-secondary">
                      Select a local directory to encrypt. This simulates the ransomware operator choosing a target folder for file encryption. Clicking next will download a Python script that bulk-encrypts all files in the selected folder using AES-256 encryption. This script will not auto-run, you can read through it and choose to run it manually in a safe environment. The script is for educational purposes only.
                    </p>
                    <input type="file" id="priv-esc-folder-input" webkitdirectory directory multiple style="display: none;" />
                    <div class="folder-input-group mt-2">
                      <input
                        type="text"
                        id="priv-esc-folder-path"
                        class="folder-path-input font-mono ${targetFolder?.isLinked ? 'input-linked' : ''}"
                        value="${escapeHtml(targetFolder?.path || '')}"
                        placeholder="Select folder or type path..."
                        aria-label="Encryption target folder path"
                      />
                      <button type="button" class="btn-browse-folder" id="btn-priv-esc-browse-folder">
                        <span>Browse</span>
                      </button>
                    </div>
                    <div class="text-xs font-mono ${targetFolder?.isLinked ? 'text-emerald' : 'text-amber'} mt-1">
                      ${targetFolder?.isLinked ? `Target linked: ${escapeHtml(targetFolder.path)}` : 'A target folder is required before Step 3.'}
                    </div>
                  </div>
                </div>

                <div class="uac-advance-row mt-4">
                  <button type="button" class="action-btn-primary glow-red btn-large" id="btn-goto-step-3" ${targetFolder?.isLinked ? '' : 'disabled'}>
                    <span>Next (Download Encryption Script)</span>
                    <svg class="btn-icon" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            ` : `
              <!-- Initial UAC Pop-up Question -->
              <h2 class="uac-headline">
                Do you want to allow this app from an unknown publisher to make changes to your device?
              </h2>

              <!-- Target App Details Card -->
              <div class="uac-app-card">
                <div class="uac-app-icon">
                  <span>⚙️</span>
                </div>
                <div class="uac-app-meta">
                  <div class="uac-app-name font-mono">${installerExe}</div>
                  <div class="uac-field font-mono text-xs">
                    <span class="uac-label">Publisher:</span>
                    <span class="uac-val text-amber">Unknown Publisher (Untrusted Certificate)</span>
                  </div>
                  <div class="uac-field font-mono text-xs">
                    <span class="uac-label">File origin:</span>
                    <span class="uac-val">${state.targetFolder.path || 'Hard drive on this computer'}</span>
                  </div>
                </div>
              </div>

              <!-- Collapsible Details Toggle -->
              <details class="uac-details-expander font-mono text-xs">
                <summary class="uac-summary-link">Show more details</summary>
                <div class="uac-expanded-box mt-1">
                  <div><strong>CLSID:</strong> {F08A28E0-9B2D-441F-B192-3A67C4148B92}</div>
                  <div><strong>Command:</strong> "C:\\Users\\Target\\Downloads\\${installerExe}" /elevate</div>
                  <div><strong>Hash:</strong> SHA256: 3a9f02c7810b42f...e08a</div>
                </div>
              </details>

              ${deniedState ? `
                <div class="uac-denied-callout font-mono text-xs mt-2 animate-fade-in">
                  <strong class="text-amber">⚠️ Elevation Blocked:</strong> In normal scenarios, clicking "No" halts execution. 
                  However, ransomware operators also deploy silent <strong>UAC Bypass exploits</strong> (e.g. <code>fodhelper.exe</code> or <code>computerdefaults.exe</code>) to elevate automatically without prompting.
                </div>
              ` : ''}

              <!-- UAC Buttons: Yes and No -->
              <div class="uac-buttons-row mt-4">
                <button type="button" class="uac-btn uac-btn-yes" id="btn-uac-yes">
                  <span>Yes</span>
                </button>
                <button type="button" class="uac-btn uac-btn-no" id="btn-uac-no">
                  <span>No</span>
                </button>
                ${deniedState ? `
                  <button type="button" class="uac-btn uac-btn-bypass font-mono" id="btn-uac-bypass">
                    <span>⚡ Simulate UAC Bypass Exploit</span>
                  </button>
                ` : ''}
              </div>
            `}

          </div>
        </div>
      </div>

      <!-- Blue Team Mitigation Reference -->
      <div class="cyber-panel defense-panel mt-4">
        <div class="panel-header">
          <div class="panel-title">
            <span class="panel-icon">🛡️</span>
            <span>Blue Team Defenses: Defeating Privilege Escalation &amp; UAC Bypasses</span>
          </div>
          <span class="defense-badge font-mono">HARDENING CONTROLS</span>
        </div>
        <div class="panel-body defense-body">
          <div class="defense-card">
            <div class="defense-title">Set UAC to "Always Notify"</div>
            <div class="defense-desc">Setting UAC to highest security slider prevents auto-elevation of Windows built-in binaries (mitigates fodhelper &amp; eventvwr registry bypasses).</div>
          </div>
          <div class="defense-card">
            <div class="defense-title">Standard User Accounts by Default</div>
            <div class="defense-desc">Do not give daily corporate users local Administrator group membership. When UAC pops up, it requires separate admin credentials rather than just clicking "Yes".</div>
          </div>
          <div class="defense-card">
            <div class="defense-title">Enable Windows Credential Guard</div>
            <div class="defense-desc">Isolates LSASS memory within Virtualization-based Security (VBS) to prevent token theft and pass-the-hash attacks even if elevated.</div>
          </div>
        </div>
      </div>
    </div>
  `;

  function escapeHtml(value) {
    return String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  // Attach Event Handlers

  // 1. UAC "Yes" Click Handler
  const yesBtn = container.querySelector('#btn-uac-yes');
  if (yesBtn) {
    yesBtn.addEventListener('click', () => {
      sound.playElevation();
      actions.onTriggerPrivEsc();
    });
  }

  // 2. UAC "No" Click Handler
  const noBtn = container.querySelector('#btn-uac-no');
  if (noBtn) {
    noBtn.addEventListener('click', () => {
      sound.playClick();
      container._elevationDenied = true;
      renderPrivEsc(container, state, actions);
    });
  }

  // 3. UAC Bypass button
  const bypassBtn = container.querySelector('#btn-uac-bypass');
  if (bypassBtn) {
    bypassBtn.addEventListener('click', () => {
      sound.playElevation();
      actions.onTriggerPrivEsc();
    });
  }

  // 4. Advance to Step 3 (Encryption)
  const gotoStep3Btn = container.querySelector('#btn-goto-step-3');
  if (gotoStep3Btn) {
    gotoStep3Btn.addEventListener('click', () => {
      downloadEncryptionScript(state.targetFolder.path);
      sound.playStageChange();
      actions.onSelectStage('encryption');
    });
  }

  const folderPathInput = container.querySelector('#priv-esc-folder-path');
  const folderPickerInput = container.querySelector('#priv-esc-folder-input');
  const browseFolderBtn = container.querySelector('#btn-priv-esc-browse-folder');

  const linkEncryptionTarget = (path) => {
    const cleanedPath = (path || '').trim();
    if (!cleanedPath) return;
    actions.onLinkFolder(cleanedPath, { transitionToInitialAccess: false });
  };

  if (browseFolderBtn && folderPickerInput) {
    browseFolderBtn.addEventListener('click', async () => {
      sound.playClick();
      const result = await openLocalDirectoryPicker(folderPickerInput);
      if (result?.path) {
        actions.onLinkFolder(result.path, {
          transitionToInitialAccess: false,
          handle: result.handle
        });
      }
    });
  }

  if (folderPathInput) {
    folderPathInput.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        linkEncryptionTarget(folderPathInput.value);
      }
    });
    folderPathInput.addEventListener('blur', () => {
      linkEncryptionTarget(folderPathInput.value);
    });
  }
}
