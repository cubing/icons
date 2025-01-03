{ inputs, ... }:
{
  imports = [ inputs.treefmt-nix.flakeModule ];

  perSystem =
    {
      config,
      lib,
      pkgs,
      ...
    }:
    {
      treefmt = {
        flakeCheck = true;
        programs = {
          nixfmt.enable = true;
          biome.enable = true;
        };
        settings.formatter = {
          "biome-check" = {
            command = lib.getExe pkgs.biome;
            options = [
              "check"
            ];
            inherit (config.treefmt.programs.biome) includes;
          };
        };
      };
    };
}
