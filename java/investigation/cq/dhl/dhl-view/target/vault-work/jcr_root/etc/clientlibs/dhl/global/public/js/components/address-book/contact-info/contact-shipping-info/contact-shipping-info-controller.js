define(['exports', 'module', './../../../../services/attrs-service'], function (exports, module, _servicesAttrsService) {
    'use strict';

    module.exports = ContactShippingInfoController;

    ContactShippingInfoController.$inject = ['$scope', '$attrs', 'attrsService'];

    function ContactShippingInfoController($scope, $attrs, attrsService) {
        var vm = this;
        vm.attributes = {};

        vm.currenciesMock = ['USD', 'EUR', 'UAH']; // mock data, must be replaced with data from support utility
        var referencesForShipmentsInit = [{
            referenceName: '',
            referenceType: 'DEFAULT'
        }];

        // tracks shipping data from service
        attrsService.track($scope, $attrs, 'shipping', vm.attributes, function (shipping) {
            if (shipping) {
                // set mock data if no data available from service response (service not implemented yet)
                shipping.currency = shipping.currency || vm.currenciesMock[0];
                shipping.referencesForShipments = shipping.referencesForShipments || referencesForShipmentsInit;
            }
        });

        vm.isEditing = false;
        vm.removeReference = removeReference;
        vm.addAnotherReference = addAnotherReference;
        vm.toggleLayout = toggleLayout;

        function addAnotherReference() {
            vm.attributes.shipping.referencesForShipments.push({ referenceName: '', referenceType: 'OPTIONAL' });
        }

        function removeReference(reference) {
            var index = vm.attributes.shipping.referencesForShipments.indexOf(reference);
            vm.attributes.shipping.referencesForShipments.splice(index, 1);
        }

        function toggleLayout() {
            vm.isEditing = !vm.isEditing;
        }
    }
});
//# sourceMappingURL=contact-shipping-info-controller.js.map
