define(['exports', 'module', './return-shipments-directive', './../services/profile-shipment-service', './../../../services/navigation-service', 'angular'], function (exports, module, _returnShipmentsDirective, _servicesProfileShipmentService, _servicesNavigationService, _angular) {
    'use strict';

    module.exports = ReturnShipmentsController;

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _angular2 = _interopRequireDefault(_angular);

    ReturnShipmentsController.$inject = ['$scope', '$q', 'profileShipmentService', 'logService', 'navigationService'];

    function ReturnShipmentsController($scope, $q, profileShipmentService, logService, navigationService) {
        var vm = this;
        var RETURN_SHIPMENT_URL_PARAMETER = 'returnShipments';

        _angular2['default'].extend(vm, {
            instructions: '',
            isEditing: false,
            returnShippingLabels: [{ id: 'NONE', data: 'Select One' }, { id: 'NEVER_ASK', data: 'Never ask me if I want to create a return statement' }, { id: 'SAME_TIME', data: 'At the same time that I am creating an outbound shipment' }, { id: 'AFTER_PRINTED', data: 'After I\'ve printed my outbound shipping documents' }],
            returnLabelSendTypes: [{ id: 'BY_EMAIL', data: 'Via Email' }, { id: 'BY_MYSELF', data: 'By printing the labels and sending them myself' }],

            getReturnShipments: getReturnShipments,
            updateReturnShipments: updateReturnShipments,
            preloadSectionFromUrl: preloadSectionFromUrl,
            toggleLayout: toggleLayout
        });

        _angular2['default'].extend(vm, {
            returnLabelType: vm.returnShippingLabels[0].id,
            returnLabelSendType: vm.returnLabelSendTypes[0].id
        });

        vm.getReturnShipments();

        function getReturnShipments() {
            profileShipmentService.getReturnShipments().then(function (response) {
                vm.returnLabelType = response.returnLabelType;
                vm.returnLabelSendType = response.returnLabelSendType;
                vm.instructions = response.instructions;
            });
        }

        function updateReturnShipments() {
            var returnShipmentsObject = {
                returnLabelType: vm.returnLabelType,
                returnLabelSendType: vm.returnLabelSendType,
                instructions: vm.instructions
            };

            profileShipmentService.updateReturnShipments(returnShipmentsObject).then(function (response) {
                vm.returnShipmentsResponse = response;
                vm.errorMessages = [];
            });
            vm.toggleLayout();
        }

        function preloadSectionFromUrl() {
            var currentSection = navigationService.getParamFromUrl('section');
            vm.isEditing = currentSection === RETURN_SHIPMENT_URL_PARAMETER;
        }

        function toggleLayout() {
            vm.isEditing = !vm.isEditing;
        }
    }
});
//# sourceMappingURL=return-shipments-controller.js.map
