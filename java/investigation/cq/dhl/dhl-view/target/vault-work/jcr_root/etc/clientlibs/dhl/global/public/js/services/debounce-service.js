define(['exports', 'module', 'ewf'], function (exports, module, _ewf) {
    'use strict';

    module.exports = DebounceService;

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _ewf2 = _interopRequireDefault(_ewf);

    _ewf2['default'].service('debounceService', DebounceService);

    DebounceService.$inject = ['$q', '$timeout'];

    /**
     * This function creates another function that can be used for the purpose of throttling high frequency requests.
     * It provides the ability to aggregate incoming request data via the means of `aggregateFn`. The function receives
     * request data and aggregates it into `result` which is further passed to `thenFn`. Function `thenFn` receives
     * aggregated request data and issues processing in accordance to business logic. The result of such processing is
     * wrapped into closure and returned via debounceFunction promise.
     *
     * @param {Function} aggregateFn(prevAggregationResult, anyArgs..) returns aggregationResult
     *                   receives previous iteration aggregationResult (undefined first time) and returns
     *                   new aggregationResult
     * @param {Function} thenFn(lastAggregationResult): returns thenFnResult wrapped into closure (function)
     * @param {Number} delay
     * @param {Boolean} invokeApply
     * @returns {Function} function(anyArgs): Promise<clojurify<thenFnResult>> which accept lastAggregationResult and
     * returns promise, which resolves to value returned by `thenFn`
     */

    function DebounceService($q, $timeout) {
        var publicApi = {
            createDebounceFunction: createDebounceFunction
        };

        function createDebounceFunction(aggregateFn, thenFn, delay, invokeApply) {
            var _this = this;

            var timeout = null;
            var debounceArgs = null;

            var result = function result() {
                for (var _len = arguments.length, aggregateArgs = Array(_len), _key = 0; _key < _len; _key++) {
                    aggregateArgs[_key] = arguments[_key];
                }

                var vm = _this;

                aggregateArgs.push(debounceArgs);

                debounceArgs = aggregateFn.apply(_this, aggregateArgs) || debounceArgs;

                if (!timeout) {
                    (function () {
                        var clojurify = function clojurify(value) {
                            return function () {
                                return value;
                            };
                        };

                        timeout = $timeout(function () {
                            return clojurify(thenFn.call(vm, debounceArgs));
                        }, delay, invokeApply)['finally'](function () {
                            timeout = null;
                        });
                    })();
                }

                return timeout;
            };

            return result;
        }

        return publicApi;
    }
});
//# sourceMappingURL=debounce-service.js.map
