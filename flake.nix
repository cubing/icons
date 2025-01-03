{
  description = "Cubing Icons and Fonts";

  inputs = {
    flake-parts.url = "github:hercules-ci/flake-parts";
    nix-github-actions = {
      inputs.nixpkgs.follows = "nixpkgs";
      url = "github:nix-community/nix-github-actions";
    };
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    systems.url = "github:nix-systems/default";
    treefmt-nix = {
      inputs.nixpkgs.follows = "nixpkgs";
      url = "github:numtide/treefmt-nix";
    };
  };

  outputs =
    inputs@{ flake-parts, ... }:
    flake-parts.lib.mkFlake { inherit inputs; } {
      systems = import inputs.systems;
      imports = [
        ./nix/dev-shell.nix
        ./nix/lint.nix
        ./nix/web.nix
        ./nix/ci.nix
      ];
    };
}
