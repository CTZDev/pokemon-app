//Packages
//npm i --save-dev gulp sass gulp-sass gulp-autoprefixer browser-sync (Sass)
//Applied import and export in JS
//npm i --save-dev @babel/core gulp gulp-better-rollup rollup rollup-plugin-babel rollup-plugin-node-resolve rollup-plugin-commonjs gulp-terser gulp-terser gulp-babel @babel/preset-env

// Initialize modules
const { src, dest, watch, series } = require("gulp");
//SASS
const sass = require("gulp-sass")(require("sass"));
const autoprefixer = require("gulp-autoprefixer");
const browserSync = require("browser-sync").create();
//JS
const terser = require("gulp-terser");
const rollup = require("gulp-better-rollup");
const babel = require("rollup-plugin-babel");
const resolve = require("rollup-plugin-node-resolve");
const commonjs = require("rollup-plugin-commonjs");

//SCSS TASK
function scssTask() {
  return src("./app/scss/style.scss", { sourcemaps: true })
    .pipe(
      sass({
        outputStyle: "compressed",
      }).on("error", sass.logError)
    )
    .pipe(autoprefixer("last 2 versions"))
    .pipe(dest("./dist", { sourcemaps: "." }));
}

//JS TASK
function jsTask() {
  return src("app/js/script.js", { sourcemaps: true })
    .pipe(rollup({ plugins: [babel({ presets: ["@babel/preset-env"] }), resolve(), commonjs()] }, "umd"))
    .pipe(terser())
    .pipe(dest("dist", { sourcemaps: "." }));
}

//BROWSER SYNC  TASK
function browserSynServe(cb) {
  browserSync.init({
    server: {
      baseDir: "./",
    },
    notify: {
      styles: {
        top: "auto",
        bottom: "0",
      },
    },
  });
  cb();
}

//BROWSER SYNC RELOAD
function browserSyncReload(cb) {
  browserSync.reload();
  cb();
}

//WATCH TASK
function watchTask() {
  watch("*.html", browserSyncReload);
  watch(["app/scss/**/*.scss", "app/js/**/*.js"], series(scssTask, jsTask, browserSyncReload));
}

exports.default = series(scssTask, jsTask, browserSynServe, watchTask);
