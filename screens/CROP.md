# Mercury screenshot crop

Isolated from `ig-prop-site`. Own repo, own URL. Do not copy files back into the Instagram project.

## Rules

- Always use the folder original. Never a Cursor chat attachment (those get crushed to ~472×1024 and keep the clock).
- Working size **1290 × 2796** (iPhone 15/16 Pro Max @3x). Scale non-1290 shots to width 1290.
- Background is `(16, 16, 26)` / `#10101a` everywhere. Paint the top **177 px** of any shot that becomes a screen top / pinned header.
- Cut only in empty background. Never through text/icons. Never include the same row twice.
- Paint out the iOS scroll indicator (grey `(95,95,102)`, x ≈ 1273–1282) before stitching, otherwise it repeats down the page. Rule used: grey pixel in x 1262–1290 whose 28 px to the left are all bg.
- After any image swap: bump `?v=` everywhere in `index.html` + `manifest.json` **and** `CACHE` in `sw.js` (same number). Reopen the home-screen icon.

## Home (`#s-home`) — current: `v2`, folder `(22)`

Source folder `(22)` `iCloud Photos from Roeniel Carter\IMG_1509…1512.PNG`. Filename order = scroll order. All 1290×2796.

In the real app the org-pill row and the floating tab bar are pinned (translucent blur over content). Built as a `100dvh` flex column: `#homeHeader` (pinned) + `#homeScroller` (scrolls) + `#homeFooter` (pinned). Header/footer are solid bg instead of blur — accepted.

Row pitch in lists is **181 px**. Shot-to-shot offsets (rows in shot A minus rows in shot B): 1509→1510 = **2162**, 1510→1511 = **2138**, 1511→1512 = **759** (1511→1512 matched pixel-exact; the other two came from list row pitch because the overlap rows sit behind the blurred header/tab bar).

1. `home_header.png` (1290×370) = `IMG_1509` `y 0 … 370`, top 177 px painted. Pills at y 177–308; "Mercury balance" starts at 449, so 370 is empty.
2. `home_body.png` (1290×7129), pieces:
   - `IMG_1509` `y 370 … 2500` (balance, graph, Insights, Cards: Roeniel Carter's Debit Card, jazgroq) → body 0–2130
   - `IMG_1510` `y 338 … 2460` (Roeniel's Debit Card, Jaz trading, jaz trading, Jaz2027, View 159 more cards, Create card, Transactions: Revolut, Amazon, Jazmyne Ellis, DoorDash) → body 2130–4252
   - `IMG_1511` `y 322 … 2500` (Apple, View all transactions, Accounts ×4, View 24 more accounts, Recent recipients: Jazmyne Ellis) → body 4252–6430
   - `IMG_1512` `y 1741 … 2440` (Sun Coast, COUNT UP, Sun Coast, Sun Coast) → body 6430–7129
   - Later shots start below their own pinned pills (≥ 309) so no chrome is duplicated.
3. `home_footer.png` (1290×356) = `IMG_1512` `y 2440 … 2796` (empty pad + tab bar). Body ends exactly where the footer piece begins, so the bottom of the scroll reproduces `IMG_1512`.
4. Launch images = header + body top + footer composed to 1290×2796 (`launch_1290x2796.png`, scaled copy `launch_1179x2556.png`).

### Body landmarks (rows of `home_body.png`, 1290 wide)

- Insights `>` heading 1014–1068 · bar chart ends 1453
- Cards `>` heading 1689–1732 · card rows start 1812, pitch 181 (6 rows) · View 159 more cards 2888 · Create card 3038–3151
- Transactions `>` heading 3361–3404 · Revolut 3484 · Amazon 3666 · Jazmyne Ellis 3917 · DoorDash 4098 · Apple 4279 · View all transactions 4520–4615
- Accounts `>` heading 4831–4874 · Credit 4954 · Checking 4724 5213 · Paysight 5418 · Checking 7493 5677 · View 24 more accounts 5871–5966
- Recent recipients heading 6182–6236 · rows 6304, 6479, 6654, 6829, 7004 (each ~103 tall, pitch 175)

Header hotspots (percents of 1290×370): org pill left 3% top 48% 42%×36%; terminal left 72%; profile left 85% (12%×36% each).
Footer tab bar cells (percents of 1290×356): y 30%–82%; Home 6–26%, list 26–45%, transfer 45–63%, bank 63–81%, cards 81–95%.

All hotspots are inert until destination shots exist.

## History

- `v1` folder `(21)` `IMG_1507.PNG`: single full-frame shot ("Welcome, Roeniel" variant), top 177 px painted. Replaced by the folder (22) stitch.

## PWA

- URL: `/` → `index.html` (`start_url` is `/`)
- Manifest name: Mercury · `apple-mobile-web-app-status-bar-style: black-translucent`
- Icon: `icon.png` (N mark from the header, folder 21 shot `x 80–150, y 212–276`)
