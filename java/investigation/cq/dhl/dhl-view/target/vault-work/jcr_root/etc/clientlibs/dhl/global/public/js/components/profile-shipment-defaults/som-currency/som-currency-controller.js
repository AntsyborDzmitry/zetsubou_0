define(['exports', 'module', 'angular', './../services/profile-shipment-service'], function (exports, module, _angular, _servicesProfileShipmentService) {
    'use strict';

    module.exports = SomCurrencyController;

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _angular2 = _interopRequireDefault(_angular);

    SomCurrencyController.$inject = ['profileShipmentService', 'navigationService'];

    function SomCurrencyController(profileShipmentService, navigationService) {
        var vm = this;
        var initialSomAndCurrency = {};
        var SOM_CURRENCY_URL_PARAMETER = 'somCurrency';

        Object.assign(vm, {
            defaultSomAndCurrency: {},
            isEditing: false,
            serverErrorMessage: '',

            preloadDefaultSomAndCurrency: preloadDefaultSomAndCurrency,
            updateDefaultSomAndCurrency: updateDefaultSomAndCurrency,
            //TODO: make single method for all sections
            preloadSectionFromUrl: preloadSectionFromUrl,
            toggleLayout: toggleLayout,
            isSomList: isSomList
        });

        function preloadDefaultSomAndCurrency() {
            profileShipmentService.getDefaultSomAndCurrency().then(function (response) {
                vm.defaultSomAndCurrency = response;
                initialSomAndCurrency = _angular2['default'].copy(response);
            });
        }

        function updateDefaultSomAndCurrency() {
            profileShipmentService.updateDefaultSomAndCurrency({
                som: vm.defaultSomAndCurrency.som,
                defaultCurrency: vm.defaultSomAndCurrency.defaultCurrency,
                defaultInsuranceCurrency: vm.defaultSomAndCurrency.defaultInsuranceCurrency
            }).then(function () {
                vm.serverErrorMessage = '';
                vm.isEditing = false;
                initialSomAndCurrency = _angular2['default'].copy(vm.defaultSomAndCurrency);
            })['catch'](function (error) {
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
            vm.defaultSomAndCurrency = _angular2['default'].copy(initialSomAndCurrency);
        }

        function preloadSectionFromUrl() {
            var currentSection = navigationService.getParamFromUrl('section');
            vm.isEditing = currentSection === SOM_CURRENCY_URL_PARAMETER;
        }
    }
});
//# sourceMappingURL=som-currency-controller.js.map
