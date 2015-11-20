define(['exports', 'module', './../services/profile-shipment-service', './../../../services/navigation-service', 'angular'], function (exports, module, _servicesProfileShipmentService, _servicesNavigationService, _angular) {
    'use strict';

    module.exports = PickupsController;

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _angular2 = _interopRequireDefault(_angular);

    PickupsController.$inject = ['logService', '$q', 'profileShipmentService', '$filter', 'navigationService'];

    function PickupsController(logService, $q, profileShipmentService, $filter, navigationService) {
        var vm = this;
        var PICKUPS_URL_PARAMETER = 'pickups';

        _angular2['default'].extend(vm, {
            isEditing: false,
            tabIsEditing: false,
            rangeSliderOptions: {},
            pickupSettings: {
                pickupDefaultType: 'NONE',
                pickupDetails: {
                    pickupLocation: null,
                    pickupLocationType: 'NONE',
                    instructions: '',
                    pickupWindow: {
                        earliestTime: 0,
                        latestTime: 0
                    }
                }
            },

            init: init,
            objMerge: objMerge,
            savePickupsSettings: savePickupsSettings,
            preloadSectionFromUrl: preloadSectionFromUrl,
            toggleLayout: toggleLayout,
            toggleTabIsEditing: toggleTabIsEditing
        });

        function objMerge(obj, src) {
            logService.log(obj, src);
            for (var key in src) {
                if (src[key] !== obj[key] && src[key]) {
                    obj[key] = src[key];
                }
            }
            return obj;
        }

        function init() {
            return profileShipmentService.getPickupsData().then(function (response) {
                vm.pickupSettings = objMerge(vm.pickupSettings, response);
                var pickupLocations = vm.pickupSettings.pickupDetails.pickupLocation;

                var pickupAddress = [pickupLocations.addressLine, pickupLocations.city, pickupLocations.zipOrPostCode].filter(function (item) {
                    return !!item;
                }).join(', ');

                vm.pickupSettings.pickupAddress = pickupAddress;

                vm.rangeSliderOptions = {
                    min: 720,
                    max: 1200,
                    from: vm.pickupSettings.pickupDetails.pickupWindow.earliestTime,
                    to: vm.pickupSettings.pickupDetails.pickupWindow.latestTime,
                    type: 'double',
                    step: 15,
                    grid: true,
                    //We need this params with underscore, because there is a vendor range slider library
                    /*eslint-disable quote-props*/
                    'drag_interval': true,
                    'min_interval': 90,
                    'hide_min_max': true,
                    'grid_num': 4

                    /*eslint-enable quote-props*/
                };

                vm.rangeSliderOptions.onChange = function (val) {
                    vm.pickupSettings.pickupDetails.pickupWindow.earliestTime = val.from;
                    vm.pickupSettings.pickupDetails.pickupWindow.latestTime = val.to;
                };

                vm.rangeSliderOptions.prettify = function (value) {
                    var dateInstance = new Date(0);

                    dateInstance.setHours(Math.floor(value / 60));
                    dateInstance.setMinutes(value % 60);

                    return $filter('date')(dateInstance, 'shortTime').toLowerCase();
                };
            });
        }

        function savePickupsSettings(pickupsData) {
            return profileShipmentService.savePickupsData(pickupsData).then(function () {});
        }

        function preloadSectionFromUrl() {
            var currentSection = navigationService.getParamFromUrl('section');
            vm.isEditing = currentSection === PICKUPS_URL_PARAMETER;
        }

        function toggleLayout() {
            vm.isEditing = !vm.isEditing;
        }

        function toggleTabIsEditing() {
            vm.tabIsEditing = !vm.tabIsEditing;
        }
    }
});
//# sourceMappingURL=pickups-controller.js.map
