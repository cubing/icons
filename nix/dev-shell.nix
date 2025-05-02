{
  perSystem =
    { pkgs, ... }:

    {
      devShells.default = pkgs.mkShell {
        packages = [
          pkgs.gnumake
          pkgs.bun
        ];
      };
    };
}
