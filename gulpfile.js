const gulp = require("gulp");
const plumber = require("gulp-plumber");
const sourcemap = require("gulp-sourcemaps");
const sass = require('gulp-sass')(require('sass'));
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const sync = require("browser-sync").create();
const csso = require("gulp-csso");
const rename = require("gulp-rename");
const imagemin = require("gulp-imagemin");
const webp = require("gulp-webp");
const svgstore = require("gulp-svgstore");
const del = require("del");
const htmlmin = require('gulp-htmlmin');
const uglify = require("gulp-uglify");

// Styles

const styles = () => {
  return gulp.src("source/sass/style.scss")
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss([
        autoprefixer()
      ]))
    .pipe(csso())
    .pipe(rename("style.min.css"))
    .pipe(sourcemap.write("."))
    .pipe(gulp.dest("source/css"))
    .pipe(sync.stream());
}

exports.styles = styles;

// Server

const server = (done) => {
  sync.init({
    server: {
      baseDir: 'build'
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
}

exports.server = server;

// Watcher

const watcher = () => {
  gulp.watch("source/sass/**/*.scss", gulp.series(styles, cleancss, css));
  gulp.watch("source/*.html", gulp.series(cleanhtml, html)).on("change", sync.reload);
  gulp.watch("source/js/**", gulp.series(cleanjs, scripts)).on("change", sync.reload);
}

// Images

const images = () => {
  return gulp.src("source/img/**/*.{jpg,png,svg}")
    .pipe(imagemin([
      imagemin.optipng({optimizationLevel: 3}),
      imagemin.mozjpeg({progressive: true})
    ]))
    .pipe(gulp.dest("build/img"))
}

exports.images = images;

//WebP

const towebp = () => {
  return gulp.src("source/img/**/*.{jpg,png}")
    .pipe(webp({quality: 90}))
    .pipe(gulp.dest("source/img"))
}

exports.webp = towebp;

// Sprite

const sprite = () => {
  return gulp.src("source/img/**/icon-*.svg")
    .pipe(svgstore())
    .pipe(rename("sprite.svg"))
    .pipe(gulp.dest("source/img"))
}

exports.sprite = sprite;

const copy = () => {
  return gulp.src([
    "source/fonts/**/*.{woff,woff2}",
    "source/img/**",
    "source/*.ico"
    ], {
      base: "source"
    })
    .pipe(gulp.dest("build"));
};

exports.copy = copy;

const clean = () => {
  return del("build");
}

exports.clean = clean;

const cleanhtml = () => {
  return del("build/*.html");
}

exports.cleanhtml = cleanhtml;

const cleanjs = () => {
  return del("build/js/**");
}

exports.cleanjs = cleanjs;

const cleancss = () => {
  return del("build/css/**");
}

exports.cleancss = cleancss;

const html = () => {
  return gulp.src([
    "source/*.html",
    ], {
      base: "source"
    })
    .pipe(htmlmin({collapseWhitespace: true}))
    // .pipe(rename(function (path) {
    //     path.basename += ".min";
    //   }))
    .pipe(gulp.dest("build"));
}

exports.html = html;

const scripts = () => {
  return gulp.src([
    "source/js/**",
    ], {
      base: "source"
    })
    .pipe(uglify())
    .pipe(gulp.dest("build"));
}

exports.scripts = scripts;

const css = () => {
  return gulp.src([
    "source/css/**/*.css",
    ], {
      base: "source"
    })
    .pipe(gulp.dest("build"));

}

exports.css = css;

const build = gulp.series(
  clean,
  towebp,
  sprite,
  copy,
  images,
  styles,
  html,
  scripts,
  css
)

exports.build = build;

exports.start = gulp.series(
  build, server, watcher
)

