{ inputs, ... }:
{
  imports = [ inputs.treefmt-nix.flakeModule ];

  perSystem.treefmt = {
    flakeCheck = true;
    programs = {
      nixfmt.enable = true;
      biome = {
        enable = true;
        settings.formatter.indentStyle = "space";
      };
    };
  };
}
