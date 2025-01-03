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
build the project. Check out and build the project as follows:

```shell
git clone https://github.com/cubing/icons && cd icons
make
```

If you don't have `bun` installed, we provide a [`nix`](https://nixos.org/)
shell you can activate with `nix develop`:

```shell
git clone https://github.com/cubing/icons && cd icons
nix develop
make
```

Files are build into the `./dist` dir.

### Upgrading/changing dependencies

`package-lock.json` is the source of truth. Use `npm` to change dependencies
(if all you're doing is installing dependencies, you don't need `npm`).

As soon as `nix` gets [support for `bun`
lockfiles](https://github.com/NixOS/nixpkgs/issues/255890), we can remove this
quirk.

### Releasing

To bump the version and deploy to `npmjs.org`:

```shell
npm version [major|minor|patch] -m "Release description"
git push --follow-tags
make publish
```
