# WSH Optimization Techniques Reference

Deep-dive techniques for Web Speed Hackathon. Covers profiling, build, assets, Core Web Vitals, caching, backend, and more.

## Contents

- Profiling
- Detuning Patterns
- Build Optimization
- Bundle Reduction
- Asset Optimization
- Core Web Vitals
- Caching and Delivery
- Backend and API
- Resource Hints
- Video (2025-Specific)

---

## 1. Profiling

### DevTools Performance Panel

1. Open DevTools → Performance tab
2. Set CPU throttle: 4× or 6× slowdown
3. Record page load (5–10 seconds)
4. Look for:
   - **Long Tasks** (red bar > 50 ms) — JavaScript blocking main thread
   - **Mystery wait** — yellow "Idle" blocks inside JS tasks often mean `setTimeout` or synchronous I/O
   - **Scripting time** dominates? → Bundle size / detuning issue
   - **Rendering time** dominates? → Layout/paint issue (CLS, forced reflow)

### Bundle Visualizer

```bash
# Vite
ni -D rollup-plugin-visualizer
# vite.config.ts: plugins: [visualizer({ open: true })]
nr build

# Webpack
ni -D webpack-bundle-analyzer
# webpack.config.js: plugins: [new BundleAnalyzerPlugin()]
nr build
```

Look for: duplicate packages, full lodash/moment import, large polyfill bundles, inline base64 assets.

### Lighthouse (correct settings)

- **Always use Incognito** (no extensions affecting scores)
- CPU throttle: 4× (simulated mid-range Android)
- Network: Slow 3G (1.6 Mbps down)
- Run 3 times and take median (scores vary ±5 pts)
- Check "Opportunities" and "Diagnostics" sections

---

## 2. Detuning Patterns

WSH apps are intentionally slowed with artificial code. Remove these first — they give the highest ROI.

### sleep / setTimeout / delay

```typescript
// Pattern: artificial async delay
async function fetchData() {
  await sleep(3000); // REMOVE
  return fetch('/api/data');
}

// Pattern: delayed initialization
setTimeout(() => {
  initApp();
}, 2000); // CHANGE to 0 or call directly
```

### Batch Window Reduction

```typescript
// Pattern: artificially large debounce/batch window
const BATCH_INTERVAL = 1000; // CHANGE to 16 (one frame)
// OR remove batching entirely if real-time is fine
```

### Excessive Loops

```typescript
// Pattern: CPU-burning loop
function expensiveHash(input: string) {
  let result = input;
  for (let i = 0; i < 2**12; i++) { // REMOVE or reduce to 1
    result = someHash(result);
  }
  return result;
}
```

### setInterval Overuse

```typescript
// Pattern: polling at high frequency
setInterval(() => updateUI(), 16); // runs 60×/sec forever
// Fix: use requestAnimationFrame, event-driven updates, or increase interval
```

### ReDoS Regex

```typescript
// Pattern: catastrophic backtracking regex
const BAD_REGEX = /^(a+)+$/; // exponential on non-match
// Fix: rewrite regex or use a simpler validation
```

---

## 3. Build Optimization

### Webpack: Enable Production Mode

```javascript
// webpack.config.js
module.exports = {
  mode: 'production', // enables minification, tree-shaking, scope hoisting
  optimization: {
    minimize: true,
    usedExports: true,
    sideEffects: true,
  },
};
```

### Vite / tsup: Minify + Tree-shake

```typescript
// vite.config.ts
export default defineConfig({
  build: {
    minify: 'esbuild',
    rollupOptions: {
      treeshake: { moduleSideEffects: false },
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
        },
      },
    },
  },
});
```

### Webpack → Rspack Migration

Rspack is a Rust-based drop-in Webpack replacement with 5–10× faster builds. Useful if the WSH app uses Webpack and build time is bottlenecking your iteration.

```bash
ni -D @rspack/core @rspack/cli
# Replace webpack.config.js with rspack.config.js (mostly compatible API)
```

### Code Splitting: Fix IIFE → ESM

```javascript
// BEFORE: IIFE output prevents code splitting
output: { libraryTarget: 'var' }

// AFTER: ESM enables dynamic import() splitting
output: { module: true, chunkFormat: 'module' }
// Also set: experiments: { outputModule: true }
```

### Dynamic Import De-layering

```typescript
// BEFORE: nested dynamic imports (multiple round-trips)
const mod = await import('./module-a');
const mod2 = await mod.loadModule(); // second dynamic import inside

// AFTER: flatten to a single import
const [mod, mod2] = await Promise.all([
  import('./module-a'),
  import('./module-b'),
]);
```

---

## 4. Bundle Reduction

### Library Replacement Table

| Library | Bundle (gz) | Replacement | Bundle (gz) | Notes |
|---|---|---|---|---|
| moment.js | ~72 KB | day.js | ~2 KB | API similar |
| moment.js | ~72 KB | date-fns (tree-shaken) | ~5 KB | Functional |
| lodash (CJS) | ~70 KB | lodash-es + tree-shaking | <5 KB | Must use ES import |
| lodash (CJS) | ~70 KB | Native JS | 0 | Array/Object methods |
| jQuery | ~87 KB | Vanilla JS | 0 | fetch, querySelector |
| axios | ~13 KB | Native fetch | 0 | |
| core-js (full) | ~100 KB | Targeted polyfills | <10 KB | Set browserslist |
| styled-components | ~15 KB | UnoCSS (build-time) | ~5 KB | See CSS-in-JS section |
| react-icons (all) | ~500 KB | Import specific icons | <1 KB | |

### Polyfill Removal via browserslist

```json
// package.json or .browserslistrc
{
  "browserslist": [
    "last 2 Chrome versions",
    "last 2 Firefox versions",
    "last 2 Safari versions"
  ]
}
```

With `@babel/preset-env` or `core-js` set to `useBuiltIns: 'usage'`, only necessary polyfills are included.

### CSS-in-JS: Runtime → Build-time (UnoCSS)

```typescript
// Install
ni -D unocss

// vite.config.ts
import UnoCSS from 'unocss/vite';
export default defineConfig({
  plugins: [UnoCSS()],
});

// main.ts
import 'virtual:uno.css';
```

UnoCSS generates only the CSS classes used, with zero runtime overhead (vs styled-components which runs JS to generate CSS).

---

## 5. Asset Optimization

### Images: JPEG → WebP / AVIF

```bash
# Batch convert using sharp (Node.js)
# ni -D sharp
find public/images -name "*.jpg" -o -name "*.jpeg" | while read f; do
  node -e "require('sharp')('$f').webp({ quality: 80 }).toFile('${f%.jpg}.webp')"
done

# Or use squoosh-cli
nlx @squoosh/cli --webp '{"quality":80}' public/images/*.jpg
```

```html
<!-- Use <picture> for format fallback -->
<picture>
  <source srcset="image.avif" type="image/avif" />
  <source srcset="image.webp" type="image/webp" />
  <img src="image.jpg" alt="..." width="800" height="450" />
</picture>
```

### GIF → WebM / MP4

```bash
# Convert GIF to WebM (10× smaller)
ffmpeg -i animation.gif -c:v libvpx-vp9 -b:v 0 -crf 30 animation.webm
ffmpeg -i animation.gif -c:v libx264 -pix_fmt yuv420p animation.mp4
```

```html
<!-- Use <video> instead of <img> for animated GIF replacements -->
<video autoplay loop muted playsinline>
  <source src="animation.webm" type="video/webm" />
  <source src="animation.mp4" type="video/mp4" />
</video>
```

### SVG: SVGOMG + Inline Font Removal

SVG files sometimes contain base64-encoded fonts (e.g., 5.4 MB in a single SVG). Always check SVG file sizes.

```bash
# Check for base64 in SVG
grep -l "data:font" public/**/*.svg

# Optimize with svgo
nlx svgo --multipass -i input.svg -o output.svg

# Or use SVGOMG (web UI): https://svgomg.net
```

Remove `<font>` or `<style>` blocks containing `data:font/...` base64 — replace with system/web fonts.

### Fonts: TTF → WOFF2 + Subsetting

```bash
# Convert TTF to WOFF2
nlx ttf2woff2 font.ttf > font.woff2

# Subset with pyftsubset (Python fonttools)
pyftsubset font.ttf \
  --unicodes="U+0020-007E,U+3000-9FFF" \
  --flavor=woff2 \
  --output-file=font-subset.woff2
```

```css
@font-face {
  font-family: 'MyFont';
  src: url('font-subset.woff2') format('woff2');
  font-display: swap; /* prevent invisible text during load */
  font-weight: 400;
  font-style: normal;
}
```

**Skip re-compressing WOFF2** — it's already compressed with Brotli internally. Do not gzip/brotli WOFF2 again on the server.

---

## 6. Core Web Vitals

### CLS (Cumulative Layout Shift)

```css
/* Images: always set width/height or aspect-ratio */
img {
  width: 100%;
  height: auto;
  aspect-ratio: 16 / 9;
}

/* Hero section: reserve space */
.hero {
  min-height: 100vh;
}

/* Font swap: use font-display: optional to avoid shift */
@font-face {
  font-display: optional; /* best for CLS; swap is ok if shift is acceptable */
}
```

```tsx
/* Auth-loading: avoid layout shift when user menu appears */
{isAuthLoading
  ? <div style={{ height: '64px', width: '200px' }} />
  : <UserMenu user={user} />
}
```

### LCP (Largest Contentful Paint)

```html
<!-- Hero image: do NOT lazy-load LCP element -->
<img src="hero.webp" alt="Hero" loading="eager" fetchpriority="high"
     width="1200" height="600" />

<!-- Preload LCP image in <head> -->
<link rel="preload" as="image" href="hero.webp" />

<!-- Defer non-critical scripts to unblock LCP -->
<script src="analytics.js" defer></script>
```

```typescript
// Canvas rendering for hero: replace with static image
// BEFORE: LCP element is a canvas (not measured by Lighthouse)
<canvas id="hero-canvas" />

// AFTER: use <img> so Lighthouse can measure LCP
<img src="hero-static.webp" loading="eager" fetchpriority="high" />
```

### TBT / INP (Total Blocking Time / Interaction to Next Paint)

```javascript
// 1. Passive scroll listeners
window.addEventListener('scroll', handler, { passive: true });
document.addEventListener('touchstart', handler, { passive: true });

// 2. Web Worker for heavy computation
const worker = new Worker('/workers/heavy-computation.js');
worker.postMessage({ data: largeData });
worker.onmessage = (e) => updateUI(e.data);
```

```tsx
// 3. Remove useSubscribePointer (pointer tracking on every move = massive TBT)
// BEFORE
const pos = useSubscribePointer(); // fires mousemove listener globally

// AFTER: only track when needed, or remove entirely if cosmetic

// 4. Localize global state (avoid re-rendering entire tree)
// BEFORE: global Zustand store updates re-render everything
const { data } = useGlobalStore();

// AFTER: subscribe only to the slice you need
const data = useGlobalStore(state => state.specificData);

// 5. React.lazy for route-level code splitting
const HeavyPage = React.lazy(() => import('./pages/HeavyPage'));

// 6. Preact migration (if using React for simple UI)
// ni preact
// alias react/react-dom → preact/compat in build config
```

---

## 7. Caching & Delivery

### Cache-Control for Hashed Assets

```typescript
// Express
app.use('/assets', express.static('dist/assets', {
  maxAge: 31_536_000, // 1 year in seconds
  immutable: true,
}));

// Fastify
await fastify.register(fastifyStatic, {
  root: path.join(__dirname, 'dist/assets'),
  prefix: '/assets/',
  setHeaders: (res) => {
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
  },
});
```

### Service Worker: Stale-While-Revalidate

```javascript
// sw.js — cache static assets, stale-while-revalidate for API
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  if (url.pathname.startsWith('/assets/')) {
    // Cache-first for hashed assets
    event.respondWith(caches.match(event.request).then(cached =>
      cached ?? fetch(event.request).then(res => {
        const clone = res.clone();
        caches.open('assets-v1').then(c => c.put(event.request, clone));
        return res;
      })
    ));
  } else if (url.pathname.startsWith('/api/')) {
    // Stale-while-revalidate for API
    event.respondWith(caches.open('api-v1').then(async cache => {
      const cached = await cache.match(event.request);
      const fetchPromise = fetch(event.request).then(res => {
        cache.put(event.request, res.clone());
        return res;
      });
      return cached ?? fetchPromise;
    }));
  }
});
```

### Compression Middleware

```typescript
// @fastify/compress — prefer zstd > brotli > gzip, skip small responses
await fastify.register(import('@fastify/compress'), {
  global: true,
  threshold: 1024, // only compress >1KB
  encodings: ['zstd', 'br', 'gzip'],
  // WOFF2 is already compressed — exclude it
  customTypes: /^(?!font\/woff2).*$/,
});
```

---

## 8. Backend / API

### DB Index (SQLite + Drizzle)

```typescript
// drizzle schema
export const posts = sqliteTable('posts', {
  id: integer('id').primaryKey(),
  userId: integer('user_id').notNull(),
  createdAt: integer('created_at').notNull(),
}, (table) => ({
  userIdIdx: index('posts_user_id_idx').on(table.userId),
  createdAtIdx: index('posts_created_at_idx').on(table.createdAt),
}));
```

### N+1 Elimination

```typescript
// BEFORE: N+1 — fetching tags for each post separately
const posts = await db.select().from(postsTable);
for (const post of posts) {
  post.tags = await db.select().from(tagsTable).where(eq(tagsTable.postId, post.id));
}

// AFTER: batch fetch tags, then group by postId
const posts = await db.select().from(postsTable);
const postIds = posts.map(p => p.id);
const tags = await db.select().from(tagsTable).where(inArray(tagsTable.postId, postIds));
const tagsByPostId = Map.groupBy(tags, t => t.postId);
for (const post of posts) {
  post.tags = tagsByPostId.get(post.id) ?? [];
}
```

### Pagination

```typescript
// Always add limit/offset to list endpoints
app.get('/api/posts', async (req, res) => {
  const { limit = 20, offset = 0 } = req.query;
  const posts = await db.select()
    .from(postsTable)
    .limit(Number(limit))
    .offset(Number(offset));
  return posts;
});
```

### Move Heavy Computation to Backend

```typescript
// BEFORE: computing dominant color in browser (CPU spike on client)
import { FastAverageColor } from 'fast-average-color';
const fac = new FastAverageColor();
const color = await fac.getColorAsync(imgElement);

// AFTER: compute at upload time, store in DB, return via API
// Server: use @vibrant/node or sharp to extract color
import Vibrant from 'node-vibrant';
const palette = await Vibrant.from(imagePath).getPalette();
const dominantColor = palette.Vibrant?.hex ?? '#000000';
// Store in DB, return with image metadata
```

### SSR Hydration Payload Reduction

```typescript
// BEFORE: serializing full Zustand store (3.2 MB!) into HTML
const state = store.getState(); // entire app state
const html = renderToString(<App />);
// __INITIAL_STATE__ = JSON.stringify(state) → 3.2 MB inline JSON

// AFTER: only serialize what the first render needs
const criticalState = {
  user: state.user,
  currentPage: state.currentPage,
  // omit large data like full post list, comments, etc.
};
```

---

## 9. Resource Hints

```html
<head>
  <!-- Preconnect to external origins (fonts, CDN) -->
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />

  <!-- Preload critical fonts -->
  <link rel="preload" href="/fonts/main-subset.woff2" as="font" type="font/woff2" crossorigin />

  <!-- Preload LCP image -->
  <link rel="preload" href="/assets/hero.webp" as="image" />

  <!-- Prefetch next likely page -->
  <link rel="prefetch" href="/pages/detail.js" as="script" />
</head>
```

---

## 10. Video (2025-Specific)

### M3U8 Payload Bloat

In WSH 2025, the video streaming endpoint returned unnecessarily large M3U8 manifests with extra custom headers and junk data.

```typescript
// BEFORE: server returns bloated M3U8 with junk headers
// X-Custom-Header: [2KB of random data on every segment request]

// AFTER: strip junk headers, return minimal M3U8
// Check server middleware for header-injection detuning
```

### FFmpeg WASM → Server-side

```typescript
// BEFORE: running FFmpeg in browser via WASM (blocks main thread, slow)
import { createFFmpeg } from '@ffmpeg/ffmpeg';
const ffmpeg = createFFmpeg();
await ffmpeg.run('-i', 'input.mp4', 'output.webm');

// AFTER: server-side FFmpeg via API endpoint
// POST /api/transcode { inputUrl, format }
// Server runs: exec(`ffmpeg -i ${input} ${output}`)
// Returns: { outputUrl }
```

### Startup-to-Play Target

WSH 2025 scores video startup-to-play time (target: **< 800 ms**).

```typescript
// Strategies:
// 1. Use preload="metadata" or preload="auto" for above-fold video
// 2. Serve video via HTTP/2 to avoid head-of-line blocking
// 3. Use short initial segment duration in HLS (2s instead of 10s)
// 4. Preconnect to video CDN
// 5. Avoid waiting for auth before loading video metadata

video.preload = 'auto';
video.src = videoUrl;
// Measure:
const startTime = performance.now();
video.addEventListener('canplay', () => {
  console.log('startup-to-play:', performance.now() - startTime, 'ms');
});
```
