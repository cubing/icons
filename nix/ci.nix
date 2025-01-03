{
  inputs,
  self,
  lib,
  ...
}:
{
  flake.githubActions = inputs.nix-github-actions.lib.mkGithubMatrix {
    # To save time, we only test on x86 Linux in CI.
    checks = lib.getAttrs [ "x86_64-linux" ] self.checks;
  };
}
