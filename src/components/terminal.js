/**
 * Terminal / Live Telemetry Component
 * Displays real-time Sysmon, EDR, and attack activity logs in a collapsible bottom drawer.
 */
import { sound } from '../sound.js';

export function renderTerminal(container, state) {
  const logs = state.telemetryLogs || [];
  const activeFilter = container._activeFilter || 'ALL';
  const isCollapsed = container._isCollapsed || false;

  const filteredLogs = logs.filter(item => {
    if (activeFilter === 'ALL') return true;
    return item.source.toUpperCase() === activeFilter.toUpperCase();
  });

  container.innerHTML = `
    <div class="terminal-drawer ${isCollapsed ? 'collapsed' : ''}" id="telemetry-terminal-drawer">
      <!-- Terminal Header / Titlebar -->
      <div class="terminal-titlebar">
        <div class="terminal-left-group">
          <button type="button" class="btn-toggle-terminal" id="btn-toggle-terminal-drawer" title="Toggle Terminal">
            <span class="drawer-arrow">${isCollapsed ? '▲' : '▼'}</span>
            <span class="terminal-title font-mono">LIVE TELEMETRY &amp; EDR STREAM</span>
          </button>
          <span class="terminal-count-badge font-mono">${logs.length} EVENTS</span>
        </div>

        <!-- Filter Pills -->
        <div class="terminal-filters font-mono">
          <button type="button" class="filter-pill ${activeFilter === 'ALL' ? 'active' : ''}" data-filter="ALL">ALL</button>
          <button type="button" class="filter-pill ${activeFilter === 'SYSMON' ? 'active' : ''}" data-filter="SYSMON">SYSMON</button>
          <button type="button" class="filter-pill ${activeFilter === 'NETWORK' ? 'active' : ''}" data-filter="NETWORK">NETWORK</button>
          <button type="button" class="filter-pill ${activeFilter === 'SECURITY' ? 'active' : ''}" data-filter="SECURITY">SECURITY</button>
          <button type="button" class="filter-pill ${activeFilter === 'CRYPTO' ? 'active' : ''}" data-filter="CRYPTO">CRYPTO</button>
        </div>

        <!-- Quick Clear & Status -->
        <div class="terminal-right-group font-mono text-xs">
          <span class="edr-sensor-status text-emerald">● EDR SENSOR ACTIVE</span>
        </div>
      </div>

      <!-- Terminal Body / Log Viewport -->
      <div class="terminal-viewport font-mono" id="terminal-viewport">
        ${filteredLogs.map(item => {
          let levelClass = 'log-info';
          if (item.level === 'WARN') levelClass = 'log-warn';
          if (item.level === 'ALERT') levelClass = 'log-alert';
          if (item.level === 'CRITICAL') levelClass = 'log-critical';
          if (item.level === 'SUCCESS') levelClass = 'log-success';

          return `
            <div class="log-entry ${levelClass}">
              <span class="log-time text-muted">[${item.time}]</span>
              <span class="log-source font-mono">[${item.source.toUpperCase()}]</span>
              <span class="log-level">[${item.level}]</span>
              <span class="log-msg">${escapeHtml(item.msg)}</span>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;

  function escapeHtml(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  // Attach Event Handlers
  const toggleBtn = container.querySelector('#btn-toggle-terminal-drawer');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      sound.playClick();
      container._isCollapsed = !container._isCollapsed;
      renderTerminal(container, state);
    });
  }

  container.querySelectorAll('.filter-pill').forEach(btn => {
    btn.addEventListener('click', () => {
      sound.playClick();
      container._activeFilter = btn.getAttribute('data-filter');
      renderTerminal(container, state);
    });
  });
}
