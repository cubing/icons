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
      packages.web = pkgs.stdenvNoCC.mkDerivation {
        name = "web";
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
          mv ./dist/web/icons.cubing.net $out
        '';
      };

      checks.web = self'.packages.web;
    };
}
