# 🦇 Batman Birthday Transmission — Wayne Enterprises Batcomputer

A cinematic, dark, Arkham-inspired birthday website. Five acts: a Batcomputer boot sequence,
a classified dossier, a mission-control terminal, a warm birthday reveal, and a memory vault
of photos. Built with plain HTML5, CSS3, and vanilla JavaScript — no build step, no framework,
no npm. It runs by opening `index.html` directly, and deploys as-is to GitHub Pages.

---

## 1. Project structure

```
Batman-Birthday/
├── index.html          All five pages/sections live in this one file
├── style.css            Full visual design system + animations
├── script.js             Boot sequence, transitions, FX, interactivity
├── README.md
└── assets/
    ├── images/           Your own birthday photos (see below)
    ├── audio/             Optional sound effects & music (see below)
    ├── videos/            Reserved — not required by default build
    └── icons/             Favicon, etc.
```

No other files are required. There is nothing to install and nothing to compile.

---

## 2. Run it locally

Just double-click `index.html`, or open it from your browser with `File > Open`.
Everything — rain, lightning, the boot terminal, radar, mission unlock, confetti, and the
photo vault — works with zero server. (Optional: for the smoothest experience serving over
`http://` instead of `file://` avoids some browsers' stricter autoplay/image rules — you can
do this with any static server, e.g. `python3 -m http.server` in the project folder — but it
is **not required**.)

---

## 3. Deploy to GitHub Pages

1. Create a new GitHub repository (public or private with Pages enabled).
2. Upload the entire `Batman-Birthday` folder contents to the **root** of the repository
   (i.e. `index.html` should sit at the repo root, not inside a subfolder) — or push via git:
   ```bash
   git init
   git add .
   git commit -m "Batman birthday site"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<your-repo>.git
   git push -u origin main
   ```
3. In your repository: **Settings → Pages → Build and deployment → Source: Deploy from a
   branch**, then choose **branch: `main`**, **folder: `/ (root)`**. Save.
4. Wait about a minute, then visit the URL GitHub shows you
   (`https://<your-username>.github.io/<your-repo>/`).

All asset paths in this project are relative (`assets/...`), so it works both at a domain
root and inside a repository subpath — no configuration needed.

---

## 4. Adding your own content (recommended, optional)

The site works out of the box with **zero extra files** — every visual effect (rain, skyline,
bat signal, HUD, radar, cake, confetti, Bat-emblem) is drawn with CSS/SVG/Canvas, so nothing
is missing if you skip this step. Two things are genuinely personal and left for you to add:

### Photos — Memory Vault (Page 5)
Drop up to 6 images into `assets/images/` using these exact filenames:

```
assets/images/photo1.jpg
assets/images/photo2.jpg
assets/images/photo3.jpg
assets/images/photo4.jpg
assets/images/photo5.jpg
assets/images/photo6.jpg
```

Any image format works if you also update the extension in `index.html`
(search for `photo1.jpg` etc. inside the `#photo-wall` block). If a file is missing, that
tile gracefully shows a labeled placeholder instead of breaking the layout — nothing crashes.

### Audio (optional, fully optional)
Drop files with these exact names into `assets/audio/` to enable sound:

| File | Used for |
|---|---|
| `rain.mp3` | Looping ambient rain during the storm pages |
| `thunder.mp3` | Random lightning strikes |
| `click.mp3` | Button click feedback |
| `typing.mp3` | Terminal / typewriter ticks |
| `theme.mp3` | Warm cinematic score once the storm clears (Page 4–5) |
| `access-granted.mp3` | Plays when the boot sequence completes |

The site works perfectly without any of these — missing audio fails silently (you'll just
have a quieter, still fully animated, experience). You can find royalty-free rain/thunder/
cinematic tracks on sites like Pixabay Audio or freesound.org — just check each track's
license before using it publicly.

### Favicon
Drop a `favicon.png` into `assets/icons/` if you'd like a custom browser tab icon.

---

## 5. Customizing the text

Everything is plain text inside `index.html` — open it in any text editor and change:

- **Page 2 (Dossier):** the profile fields (`data-type="..."` attributes) and skill values
  (`data-value="..."` attributes, 0–100).
- **Page 3 (Missions):** mission names/status, and the classified message inside
  `#doc-terminal`.
- **Page 4 (Birthday):** the headline, Alfred's message (inside `script.js`, search for
  `const message = ...`), and the cake.
- **Page 5 (Vault):** the closing message lines and photo captions
  (`data-caption="..."` attributes).

No build step is needed after editing — just save and refresh.

---

## 6. Browser notes

- Autoplay policies mean ambient audio only begins after the visitor taps **INITIALIZE** on
  the very first screen — this is intentional and required by every modern browser.
- The site respects `prefers-reduced-motion` for visitors who have that OS setting enabled.
- Tested against current versions of Chrome, Firefox, Safari, and Edge. No polyfills or
  external JS frameworks are used — only vanilla HTML5/CSS3/JS, so compatibility is broad.

---

## 7. Credits & license

Built with HTML5, CSS3, and vanilla JavaScript only. Fonts (Oswald, Rajdhani, Share Tech
Mono) are loaded from Google Fonts via CDN. All visual effects (skyline, bat signal, HUD,
radar, cake, Bat-emblem, confetti, rain) are original CSS/SVG/Canvas — no external image or
media assets are bundled, so there are no third-party licensing concerns out of the box.
Add your own photos/audio as described above; make sure you have the rights to anything you
add before publishing the repository publicly.

Happy Birthday. 🦇

