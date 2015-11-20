import './notifications-dialog-service';
import './../../../../services/navigation-service';
import './../../../../directives/ewf-non-empty-validator/ewf-non-empty-validator-directive';

NotificationsDialogController.$inject = ['$scope', 'navigationService', 'notificationsDialogService'];

export default function NotificationsDialogController($scope, navigationService, notificationsDialogService) {
    const vm = this;

    Object.assign(vm, {
        addNotification,
        onNotificationTypeChange,
        deleteNotification,
        submitNotifications,
        getFieldError
    });

    const shipmentId = navigationService.getParamFromUrl('shipmentId');

    const defaultAlerts = {
        pickup: false,
        clearanceDelay: false,
        customsClearance: false,
        exception: false,
        outForDelivery: false,
        delivered: false
    };

    const defaultEmailNotification = {
        type: 'email',
        settings: defaultAlerts
    };

    const defaultSmsNotification = {
        type: 'sms',
        settings: defaultAlerts
    };

    init();

    function init() {
        notificationsDialogService.getDefaults()
            .then((data) => {
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
        const defaultNotification = notification.type === 'email' ? defaultEmailNotification : defaultSmsNotification;
        notification.settings = angular.copy(defaultNotification.settings);
    }

    function submitNotifications() {
        $scope.notificationsForm.$submitted = true;
        if ($scope.notificationsForm.$invalid) {
            return;
        }
        notificationsDialogService.submitNotifications(shipmentId, vm.notifications)
            .then(() => {
                $scope.ewfModalCtrl.close();
            })
            .catch(() => {
                vm.error = 'shipment.shipment_complete_notifications_dialog_submit_error';
            });
    }

    function getFieldError(field) {
        return field.$error && Object.keys(field.$error).find((key) => field.$error[key]);
    }
}
