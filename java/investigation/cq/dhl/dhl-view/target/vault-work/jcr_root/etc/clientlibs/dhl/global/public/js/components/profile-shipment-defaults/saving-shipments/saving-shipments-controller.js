define(['exports', 'module', './saving-shipments-directive', './../services/profile-shipment-service', './../../../services/navigation-service'], function (exports, module, _savingShipmentsDirective, _servicesProfileShipmentService, _servicesNavigationService) {
    'use strict';

    module.exports = SavingShipmentsController;

    SavingShipmentsController.$inject = ['profileShipmentService', 'navigationService'];

    function SavingShipmentsController(profileShipmentService, navigationService) {
        var vm = this;
        var SAVING_SHIPMENTS_URL_PARAMETER = 'savingShipments';

        angular.extend(vm, {
            isEditing: false,
            saveIncompleteSavings: false,

            preloadDefaultSavingShipment: preloadDefaultSavingShipment,
            updateDefaultSavingShipment: updateDefaultSavingShipment,
            toggleLayout: toggleLayout,
            preloadSectionFromUrl: preloadSectionFromUrl,
            resetChanges: resetChanges,
            exitFromEditing: exitFromEditing
        });

        function preloadDefaultSavingShipment() {
            profileShipmentService.getDefaultSavingShipment().then(function (data) {
                vm.serverData = vm.saveIncompleteSavings = data.saveIncompleteSavings;
            });
        }

        function updateDefaultSavingShipment() {
            profileShipmentService.updateDefaultSavingShipment({ saveIncompleteSavings: vm.saveIncompleteSavings });
            vm.toggleLayout();
            vm.serverData = vm.saveIncompleteSavings;
        }

        function preloadSectionFromUrl() {
            var currentSection = navigationService.getParamFromUrl('section');
            vm.isEditing = currentSection === SAVING_SHIPMENTS_URL_PARAMETER;
        }

        function toggleLayout() {
            vm.isEditing = !vm.isEditing;
        }

        function resetChanges() {
            vm.saveIncompleteSavings = vm.serverData;
        }

        function exitFromEditing() {
            vm.resetChanges();
            vm.isEditing = false;
        }
    }
});
//# sourceMappingURL=saving-shipments-controller.js.map
