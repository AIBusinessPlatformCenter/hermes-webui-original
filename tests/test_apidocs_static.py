"""Tests for API docs page static assets."""
from pathlib import Path


def test_apidoc_md_exists():
    """The apidoc.md source file must exist in the webui repo."""
    assert Path("apidoc.md").exists()


def test_apidocs_route_exists():
    """The /apidocs route must exist in routes.py."""
    routes = Path("api/routes.py").read_text(encoding="utf-8")
    assert '"/apidocs"' in routes


def test_dockerfile_copies_apidoc():
    """The root Dockerfile must copy apidoc.md into the image."""
    dockerfile = Path("../Dockerfile").read_text(encoding="utf-8")
    assert "apidoc.md" in dockerfile


def test_build_script_validates_apidoc():
    """The build script must validate apidoc.md presence."""
    build = Path("../build-and-save.sh").read_text(encoding="utf-8")
    assert "apidoc.md" in build
