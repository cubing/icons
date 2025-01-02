.PHONY: build
build: build-lib build-site

.PHONY: build-lib
build-lib: setup
	bun run script/build-lib.ts

.PHONY: build-site
build-site: setup
	bun run script/build-site.ts

.PHONY: setup
setup:
	# Makes sure dependencies match the current checkout. Very fast no-op.
	bun install --no-save

.PHONY: lint
lint: setup
	npx @biomejs/biome check

.PHONY: format
format: setup
	npx @biomejs/biome check --write"

.PHONY: clean
clean:
	rm -rf ./dist/

.PHONY: reset
reset: clean
	rm -rf ./node_modules
