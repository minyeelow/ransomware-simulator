/**
 * Stage 1: Initial Access Component
 * Simulates a cloned Adobe Free Trials & Downloads software catalogue.
 * Clicking "Download Free Trial" on any software simulates the drive-by trojan download,
 * executing the initial access reverse shell payload into the targeted environment.
 */
import { sound } from '../sound.js';

const ADOBE_CATALOGUE = [
  {
    id: 'ps',
    name: 'Adobe Photoshop 2026',
    shortCode: 'Ps',
    codeColor: '#31A8FF',
    bgColor: '#001E36',
    category: 'Design & Photography',
    categoryKey: 'design',
    version: 'v27.2.1 • 64-bit',
    description: 'Industry-standard raster image editing, Generative Fill AI, neural filters, and advanced compositing.',
    features: ['Generative Expand AI', 'Neural Portrait Filters', 'HDR Color Grading'],
    fileSize: '2.4 MB Installer',
    filename: 'Adobe_Photoshop_2026_Trial_Setup.exe',
    badge: 'POPULAR'
  },
  {
    id: 'ai',
    name: 'Adobe Illustrator 2026',
    shortCode: 'Ai',
    codeColor: '#FF9A00',
    bgColor: '#330000',
    category: 'Design & Photography',
    categoryKey: 'design',
    version: 'v30.1.0 • 64-bit',
    description: 'Precision vector graphics, typography design, Text to Vector Graphic AI, and brand identity tools.',
    features: ['Text to Vector Prompt', 'Mockup Generator', 'Retype Font Match'],
    fileSize: '2.1 MB Installer',
    filename: 'Adobe_Illustrator_2026_Trial_Setup.exe',
    badge: 'FEATURED'
  },
  {
    id: 'pr',
    name: 'Adobe Premiere Pro 2026',
    shortCode: 'Pr',
    codeColor: '#9999FF',
    bgColor: '#00005B',
    category: 'Video & Motion',
    categoryKey: 'video',
    version: 'v25.2.0 • 64-bit',
    description: 'Leading timeline-based video editing software with automatic Speech-to-Text transcription and Lumetri color.',
    features: ['Speech-to-Text Captions', 'Enhance Speech AI', 'Native 8K Editing'],
    fileSize: '3.8 MB Installer',
    filename: 'Adobe_PremierePro_2026_Setup.exe',
    badge: 'UPDATED'
  },
  {
    id: 'ae',
    name: 'Adobe After Effects 2026',
    shortCode: 'Ae',
    codeColor: '#D199FF',
    bgColor: '#1F0036',
    category: 'Video & Motion',
    categoryKey: 'video',
    version: 'v25.2.1 • 64-bit',
    description: 'Cinematic visual effects, motion graphics, 3D workspace camera tracking, and Roto Brush 3 AI.',
    features: ['Roto Brush 3.0 AI', 'True 3D Model Import', 'Object Removal Fill'],
    fileSize: '3.2 MB Installer',
    filename: 'Adobe_AfterEffects_2026_Setup.exe',
    badge: 'VFX PRO'
  },
  {
    id: 'ac',
    name: 'Adobe Acrobat Pro 2026',
    shortCode: 'Ac',
    codeColor: '#FF0000',
    bgColor: '#3D0000',
    category: 'Document Cloud',
    categoryKey: 'docs',
    version: 'v24.4.2 • 64-bit',
    description: 'The complete PDF solution: convert documents, edit text & images, protect sensitive data, and send for e-signature.',
    features: ['Full PDF Page Editing', 'OCR Text Extraction', 'Legal E-Signatures'],
    fileSize: '1.9 MB Installer',
    filename: 'Adobe_Acrobat_Pro_Setup.exe',
    badge: 'ESSENTIAL'
  },
  {
    id: 'lr',
    name: 'Adobe Lightroom Classic 2026',
    shortCode: 'Lr',
    codeColor: '#31A8FF',
    bgColor: '#001E36',
    category: 'Design & Photography',
    categoryKey: 'design',
    version: 'v14.0.0 • 64-bit',
    description: 'High-volume RAW photo management, Lens Blur AI, selective color grading, and cloud synchronization.',
    features: ['Lens Blur AI Bokeh', 'Point Color Grading', 'Tethered Live Capture'],
    fileSize: '2.7 MB Installer',
    filename: 'Adobe_Lightroom_Classic_Setup.exe',
    badge: 'PHOTOGRAPHY'
  }
];

export function renderInitialAccess(container, state, actions) {
  const { initialAccess } = state;
  const isTriggered = initialAccess.macroTriggered;
  const downloadedSoftware = initialAccess.downloadedSoftware || 'Adobe Photoshop 2026';
  const activeCategory = container._activeCategory || 'all';

  const filteredApps = ADOBE_CATALOGUE.filter(app => {
    if (activeCategory === 'all') return true;
    return app.categoryKey === activeCategory;
  });

  container.innerHTML = `
    <div class="stage-view-container animate-fade-in" id="stage-initial-access">
      
      <!-- Top Stage Breadcrumb & Attack Vector Meta -->
      <div class="adobe-stage-banner">
        <div class="stage-eyebrow font-mono">
          <span class="pulsing-dot red"></span> STEP 01 OF 05 // INITIAL ACCESS: TROJANIZED SOFTWARE LURE (MITRE T1204.002)
        </div>
        <div class="text-xs text-muted font-mono mt-1">
          CONTEXT: Threat actors clone legitimate vendor download portals and purchase search engine ads (Malvertising). 
          When an employee downloads a free trial, the installer drops an obfuscated reverse shell beacon.
        </div>
      </div>

      <!-- Adobe Creative Cloud Branded Hero Section -->
      <div class="adobe-hero-card mt-2">
        <div class="adobe-brand-header">
          <div class="adobe-logo-group">
            <div class="adobe-red-box">
              <span class="adobe-logo-letter font-mono">A</span>
            </div>
            <div>
              <div class="adobe-portal-title">Adobe Creative Cloud</div>
              <div class="adobe-portal-sub">Free 7-Day Trial Software Catalogue</div>
            </div>
          </div>

          <div class="adobe-promo-badge font-mono">
            <span>✨ 7 DAYS FULL ACCESS • NO CREDIT CARD REQUIRED</span>
          </div>
        </div>

        <p class="adobe-headline-text">
          Experience the latest 2026 releases of all industry-leading creative tools. 
          Download individual standalone trial installers below to begin immediately.
        </p>

        <!-- Category Filter Tabs -->
        <div class="adobe-filter-tabs font-mono text-xs" role="tablist">
          <button type="button" class="adobe-tab ${activeCategory === 'all' ? 'active' : ''}" data-cat="all">
            All Software (${ADOBE_CATALOGUE.length})
          </button>
          <button type="button" class="adobe-tab ${activeCategory === 'design' ? 'active' : ''}" data-cat="design">
            Design &amp; Photography (3)
          </button>
          <button type="button" class="adobe-tab ${activeCategory === 'video' ? 'active' : ''}" data-cat="video">
            Video &amp; Motion (2)
          </button>
          <button type="button" class="adobe-tab ${activeCategory === 'docs' ? 'active' : ''}" data-cat="docs">
            Document Cloud (1)
          </button>
        </div>
      </div>

      <!-- Infiltration Alert Banner (Shown once user clicked any download) -->
      ${isTriggered ? `
        <div class="ingress-alert-card animate-fade-in mt-3">
          <div class="ingress-header">
            <div class="ingress-status-pill font-mono">
              <span class="pulsing-dot red"></span> TROJAN INGRESS EXECUTED
            </div>
            <span class="text-xs font-mono text-muted">TARGET: ${state.targetFolder.path || 'Local Directory'}</span>
          </div>

          <div class="ingress-body">
            <div class="ingress-title font-mono text-danger">
              ⚠️ Ingress Vector Detonated: ${downloadedSoftware} Installer
            </div>
            <p class="ingress-desc text-xs text-secondary mt-1">
              The downloaded <code>${downloadedSoftware.replace(/\s+/g, '_')}_Setup.exe</code> executed a hidden PowerShell dropper.
              Outbound TLS reverse beacon established to C2 server <code>${initialAccess.c2Server}</code>.
            </p>

            <div class="ingress-meta-row font-mono text-xs mt-2">
              <span class="text-muted">C2 Beacon: <strong class="text-cyan">${initialAccess.beaconId}</strong></span>
              <span class="text-muted">Process: <strong class="text-amber">powershell.exe -w hidden (PID 4892)</strong></span>
              <span class="text-muted">Integrity: <strong class="text-highlight">MEGACORP\\jsmith (Std Token)</strong></span>
            </div>

            <div class="ingress-action-row mt-3">
              <button type="button" class="action-btn-primary glow-amber" id="btn-advance-to-step2">
                <span>Advance to Step 2: Privilege Escalation</span>
                <svg class="btn-icon" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      ` : ''}

      <!-- Adobe Software Catalogue Grid -->
      <div class="adobe-catalogue-grid mt-3">
        ${filteredApps.map(app => {
          return `
            <div class="adobe-card" id="adobe-card-${app.id}">
              <!-- Card Top Row: App Icon & Category -->
              <div class="adobe-card-top">
                <div class="adobe-app-icon" style="background-color: ${app.bgColor}; border-color: ${app.codeColor}; color: ${app.codeColor};">
                  <span class="app-code font-mono">${app.shortCode}</span>
                </div>
                <div class="adobe-card-meta">
                  <div class="adobe-badge-pill font-mono">${app.badge}</div>
                  <div class="adobe-version text-muted font-mono">${app.version}</div>
                </div>
              </div>

              <!-- Title & Description -->
              <div class="adobe-card-title-group mt-2">
                <h3 class="adobe-card-name">${app.name}</h3>
                <div class="adobe-category-label font-mono text-muted text-xs">${app.category}</div>
                <p class="adobe-card-desc text-secondary text-xs mt-1">
                  ${app.description}
                </p>
              </div>

              <!-- Feature Bullets -->
              <div class="adobe-features-list mt-2">
                ${app.features.map(f => `
                  <div class="adobe-feature-item text-xs font-mono">
                    <span class="feature-bullet">✓</span> ${f}
                  </div>
                `).join('')}
              </div>

              <!-- Card Footer: File Info & Download Button -->
              <div class="adobe-card-footer mt-3">
                <div class="adobe-installer-info font-mono text-xs text-muted">
                  <span class="file-icon">💾</span> ${app.fileSize}
                </div>

                <button 
                  type="button" 
                  class="btn-download-adobe-trial font-mono" 
                  data-software-name="${app.name}"
                  data-filename="${app.filename}"
                  id="btn-download-${app.id}"
                >
                  <svg class="download-icon" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd" />
                  </svg>
                  <span>Download Free Trial</span>
                </button>
              </div>
            </div>
          `;
        }).join('')}
      </div>

      <!-- Blue Team Detection Notes -->
      <div class="cyber-panel defense-panel mt-3">
        <div class="panel-header">
          <div class="panel-title">
            <span class="panel-icon">🛡️</span>
            <span>Blue Team Defense: Defeating Software Trial Malvertising</span>
          </div>
          <span class="defense-badge font-mono">PREVENTION RULE</span>
        </div>
        <div class="panel-body defense-body">
          <div class="defense-card">
            <div class="defense-title">Block Ad Networks &amp; Search Spoofing</div>
            <div class="defense-desc">Deploy enterprise DNS filters to block malicious sponsored ad clicks in Google/Bing results targeting creative software keywords.</div>
          </div>
          <div class="defense-card">
            <div class="defense-title">Mandate Application Whitelisting</div>
            <div class="defense-desc">Use Windows Defender Application Control (WDAC) or AppLocker so unapproved trial installers cannot execute from <code>C:\\Users\\*\\Downloads</code>.</div>
          </div>
          <div class="defense-card">
            <div class="defense-title">Verify Authenticode Digital Signatures</div>
            <div class="defense-desc">Authentic Adobe installers are signed by <em>Adobe Inc.</em> Threat actor clones either lack digital signatures or use fake root CAs.</div>
          </div>
        </div>
      </div>
    </div>
  `;

  // Attach Event Handlers

  // 1. Download Free Trial Button Click Handlers
  container.querySelectorAll('.btn-download-adobe-trial').forEach(btn => {
    btn.addEventListener('click', () => {
      const softwareName = btn.getAttribute('data-software-name') || 'Adobe Photoshop 2026';
      sound.playAlert();
      actions.onTriggerAccess(softwareName);
    });
  });

  // 2. Category Tab Filter Handlers
  container.querySelectorAll('.adobe-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      sound.playClick();
      container._activeCategory = tab.getAttribute('data-cat');
      renderInitialAccess(container, state, actions);
    });
  });

  // 3. Advance to Step 2 Button
  const advanceBtn = container.querySelector('#btn-advance-to-step2');
  if (advanceBtn) {
    advanceBtn.addEventListener('click', () => {
      sound.playStageChange();
      actions.onSelectStage('privilege-escalation');
    });
  }
}
