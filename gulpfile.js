'use strict';

var gulp = require('gulp'),
    connect = require('connect'),
    serveStatic = require('serve-static'),
    path = require('path'),
    connectLivereload = require('connect-livereload'),
    tinylr = require('tiny-lr'),
    sass = require('gulp-ruby-sass');

// standard LiveReload port
var port = 35729;

gulp.task('move', function() {
  gulp.src('./app/index.html')
    .pipe(gulp.dest('dest'));
});

gulp.task('sass', function() {
  gulp.src('app/scss/app.scss')
    // TODO: get sourcemaps working
    .pipe(sass({sourcemap: 'none', sourcemapPath: '/scss/'}))
    .on('error', function(err) {
      console.log(err.message);
    })
    .pipe(gulp.dest('dest/css'));
});

gulp.task('lr', function() {
  tinylr().listen(port);
});

gulp.task('serve', function() {
  connect()
    .use(connectLivereload())
    .use(serveStatic('dest'))
    .listen(3000);
});

gulp.task('default', ['move', 'sass', 'lr', 'serve'], function() {
  gulp.watch('app/index.html', ['move']);
  gulp.watch('app/scss/**', ['sass']);

  gulp.watch('dest/**/*.html', function(event) {
    tinylr.changed(path.relative(__dirname, event.path));
  });

  gulp.watch('dest/**/*.css', function(event) {
    tinylr.changed(path.relative(__dirname, event.path));
  });
});
