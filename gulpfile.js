var fs = require('fs');
var del = require('del');
var gulp = require('gulp');
var path = require('path');
var stream = require('stream');
var jimp = require('gulp-jimp');
var batch = require('gulp-batch');
var through = require('through2');
var watch = require('gulp-watch');
var rename = require('gulp-rename');
var svg2png = require('gulp-svg2png');
var ghPages = require('gulp-gh-pages');
var iconfont = require('gulp-iconfont');
var runSequence = require('run-sequence');
var child_process = require('child_process');
var consolidate = require('gulp-consolidate');

var FONT_NAME = 'cubing-icons';
var SVG_FILES = 'svgs/*/*.svg';
var TEMPLATE_FILES = 'templates/*.lodash';
var SRC_FILES = [ SVG_FILES, TEMPLATE_FILES ];

var runTimestamp = Math.round(Date.now()/1000);

gulp.task('default', ['copySvgs'], function() {
  var fontCss = fontCssPipe();
  return gulp.src(SVG_FILES)

    // We convert the SVGs to PNG, to BMP, and then back to SVG
    // in order to produce the simplest SVGs possible, as iconfont
    // is not very resilient in what it accepts.
    .pipe(svg2png())

    // svg2png looks for files on the filesystem by name, so we cannot
    // rename until after svg2png. We should really fix this bug in svg2png.
    .pipe(through.obj(function(file, enc, next) {
      file.path = path.join(path.dirname(file.path), file.relative.replace("/", "-"));
      next(null, file);
    }))

    .pipe(jimp({
      '': {
        background: '#FFFFFF', // Convert transparent to white
        type: 'bmp',
      }
    }))
    .pipe(bmp2svg())

    .pipe(iconfont({
      fontName: FONT_NAME,
      formats: ['ttf', 'woff'],
      timestamp: runTimestamp, // get consistent builds when watching files
      normalize: true,
      fontHeight: 1000,
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
  return gulp.src(SVG_FILES)
           .pipe(gulp.dest('www/svgs/'));
});

gulp.task('watch', function() {
  gulp.start('default', function() {
    watch(SRC_FILES, batch(function(events, done) {
      gulp.start('default', done);
    }));
  });
});

gulp.task('deployHelper', function() {
  return gulp.src('./www/**/*.*')
    .pipe(ghPages());
});
gulp.task('deploy', function(done) {
  return runSequence('clean', 'default', 'deployHelper', done);
});

// Inspired by https://gist.github.com/domenic/ec8b0fc8ab45f39403dd
gulp.task('deployTravisHelper', function() {
  if(process.env.TRAVIS_PULL_REQUEST !== "false") {
    console.log(`Building PR #${process.env.TRAVIS_PULL_REQUEST} on branch ${process.env.TRAVIS_BRANCH}, not deploying`);
  } else if(process.env.TRAVIS_BRANCH !== "master") {
    console.log(`Building non-master branch ${process.env.TRAVIS_BRANCH}, not deploying`);
  } else {
    console.log(`==> Building and deploying <==`);
    return gulp.src('./www/**/*.*')
      .pipe(ghPages({
        remoteUrl: `https://${process.env.GH_TOKEN}@github.com/cubing/icons.git`
      }));
  }
});
gulp.task('deployTravis', function(done) {
  return runSequence('clean', 'default', 'deployTravisHelper', done);
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
      .pipe(gulp.dest('www/css/'))
      .on('end', cb);
  });
}

function bmp2svg() {
  return through.obj(function(file, enc, next) {

    var potraceProcess = child_process.spawn(
      'potrace', ['-o', '-', '-b', 'svg'], {
         stdio: [ 'pipe', 'pipe', 'inherit' ]
       }
    );

    potraceProcess.stdin.write(file.contents);
    potraceProcess.stdin.end();

    // TODO - there must be some way of avoiding this...
    var buffer = new Buffer('');
    potraceProcess.stdout.on('data', function(data) {
      buffer = Buffer.concat([ buffer, data ]);
    });

    potraceProcess.once('close', function(code) {
      if(code !== 0) {
        next(new Error("potrace exited with code " + code, null));
      } else {
        file.extname = ".svg";
        file.contents = buffer;
        next(null, file);
      }
    });
  });
}
