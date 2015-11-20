import './saving-shipments-directive';
import './../services/profile-shipment-service';
import './../../../services/navigation-service';

SavingShipmentsController.$inject = ['profileShipmentService', 'navigationService'];

export default function SavingShipmentsController(profileShipmentService, navigationService) {
    const vm = this;
    const SAVING_SHIPMENTS_URL_PARAMETER = 'savingShipments';

    angular.extend(vm, {
        isEditing: false,
        saveIncompleteSavings: false,

        preloadDefaultSavingShipment,
        updateDefaultSavingShipment,
        toggleLayout,
        preloadSectionFromUrl,
        resetChanges,
        exitFromEditing
    });

    function preloadDefaultSavingShipment() {
        profileShipmentService.getDefaultSavingShipment()
            .then((data) => {
                vm.serverData = vm.saveIncompleteSavings = data.saveIncompleteSavings;
            });
    }

    function updateDefaultSavingShipment() {
        profileShipmentService.updateDefaultSavingShipment({saveIncompleteSavings: vm.saveIncompleteSavings});
        vm.toggleLayout();
        vm.serverData = vm.saveIncompleteSavings;
    }

    function preloadSectionFromUrl() {
        const currentSection = navigationService.getParamFromUrl('section');
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
