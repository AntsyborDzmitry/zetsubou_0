import './../../../services/ewf-crud-service';
import './../../../services/navigation-service';

AssigningShipmentsController.$inject = ['ewfCrudService', 'navigationService'];

export default function AssigningShipmentsController(ewfCrudService, navigationService) {
    const vm = this;
    const dataUrl = '/api/myprofile/shipment/assignment/defaults';
    const supportingUrl = '/api/myprofile/shipment/assignment/notifications/intervals';
    const assigningShipmentsSection = 'assigningShipments';

    let isEditModeFlag;
    let assigningOptionsBackup = null;

    Object.assign(vm, {
        init,

        assigningOptions: {},
        notificationOptions: {},

        setEditMode,
        isEditMode,

        cancelChanges,
        applyChanges
    });

    function init() {
        isEditModeFlag = navigationService.getParamFromUrl('section') === assigningShipmentsSection;

        ewfCrudService.getElementList(dataUrl)
            .then(applyAssigningOptions);

        ewfCrudService.getElementList(supportingUrl)
            .then((response) => {
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
        ewfCrudService.changeElement(dataUrl, vm.assigningOptions)
            .then(applyAssigningOptions)
            .then(setViewMode);
    }
}
