./.temp/lib/cubing-icons.woff2: ./src/svg/**/*.svg script/build-lib-js.ts
	bun run script/build-lib-js.ts
./.temp/lib/cubing-icons.css: ./.temp/lib/cubing-icons.woff2
./.temp/lib/cubing-icons.ts: ./.temp/lib/cubing-icons.woff2

./dist/lib/@cubing/icons/cubing-icons.css: ./.temp/lib/cubing-icons.css
./dist/lib/@cubing/icons/cubing-icons.woff2: ./.temp/lib/cubing-icons.woff2
./dist/lib/@cubing/icons/js/index.js: ./src/js/*.ts ./.temp/lib/cubing-icons.ts
./dist/lib/@cubing/icons/js/index.d.ts: ./src/js/index.ts ./.temp/lib/cubing-icons.ts ./tsconfig.build.jsonc
	bun run tsc --project ./tsconfig.build.jsonc

