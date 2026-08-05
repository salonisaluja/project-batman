# Batman Birthday Transmission - Wayne Enterprises Batcomputer

A cinematic, dark, Arkham-inspired birthday website. Five pages: a Batcomputer boot
sequence, a classified dossier, a mission-control terminal, a warm birthday reveal, and a
memory vault of photos. Built with plain HTML5, CSS3, and vanilla JavaScript - no build
step, no framework, no npm. Runs by opening index.html directly, and deploys as-is to
GitHub Pages.

## 1. Project structure

Batman-Birthday/
  index.html      - all five pages live in this one file
  style.css       - full visual design system and animations
  script.js       - boot sequence, transitions, effects, interactivity
  README.md
  assets/
    images/       - your own birthday photos (see below)
    audio/        - optional sound effects and music (see below)
    videos/       - reserved, not required by default build
    icons/        - favicon, etc.

No other files are required. Nothing to install, nothing to compile.

## 2. Run it locally

Double-click index.html, or open it from your browser with File > Open. Everything works
with zero server: rain, lightning, the boot terminal, radar, mission unlock, confetti,
and the photo vault.

If clicking INITIALIZE ever appears to do nothing, open your browser DevTools (F12),
check the Console tab for a red error message, and confirm all three files (index.html,
style.css, script.js) are saved as plain text in the same folder, with no extra ".txt"
extension added by your editor.

## 3. Deploy to GitHub Pages

1. Create a new GitHub repository.
2. Upload the folder contents to the root of the repository (index.html at the repo
   root, not inside a subfolder). Or push with git:

   git init
   git add .
   git commit -m "Batman birthday site"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<your-repo>.git
   git push -u origin main

3. In the repository: Settings > Pages > Build and deployment > Source: Deploy from a
   branch. Choose branch: main, folder: / (root). Save.
4. Wait about a minute, then visit the URL GitHub shows you.

All asset paths are relative (assets/...), so this works at a domain root or inside a
repository subpath with no configuration changes.

## 4. Adding your own content (optional)

The site works with zero extra files - every effect (rain, skyline, bat signal, HUD,
radar, cake, confetti, bat emblem) is drawn with CSS, SVG, and Canvas.

Photos - Memory Vault (Page 5): drop up to 6 images into assets/images/ using these
exact filenames:

  assets/images/photo1.jpg
  assets/images/photo2.jpg
  assets/images/photo3.jpg
  assets/images/photo4.jpg
  assets/images/photo5.jpg
  assets/images/photo6.jpg

If a file is missing, that tile shows a labeled placeholder instead of breaking.

Audio (optional) - drop files with these exact names into assets/audio/ to enable sound:

  rain.mp3              looping ambient rain during the storm pages
  thunder.mp3            random lightning strikes
  click.mp3               button click feedback
  typing.mp3               terminal / typewriter ticks
  theme.mp3                 warm cinematic score once the storm clears
  access-granted.mp3         plays when the boot sequence completes

Missing audio fails silently - the site still fully works, just quieter.

Favicon: drop a favicon.png into assets/icons/ for a custom browser tab icon.

## 5. Customizing the text

Page 2 (Dossier): edit the data-type="..." attributes and data-value="..." skill values.
Page 3 (Missions): edit mission names/status and the message inside #doc-terminal.
Page 4 (Birthday): edit the headline and Alfred's message (the "message" variable in
script.js).
Page 5 (Vault): edit the closing lines and data-caption="..." attributes.

No build step needed - just save and refresh.

## 6. Browser notes

Ambient audio only begins after tapping INITIALIZE on the first screen (required by
browser autoplay policy). The site respects prefers-reduced-motion. Vanilla HTML5, CSS3,
JS only - works in current Chrome, Firefox, Safari, and Edge.

## 7. Credits and license

Fonts (Oswald, Rajdhani, Share Tech Mono) load from Google Fonts via CDN. All visual
effects are original CSS/SVG/Canvas - no bundled media assets, so no third-party
licensing concerns out of the box. Make sure you have rights to any photos or audio you
add before publishing.
