import './shipment-insurance-directive';
import './../services/profile-shipment-service';
import './../../../services/navigation-service';
import angular from 'angular';

ShipmentInsuranceController.$inject = ['$scope', '$q', 'profileShipmentService', 'logService', 'navigationService'];

export default function ShipmentInsuranceController($scope, $q, profileShipmentService, logService, navigationService) {
    const vm = this;
    const SHIPMENT_PROTECTION_URL_PARAMETER = 'shipmentProtection';

    angular.extend(vm, {
        isEditing: false,
        insuranceCurrencies: ['USD', 'EUR'],

        initFields,
        updateShipmentInsurance,
        preloadSectionFromUrl,
        toggleLayout
    });

    vm.initFields();

    profileShipmentService.getShipmentInsurance()
        .then((response) => {
            vm.insureShipments = response.insureShipments;
            vm.insureShipmentType = response.insureShipmentType;
            vm.insuranceValue = response.insuranceValue;
            vm.insuranceCurrency = !response.insuranceCurrency
                ? vm.insuranceCurrencies[0]
                : response.insuranceCurrency;
        });

    function updateShipmentInsurance() {
        const shipmentInsuranceObject = {
            insureShipments: vm.insureShipments,
            insureShipmentType: vm.insureShipmentType,
            insuranceValue: vm.insuranceValue,
            insuranceCurrency: vm.insuranceCurrency
        };

        profileShipmentService.updateShipmentInsurance(shipmentInsuranceObject)
            .then((response) => {
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
        const currentSection = navigationService.getParamFromUrl('section');
        vm.isEditing = currentSection === SHIPMENT_PROTECTION_URL_PARAMETER;
    }

    function toggleLayout() {
        vm.isEditing = !vm.isEditing;
    }
}
