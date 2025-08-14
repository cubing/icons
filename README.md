# Cubing icons and fonts

## Documentation and demo

<https://icons.cubing.net>

## Development

Most development is simply adding/changing existing SVG files under the
[`./src/svg` directory](https://github.com/cubing/icons/tree/main/src/svg). If
you haven't dealt with SVG files before, check out
[Inkscape](https://inkscape.org/).

If you want to actually build a font or CSS locally, you'll need some more tooling.

### Build the project

You'll need [`bun`](https://bun.sh) to install development dependencies and
build the project. Either install `bun` with your preferred package manager, or
use our [Nix-powered dev shell](#using-nix-for-development-optional).

Check out and build the project as follows:

```shell
git clone https://github.com/cubing/icons && cd icons
make
```

Files are build into the `./dist` directory.

### Using `nix` for development (optional)

We provide a [`nix`](https://nixos.org/) shell that you can activate with `nix develop`.

### Build process

The build process of this project is complicated because we want to make it easy
to contribute a new icon by adding an SVG file without making any other changes.

Here's what happens when you run `make build-lib`:

| Target            | Action                                                           | Input                                            | Output                                                                                        |
| ----------------- | ---------------------------------------------------------------- | ------------------------------------------------ | --------------------------------------------------------------------------------------------- |
| `build-lib-js`    | Invoke [`fantasticon`](https://github.com/tancredi/fantasticon). | `src/svg/`                                       | `.temp/lib/cubing-icons.woff2`<br>`.temp/lib/cubing-icons.css`<br>`.temp/lib/cubing-icons.ts` |
| `build-lib-js`    | Rewrite the CSS for backwards compat.                            | `.temp/lib/cubing-icons.css`                     | `dist/lib/@cubing/icons/cubing-icons.css`                                                     |
| `build-lib-js`    | Copy the font.                                                   | `.temp/lib/cubing-icons.woff2`                   | `dist/lib/@cubing/icons/cubing-icons.woff2`                                                   |
| `build-lib-js`    | Build the TS to JS with specified exports.                       | `src/js/index.ts`<br>`.temp/lib/cubing-icons.ts` | `dist/lib/@cubing/icons/js/index.js`<br>`dist/lib/@cubing/icons/js/index.js.map`              |
| `build-lib-types` | Build the types.                                                 | `src/js/index.ts`<br>`.temp/lib/cubing-icons.ts` | `dist/lib/@cubing/icons/js/index.d.ts`                                                        |

In particular, note that `src/js/index.ts` depends on (a symlink to) `.temp/lib/cubing-icons.ts`. This means that we cannout build the output JS or the output types without building the `build-lib-js` target.

In turn, this means that linting using Biome or TypeScript also transitively depends on the `build-lib-js` target. Unfortunately, this makes linting take a few seconds (even though the codebase is tiny). However, this is preferable to the complexity of the alternatives: 1) try to express the exact relationships between all the files above to use `make`'s timestamp checks to avoid rebuilding, or 2) require every added SVG to also modify an in-tree list of SVGs.

### Releasing

To bump the version and deploy to `npmjs.org`:

```shell
npm version [major|minor|patch] -m "Release description"
git push --follow-tags
make publish
```

#### CDN

Note that `cdn.cubing.net` requires an explicit version bump and deployment in order to pick up the new `@cubing/icons` version:

```shell
git clone https://github.com/cubing/cdn.cubing.net && cd cdn.cubing.net
# Requires SSH and optional Fastly credentials to deploy
make roll-@cubing/icons
```
