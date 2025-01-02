const del = require("del");
const gulp = require("gulp");
const path = require("node:path");
const jimp = require("gulp-jimp");
const through = require("through2");
const rename = require("gulp-rename");
const svg2png = require("gulp-svg2png");
const iconfont = require("gulp-iconfont");
const bufferstreams = require("bufferstreams");
const child_process = require("node:child_process");
const consolidate = require("gulp-consolidate");

const FONT_NAME = "cubing-icons";
const SVG_FILES = "svgs/*/*.svg";
const STATIC_FILES = "static/*/*";
const TEMPLATE_FILES = "templates/*.lodash";
const SRC_FILES = [SVG_FILES, TEMPLATE_FILES];

const runTimestamp = Math.round(Date.now() / 1000);

const defaultTask = gulp.parallel(copySvgs, copyStaticFiles, css);
export default defaultTask;

export function css() {
  const fontCss = fontCssPipe();
  return (
    gulp
      .src(SVG_FILES)

      // We convert the SVGs to PNG, to BMP, and then back to SVG
      // in order to produce the simplest SVGs possible, as iconfont
      // is not very resilient in what it accepts.
      .pipe(svg2png())

      // svg2png looks for files on the filesystem by name, so we cannot
      // rename until after svg2png. We should really fix this bug in svg2png.
      .pipe(
        through.obj((file, enc, next) => {
          file.path = path.join(
            path.dirname(file.path),
            file.relative.replace("/", "-"),
          );
          next(null, file);
        }),
      )

      .pipe(
        jimp({
          "": {
            background: "#FFFFFF", // Convert transparent to white
            type: "bmp",
          },
        }),
      )
      .pipe(bmp2svg())

      .pipe(
        iconfont({
          fontName: FONT_NAME,
          formats: ["ttf", "woff"],
          timestamp: runTimestamp, // get consistent builds when watching files
          normalize: true,
          fontHeight: 1000,
        }),
      )
      .on("glyphs", (glyphs, options) => {
        // Stash glyphs so we can generate the CSS at the end.
        fontCss.glyphs = glyphs;

        gulp
          .src("templates/index.html.lodash")
          .pipe(
            consolidate("lodash", {
              glyphs: glyphs,
            }),
          )
          .pipe(rename("index.html"))
          .pipe(gulp.dest("www/"));
      })
      .pipe(gulp.dest("www/fonts/"))
      .pipe(fontCss)
  );
}

export function copyStaticFiles() {
  return gulp.src(STATIC_FILES).pipe(gulp.dest("www/"));
}

export function copySvgs() {
  return gulp.src(SVG_FILES).pipe(gulp.dest("www/svgs/"));
}

export const watch = gulp.series(defaultTask, function watching() {
  gulp.watch(SRC_FILES, defaultTask);
});

export function clean() {
  return del("www");
}

function fontCssPipe() {
  const fontFiles = [];
  return through.obj(
    (file, enc, cb) => {
      file.contents
        .pipe(
          new bufferstreams((err, buf, cb) => {
            if (err) {
              throw err;
            }

            fontFiles[file.extname.substring(1)] = buf.toString("base64");
            cb();
          }),
        )
        .on("finish", cb);
    },
    function (cb) {
      // Modified from https://www.npmjs.com/package/gulp-iconfont
      const fontUrls = {
        woff: `data:application/x-font-woff;charset=utf-8;base64,${fontFiles.woff}`,
        ttf: `data:application/x-font-ttf;charset=utf-8;base64,${fontFiles.ttf}`,
      };
      gulp
        .src("templates/cubing-icons.css.lodash")
        .pipe(
          consolidate("lodash", {
            glyphs: this.glyphs,
            fontName: FONT_NAME,
            fontUrls: fontUrls,
            className: "cubing-icon",
          }),
        )
        .pipe(rename("cubing-icons.css"))
        .pipe(gulp.dest("www/css/"))
        .on("end", cb);
    },
  );
}

function bmp2svg() {
  return through.obj((file, enc, next) => {
    const potraceProcess = child_process.spawn(
      "potrace",
      ["-o", "-", "-b", "svg"],
      {
        stdio: ["pipe", "pipe", "inherit"],
      },
    );

    potraceProcess.stdin.write(file.contents);
    potraceProcess.stdin.end();

    // TODO - there must be some way of avoiding this...
    let buffer = new Buffer.alloc(0);
    potraceProcess.stdout.on("data", (data) => {
      buffer = Buffer.concat([buffer, data]);
    });

    potraceProcess.once("close", (code) => {
      if (code !== 0) {
        next(new Error(`potrace exited with code ${code}`, null));
      } else {
        file.extname = ".svg";
        file.contents = buffer;
        next(null, file);
      }
    });
  });
}
