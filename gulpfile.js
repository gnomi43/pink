const   gulp = require('gulp'),
        sass = require('gulp-sass'),
        browserSync = require('browser-sync').create(),
        cleanCSS = require('gulp-clean-css'),
        imagemin = require('gulp-imagemin'),
        imageminGuetzli = require('imagemin-guetzli'),
        imageminMozjpeg = require('imagemin-mozjpeg'),
        imageminPngquant = require('imagemin-pngquant'),
        autoprefixer = require('gulp-autoprefixer');

function style () {
    return gulp.src('./source/scss/**/*.scss')
    .pipe(sass())
    .pipe(cleanCSS())
    .pipe(gulp.dest('./source/css'))

    .pipe(browserSync.stream());
}

// Оптимизация JPG //
gulp.task('guetzli', () =>
    gulp.src('./source/img/*.jpg')
        .pipe(imagemin([ imageminGuetzli({quality: 85}) ]))
        .pipe(gulp.dest('dist-guetzli'))
);

gulp.task('mozjpeg', () =>
    gulp.src('./source/img/*.jpg')
        .pipe(imagemin([
             imageminMozjpeg({
                 progressive: true,
                 quality: 80,
                 sample: ['2x1']
                }) 
            ]))
        .pipe(gulp.dest('dist'))
);
// комбинированая оптимизация фотографий 
gulp.task('jpegcombo', () =>
    gulp.src('./source/img/*.jpg')
        .pipe(imagemin([ imageminGuetzli({quality: 95}) ]))
        .pipe(imagemin([
             imageminMozjpeg({
                 progressive: true,
                 quality: 85,
                 sample: ['2x1']
                }) 
            ]))
        .pipe(gulp.dest('./source/dist'))
);
// /Оптимизация JPG //

// Оптимизация PNG //
gulp.task('png-min', () =>
    gulp.src('./source/img/*.png')
        .pipe(imagemin([
            imageminPngquant() 
            ]))
        .pipe(gulp.dest('./source/dist'))
);
// /Оптимизация PNG //
gulp.task('build', gulp.series(
    gulp.parallel('jpegcombo', 'png-min')
));

function watch () {
    browserSync.init({
        server: {
            baseDir: './'
        }
    });
    gulp.watch('./source/scss/**/*.scss', style);
    gulp.watch('./*.html').on('change', browserSync.reload);
}

exports.style = style;
exports.watch = watch;