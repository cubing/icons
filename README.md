# Cubing Icons and Fonts [![Build Status](https://travis-ci.org/cubing/icons.svg?branch=main)](https://travis-ci.org/cubing/icons)

## Demo
<https://cubing.github.io/icons>

## Rebuild fonts and cubing-icons.css

We use the excellent [gulp-iconfont](https://www.npmjs.com/package/gulp-iconfont).

- `npm install`
- Install [potrace](http://potrace.sourceforge.net/).
- `npm run build` or `npm run watch` - Open `www/index.html` in your web browser.

## Releasing

### Bump version and deploy to npmjs

```
npm version major|minor|patch -m "Upgrade to %s for reasons"
```

### (Optional, this is handled automatically) Deploy to GitHub Pages

```
npm run deploy
```

This will deploy to the `gh-pages` branch of whatever remote your `origin` is
pointing at. TravisCI will automatically run this whenever code is pushed to
`main`.
