# WSH Regulation Guard Reference

Regulation compliance is the most important aspect of WSH. A high Lighthouse score is worthless if your submission fails regulation checks.

## Contents

- Why Regulation Matters
- Scoring Gate Conditions (2025)
- Mandatory Requirements by Year
- VRT and E2E Workflow
- Common Regulation Failures
- Safe Optimization Areas
- Danger Zones

---

## 1. Why Regulation Matters

In WSH 2025, **only 1 of the top 20 scoring participants passed the regulation check**. Many teams optimized aggressively and achieved great Lighthouse scores, but broke the app's functional requirements in the process.

**Regulation failure = disqualification**, regardless of score.

Key lesson: **Always run regulation tests before and after each category of changes.** Don't wait until the end.

---

## 2. Scoring Gate Conditions (2025)

WSH 2025 introduced a **scoring gate**:

> You must achieve **≥ 200 points on the page display score** before interaction scores and video scores are counted.

This means:
- Chasing interaction or video scores is pointless if your page display score is below 200.
- Fix page display (LCP, CLS, FCP) first.

Check the current year's scoring rules carefully — gate conditions change each edition.

---

## 3. Mandatory Requirements by Year

### All Editions
- **`/initialize` API must work correctly** — This endpoint resets the database to a known state for regulation tests. If it breaks, every test fails.
- **All pages must be accessible** — HTTP 200 for all routes under the test user account.

### 2024 Edition
- **Service Worker must be registered** — Regulation tests check for SW registration.
- **SW must not break navigation** — A misconfigured SW that returns stale responses can cause test failures.

### 2025 Edition
- **Video startup-to-play < 800 ms** (part of scoring, not just regulation)
- **Page display score ≥ 200** before other scores count

### Common Across Editions
- All features visible in the app must function correctly
- Form submissions must work
- Image loading must complete (no broken images)
- Font rendering must match expected output

---

## 4. VRT / E2E Workflow

### When to Run

Run regulation tests at these checkpoints:

1. **Baseline** — before any changes
2. **After detuning removal** — some timing-dependent tests may break
3. **After build config changes** — production mode can expose bugs
4. **After asset optimization** — image format changes can break tests
5. **After bundle reduction** — library swaps can change behavior
6. **Before submission** — final check

### Running Tests

```bash
# Typical WSH regulation test command (check README for exact command)
nr test:regulation
# or
nr test:e2e
# or
nr vrt
```

### VRT (Visual Regression Testing)

VRT takes screenshots of pages before and after changes and pixel-diffs them.

```bash
# Update baseline snapshots (only do this intentionally)
nr vrt:update

# Run comparison
nr vrt
```

**If VRT fails**, check:
1. Did you change any CSS that affects layout?
2. Did you change font loading (font-display)?
3. Did you change animation timing?
4. Did you rename any text/labels?

### E2E Tests

```bash
# Run E2E with Playwright or Cypress
nr test:e2e

# Run with verbose output to see which test fails
nr test:e2e --reporter=verbose
```

---

## 5. Common Regulation Failures

| Failure | Cause | Fix |
|---|---|---|
| Hover style missing | Removed `:hover` CSS during cleanup | Restore hover styles |
| Font rendering diff | Changed `font-display` to `optional` (invisible text at capture time) | Use `swap` instead, or ensure fonts load before VRT |
| Text content diff | Renamed a button label | Don't rename user-visible text |
| Animation timing diff | Removed detuning that happened to match test timing | Restore minimum timing or adjust test tolerance |
| Layout shift | Removed placeholder element | Keep placeholder or use proper CSS reservation |
| `/initialize` broken | Refactored DB schema without updating init logic | Keep `/initialize` endpoint in sync with schema |
| SW not registered | Deleted or renamed SW file | Keep SW registration, check filename |
| Video not playing | Removed video detuning but broke seek state | Test video playback manually |
| Missing image | Changed image path without updating references | Use relative paths or update all references |

---

## 6. Safe Optimization Areas

These changes rarely break regulation:

| Area | Safety | Notes |
|---|---|---|
| Image format (JPEG→WebP) with `<picture>` fallback | Safe | Old format still available as fallback |
| Font subsetting (same characters) | Safe | Text renders identically |
| Cache headers | Safe | No behavioral change |
| DB indexes | Safe | Pure performance, no output change |
| N+1 elimination (same data returned) | Safe | Verify response shape is identical |
| Compression middleware | Safe | Transparent to client |
| Bundle minification | Generally safe | Watch for sourcemap issues in error reporting |
| `passive` event listeners | Safe | No behavioral change |
| Code splitting (lazy loading) | Mostly safe | Watch for race conditions on initial load |
| Removing `console.log` | Safe | |
| CDN in front of app | Safe | Verify cache invalidation works |

---

## 7. Danger Zones

Be careful with these — they can break regulation tests:

| Area | Risk | Precaution |
|---|---|---|
| Detuning removal (sleep/delay) | Tests may depend on timing | Run VRT/E2E immediately after |
| Font-display: optional | VRT captures before font loads → blank text | Use `swap` or ensure fonts are preloaded |
| GIF → video (`<video>` tag) | VRT may not capture video frames properly | Check if VRT tool handles `<video>` |
| Preact migration | Behavioral differences in edge cases | Run full E2E suite |
| SSR changes | Hydration mismatches cause layout differences | Test all pages with VRT |
| Service Worker caching | SW may serve stale content to tests | Add SW version bumping, test in fresh profile |
| Removing polyfills | Tests may run in older browser environment | Check test browser version |
| React state restructuring | May change render order or timing | Test all interactive flows |
| API response shape changes | E2E may check specific fields | Compare before/after API responses |
| Removing detuning from `/initialize` | Init behavior may change | Verify DB resets correctly after each call |

### Special Case: `/initialize` API

This endpoint is called before every regulation test run to reset the app state. It is the most critical endpoint — treat it as untouchable unless you fully understand the reset logic.

```typescript
// Never remove or change the behavior of this endpoint
app.post('/initialize', async (req, res) => {
  // IMPORTANT: this resets the DB for regulation tests
  // DO NOT optimize this to be a no-op
  await resetDatabase();
  res.json({ status: 'ok' });
});
```
