import './return-shipments-directive';
import './../services/profile-shipment-service';
import './../../../services/navigation-service';
import angular from 'angular';

ReturnShipmentsController.$inject = ['$scope', '$q', 'profileShipmentService', 'logService', 'navigationService'];

export default function ReturnShipmentsController($scope, $q, profileShipmentService, logService, navigationService) {
    const vm = this;
    const RETURN_SHIPMENT_URL_PARAMETER = 'returnShipments';

    angular.extend(vm, {
        instructions: '',
        isEditing: false,
        returnShippingLabels: [
            {id: 'NONE', data: 'Select One'},
            {id: 'NEVER_ASK', data: 'Never ask me if I want to create a return statement'},
            {id: 'SAME_TIME', data: 'At the same time that I am creating an outbound shipment'},
            {id: 'AFTER_PRINTED', data: 'After I\'ve printed my outbound shipping documents'}
        ],
        returnLabelSendTypes: [
            {id: 'BY_EMAIL', data: 'Via Email'},
            {id: 'BY_MYSELF', data: 'By printing the labels and sending them myself'}
        ],

        getReturnShipments,
        updateReturnShipments,
        preloadSectionFromUrl,
        toggleLayout
    });

    angular.extend(vm, {
        returnLabelType: vm.returnShippingLabels[0].id,
        returnLabelSendType: vm.returnLabelSendTypes[0].id
    });

    vm.getReturnShipments();

    function getReturnShipments() {
        profileShipmentService.getReturnShipments()
            .then((response) => {
                vm.returnLabelType = response.returnLabelType;
                vm.returnLabelSendType = response.returnLabelSendType;
                vm.instructions = response.instructions;
            });
    }

    function updateReturnShipments() {
        const returnShipmentsObject = {
            returnLabelType: vm.returnLabelType,
            returnLabelSendType: vm.returnLabelSendType,
            instructions: vm.instructions
        };

        profileShipmentService.updateReturnShipments(returnShipmentsObject)
            .then((response) => {
                vm.returnShipmentsResponse = response;
                vm.errorMessages = [];
            });
        vm.toggleLayout();
    }

    function preloadSectionFromUrl() {
        const currentSection = navigationService.getParamFromUrl('section');
        vm.isEditing = currentSection === RETURN_SHIPMENT_URL_PARAMETER;
    }

    function toggleLayout() {
        vm.isEditing = !vm.isEditing;
    }
}
