'use strict';

import gulp from 'gulp';
import * as builder from '@modern-mean/build-gulp';
import del from 'del';


function clean() {
  return del([
    './dist'
  ]);
}
clean.displayName = 'clean';
gulp.task(clean);


//Gulp Default
let build = gulp.series(clean, builder.build.all);
build.displayName = 'build';
gulp.task(build);

let test = gulp.series(builder.test.src);
test.displayName = 'test';
gulp.task(test);

//Gulp Default
let defaultTask = gulp.series(clean, builder.build.all);
defaultTask.displayName = 'default';
gulp.task(defaultTask);

gulp.task('pre-commit', build);
