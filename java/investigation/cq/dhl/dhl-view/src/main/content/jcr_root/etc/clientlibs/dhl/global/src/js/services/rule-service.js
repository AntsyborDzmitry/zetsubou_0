/*global setTimeout*/
import ewf from 'ewf';

ewf.service('ruleService', ruleService);

ruleService.$inject = ['$http', '$q', 'logService', 'navigationService', 'countryCodeConverter'];

/**
 * Applies rules to form
 *
 * @param {angular.$http} $http - angular $http object
 * @param {Object} $q - angular promises
 * @param {logService} logService - logging service
 * @param {navigationService} navigationService
 */
export default function ruleService($http, $q, logService, navigationService, countryCodeConverter) {
    const publicAPI = {
        acquireRulesForFormFields,
        getFieldRules,
        getFormRules,
        acquireSetting
    };

    /**
     * {
     *      formKey: {formDefinition}
     * }
     */
    const FORM_DEFINITIONS = {};
    const LOAD_FAILED = {};

    /**
     * {
     *      formKey: {
     *          inProgress: false,
     *          deferred: [defer objects]
     *      }
     * }
     */
    const pendingRequests = {};

    /**
     * @type {Number}
     */
    let timeoutId;

    /**
     * @param {String} formName
     * @returns {promise}
     */
    function acquireRulesForFormFields(formName, optionalCountryId) {
        const countryId = optionalCountryId || getCurrentCountryId();
        const formKey = getFormCacheKey(formName, countryId);
        const formDefinition = FORM_DEFINITIONS[formKey];
        const deferred = $q.defer();

        if (formDefinition !== undefined) {
            if (formDefinition === LOAD_FAILED) {
                deferred.reject('form "' + formKey + '" failed to load in previous time');
            } else {
                deferred.resolve(formDefinition);
            }
        } else {
            let pendingReq = pendingRequests[formKey];
            if (!pendingReq) {
                pendingReq = pendingRequests[formKey] = {
                    inProgress: false,
                    deferred: []
                };
                if (!timeoutId) {
                    timeoutId = setTimeout(() => {
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
        const formKeys = [];
        Object.keys(pendingRequests).forEach((formKey) => {
            const pendingReq = pendingRequests[formKey];
            if (!pendingReq.inProgress) {
                formKeys.push(formKey);
                pendingReq.inProgress = true;
            }
        });

        $http.get('/api/form/several_form_definitions/' + countryId, {params: {formId: formKeys.map(getFormName)}})
            .then((response) => {
                // TODO: check incoming data
                const rules = response.data;

                // TODO: move in separate function
                Object.keys(rules).forEach((formName) => {
                    const formKey = getFormCacheKey(formName, countryId);
                    if (!formKeys.includes(formKey)) {
                        logService.warn('There are rules for form: "' + formKey + '", but they were not requested!');
                        return;
                    }

                    const formRules = {};
                    rules[formName].forEach((fieldDefinition) => {
                        const fieldName = fieldDefinition.field;
                        formRules[fieldName] = fieldDefinition;
                    });

                    pendingRequests[formKey].deferred.forEach((defer) => defer.resolve(formRules));
                    delete pendingRequests[formKey];
                    FORM_DEFINITIONS[formKey] = formRules;
                });

                rejectRemainingPromises(undefined);
            })
            .catch((response) => {
                const data = response.data;
                logService.error('error while requesting form definition: ' + data);

                rejectRemainingPromises(data);
            });

        function rejectRemainingPromises(rejectData) {
            formKeys.forEach((formKey) => {
                const pendingReq = pendingRequests[formKey];
                if (pendingReq) {
                    pendingReq.deferred.forEach((defer) => defer.reject(rejectData));
                    delete pendingRequests[formKey];
                    FORM_DEFINITIONS[formKey] = LOAD_FAILED;
                }
            });
        }
    }

    function acquireSetting(settingFullPath, defaultCountryCode = 'url') {
        const groupNameLastIndex = settingFullPath.indexOf('.');
        const groupName = settingFullPath.substr(0, groupNameLastIndex);
        const fieldName = settingFullPath.substr(groupNameLastIndex + 1);
        const countryCode = defaultCountryCode === 'url' ? getCurrentCountryId() : defaultCountryCode;

        const deferred = $q.defer();
        $http.get(`/api/rules/${groupName}/${countryCode}`)
            .then((response) => {
                const setting = response.data[groupName].find((eachSetting) => eachSetting.field === fieldName);
                if (setting) {
                    deferred.resolve(setting.value);
                } else {
                    const errorString = `form ${groupName} loaded successfully, but no field ${fieldName}`;
                    deferred.reject(errorString);
                    logService.log(errorString);
                }
            })
            .catch((error) => {
                deferred.reject(error);
                logService.log(error);
            });
        return deferred.promise;
    }

    function getFieldRules(fieldId, optionalCountryId) {
        const [formName, fieldName] = fieldId.split('.');
        const formKey = getFormCacheKey(formName, optionalCountryId || getCurrentCountryId());

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
        return `${formName}.${countryId}`;
    }

    function getFormName(formKey) {
        return formKey.split('.')[0];
    }

    function getCurrentCountryId() {
        return countryCodeConverter.fromThreeLetterToCatalystFormat(navigationService.getCountryLang().countryId);
    }

    return publicAPI;
}
