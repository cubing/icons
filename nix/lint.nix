{
  perSystem =
    { self', pkgs, ... }:
    {
      # Defer to `make format` for any formatting.
      formatter = pkgs.writeShellApplication {
        name = "format";
        runtimeInputs = self'.devShells.default.nativeBuildInputs ++ [
          (pkgs.writers.writePython3Bin "shlex_join" { } ''
            import shlex
            import sys
            print(shlex.join(sys.argv[1:]))
          '')
        ];
        text = ''make format FMT_PATHS="$(shlex_join "$@")"'';
      };
    };
}
