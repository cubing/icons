.PHONY: build
build:
	nix build .#www

.PHONY: check
check:
	nix flake check --print-build-logs

.PHONY: fix
fix:
	nix fmt
