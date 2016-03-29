/*jshint esversion: 6 */
'use strict';

const gulp = require('gulp'),
  git = require('gulp-git'),
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
  node = spawn('node', ['./server'], {
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

  gulp.watch(['./server/app.js', './server/**/*.js'], function() {
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

/// Run git add
// src is the file(s) to add (or ./*)
gulp.task('add', function(){
  git.exec({args : '--git-dir=./dist/.git --work-tree=./dist add .'}, function (err, stdout) {
    if (err) throw err;
  });
  /*return gulp.src('/dist/.')
    .pipe(git.add({args:'--git-dir=./dist/.git --work-tree=./dist'}, function (err) {
      if (err) throw err;
    }));*/
});

// Run git commit
// src are the files to commit (or ./*)
gulp.task('commit', function(){
  git.exec({args : '--git-dir=./dist/.git --work-tree=./dist commit -am "openshift commit"'}, function (err, stdout) {
    if (err) throw err;
  });
});

// Run git push
// remote is the remote repo
// branch is the remote branch to push to
//--git-dir=./dist/.git --work-tree=./dist
gulp.task('push', function(){
  git.exec({args : '--git-dir=./dist/.git --work-tree=./dist push', log:true}, function (err, stdout) {
    if (err) throw err;
  });
});

gulp.task('deploy-openshift', ['add','commit','push']);
