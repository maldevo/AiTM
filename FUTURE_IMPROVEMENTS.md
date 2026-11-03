# FUTURE IMPROVEMENTS — SHADOWPROOF

> A prioritized backlog for the next stages of the project. The current build is complete for its static, local-first scope; these ideas extend it without weakening that foundation.

---

## 1. Guiding principles

1. **Keep the learner experience short.** Any new feature must earn its place in a 6–10 minute module.
2. **Privacy is a feature.** Do not add telemetry or accounts without a clear, consensual reason.
3. **Accessibility is a gate.** New components must pass the same axe/WCAG checks.
4. **Content remains data.** New modules should be files, not new HTML pages.
5. **Static first.** Prefer enhancements that still work on GitHub Pages.

---

## 2. Highest-value next steps

### 2.1 Hosted version with institutional SSO

**Problem:** the local-first model cannot provide cross-device progress, verified identity, or central reporting.

**Proposal:**

- Add a small backend (Node/Fastify or Python/FastAPI) with PostgreSQL or SQLite.
- Integrate OIDC/SAML with the university identity provider.
- Move assessment grading and badge issuance server-side.
- Keep the static client and the same API-shaped repository interface.
- Add role mapping from identity groups (student, faculty, admin).
- Provide a migration path for local records (JSON import).

**Guardrails:** data minimization, retention policy, consent screen, institutional review.

### 2.2 Verifiable certificate

**Problem:** the current certificate is a local record, not a credential.

**Proposal:**

- Issue a signed certificate (Ed25519) with a public verification page.
- Include a short verification URL/QR on the printed certificate.
- Store only the minimum record: name, department, issue date, score band, certificate ID.
- Add a revocation list for reissued certificates.

This would require a backend or a static signed-record scheme with a public key.

### 2.3 Cohort and classroom mode

**Problem:** the current admin view is one browser. A class needs a shared view.

**Proposal:**

- Instructor-created cohort code / join link.
- Assignment due dates and a simple completion board.
- Aggregate, anonymized class heatmap (no individual ranking by default).
- Export for a gradebook (CSV with configurable columns).
- Optional group discussion prompts per module.

**Ethical note:** avoid public leaderboards that punish slower learners; show progress, not people.

### 2.4 Content refresh pipeline

**Problem:** attack patterns change; static content can age.

**Proposal:**

- Move module content to JSON/YAML with a schema.
- Add a content validation script (required fields, question explanations, link checks).
- Add a “last reviewed” date per module and show it on the cover.
- Create a reviewer checklist for accuracy and tone.
- Version the curriculum and record which version a learner completed.

### 2.5 More module variety

High-value additions:

- **Credential stuffing / breach response** — what to do after a password appears in a breach.
- **Social media oversharing** — how public details fuel pretexting.
- **Travel and border security** — device minimization and lock-down.
- **Payment fraud** — invoice redirection, vendor verification, dual approval.
- **AI agent / chatbot risks** — prompt injection, data leakage, over-permissioned tools.
- **Cloud sharing** — public links, guest access, and accidental exposure.
- **Incident tabletop** — a multi-step team scenario for a classroom.

Keep each module to one clear behavior.

---

## 3. Product and UX improvements

### 3.1 Learning path

- A visual tier map showing prerequisites and recommended order.
- “Continue where you left off” across multiple devices (requires backend).
- A short daily/weekly goal (“one module this week”) with opt-in reminders.
- A printable one-page “defensive habits” card generated from completed modules.

### 3.2 Assessment

- Question bank rotation so retakes use different questions.
- Scenario-based questions with images or short transcripts.
- Confidence rating (“how sure are you?”) to distinguish guessing from knowledge.
- Explanations linked to the relevant scene.
- Optional timed mode for workshops (off by default).

### 3.3 Accessibility

- Add a “dyslexia-friendly” font/spacing option.
- Add text-size controls independent of browser zoom.
- Add captions/transcripts for any future audio or video.
- Add high-contrast mode beyond light/dark.
- Add screen-reader testing with NVDA/JAWS and VoiceOver.
- Add reduced-data mode that disables Google Fonts and heavy visuals.

### 3.4 Internationalization

- Extract UI strings and module content into locale files.
- Support right-to-left layouts.
- Translate the six highest-impact modules first.
- Keep metaphors culturally portable; avoid idioms that do not translate.
- Add a language selector and persist the choice.

### 3.5 Offline / PWA

- Add a service worker to cache the shell and curriculum.
- Add a web app manifest and install prompt.
- Support offline module play and sync progress when back online (requires backend).
- Show a clear offline/online indicator.

### 3.6 Gamification without manipulation

- Streaks and milestones, opt-in only.
- Team/cohort goals rather than individual public rankings.
- “Pattern master” badges for completing all modules in a tier.
- A shareable badge image (PNG) generated from the SVG.
- Avoid loss-framed notifications and dark patterns.

---

## 4. Analytics and reporting

### 4.1 For instructors

- Class-level completion and score distribution.
- Module drop-off analysis (which scene loses learners).
- Pre/post confidence comparison.
- Export templates for LMS gradebooks.
- Scheduled CSV/PDF reports.
- Optional anonymous benchmarking across cohorts.

### 4.2 For the program

- Map completion to phishing-simulation click rate (if the institution runs authorized simulations).
- Track report rate and time-to-report.
- 90-day retention recheck.
- Content effectiveness: which explanations correlate with improved retake scores.

### 4.3 Privacy-preserving analytics

- Aggregate by default; individual data only to the instructor of record.
- Data retention limits and automatic deletion.
- No third-party trackers, ad pixels, or session recording.
- Clear consent and a learner-accessible data export/delete flow.

---

## 5. Technical improvements

### 5.1 Backend and data

- API contract shared between client and server.
- Server-side grading with signed assessment tokens.
- Idempotent progress writes.
- Rate limiting and audit logs.
- Encrypted backups and restore drills.
- Role-based access control with least privilege.
- Data migration tooling from local JSON exports.

### 5.2 Frontend engineering

- Extract shared page controllers into small ES modules.
- Add a lightweight test harness for the scene engine.
- Add schema validation for curriculum files at load time.
- Add a build-free linting step (ESLint/Prettier as dev-only tools).
- Add visual regression tests for key pages.
- Add a content security policy via hosting configuration.
- Self-host fonts to remove the only external runtime request.
- Add cache-busting query strings or hashed filenames for assets.

### 5.3 Security hardening

- Add Subresource Integrity if any CDN asset is introduced.
- Add a strict CSP and `Permissions-Policy` on the host.
- Add dependency scanning if a build tool is introduced.
- Add a secret-scanning check if a backend is added.
- Document a responsible-disclosure policy.
- Add automated checks for unsafe HTML injection in new content.

### 5.4 Performance

- Measure largest contentful paint and interaction latency on a mid-range phone.
- Preload the active module data only (split curriculum by tier).
- Lazy-load screenshots and the attack library below the fold.
- Optimize the hero animation for low-power devices.
- Add a “lite” mode for slow connections.

---

## 6. Content and pedagogy

- Add a short “why this matters” note to each tier.
- Add a one-sentence “if you remember nothing else” line to every module.
- Add a “what would you do next?” follow-up after each debrief.
- Add classroom discussion prompts for faculty.
- Add a facilitator guide with timing, setup, and debrief questions.
- Add a glossary of terms (AiTM, BEC, MFA fatigue, OAuth, evil twin, etc.).
- Add citations and further reading for each module.
- Add an “attack anatomy” poster per tier for labs.
- Review all statistics and claims on a fixed cadence; remove anything that cannot be sourced.
- Add learner feedback (“was this scenario realistic?”) with a local-only note.

---

## 7. Distribution and community

- Publish a GitHub Pages site with a custom domain.
- Add a CONTRIBUTING guide and content style guide.
- Add issue templates for content corrections and accessibility bugs.
- Add a CODE_OF_CONDUCT.
- Add a changelog and release tags.
- Add a “for instructors” page with a one-click classroom setup.
- Provide a printable workshop kit (facilitator script, slides, handouts).
- Add an exportable “training record” for a portfolio.
- Translate the README into additional languages if adopted internationally.

---

## 8. Suggested sequencing

| Phase | Focus | Why |
|---|---|---|
| **Now → Q1** | Content review, glossary, facilitator guide, PWA shell, self-hosted fonts | High value, low risk, still static. |
| **Q2** | Backend + SSO + server-side grading + cross-device progress | Unlocks institutional use. |
| **Q3** | Cohort mode, instructor analytics, LMS export, certificate verification | Makes it a program, not a demo. |
| **Q4** | Localization, advanced accessibility, content refresh pipeline, new modules | Scales quality and reach. |
| **Next** | AI-agent risks, cloud sharing, tabletop exercises, research evaluation | Keeps the curriculum current. |

---

## 9. Ideas deliberately deferred

| Idea | Why deferred |
|---|---|
| Public leaderboard | Can shame learners and reward speed over understanding. |
| Real phishing simulation | Requires authorization, infrastructure, and ethical review. |
| Native mobile apps | The responsive web app covers the need. |
| Heavy LMS integration | Institutional requirements vary; start with CSV. |
| AI-generated module content | Risks inaccurate or inconsistent safety advice; human review is mandatory. |
| Session recording | Incompatible with the project's privacy stance. |

---

## 10. Success measures for the next phase

- Module completion rate ≥ 80% in a pilot cohort.
- Knowledge-check pass rate improves between first and second attempts.
- Learners can explain the core pattern in their own words.
- Report rate for suspicious messages increases after training.
- Zero critical accessibility regressions.
- No learner data collected without explicit consent.
- Instructors can run a cohort without engineering support.

---

## 11. Closing note

The current build proves the core idea: short, honest, interactive stories can make security concepts concrete. The next step is not more visual polish — it is **measurement, institutional fit, and content freshness**. Keep the learner's ten minutes sacred, and the product will stay useful.

---

Developed and maintained by **[@maldevo](https://github.com/maldevo)** · GitHub: <https://github.com/maldevo>
