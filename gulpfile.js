const {src, dest, watch, parallel } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const autoprefixer = require('autoprefixer');
const postcss    = require('gulp-postcss')
const sourcemaps = require('gulp-sourcemaps')
const cssnano = require('cssnano');
const concat = require('gulp-concat');
const terser = require('gulp-terser-js');
const rename = require('gulp-rename');
const imagemin = require('gulp-imagemin');
const notify = require('gulp-notify');
const cache = require('gulp-cache');
const webp = require('gulp-webp');

//paths

const paths = {
    styles: {
      scss: 'src/scss/**/*.scss',
      dest: './build/css'
    },
    javaScript: {
        js: 'src/js/**/*.js',
        dest: './build/js'
      },
    imagenes: {
      img: 'src/img/**/*',
      dest: './build/img'
    }
  };
 
  // css es una función que se puede llamar automaticamente

  function css() {
    return src(paths.styles.scss)
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(postcss([autoprefixer(), cssnano()]))
        .pipe(postcss([autoprefixer()]))
        .pipe(sourcemaps.write('.'))
        .pipe( dest(paths.styles.dest) );
}

 // Automatización de JS

 function javascript() {
    return src(paths.javaScript.js)
    .pipe(sourcemaps.init())
    .pipe( concat('bundle.js'))
    .pipe( terser() )
    .pipe(sourcemaps.write('.'))
    .pipe( rename({suffix: '.min'}))
    .pipe(dest(paths.javaScript.dest))
}

function imagenes() {
    return src(paths.imagenes.img)
    .pipe(cache(imagemin({ optimizationLevel: 3})))
    .pipe(dest(paths.imagenes.dest))
    .pipe(notify(function () {
        console.log('COMPILANDO IMAGENES');
    }));
}

function versionWebp() {
    return src(paths.imagenes.img)
    .pipe(webp() )
    .pipe(dest(paths.imagenes.dest))
    .pipe(notify(function () {
        console.log('COMPILANDO WEBP');
    }));
}


function watchArchivos() {
    watch( paths.styles.scss, css );
    watch( paths.javaScript.js, javascript );
    watch( paths.imagenes.img, imagenes );
    watch( paths.imagenes.img, versionWebp );
}



exports.css = css;
exports.javascript = javascript;
exports.imagenes = imagenes;
exports.versionWebp = versionWebp;
exports.watchArchivos = watchArchivos;

exports.default = parallel(css, javascript, imagenes, versionWebp, watchArchivos);