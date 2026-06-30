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
**v2 live-in apartment — DONE (incl. the Phase 2 decoupled-rents model change). Awaiting user review at localhost:3000, then commit.**
Model semantics now (model.ts loop ~line 148):
- `marketRent = R0·(1+Ri)^yr` = THIS apartment's market rent. ALWAYS the maintenance basis (`maintenance = marketRent·maintRate/12`), in both modes. Also the collected rent when renting out.
- `incomeRent` (offsets mortgage in flow) = marketRent (rentout) OR `liveInRent·(1+Ri)^yr` (livein = the rent you'd pay ELSEWHERE, the avoided-rent benefit).
- `flow = incomeRent − maintenance − mort`. VERIFIED: rentout ≡ livein when liveInRent==R0 (max |Δ|=0 over 360mo). Lowering liveInRent reduces apt advantage; maintenance unchanged (delta == avoided-rent delta exactly).
UI: occupancy toggle (השכרה/מגורים) at top of Property group. In livein: R0 relabels to "Apartment's market rent / שכר הדירה בשוק" (maintenance basis), and a NEW liveInRent slider appears ("Rent you'd otherwise pay / שכר דירה שהייתם משלמים", default 6000=R0). Chart cashflow rent bar = incomeRent, labeled "rent avoided".
Files: types.ts (+occupancy +liveInRent), model.ts (split + DEFAULT_PARAMS liveInRent:6000), Sliders.tsx (toggle + liveInRent slider filtered to livein + R0/maint live-in tooltips), i18n.ts (EN+HE keys; dropped unused riTooltipLiveIn), Chart.tsx (occupancy prop + resolved rent labels), Calculator.tsx (occupancy prop; compute(params) picks up rest), InfoTooltip.tsx (auto-RTL via Hebrew detection).
ALSO this session: chart view-button reorder gains/diff/IRR/cashflow (Chart.tsx ~660); full em-dash→hyphen sweep in i18n.ts (38 replaced, en-dash date ranges preserved).
STILL OPEN: methodology/under-the-hood modal doesn't yet explain occupancy/decoupled rents (optional). Nothing committed yet — visual review pending.
Deferred Phase 2 remainder: rental-income tax on the rent-out side (only thing left that makes modes diverge when liveInRent==marketRent).
