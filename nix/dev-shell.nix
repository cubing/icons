{
  perSystem =
    { self', pkgs, ... }:

    {
      devShells.default = pkgs.mkShell {
        packages = [
          pkgs.importNpmLock.hooks.linkNodeModulesHook
        ];

        inherit (self'.packages.www) npmDeps;

        inputsFrom = [
          self'.packages.www
        ];
      };
    };
}
