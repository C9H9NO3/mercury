# Mercury screenshot crop

Isolated from `ig-prop-site`. Own repo, own URL. Do not copy files back into the Instagram project.

## Rules

- Always use the folder original. Never a Cursor chat attachment (those get crushed to ~472×1024 and keep the clock).
- Working size **1290 × 2796** (iPhone 15/16 Pro Max @3x). Scale non-1290 shots to width 1290.
- Background is `(16, 16, 26)` / `#10101a` everywhere. Paint the top **177 px** of any shot that becomes a screen top / pinned header.
- Cut only in empty background. Never through text/icons. Never include the same row twice.
- Paint out the iOS scroll indicator (grey `(95,95,102)`, x ≈ 1273–1282) before stitching, otherwise it repeats down the page. Rule used: grey pixel in x 1262–1290 whose 28 px to the left are all bg.
- After any image swap: bump `?v=` everywhere in `index.html` + `manifest.json` **and** `CACHE` in `sw.js` (same number). Reopen the home-screen icon.

## Home (`#s-home`) — current: `v4`, folder `(22)` + glass chrome · icon from `New folder (9)`

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
3. Launch images = `IMG_1509` with top 177 px painted and the scroll indicator cleared (`launch_1290x2796.png`, scaled copy `launch_1179x2556.png`) — identical to the scroll-0 frame.

### Body landmarks (rows of `home_body.png` v3; subtract 370 for the v2 numbers)

- Insights `>` heading 1384–1438 · bar chart ends 1823
- Cards `>` heading 2059–2102 · card rows start 2182, pitch 181 (6 rows) · View 159 more cards 3258 · Create card 3408–3521
- Transactions `>` heading 3731–3774 · Revolut 3854 · Amazon 4036 · Jazmyne Ellis 4287 · DoorDash 4468 · Apple 4649 · View all transactions 4890–4985
- Accounts `>` heading 5201–5244 · Credit 5324 · Checking 4724 5583 · Paysight 5788 · Checking 7493 6047 · View 24 more accounts 6241–6336
- Recent recipients heading 6552–6606 · rows 6674, 6849, 7024, 7199, 7374 (each ~103 tall, pitch 175)

Hotspots: put them on the `.glyph` boxes (org pill = `#yL`, terminal = left half of `#yR`, profile = right half; tab cells across `#yB` at Home 0–24 %, list 24–43 %, transfer 43–61 %, bank 61–80 %, cards 80–100 %). All inert until destination shots exist.

### Verifying

Chrome DevTools MCP, viewport `430x932x3,mobile`. Scroll `#homeScroller` to 0 → frame equals `IMG_1509` (mean diff 0.4/255). ScrollTop 678.3 (2035 device px) puts the bar over the Apple row like `FullSizeRender-1.jpeg`; 720.7 / 1433.3 reproduce `IMG_1510` / `IMG_1511` tops. The Cursor embedded browser's CDP `captureScreenshot` returns garbage frames under emulation — use the Chrome one.

## History

- `v1` folder `(21)` `IMG_1507.PNG`: single full-frame shot ("Welcome, Roeniel" variant), top 177 px painted. Replaced by the folder (22) stitch.
- `v2` folder `(22)`: stitched body with opaque `home_header.png` (1290×370) / `home_footer.png` (1290×356) pinned around the scroller. Replaced by v3 because the real chrome is see-through.

## PWA

- URL: `/` → `index.html` (`start_url` is `/`)
- Manifest name: Mercury · `apple-mobile-web-app-status-bar-style: black-translucent`
- Icon: `icon.png` (folder original `New folder (9)\unnamed (1).png`, 512×512 knot on white. Replaced the N-mark crop from folder 21.)
