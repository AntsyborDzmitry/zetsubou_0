define(['exports', 'module', 'ewf'], function (exports, module, _ewf) {
    'use strict';

    module.exports = profileShipmentService;

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _ewf2 = _interopRequireDefault(_ewf);

    _ewf2['default'].service('profileShipmentService', profileShipmentService);

    profileShipmentService.$inject = ['ewfCrudService'];

    function profileShipmentService(ewfCrudService) {
        var ENDPOINT_PREFIX = '/api/myprofile/shipment/defaults/';

        var INSURANCE_ENDPOINT = ENDPOINT_PREFIX + 'insurance';
        var RETURN_SHIPMENTS_ENDPOINT = ENDPOINT_PREFIX + 'return';
        var PICKUPS_ENDPOINT = ENDPOINT_PREFIX + 'pickup';
        var SAVING_SHIPMENTS_ENDPOINT = ENDPOINT_PREFIX + 'saving';
        var SOM_CURRENCY_ENDPOINT = ENDPOINT_PREFIX + 'uomac';
        var PACKAGES_ENDPOINT = ENDPOINT_PREFIX + 'packages';

        return {
            getShipmentInsurance: getShipmentInsurance,
            updateShipmentInsurance: updateShipmentInsurance,

            getReturnShipments: getReturnShipments,
            updateReturnShipments: updateReturnShipments,

            getPickupsData: getPickupsData,
            savePickupsData: savePickupsData,

            getDefaultSavingShipment: getDefaultSavingShipment,
            updateDefaultSavingShipment: updateDefaultSavingShipment,

            getDefaultSomAndCurrency: getDefaultSomAndCurrency,
            updateDefaultSomAndCurrency: updateDefaultSomAndCurrency,

            getPackagesData: getPackagesData,
            updatePackagesData: updatePackagesData
        };

        function getShipmentInsurance() {
            return ewfCrudService.getElementList(INSURANCE_ENDPOINT);
        }

        function updateShipmentInsurance(data) {
            return ewfCrudService.updateElement(INSURANCE_ENDPOINT, data);
        }

        function getReturnShipments() {
            return ewfCrudService.getElementList(RETURN_SHIPMENTS_ENDPOINT);
        }
        function updateReturnShipments(data) {
            return ewfCrudService.updateElement(RETURN_SHIPMENTS_ENDPOINT, data);
        }

        function getPickupsData() {
            return ewfCrudService.getElementList(PICKUPS_ENDPOINT);
        }

        function savePickupsData(data) {
            return ewfCrudService.updateElement(PICKUPS_ENDPOINT, data);
        }

        function getDefaultSavingShipment() {
            return ewfCrudService.getElementList(SAVING_SHIPMENTS_ENDPOINT);
        }

        function updateDefaultSavingShipment(data) {
            return ewfCrudService.updateElement(SAVING_SHIPMENTS_ENDPOINT, data);
        }

        function getDefaultSomAndCurrency() {
            return ewfCrudService.getElementList(SOM_CURRENCY_ENDPOINT);
        }

        function updateDefaultSomAndCurrency(data) {
            return ewfCrudService.updateElement(SOM_CURRENCY_ENDPOINT, data);
        }

        function getPackagesData() {
            return ewfCrudService.getElementList(PACKAGES_ENDPOINT);
        }

        function updatePackagesData(data) {
            return ewfCrudService.updateElement(PACKAGES_ENDPOINT, data);
        }
    }
});
//# sourceMappingURL=profile-shipment-service.js.map
