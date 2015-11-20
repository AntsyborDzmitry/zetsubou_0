import './manage-shipments-service';

ManageShipmentsController.$inject = ['manageShipmentsService', 'navigationService'];

export default function ManageShipmentsController(manageShipmentsService, navigationService) {
    const vm = this;

    Object.assign(vm, {
        filteredShipments: null,
        filterShipments,
        openShipmentPage
    });

    let shipments = [];

    manageShipmentsService.getShipments()
        .then((data) => {
            shipments = data;
            vm.filterShipments();
        });

    function filterShipments() {
        vm.filteredShipments = vm.searchQuery
            ? shipments.filter((item) => {
                const wayBillIncludesQuery = (item.airWayBillNumber || '').includes(vm.searchQuery);
                const nameIncludesQuery = (item.name || '').includes(vm.searchQuery);
                return wayBillIncludesQuery || nameIncludesQuery;
            })
            : shipments.slice();
    }

    function openShipmentPage(shipment) {
        navigationService.location(`shipment.html?shipmentId=${shipment.id}`);
    }
}
