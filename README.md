# Cubing Icons and Fonts

[![Deploy to GitHub Pages](https://github.com/cubing/icons/actions/workflows/deploy.yml/badge.svg)](https://github.com/cubing/icons/actions/workflows/deploy.yml)

## Demo

<https://icons.cubing.net>

## Development

Most development is simply adding/changing existing SVG files. If you haven't dealt
with SVG files before, check out [Inkscape](https://inkscape.org/).

If you want to actually build a font or CSS locally, you'll need some more tooling.
The easiest way to get those tools is with [nix](https://nixos.org/). You'll
need the experimental [Flakes](https://wiki.nixos.org/wiki/Flakes) feature
enabled.

### Some useful `nix` commands

- `nix flake check` - This is what happens in CI: build the website, check formatting, etc.
- `nix build .#www` - Build the website. When this finishes, open `result/index.html` in your web browser.

### In a dev shell

You can enter a dev shell with `nix develop`. This will open a subshell with
all dependencies installed.

- `npm run build` or `npm run watch` - When this finishes, open `www/index.html` in your web browser.

## Releasing

### Bump version and deploy to `npmjs.org`

```
npm version major|minor|patch -m "Upgrade to %s for reasons"
```
