{
  perSystem =
    {
      self',
      pkgs,
      ...
    }:
    let
      src = ../.;
      npmDeps = pkgs.importNpmLock.buildNodeModules {
        npmRoot = src;
        inherit (pkgs) nodejs;
      };
    in
    {
      packages.www = pkgs.stdenvNoCC.mkDerivation {
        name = "www";
        inherit src;

        nativeBuildInputs = [
          pkgs.bun
        ];

        configurePhase = ''
          ln -s ${npmDeps}/node_modules node_modules
        '';

        buildPhase = ''
          make build
        '';

        installPhase = ''
          # TODO: https://github.com/cubing/icons/pull/138
          touch $out
          # mv ./dist/web/icons.cubing.net $out
        '';
      };

      checks.www = self'.packages.www;
    };
}
