gulp = require 'gulp'
changed = require 'gulp-changed'
coffee = require 'gulp-coffee'

gulp.task 'greasemonkey', ->
  gulp.src 'greasemonkey/src/*.coffee'
    .pipe changed 'greasemonkey'
    .pipe do coffee
    .pipe gulp.dest 'greasemonkey'

gulp.task 'watch', ->
  gulp.watch 'greasemonkey/src/*.coffee', ['greasemonkey']

gulp.task 'build', ['greasemonkey']
gulp.task 'default', ['build', 'watch']
