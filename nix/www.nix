{
  perSystem =
    {
      self',
      pkgs,
      pkgs-with-phantom-js,
      ...
    }:
    let
      src = ../.;
      inherit (pkgs) nodejs;
      npmDeps = pkgs.importNpmLock.buildNodeModules {
        npmRoot = src;
        inherit nodejs;
        derivationArgs.nativeBuildInputs = [
          pkgs-with-phantom-js.phantomjs2
        ];
      };
    in
    {
      packages.www = pkgs.stdenvNoCC.mkDerivation {
        name = "www";
        inherit src;

        nativeBuildInputs = [
          nodejs
          pkgs.potrace
        ];

        configurePhase = ''
          ln -s ${npmDeps}/node_modules node_modules
        '';

        buildPhase = ''
          npm run build
        '';

        installPhase = ''
          mv ./www $out
        '';

        passthru.npmDeps = npmDeps;
      };

      checks.www = self'.packages.www;
    };
}
