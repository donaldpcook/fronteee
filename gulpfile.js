'use strict';

var gulp = require('gulp'),
    notify = require('gulp-notify'),
    browserSync = require('browser-sync'),
    connect = require('connect'),
    serveStatic = require('serve-static'),
    path = require('path'),
    browserify = require('browserify'),
    source = require('vinyl-source-stream'),
    sass = require('gulp-ruby-sass'),
    prefix = require('gulp-autoprefixer');

gulp.task('move', function() {
  gulp.src('./app/index.html')
    .pipe(gulp.dest('dest'))
    .pipe(browserSync.reload({stream: true}));
});

gulp.task('sass', function() {
  gulp.src('app/scss/app.scss')
    .pipe(sass())
    .pipe(prefix("last 1 version", "> 1%", "ie 8", "ie 7"))
    .on('error', handleErrors)
    .pipe(gulp.dest('dest/css'))
    .pipe(browserSync.reload({stream: true}));
});

gulp.task('browserify', function() {
  return browserify({
    entries: ['./app/js/app.js'],
    debug: true
  })
  .bundle()
  .on('error', handleErrors)
  .pipe(source('app.js'))
  .pipe(gulp.dest('./dest/js/'))
  .pipe(browserSync.reload({stream: true, once: true}));
});

gulp.task('serve', function() {
  connect()
    .use(connectLivereload())
    .use(serveStatic('dest'))
    .listen(3000);
});

gulp.task('browser-sync', function() {
    browserSync.init(null, {
        server: {
            baseDir: "dest"
        }
    });
});

gulp.task('default', ['move', 'sass', 'browserify', 'browser-sync'], function() {
  gulp.watch('app/index.html', ['move']);
  gulp.watch('app/scss/**', ['sass']);
  gulp.watch('app/js/**/*.js', ['browserify']);
});

function handleErrors() {
  var args = Array.prototype.slice.call(arguments);

  notify.onError({
    title: 'Compile Error',
    message: '<%= error.message %>'
  }).apply(this, args);

  this.emit('end');
}
