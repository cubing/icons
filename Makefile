.PHONY: build
build: build-lib build-web

include build.Makefile

.PHONY: build-lib
build-lib: build-lib-css build-lib-js build-lib-types

.PHONY: build-lib-js
build-lib-js: ./dist/lib/@cubing/icons/cubing-icons.css

.PHONY: build-lib-css
build-lib-css: ./dist/lib/@cubing/icons/cubing-icons.woff2

.PHONY: build-lib-js
build-lib-js: ./dist/lib/@cubing/icons/js/index.js

.PHONY: build-lib-types
build-lib-types: ./dist/lib/@cubing/icons/js/index.d.ts

.PHONY: build-web
build-web: setup build-lib-js
	bun run script/build-web.ts

.PHONY: setup
setup:
	@# Makes sure dependencies match the current checkout. Very fast no-op.
	bun install --frozen-lockfile

.PHONY: test
test: lint bun-test

.PHONY: bun-test
bun-test:
	bun test

.PHONY: lint
lint: setup lint-ts-biome lint-ts-tsc

.PHONY: lint-ts-biome
lint-ts-biome: build-lib-js
	bun x @biomejs/biome check

.PHONY: lint-ts-tsc
lint-ts-tsc: build-lib-types
	bun x tsc --noEmit --project .

.PHONY: format
format: setup
	bun x @biomejs/biome check --write

.PHONY: clean
clean:
	rm -rf ./.temp/ ./dist/

.PHONY: reset
reset: clean
	rm -rf ./node_modules

.PHONY: publish
publish:
	npm publish

.PHONY: prepublishOnly
prepublishOnly: clean lint build-lib
