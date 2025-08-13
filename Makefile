.PHONY: build
build: build-lib build-web

# Yes, this is a bit funky. See "Upgrading/changing dependencies" in README.md
# for details.
bun.lock: package-lock.json
	bun pm migrate --save-text-lockfile --force

.PHONY: build-lib
build-lib: build-lib-js build-lib-types

.PHONY: build-lib-js
build-lib-js: setup
	bun run script/build-lib-js.ts

.PHONY: build-lib-types
build-lib-types: build-lib-js
	bun x tsc --project ./tsconfig.build.json

.PHONY: build-web
build-web: setup build-lib
	bun run script/build-web.ts

.PHONY: setup
setup: bun.lock
ifndef NIX_BUILD_TOP
	@# Makes sure dependencies match the current checkout. Very fast no-op.
	bun install --no-save
endif

.PHONY: test
test: test-bun test-exports lint

.PHONY: test-bun
test-bun:
	bun test

.PHONY: test-exports
test-exports: build-lib-js
	node -- 'test/exports/test-legacy-export.js'
	bun run -- 'test/exports/test-legacy-export.js'
	bun run -- 'test/exports/test-legacy-export.ts'
	node -- 'test/exports/test-package-export.js'
	bun run -- 'test/exports/test-package-export.js'
	bun run -- 'test/exports/test-package-export.ts'

.PHONY: lint
lint: setup lint-ts-biome lint-ts-tsc

.PHONY: lint-ts-biome
lint-ts-biome: build-lib
	bun x @biomejs/biome check

.PHONY: lint-ts-tsc
# `./script/build-web.ts` imports the list of icons from the build lib, so we need to `build-lib` before we can lint.
lint-ts-tsc: build-lib
	bun x tsc --noEmit --project .
	bun x tsc --noEmit --project ./test/exports/tsconfig.json

.PHONY: format
format: setup
	bun x @biomejs/biome check --write

.PHONY: clean
clean:
	rm -rf ./.temp/ ./dist/

.PHONY: reset
reset: clean
	rm -rf ./node_modules
	rm -rf ./bun.lock

.PHONY: publish
publish:
	npm publish

.PHONY: prepublishOnly
prepublishOnly: clean lint build-lib
