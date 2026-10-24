/**
 * Application Entry Point
 * Orchestrates the simulator stages and navigation.
 */
import { store, STAGES } from './state.js';
import { sound } from './sound.js';
import { renderSidebar } from './components/sidebar.js';
import { renderInitialAccess } from './components/stage-initial-access.js';
import { renderPrivEsc } from './components/stage-priv-esc.js';
import { renderEncryption } from './components/stage-encryption.js';
import { renderRansom } from './components/stage-ransom.js';
import { renderDecryption } from './components/stage-decryption.js';

// DOM container elements
const sidebarEl = document.getElementById('sidebar-container');
const stageViewportEl = document.getElementById('stage-viewport');

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

  onLinkFolder: (path, options) => {
    store.linkTargetFolder(path, options);
  },

  onSelectVector: (vector) => {
    store.state.initialAccess.selectedVector = vector;
    store.notify();
  },

  onTriggerAccess: (softwareName) => {
    store.triggerInitialAccess(softwareName || 'Adobe Photoshop 2026');
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

};

// Master Render Function
function renderApp(state) {
  document.body.classList.toggle('adobe-landing-active', state.currentStageId === 'initial-access');

  const topScopeEl = document.getElementById('top-nav-scope');
  if (topScopeEl) {
    if (state.targetFolder?.isLinked) {
      topScopeEl.textContent = `TARGET DIR: ${state.targetFolder.path}`;
    } else {
      topScopeEl.textContent = `TARGET DIR: [AWAITING LOCAL LINK]`;
    }
  }

  if (sidebarEl) {
    renderSidebar(sidebarEl, state, actions);
  }

  if (stageViewportEl) {
    const renderer = STAGE_RENDERERS[state.currentStageId] || renderInitialAccess;
    renderer(stageViewportEl, state, actions);
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
