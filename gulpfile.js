'use strict';

var gulp = require('gulp'),
  runSequence = require('run-sequence'),
  del = require('del'),
  size = require('gulp-size'),
  rollup = require('rollup').rollup,
  uglify = require('rollup-plugin-uglify'),
  eslint = require('rollup-plugin-eslint'),
  strip = require('rollup-plugin-strip'),
  json = require('rollup-plugin-json'),
  babel = require('rollup-plugin-babel'),
  nodeResolve = require('rollup-plugin-node-resolve'),
  commonjs = require('rollup-plugin-commonjs');

var cache;

var rollupConfig = {
  entry: './src/index.js',
  plugins: [
    json(),
    babel({
      babelrc: false,
      // presets: ['es2015-rollup'],
      exclude: ['node_modules/**', '*.json']
    }),
    nodeResolve({ jsnext: true }),
    commonjs()
  ]
};

gulp.task('_rollup-build', function() {
  var rConfig = Object.assign({}, rollupConfig);
  rConfig.plugins.push(
    uglify(),
    eslint(),
    strip({
      debugger: true,
      functions: ['console.log', 'assert.*', 'debug', 'alert'],
      sourceMap: false
    })
  );
  return rollup(rConfig).then(function(bundle) {
    return bundle.write({
      format: 'iife',
      dest: './dist/turntable.min.js',
      moduleName: 'turntableInit'
    });
  });
});

gulp.task('_rollup', function() {
  var rConfig = Object.assign({}, rollupConfig);
  rConfig.cache = cache;
  return rollup(rConfig).then(function(bundle) {
    cache = bundle;
    return bundle.write({
      format: 'iife',
      sourceMap: true,
      dest: './dist/turntable.js',
      moduleName: 'turntableInit'
    });
  });
});

gulp.task('_clean-lib', function() {
  return del(['./dist/**/*']);
});

gulp.task('_build-size', function() {
  return gulp.src('./dist/**/*')
    .pipe(size({ title: 'Build', gzip: true }));
});

gulp.task('build', function(done) {
  runSequence('_clean-lib', '_rollup', done);
});

gulp.task('build:prod', function(done) {
  runSequence('_clean-lib', '_rollup-build', '_build-size', done);
});

gulp.task('watch', ['_clean-lib', '_rollup'], function(done) {
  gulp.watch('{src,plugin,test,lib}/**/*', ['_rollup']);
  done();
});
