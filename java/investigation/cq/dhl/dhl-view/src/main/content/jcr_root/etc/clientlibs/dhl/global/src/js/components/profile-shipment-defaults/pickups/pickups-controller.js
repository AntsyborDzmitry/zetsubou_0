import './../services/profile-shipment-service';
import './../services/profile-shipment-service';
import './../../../services/navigation-service';
import angular from 'angular';

PickupsController.$inject = ['logService', '$q', 'profileShipmentService', '$filter', 'navigationService'];

export default function PickupsController(logService, $q, profileShipmentService, $filter, navigationService) {
    const vm = this;
    const PICKUPS_URL_PARAMETER = 'pickups';

    angular.extend(vm, {
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

        init,
        objMerge,
        savePickupsSettings,
        preloadSectionFromUrl,
        toggleLayout,
        toggleTabIsEditing
    });

    function objMerge(obj, src) {
        logService.log(obj, src);
        for (const key in src) {
            if (src[key] !== obj[key] && src[key]) {
                obj[key] = src[key];
            }
        }
        return obj;
    }

    function init() {
        return profileShipmentService.getPickupsData()
            .then((response) => {
                vm.pickupSettings = objMerge(vm.pickupSettings, response);
                const pickupLocations = vm.pickupSettings.pickupDetails.pickupLocation;

                const pickupAddress = [
                    pickupLocations.addressLine,
                    pickupLocations.city,
                    pickupLocations.zipOrPostCode
                ].filter((item) => !!item)
                .join(', ');

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

                vm.rangeSliderOptions.onChange = (val) => {
                    vm.pickupSettings.pickupDetails.pickupWindow.earliestTime = val.from;
                    vm.pickupSettings.pickupDetails.pickupWindow.latestTime = val.to;
                };

                vm.rangeSliderOptions.prettify = (value) => {
                    let dateInstance = new Date(0);

                    dateInstance.setHours(Math.floor(value / 60));
                    dateInstance.setMinutes(value % 60);

                    return $filter('date')(dateInstance, 'shortTime').toLowerCase();
                };
            });
    }

    function savePickupsSettings(pickupsData) {
        return profileShipmentService.savePickupsData(pickupsData)
            .then(() => {
            });
    }

    function preloadSectionFromUrl() {
        const currentSection = navigationService.getParamFromUrl('section');
        vm.isEditing = currentSection === PICKUPS_URL_PARAMETER;
    }

    function toggleLayout() {
        vm.isEditing = !vm.isEditing;
    }

    function toggleTabIsEditing() {
        vm.tabIsEditing = !vm.tabIsEditing;
    }
}
