{
  perSystem =
    { pkgs, ... }:

    {
      devShells.default = pkgs.mkShell {
        packages = [
          pkgs.gnumake
          pkgs.bun
          # Provides `npm`, which we use for releasing (see ../README.md). We
          # should automate that instead, see
          # <https://github.com/cubing/actions-workflows/issues/3>.
          pkgs.nodejs
        ];
      };
    };
}
