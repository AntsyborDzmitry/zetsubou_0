import angular from 'angular';
import './../services/profile-shipment-service';

SomCurrencyController.$inject = ['profileShipmentService', 'navigationService'];

export default function SomCurrencyController(profileShipmentService, navigationService) {
    const vm = this;
    let initialSomAndCurrency = {};
    const SOM_CURRENCY_URL_PARAMETER = 'somCurrency';

    Object.assign(vm, {
        defaultSomAndCurrency: {},
        isEditing: false,
        serverErrorMessage: '',

        preloadDefaultSomAndCurrency,
        updateDefaultSomAndCurrency,
        //TODO: make single method for all sections
        preloadSectionFromUrl,
        toggleLayout,
        isSomList
    });

    function preloadDefaultSomAndCurrency() {
        profileShipmentService.getDefaultSomAndCurrency()
            .then((response) => {
                vm.defaultSomAndCurrency = response;
                initialSomAndCurrency = angular.copy(response);
            });
    }

    function updateDefaultSomAndCurrency() {
        profileShipmentService.updateDefaultSomAndCurrency({
            som: vm.defaultSomAndCurrency.som,
            defaultCurrency: vm.defaultSomAndCurrency.defaultCurrency,
            defaultInsuranceCurrency: vm.defaultSomAndCurrency.defaultInsuranceCurrency
        })
        .then(() => {
            vm.serverErrorMessage = '';
            vm.isEditing = false;
            initialSomAndCurrency = angular.copy(vm.defaultSomAndCurrency);
        })
        .catch((error) => {
            vm.serverErrorMessage = error.message;
        });
    }

    function toggleLayout() {
        if (vm.isEditing) {
            resetDefaultSomAndCurrency();
        }

        vm.isEditing = !vm.isEditing;
        vm.serverErrorMessage = '';
    }

    function isSomList() {
        return !!(vm.defaultSomAndCurrency && vm.defaultSomAndCurrency.somList);
    }

    function resetDefaultSomAndCurrency() {
        vm.defaultSomAndCurrency = angular.copy(initialSomAndCurrency);
    }

    function preloadSectionFromUrl() {
        const currentSection = navigationService.getParamFromUrl('section');
        vm.isEditing = currentSection === SOM_CURRENCY_URL_PARAMETER;
    }
}
