const gulp = require('gulp'),
    gutil = require('gulp-util'),
    watch = require('gulp-watch'),
    babel = require('gulp-babel'),
    sourcemaps = require('gulp-sourcemaps'),
    rename = require('gulp-rename'),
    karma = require('gulp-karma'),
    shell = require('gulp-shell'),
    plumber = require('gulp-plumber'),
    eslint = require('gulp-eslint'),
    jscpd = require('gulp-jscpd'),
    embedTemplates = require('gulp-angular-embed-templates'),
    sass = require('gulp-sass'),
    spritesmith = require('gulp.spritesmith'),
    autoprefixer = require('gulp-autoprefixer'),
    iconfont = require('gulp-iconfont'),
    iconfontCss = require('gulp-iconfont-css'),
    fileInclude = require('gulp-file-include');

const paths = {
    jsLib: 'public/js/lib',
    jsLibAngular: 'public/js/lib/angular',
    jsLibCKEditor: 'public/js/lib/angular/ckeditor',
    jsLibPdf: 'public/js/lib/pdfjs',
    jsLibWebtrends: 'public/js/lib/webtrends',
    jsLibJquery: 'public/js/lib/jquery',
    cssLib: 'public/stylesheets/',
    scssMainFile: 'src/stylesheets/main.scss',
    scssCKEditor: 'src/stylesheets/custom/ckeditor-contents.scss',
    cssLibs: [
        'bower_components/angular-ui-grid/ui-grid.css',
        'bower_components/angular-ui-grid/ui-grid.woff',
        'bower_components/angular-ui-grid/ui-grid.ttf'],
    scssIeFile: 'src/stylesheets/ie9.scss',
    scssUiStyleGuideFile: 'src/stylesheets/ui-doc.scss',
    watch: {
        html: 'src/**/*.html',
        styles: ['src/stylesheets/**/*.*css', 'src/js/**/*.*css'],
        js: 'src/js/**/*.js',
        img: 'src/img/**',
        fonts: 'src/fonts/**'
    }
};

const babelOptions = {
    modules: 'amd',
    // getters and setters don't work in IE8
    blacklist: ['es5.properties.mutators'],
    // replace .catch -> ['catch'] for IE8
    optional: ['es3.memberExpressionLiterals', 'es3.propertyLiterals'],
    // we're not using any non standard templates
    nonStandard: false
};

const cqOptions = {
    protocol: 'http',
    crxdeServerPort: '4503',
    crxdeServerHost: 'localhost'
};

gulp.task('build:clean', function(cb) {
    const del = require('del');

    del(['./coverage', './public', './test'], cb);
});

gulp.task('style:copyLibs', function() {
    return gulp.src(paths.cssLibs)
        .pipe(gulp.dest(paths.cssLib));
});

gulp.task('style:iconfont', function() {
    const fontName = 'dhl';
    return gulp.src(['src/iconfont/*.svg'])
        .pipe(iconfontCss({
            fontName: fontName, //eslint-disable-line object-shorthand
            path: 'src/stylesheets/_icon-variables-template.scss',
            targetPath: '../../temp/_icon-variables.scss',
            fontPath: '../fonts/',
            cssClass: 'dhlicon'
        }))
        .pipe(iconfont({
            formats: ['ttf', 'eot', 'woff'],
            descent: 153, // vertical aligment 153 from 1024
            fontName: fontName //eslint-disable-line object-shorthand
        }))
        .pipe(gulp.dest('public/fonts/'));
});

function logSassErrorAndFail(error) {
    process.stderr.write(error.messageFormatted);
    process.exit(1);
}

gulp.task('style:transform', ['style:iconfont', 'sprite:flags'], function() {
    gulp.src([paths.scssCKEditor])
        .pipe(sass().on('error', logSassErrorAndFail))
        .pipe(autoprefixer())
        .pipe(gulp.dest(paths.jsLibCKEditor));

    return gulp
        .src([paths.scssMainFile, paths.scssIeFile, paths.scssUiStyleGuideFile])
        .pipe(sass().on('error', logSassErrorAndFail))
        .pipe(autoprefixer())
        .pipe(gulp.dest(paths.cssLib));
});

gulp.task('style:buildStyleGuide', function() {
    return gulp
        .src(['src/ui-style-guide/*.html'])
        .pipe(fileInclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(gulp.dest('public'));
});

gulp.task('style:build', ['style:copyLibs', 'style:transform', 'style:buildStyleGuide']);

gulp.task('html:build', ['js:build']);

gulp.task('img:build', function() {
    gulp.src([paths.watch.img])
        .pipe(gulp.dest('public/img'));
});

gulp.task('fonts:build', function() {
    gulp.src([paths.watch.fonts])
        .pipe(gulp.dest('public/fonts'));
});

gulp.task('js:checkConfigFiles', function() {
    return gulp.src(['gulpfile.js', 'src/config/*.js'])
        .pipe(eslint({
            rules: {
                'no-console': 0
            },
            env: {
                node: true
            }
        }))
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});

gulp.task('js:codeQualityCheck', function() {
    return gulp.src(['src/js/**/*.js', '!src/js/**/*.test.js'])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});

gulp.task('js:codeStyleCheck', function() {
    // TODO: add jscs
});

// TODO: reduce min-lines, min-tokens values
gulp.task('js:checkForCopyPaste', function() {
    return gulp.src(['src/js/**/*.js', '!src/js/**/*.test.js'])
        .pipe(jscpd({
            'min-lines': 20,
            'min-tokens': 20,
            languages: ['javascript'],
            verbose: true
        }));
});

gulp.task('js:codeCheck', ['js:checkConfigFiles', 'js:codeQualityCheck', 'js:codeStyleCheck', 'js:checkForCopyPaste']);

gulp.task('js:copyLibs', function() {
    gulp.src(['node_modules/jquery/dist/jquery.js'], {buffer: false})
        .pipe(gulp.dest(paths.jsLibJquery));

    gulp.src(['node_modules/pdfjs-dist/build/pdf.js',
        'node_modules/pdfjs-dist/build/pdf.combined.js'], {buffer: false})
        .pipe(gulp.dest(paths.jsLibPdf));

    gulp.src([
        'node_modules/requirejs/require.js',
        'node_modules/es5-shim/es5-shim.min.js',
        'node_modules/es5-shim/es5-sham.min.js'], {buffer: false})
        .pipe(gulp.dest(paths.jsLib));

    gulp.src('node_modules/babel-core/browser-polyfill.js', {buffer: false})
        .pipe(rename('babel-es6-polyfill.js'))
        .pipe(gulp.dest(paths.jsLib));

    gulp.src([
        'node_modules/angular/angular.js',
        'node_modules/angular-cookies/angular-cookies.js',
        'node_modules/angular-local-storage/dist/angular-local-storage.js',
        'node_modules/ng-dialog/js/ngDialog.js',
        'node_modules/angular-mocks/angular-mocks.js',
        'node_modules/ngmodeloptions/ngModelOptions.js',
        'bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
        'bower_components/angular-ui-grid/ui-grid.js',
        'bower_components/ionrangeslider/js/ion.rangeSlider.min.js',
        'bower_components/visualcaptcha.angular/visualcaptcha.angular.js',
        'bower_components/angular-ui-mask/dist/mask.js',
        'bower_components/ng-ckeditor/ng-ckeditor.js'
    ], {buffer: false})
        .pipe(gulp.dest(paths.jsLibAngular));

    gulp.src([
        'bower_components/ckeditor/**/*',
        'config/ckeditor-config.js'
    ], {buffer: false})
        .pipe(gulp.dest(paths.jsLibCKEditor));

    gulp.src(['js_libs/webtrends/webtrends.js'], {buffer: false})
        .pipe(gulp.dest(paths.jsLibWebtrends));

    gulp.src(['js_libs/ie8-custom-polyfills.js'], {buffer: false})
        .pipe(gulp.dest(paths.jsLib));

    // babel transform and move files 'main.js', 'module-registry.js'
    return gulp.src(['src/js/*.js', '!jasmine-mock-component.js'])
        .pipe(babel())
        .pipe(gulp.dest('public/js'));
});

// return stream so that subsequent task 'js:unitTest' can know when this task finished
gulp.task('js:transform', function() {
    // TODO: **********************************
    // TODO:  remove old test before transform (otherwise old unexisting test fail build)
    // TODO: **********************************
    return gulp.src(['src/js/**/*.js', '!src/js/*.js', '!src/js/**/*.test.js', '!src/samples/**/*.js'])
        // TODO: remove skipErrors
        .pipe(embedTemplates({skipErrors: true}))
        .pipe(sourcemaps.init())
        .pipe(plumber()) // need to display babel errors
        .pipe(babel(babelOptions))
        // TODO: uncomment
        .on('error', function(err) {
            // Make sure es6,7 syntax errors cause gulp to exit non-zero
            throw err;
        })
        .pipe(plumber.stop())
        // TODO: emit error if err count > 0
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('public/js'));
});

gulp.task('js:assemble', ['js:copyLibs', 'js:transform']);

// return stream so that subsequent task 'js:unitTest' can know when this task finished
gulp.task('js:transformTests', function() {
    return gulp.src(['src/js/**/*.test.js', 'src/samples/**/*.js'])
        .pipe(babel(babelOptions))
        .pipe(gulp.dest('test'));
});

// TODO: should wait for copy libs
gulp.task('js:unitTest', ['js:assemble', 'js:transformTests'], function() {
    // 'foobar' is special gulp path to capture nothing
    return gulp.src('./foobar')
        .pipe(karma({
            configFile: 'config/karma.conf.js',
            action: 'run'
        }))
        .on('error', function(/*err*/) {
            // Make sure failed tests cause gulp to exit non-zero
    //        throw err;
        });
});

gulp.task('js:unitTestDebug', ['js:assemble', 'js:transformTests'], function() {
    // 'foobar' is special gulp path to capture nothing
    return gulp.src('./foobar')
        .pipe(karma({
            configFile: 'config/karma.debug.conf.js',
            action: 'watch'
        }))
        .on('error', function(/*err*/) {
            // Make sure failed tests cause gulp to exit non-zero
    //        throw err;
        });
});

gulp.task('js:testCodeCheck', function() {
    return gulp.src(['src/js/**/*.test.js'])
        // the same rules as for general code, but allow using some globals
        .pipe(eslint({
            rules: {
                'new-cap': 0 // need to instantiate services (which are start from lower case)
            },
            env: {
                jasmine: true
            },
            globals: {
                module: true,
                inject: true,
                angular: true
            }
        }))
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});

gulp.task('js:endToEndTest', ['js:assemble'], function() {
    // TODO: check if they needed
});

gulp.task('js:test', ['js:unitTest', 'js:testCodeCheck', 'js:endToEndTest']);

gulp.task('js:build', ['js:codeCheck', 'js:assemble', 'js:test']);

gulp.task('default', function() {
    gulp.start('style:build', 'img:build', 'fonts:build', 'js:build');
});


// WATCH TASKS


gulp.task('cq:deployToCRXDEServerWithDebug', function(cb) {
    cb();
    return gulp.src('.', {read: false})
        .pipe(shell([['cmd /C "set DEBUG=* && crxde-pipe <%= file.path %>/public --server ',
            cqOptions.protocol, '://',
            cqOptions.crxdeServerHost, ':',
            cqOptions.crxdeServerPort, ' --interval 500"'].join('')]));
});

gulp.task('cq:deployToCRXDEServer', function(cb) {
    cb();
    return gulp.src('.', {read: false})
        .pipe(shell([['crxde-pipe <%= file.path %>/public --server ',
            cqOptions.protocol, '://',
            cqOptions.crxdeServerHost, ':',
            cqOptions.crxdeServerPort, ' --interval 500'].join('')]));
});

gulp.task('watch', ['cq:deployToCRXDEServer', 'default'], function() {
    // patch further gulp.src calls in scope 'watch' task
    const gulpSrc = gulp.src;

    gulp.src = function() {
        return gulpSrc.apply(gulp, arguments)
            .pipe(plumber(function(error) {
                // Output an error message
                gutil.log(gutil.colors.red('Error (' + error.plugin + '): ') + error.message);
                // emit the end event, to properly end the task
                this.emit('end');
            })
        );
    };

    const runSequence = require('run-sequence');

    watch(paths.watch.styles, function(event, cb) {
        console.log(event);
        console.log(cb);

        runSequence('style:build');
    });

    watch(paths.watch.html, function(event, cb) {
        console.log(event);
        console.log(cb);

        runSequence('html:build');
    });

    watch(paths.watch.js, function(event, cb) {
        console.log(event);
        console.log(cb);

        runSequence('js:build');
    });

    watch(paths.watch.img, function(event, cb) {
        console.log(event);
        console.log(cb);

        runSequence('img:build');
    });
});

gulp.task('sprite:flags:32', flagsSpriteTask('32'));
gulp.task('sprite:flags:24', flagsSpriteTask('24'));
gulp.task('sprite:flags', ['sprite:flags:32', 'sprite:flags:24']);


function flagsSpriteTask(type) {
    return function() {
        const spriteData = gulp
            .src('src/img-sprite/flags-iso/' + type + '/*.*')
            .pipe(spritesmith({
                cssSpritesheetName: type,
                imgName: 'flags.' + type + '.png',
                cssName: '_flags-variables.' + type + '.scss',
                padding: 10,
                cssTemplate: 'src/img-sprite/flags-iso/flags.template.mustache'
            }));

        spriteData.img.pipe(gulp.dest('public/img'));
        spriteData.css.pipe(gulp.dest('temp/'));

        return spriteData;
    };
}
