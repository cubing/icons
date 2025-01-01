{ inputs, ... }:
{
  perSystem =
    { system, ... }:
    {
      _module.args.pkgs-with-phantom-js = inputs.nixpkgs-with-phantomjs.legacyPackages.${system};
    };
}
