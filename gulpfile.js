var gulp = require('gulp'),
    pkg = require('./package.json');

var aws = require('gulp-awspublish')
    rollup = require('rollup-stream'),
    commonjs = require('rollup-plugin-commonjs'),
    resolve = require('rollup-plugin-node-resolve'),
    babel = require('rollup-plugin-babel'),
    source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer'),
    connect = require('gulp-connect'),
    karma = require('karma').Server,
    mocha = require('gulp-mocha'),
    mochaPhantomJS = require('gulp-mocha-phantomjs'),
    rename = require('gulp-rename'),
    replace = require('gulp-replace'),
    uglify = require('gulp-uglify'),
    util = require('gulp-util');

gulp.task('default', ['build', 'connect', 'watch']);

function bundle(options) {
  return rollup({
    input: options.input,
    format: 'umd',
    name: options.name,
    plugins: [
      resolve(),
      commonjs({
        include: 'node_modules/**',
      }),
      babel(),
    ]
  })
  .pipe(source(pkg.name + '.js'))
  .pipe(buffer())
}

// Development tasks
// --------------------------------

gulp.task('build', ['build:rollup', 'build:minify', 'test:rollup']);

gulp.task('build:rollup', function(){
  return bundle({
    input: './lib/browser.js',
    name: pkg.name + '.js'
  })
    .pipe(replace('__VERSION__', pkg.version))
    .pipe(rename(pkg.name + '.js'))
    .pipe(gulp.dest('./dist/'));
});

gulp.task('build:minify', ['build:rollup'], function(){
  return gulp.src(['./dist/' + pkg.name + '.js'])
    .pipe(uglify())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('./dist/'));
});

gulp.task('connect', ['build'], function () {
  return connect.server({
      root: [ __dirname, 'test', 'test/unit', 'test/demo', 'test/vendor' ],
      port: 9001
    });
});

gulp.task('watch', ['build'], function() {
  gulp.watch([
    'lib/**/*.js',
    'gulpfile.js',
    'test/**/*.js'
  ], ['build', 'test:rollup']);
});

// Test tasks
// --------------------------------

gulp.task('test:unit', ['test:phantom', 'test:mocha']);

gulp.task('test:rollup', function(){
  return bundle({
    input: './test/unit/index.js',
    name: 'browserified-tests.js'
  })
    .pipe(replace('__VERSION__', pkg.version))
    .pipe(rename('browserified-tests.js'))
    .pipe(gulp.dest('./test/unit/build'));
});

gulp.task('test:mocha', ['test:rollup'], function () {
  return gulp.src('./test/unit/index.js', { read: false })
    .pipe(mocha({
      reporter: 'nyan',
      timeout: 300 * 1000
    }));
});

gulp.task('test:phantom', ['test:rollup'], function () {
  return gulp.src('./test/unit/index.html')
    .pipe(mochaPhantomJS({
      mocha: {
        reporter: 'nyan',
        timeout: 300 * 1000
      }
    }))
    .once('error', function () {
      process.exit(1);
    })
    .once('end', function () {
      process.exit();
    });
});

gulp.task('test:karma', ['build', 'test:rollup'], function (done){
  new karma({
    configFile: __dirname + '/config-karma.js',
    singleRun: true
  }, done).start();
});

gulp.task('test:sauce', ['build', 'test:rollup'], function(done){
  new karma({
    configFile: __dirname + '/config-sauce.js',
    singleRun: true
  }, done).start();
});

// ---------------------

gulp.task('deploy', ['build', 'test:mocha', 'test:karma'], function() {
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
