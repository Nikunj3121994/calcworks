var gulp = require('gulp');
var gutil = require('gulp-util');
var bower = require('bower');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var sh = require('shelljs');
var karma = require('gulp-karma');

var paths = {
  sass: ['./scss/**/*.scss']
};

var testFiles = [
  'test/spec/*.js'
];

// dit werkt niet goed, waarschijnlijk vanwege basepath
// ik run de karma testen direct vanuit cmd line of intellij
gulp.task('test', function() {
  // Be sure to return the stream
  return gulp.src(testFiles)
      .pipe(karma({
        configFile: 'test/karma.conf.js',
        basePath: '',
        action: 'run'
      }))
      .on('error', function(err) {
        // Make sure failed tests cause gulp to exit non-zero
        throw err;
      });
});


//gulp.task('test', function (done) {
//    karma.start({
//        configFile: __dirname + '/karma.conf.js',
//        singleRun: true
//    }, done);
//});

// ik weet niet goed wat ik met onderstaande task moet doen
// ik vermoed dat deze is om in de achtergrond asynchroon testen te runnen
//gulp.task('default', function() {
//  gulp.src(testFiles)
//      .pipe(karma({
//        configFile: 'karma.conf.js',
//        action: 'watch'
//      }));
//});

gulp.task('default', ['sass']);

gulp.task('sass', function(done) {
  gulp.src('./scss/ionic.app.scss')
    .pipe(sass())
    .pipe(gulp.dest('./www/css/'))
    .pipe(minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest('./www/css/'))
    .on('end', done);
});

gulp.task('watch', function() {
  gulp.watch(paths.sass, ['sass']);
});

gulp.task('install', ['git-check'], function() {
  return bower.commands.install()
    .on('log', function(data) {
      gutil.log('bower', gutil.colors.cyan(data.id), data.message);
    });
});

gulp.task('git-check', function(done) {
  if (!sh.which('git')) {
    console.log(
      '  ' + gutil.colors.red('Git is not installed.'),
      '\n  Git, the version control system, is required to download Ionic.',
      '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
      '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
    );
    process.exit(1);
  }
  done();
});
