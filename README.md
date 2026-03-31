# Cubing icons and fonts

## Documentation and demo

<https://icons.cubing.net>

## Contributing

Most development is simply adding/changing existing SVG files under the
[`./src/svg` directory](https://github.com/cubing/icons/tree/main/src/svg). 

To add a new icon, please follow the following steps:

1. Make or edit your icon! All icons should be vector SVG files. If
you haven't dealt with SVGs before, check out
[Inkscape](https://inkscape.org/).
1. Make sure your SVG is cleaned up and minified. You can just upload your SVG file to [SVGOMG](https://jakearchibald.github.io/svgomg/) and then download the output file using the default settings.
2. Name your icon in all lowercase, separating each word with an underscore. If specifying the dimensions of a cube in your icon, name, don't include any `x` symbols. (correct: `crazy_333.svg`, incorrect: `Crazy-3x3x3.SVG`)
3. Remove any borders and fill colors from the your icon. To do this, look inside the SVG file and remove anything that looks like `fill="..."` or `stroke="..."`.
4. Make a pull request here in GitHub adding your new icon file.

Our maintainers can help you with any of the above steps if you need help.

### Build the project

If you want to actually build a font or CSS locally, you'll need some more tooling.

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
