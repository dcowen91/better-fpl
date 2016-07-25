'use strict'

// Dependencies
const gulp = require('gulp')
const sass = require('gulp-sass')
const concat = require('gulp-concat')
const plumber = require('gulp-plumber')
const notify = require('gulp-notify')
const babel = require('gulp-babel')
const pug = require('gulp-pug')
const webpack = require('webpack-stream')
const webpackConfig = require('./webpack.config.js')

// Error handler
function onError(err) {
  notify().write(err)
  this.emit('end')
}

// Sass task
gulp.task('sass', () => {
  return gulp
    .src('assets/sass/style.sass')
    .pipe(plumber({errorHandler: onError}))
    .pipe(sass())
    .pipe(gulp.dest('assets/dist/chrome'))
    .pipe(gulp.dest('assets/dist/firefox'))
})

// Scripts task
gulp.task('scripts', () => {
  return gulp
    .src('./assets/js/scripts.js')
    .pipe(plumber({errorHandler: onError}))
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(webpack(webpackConfig))
    .pipe(gulp.dest('assets/dist/chrome'))
    .pipe(gulp.dest('assets/dist/firefox'))
})

// Pug task
gulp.task('pug', () => {
  return gulp.src('./assets/views/*.pug')
    .pipe(plumber({errorHandler: onError}))
    .pipe(pug({
      pretty: true
    }))
    .pipe(gulp.dest('assets/dist/chrome'))
    .pipe(gulp.dest('assets/dist/firefox'))
})

// Watch task
gulp.task('watch', () => {
  gulp.watch('assets/js/**/*.js', {cwd: '.'}, ['scripts'])
  gulp.watch('assets/sass/**/*.sass', {cwd: '.'}, ['sass'])
  gulp.watch('assets/views/**/*.pug', {cwd: '.'}, ['pug'])
})

// Default task
gulp.task('default', ['sass', 'scripts', 'pug', 'watch'])