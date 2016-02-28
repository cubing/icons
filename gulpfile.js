var fs = require('fs');
var del = require('del');
var gulp = require('gulp');
var batch = require('gulp-batch');
var through = require('through2');
var watch = require('gulp-watch');
var rename = require('gulp-rename');
var ghPages = require('gulp-gh-pages');
var iconfont = require('gulp-iconfont');
var gulpImagemin = require('gulp-imagemin');
var consolidate = require('gulp-consolidate');

var FONT_NAME = 'cubing-icons';
var SVG_FILES = 'svgs/*/*.svg';
var TEMPLATE_FILES = 'templates/*.lodash';
var SRC_FILES = [ SVG_FILES, TEMPLATE_FILES ];

var runTimestamp = Math.round(Date.now()/1000);

gulp.task('default', ['copySvgs'], function() {
  var fontCss = fontCssPipe();
  return gulp.src(SVG_FILES)

    // iconfont doesn't handle transformations, so we run our images through
    // gulp-imagemin first. See:
    //  https://github.com/nfroidure/svgicons2svgfont/issues/6.
    .pipe(gulpImagemin())

    .pipe(iconfont({
      fontName: FONT_NAME,
      formats: ['ttf', 'woff'],
      timestamp: runTimestamp, // get consistent builds when watching files
    }))
      .on('glyphs', function(glyphs, options) {
        // Stash glyphs so we can generate the CSS at the end.
        fontCss.glyphs = glyphs;

        gulp.src('templates/index.html.lodash')
          .pipe(consolidate('lodash', {
            glyphs: glyphs,
          }))
          .pipe(rename('index.html'))
          .pipe(gulp.dest('www/'));
      })
    .pipe(gulp.dest('www/fonts/'))
    .pipe(fontCss);
});

gulp.task('copySvgs', function() {
  return gulp.src(['svgs/**/*'])
           .pipe(gulp.dest('www/svgs/'));
});

gulp.task('watch', function() {
  gulp.start('default', function() {
    watch(SRC_FILES, batch(function(events, done) {
      gulp.start('default', done);
    }));
  });
});

gulp.task('deploy', ['default'], function() {
  return gulp.src('./www/**/*')
    .pipe(ghPages());
});

// Inspired by https://gist.github.com/domenic/ec8b0fc8ab45f39403dd
gulp.task('deploy-travis', ['default'], function() {
  if(!process.env.TRAVIS_TAG) {
    console.log("Not a tag, not deploying");
  } else {
    console.log("==> Building and deploying tag $TRAVIS_TAG <==");
    return gulp.src('./www/**/*')
      .pipe(ghPages({
        remoteUrl: `https://${process.env.GH_TOKEN}@github.com/cubing/icons.git`
      }));
  }
});

gulp.task('clean', function() {
  return del('www');
});

function fontCssPipe() {
  var fontFiles = [];
  return through.obj(function(file, enc, cb) {
    fontFiles[file.extname.substring(1)] = file.contents.toString('base64');
    cb();
  }, function(cb) {
    // Modified from https://www.npmjs.com/package/gulp-iconfont
    var fontUrls = {
      woff: "data:application/x-font-woff;charset=utf-8;base64," + fontFiles.woff,
      ttf: "data:application/x-font-ttf;charset=utf-8;base64," + fontFiles.ttf,
    };
    gulp.src('templates/cubing-icons.css.lodash')
      .pipe(consolidate('lodash', {
        glyphs: this.glyphs,
        fontName: FONT_NAME,
        fontUrls: fontUrls,
        className: 'cubing-icon',
      }))
      .pipe(rename('cubing-icons.css'))
      .pipe(gulp.dest('www/css/'));

    cb();
  });
}

