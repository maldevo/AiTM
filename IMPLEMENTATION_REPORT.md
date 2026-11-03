# IMPLEMENTATION REPORT — SHADOWPROOF

> What was built, completed, fixed, and redesigned during the transformation from a five-module prototype into a complete sixteen-module static product.

---

## 1. Outcome at a glance

| Before | After |
|---|---|
| 5 built modules, 11 planned cards | **16 complete, playable modules** |
| Separate visual style per module | **Unified design system** with narrative variety preserved |
| No dashboard | **Learner dashboard** with progress, resume, filters, badges, activity |
| No workspace analytics | **Admin analytics** with KPIs, charts, learner management, CSV export |
| No certificate | **Printable certificate** with verification ID and average score |
| No account settings | **Profile, password, theme, JSON export, reset** |
| No theme system | **Complete light/dark palettes**, system preference, persistence |
| Static prototype only | **Data-driven module engine** + local repository + 64-question assessment bank |
| No accessibility process | **axe-core: 0 WCAG 2.1 A/AA violations** across tested pages/states |
| No consistent iconography | **Inline SVG icon set** and a custom brand mark |
| Minimal landing page | **Full product landing page** with animated attack replay and attack library |
| Original five modules at root | **Archived under `legacy/`** and preserved |

---

## 2. Architecture and foundations

### 2.1 Shared design system

Added `assets/css/tokens.css` and rebuilt `base.css` around design tokens:

- Full dark palette: deep ink background, mint signal accent, restrained violet/amber/blue/red support colors.
- Full light palette: warm paper background, deeper green accent, adjusted semantic colors.
- Typography hierarchy: Inter for UI, Instrument Serif for editorial accents, JetBrains Mono for metadata and code.
- Shared components: buttons, pills, cards, panels, inputs, select, textarea, checkboxes, tabs, tables, modals, toasts, progress bars, avatars, badges, empty states, skeletons, tooltips, pagination, drawers.
- Shared shell: sticky glass header, responsive navigation, user menu, mobile menu, footer.
- Motion utilities: reveal-on-scroll, fade, float, pulse, confetti, shimmer, dash animations.
- Print styles for the certificate.

Page-specific styles were split into `landing.css`, `app.css`, `module.css`, `admin.css`, `auth.css`, and `roadmap.css` to keep the system maintainable.

### 2.2 Theme system

- `assets/js/theme.js` runs before first paint.
- On first visit, it respects `prefers-color-scheme`.
- The choice persists in `sp:theme:v1`.
- The header toggle works on every page.
- Settings offers Light / Dark / System.
- Both palettes are fully designed; this is not a background-only switch.
- Theme changes are smooth without blanket `*` transitions.

### 2.3 Local repository

Added `assets/js/store.js`, which owns:

- Profiles, local sessions, registration, login, logout, profile update, password change.
- PBKDF2-SHA-256 password verifiers with a documented fallback.
- Progress, attempts, badges, events.
- Dashboard aggregation.
- Certificate eligibility.
- Admin overview, learner list/detail, role/status changes, CSV export, workspace reset.
- Single-learner JSON export.

The first profile becomes the workspace admin; subsequent profiles are learners. The last active admin cannot be demoted or suspended.

### 2.4 Curriculum

Added five data files:

- `data/tier1.js` — 5 modules
- `data/tier2.js` — 5 modules
- `data/tier3.js` — 4 modules
- `data/tier4.js` — 2 modules
- `data/curriculum.js` — index and helpers

This produced **16 modules, 64 knowledge-check questions, 16 badges**, and consistent metadata (tier, risk, time, objectives, accent, icon).

### 2.5 Module engine

Added a single `module.html` + `assets/js/module.js` player that renders:

- Cover / objectives / resume state.
- Story, flow, simulation, classification, gallery, transcript, rules, and debrief scenes.
- Scene dots, sticky navigation, keyboard navigation, and per-scene persistence.
- Knowledge check with immediate explanations and a 3/4 pass mark.
- Result screen with score ring, badge, confetti, retry, review, next module.
- Light-mode accent variants for all module colors.

The original five modules' learning objectives and interaction ideas were preserved; their content was expanded and rewritten for the unified engine.

---

## 3. Pages completed or created

### 3.1 `index.html` — landing page

New sections:

- Hero with a live AiTM session trace animation.
- Four-stat band (16 modules, 4 tiers, 16 badges, 0 bytes sent).
- Problem framing and a design-principle quote.
- “Learn it. Live it. Prove it.” process.
- Module preview cards.
- Interactive Attack Library with five attacks (AiTM, BEC, quishing, vishing, ransomware), animated flow, clickable steps, auto-advance, and progress.
- Workspace analytics preview.
- Trust/privacy/accessibility bento.
- Final call to action.
- Responsive navigation and footer.

### 3.2 `signin.html` — local authentication

- Split-screen brand panel with an animated session trace.
- Sign in / create account tabs.
- Existing local profile list.
- Field validation, show/hide password, password strength meter.
- Local-storage privacy notice.
- First-account admin explanation.
- Redirect handling for protected pages.
- Responsive form layout.

### 3.3 `dashboard.html` — learner home

- Time-aware greeting and progress ring.
- Stat tiles: modules complete, badges, learning time, average score.
- “Continue” card with next or in-progress module.
- Search, tier filters, status filter, and empty state.
- All 16 module cards with status and progress.
- Full badge case with locked/earned states and badge-detail modal.
- Personal activity feed.
- Certificate status card.
- Local workspace storage card and reset action.
- Responsive side rail.

### 3.4 `module.html` — module player

Covered above. The page is data-driven; no module-specific HTML is required.

### 3.5 `admin.html` — workspace analytics

- Local-data banner.
- KPI cards: learners, completion rate, average score, badges.
- Completion by module bar chart.
- 14-day activity SVG line chart with empty state.
- Completion by tier donut chart.
- Knowledge-check score distribution.
- Recent workspace activity feed.
- Most-completed modules.
- Learner table with search, sort, pagination, progress, badges, last active, status.
- Learner detail modal with per-module progress, recent attempts, role/status controls, and per-learner reset.
- CSV export.
- Workspace reset with confirmation.
- Non-admin access-denied state.

### 3.6 `account.html` — settings

- Profile edit (name, department; email read-only).
- Password change with current-password verification and strength meter.
- Light / Dark / System appearance selector.
- Local storage usage.
- JSON export of the learner's record.
- Reset learning progress.
- Sign out.
- Side-rail progress summary.

### 3.7 `certificate.html`

- Locked state with remaining module count and progress.
- Completed-module checklist.
- Eligible certificate with name, department, issue date, verification code, average score, and badge seal.
- Copy ID and Print / Save PDF actions.
- Print-specific light styling and landscape page setup.
- Explicit disclaimer that it is a local training record.

### 3.8 `roadmap.html`

Redesigned the original roadmap into a product-quality page:

- Hero, target GA, current status, and proposal disclaimer.
- Four-quarter milestone cards.
- Detailed timeline with workstreams and exit criteria.
- Success metrics focused on behavior, not attendance.
- Cross-team dependencies.
- Link to the archived original proposal.

### 3.9 `404.html`

- Friendly not-found page with navigation back to the product.

### 3.10 `legacy/`

Moved the original prototype files here to preserve them:

- Five original modules.
- Original sign-in, landing, assessment engine, question bank, and roadmap.
- They remain functional as independent historical prototypes and are linked from the footer.

---

## 4. Features added

| Feature | Value |
|---|---|
| **Unified module player** | One consistent experience for 16 modules; content is maintainable data. |
| **Scene-level resume** | Reloading a module returns to the last scene. |
| **Knowledge-check attempts** | History and retakes, with best badge score retained. |
| **Badge detail modal** | Shows badge ID, score, date, and review link. |
| **Learner filters** | Search + tier + status, with a real empty state. |
| **Learning path** | A four-tier visual path that explains how the modules build on each other. |
| **Badge case** | All 16 badges, locked/unlocked, with detail. |
| **Learning path** | Four connected tiers show how recognition, verification, environment, and response fit together. |
| **Activity feed** | Meaningful local events, not decorative data. |
| **Admin analytics** | Completion, scores, activity, tiers, learners, CSV. |
| **Role and status management** | Promote/demote, suspend/restore, with last-admin protection. |
| **CSV export** | One row per learner, one column per module. |
| **JSON export** | Portable learner record. |
| **Certificate** | Full completion reward, print-ready. |
| **Settings page** | Profile, password, theme, data controls. |
| **System theme mode** | Respects the device after an explicit choice. |
| **Reduced-motion support** | No confetti, no auto-advance, no decorative motion. |
| **Accessible modals and toasts** | Keyboard close, focus on open, live region for toasts. |
| **Mobile navigation** | Compact header with hamburger menu and full nav. |
| **Internal link auditing** | Every local link resolves. |
| **Favicon and brand mark** | Custom inline SVG identity. |
| **QR code** | High-resolution, verified link to the live project. |
| **README and four project reports** | Academic and maintainer documentation. |

---

## 5. Bugs and issues fixed during implementation

These were found through real browser testing and corrected:

1. **Curriculum namespace mismatch** — `window.SHADOWPROOF` existed but `SP.SHADOWPROOF` did not, causing landing and dashboard render failures. Fixed by aliasing it in `curriculum.js`.
2. **Module shell ID mismatch** — the player expected `#moduleShell`; the page used `#main`, leaving the page stuck on “Loading module…”. Fixed and updated the skip link.
3. **Explainer early return** — the attack library required `#explainSteps`/`#explainProgress` before they were created, so it never rendered. Fixed the guard.
4. **Literal Markdown asterisks** — result and dashboard headings displayed `*pattern.*`. Fixed by rendering through the rich-text helper.
5. **Mobile header overflow** — auth buttons and the user name pushed the hamburger off-screen. Fixed with a compact mobile header.
6. **Mobile menu icon layout** — menu icons stacked above their labels. Fixed with flex layout.
7. **Explainer text concatenation** — step title and description ran together. Fixed with block-level labels.
8. **Certificate module list** — the certified-module checklist was unstyled on the certificate page. Moved shared list styles into `app.css`.
9. **Print theme** — the certificate printed with dark backgrounds. Added explicit print colors and landscape page sizing.
10. **Duplicate “start” event** — the module start action logged twice. Removed the duplicate.
11. **Progress `_loggedStart` leak** — an internal marker leaked into persisted progress. Replaced with a clean “new record” check.
12. **Contrast failures in light mode** — module accents, locked badges, warning/danger pills, flow nodes, message timestamps, and theme labels failed WCAG AA. Fixed with accessible light accents, state-specific colors, and removal of permanent opacity dimming.
13. **Admin drawer selects had no accessible names** — added `aria-label`s.
14. **Badge modal accent color** — module accent text failed on white in light mode. Added a light-mode mix.
15. **Mobile dashboard login test revealed separate storage** — documented that local profiles are per browser; the app correctly shows “no account” when a different browser has no profiles.
16. **Footer overlap on module pages** — fixed with bottom spacing for the fixed scene navigation.

---

## 6. Design improvements

### Visual direction

- Premium editorial SaaS aesthetic: deep ink, warm paper, signal green, serif display accents, mono metadata.
- Strong hierarchy: large display headlines, measured body copy, small uppercase labels.
- Generous spacing and rounded surfaces without excessive borders.
- Subtle grid textures, radial glows, and grain for depth.
- Cards with accent-aware gradients and hover lift.
- Consistent 8/12/18/26/36px radius scale.
- No stock photography, no icon font, no generic dashboard screenshot.

### Interaction

- Live AiTM trace in the hero.
- Interactive attack library with auto-advancing stages.
- Scroll reveals, hover lifts, animated counters, progress rings.
- Module flow diagrams with active/detail states.
- Rating-style feedback on decisions.
- Badge reveal and confetti on a pass.
- Toast feedback for every meaningful action.
- Empty states that explain what to do next.
- Loading skeletons on authenticated pages.

### Responsive behavior

- Desktop: persistent side rail, two-column dashboards, three-column module grids.
- Tablet: two-column grids, collapsible nav.
- Mobile: stacked cards, compact header, horizontal workspace nav, one-column forms, full-width actions.
- Tested at 1440×900, 1280×900, 390×844.

---

## 7. Files added / changed

### Added

- `404.html`
- `account.html`
- `admin.html`
- `certificate.html`
- `dashboard.html`
- `module.html`
- `roadmap.html`
- `signin.html`
- new `index.html`
- `assets/css/{tokens,base,landing,app,module,admin,auth,roadmap}.css`
- `assets/js/{theme,icons,store,ui,landing,auth,dashboard,module,admin,account,certificate}.js`
- `data/{tier1,tier2,tier3,tier4,curriculum}.js`
- `assets/images/{favicon.svg,project-qr.png,screenshot-*.png}`
- `PROJECT_UNDERSTANDING.md`
- `IMPLEMENTATION_REPORT.md`
- `TESTING_REPORT.md`
- `FUTURE_IMPROVEMENTS.md`
- `.gitignore`

### Moved

- The original five modules, assessment engine, question bank, landing, sign-in, and roadmap were moved from the repository root to `legacy/`.

### Replaced

- `README.md` was replaced with full professional documentation.

### Preserved

- All original prototype files under `legacy/`.
- The original Git history and fork relationship (no rebase, no force-push, no history rewrite).
- The original five modules' core learning objectives and scenarios.

---

## 8. Engineering notes

- No new runtime dependencies.
- No build step introduced.
- No backend introduced (per project constraint).
- All asset paths are relative for GitHub Pages.
- All images are local; only Google Fonts is external.
- No TODO comments or placeholder implementations remain in the primary flow.
- The legacy archive is intentionally excluded from the new state model.

---

## 9. What was intentionally not done

| Not done | Why |
|---|---|
| Backend / database | The project is static by design; adding a server would change the hosting, privacy, and academic constraints. |
| Institutional SSO | Requires a backend and identity provider; described in the roadmap. |
| Cross-device sync | Requires a backend; local-only is a deliberate privacy feature. |
| Real phishing simulation | Out of scope and ethically inappropriate for a public educational artifact. |
| Native mobile app | The responsive web app covers the use case. |
| Email verification / password reset | Local profiles have no email service; passwords can be changed from Settings. |
| 16 separate module HTML files | The data-driven engine is more maintainable and consistent. |

---

## 10. Result

The project is now a complete, polished, static cybersecurity awareness product:

- 16 modules, 64 questions, 16 badges.
- Real learner journeys with resume, retakes, and a certificate.
- A local workspace with roles and analytics.
- A fully designed light/dark system.
- Animated explanations that teach actual mechanisms.
- Verified accessibility.
- Professional documentation and attribution.

See `TESTING_REPORT.md` for evidence and `FUTURE_IMPROVEMENTS.md` for the next product steps.

---

Developed and maintained by **[@maldevo](https://github.com/maldevo)** · GitHub: <https://github.com/maldevo>
