{
  description = "Cubing Icons and Fonts";

  inputs = {
    flake-parts.url = "github:hercules-ci/flake-parts";
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    # PhantomJS is quite dead, but unfortunately we still depend on it.
    # It was removed from nixpkgs a while ago: <https://github.com/NixOS/nixpkgs/pull/169872>
    nixpkgs-with-phantomjs.url = "github:NixOS/nixpkgs/d1c3fea7ecbed758168787fe4e4a3157e52bc808";
    systems.url = "github:nix-systems/default";
    treefmt-nix.url = "github:numtide/treefmt-nix";
  };

  outputs =
    inputs@{ flake-parts, ... }:
    flake-parts.lib.mkFlake { inherit inputs; } {
      systems = import inputs.systems;
      imports = [
        ./nix/formatting.nix
        ./nix/phantomjs.nix
        ./nix/dev-shell.nix
        ./nix/www.nix
      ];
    };
}
