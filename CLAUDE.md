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
(none — all shipped. Latest: 18-month מס שבח cliff + cashflow toggle polish, commit 29dc3b3, deployed to apartment-calc.com, pushed. The 18-month reminder is resolved.)

Deferred (not started): rental-income tax on the rent-out side — the only remaining thing that would make rent-out vs live-in diverge when liveInRent==marketRent. See memory session_state.md for the full write-up.
