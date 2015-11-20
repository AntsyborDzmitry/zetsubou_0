define(['exports', 'module', 'ewf', './../services/throttle-service'], function (exports, module, _ewf, _servicesThrottleService) {
    /*eslint-disable no-unused-vars,no-unreachable*/
    'use strict';

    var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

    module.exports = ConfigService;

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _ewf2 = _interopRequireDefault(_ewf);

    _ewf2['default'].service('configService', ConfigService);

    ConfigService.$inject = ['$http', '$q', 'logService', 'navigationService', 'throttleService'];

    function ConfigService($http, $q, logService, navigationService, throttleService) {
        var valueFailedToLoad = 'Value failed to load';
        var valueRequestPending = 'Value request pending';

        var publicApi = {
            getValue: getValue,
            getBoolean: getBoolean,
            getFormField: getFormField
        };

        /**
         * values = {
         *      'US': [
         *          'some name, f.e. "Rewards / Promotion.Available Reward programs.nectar"': {
         *              type:"BOOLEAN",
         *              alias:"nectar",
         *              group:"Rewards / Promotion",
         *              subGroup:"Available Reward programs",
         *              data:{
         *                  value: true
         *              }
         *          },
         *          ...
         *      ],
         *      'UA': [...]
         *  }
         */
        var values = {};

        var aggregateFn = function aggregateFn(ciRequests, ciRequest, country) {
            var _ciRequest$split = ciRequest.split('.');

            var _ciRequest$split2 = _slicedToArray(_ciRequest$split, 3);

            var group = _ciRequest$split2[0];
            var subgroup = _ciRequest$split2[1];
            var ciAliases = _ciRequest$split2[2];

            var currentRequests = ciRequests || [];

            currentRequests.push({
                group: group,
                ciRequest: ciRequest,
                country: country
            });
            return currentRequests;
        };

        var throttleHandler = function throttleHandler(ciRequests) {
            var ciRequestsByCountry = ciRequests.reduce(function (acc, ciRequest) {
                if (!acc[ciRequest.country]) {
                    acc[ciRequest.country] = [];
                }
                acc[ciRequest.country].push(ciRequest.group);
                return acc;
            }, {});

            var groupRequests = Object.keys(ciRequestsByCountry).map(function (country) {
                var groupsRequest = ciRequestsByCountry[country].map(encodeURIComponent).reduce(function (acc, str) {
                    return acc + '&groups=' + str;
                }, '');
                return {
                    httpRequest: $http.get('/api/rules?country=' + country + groupsRequest),
                    country: country
                };
            });

            return $q.all(groupRequests.map(function (item) {
                return item.httpRequest;
            })).then(function (response) {
                var countries = groupRequests.map(function (item) {
                    return item.country;
                });

                response.forEach(function (item, index) {
                    var collection = response[index].data;
                    collection.forEach(function (ciResult) {
                        var key = ciResult.group + '.' + ciResult.subGroup + '.' + ciResult.alias;
                        values[countries[index]][key] = ciResult;
                    });
                });
            })['catch'](function (response) {
                logService.error('Error while requesting values ' + JSON.stringify(ciRequests));
                return $q.reject(response);
            })['finally'](function () {
                ciRequests.forEach(function (ciRequest) {
                    values[ciRequest.country][ciRequest.ciRequest] = values[ciRequest.country][ciRequest.ciRequest] || valueFailedToLoad;
                });
            });
        };

        var requestValues = lazyFn(function () {
            return throttleService.createThrottleFunction(aggregateFn, throttleHandler);
        });

        function getValue(key) {
            var country = arguments.length <= 1 || arguments[1] === undefined ? navigationService.getCountryLang().countryId : arguments[1];

            if (!values[country]) {
                values[country] = [];
            }

            if (values[country][key] === valueFailedToLoad) {
                return $q.reject('Value "' + key + '" was already requested but failed to load properly');
            }

            var value = values[country][key] || (values[country][key] = valueRequestPending);

            return value !== valueRequestPending ? $q.when(values[country][key]) : requestValues(key, country).then(function (throttleResultFn) {
                return throttleResultFn();
            }).then(function () {
                var result = values[country][key];

                if (result === valueFailedToLoad) {
                    return $q.reject('Was unable to load setting/ConfigItem "' + key + '"');
                }

                return $q.when(result);
            });
        }

        function lazyFn(factoryFunction) {
            var _this = this;

            var fn = null;

            return function () {
                for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                    args[_key] = arguments[_key];
                }

                return (fn || (fn = factoryFunction())).apply(_this, args);
            };
        }

        function getBoolean(key, country) {
            return publicApi.getValue(key, country).then(function (response) {
                return response.data.value;
            });
        }

        function getFormField(key, country) {
            return publicApi.getValue(key, country).then(function (response) {
                return response.data.value;
            });
        }

        return publicApi;
    }
});
//# sourceMappingURL=config-service.js.map
