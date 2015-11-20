import ewf from 'ewf';

ewf.service('notificationsDialogService', NotificationsDialogService);

NotificationsDialogService.$inject = ['$http', '$q', 'logService'];

export default function NotificationsDialogService($http, $q, logService) {

    const publicApi = {
        submitNotifications,
        getDefaults
    };

    function submitNotifications(shipmentId, notifications) {
        const data = {
            emailNotificationItems: [],
            smsNotificationItems: []
        };
        notifications.forEach((notification) => {
            switch (notification.type) {
                case 'email':
                    data.emailNotificationItems.push({
                        email: notification.email,
                        notificationEvents: notification.settings
                    });
                    break;
                case 'sms':
                    data.smsNotificationItems.push({
                        phoneCountryCode: notification.phoneCode,
                        phone: notification.phone,
                        notificationEvents: notification.settings
                    });
                    break;
            }
        });
        return $http.post(`/api/shipment/${shipmentId}/notification`, data)
            .catch((response) => {
                logService.error(response);
                return $q.reject(response);
            });
    }

    function getDefaults() {
        return $http.get(`/api/myprofile/notification/settings?fetchScope=RECIPIENT_NOTIFICATION`)
            .then((response) => response.data)
            .catch((response) => {
                logService.error(response);
                return $q.reject(response);
            });
    }

    return publicApi;
}
