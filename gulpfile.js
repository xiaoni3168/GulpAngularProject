var gulp = require('gulp')
    connect = require('gulp-connect')
    COF = require('./app/config/cof.js');

gulp.task('js', function() {
    gulp.src('app/scripts/**/*.js')
        .pipe(connect.reload());
});

gulp.task('staticHtml', function() {
    gulp.src('app/*.html')
        .pipe(connect.reload());
});

gulp.task('html', function() {
    gulp.src('app/**/*.html')
        .pipe(connect.reload());
});

gulp.task('css', function() {
    gulp.src('app/styles/*.css')
        .pipe(connect.reload());
});

gulp.task('watch', function() {
    gulp.watch(['app/scripts/**/*.js'], ['js']);
    gulp.watch(['app/*.html'], ['staticHtml']);
    gulp.watch(['app/**/*.html', ['html']]);
    gulp.watch(['app/styles/*.css'], ['css']);
});

gulp.task('connect', function() {
    connect.server({
        root: 'app/',
        port: 31687,
        livereload: true,
        middleware: function() {
            return [(function () {
                var url = require('url');
                var proxy = require('proxy-middleware');
                var options = url.parse(COF.proxy_url);
                console.info('Rewrite ^api -> ' + COF.proxy_url);
                options.route = '/api';
                return proxy(options);
            })()];
        }
    });
});

gulp.task('default', ['watch'], function() {
    gulp.start(['connect']);
});
