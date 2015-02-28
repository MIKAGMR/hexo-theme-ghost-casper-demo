'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var pngquant = require('imagemin-pngquant');

var htmlMinifierOptions = {
  removeComments: true,
  collapseWhitespace: true,
  collapseBooleanAttributes: true,
  removeScriptTypeAttributes: true,
  removeStyleLinkTypeAttributes: true,
  removeOptionalTags: true,
  minifyJS: true,
  minifyCSS: true
};

gulp.task('useref', function(){
  var assets = $.useref.assets({
    searchPath: 'public'
  });

  return gulp.src('public/**/*.html')
  	.pipe($.size({showFiles:true}))
    .pipe(assets)
    .pipe($.if('*.css', $.minifyCss()))
	.pipe($.size({showFiles:true}))
    .pipe($.if('*.js', $.uglify()))
    .pipe($.size({showFiles:true}))
	.pipe($.rev())
    .pipe($.size({showFiles:true}))
	.pipe(assets.restore())
    .pipe($.useref())
    .pipe($.revReplace({
      prefix: '/'
    }))
    .pipe($.if('*.html', $.htmlMinifier(htmlMinifierOptions)))
    .pipe(gulp.dest('public'));
});
gulp.task('images', function() {
  return gulp.src('public/**/*.{jpg,jpeg,png,gif,svg}')
    .pipe($.size({showFiles:true}))
    .pipe($.imagemin({
      optimizationLevel: 7,
      progessive: true,
      interlaced: true,
      svgoPlugins: [{removeViewBox: false}],
      use: [pngquant({quality: '75-90', speed: 2})]
    }))
    .pipe($.size({showFiles:true}))
    .pipe(gulp.dest('public'));

});

gulp.task('default', ['useref'], function() {
    //gulp.start('images');
});
gulp.task('img', function() {
    gulp.start('images');
});
