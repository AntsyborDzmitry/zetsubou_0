define(['exports', 'module', './manage-shipments-service'], function (exports, module, _manageShipmentsService) {
    'use strict';

    module.exports = ManageShipmentsController;

    ManageShipmentsController.$inject = ['manageShipmentsService', 'navigationService'];

    function ManageShipmentsController(manageShipmentsService, navigationService) {
        var vm = this;

        Object.assign(vm, {
            filteredShipments: null,
            filterShipments: filterShipments,
            openShipmentPage: openShipmentPage
        });

        var shipments = [];

        manageShipmentsService.getShipments().then(function (data) {
            shipments = data;
            vm.filterShipments();
        });

        function filterShipments() {
            vm.filteredShipments = vm.searchQuery ? shipments.filter(function (item) {
                var wayBillIncludesQuery = (item.airWayBillNumber || '').includes(vm.searchQuery);
                var nameIncludesQuery = (item.name || '').includes(vm.searchQuery);
                return wayBillIncludesQuery || nameIncludesQuery;
            }) : shipments.slice();
        }

        function openShipmentPage(shipment) {
            navigationService.location('shipment.html?shipmentId=' + shipment.id);
        }
    }
});
//# sourceMappingURL=manage-shipments-controller.js.map
