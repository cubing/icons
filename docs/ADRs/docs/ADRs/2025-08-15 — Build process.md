# Build process

- Author: Lucas Garron
- Valid as of: 2025-11-17

## Motivation

We want to make `@cubing/icons` as simple as possible to:

- use, and
- contribute to.

## Goals

- Provide convenient exports that are consistent with each other.
  - A CSS file that is compatible with CSS class styling from `v1.x`.
    - This uses an icon font right now, although we can maintain the `v1.x` API even if we switch to another implementation (e.g. inline SVG data).
  - Metadata about the available icons.
    - We want to provide this at least in JS (with associated TypeScript types) for now, possibly in JSON in the future.
- Allow contributions to consist of individual SVG file additions, without any further complications.
- Allow `make build`, `make test`, and `make lint` to run out of the box.

### Constraints

The best icon font building library for our use case right now is [`fantasticon`](https://github.com/tancredi/fantasticon). This comes with several constraints:

- CSS, font files, and metadata are built all at once.
- The CSS file requires rewrites to keep compatibility with `1.x` syntax.
- The metadata is created as a TypeScript file.
  - The generated export contains `CubingIconsId`, but we want to avoid the use of the `Id` suffix.

These files are compatible with modern bundlers, but we must:

- rewrite the CSS file, and
- compile the TypeScript to JavaScript so it can be used in `node` directly.

### Decision

Use the following steps:

- Run `fantasticon` with an output directory of `.temp/lib`.
- Rewrite the CSS and place it in the final package location.
- Import the built TS from `src/js/index.ts` and then build that.

Here's what happens when you run `make build-lib`:

| Target            | Action                                                           | Input                                            | Output                                                                                        |
| ----------------- | ---------------------------------------------------------------- | ------------------------------------------------ | --------------------------------------------------------------------------------------------- |
| `build-lib-js`    | Invoke [`fantasticon`](https://github.com/tancredi/fantasticon). | `src/svg/`                                       | `.temp/lib/cubing-icons.woff2`<br>`.temp/lib/cubing-icons.css`<br>`.temp/lib/cubing-icons.ts` |
| `build-lib-js`    | Rewrite the CSS for backwards compat.                            | `.temp/lib/cubing-icons.css`                     | `dist/lib/@cubing/icons/cubing-icons.css`                                                     |
| `build-lib-js`    | Copy the font.                                                   | `.temp/lib/cubing-icons.woff2`                   | `dist/lib/@cubing/icons/cubing-icons.woff2`                                                   |
| `build-lib-js`    | Build the TS to JS with specified exports.                       | `src/js/index.ts`<br>`.temp/lib/cubing-icons.ts` | `dist/lib/@cubing/icons/js/index.js`<br>`dist/lib/@cubing/icons/js/index.js.map`              |
| `build-lib-types` | Build the types.                                                 | `src/js/index.ts`<br>`.temp/lib/cubing-icons.ts` | `dist/lib/@cubing/icons/js/index.d.ts`                                                        |

In particular, note that `src/js/index.ts` depends on (a symlink to) `.temp/lib/cubing-icons.ts`. This means that we cannot build the output JS or the output types without building the `build-lib-js` target.

In turn, this means that linting using Biome or TypeScript also transitively depends on the `build-lib-js` target. Unfortunately, this makes linting take a few seconds (even though the codebase is tiny). However, this is preferable to the complexity of the alternatives: 1) try to express the exact relationships between all the files above to use `make`'s timestamp checks to avoid rebuilding, or 2) require every added SVG to also modify an in-tree list of SVGs.
