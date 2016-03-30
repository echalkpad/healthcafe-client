var gulp = require('gulp');
var gutil = require('gulp-util');
var bower = require('bower');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var sh = require('shelljs');
var uglify = require('gulp-uglify');

var paths = {
  sass: ['./scss/**/*.scss']
};

gulp.task('default', ['js-app-minify', 'js-lib-minify', 'css-minify']);

gulp.task('sass', function(done) {
  gulp.src('./scss/ionic.app.scss')
    .pipe(sass())
    .on('error', sass.logError)
    .pipe(gulp.dest('./www/css/'))
    .pipe(minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest('./www/css/'))
    .on('end', done);
});

gulp.task('js-app-minify', function(){
  // Minify app libraries
	return gulp.src(['www/app/app.module.js', 'www/app/app.config.js', 'www/app/app.routes.js', 'www/app/app.controller.js', 'www/app/**/*.js'])
	    .pipe(concat('app.js'))
	    .pipe(gulp.dest('www/dist'))
      .pipe(rename({ extname: '.min.js' }))
	    .pipe(uglify())
    	.pipe(gulp.dest('www/dist'));
});

gulp.task('js-lib-minify', function(){
	// Minify javascript libraries
	return gulp.src([
	      'www/lib/ionic/js/ionic.bundle.js',
	      'www/lib/angular-messages/angular-messages.js',
	      'www/lib/Angular.uuid2/dist/angular-uuid2.js',
	      'www/lib/angular-timeline/dist/angular-timeline.js',
	      'www/lib/indexeddbshim.min.js',
	      'www/lib/angular-indexedDB/angular-indexed-db.js',

	      'www/lib/d3/d3.js',
	      'www/lib/d3-tip/index.js',
	      'www/lib/plottable/plottable.js',
	      'www/lib/moment/moment.js',
	      'www/lib/omh-web-visualizations/dist/omh-web-visualizations-all.js',
      ])
	    .pipe(concat('lib.js'))
	    .pipe(gulp.dest('www/dist'))
      .pipe(rename({ extname: '.min.js' }))
	    .pipe(uglify())
    	.pipe(gulp.dest('www/dist'));

});

gulp.task('css-minify', function(done) {
  gulp.src([
      'www/lib/ionic/css/ionic.css',
      'www/lib/angular-timeline/dist/angular-timeline.css',
      'www/lib/plottable/plottable.css',
      'www/lib/omh-web-visualizations/dist/omh-web-visualizations-all.css',
      'www/assets/css/style.css',
     ])
    .pipe(concat('style.css'))
    .pipe(gulp.dest('www/dist'))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(gulp.dest('www/dist'))
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
