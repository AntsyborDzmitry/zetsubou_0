define(['exports', 'module', './../../../services/ewf-crud-service', './../../../services/navigation-service'], function (exports, module, _servicesEwfCrudService, _servicesNavigationService) {
    'use strict';

    module.exports = AssigningShipmentsController;

    AssigningShipmentsController.$inject = ['ewfCrudService', 'navigationService'];

    function AssigningShipmentsController(ewfCrudService, navigationService) {
        var vm = this;
        var dataUrl = '/api/myprofile/shipment/assignment/defaults';
        var supportingUrl = '/api/myprofile/shipment/assignment/notifications/intervals';
        var assigningShipmentsSection = 'assigningShipments';

        var isEditModeFlag = undefined;
        var assigningOptionsBackup = null;

        Object.assign(vm, {
            init: init,

            assigningOptions: {},
            notificationOptions: {},

            setEditMode: setEditMode,
            isEditMode: isEditMode,

            cancelChanges: cancelChanges,
            applyChanges: applyChanges
        });

        function init() {
            isEditModeFlag = navigationService.getParamFromUrl('section') === assigningShipmentsSection;

            ewfCrudService.getElementList(dataUrl).then(applyAssigningOptions);

            ewfCrudService.getElementList(supportingUrl).then(function (response) {
                vm.notificationOptions = response;
            });
        }

        function applyAssigningOptions(assigningOptions) {
            vm.assigningOptions = assigningOptions;
            assigningOptionsBackup = angular.copy(vm.assigningOptions);
        }

        function setEditMode() {
            assigningOptionsBackup = angular.copy(vm.assigningOptions);

            isEditModeFlag = true;
        }

        function setViewMode() {
            isEditModeFlag = false;
        }

        function isEditMode() {
            return isEditModeFlag;
        }

        function cancelChanges() {
            applyAssigningOptions(assigningOptionsBackup);

            setViewMode();
        }

        function applyChanges() {
            ewfCrudService.changeElement(dataUrl, vm.assigningOptions).then(applyAssigningOptions).then(setViewMode);
        }
    }
});
//# sourceMappingURL=assigning-shipments-controller.js.map
