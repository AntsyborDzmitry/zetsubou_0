define(['exports', 'module', 'ewf'], function (exports, module, _ewf) {
    /*global setTimeout*/
    'use strict';

    var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

    module.exports = ruleService;

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _ewf2 = _interopRequireDefault(_ewf);

    _ewf2['default'].service('ruleService', ruleService);

    ruleService.$inject = ['$http', '$q', 'logService', 'navigationService', 'countryCodeConverter'];

    /**
     * Applies rules to form
     *
     * @param {angular.$http} $http - angular $http object
     * @param {Object} $q - angular promises
     * @param {logService} logService - logging service
     * @param {navigationService} navigationService
     */

    function ruleService($http, $q, logService, navigationService, countryCodeConverter) {
        var publicAPI = {
            acquireRulesForFormFields: acquireRulesForFormFields,
            getFieldRules: getFieldRules,
            getFormRules: getFormRules,
            acquireSetting: acquireSetting
        };

        /**
         * {
         *      formKey: {formDefinition}
         * }
         */
        var FORM_DEFINITIONS = {};
        var LOAD_FAILED = {};

        /**
         * {
         *      formKey: {
         *          inProgress: false,
         *          deferred: [defer objects]
         *      }
         * }
         */
        var pendingRequests = {};

        /**
         * @type {Number}
         */
        var timeoutId = undefined;

        /**
         * @param {String} formName
         * @returns {promise}
         */
        function acquireRulesForFormFields(formName, optionalCountryId) {
            var countryId = optionalCountryId || getCurrentCountryId();
            var formKey = getFormCacheKey(formName, countryId);
            var formDefinition = FORM_DEFINITIONS[formKey];
            var deferred = $q.defer();

            if (formDefinition !== undefined) {
                if (formDefinition === LOAD_FAILED) {
                    deferred.reject('form "' + formKey + '" failed to load in previous time');
                } else {
                    deferred.resolve(formDefinition);
                }
            } else {
                var pendingReq = pendingRequests[formKey];
                if (!pendingReq) {
                    pendingReq = pendingRequests[formKey] = {
                        inProgress: false,
                        deferred: []
                    };
                    if (!timeoutId) {
                        timeoutId = setTimeout(function () {
                            timeoutId = undefined;
                            debounceAjaxCall(countryId);
                        }, 0);
                    }
                }
                pendingReq.deferred.push(deferred);
            }

            return deferred.promise;
        }

        function debounceAjaxCall(countryId) {
            // form names requested by this call
            var formKeys = [];
            Object.keys(pendingRequests).forEach(function (formKey) {
                var pendingReq = pendingRequests[formKey];
                if (!pendingReq.inProgress) {
                    formKeys.push(formKey);
                    pendingReq.inProgress = true;
                }
            });

            $http.get('/api/form/several_form_definitions/' + countryId, { params: { formId: formKeys.map(getFormName) } }).then(function (response) {
                // TODO: check incoming data
                var rules = response.data;

                // TODO: move in separate function
                Object.keys(rules).forEach(function (formName) {
                    var formKey = getFormCacheKey(formName, countryId);
                    if (!formKeys.includes(formKey)) {
                        logService.warn('There are rules for form: "' + formKey + '", but they were not requested!');
                        return;
                    }

                    var formRules = {};
                    rules[formName].forEach(function (fieldDefinition) {
                        var fieldName = fieldDefinition.field;
                        formRules[fieldName] = fieldDefinition;
                    });

                    pendingRequests[formKey].deferred.forEach(function (defer) {
                        return defer.resolve(formRules);
                    });
                    delete pendingRequests[formKey];
                    FORM_DEFINITIONS[formKey] = formRules;
                });

                rejectRemainingPromises(undefined);
            })['catch'](function (response) {
                var data = response.data;
                logService.error('error while requesting form definition: ' + data);

                rejectRemainingPromises(data);
            });

            function rejectRemainingPromises(rejectData) {
                formKeys.forEach(function (formKey) {
                    var pendingReq = pendingRequests[formKey];
                    if (pendingReq) {
                        pendingReq.deferred.forEach(function (defer) {
                            return defer.reject(rejectData);
                        });
                        delete pendingRequests[formKey];
                        FORM_DEFINITIONS[formKey] = LOAD_FAILED;
                    }
                });
            }
        }

        function acquireSetting(settingFullPath) {
            var defaultCountryCode = arguments.length <= 1 || arguments[1] === undefined ? 'url' : arguments[1];

            var groupNameLastIndex = settingFullPath.indexOf('.');
            var groupName = settingFullPath.substr(0, groupNameLastIndex);
            var fieldName = settingFullPath.substr(groupNameLastIndex + 1);
            var countryCode = defaultCountryCode === 'url' ? getCurrentCountryId() : defaultCountryCode;

            var deferred = $q.defer();
            $http.get('/api/rules/' + groupName + '/' + countryCode).then(function (response) {
                var setting = response.data[groupName].find(function (eachSetting) {
                    return eachSetting.field === fieldName;
                });
                if (setting) {
                    deferred.resolve(setting.value);
                } else {
                    var errorString = 'form ' + groupName + ' loaded successfully, but no field ' + fieldName;
                    deferred.reject(errorString);
                    logService.log(errorString);
                }
            })['catch'](function (error) {
                deferred.reject(error);
                logService.log(error);
            });
            return deferred.promise;
        }

        function getFieldRules(fieldId, optionalCountryId) {
            var _fieldId$split = fieldId.split('.');

            var _fieldId$split2 = _slicedToArray(_fieldId$split, 2);

            var formName = _fieldId$split2[0];
            var fieldName = _fieldId$split2[1];

            var formKey = getFormCacheKey(formName, optionalCountryId || getCurrentCountryId());

            //TODO: what we suppose to do if there are no form definitions
            if (FORM_DEFINITIONS[formKey]) {
                return FORM_DEFINITIONS[formKey][fieldName];
            }

            return {};
        }

        function getFormRules(formKey) {
            return FORM_DEFINITIONS[formKey];
        }

        function getFormCacheKey(formName, countryId) {
            return formName + '.' + countryId;
        }

        function getFormName(formKey) {
            return formKey.split('.')[0];
        }

        function getCurrentCountryId() {
            return countryCodeConverter.fromThreeLetterToCatalystFormat(navigationService.getCountryLang().countryId);
        }

        return publicAPI;
    }
});
//# sourceMappingURL=rule-service.js.map
