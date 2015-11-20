define(['exports', 'module', 'ewf'], function (exports, module, _ewf) {
    /*global document*/
    'use strict';

    module.exports = logService;

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _ewf2 = _interopRequireDefault(_ewf);

    _ewf2['default'].service('logService', logService);

    logService.$inject = ['$window'];

    /**
     * Logging service. Just log in console in current implementation
     *
     * @param {Object} $window - window to write logs in it
     */

    function logService($window) {
        var vm = this;

        Object.assign(vm, {
            log: log,
            warn: warn,
            error: error,
            $log: $log,
            $debug: $debug
        });

        function $debug(argument, result) {
            debugger; // eslint-disable-line
            if (arguments.length < 2) {
                return argument;
            }

            return result;
        }

        var theConsole = $window.console;

        // TODO: add date and time
        function log() {
            theConsole.log.apply(theConsole, arguments);
        }

        function warn() {
            theConsole.warn.apply(theConsole, arguments);
        }

        function error() {
            theConsole.log.apply(theConsole, arguments);
        }

        // Special purpose log function used within angular UI
        function $log(argument, result, info) {
            if (arguments.length < 2) {
                theConsole.log(argument);
                return argument;
            }

            theConsole.log([info, argument]);
            return result;
        }

        var ie = (function () {
            var undef = undefined,
                version = 3,
                div = document.createElement('div'); // eslint-disable-line
            var all = div.getElementsByTagName('i');
            /*eslint-disable */
            while ((div.innerHTML = '<!--[if gt IE ' + ++version + ']><i></i><![endif]-->', all[0]));
            /*eslint-enable */
            return version > 4 ? version : undef;
        })();

        function logDebugFuncWithIeSupport(argument, result) {
            // The following lines prevents existing code from breaking in production environment
            // when developer forgets removing $log or $debug call
            if (arguments.length < 2) {
                return argument;
            }

            return result;
        }

        if (ie < 9) {
            Object.assign(vm, {
                $log: logDebugFuncWithIeSupport,
                $debug: logDebugFuncWithIeSupport,

                log: function log() {},
                warn: function warn() {},
                error: function error() {}
            });
        }
    }
});
//# sourceMappingURL=log-service.js.map
