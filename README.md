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

Files are build into the `./dist` dir.

### Using `nix` for development (optional)

We provide a [`nix`](https://nixos.org/) shell that you can activate with: `nix develop`

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

#### CDN

Note that `cdn.cubing.net` requires an explicit version bump and deployment in order to pick up the new `@cubing/icons` version:

```shell
git clone https://github.com/cubing/cdn.cubing.net && cd cdn.cubing.net
# Requires SSH and optional Fastly credentials to deploy
make roll-@cubing/icons
```
