# Yes, this is a bit funky. See "Upgrading/changing dependencies" in README.md
# for details.
bun.lockb: package-lock.json
	bun pm migrate --force

.PHONY: build
build: build-lib build-web

.PHONY: build-lib
build-lib: setup
	bun run script/build-lib.ts

.PHONY: build-web
build-web: setup
	bun run script/build-web.ts

.PHONY: setup
setup: bun.lockb
ifndef NIX_BUILD_TOP
	# Makes sure dependencies match the current checkout. Very fast no-op.
	bun install --no-save
endif

.PHONY: lint
lint: setup
	bun x @biomejs/biome check

.PHONY: format
format: setup
	bun x @biomejs/biome check --write

.PHONY: clean
clean:
	rm -rf ./dist/

.PHONY: reset
reset: clean
	rm -rf ./node_modules

.PHONY: publish
publish:
	npm publish
