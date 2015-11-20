define(['exports', 'module', 'ewf'], function (exports, module, _ewf) {
    'use strict';

    module.exports = NotificationsDialogService;

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _ewf2 = _interopRequireDefault(_ewf);

    _ewf2['default'].service('notificationsDialogService', NotificationsDialogService);

    NotificationsDialogService.$inject = ['$http', '$q', 'logService'];

    function NotificationsDialogService($http, $q, logService) {

        var publicApi = {
            submitNotifications: submitNotifications,
            getDefaults: getDefaults
        };

        function submitNotifications(shipmentId, notifications) {
            var data = {
                emailNotificationItems: [],
                smsNotificationItems: []
            };
            notifications.forEach(function (notification) {
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
            return $http.post('/api/shipment/' + shipmentId + '/notification', data)['catch'](function (response) {
                logService.error(response);
                return $q.reject(response);
            });
        }

        function getDefaults() {
            return $http.get('/api/myprofile/notification/settings?fetchScope=RECIPIENT_NOTIFICATION').then(function (response) {
                return response.data;
            })['catch'](function (response) {
                logService.error(response);
                return $q.reject(response);
            });
        }

        return publicApi;
    }
});
//# sourceMappingURL=notifications-dialog-service.js.map
