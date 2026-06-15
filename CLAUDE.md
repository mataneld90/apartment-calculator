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
