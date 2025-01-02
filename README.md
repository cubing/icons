# Cubing icons and fonts

## Documentation and demo

<https://icons.cubing.net>

## Development

Most development is simply adding/changing existing SVG files under the [`./src/svg` directory](https://github.com/cubing/icons/tree/main/src/svg). If you haven't dealt with SVG files before, check out [Inkscape](https://inkscape.org/).

If you want to actually build a font or CSS locally, you'll need some more tooling.

## Build the project

This project uses [`bun`](https://bun.sh/) for development. With `bun` installed, you can run:

```shell
git clone https://github.com/cubing/icons && cd icons
make
```

Files are build into the `./dist` dir.

### Develop using `nix`

TODO: adapt `nix` info.

## Releasing

### Bump version and deploy to `npmjs.org`

```shell
npm version [major|minor|patch] -m "Release description"
git push --follow-tags
make publish
```
