define(['exports', 'module'], function (exports, module) {
    'use strict';

    module.exports = EwfContactPickupInfoController;
    EwfContactPickupInfoController.$inject = ['$scope', '$attrs', 'attrsService'];

    function EwfContactPickupInfoController($scope, $attrs, attrsService) {
        var vm = this;

        vm.attributes = {};

        attrsService.track($scope, $attrs, 'pickup', vm.attributes);

        //TODO remove this mock when support utility will be available
        vm.pickupLocations = {
            frontDoor: 'Front Door',
            backDoor: 'Back Door',
            reception: 'Reception',
            loadingBay: 'Loading Bay',
            other: 'Other'
        };
    }
});
//# sourceMappingURL=contact-pickup-info-controller.js.map
