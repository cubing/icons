.PHONY: build
build: setup
	bun run script/build.ts

.PHONY: setup
setup:
	# Makes sure dependencies match the current checkout. Very fast no-op.
	bun install

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
