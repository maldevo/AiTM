# Tests

SHADOWPROOF is a static application, so testing has two layers.

## 1. Static smoke checks (no dependencies)

```bash
python3 tests/smoke.py
```

Checks:

- All nine pages and required assets exist.
- Every page has a title, viewport meta, theme bootstrap, and no `TODO`.
- The curriculum contains 16 modules and 64 questions.
- The QR code is a valid, square PNG of at least 500×500.
- The README contains the required live link, QR path, attribution, and university statement.
- Every local `href`/`src` on the root pages resolves.

Expected output:

```text
OK
 - 9 pages
 - 16 modules / 64 questions
 - QR 688x688 PNG
 - README, docs, images, and local links present
```

## 2. Browser end-to-end checks (optional dev tooling)

The final QA pass used Playwright and axe-core. Reproduce it with:

```bash
python3 -m http.server 8080
pip install playwright
playwright install chromium

# In a separate terminal, use your preferred Playwright script or the
# manual path in TESTING_REPORT.md.
```

The full verified matrix is documented in [`../TESTING_REPORT.md`](../TESTING_REPORT.md):

- Register admin + learners.
- Complete all 16 modules through the UI.
- Assert dashboard 100% and certificate unlock.
- Admin analytics, learner role/status, CSV export.
- Light/dark toggles on every page.
- Mobile registration, menu, and module cover.
- Zero console/page errors.
- Zero axe-core WCAG 2.1 A/AA violations.

## Notes

- The app has no backend, so there are no API or database tests.
- Tests do not modify the repository; they operate on local browser storage.
- Use a throwaway browser profile when testing destructive actions such as **Reset workspace**.
