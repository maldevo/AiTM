#!/usr/bin/env python3
"""SHADOWPROOF static smoke checks — no third-party dependencies required."""
from __future__ import annotations

import re
import struct
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

PAGES = [
    "index.html", "signin.html", "dashboard.html", "module.html",
    "account.html", "admin.html", "certificate.html", "roadmap.html", "404.html",
]

REQUIRED_ASSETS = [
    "assets/css/tokens.css", "assets/css/base.css", "assets/css/app.css",
    "assets/js/theme.js", "assets/js/icons.js", "assets/js/store.js", "assets/js/ui.js",
    "data/tier1.js", "data/tier2.js", "data/tier3.js", "data/tier4.js", "data/curriculum.js",
    "assets/images/favicon.svg", "assets/images/project-qr.png",
    "assets/images/screenshot-landing.png", "assets/images/screenshot-dashboard.png",
    "assets/images/screenshot-admin.png", "assets/images/screenshot-module.png",
    "assets/images/screenshot-attack-library.png", "assets/images/screenshot-mobile.png",
    "README.md", "PROJECT_UNDERSTANDING.md", "IMPLEMENTATION_REPORT.md",
    "TESTING_REPORT.md", "FUTURE_IMPROVEMENTS.md",
]

failures: list[str] = []


def check(condition: bool, message: str) -> None:
    if not condition:
        failures.append(message)


def png_size(path: Path) -> tuple[int, int]:
    data = path.read_bytes()
    if data[:8] != b"\x89PNG\r\n\x1a\n":
        raise ValueError("not a PNG")
    width, height = struct.unpack(">II", data[16:24])
    return width, height


def main() -> int:
    for page in PAGES:
        path = ROOT / page
        check(path.exists(), f"missing page: {page}")
        if not path.exists():
            continue
        text = path.read_text(encoding="utf-8", errors="ignore")
        check("<title>" in text, f"{page}: missing title")
        check('name="viewport"' in text, f"{page}: missing viewport")
        check("assets/js/theme.js" in text, f"{page}: missing theme bootstrap")
        check("data-icon" in text or "SP.ui" in text or "assets/js/" in text, f"{page}: missing JS")
        check("TODO" not in text, f"{page}: contains TODO")

    for asset in REQUIRED_ASSETS:
        check((ROOT / asset).exists(), f"missing asset: {asset}")

    # Curriculum counts
    tier_text = "".join((ROOT / f"data/tier{i}.js").read_text(encoding="utf-8") for i in range(1, 5))
    module_count = len(re.findall(r"^\s{4}id:\s*'[^']+'", tier_text, re.MULTILINE))
    question_count = len(re.findall(r"^\s{8}question:", tier_text, re.MULTILINE))
    check(module_count == 16, f"expected 16 modules, found {module_count}")
    check(question_count == 64, f"expected 64 questions, found {question_count}")

    # QR code
    qr = ROOT / "assets/images/project-qr.png"
    if qr.exists():
        try:
            w, h = png_size(qr)
            check(w >= 500 and h >= 500, f"QR is too small: {w}x{h}")
            check(w == h, f"QR is not square: {w}x{h}")
        except Exception as exc:  # noqa: BLE001
            failures.append(f"QR check failed: {exc}")

    # README requirements
    readme = (ROOT / "README.md").read_text(encoding="utf-8")
    for token in [
        "@maldevo", "https://github.com/maldevo", "GNA University",
        "https://esperkro.github.io/AiTM", "assets/images/project-qr.png",
        "### Scan to Access the Project",
    ]:
        check(token in readme, f"README missing: {token}")

    # Internal links on root pages
    for page in PAGES:
        path = ROOT / page
        if not path.exists():
            continue
        text = path.read_text(encoding="utf-8", errors="ignore")
        for href in re.findall(r'(?:href|src)="([^"]+)"', text):
            if href.startswith(("http", "#", "mailto:", "tel:", "data:", "javascript:")):
                continue
            target = path.parent / href.split("#")[0].split("?")[0]
            check(target.exists(), f"{page}: broken local reference {href}")

    if failures:
        print(f"FAILED ({len(failures)})")
        for item in failures:
            print(" -", item)
        return 1

    print("OK")
    print(f" - {len(PAGES)} pages")
    print(f" - {module_count} modules / {question_count} questions")
    print(f" - QR {png_size(qr)[0]}x{png_size(qr)[1]} PNG")
    print(" - README, docs, images, and local links present")
    return 0


if __name__ == "__main__":
    sys.exit(main())
