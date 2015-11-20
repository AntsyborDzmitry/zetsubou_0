import './../../../services/ewf-crud-service';
import './../../../constants/system-settings-constants';

AddressEntryController.$inject = [
    '$scope',
    'ewfCrudService',
    'navigationService'
];

export default function AddressEntryController(
    $scope,
    ewfCrudService,
    navigationService) {
    const vm = this;
    const ADDRESS_ENTRY_URL_PARAMETER = 'addressEntry';

    Object.assign(vm, {
        residentialDefault: false,
        residentialDefaultCache: this.residentialDefault,
        isEditing: false,

        init,
        updateResidentialDefault,
        preloadSectionFromUrl,
        restoreDefaults,
        toggleLayout
    });

    function init() {
        // TODO: Update after backend is done
        ewfCrudService.getElementList('/api/myprofile/shipment/defaults/address')
            .then((response) => {
                vm.residentialDefaultCache = vm.residentialDefault = response.residentialDefault;
            });
    }

    function updateResidentialDefault() {
        // TODO: Update after backend is done
        ewfCrudService.updateElement('/api/myprofile/shipment/defaults/address', {
                residentialDefault: vm.residentialDefaultCache
            })
            .then((response) => {
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
        const currentSection = navigationService.getParamFromUrl('section');
        vm.isEditing = currentSection === ADDRESS_ENTRY_URL_PARAMETER;
    }
}
