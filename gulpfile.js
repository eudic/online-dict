var gulp = require('gulp');
var concat = require('gulp-concat');
var babel = require('gulp-babel');
var glob = require('glob');
var terser = require('gulp-terser');
var path = require('path');

function buildAll(done) {
    const clickJsList = glob.sync(path.join(__dirname, './src/dicts/**/click.js'));
    const baseDictJs = path.join(__dirname, './src/dicts/base/basedict.js');

    const tasks = clickJsList.map((clickJs) => {
        function patchJs() {
            const destFolderList = clickJs.split('/');
            destFolderList.pop();
            const destFolder = destFolderList.join('/');

            return gulp.src([clickJs, baseDictJs])
                .pipe(concat('dict.js'))
                .pipe(babel({
                    presets: ['@babel/env']
                }))
                .pipe(terser())
                .pipe(gulp.dest(destFolder));
        }
        patchJs.displayName = clickJs;
        return patchJs;
    });
    return gulp.series(...tasks, (seriesDone) => {
        seriesDone();
        done();
    })();
}

gulp.task('default', gulp.series(buildAll));