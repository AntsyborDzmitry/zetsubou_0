import ewf from 'ewf';
import './throttle-service';

ewf.service('nlsService', NlsService);

NlsService.$inject = ['$http', '$q', 'logService', 'navigationService', 'throttleService'];

const DICTIONARY_FAILED_TO_LOAD = 'Dictionary failed to load';
const DICTIONARY_REQUEST_PENDING = 'Dictionary request pending';

export default function NlsService($http, $q, logService, navigationService, throttleService) {

    const publicApi = {
        translate,
        isValidKey,
        getDictionary,
        getTranslation,
        getTranslationSync
    };

    /**
     * dictionaries = {
     *      dictionaryName: {
     *          translation_id: "translation"
     *      }
     * }
     */
    const dictionaries = {};

    /**
     * Creates a lazy function from factory function
     * @param {Function} factoryFunction
     */
    const requestDictionaries = lazyFn(() =>
        throttleService.createThrottleFunction(
            function aggregationFunction(dictionaryNames, dictionaryName) {
                let result = dictionaryNames;

                if (!result) {
                    result = [dictionaryName];
                } else if (!result.includes(dictionaryName)) {
                    result.push(dictionaryName);
                }

                return result;
            },

            function throttleHandler(dictionaryNames) {
                const countryLang = navigationService.getCountryLang();

                return $http.get('/services/dhl/nls/resources', {
                    params: {
                        countryCode: countryLang.countryId,
                        languageCode: countryLang.langId,
                        dictionaries: dictionaryNames
                    }
                })
                    .then((response) => {
                        const collection = response.data;

                        Object.keys(collection).forEach((dictionaryName) => {
                            if (!dictionaryNames.includes(dictionaryName)) {
                                logService.warn(`Received dictionary "${dictionaryName}", which wasn't requested!`);
                            } else {
                                dictionaries[dictionaryName] = collection[dictionaryName];
                            }
                        });

                        return collection;
                    })
                    .catch((response) => {
                        logService.error(`Error while requesting dictionaries ${JSON.stringify(dictionaryNames)}`);
                        return $q.reject(response);
                    })
                    .finally(() => {
                        dictionaryNames.forEach(function(dictionaryName) {
                            // Prevent unresolved dictionaries from being queried another time
                            dictionaries[dictionaryName] = dictionaries[dictionaryName] || DICTIONARY_FAILED_TO_LOAD;
                        });
                    });
            }
        )
    );

    /**
     * Creates a lazy function from factory function
     * @param {Function} factoryFunction
     * @returns {Function}
     */
    function lazyFn(factoryFunction) {
        let fn = null;

        return function(...args) {
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
        let dictionary = dictionaries[dictionaryName];

        if (dictionary === DICTIONARY_FAILED_TO_LOAD) {
            return $q.reject(`Dictionary "${dictionaryName}" was already requested but failed to load properly`);
        }

        if (dictionary === undefined) {
            dictionary = dictionaries[dictionaryName] = DICTIONARY_REQUEST_PENDING;
        }

        if (dictionary === DICTIONARY_REQUEST_PENDING) {
            return requestDictionaries(dictionaryName)
                .then((throttleResultFn) => {
                    return throttleResultFn().then(() => {
                        const result = dictionaries[dictionaryName];

                        if (result === DICTIONARY_FAILED_TO_LOAD) {
                            return $q.reject(`Was unable to load dictionary "${dictionaryName}"`);
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
            return $q.reject(`Wrong format "${fullKey}"`);
        }

        const [dictionaryName, translationKey] = fullKey.split('.');

        return publicApi.getDictionary(dictionaryName).then((dictionary) => {
            const translation = dictionary[translationKey];

            return translation
                ? $q.when(translation)
                : $q.reject(`Requested key "${translationKey}" not found in dictionary "${dictionaryName}"`);
        });
    }

    /**
     * Returns translation synchronously under assumption that it was already requested
     * @param {String} fullKey key in form 'dictionaryName.key'
     * @returns {String} translation of fullKey
     */
    function getTranslationSync(fullKey) {
        if (!publicApi.isValidKey(fullKey)) {
            logService.warn(`Wrong format "${fullKey}"`);

            return fullKey;
        }

        const [dictionaryName, key] = fullKey.split('.');
        const dictionary = dictionaries[dictionaryName];

        if (dictionary) {
            const text = dictionary[key];
            if (text) {
                return text;
            }

            logService.warn(`Key "${key}" not found in dictionary "${dictionary}"`);

            return fullKey;
        }

        logService.warn(`Dictionary "${dictionary}" not found, key: "${fullKey}"`);

        return fullKey;
    }

    /**
     * Returns translation synchronously with no assumption that it was already requested
     * @param {String} fullKey
     * @returns {String} translation of fullKey
     */
    function translate(fullKey) {
        if (!publicApi.isValidKey(fullKey)) {
            logService.warn(`Wrong format "${fullKey}"`);
            return fullKey;
        }

        const [dictionaryName, key] = fullKey.split('.');
        const dictionary = dictionaries[dictionaryName];

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
