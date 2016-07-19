var gulp = require('gulp'), 
    autoprefixer = require('gulp-autoprefixer'),
    babel = require("gulp-babel"),
    browserSync = require('browser-sync'),
    concat = require('gulp-concat'),
    cssnano = require('gulp-cssnano'),
    gulpFilter = require('gulp-filter'),
    jshint = require('gulp-jshint'),
    notify = require("gulp-notify")
    postcss = require('gulp-postcss'),
    reporter = require('postcss-reporter'),
    rsync = require('rsyncwrapper').rsync,
    sass = require('gulp-ruby-sass')
    scss = require("postcss-scss"),
    sourcemaps = require('gulp-sourcemaps'),
    stylelint = require('stylelint'),
    uglify = require('gulp-uglifyjs');

var config = {
  sassPath: './resources/sass',
  jsPath: './resources/js',
   supportforDir: './node_modules/support-for/sass' ,
   normalizeDir: './node_modules/normalize-scss/sass' ,
  publicPath: './public'
};

gulp.task('server', function() {
  browserSync({
    server: {
      baseDir: config.publicPath
    }
  });
});

gulp.task('js', function() {
  return gulp.src([
      // './node_modules/@fdaciuk/ajax/dist/ajax.min.js',
      config.jsPath + '/app.js'
    ])
    .pipe(sourcemaps.init())
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(concat('app.js'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(config.publicPath))
});

gulp.task('css', function() { 
  // prevent reading sourcemaps to autoprefix them or make sourcemaps of sourcemaps
  var filter = gulpFilter(['*.css', '!*.map'], { restore: true });

  return gulp.src(config.sassPath + '/style.scss')
    .pipe(sass({
      loadPath: [
        './resources/sass',
        config.supportforDir,
        config.normalizeDir,
      ]}).on("error", notify.onError(function (error) {
        return "Error: " + error.message;
    })))
    .pipe(filter)
    .pipe(autoprefixer({ cascade: true}))
    .pipe(sourcemaps.init())
    .pipe(cssnano())
    .pipe(sourcemaps.write('.'))
    .pipe(filter.restore)
    .pipe(gulp.dest(config.publicPath));
});

gulp.task('lint:css', function() {
  return gulp.src(config.sassPath + '/**/*.scss')
    .pipe(postcss(
      [
        stylelint({ /* options */ }),
        reporter({ clearMessages: true })
      ],
      {
        syntax: scss
      }
    ));
});

 gulp.task('watch', function() {
  gulp.watch(config.publicPath + '/**/*.html', [browserSync.reload]); 
  gulp.watch(config.sassPath + '/**/*.scss', ['css', 'lint:css', browserSync.reload]); 
  gulp.watch(config.jsPath + '/**/*.js', ['js', browserSync.reload]); 
});

  gulp.task('default', ['server', 'watch']);
