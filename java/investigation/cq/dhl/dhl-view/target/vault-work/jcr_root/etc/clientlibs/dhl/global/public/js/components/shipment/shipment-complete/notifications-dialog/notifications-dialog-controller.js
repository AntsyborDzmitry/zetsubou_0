define(['exports', 'module', './notifications-dialog-service', './../../../../services/navigation-service', './../../../../directives/ewf-non-empty-validator/ewf-non-empty-validator-directive'], function (exports, module, _notificationsDialogService, _servicesNavigationService, _directivesEwfNonEmptyValidatorEwfNonEmptyValidatorDirective) {
    'use strict';

    module.exports = NotificationsDialogController;

    NotificationsDialogController.$inject = ['$scope', 'navigationService', 'notificationsDialogService'];

    function NotificationsDialogController($scope, navigationService, notificationsDialogService) {
        var vm = this;

        Object.assign(vm, {
            addNotification: addNotification,
            onNotificationTypeChange: onNotificationTypeChange,
            deleteNotification: deleteNotification,
            submitNotifications: submitNotifications,
            getFieldError: getFieldError
        });

        var shipmentId = navigationService.getParamFromUrl('shipmentId');

        var defaultAlerts = {
            pickup: false,
            clearanceDelay: false,
            customsClearance: false,
            exception: false,
            outForDelivery: false,
            delivered: false
        };

        var defaultEmailNotification = {
            type: 'email',
            settings: defaultAlerts
        };

        var defaultSmsNotification = {
            type: 'sms',
            settings: defaultAlerts
        };

        init();

        function init() {
            notificationsDialogService.getDefaults().then(function (data) {
                defaultEmailNotification.settings = data.emailNotificationSettings;
                defaultSmsNotification.settings = data.smsNotificationSettings;
                vm.notifications = [createNotification()];
            });
        }

        function createNotification() {
            return angular.copy(defaultEmailNotification);
        }

        function addNotification() {
            vm.notifications.push(createNotification());
        }

        function deleteNotification($index) {
            vm.notifications.splice($index, 1);
        }

        function onNotificationTypeChange(notification) {
            var defaultNotification = notification.type === 'email' ? defaultEmailNotification : defaultSmsNotification;
            notification.settings = angular.copy(defaultNotification.settings);
        }

        function submitNotifications() {
            $scope.notificationsForm.$submitted = true;
            if ($scope.notificationsForm.$invalid) {
                return;
            }
            notificationsDialogService.submitNotifications(shipmentId, vm.notifications).then(function () {
                $scope.ewfModalCtrl.close();
            })['catch'](function () {
                vm.error = 'shipment.shipment_complete_notifications_dialog_submit_error';
            });
        }

        function getFieldError(field) {
            return field.$error && Object.keys(field.$error).find(function (key) {
                return field.$error[key];
            });
        }
    }
});
//# sourceMappingURL=notifications-dialog-controller.js.map
