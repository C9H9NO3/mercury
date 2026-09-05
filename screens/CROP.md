# Mercury screenshot crop

Isolated from `ig-prop-site`. Own repo, own URL. Do not copy files back into the Instagram project.

## Rules

- Always use the folder original. Never a Cursor chat attachment (those get crushed to ~472×1024 and keep the clock).
- Working size **1290 × 2796** (iPhone 15/16 Pro Max @3x). Scale non-1290 shots to width 1290.
- Background is `(16, 16, 26)` / `#10101a` everywhere. Paint the top **177 px** of any shot that becomes a screen top / pinned header.
- Cut only in empty background. Never through text/icons. Never include the same row twice.
- Paint out the iOS scroll indicator (grey `(95,95,102)`, x ≈ 1273–1282) before stitching, otherwise it repeats down the page. Rule used: grey pixel in x 1262–1290 whose 28 px to the left are all bg.
- Since `v7` nothing is cached (see "No cache" below): reopening the home-screen icon always fetches the current files. Still bump `?v=` in `index.html` / `test.html` / manifests and `CACHE` in `sw.js` on a font or image change so the version trail stays readable (the fonts *are* cached, keyed on `?v=`).

## Home (`#s-home`) — current: `v7`, folder `(22)` + glass chrome · icon from `New folder (9)`

Source folder `(22)` `iCloud Photos from Roeniel Carter\IMG_1509…1512.PNG`. Filename order = scroll order. All 1290×2796.

### How the real app behaves (folder (23) crops + folder (24) recording)

Nothing at the top or bottom is opaque. The whole page scrolls under the clock, under the two pills and under the tab bar. Only the three capsules are glass (blur + dark tint + faint edge ring). Two soft "scroll-edge" dims sit under the chrome:

- Top: content under the status bar is dimmed to ~14 % (wash alpha .86–.87) at y 0–50, ~22 % (alpha .78) at y 60–177, back to 100 % by y ≈ 340. Not blurred — "Debit Card" text stays crisp under the clock (`IMG_1510` top). Content at the pill row (177–309) between the pills is full brightness.
- Bottom: wash alpha ramps from 0 at y ≈ 2455 (92 px above the bar) to ~.25 at the bar top (2547) and is ~.85 flat below the bar (2733–2796). Measured on `FullSizeRender-1.jpeg`: "Pending"/"Jaz trading" under the bar read at ~15 %.
- Capsule fill over empty bg reads exactly `(30,30,43)`; edge ring 3 px lighter `(65,65,97)→(46,46,67)`; home highlight `(63,63,77)`.

### Layout (`index.html`)

`#s-home` is `100dvh; position:relative; overflow:hidden`. `#homeScroller` is `position:absolute; inset:0` and scrolls the single body PNG. On top (siblings, not inside the scroller): `#homeTopFade`, `#homeBotFade` (gradients above), then three `.glass` capsules (`border-radius:50vw; background:var(--gfill); backdrop-filter:blur(var(--gblur))`) each paired with a `.glyph` alpha PNG at the same box. Geometry in `vw` = px/1290·100:

| element | src bbox (px, 1290 frame) | css |
|---|---|---|
| left pill `#gL/#yL` | `IMG_1509` x 60–580, y 177–309 (520×132) | left 4.651vw top 13.721vw w 40.31vw h 10.233vw |
| right pill `#gR/#yR` | `IMG_1509` x 942–1230, y 177–309 (288×132) | left 73.023vw top 13.721vw w 22.326vw h 10.233vw |
| tab bar `#gB/#yB` | `IMG_1512` x 63–1227, y 2547–2733 (1164×186) | left 4.884vw bottom 4.884vw w 90.233vw h 14.419vw |

Glass: `--gfill: rgba(33.5,33.5,47.3,.8)` (so fill over bg = (30,30,43)), `--gblur: 3px` (CSS px; ×3 device). Fitted against `IMG_1509` (bar over the Debit Card row) and folder (23) `FullSizeRender-1.jpeg` (bar over the Apple row). Adding class `noglass` to `#s-home` gives opaque `#1e1e2b` capsules with no blur.

### Assets

1. `home_body.png` (1290×**7855**) = 370 rows flat bg (status band + pill row zone, pills removed) + the stitched content below + 356 rows flat bg (tab bar zone). Scroll range 5059 px = 1686 pt. Pieces of the stitched middle (body rows are +370 from the numbers here):
   - `IMG_1509` `y 370 … 2500` (balance, graph, Insights, Cards: Roeniel Carter's Debit Card, jazgroq) → 0–2130
   - `IMG_1510` `y 338 … 2460` (Roeniel's Debit Card, Jaz trading, jaz trading, Jaz2027, View 159 more cards, Create card, Transactions: Revolut, Amazon, Jazmyne Ellis, DoorDash) → 2130–4252
   - `IMG_1511` `y 322 … 2500` (Apple, View all transactions, Accounts ×4, View 24 more accounts, Recent recipients: Jazmyne Ellis) → 4252–6430
   - `IMG_1512` `y 1741 … 2440` (Sun Coast, COUNT UP, Sun Coast, Sun Coast) → 6430–7129
   - Later shots start below their own pinned pills (≥ 309) so no chrome is duplicated. Scroll indicator painted out first.
   - Row pitch in lists is **181 px**. Shot-to-shot offsets: 1509→1510 = **2162**, 1510→1511 = **2138**, 1511→1512 = **759**.
2. `pill_left.png`, `pill_right.png`, `tabbar.png` — RGBA glyph layers cut at the bboxes above. Made by un-blending each pixel against the flat fill `(30,30,43)` with minimum alpha: `a = max_c (P−F)/(255−F)`, `C = F + (P−F)/a`. Pixels equal to the fill or darker (bg outside the capsule) go fully transparent, so the CSS capsule supplies fill, blur and the anti-aliased edge; the PNG supplies text, icons, the N badge, the edge ring and the home highlight.
3. Launch images are **flat bg** `(16,16,26)` (`launch_1290x2796.png`, `launch_1179x2556.png`). `#s-home` starts at `opacity:0` and gets `.ready` (0.3 s fade) once body + pills + tab bar have `decode()`d (2.5 s fallback). Startup is therefore flat colour → one fade-in. Do not put a content launch image back: iOS crossfades it into the page before the body PNG has painted, which reads as a flash (folder recording `ScreenRecording_09-04-2026 20-07-36_1.mov`, frames 1.0–1.3 s).

### Viewport height (installed app)

Home-screen web apps with `black-translucent` report `100dvh` / `innerHeight` ~59 pt short on cold start (WebKit bug 254868) — the tab bar sat 80 pt above the screen bottom with a dead band under it. `--vh` is `100dvh` in Safari and `100vh` under `@media (display-mode: standalone)`; every full-height box uses `var(--vh)`. Touch events may still ignore that bottom 59 pt band in standalone (same bug), so keep tab-bar hotspots on the upper part of the bar when they get wired.

### Body landmarks (rows of `home_body.png` v3; subtract 370 for the v2 numbers)

- Insights `>` heading 1384–1438 · bar chart ends 1823
- Cards `>` heading 2059–2102 · card rows start 2182, pitch 181 (6 rows) · View 159 more cards 3258 · Create card 3408–3521
- Transactions `>` heading 3731–3774 · Revolut 3854 · Amazon 4036 · Jazmyne Ellis 4287 · DoorDash 4468 · Apple 4649 · View all transactions 4890–4985
- Accounts `>` heading 5201–5244 · Credit 5324 · Checking 4724 5583 · Paysight 5788 · Checking 7493 6047 · View 24 more accounts 6241–6336
- Recent recipients heading 6552–6606 · rows 6674, 6849, 7024, 7199, 7374 (each ~103 tall, pitch 175)

Hotspots: put them on the `.glyph` boxes (org pill = `#yL`, terminal = left half of `#yR`, profile = right half; tab cells across `#yB` at Home 0–24 %, list 24–43 %, transfer 43–61 %, bank 61–80 %, cards 80–100 %). All inert until destination shots exist.

### Verifying

Chrome DevTools MCP, viewport `430x932x3,mobile`. Scroll `#homeScroller` to 0 → frame equals `IMG_1509` (mean diff 0.4/255). ScrollTop 678.3 (2035 device px) puts the bar over the Apple row like `FullSizeRender-1.jpeg`; 720.7 / 1433.3 reproduce `IMG_1510` / `IMG_1511` tops. The Cursor embedded browser's CDP `captureScreenshot` returns garbage frames under emulation — use the Chrome one.

## `/test` — DOM build of the home screen (`test.html`, `v7`)

Same screen as `/`, but no raster: every glyph, card, chart and icon is DOM/CSS/inline SVG so it can be wired up later. `/` is untouched. Everything in `test.html` is generated from the measurements below; edit numbers there, not by eye.

- **Unit.** 1 u = 1 px of the 1290-wide originals = `100/1290 vw` (emitted as `vw` with 4 decimals). Boxes are `position:absolute` at the screenshot pixel coordinates; `#homeContent` is 7855 u tall (same as `home_body.png`, scroll range 5059 px). The fades, `.glass` capsules and their boxes are byte-identical to `index.html`; only the glyph layers changed from PNG to `.glyphs` containers (which also carry the 3 u edge ring as inset box-shadows: `(65,65,97)`, `(56,56,82)`, `(46,46,67)`).
- **Fonts** (`fonts/`): Mercury's own variable webfonts, self-hosted (`arcadia-text.woff2` wght 340–500, `arcadia-display.woff2` wght 300–500; from `mercury.com/_next/static/media/…`). Metrics: upm 2048, ascent 1946, descent 492, cap 1442 (0.704 em), x 1027, digits 1488. With `line-height:1` the baseline sits 0.855 em below the box top, so `top = baseline − 0.855·fs (+ per-class nudge: h −0.7, b +2.0, s +2.7, n +1.0 u)`.
- **Type ramp** (measured cap heights → size; family/weight fitted on width and stem thickness in Chrome):

| use | family / weight | size | colour | notes |
|---|---|---|---|---|
| section headings, "Recent recipients" | Display 460 | 60 u | `(237,237,243)` | left 60 u; chevron 23×42 at heading top+2, text right +32 |
| balance | Display 370 | 90 u | white | `.89` superscript 49 u, weight 500, tabular, digit tops aligned |
| amounts (`$16.6K`, account balances) | Display 370 | 60 u | white / green `(119,197,153)` | superscript 34 u; transaction amounts add `tabular-nums` (wide 1s) and are right-aligned to x 1230; pending rows grey |
| row titles, "View …", labels | Text 360 | 51 u | white | title cap-top = row top, baseline +36 |
| subtitles | Text 360 | 45 u | `(195,195,204)` | `••` are two bullets, no space; baseline row+99 (cards/tx), +93 (accounts/recipients) |
| YTD / deltas | Text 360 | 45 u | white | pink `(240,145,179)` |
| month labels | Text 360 | 39 u | grey | centred under each bar |
| Pending chip | Text 360 | 39 u | white on `(47,48,62)` 182×65 r33 | text origin x 209 |
| Create card | Text 480 | 48 u | `(156,180,232)` on `(44,48,67)` 393×114 | plus glyph at (103,3447) |
| org pill | Text 480 | 51 u | `(251,251,255)` | origin x 127 inside the pill; N badge 66×66 r14 `(74,102,133)` + 2 u `(102,123,153)` inset |

- **Rows** (body rows, cap-top of the title): dividers 3 u `(47,48,62)` at 1271 / 1946 / 3618 / 5088 / 6439. Cards 2182 + 181·i (thumb 96×78 r14 at row+11, white `(254→247)` or navy `(81,79,127)→(55,54,82)` gradient, 20×17 inner rect). Transactions 3854 / 4036 / 4287 / 4468 / 4649 (96 u discs: Revolut `(67,84,116)`, Amazon `(33,31,32)`, JE `(53,91,108)`, DoorDash `(199,48,29)`, Apple white). Accounts 5324 / 5583 / 5788 / 6047 (knot centred on the row; amount left 204). Recipients 6674 + 175·i (refresh glyph at 1176, row+25). "View …" discs `(47,48,62)` at 3258 / 4890 / 6241.
- **Charts.** Line chart: SVG 0–1290 × 753–1268, path = per-column centre of the bright `(156,180,232)` stroke in `IMG_1509`, stroke 3.6, fill under it = vertical gradient `(29,33,73)` at 753 → bg at 1267 (measured: linear, ~0.09/px on blue). Insights bars are divs 150 u wide: in-bars Jul 1466 / Aug 1551 / Sep 1509 down to 1621, 5 u `(156,180,232)` top edge then `(26,29,59)→(20,21,40)`; out-bars from 1626 to Jul 1677 / Aug 1766 / Sep 1631, `(29,29,41)→(57,57,73)` with a 4.5 u `(195,195,204)` bottom edge; baseline 585–1233 × 1621–1626 `(76,77,98)`. Sparklines: 6 u stroke, horizontal gradient `(28,32,68)→(41,49,108)` over x 1041–1224, polylines traced from the body PNG (step shapes: vertical runs give two points).
- **Icons** are traced outlines (OpenCV contours on an 8× upsample, 0.5 coverage, ≈0.16 px tolerance) of the original pixels: knot, 5 tab glyphs, terminal, person, N, info, caret, arrows, chevron, plus, refresh, card/list/bank/plane disc icons, merchant marks. Repeated ones (knot, plane, refresh) are `<symbol>`s. Amazon smile is `(232,172,84)` (the muted on-screen orange), Apple mark `(66,66,67)`.
- **Startup**: same flat-bg launch images; `#s-home` fades in once `document.fonts.load()` resolves for both faces (2.5 s fallback). `manifest_test.json` (start_url `/test`) so an install from `/test` opens `/test`.
- **Verify**: Chrome DevTools MCP, `430x932x3,mobile`, `http://<lan>:8766/test`; screenshot at `#homeScroller.scrollTop` 0 / 678.33 / 720.67 / 1433.33 / max and compare with `home_body.png` rows. Result at `v6`: every text/icon group within ±3 px in x, y and width; line chart mean diff 0.7/255, sparklines 0.9, bars 1.8, whole frame 2.1 (text anti-aliasing is the remainder). Hotspots still to be wired; the elements are ordinary DOM so they can take `onclick` directly. `v7` (values + sections) renders pixel-identical to `v6` with the default values (0 differing pixels at scroll 0; the only remaining diffs are kerning across the `<span data-k>` in "View N more …").

## `/dashboard` — editable values (`v7`)

Account-dependent text on `/test` comes from a JSON document, not from the markup. Fixed labels ("Mercury balance", "Insights", "In"/"Out", "Create card", "View all transactions", "Last paid", logos, thumbs, sparklines, line chart) stay hard-coded.

- **Storage.** `data/defaults.json` (committed; the screenshot values, written by the generator) + `values.json` in `$DATA_DIR` (Railway: persistent volume `web-volume` mounted at `/data`, `DATA_DIR=/data`; locally `.data/`, git-ignored). `GET /api/values` = defaults deep-merged with the saved file, so a field added later just shows its default. `POST /api/values` (JSON) saves. Optional `EDIT_KEY` env var → POST must carry `X-Edit-Key` (dashboard prompts once, keeps it in localStorage). Without it the endpoint is open — set it if the URL gets around.
- **Injection.** `server.js` (and `serve.py`) replace `/*__VALUES__*/null` in `test.html` with the current JSON on every request → `window.__VALUES__`, rendered before the fade-in, so there is no second paint. If the placeholder is untouched (plain static hosting) the page fetches `api/values`; if that fails the markup's defaults stay.
- **Bindings** in `test.html`: `data-k="path"` → `textContent`; `data-amt="path"` → `$1,234` + `.56` superscript from a plain number (`-13.81`, `3161.29`; `data-sign` rows colour green when > 0, grey when pending, white otherwise); `data-bar="insights.months.i.in|out"` → bar height = value / max(all six) × 155 u (the reference heights 155/70/112 and 51/140/5 come from defaults 18200/8200/13100 and 6000/16400/600).
- **Sections.** `#homeContent` is split into `.sec` containers (`bal` 0–1271, `ins` 1271–1946, `cards` 1946–3618, `tx` 3618–5088, `acc` 5088–6439, `rec` 6439–7855; children use section-relative `top`). Each transaction is a `.txrow` (`data-h0` = measured height 182/251/181/181/251, `data-p0` = default Pending). Toggling Pending adds/removes 70 u on that row (disc T+2 ↔ T+36, amount `--top-a` ↔ `--top-p`, chip + "Pending" shown/hidden); the "View all" disc, `sec-tx` height, `sec-acc`/`sec-rec` tops and the content height shift by the sum. Row count is fixed (6 cards, 5 tx, 4 accounts, 5 recipients) — adding rows means the generator.
- **UI.** `dashboard.html` is a plain form built from a spec list (same paths as the JSON). Save → POST → "Saved ✓"; Defaults button refills the form from `/api/defaults` (needs Save). The layout is absolute, so a very long name will run under the amount — that is how the real app truncates too, keep names short.

## No cache (`v7`)

`sw.js` no longer caches the shell: only `*.woff2` requests are served cache-first (`mercury-fonts-v7`); every other request falls through to the network, and `server.js` sends `Cache-Control: no-store` for everything except the fonts (`immutable`, one year). Consequence: edits at `/dashboard` are visible on the next open of the installed app, no reinstall; offline opens show the browser error page (accepted). Activating the new worker deletes the old `mercury-v*` caches. The `shell-updated` reload listener in `index.html` is inert now.

## History

- `v1` folder `(21)` `IMG_1507.PNG`: single full-frame shot ("Welcome, Roeniel" variant), top 177 px painted. Replaced by the folder (22) stitch.
- `v2` folder `(22)`: stitched body with opaque `home_header.png` (1290×370) / `home_footer.png` (1290×356) pinned around the scroller. Replaced by v3 because the real chrome is see-through.

## PWA

- URL: `/` → `index.html` (`start_url` is `/`) · `/test` → `test.html` (DOM build, `manifest_test.json`, `start_url` `/test`) · `/dashboard` → `dashboard.html` (value editor) · `/api/values`, `/api/defaults`
- Manifest name: Mercury · `apple-mobile-web-app-status-bar-style: black-translucent`
- Icon: `icon.png` (folder original `New folder (9)\unnamed (1).png`, 512×512 knot on white. Replaced the N-mark crop from folder 21.)
