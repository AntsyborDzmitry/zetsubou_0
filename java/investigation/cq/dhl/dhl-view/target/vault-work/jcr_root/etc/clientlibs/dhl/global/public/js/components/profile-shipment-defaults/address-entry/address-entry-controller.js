define(['exports', 'module', './../../../services/ewf-crud-service', './../../../constants/system-settings-constants'], function (exports, module, _servicesEwfCrudService, _constantsSystemSettingsConstants) {
    'use strict';

    module.exports = AddressEntryController;

    AddressEntryController.$inject = ['$scope', 'ewfCrudService', 'navigationService'];

    function AddressEntryController($scope, ewfCrudService, navigationService) {
        var vm = this;
        var ADDRESS_ENTRY_URL_PARAMETER = 'addressEntry';

        Object.assign(vm, {
            residentialDefault: false,
            residentialDefaultCache: this.residentialDefault,
            isEditing: false,

            init: init,
            updateResidentialDefault: updateResidentialDefault,
            preloadSectionFromUrl: preloadSectionFromUrl,
            restoreDefaults: restoreDefaults,
            toggleLayout: toggleLayout
        });

        function init() {
            // TODO: Update after backend is done
            ewfCrudService.getElementList('/api/myprofile/shipment/defaults/address').then(function (response) {
                vm.residentialDefaultCache = vm.residentialDefault = response.residentialDefault;
            });
        }

        function updateResidentialDefault() {
            // TODO: Update after backend is done
            ewfCrudService.updateElement('/api/myprofile/shipment/defaults/address', {
                residentialDefault: vm.residentialDefaultCache
            }).then(function (response) {
                vm.residentialDefaultCache = vm.residentialDefault = response.residentialDefault;
            });
        }

        function restoreDefaults() {
            vm.residentialDefaultCache = vm.residentialDefault;
        }

        function toggleLayout() {
            vm.isEditing = !vm.isEditing;
        }

        function preloadSectionFromUrl() {
            var currentSection = navigationService.getParamFromUrl('section');
            vm.isEditing = currentSection === ADDRESS_ENTRY_URL_PARAMETER;
        }
    }
});
//# sourceMappingURL=address-entry-controller.js.map
