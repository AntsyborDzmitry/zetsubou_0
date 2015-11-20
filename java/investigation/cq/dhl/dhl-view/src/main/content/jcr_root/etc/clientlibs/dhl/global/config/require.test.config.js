/*global __karma__, requirejs, require, define, dhl, console*/
/*eslint no-underscore-dangle: 0*/

var srcFileMapping = {};
var testFiles = [];

// files matches by karma.conf.js 'files' section
Object.keys(__karma__.files).forEach(function(file) {
    // remove leading '/base/' and '.js' file extension
    file = file.substring(6, file.length - 3);

    if (/test$/.test(file)) {
        testFiles.push(file);
    } else {
        // convert file name like 'public/js/services/navigation-service' to key: value pair
        // 'services/navigation-service': 'public/js/services/navigation-service',
        // 'test/services/navigation-service': 'public/js/services/navigation-service',
        if (file.startsWith('public/js')) {
            var key = file.substring(10);
            srcFileMapping[key] = srcFileMapping['test/' + key] = file;
        }
    }
});

requirejs.config({
    baseUrl: '/base',

    paths: Object.assign(srcFileMapping, {
        jquery: 'public/js/lib/jquery/jquery',
        pdfjs: 'public/js/lib/pdfjs/pdf.combined',
        angular: 'public/js/lib/angular/angular',
        'ui.mask': 'public/js/lib/angular/mask',
        LocalStorageModule: 'public/js/lib/angular/angular-local-storage',
        'ui.bootstrap': 'public/js/lib/angular/ui-bootstrap-tpls',
        ngCookies: 'public/js/lib/angular/angular-cookies',
        ngDialog: 'public/js/lib/angular/ngDialog',
        modelOptions: 'public/js/lib/angular/ngModelOptions',
        'visualCaptcha': 'public/js/lib/angular/visualcaptcha.angular',
        ionrangeslider: 'public/js/lib/angular/ion.rangeSlider.min',
        ngCkeditor: 'public/js/lib/angular/ng-ckeditor',
        ckeditor: 'public/js/lib/angular/ckeditor/ckeditor',
        angularMocks: 'public/js/lib/angular/angular-mocks' // TODO: check
    }),

    shim: {
        jquery: {
            exports: '$'
        },
        pdfjs: {
            exports: 'pdfjs'
        },
        angular: {
            deps: ['jquery'],
            exports: 'angular'
        },
        'ui.mask': {
            deps: ['angular']
        },
        'ui.bootstrap': {
            deps: ['angular']
        },
        'visualCaptcha': {
            deps: ['angular']
        },
        LocalStorageModule: {
            deps: ['angular']
        },
        angularMocks: {
            deps: ['angular'],
            exports: 'angular.mock'
        },
        ngCookies: {
            deps:['angular']
        },
        ngDialog: {
            deps:['angular']
        },
        modelOptions: {
            deps: ['angular']
        },
        ionrangeslider: {
            deps: ['jquery']
        },
        ngCkeditor: {
            deps: ['angular']
        },
        ckeditor: {
            exports: 'CKEDITOR'
        }
    }
});

define('ewf', ['module', 'angular'].concat(dhl.getAngularModules()), function (module, angular) {
    module.exports = angular.module('ewf', dhl.getAngularModules()
        .concat([/*angular modules you want to add to app, but there are many in one file*/]))
        .config(applicationConfiguration)
        .run(ewfRunBlocks);
});

require(testFiles, function() {
    __karma__.start();
});

// ---- $q decorator ----
function $q(resolver) {
    var deferred = $q.defer();
    var resolve = angular.bind(deferred, deferred.resolve);
    var reject = angular.bind(deferred, deferred.reject);
    var promise = deferred.promise;

    resolver(resolve, reject);

    return promise;
}

$qDecorator.$inject = ['$delegate'];
function $qDecorator($delegate) {
    var $qDecorated = angular.extend($q, $delegate);

    /* The `restartable` decorator adds `restartable` function to $q service which provides
     * simple interface to restartable async operation creation
     */
    $qDecorated.restartable = function(thenFn) {
        var promise = null; // Limit the scope of the variable

        var result = function() {
            var vm = this;
            var args = arguments; // Pass-through current call arguments to subsequent calls

            return promise || (promise = $q.when(thenFn.apply(vm, args))
                    .catch(function(reason) {
                        // Invalidate current promise for future restart
                        promise = null;
                        // Pass-through error for further handling
                        return $q.reject(reason);
                    }));
        };

        result.restart = function() {
            promise = null;
        };
        return result;
    };
    return $qDecorated;
}

applicationConfiguration.$inject = ['$provide'];
function applicationConfiguration($provide) {
    $provide.decorator('$q', $qDecorator);
}

function ewfRunBlocks($rootScope, logService) {
    //$rootScope.$log = logService.$log;
    //$rootScope.$debug = logService.$debug;
}
