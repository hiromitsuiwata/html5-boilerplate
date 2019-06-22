const gulp = require('gulp');
const del = require('del');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const header = require('gulp-header');
const sourcemaps = require('gulp-sourcemaps');
const cleanCSS = require('gulp-clean-css');

// コメントを消した後で再度付与するライセンスコメント. UglifyJSで一部のコメントを残すこともできるが正規表現での記載が必要なので後から付与することとした
const banner = [
  '/** ',
  ' * Library xxx',
  ' * Author: xxx',
  ' * License: xxx',
  ' */',
  ''
].join('\n');

// 出力ディレクトリを一旦削除
gulp.task('clean', function () {
  return del('dest/**', {
    force: true
  });
});

gulp.task('minify-js', function () {
  return gulp.src(['js/*.js'])
    .pipe(sourcemaps.init())
    .pipe(babel({
      presets: ['@babel/preset-env']
    }))
    .pipe(uglify({
      compress: {
        drop_console: true // console出力を削除
      }
    }))
    .pipe(header(banner))
    .pipe(sourcemaps.write('../maps'))
    .pipe(gulp.dest('dest/js/'));
});

gulp.task('minify-css', function () {
  return gulp.src('css/*.css')
    .pipe(sourcemaps.init())
    .pipe(cleanCSS({})) // specialCommentという/*!から始まるコメントは残る
    .pipe(header(banner))
    .pipe(sourcemaps.write('../maps'))
    .pipe(gulp.dest('dest/css/'));
});

gulp.task('default', gulp.series('clean', gulp.parallel('minify-js', 'minify-css')));
