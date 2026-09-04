# Mercury screenshot crop

Isolated from `ig-prop-site`. New repo, new URL. Do not copy files back into the Instagram project.

## Source

Folder `(21)` `iCloud Photos from Roeniel Carter\IMG_1507.PNG`

- Original: **1290 × 2796** RGB (iPhone 15/16 Pro Max @3x)
- Always use the folder original. Never a Cursor chat attachment.

## What this pass did

One full-frame home shot. The third Cards row (`Jaz trading`) is clipped by the floating tab bar. Do not stitch until more scroll shots arrive. Filename order = scroll order; cut only in empty dark.

1. Keep the full 1290 × 2796 frame.
2. Paint the top **177 px** (59pt × 3, Dynamic Island `safe-area-inset-top`) with `(16, 16, 26)` / `#10101a` sampled from row ~150.
3. Leave everything below 177 px alone (header pills, charts, tab bar, home indicator).
4. Save as `screens/home.png`.

After any image swap: bump `?v=` everywhere in `index.html` + `manifest.json` **and** `CACHE` in `sw.js` (same number). Reopen the home-screen icon.

## Screens

| id | file | notes |
|---|---|---|
| `#s-home` | `screens/home.png` | folder (21) only. No other screens yet. |

## Reserved hotspots (unwired until a destination shot exists)

Percents of 1290 × 2796:

- Org pill: left 3%, top 7.2%, 42% × 4.2%
- Terminal: left 72%, top 7.2%, 12% × 4.2%
- Profile: left 85%, top 7.2%, 12% × 4.2%
- Insights `>`: left 0, top 49.8%, 40% × 4.2%
- Cards `>`: left 0, top 69.6%, 28% × 4.5%
- Debit card row: left 0, top 75.2%, 100% × 6%
- jazgroq row: left 0, top 81.6%, 100% × 5.5%
- Tab bar (y 2547–2733): Home / list / transfer / bank / cards

Home is already this screen. Other tabs stay inert.

## PWA

- URL: `/` → `index.html` (`start_url` is `/`)
- Manifest name: Mercury
- `apple-mobile-web-app-status-bar-style: black-translucent`
- Icon: `icon.png` (N mark from the header)
- Launch: `launch_1290x2796.png` / `launch_1179x2556.png`
