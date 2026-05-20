"""Tests for the current-task panel (browser.js replacement)."""
from pathlib import Path


def test_browser_js_exists():
    """The browser.js file must exist."""
    assert Path("static/browser.js").exists()


def test_browser_js_has_task_functions():
    """browser.js must contain task panel functions."""
    js = Path("static/browser.js").read_text(encoding="utf-8")
    assert "function syncTaskPanelFromToolCalls(" in js
    assert "function _getTaskToolCalls(" in js
    assert "function _taskDisplayName(" in js
    assert "function _taskStatusText(" in js
    assert "function renderBrowserHistoryItem(" in js


def test_browser_js_loaded_in_index():
    """index.html must load browser.js."""
    html = Path("static/index.html").read_text(encoding="utf-8")
    assert "static/browser.js" in html


def test_task_panel_css_exists():
    """style.css must contain task panel styles."""
    css = Path("static/style.css").read_text(encoding="utf-8")
    assert ".browser-history-item" in css
    assert ".browser-history-header" in css
    assert ".browser-history-status" in css
