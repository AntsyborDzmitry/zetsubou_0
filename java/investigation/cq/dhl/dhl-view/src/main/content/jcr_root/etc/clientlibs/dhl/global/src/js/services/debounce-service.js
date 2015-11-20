import ewf from 'ewf';

ewf.service('debounceService', DebounceService);

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
export default function DebounceService($q, $timeout) {
    const publicApi = {
        createDebounceFunction
    };

    function createDebounceFunction(aggregateFn, thenFn, delay, invokeApply) {
        let timeout = null;
        let debounceArgs = null;

        const result = (...aggregateArgs) => {
            const vm = this;

            aggregateArgs.push(debounceArgs);

            debounceArgs = aggregateFn.apply(this, aggregateArgs) || debounceArgs;

            if (!timeout) {
                const clojurify = (value) => () => value;

                timeout = $timeout(
                    () => clojurify(thenFn.call(vm, debounceArgs)),
                    delay,
                    invokeApply)
                        .finally(() => {
                            timeout = null;
                        });
            }

            return timeout;
        };

        return result;
    }

    return publicApi;
}
