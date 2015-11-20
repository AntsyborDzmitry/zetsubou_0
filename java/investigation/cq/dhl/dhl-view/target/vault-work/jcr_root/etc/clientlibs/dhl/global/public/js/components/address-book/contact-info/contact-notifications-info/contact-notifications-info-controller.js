define(['exports', 'module', 'angular', './../../../../services/location-service'], function (exports, module, _angular, _servicesLocationService) {
    'use strict';

    module.exports = EwfContactNotificationsInfoController;

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _angular2 = _interopRequireDefault(_angular);

    EwfContactNotificationsInfoController.$inject = ['$scope', '$attrs', 'attrsService', 'locationService'];

    function EwfContactNotificationsInfoController($scope, $attrs, attrsService, locationService) {
        var vm = this;

        var initNotificationSetting = {
            type: 'EMAIL',
            destination: '',
            language: 'en',
            notificationEvents: {
                pickup: false,
                clearanceDelay: false,
                customsClearance: false,
                exception: false,
                outForDelivery: false,
                delivered: false
            }
        };

        Object.assign(vm, {
            attributes: {},
            notificationTypes: ['EMAIL', 'SMS'],
            isEditing: false,
            helpActive: {},

            addRepeaterItem: addRepeaterItem,
            removeRepeaterItem: removeRepeaterItem,
            phoneCodeSelected: phoneCodeSelected,
            getPhoneCodes: getPhoneCodes,
            init: init,
            toggleLayout: toggleLayout,
            toggleHelpActive: toggleHelpActive,
            clearDestination: clearDestination,
            canAddContactNotification: canAddContactNotification
        });

        attrsService.track($scope, $attrs, 'notificationSettings', vm.attributes);

        function init() {
            getPhoneCodes();
        }

        function addRepeaterItem() {
            vm.attributes.notificationSettings.push(_angular2['default'].copy(initNotificationSetting));
        }

        function removeRepeaterItem(notificationIndex) {
            var index = vm.attributes.notificationSettings.indexOf(notificationIndex);
            vm.attributes.notificationSettings.splice(index, 1);
        }

        function phoneCodeSelected(selectedItem, indexOfelement) {
            vm.attributes.notificationSettings[indexOfelement].phoneCountryCode = selectedItem.phoneCode;
        }

        function getPhoneCodes() {
            locationService.loadAvailableLocations().then(function (data) {
                vm.attributes.countryCodes = data;
            });
        }

        function toggleLayout() {
            vm.isEditing = !vm.isEditing;
        }

        function toggleHelpActive(sliderIndex) {
            vm.helpActive[sliderIndex] = !vm.helpActive[sliderIndex];
        }

        function clearDestination(notification) {
            notification.destination = '';
        }

        function canAddContactNotification(contactNotificationsInfoForm) {
            if (contactNotificationsInfoForm && contactNotificationsInfoForm.$valid) {
                var isEveryNotificationFilled = vm.attributes.notificationSettings.every(function (notification) {
                    if (notification.type === 'EMAIL') {
                        return notification.destination !== '';
                    }

                    if (notification.type === 'SMS') {
                        return notification.destination !== '' && notification.phoneCountryCode !== '';
                    }

                    return false;
                });
                return isEveryNotificationFilled;
            }
            return false;
        }
    }
});
//# sourceMappingURL=contact-notifications-info-controller.js.map
