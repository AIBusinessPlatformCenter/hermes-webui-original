"""Tests for SkillHub integration in the WebUI."""
import json
from pathlib import Path


def test_skillhub_panel_html_exists():
    """The SkillHub panel HTML must exist in index.html."""
    html = Path("static/index.html").read_text(encoding="utf-8")
    assert 'id="panelSkillhub"' in html
    assert 'id="skillhubList"' in html
    assert 'id="skillhubSearch"' in html
    assert 'id="skillhubForceInstall"' in html
    assert 'loadSkillHub' in html


def test_skillhub_nav_tab_exists():
    """The SkillHub nav tab must exist in both rail and top nav."""
    html = Path("static/index.html").read_text(encoding="utf-8")
    assert 'data-panel="skillhub"' in html
    assert "tab_skillhub" in html


def test_skillhub_js_api_exists():
    """The panels.js must contain SkillHub JS functions."""
    js = Path("static/panels.js").read_text(encoding="utf-8")
    assert "function loadSkillHub(" in js
    assert "function renderSkillHubSkills(" in js
    assert "function installSkillHub(" in js
    assert "function uninstallSkillHub(" in js
    assert "function filterSkillHub(" in js
    assert '/api/skillhub/skills' in js
    assert '/api/skillhub/install' in js
    assert '/api/skillhub/uninstall' in js


def test_skillhub_css_exists():
    """The style.css must contain SkillHub styles."""
    css = Path("static/style.css").read_text(encoding="utf-8")
    assert ".skillhub-item" in css
    assert ".skillhub-btn" in css
    assert ".skillhub-state" in css


def test_skillhub_routes_exist():
    """The routes.py must contain SkillHub backend routes."""
    routes = Path("api/routes.py").read_text(encoding="utf-8")
    assert '/api/skillhub/skills' in routes
    assert '/api/skillhub/categories' in routes
    assert '/api/skillhub/content' in routes
    assert '/api/skillhub/file' in routes
    assert '/api/skillhub/install' in routes
    assert '/api/skillhub/uninstall' in routes
    assert "_skillhub_base_url" in routes
    assert "_skillhub_request_json" in routes


def test_skills_enhanced_with_hub_status():
    """The /api/skills endpoint must return hub_installed and can_delete."""
    routes = Path("api/routes.py").read_text(encoding="utf-8")
    assert "hub_installed" in routes
    assert "can_delete" in routes
