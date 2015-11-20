import angular from 'angular';
import './../../../../services/location-service';

EwfContactNotificationsInfoController.$inject = ['$scope', '$attrs', 'attrsService', 'locationService'];

export default function EwfContactNotificationsInfoController($scope, $attrs, attrsService, locationService) {
    const vm = this;

    const initNotificationSetting = {
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

         addRepeaterItem,
         removeRepeaterItem,
         phoneCodeSelected,
         getPhoneCodes,
         init,
         toggleLayout,
         toggleHelpActive,
         clearDestination,
         canAddContactNotification
     });

    attrsService.track($scope, $attrs, 'notificationSettings', vm.attributes);

    function init() {
        getPhoneCodes();
    }

    function addRepeaterItem() {
        vm.attributes.notificationSettings.push(angular.copy(initNotificationSetting));
    }

    function removeRepeaterItem(notificationIndex) {
        const index = vm.attributes.notificationSettings.indexOf(notificationIndex);
        vm.attributes.notificationSettings.splice(index, 1);
    }

    function phoneCodeSelected(selectedItem, indexOfelement) {
        vm.attributes.notificationSettings[indexOfelement].phoneCountryCode = selectedItem.phoneCode;
    }

    function getPhoneCodes() {
        locationService.loadAvailableLocations()
            .then((data) => {
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
            const isEveryNotificationFilled = vm.attributes.notificationSettings.every((notification) => {
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
