# Cubing Icons and Fonts [![Build Status](https://travis-ci.org/cubing/icons.svg?branch=master)](https://travis-ci.org/cubing/icons)

## Demo
<https://cubing.github.io/icons>

## Rebuild fonts and cubing-icons.css

We use the excellent [gulp-iconfont](https://www.npmjs.com/package/gulp-iconfont).

- `npm install`
- Install [potrace](http://potrace.sourceforge.net/).
- `npm run build` or `npm run watch` - Open `www/index.html` in your web browser.

## Deploy to GitHub Pages

TravisCI automatically runs `gulp deployTravis`, but that's only for the main
repository. If you want to see your changes on your own fork,
you can run `gulp deploy`.
