/*global require, define, dhl, angular, document*/
/*eslint-disable angular/ng_di */
'use strict';

require.config({

    /**
     * @tutorial Change baseUrl to '/js' while working with mock server
     */
    baseUrl: '/etc/clientlibs/dhl/global/public/js/',
    paths: {
        jquery: 'lib/jquery/jquery',
        pdfjs: 'lib/pdfjs/pdf.combined',
        pdfjsWorker: 'lib/pdfjs/pdf.worker',
        angular: 'lib/angular/angular',
        'ui.bootstrap': 'lib/angular/ui-bootstrap-tpls',
        'ui.mask': 'lib/angular/mask',
        LocalStorageModule: 'lib/angular/angular-local-storage',
        ngCookies: 'lib/angular/angular-cookies',
        ngDialog: 'lib/angular/ngDialog',
        visualCaptcha: 'lib/angular/visualcaptcha.angular',
        modelOptions: 'lib/angular/ngModelOptions',
        ionrangeslider: 'lib/angular/ion.rangeSlider.min',
        ngCkeditor: 'lib/angular/ng-ckeditor',
        ckeditor: 'lib/angular/ckeditor/ckeditor'
    },
    shim: {
        jquery: {
            exports: '$'
        },
        pdfjs: {
            exports: 'pdfjs'
        },
        pdfjsWorker: {
            exports: 'pdfjsWorker'
        },
        angular: {
            deps: ['jquery'],
            exports: 'angular'
        },
        'ui.mask': {
            deps: ['angular']
        },
        'ui.bootstrap': {
            deps: ['jquery', 'angular']
        },
        visualCaptcha: {
            deps: ['angular']
        },
        LocalStorageModule: {
            deps: ['angular']
        },
        ngCookies: {
            deps: ['angular']
        },
        ngDialog: {
            deps: ['angular']
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
    module.exports = angular.module('ewf', dhl.getAngularModules().concat([/*angular modules you want to add to app, but there are many in one file*/])).config(applicationConfiguration).run(ewfRunBlocks);
});

/**
 * @author Roman_Iermakov
 * @todo: We definitely need to refactor this mess with require and dependency injections.
 *        Use Angular-way injection and add all services at once.
 *        The same should be dome for controller to inject them in directives
 */
var commonComponents = ['ewf', 'directives/nls/nls-directive', 'directives/ewfc/ewfc-value/ewfc-value-directive', 'directives/ewfc/ewfc-if/ewfc-if-directive', 'services/log-service', 'services/config-service', 'services/navigation-service', 'services/http-interceptors', 'services/attrs-service', 'directives/logout/logout-directive', 'components/login/login-service', 'services/password-service', 'directives/save-to-local-storage/save-to-local-storage-directive',
//TODO: Remove later
'services/temp-catalyst-country-code-converter', 'filters/translate-filter'];

var components = commonComponents.concat(dhl.getComponents());
require(components, function (ewf) {
    if (angular) {
        // DO NOT REMOVE!!!
        angular.element('script[type="text/ng-template"]').appendTo('head');

        angular.element(document).ready(function () {
            angular.bootstrap(document, [ewf.name]);
        });

        // TODO: replace this dirty hack with one row (like it was before)
        // angular.bootstrap(document, [ewf.name]);
    }
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
    $qDecorated.restartable = function (thenFn) {
        var promise = null; // Limit the scope of the letiable

        var result = function result() {
            var vm = this;
            var args = arguments; // Pass-through current call arguments to subsequent calls

            return promise || (promise = $q.when(thenFn.apply(vm, args))['catch'](function (reason) {
                // Invalidate current promise for future restart
                promise = null;
                // Pass-through error for further handling
                return $q.reject(reason);
            }));
        };

        result.restart = function () {
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

ewfRunBlocks.$inject = ['$rootScope', 'logService'];
function ewfRunBlocks($rootScope, logService) {
    $rootScope.$log = logService.$log;
    $rootScope.$debug = logService.$debug;
}
// ---- $timeout decorator ----