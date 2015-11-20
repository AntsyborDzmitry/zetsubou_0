define(['exports', 'module', 'ewf'], function (exports, module, _ewf) {
    'use strict';

    module.exports = addressDetailsService;

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _ewf2 = _interopRequireDefault(_ewf);

    _ewf2['default'].service('addressDetailsService', addressDetailsService);

    addressDetailsService.$inject = ['$http', '$q', 'logService'];

    //TODO: if needed not only in address details, move to /services

    function addressDetailsService($http, $q, logService) {
        this.checkUserCanImport = function (fromCountryCode, toCountryCode, importAccountNumber) {
            return $http.get('/api/account/can_import/' + fromCountryCode + '/' + toCountryCode + '/' + importAccountNumber).then(function (response) {
                return response.data;
            })['catch'](function (response) {
                return $q.reject(response);
            });
        };

        this.saveAccountNumber = function (importAccountNumber) {
            return $http.post('/api/myprofile/addAccountNumber/', { accountNumber: importAccountNumber }).then(function (response) {
                logService.log(response);
                return response.data;
            })['catch'](function (response) {
                logService.error(response.data);
                return $q.reject(response.data);
            });
        };
    }
});
//# sourceMappingURL=address-details-service.js.map
