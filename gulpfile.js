const gulp = require('gulp');
const ts = require('gulp-typescript');
const merge = require('merge2');
const babel = require('gulp-babel');

const tsProject = ts.createProject({
  declaration: true,
  noExternalResolve: false,
  experimentalAsyncFunctions: true,
  target: 'ES6',
});

function swallowError(error) {
  // If you want details of the error in the console
  console.log(error.toString());

  this.emit('end');
}

gulp.task('babel', () =>
  gulp.src('api_/**/*.js')
    .pipe(babel({
      plugins: ['add-module-exports'],
      presets: ['es2015', 'stage-0'],
    }))
    .on('error', swallowError)
    .pipe(gulp.dest('api'))
);

gulp.task('typescript', () => {
  const tsResult = gulp.src(['api_/**/*.ts', 'typings/index.d.ts'])
    .pipe(ts(tsProject));

  // Merge the two output streams, so this task is finished when the IO of both operations are done.
  return merge([
    tsResult.dts.pipe(gulp.dest('tmp/definitions')),
    tsResult.js.pipe(
      babel({
        plugins: ['add-module-exports'],
        presets: ['es2015', 'stage-0'],
      })
    )
    .pipe(gulp.dest('api')),
  ]);
});

gulp.task('watch', ['typescript', 'babel'], () => {
  gulp.watch('api_/**/*.ts', ['typescript']);
  gulp.watch('api_/**/*.js', ['babel']);
});
