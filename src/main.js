/**
 * Application Entry Point
 * Orchestrates sidebar, stages, telemetry terminal, and simulation sequencer.
 */
import { store, STAGES } from './state.js';
import { sound } from './sound.js';
import { renderSidebar } from './components/sidebar.js';
import { renderInitialAccess } from './components/stage-initial-access.js';
import { renderPrivEsc } from './components/stage-priv-esc.js';
import { renderEncryption } from './components/stage-encryption.js';
import { renderRansom } from './components/stage-ransom.js';
import { renderDecryption } from './components/stage-decryption.js';
import { renderTerminal } from './components/terminal.js';

// DOM container elements
const sidebarEl = document.getElementById('sidebar-container');
const stageViewportEl = document.getElementById('stage-viewport');
const terminalEl = document.getElementById('terminal-container');

// Stage render map
const STAGE_RENDERERS = {
  'initial-access': renderInitialAccess,
  'privilege-escalation': renderPrivEsc,
  'encryption': renderEncryption,
  'ransom': renderRansom,
  'decryption': renderDecryption
};

// Application Action Dispatcher
const actions = {
  onSelectStage: (stageId) => {
    store.setCurrentStage(stageId);
  },

  onFolderSelected: (fileList) => {
    store.setFolderFromLocalFiles(fileList);
  },

  onSetFolderPath: (rawPath) => {
    const segments = rawPath.replace(/\\/g, '/').split('/').filter(Boolean);
    const folderName = segments.length > 0 ? segments[segments.length - 1] : 'TargetFolder';
    store.setTargetFolder({
      path: rawPath,
      name: folderName,
      isCustom: true
    });
  },

  onSelectVector: (vector) => {
    store.state.initialAccess.selectedVector = vector;
    store.notify();
  },

  onTriggerAccess: () => {
    store.triggerInitialAccess(store.state.initialAccess.selectedVector);
  },

  onTriggerPrivEsc: () => {
    store.triggerPrivEsc();
  },

  onStartEncryption: async () => {
    await store.startFileEncryption((fileIndex, status) => {
      sound.playEncryptTick();
    });
  },

  onDeployRansom: () => {
    store.deployRansom();
  },

  onSelectRansomTab: (tab) => {
    store.state.ransom.activeTab = tab;
    store.notify();
  },

  onTestFreeDecrypt: (fileId) => {
    store.testFreeDecryption(fileId);
  },

  onSendChat: (text) => {
    store.sendNegotiationChat(text);
  },

  onStartDecryption: async () => {
    await store.startDecryption((fileIndex, status) => {
      sound.playClick();
    });
  },

  onReset: () => {
    store.resetAll();
  },

  onRunFullChain: async () => {
    // Sequentially execute all 5 phases with cinematic timing
    store.resetAll();
    await delay(500);

    // Step 1: Initial Access
    store.setCurrentStage('initial-access');
    sound.playStageChange();
    await delay(1200);
    sound.playAlert();
    store.triggerInitialAccess('phishing');
    await delay(2000);

    // Step 2: Privilege Escalation
    store.setCurrentStage('privilege-escalation');
    sound.playStageChange();
    await delay(1200);
    sound.playElevation();
    store.triggerPrivEsc();
    await delay(2000);

    // Step 3: Encryption
    store.setCurrentStage('encryption');
    sound.playStageChange();
    await delay(1200);
    sound.playAlert();
    await store.startFileEncryption(() => {
      sound.playEncryptTick();
    });
    await delay(2000);

    // Step 4: Ransom & Extortion
    store.setCurrentStage('ransom');
    sound.playStageChange();
    await delay(1000);
    sound.playAlert();
    store.deployRansom();
    await delay(2500);

    // Step 5: Decryption & Recovery
    store.setCurrentStage('decryption');
    sound.playStageChange();
    await delay(1200);
    sound.playSuccess();
    await store.startDecryption(() => {
      sound.playClick();
    });
  }
};

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Master Render Function
function renderApp(state) {
  const topScopeEl = document.getElementById('top-nav-scope');
  if (topScopeEl && state.targetFolder) {
    topScopeEl.textContent = `TARGET DIR: ${state.targetFolder.path}`;
  }

  if (sidebarEl) {
    renderSidebar(sidebarEl, state, actions);
  }

  if (stageViewportEl) {
    const renderer = STAGE_RENDERERS[state.currentStageId] || renderInitialAccess;
    renderer(stageViewportEl, state, actions);
  }

  if (terminalEl) {
    renderTerminal(terminalEl, state);
  }
}

// Initialize sound on first user gesture anywhere
window.addEventListener('click', () => {
  sound.init();
}, { once: true });

// Subscribe to state updates
store.subscribe((state) => {
  renderApp(state);
});

// Initial boot render
renderApp(store.get());
console.log('Ransomware Simulator initialized successfully.');
