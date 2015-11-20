import './../../../../services/attrs-service';
ContactShippingInfoController.$inject = ['$scope', '$attrs', 'attrsService'];

export default function ContactShippingInfoController($scope, $attrs, attrsService) {
    const vm = this;
    vm.attributes = {};

    vm.currenciesMock = ['USD', 'EUR', 'UAH'];  // mock data, must be replaced with data from support utility
    const referencesForShipmentsInit = [
         {
             referenceName: '',
             referenceType: 'DEFAULT'
         }
    ];

    // tracks shipping data from service
    attrsService.track($scope, $attrs, 'shipping', vm.attributes, (shipping) => {
        if (shipping) { // set mock data if no data available from service response (service not implemented yet)
            shipping.currency = shipping.currency || vm.currenciesMock[0];
            shipping.referencesForShipments = shipping.referencesForShipments || referencesForShipmentsInit;
        }
    });

    vm.isEditing = false;
    vm.removeReference = removeReference;
    vm.addAnotherReference = addAnotherReference;
    vm.toggleLayout = toggleLayout;

    function addAnotherReference() {
        vm.attributes.shipping.referencesForShipments.push({referenceName: '', referenceType: 'OPTIONAL'});
    }

    function removeReference(reference) {
        const index = vm.attributes.shipping.referencesForShipments.indexOf(reference);
        vm.attributes.shipping.referencesForShipments.splice(index, 1);
    }

    function toggleLayout() {
        vm.isEditing = !vm.isEditing;
    }
}
