# PROJECT UNDERSTANDING — SHADOWPROOF

> A complete description of what the project is, how it works, and how the pieces connect. This document reflects the implementation **as built**, not an aspiration.

---

## 1. Executive summary

**SHADOWPROOF** is a static, browser-based cybersecurity awareness training suite. It teaches the human layer of security through sixteen short interactive stories about phishing, identity attacks, physical security, and incident reporting.

The product is built for **students of the Cybersecurity Department at GNA University**, with a secondary use case for faculty-led workshops and small teams. It is educational: the scenarios are simulated, no data leaves the browser, and no real credentials are collected.

The defining product idea is:

> People do not need another compliance video. They need to make the decision once, see the consequence, and recognize the pattern next time.

Every module follows the same learning loop:

1. **Orient** — a cinematic cover with objectives and risk context.
2. **Experience** — a realistic scenario with an actual decision.
3. **Understand** — a flow, transcript, gallery, or sort exercise that explains the mechanism.
4. **Practice** — a concise playbook of defensive habits.
5. **Prove** — a four-question knowledge check with explanations.
6. **Record** — a badge, module completion, and progress toward a certificate.

---

## 2. Purpose, audience and model

| Dimension | Detail |
|---|---|
| **Primary audience** | Cybersecurity students at GNA University |
| **Secondary audience** | Faculty, lab instructors, student security clubs, small teams |
| **Problem** | Awareness training is often passive, abstract, and built to satisfy an audit rather than change behavior. |
| **Approach** | Short adversarial stories that put the learner inside the decision. |
| **Delivery** | Static site, no backend, no build step, deployable on GitHub Pages. |
| **Business / academic model** | Free educational artifact; no accounts, payments, or vendor dependency. |
| **Success signal** | A learner can recognize the pattern in a new message and knows the correct first action. |

The project deliberately avoids collecting student data. Profiles, progress, and analytics exist only in the learner's browser. This is both a privacy decision and a practical one: the project can be run in a classroom without procurement, hosting, or data-protection review.

---

## 3. What existed before

The original repository contained:

- Five stand-alone HTML modules: AiTM, BEC, smishing, quishing, and vishing.
- A local profile/sign-in prototype.
- A shared quiz/badge script and question bank.
- A landing page listing sixteen planned modules, of which only five were built.
- A 2027 roadmap proposal.
- No unified design system, no dark/light mode, no dashboard, no admin analytics, no certificate, and no data export.
- No build, backend, or dependency management.

The five original modules each had a distinct visual style (terminal, newspaper, Japanese poster, theater). Their content and interaction ideas were preserved and re-expressed in a single, accessible module engine. The originals remain available under `legacy/` as an archive.

---

## 4. Current architecture

SHADOWPROOF is a **static, data-driven application**. There is no server, API, database, or authentication service.

```text
Browser
├── HTML pages (routing + semantic structure)
├── CSS design system (tokens + components + page styles)
├── Vanilla JS
│   ├── curriculum data (16 modules, 64 questions)
│   ├── local repository (localStorage)
│   ├── shared UI layer
│   └── page controllers
└── localStorage
    ├── profiles
    ├── session
    ├── progress
    ├── badges
    ├── attempts
    └── events
```

### 4.1 Pages and responsibilities

| Page | Responsibility |
|---|---|
| `index.html` | Public landing page, animated AiTM replay, module preview, interactive attack library, trust/feature sections. |
| `signin.html` | Local profile sign-in, registration, profile switching, password validation. |
| `dashboard.html` | Authenticated learner home: progress ring, next module, stats, filters, module grid, badge case, activity, certificate status. |
| `module.html` | Data-driven player for every module: cover, scene renderer, scene navigation, quiz, result, badge award. |
| `account.html` | Profile edit, password change, theme choice, JSON export, progress reset, sign-out. |
| `admin.html` | Workspace analytics: KPIs, completion by module/tier, activity, score distribution, learner table, detail drawer, role/status controls, CSV export. |
| `certificate.html` | Eligibility gate and printable certificate with verification ID and average score. |
| `roadmap.html` | 2027 production roadmap for turning the prototype into a hosted program. |
| `404.html` | Friendly not-found page. |
| `legacy/*` | Archived original five-module prototypes. Independent and not part of the new flow. |

### 4.2 Shared layers

**Curriculum (`data/`)** is the single source of truth for module content. Tier files define module metadata, scenes, questions, and explanations. `curriculum.js` combines them and exposes:

- `modules`, `byId`, `tiers`, `tierById`
- `get(id)`, `byTier(tier)`
- `passThreshold(module)` (75%, i.e. 3 of 4)

**Local repository (`assets/js/store.js`)** owns all persistence and domain rules:

- Profile registration, login, session handling, profile updates, password changes.
- Progress upsert and resume state.
- Assessment grading, attempts, badge issuance, completion timestamps.
- Event log for the personal activity feed and admin analytics.
- Dashboard aggregation and certificate eligibility.
- Admin overview, learner list, learner detail, role/status changes, CSV export, workspace reset.
- JSON export for a single learner.

**Shared UI (`assets/js/ui.js`)** provides:

- Header and footer rendering, navigation, user menu, mobile menu.
- Theme toggle binding.
- Toasts, modals, confirmation dialogs, copy/download helpers.
- Rich text escaping and a small Markdown-like renderer (`**bold**`, `*italic*`, `` `code` ``).
- Date/time formatting, initials, badge SVG generation, progress rings, confetti.
- Auth guard and redirect helpers.

**Icons (`assets/js/icons.js`)** is an inline SVG set (no icon font, no external requests).

**Theme (`assets/js/theme.js`)** runs before paint, applies the saved theme or system preference, and exposes `SP.theme`.

### 4.3 The module engine

`module.html?id=<module-id>` loads the curriculum, filters the cover scene (`type: "brief"`) from the playable scenes, and renders one scene at a time.

Supported scene types:

| Scene type | Purpose | Interaction |
|---|---|---|
| `story` | Narrative setup with a callout and quote | Reading |
| `flow` | Explain how information moves through an attack | Click steps, replay sequence |
| `sim` | A message/call/desktop scenario | Choose a response; verdict + explanation |
| `classify` | Inbox or data-handling sort | Classify every item; score + reason |
| `gallery` | A set of scenarios (e.g. QR contexts) | Open at least three details |
| `transcript` | A reconstructed vishing call | Reveal “tell” explanations |
| `rules` | A defensive playbook | Reading |
| `debrief` | Checklist + takeaway + report prompt | Check off items, jump to reporting |

The engine also handles:

- Scene dots and a sticky bottom navigation bar.
- Per-scene progress persistence.
- A cover with objectives and completion state.
- Quiz intro, one-question-at-a-time quiz, immediate feedback, and submission to the repository.
- Pass/fail result, badge display, confetti (unless reduced motion), retry, review, next module.
- Keyboard arrows for back/next, suppressed while typing or a modal is open.

### 4.4 Data model

All keys are versioned.

| Key | Shape | Notes |
|---|---|---|
| `sp:users:v2` | Array of user objects | `id`, `name`, `email`, `dept`, `role`, `status`, `createdAt`, `lastLoginAt`, `password` (PBKDF2 verifier). |
| `sp:session:v2` | `{ userId, createdAt, lastSeenAt }` | Expires after 30 days. |
| `sp:progress:v2` | `{ userId: { moduleId: { sceneIndex, status, score, total, startedAt, updatedAt, completedAt } } }` | Completion only via a passed assessment. |
| `sp:badges:v2` | `{ userId: { moduleId: { badgeCode, score, total, earnedAt } } }` | One badge per user/module; best score retained. |
| `sp:attempts:v2` | `{ userId: [attempt] }` | Capped at 100 attempts per learner. |
| `sp:events:v2` | Array of events | Capped at 800; drives activity feeds. |
| `sp:theme:v1` | `"light"` or `"dark"` | Absent means follow system. |

### 4.5 Authentication, session and roles

This is **local authentication**, not institutional identity:

- Registration validates name, valid email, unique email on the device, password length ≥ 8, and a minimum strength score.
- Passwords are derived with PBKDF2-SHA-256 (120,000 iterations, 16-byte salt, 256-bit result) via Web Crypto.
- A documented iterated-hash fallback exists for contexts where `crypto.subtle` is unavailable (e.g. some `file://` views).
- The session is a userId + timestamp stored in localStorage; it is not a cryptographic token and cannot secure a shared device against a determined local user.
- The first profile on a device is the **workspace admin**. Later profiles are learners.
- Admins can promote/demote, suspend/restore, view learner details, export CSV, and reset a learner's progress.
- The last active admin cannot be demoted or suspended. Admins cannot change their own role/status through the UI.

The UI clearly states that this is not a corporate identity system. This honesty is part of the product design.

### 4.6 Analytics

The admin view computes everything from local data:

- Total learners, active learners, admins.
- New learners (30 days), active learners (7 days).
- Module completions, badges, attempts, average score.
- Completion rate = completions ÷ (learners × 16).
- Completion by module and by tier.
- 14-day event activity (including zero days).
- Knowledge-check score distribution (0–4).
- Recent workspace events.
- Learner table with search, sort, pagination, progress, badges, last active, status.
- Learner detail drawer with per-module progress and recent attempts.
- Role/status controls and per-learner progress reset.
- CSV export of every learner and module score.

There is no mock data and no server. Empty states are explicit.

### 4.7 Certificate

Eligibility requires **all 16 modules completed**. The certificate includes:

- Learner name and department.
- Completion statement.
- Issue date.
- Verification code derived from the learner ID suffix and completion year.
- Average knowledge-check score.

It is printable via the browser print dialog. Print styles force a light, legible certificate and hide navigation, sidebars, and actions.

### 4.8 Theming and accessibility

- `tokens.css` defines complete dark and light palettes; every component uses tokens.
- The theme is applied before paint to avoid a flash.
- First visit respects `prefers-color-scheme`; later visits use the stored preference.
- A header toggle switches themes; Settings can restore system mode.
- Motion respects `prefers-reduced-motion` (hero trace, explainer auto-advance, confetti, reveals).
- Automated axe-core checks returned **zero WCAG 2.1 A/AA violations** across 20 page/theme combinations and interactive states.
- Keyboard navigation, visible focus, skip links, labelled controls, semantic landmarks, and readable contrast are implemented.

---

## 5. How the modules connect

The curriculum is organized in four tiers:

1. **Human-targeted attacks** — the message, link, attachment, and QR code.
2. **Identity & access** — the prompt, code, permission, password, and synthetic identity.
3. **Physical & environmental** — the device, network, door, and home office.
4. **Human & operational** — data handling and the reporting response.

Modules are independent, but they build a shared vocabulary:

- Tier 1 establishes **recognition** (lookalikes, urgency, channels).
- Tier 2 establishes **verification** (out-of-band checks, MFA behavior, permission reading).
- Tier 3 establishes **environment** (hardware, networks, physical access).
- Tier 4 establishes **response** (safe sharing and fast reporting).

The reporting module is cross-linked from every debrief, reinforcing that recognition without a response is incomplete.

---

## 6. Integrations and dependencies

| Integration | Purpose | Failure behavior |
|---|---|---|
| Google Fonts | Inter, Instrument Serif, JetBrains Mono | System font fallbacks are defined. |
| Browser Web Crypto | PBKDF2 password verifiers | Documented local fallback keeps the app usable. |
| `localStorage` | All persistence | If unavailable/quota exceeded, writes fail gracefully; the UI still runs but cannot persist. |
| None | No analytics, tracking, ads, payments, or external APIs | — |

There is no backend, no database, no email service, and no third-party auth.

---

## 7. Key technical decisions

| Decision | Reason |
|---|---|
| Stay static | The brief and educational context favor portability, privacy, and easy GitHub Pages hosting. |
| Vanilla JS | Small surface area, auditable, no dependency or build risk. |
| Data-driven modules | Sixteen modules share one player; content changes do not require new HTML. |
| localStorage repository | Real persistence and multi-profile behavior without a server. |
| Local PBKDF2 | Avoids storing plaintext passwords; honest about local-only security. |
| Inline SVG icons | No icon-font dependency, crisp at any size, theme-aware. |
| Design tokens | Complete light/dark support without duplicating component CSS. |
| Archive the originals | Preserves the original five prototypes and their historical design. |

---

## 8. Technical debt and constraints

| Item | Impact | Mitigation |
|---|---|---|
| No backend | No cross-device sync, no verified identity, no central reporting. | Clearly documented; the 2027 roadmap describes a hosted path. |
| localStorage limits | A few MB per origin; clearing browser data deletes progress. | Data export, small payloads, explicit privacy note. |
| First profile = admin | A shared device can create an admin. | Appropriate for a classroom demo; not production RBAC. |
| Local password verifier | Cannot protect against a determined local attacker with storage access. | Stated in UI and docs; not a corporate identity system. |
| Legacy pages | Separate storage keys and visual language. | Archived under `legacy/`; excluded from the primary flow. |
| Google Fonts request | External network request on first load. | System fallbacks; could be self-hosted later. |
| Client-side grading | A motivated learner can inspect answers in the data files. | Acceptable for a learning tool; server-side grading is a future improvement. |

---

## 9. Security considerations

- All user-controlled strings rendered into HTML pass through `escapeHtml`; the `rich` renderer escapes first, then applies a small allow-list of formatting.
- There is no `eval`, no dynamic script injection, and no remote data fetching.
- The app does not collect or transmit credentials, files, or telemetry.
- The simulated phishing pages are illustrative and do not submit data anywhere.
- CSV export escapes commas, quotes, and newlines.
- Admin actions require the local admin role; destructive actions use confirmation dialogs.
- The biggest residual risk is the platform model itself (local-only trust), which is documented rather than hidden.

---

## 10. Definition of done for this transformation

The project is considered complete for this phase when:

- All sixteen modules are playable end to end.
- Every module has a knowledge check, badge, and completion record.
- A learner can register, resume, review, retake, and complete the suite.
- A certificate is issued after full completion and prints legibly.
- An admin can inspect local analytics, manage learners, and export data.
- Light and dark themes work on every page.
- The layout works at desktop, tablet, and mobile widths.
- Automated end-to-end and accessibility checks pass.
- The repository is documented, attributed, and visually presented for a public academic audience.

All of the above were verified in the final testing pass. See `TESTING_REPORT.md`.

---

Developed and maintained by **[@maldevo](https://github.com/maldevo)** · GitHub: <https://github.com/maldevo>
