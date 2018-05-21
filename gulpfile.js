var gulp = require('gulp'),
    pkg = require('./package.json');

var aws = require('gulp-awspublish')
    compress = require('gulp-yuicompressor'),
    rename = require('gulp-rename'),
    replace = require('gulp-replace'),
    squash = require('gulp-remove-empty-lines'),
    strip = require('gulp-strip-comments'),
    through2 = require('through2'),
    util = require('gulp-util');

// ---------------------

gulp.task('deploy', function() {
  var cacheLife, publisher, headers;
  if (!process.env.AWS_KEY || !process.env.AWS_SECRET) {
    throw 'AWS credentials are required!';
  }
  cacheLife = (1000 * 60 * 60); // 1 hour (* 24 * 365)
  headers = {
    'Cache-Control': 'max-age=' + cacheLife + ', public'
  };
  publisher = aws.create({
    'accessKeyId': process.env.AWS_KEY,
    'secretAccessKey': process.env.AWS_SECRET,
    'params': {
      'Bucket': 'keen-js',
      'Expires': new Date(Date.now() + cacheLife)
    }
  });

  return gulp.src([
      './dist/' + pkg.name + '.js',
      './dist/' + pkg.name + '.min.js'
    ])
    .pipe(rename(function(path) {
      path.dirname += '/';
      var name = pkg.name + '-' + pkg.version;
      path.basename = (path.basename.indexOf('min') > -1) ? name + '.min' : name;
    }))
    .pipe(aws.gzip())
    .pipe(publisher.publish(headers, { force: true }))
    .pipe(publisher.cache())
    .pipe(aws.reporter());

});
