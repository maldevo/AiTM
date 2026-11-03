# TESTING REPORT — SHADOWPROOF

> Verification performed on the finished static build. The goal was to test real user workflows, not just visual appearance.

---

## 1. Test environment

| Item | Value |
|---|---|
| Date | 3 November 2026 |
| OS | Linux (Debian-based) |
| Browser | Chromium 142.0.7444.175 |
| Automation | Playwright 1.64.1 |
| Accessibility engine | axe-core 4.10.2 |
| Server | `python3 -m http.server 8080` |
| Viewports | 1440×900, 1280×900, 390×844 |
| Node syntax checks | `node --check` on every `assets/js/*.js` and `data/*.js` |
| Device scale | 1× desktop, 2× mobile |

No backend, database, or API tests exist because the application has no backend by design.

---

## 2. Test approach

1. **Static checks** — JavaScript syntax, internal links, required assets, QR decode.
2. **End-to-end workflows** — registration, login, module play, quiz, badge, certificate, admin, export, themes, mobile.
3. **Accessibility** — axe-core WCAG 2.1 A/AA on 10 pages × 2 themes, plus 7 interactive states.
4. **Visual review** — screenshots at desktop and mobile for layout, spacing, contrast, and overlap.
5. **Negative tests** — wrong password, failed knowledge check, duplicate registration, missing module, non-admin access.
6. **Reduced motion** — no confetti, no auto-advancing attack library, static hero trace.

---

## 3. End-to-end results

### 3.1 Authentication and profiles

| Test | Result |
|---|---|
| Register the first local profile | ✅ Pass — becomes workspace admin |
| Register additional profiles | ✅ Pass — become learners |
| Reject duplicate email | ✅ Pass — field-level message |
| Reject short password | ✅ Pass |
| Reject mismatched confirmation | ✅ Pass |
| Require local-storage acknowledgement | ✅ Pass |
| Wrong password shows an error | ✅ Pass |
| Correct password signs in | ✅ Pass |
| Sign out returns to the public site | ✅ Pass |
| Password change with current-password verification | ✅ Pass |
| Sign in with the new password | ✅ Pass |
| Existing-profile shortcut fills the email | ✅ Pass |
| Protected page redirects to sign-in with `next` | ✅ Pass |
| Authenticated visit to sign-in redirects to dashboard | ✅ Pass |

### 3.2 All sixteen modules

Each module was opened, started, played through every scene type present, and completed with the correct answers through the real UI.

| # | Module | Scene interactions exercised | Quiz | Result |
|---|---|---|---|---|
| 01 | Ghost Session | Story, flow, MFA simulation, rules, debrief | 4/4 | ✅ Pass |
| 02 | The CEO Text | Story, text simulation, vendor story, rules, debrief | 4/4 | ✅ Pass |
| 03 | Silent Signal | Eight-message classification, flow, rules, debrief | 4/4 | ✅ Pass |
| 04 | The Painted Door | Six-scenario gallery, flow, rules, debrief | 4/4 | ✅ Pass |
| 05 | The Locked Door | Story, flow, ransomware simulation, rules, debrief | 4/4 | ✅ Pass |
| 06 | The Voice on the Line | Vishing transcript tells, rules, callback simulation | 4/4 | ✅ Pass |
| 07 | Endless Knocking | Story, push-bombing simulation, rules, debrief | 4/4 | ✅ Pass |
| 08 | The Handed Key | Story, OAuth flow, consent simulation, rules | 4/4 | ✅ Pass |
| 09 | The Master Key | Story, credential-stuffing flow, rules, debrief | 4/4 | ✅ Pass |
| 10 | The Perfect Copy | Story, deepfake video simulation, rules, debrief | 4/4 | ✅ Pass |
| 11 | The Gift Nobody Sent | Story, USB flow, rules, debrief | 4/4 | ✅ Pass |
| 12 | The Open Window | Story, evil-twin flow, rules, debrief | 4/4 | ✅ Pass |
| 13 | Held Door | Story, tailgating simulation, rules, debrief | 4/4 | ✅ Pass |
| 14 | The Home Front | Story, home-network flow, rules, debrief | 4/4 | ✅ Pass |
| 15 | The Careless Hand | Six-item share/do-not-share classification, rules | 4/4 | ✅ Pass |
| 16 | The First Nine Minutes | Story, response flow, rules, debrief | 4/4 | ✅ Pass |

**Aggregate:** 16/16 modules completed; 64/64 knowledge-check questions answered correctly in the final pass; 16/16 badges issued.

### 3.3 Module player behavior

| Test | Result |
|---|---|
| Cover shows objectives, time, risk, scenes, check size | ✅ Pass |
| Start persists scene 0 | ✅ Pass |
| Next/back navigation | ✅ Pass |
| Scene dots navigate | ✅ Pass |
| Keyboard left/right navigation | ✅ Pass |
| Simulation choice reveals verdict + explanation | ✅ Pass |
| Classification requires all items | ✅ Pass |
| Gallery requires at least three scenarios | ✅ Pass |
| Transcript tells expand/collapse | ✅ Pass |
| Quiz cannot advance without an answer | ✅ Pass |
| Quiz shows immediate explanation | ✅ Pass |
| Passing marks completion and awards a badge | ✅ Pass |
| Failing shows 0/4 or low score and does **not** award a badge | ✅ Pass |
| Failing offers retry; retry resets the question flow | ✅ Pass |
| Refresh after partial progress resumes the scene | ✅ Pass |
| Completed module allows review and retake | ✅ Pass |
| “Next module” picks an incomplete module | ✅ Pass |
| Badge ID is generated and stored | ✅ Pass |
| Reduced motion prevents confetti | ✅ Pass |

### 3.4 Dashboard and progress

| Test | Result |
|---|---|
| Progress ring reflects completed modules | ✅ Pass — 9/16 showed 56% |
| Stat tiles update | ✅ Pass |
| Continue card chooses in-progress before new | ✅ Pass |
| Search filters modules | ✅ Pass |
| Tier filters | ✅ Pass |
| Status filter (new / in progress / complete) | ✅ Pass |
| Empty filter state with clear action | ✅ Pass |
| All 16 module cards render with status | ✅ Pass |
| Badge case shows locked/earned states | ✅ Pass |
| Badge modal shows ID, score, date, review link | ✅ Pass |
| Activity feed reflects real events | ✅ Pass |
| Certificate status card | ✅ Pass |
| Reset progress confirmation + re-render | ✅ Pass |
| Storage usage updates | ✅ Pass |

### 3.5 Certificate

| Test | Result |
|---|---|
| Locked before all modules complete | ✅ Pass |
| Shows remaining count and progress | ✅ Pass |
| Unlocks at 16/16 | ✅ Pass |
| Shows learner name, department, date, verification ID, average score | ✅ Pass |
| Copy ID | ✅ Pass |
| Print styles force a light, legible certificate | ✅ Pass — verified in print emulation |
| Landscape print page | ✅ Pass |
| Certificate is excluded from navigation when ineligible | ✅ Pass (locked state instead) |

### 3.6 Admin workspace

| Test | Result |
|---|---|
| Non-admin sees access-denied state | ✅ Pass |
| Admin sees KPI cards | ✅ Pass |
| Completion by module chart | ✅ Pass |
| 14-day activity chart | ✅ Pass |
| Tier donut chart | ✅ Pass |
| Score distribution | ✅ Pass |
| Recent activity feed | ✅ Pass |
| Most-completed modules | ✅ Pass |
| Learner search | ✅ Pass |
| Learner sort | ✅ Pass |
| Pagination | ✅ Pass |
| Learner detail drawer | ✅ Pass |
| Per-module progress in drawer | ✅ Pass |
| Recent attempts in drawer | ✅ Pass |
| Promote learner to admin | ✅ Pass |
| Demote admin (when another admin exists) | ✅ Pass |
| Prevent demoting the last active admin | ✅ Pass |
| Suspend/restore a learner | ✅ Pass |
| Prevent self-suspension / self-role change in UI | ✅ Pass |
| Reset a learner's progress | ✅ Pass |
| Export CSV download | ✅ Pass — `shadowproof-learners-YYYY-MM-DD.csv` |
| Reset workspace with confirmation | ✅ Pass |

### 3.7 Account settings

| Test | Result |
|---|---|
| Update name and department | ✅ Pass — header and certificate data update |
| Email remains read-only | ✅ Pass |
| Change password with wrong current password | ✅ Pass — rejected |
| Change password with correct current password | ✅ Pass |
| Sign in with new password | ✅ Pass |
| Light / Dark / System theme choice | ✅ Pass |
| Theme persists across reload | ✅ Pass |
| JSON export downloads | ✅ Pass |
| Reset progress | ✅ Pass |
| Sign out | ✅ Pass |

### 3.8 Navigation and links

| Test | Result |
|---|---|
| All root pages load | ✅ Pass |
| All 16 module IDs load | ✅ Pass |
| Unknown module shows a friendly missing state | ✅ Pass |
| Header/footer links resolve | ✅ Pass |
| Legacy archive links resolve | ✅ Pass |
| External live-demo link is correct | ✅ Pass |
| Internal link audit | 1 false positive in `legacy/index.html` (`${next.file}` inside a template literal); no broken links in the new application |

### 3.9 Console and runtime errors

| Surface | Result |
|---|---|
| Final end-to-end run | **0 page errors, 0 console errors** |
| All 16 modules | 0 errors |
| Dashboard, admin, account, certificate, roadmap | 0 errors |
| Mobile context | 0 errors |
| Favicon request | Resolved (SVG favicon added) |

---

## 4. Accessibility testing

### 4.1 Automated WCAG 2.1 A/AA scan

axe-core 4.10.2 was run against:

- `/index.html`
- `/dashboard.html`
- `/module.html?id=aitm`
- `/module.html?id=smishing`
- `/admin.html`
- `/account.html`
- `/certificate.html`
- `/roadmap.html`
- `/signin.html`
- `/404.html`

in **both light and dark themes** (20 page/theme combinations).

**Result: 0 violations.**

Interactive states were also scanned in light mode:

| State | Result |
|---|---|
| QR scenario gallery modal | 0 violations |
| Gallery scene | 0 violations |
| Classification with results revealed | 0 violations |
| Simulation feedback shown | 0 violations |
| Vishing transcript tell expanded | 0 violations |
| Quiz wrong-answer feedback | 0 violations |
| Badge detail modal | 0 violations |
| Admin learner drawer | 0 violations |

### 4.2 Manual accessibility checks

| Check | Result |
|---|---|
| Keyboard navigation through header, forms, modules, quiz | ✅ Pass |
| Visible focus ring | ✅ Pass |
| Skip-to-content link | ✅ Pass |
| Labels on inputs and selects | ✅ Pass |
| Modal closes with Escape | ✅ Pass |
| `prefers-reduced-motion` removes confetti and auto-advance | ✅ Pass |
| Light/dark contrast after token corrections | ✅ Pass (axe verified) |
| Semantic headings and landmarks | ✅ Pass |
| Responsive text without horizontal overflow | ✅ Pass |

### 4.3 Contrast corrections made

The first accessibility pass found real contrast issues. They were fixed, not suppressed:

- Light-mode module accents were too bright on paper backgrounds; introduced light-mode `color-mix` variants.
- Locked badge text was dimmed by whole-card opacity; replaced with dimmed SVG and readable text.
- Flow-node inactive states used opacity, reducing text contrast; replaced with icon-only dimming.
- Message timestamps used opacity; replaced with accessible token colors.
- Warning/danger pills in light mode were darkened.
- Active navigation and primary buttons in light mode were darkened.
- Theme-choice helper text and admin select labels were corrected.

The final two full axe runs returned **0 violations**.

---

## 5. Responsive testing

| Viewport | Result |
|---|---|
| 1440×900 desktop | ✅ Layouts, sidebar, charts, module grid correct |
| 1280×900 desktop | ✅ Correct |
| 390×844 mobile | ✅ Compact header, hamburger menu, stacked cards, forms, module player |
| Mobile menu | ✅ All items visible, inline icons, sign-out accessible |
| Mobile dashboard | ✅ Horizontal workspace nav, no horizontal page overflow |
| Mobile module cover | ✅ Readable title, objectives, CTA |
| Mobile certificate | ✅ Accessible locked/unlocked states; print is separate |
| Horizontal overflow | 0px on mobile landing and dashboard |

---

## 6. Visual QA

Screenshots were captured and reviewed for:

- Landing hero and live attack replay.
- Module grid and hover states.
- Interactive attack library.
- Dashboard with progress and badges.
- Admin analytics with real seeded local data.
- Account settings.
- Module cover and flow scene.
- Certificate print preview.
- Mobile landing, dashboard, menu, and module.

Issues found and fixed during visual review:

- Floating “session stolen” card overlapped the trace log.
- Mobile header overflowed; auth buttons hid the hamburger.
- Mobile menu icons stacked above labels.
- Certificate module list was unstyled.
- Certificate print used dark theme colors.
- Explainer title/description text concatenated.
- Light-mode module accents were unreadable.

---

## 7. QR code verification

Generated `assets/images/project-qr.png` with high error correction and a wide quiet zone.

| Check | Result |
|---|---|
| Image format | PNG, 688×688, RGB |
| Error correction | High (H) |
| Quiet zone | 5 modules |
| Decode tool | OpenCV `QRCodeDetector` |
| Decoded value | `https://esperkro.github.io/AiTM` |
| Exact match | ✅ Pass |

---

## 8. Static checks

| Check | Result |
|---|---|
| `node --check` on all `data/*.js` | ✅ Pass |
| `node --check` on all `assets/js/*.js` | ✅ Pass |
| Required assets exist | ✅ Pass |
| Relative image paths in README | ✅ Pass |
| QR image path in README | ✅ Pass |
| All primary pages include favicon | ✅ Pass |
| All primary pages include theme bootstrap | ✅ Pass |
| No external runtime dependency beyond Google Fonts | ✅ Pass |

---

## 9. Known limitations

| Limitation | Impact | Status |
|---|---|---|
| Static-only architecture | No cross-device sync, central reporting, or verified identity. | Intended; documented. |
| localStorage persistence | Clearing browser data deletes the workspace. | Documented; JSON/CSV export available. |
| Local authentication | Not resistant to a determined local attacker with storage access. | Explicitly disclosed in UI and docs. |
| Client-side grading | Answers are present in the curriculum data. | Acceptable for education; server-side grading is a future step. |
| Browser coverage | Automated tests used Chromium only. | Manual visual checks; Firefox/Safari are expected to work but were not runtime-tested in this pass. |
| Legacy archive | The original pages use their own storage keys and visual language. | Intentionally isolated under `legacy/`. |
| Print fidelity | Depends on the browser's print dialog and selected paper size. | Print styles force light colors and landscape. |
| Google Fonts | External request; offline use falls back to system fonts. | Acceptable; self-hosting is a future improvement. |

No unresolved functional bugs were found in the primary flow.

---

## 10. Reproducing the tests

### Serve

```bash
cd AiTM
python3 -m http.server 8080
```

### Manual smoke path

1. Open <http://localhost:8080>.
2. Create the first profile (admin).
3. Open a module, make a decision, and complete a knowledge check.
4. Confirm the badge on the dashboard.
5. Sign out, create a second profile (learner), and complete a module.
6. Sign back in as the admin and open **Analytics**.
7. Search, open a learner, change role/status, export CSV.
8. Toggle light/dark on every page.
9. Resize to 390px width and open the mobile menu.
10. Complete all modules and print the certificate.

### Automated Playwright outline

The final run performed:

- Register admin.
- Create three learners through the local repository.
- Wrong-password test.
- Loop all 16 modules: start, play every scene type, answer all questions correctly, assert result.
- Assert dashboard 100%.
- Assert certificate exists.
- Assert 4 learners in admin.
- Open learner drawer, promote a learner, export CSV.
- Toggle theme on seven pages and assert the theme actually changes.
- Mobile registration, menu, and module cover.
- Collect console/page errors.

### Accessibility

Inject axe-core and run:

```js
await axe.run(document, {
  runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'] }
});
```

Expected: `violations: []` on the tested pages and states.

---

## 11. Final quality gate

| Gate | Status |
|---|---|
| Every primary page loads | ✅ |
| Every module is playable end to end | ✅ |
| Every quiz can pass and fail correctly | ✅ |
| Badges and progress persist | ✅ |
| Certificate unlocks and prints | ✅ |
| Admin analytics and export work | ✅ |
| Light and dark themes work everywhere | ✅ |
| Mobile layout works without overflow | ✅ |
| Zero console/page errors in the final run | ✅ |
| Zero WCAG 2.1 A/AA axe violations | ✅ |
| QR code decodes to the exact live URL | ✅ |
| README images and links resolve | ✅ |
| No TODOs or placeholder flows | ✅ |

**Conclusion:** the implementation is functionally complete, accessible, responsive, and documented for the stated educational scope.

---

Developed and maintained by **[@maldevo](https://github.com/maldevo)** · GitHub: <https://github.com/maldevo>
