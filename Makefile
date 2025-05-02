.PHONY: build
build: build-lib build-web

.PHONY: build-lib
build-lib: setup
	bun run script/build-lib.ts

.PHONY: build-web
build-web: setup
	bun run script/build-web.ts

.PHONY: setup
setup: bun.lock
	@# Makes sure dependencies match the current checkout. Very fast no-op.
	bun install --no-save

.PHONY: lint
lint: setup
	bun x @biomejs/biome check

.PHONY: format
format: setup
	bun x @biomejs/biome check --write $(FMT_PATHS)

.PHONY: clean
clean:
	rm -rf ./dist/

.PHONY: reset
reset: clean
	rm -rf ./node_modules

.PHONY: publish
publish:
	npm publish

.PHONY: prepublishOnly
prepublishOnly: clean lint build-lib
