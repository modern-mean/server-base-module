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


//gulp build
let build = gulp.series(clean, builder.build.all);
build.displayName = 'build';
gulp.task(build);

//gulp test
let test = gulp.series(builder.test.src);
test.displayName = 'test';
gulp.task(test);

//gulp
let defaultTask = gulp.series(build);
defaultTask.displayName = 'default';
gulp.task(defaultTask);
