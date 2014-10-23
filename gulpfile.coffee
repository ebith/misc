gulp = require 'gulp'
changed = require 'gulp-changed'
coffee = require 'gulp-coffee'
plumber = require 'gulp-plumber'

gulp.task 'greasemonkey', ->
  gulp.src 'greasemonkey/src/*.coffee'
    .pipe changed 'greasemonkey'
    .pipe do plumber
    .pipe do coffee
    .pipe gulp.dest 'greasemonkey'

gulp.task 'vimperator', ->
  gulp.src 'vimperator/src/*.coffee'
    .pipe changed 'vimperator'
    .pipe do plumber
    .pipe do coffee
    .pipe gulp.dest 'vimperator'

gulp.task 'watch', ->
  gulp.watch 'greasemonkey/src/*.coffee', ['greasemonkey']
  gulp.watch 'vimperator/src/*.coffee', ['vimperator']

gulp.task 'build', ['greasemonkey', 'vimperator']
gulp.task 'default', ['build', 'watch']
