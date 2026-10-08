# Tic-Tac-Toe

A two-player, browser-based Tic-Tac-Toe game built with plain HTML, CSS, and JavaScript.

## Play online

Once GitHub Pages is enabled for this repository and the deployment workflow has run, play it at:

[Play Tic-Tac-Toe](https://kkellerman.github.io/tic-tac-toe/)

## Features

- Alternating X and O turns
- Win and draw detection with highlighted winning cells
- Persistent X, O, and draw scores via browser local storage
- New-round and reset-score controls
- Responsive, keyboard-accessible button board

## Run locally

No installation or build step is needed. Open `index.html` in a modern browser.

For a local web server (recommended), from the repository root run:

```powershell
python -m http.server 8000
```

Then visit `http://localhost:8000`.

## Publishing

The included GitHub Actions workflow deploys this static site whenever changes are pushed to `master`. In the repository's **Settings → Pages**, set the source to **GitHub Actions** if it is not already selected.
