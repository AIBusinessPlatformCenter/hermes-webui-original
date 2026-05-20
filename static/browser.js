/**
 * Current Task Panel — displays live tool calls, subprocess output, and command results.
 * Replaces the original browser-history panel.
 */
const BrowserState = { isPanelOpen: false };

function _getTaskToolCalls() {
  if (!Array.isArray(S?.toolCalls)) return [];
  return [...S.toolCalls]
    .map((tc, idx) => ({ ...tc, _idx: idx }))
    .sort((a, b) => {
      const at = Number(a.timestamp || 0);
      const bt = Number(b.timestamp || 0);
      if (at !== bt) return bt - at;
      return (b._idx || 0) - (a._idx || 0);
    });
}

function _taskDisplayName(name) {
  const raw = String(name || '').trim();
  if (!raw) return 'tool';
  if (raw === 'subagent_progress') return '子任务';
  if (raw === 'delegate_task') return '委派任务';
  return raw;
}

function _taskStatusClass(tc) {
  if (tc && tc.done === false) return 'running';
  if (tc && tc.is_error) return 'error';
  return 'done';
}

function _taskStatusText(tc) {
  if (tc && tc.is_error) return '出错';
  return tc && tc.done === false ? '运行中' : '已完成';
}

function _taskTimeLabel(tc) {
  if (!tc || !tc.timestamp) return '';
  const d = new Date(tc.timestamp);
  return d.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

function _taskSummaryText(tc) {
  const preview = tc?.preview || '';
  if (preview) return String(preview).slice(0, 200);
  return '';
}

function _taskOutputText(tc) {
  const out = tc?.snippet || tc?.result || tc?.output || '';
  return String(out).slice(0, 800);
}

function toolIcon(name) {
  // Simple text icon fallback
  const icons = {
    browser: '&#127760;',
    terminal: '&#128187;',
    file: '&#128196;',
    search: '&#128269;',
    code: '&#128221;',
    subagent_progress: '&#128260;',
    delegate_task: '&#128640;',
  };
  return icons[name] || '&#9881;';
}

function renderBrowserHistoryItem(tc) {
  const status = _taskStatusText(tc);
  const time = _taskTimeLabel(tc);
  const statusClass = _taskStatusClass(tc);
  const args = tc?.args && typeof tc.args === 'object' ? tc.args : {};
  const argLines = Object.entries(args)
    .slice(0, 4)
    .map(([k, v]) => `<div><span class="browser-history-arg-key">${esc(k)}</span><span class="browser-history-arg-val">${esc(String(v))}</span></div>`)
    .join('');
  const summary = _taskSummaryText(tc);
  const output = _taskOutputText(tc);
  const truncatedOutput = output.length > 400 ? output.slice(0, 400) + '...' : output;

  return `
    <div class="browser-history-item browser-history-item-${esc(statusClass)}">
      <div class="browser-history-header">
        <span class="browser-history-icon">${toolIcon(tc?.name || 'tool')}</span>
        <span class="browser-history-action">${esc(_taskDisplayName(tc?.name))}</span>
        <span class="browser-history-status ${esc(statusClass)}">${esc(status)}</span>
        ${time ? `<span class="browser-history-time">${esc(time)}</span>` : ''}
      </div>
      ${summary ? `<div class="browser-history-preview">${esc(summary)}</div>` : ''}
      ${argLines ? `<div class="browser-history-args">${argLines}</div>` : ''}
      ${truncatedOutput ? `<pre class="browser-history-output">${esc(truncatedOutput)}</pre>` : '<div class="browser-history-text">等待输出...</div>'}
    </div>
  `;
}

function syncTaskPanelFromToolCalls() {
  const list = document.getElementById('browserHistory');
  const empty = document.getElementById('browserEmptyState');
  if (!list) return;

  const tcs = _getTaskToolCalls();
  if (tcs.length === 0) {
    list.innerHTML = '';
    if (empty) empty.style.display = '';
    return;
  }
  if (empty) empty.style.display = 'none';

  list.innerHTML = tcs.map(renderBrowserHistoryItem).join('');
}

function clearBrowserHistory() {
  S.toolCalls = [];
  syncTaskPanelFromToolCalls();
}

function toggleBrowserPanel(show) {
  const panel = document.getElementById('browserPanel');
  if (!panel) return;
  if (show === undefined) show = panel.style.display === 'none';
  panel.style.display = show ? '' : 'none';
  BrowserState.isPanelOpen = show;
  try {
    document.documentElement.dataset.browserPanel = show ? 'open' : 'closed';
  } catch (e) {}
}

// Initial sync on load
document.addEventListener('DOMContentLoaded', () => {
  syncTaskPanelFromToolCalls();
});
