{
  perSystem =
    { self', pkgs, ... }:

    {
      devShells.default = pkgs.mkShell {
        inputsFrom = [
          self'.packages.web
        ];
        packages = [
          # Provides `npm`, which we use because nix doesn't have
          # support for `bun` lockfiles:
          # <https://github.com/NixOS/nixpkgs/issues/255890>.
          pkgs.nodejs
        ];
      };
    };
}
