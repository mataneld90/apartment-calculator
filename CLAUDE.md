# RTL Arrow / Chevron Convention

Never use literal directional characters (→, ←, ▶, ◀) as hardcoded static text in any bilingual (Hebrew/English) context. They always point one fixed way and break in the opposite direction.

**Approved patterns:**

1. **Navigation / flow arrows** — choose at render time:
   ```tsx
   isRTL ? '← הבא' : 'Next →'   // forward
   isRTL ? 'הקודם →' : '← Back'  // backward
   ```
   Or keep nav in `dir="ltr"` and swap the button actions (the existing calc approach — both are valid).

2. **Sequence separators** (e.g. "purchase → rent → sell") — use the reading-direction arrow:
   ```tsx
   // HE (RTL): items listed right→left, arrows point left
   <>המחשבון מדמה רכישה ← השכרה ← מכירה</>
   // EN (LTR): items listed left→right, arrows point right
   <>This models a purchase → rent → sell scenario</>
   ```

3. **Chevrons on collapsible sections** — pass `isRTL` to the component and flip with `scaleX(-1)` when closed:
   ```tsx
   style={{ transform: open ? 'rotate(90deg)' : (isRTL ? 'scaleX(-1)' : 'none') }}
   ```

4. **flex layout reversal** — prefer `dir={isRTL ? 'rtl' : 'ltr'}` on the container so the browser handles visual mirroring automatically.

---

## Workflow protocol (standing rules)

**Deployment cadence — do NOT deploy per fix.**
- Make all changes in a batch against the working tree. Commit each logical change separately with a clear message (so changes can be bisected/reverted individually), but do NOT build or deploy after each one.
- Deploy ONLY when the user explicitly says to deploy. Default assumption: the user reviews first, then triggers deployment for the whole batch at once.
- After a deploy, expect one verification pass on the live site — not per-change verification.
- **Commit before reporting back.** After completing a task, commit it before ending your turn — never leave the working tree dirty. Non-visual changes (math, text, defaults): commit when done. Visual changes: show the diff or a local preview first, commit on confirmation.

**Local preview over deploy.**
- For visual/layout changes (charts, spacing, RTL, mobile), run the dev server (`npm run dev`) so the user can preview on localhost. Do not deploy to preview.
- For non-visual changes (model math, text, defaults, tax logic, i18n strings), the user reviews the diff — no preview server or deploy needed. Present a clear summary of what changed in each file.

**Scope discipline.**
- For a bounded task (a CSS fix, a text change, a single value), do NOT survey the whole codebase. Read only the files directly relevant, make the change, stop.
- If the relevant file/library isn't obvious, ASK one specific question rather than exploring across many files and burning tokens.
- Never open unrelated files (formatters, i18n, palettes, chart logic) for a task that doesn't touch them.

**Reference-vs-description rule.**
- When a prompt describes how the reference app behaves and the reference's actual code disagrees, the CODE is the source of truth. Match real behavior, not the prompt's description, and flag the discrepancy.

**Session resumption.**
- Keep a `## ACTIVE TASK` section at the top of this file updated with the current in-progress task and its remaining steps.
- On a fresh session, if `## ACTIVE TASK` is non-empty, state what it says and ask whether to resume — do not greet with "what now?" as if no task exists.
- Before any reset or when stuck, commit completed work and update `## ACTIVE TASK` with what's done vs pending.

## ACTIVE TASK
Spotlight/guided tour (branch layout-redesign, NOT deployed, NOT pushed)

DONE:
- Tour.tsx complete + wired in Calculator.tsx (auto-opens on first visit via
  localStorage hasVisitedBefore; "How this works" header button starts it;
  10 steps EN+HE; chart steps switch the chart view). Committed bc0d055.
- Dev-server containment: package.json dev-script thread caps +
  next.config.ts turbopack root pin, commit 31b7fa0. RULE: run the dev
  server ONLY via
  `systemd-run --user --unit=calcdev -p TasksMax=500 --working-directory=. /usr/bin/npm run dev`
  (bare `npm run dev` wedged the whole WSL session twice).
- VISUALLY VERIFIED 2026-07-05: all 10 steps screenshotted in HE-desktop,
  EN-desktop, HE-mobile (~/projects/tour-shots-2026-07-05/). Spotlight hole,
  card placement, RTL page indicator, chart-view switching all correct.
- User's first review round applied, commit 536bbc9 (tour now 12 steps):
  copy fixes (dp amount/percent, prepayment fee, plural crossovers, diff
  reword), cashflow split into lines + bars cards (chartSubView plumbing),
  final under-the-hood card, lang toggle on card 1, indigo card background,
  removed post-tour diff/flow button flash. Re-verified HE+EN headless.
- Round 2 (4fadc21): tour card is theme-INDEPENDENT bright (indigo-50 bg,
  hardcoded slate text) - dark variant blended into the dim overlay.
- Round 3 (d8a24c5, 13 steps): dp-copy fix (percent = bank's financing
  fraction), new summary-strip card 4 (data-tour="summary"), grey flash on
  the cashflow sub-toggle when the tour flips it, ESC exits, params reset
  to defaults during tour + restored on any exit.
- Round 4 (356a116): the round-3 reset was defeated in amount mode by
  Sliders' local down-payment state (keep-₪-fixed effect rewrites p on
  Av0 change) -> Sliders now keyed on sliderEpoch, bumped on tour
  start/close, dpMode forced 'amount' during tour + restored. Chart
  snapshots view+cashflow sub-view on tour start, restores on end.

OPEN:
- [ ] User re-reviews the revised tour on localhost:3000.
- [ ] USER DECISION: dead methodology modal - the tour replaced it
      (methodologyOpen / setIsFirstVisitPanel(true) never called). Remove
      MethodologyPageHE/EN + goToMethodologyPage etc., or re-expose it?
- [ ] After decision: build + deploy + push (12 commits ahead of origin).

Previous task (canonical host consolidation, www.apartment-calc.com):
shipped + deployed (70e3d8a); apex 301->www verified; GSC domain property
verified + sitemap submitted. Remaining GSC checks (user's login):
Sitemaps "Success" (~days), page indexed (~1-2 weeks).

Previously shipped: 18-month מס שבח cliff + cashflow toggle polish, commit
29dc3b3, deployed, pushed (resolved).

Deferred (not started): rental-income tax on the rent-out side — the only remaining thing that would make rent-out vs live-in diverge when liveInRent==marketRent. See memory session_state.md for the full write-up.
