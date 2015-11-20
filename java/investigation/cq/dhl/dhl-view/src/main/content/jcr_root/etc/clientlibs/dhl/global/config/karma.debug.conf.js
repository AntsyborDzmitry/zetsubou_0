module.exports = function(config) {
    config.set({
        basePath: './../',

        files: [
            // include this files in browsers using <script> tag (there is no need to watch lib files)
            // uncomment for IE8 browser
            // {pattern: 'public/js/lib/es5-shim.min.js', included: true, watched: false},
            // {pattern: 'public/js/lib/es5-sham.min.js', included: true, watched: false},
            {pattern: 'public/js/lib/babel-es6-polyfill.js', included: true, watched: false},
            {pattern: 'public/js/module-registry.js', included: true, watched: false},
            {pattern: 'public/js/jasmine-mock-component.js', included: true, watched: false},

            // all other libraries should be included by requirejs
            {pattern: 'public/js/lib/**/*.js', included: false, watched: false},

            // code to test and tests
            {pattern: 'public/js/**/*.js', included: false, watched: true},
            {pattern: 'test/**/*.js', included: false, watched: true},

            // this file do the main job: configures require.js and launches karma with (*.test.js files)
            {pattern: 'config/require.test.config.js', included: true, watched: false}
        ],

        preprocessors: {
          'public/js/!(lib)/**/*.js': []
        },

        reporters: ['progress'],

        coverageReporter: {
            reporters: [
                {type: 'text-summary'},
                {type: 'html', dir: 'coverage/'}
            ],
            check: {
                global: {
                    statements: 77,
                    branches: 60,
                    functions: 80,
                    lines: 85
                }
            }
        },

        exclude: [
        ],

        autoWatch: true,

        frameworks: ['jasmine', 'requirejs'],

        browsers: ['PhantomJS'],

        customLaunchers: {
            'PhantomJS_custom': {
                base: 'PhantomJS',
                options: {
                    windowName: 'my-window',
                    settings: {
                        webSecurityEnabled: false
                    }
                },
                flags: ['--load-images=true'],
                // open localhost:9000 in chrome and be happy
                debug: true
            }
        },

        plugins: [
            'karma-jasmine',
            'karma-junit-reporter',
            'karma-phantomjs-launcher',
            'karma-requirejs'
        ],

        junitReporter: {
            outputFile: 'unit.xml',
            suite: 'unit'
        }
    });
};
