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
let defaultTask = gulp.series(clean, builder.build.all);
defaultTask.displayName = 'default';
gulp.task(defaultTask);

let test = gulp.series(defaultTask, builder.test.src);
test.displayName = 'test';
gulp.task(test);
