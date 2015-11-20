import ewf from 'ewf';

ewf.service('throttleService', ThrottleService);

ThrottleService.$inject = ['$q', '$timeout'];

/**
 * Attrs service. Contains helper logic related to attribute manipulation
 *
 */
export default function ThrottleService($q, $timeout) {
    const publicApi = {
        createThrottleFunction
    };

    /*
     * On system minimal timer resolution reference please review:
     * http://stackoverflow.com/questions/3744032/why-are-net-timers-limited-to-15-ms-resolution
     * Two system heartbeats are used for throttling to make it possible to collect all requests
     */
    const DEFAULT_THROTTLING_TIMEOUT = 32;

    /**
     * This function creates another function that can be used for the purpose of throttling high frequency requests.
     * It provides the ability to aggregate incoming request data via the means of `aggregateFn`. The function receives
     * request data and aggregates it into `result` which is further passed to `thenFn`. Function `thenFn` receives
     * aggregated request data and issues processing in accordance to business logic. The result of such processing is
     * wrapped into closure and returned via throttleFunction promise.
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
    function createThrottleFunction(aggregateFn, thenFn, invokeApply) {
        let timeout = null;
        let throttleArgs = null;

        // `defer` is used internally due to the fact that the function returns function
        // instead of promise it is also required because we want to preserve the promise
        // returned by `result` function even during throttling promise interchange
        let deferred = $q.defer();

        let reset = function() {
            deferred = $q.defer();

            timeout = null;
            throttleArgs = null;
        };

        let result = (...aggregateArgs) => {
            let vm = this;

            aggregateArgs.unshift(throttleArgs);

            throttleArgs = aggregateFn.apply(this, aggregateArgs) || throttleArgs;

            if (timeout) {
                $timeout.cancel(timeout);
            }

            timeout = $timeout(() => {
                const closurify = (value) => () => value;

                // we can't use code like this:
                //   deferred.resolve(thenFn.call(vm, throttleArgs));
                // because if thenFn.call return promise then we'll get unexpected behavior
                deferred.resolve(closurify(thenFn.call(vm, throttleArgs)));

                reset();
            }, DEFAULT_THROTTLING_TIMEOUT, invokeApply);

            return deferred.promise;
        };

        return result;
    }

    return publicApi;
}
