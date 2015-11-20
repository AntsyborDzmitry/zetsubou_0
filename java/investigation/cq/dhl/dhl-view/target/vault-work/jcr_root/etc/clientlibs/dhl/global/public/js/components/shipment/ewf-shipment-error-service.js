define(['exports', 'module', 'ewf'], function (exports, module, _ewf) {
    'use strict';

    module.exports = shipmentErrorService;

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _ewf2 = _interopRequireDefault(_ewf);

    _ewf2['default'].service('shipmentErrorService', shipmentErrorService);

    shipmentErrorService.$inject = ['$q'];

    function shipmentErrorService($q) {

        this.processErrorCode = function (response) {
            var errCode = undefined;
            if (response.data && response.data.errors) {
                errCode = response.data.errors[0];
            } else {
                errCode = 'common.service_currently_unavailable';
            }
            return $q.reject(errCode);
        };
    }
});
//# sourceMappingURL=ewf-shipment-error-service.js.map
