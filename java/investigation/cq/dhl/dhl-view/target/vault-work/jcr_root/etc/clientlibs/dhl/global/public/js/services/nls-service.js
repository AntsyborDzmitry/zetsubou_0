define(['exports', 'module', 'ewf', './throttle-service'], function (exports, module, _ewf, _throttleService) {
    'use strict';

    var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

    module.exports = NlsService;

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _ewf2 = _interopRequireDefault(_ewf);

    _ewf2['default'].service('nlsService', NlsService);

    NlsService.$inject = ['$http', '$q', 'logService', 'navigationService', 'throttleService'];

    var DICTIONARY_FAILED_TO_LOAD = 'Dictionary failed to load';
    var DICTIONARY_REQUEST_PENDING = 'Dictionary request pending';

    function NlsService($http, $q, logService, navigationService, throttleService) {

        var publicApi = {
            translate: translate,
            isValidKey: isValidKey,
            getDictionary: getDictionary,
            getTranslation: getTranslation,
            getTranslationSync: getTranslationSync
        };

        /**
         * dictionaries = {
         *      dictionaryName: {
         *          translation_id: "translation"
         *      }
         * }
         */
        var dictionaries = {};

        /**
         * Creates a lazy function from factory function
         * @param {Function} factoryFunction
         */
        var requestDictionaries = lazyFn(function () {
            return throttleService.createThrottleFunction(function aggregationFunction(dictionaryNames, dictionaryName) {
                var result = dictionaryNames;

                if (!result) {
                    result = [dictionaryName];
                } else if (!result.includes(dictionaryName)) {
                    result.push(dictionaryName);
                }

                return result;
            }, function throttleHandler(dictionaryNames) {
                var countryLang = navigationService.getCountryLang();

                return $http.get('/services/dhl/nls/resources', {
                    params: {
                        countryCode: countryLang.countryId,
                        languageCode: countryLang.langId,
                        dictionaries: dictionaryNames
                    }
                }).then(function (response) {
                    var collection = response.data;

                    Object.keys(collection).forEach(function (dictionaryName) {
                        if (!dictionaryNames.includes(dictionaryName)) {
                            logService.warn('Received dictionary "' + dictionaryName + '", which wasn\'t requested!');
                        } else {
                            dictionaries[dictionaryName] = collection[dictionaryName];
                        }
                    });

                    return collection;
                })['catch'](function (response) {
                    logService.error('Error while requesting dictionaries ' + JSON.stringify(dictionaryNames));
                    return $q.reject(response);
                })['finally'](function () {
                    dictionaryNames.forEach(function (dictionaryName) {
                        // Prevent unresolved dictionaries from being queried another time
                        dictionaries[dictionaryName] = dictionaries[dictionaryName] || DICTIONARY_FAILED_TO_LOAD;
                    });
                });
            });
        });

        /**
         * Creates a lazy function from factory function
         * @param {Function} factoryFunction
         * @returns {Function}
         */
        function lazyFn(factoryFunction) {
            var fn = null;

            return function () {
                for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                    args[_key] = arguments[_key];
                }

                return (fn || (fn = factoryFunction())).apply(this, args);
            };
        }

        /**
         * @param {String} fullKey in form 'dictionaryName.key'
         * @returns {boolean} true if `fullKey` is valid nls key
         */
        function isValidKey(fullKey) {
            return fullKey.match(/\w+\.\w+/);
        }

        /**
         * Creates a lazy function from factory function
         * @param {String} dictionaryName is a dictionary name
         * @returns {Object} dictionary {"nls_key": "translation"}
         */
        function getDictionary(dictionaryName) {
            var dictionary = dictionaries[dictionaryName];

            if (dictionary === DICTIONARY_FAILED_TO_LOAD) {
                return $q.reject('Dictionary "' + dictionaryName + '" was already requested but failed to load properly');
            }

            if (dictionary === undefined) {
                dictionary = dictionaries[dictionaryName] = DICTIONARY_REQUEST_PENDING;
            }

            if (dictionary === DICTIONARY_REQUEST_PENDING) {
                return requestDictionaries(dictionaryName).then(function (throttleResultFn) {
                    return throttleResultFn().then(function () {
                        var result = dictionaries[dictionaryName];

                        if (result === DICTIONARY_FAILED_TO_LOAD) {
                            return $q.reject('Was unable to load dictionary "' + dictionaryName + '"');
                        }

                        return $q.when(result);
                    });
                });
            }

            return $q.when(dictionary);
        }

        /**
         * Async translate function, returns promise that will resolve to requested translation
         * @param {String} fullKey is a key of form "dictionaryName.translationKey"
         * @returns {Promise}
         */
        function getTranslation(fullKey) {
            if (!publicApi.isValidKey(fullKey)) {
                return $q.reject('Wrong format "' + fullKey + '"');
            }

            var _fullKey$split = fullKey.split('.');

            var _fullKey$split2 = _slicedToArray(_fullKey$split, 2);

            var dictionaryName = _fullKey$split2[0];
            var translationKey = _fullKey$split2[1];

            return publicApi.getDictionary(dictionaryName).then(function (dictionary) {
                var translation = dictionary[translationKey];

                return translation ? $q.when(translation) : $q.reject('Requested key "' + translationKey + '" not found in dictionary "' + dictionaryName + '"');
            });
        }

        /**
         * Returns translation synchronously under assumption that it was already requested
         * @param {String} fullKey key in form 'dictionaryName.key'
         * @returns {String} translation of fullKey
         */
        function getTranslationSync(fullKey) {
            if (!publicApi.isValidKey(fullKey)) {
                logService.warn('Wrong format "' + fullKey + '"');

                return fullKey;
            }

            var _fullKey$split3 = fullKey.split('.');

            var _fullKey$split32 = _slicedToArray(_fullKey$split3, 2);

            var dictionaryName = _fullKey$split32[0];
            var key = _fullKey$split32[1];

            var dictionary = dictionaries[dictionaryName];

            if (dictionary) {
                var text = dictionary[key];
                if (text) {
                    return text;
                }

                logService.warn('Key "' + key + '" not found in dictionary "' + dictionary + '"');

                return fullKey;
            }

            logService.warn('Dictionary "' + dictionary + '" not found, key: "' + fullKey + '"');

            return fullKey;
        }

        /**
         * Returns translation synchronously with no assumption that it was already requested
         * @param {String} fullKey
         * @returns {String} translation of fullKey
         */
        function translate(fullKey) {
            if (!publicApi.isValidKey(fullKey)) {
                logService.warn('Wrong format "' + fullKey + '"');
                return fullKey;
            }

            var _fullKey$split4 = fullKey.split('.');

            var _fullKey$split42 = _slicedToArray(_fullKey$split4, 2);

            var dictionaryName = _fullKey$split42[0];
            var key = _fullKey$split42[1];

            var dictionary = dictionaries[dictionaryName];

            if (dictionary === DICTIONARY_REQUEST_PENDING) {
                return fullKey;
            }

            if (!dictionary) {
                getDictionary(dictionaryName); // Request dictionary if it wasn't requested yet

                return fullKey;
            }

            return dictionary[key];
        }

        return publicApi;
    }
});
//# sourceMappingURL=nls-service.js.map
