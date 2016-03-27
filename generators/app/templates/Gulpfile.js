/*jshint esversion: 6 */
'use strict';

const gulp = require('gulp'),
  watch = require('gulp-watch'),
  jshint = require('gulp-jshint'),
  browserify = require('gulp-browserify'),
  del = require('del'),
  runSequence = require('run-sequence'),
  spawn = require('child_process').spawn,
  _ = require('lodash');


var node;
const serverPath = 'server';
const paths = {
    server: {
        scripts: [
          '${serverPath}/**/*.js'
        ],
        json: ['${serverPath}/**/*.json']
    },
    dist: 'dist'
};
/**
 * $ gulp server
 * description: launch the server. If there's a server already running, kill it.
 */
gulp.task('server', function() {
  if (node) node.kill();
  node = spawn('node', ['./server/app.js'], {
    stdio: 'inherit'
  });
  node.on('close', function(code) {
    if (code === 8) {
      gulp.log('Error detected, waiting for changes...');
    }
  });
});

/**
 * $ gulp
 * description: start the development environment
 */
gulp.task('default', ['lint'],function() {
  gulp.run('server');

  gulp.watch(['./server/app.js', './**/*.js'], function() {
    gulp.run('server');
  });

  // Need to watch for sass changes too? Just add another watch call!
  // no more messing around with grunt-concurrent or the like. Gulp is
  // async by default.
});

// clean up if an error goes unhandled.
process.on('exit', function() {
  if (node) node.kill();
});

function onError(err) {
  console.log(err);
  this.emit('end');
}

gulp.task('lint', function() {
  gulp.src('./**/*.js')
    .pipe(jshint());
});

gulp.task('build', function(cb) {
    runSequence(
    [
        'clean:dist',
        'clean:tmp',
        'copy:server',
        'transpile:server'
    ],
    cb);

});

gulp.task('clean:dist', function(){
   del(['dist/!(.git*|.openshift|Procfile)**'], {dot: true});
 });

 gulp.task('copy:server', function() {
    return gulp.src([
        'package.json'
    ], {cwdbase: true})
        .pipe(gulp.dest(paths.dist));
});

gulp.task('transpile:server', function() {
    return gulp.src('./server/**/*.*', { base: './' })
        .pipe(gulp.dest(paths.dist));
});

gulp.task('clean:tmp', function(){
    del(['.tmp/**/*'], {dot: true});
});
