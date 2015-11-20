define(['exports', 'module', './shipment-insurance-directive', './../services/profile-shipment-service', './../../../services/navigation-service', 'angular'], function (exports, module, _shipmentInsuranceDirective, _servicesProfileShipmentService, _servicesNavigationService, _angular) {
    'use strict';

    module.exports = ShipmentInsuranceController;

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _angular2 = _interopRequireDefault(_angular);

    ShipmentInsuranceController.$inject = ['$scope', '$q', 'profileShipmentService', 'logService', 'navigationService'];

    function ShipmentInsuranceController($scope, $q, profileShipmentService, logService, navigationService) {
        var vm = this;
        var SHIPMENT_PROTECTION_URL_PARAMETER = 'shipmentProtection';

        _angular2['default'].extend(vm, {
            isEditing: false,
            insuranceCurrencies: ['USD', 'EUR'],

            initFields: initFields,
            updateShipmentInsurance: updateShipmentInsurance,
            preloadSectionFromUrl: preloadSectionFromUrl,
            toggleLayout: toggleLayout
        });

        vm.initFields();

        profileShipmentService.getShipmentInsurance().then(function (response) {
            vm.insureShipments = response.insureShipments;
            vm.insureShipmentType = response.insureShipmentType;
            vm.insuranceValue = response.insuranceValue;
            vm.insuranceCurrency = !response.insuranceCurrency ? vm.insuranceCurrencies[0] : response.insuranceCurrency;
        });

        function updateShipmentInsurance() {
            var shipmentInsuranceObject = {
                insureShipments: vm.insureShipments,
                insureShipmentType: vm.insureShipmentType,
                insuranceValue: vm.insuranceValue,
                insuranceCurrency: vm.insuranceCurrency
            };

            profileShipmentService.updateShipmentInsurance(shipmentInsuranceObject).then(function (response) {
                vm.insuranceResponse = response;
                vm.errorMessages = [];
            });
            vm.isEditing = false;
        }

        function initFields() {
            vm.insureShipments = false;
            vm.insureShipmentType = 'NONE';
            vm.insuranceValue = 0;
            vm.insuranceCurrency = vm.insuranceCurrencies[0];
        }

        function preloadSectionFromUrl() {
            var currentSection = navigationService.getParamFromUrl('section');
            vm.isEditing = currentSection === SHIPMENT_PROTECTION_URL_PARAMETER;
        }

        function toggleLayout() {
            vm.isEditing = !vm.isEditing;
        }
    }
});
//# sourceMappingURL=shipment-insurance-controller.js.map
