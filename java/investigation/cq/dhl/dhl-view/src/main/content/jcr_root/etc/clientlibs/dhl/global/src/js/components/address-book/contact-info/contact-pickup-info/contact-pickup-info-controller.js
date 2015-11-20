EwfContactPickupInfoController.$inject = ['$scope', '$attrs', 'attrsService'];

export default function EwfContactPickupInfoController($scope, $attrs, attrsService) {
    const vm = this;

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
