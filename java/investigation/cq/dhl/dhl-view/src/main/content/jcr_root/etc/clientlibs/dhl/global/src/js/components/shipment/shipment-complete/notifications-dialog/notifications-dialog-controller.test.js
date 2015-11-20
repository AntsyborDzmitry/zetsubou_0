import NotificationsDialogController from './notifications-dialog-controller';
import NotificationsDialogService from './notifications-dialog-service';
import NavigationService from './../../../../services/navigation-service';
import 'angularMocks';

describe('NotificationsDialogController', () => {
    const shipmentId = 1;

    const notificationDefaults = {
        smsNotificationSettings: {
            pickup: false,
            clearanceDelay: true,
            customsClearance: false,
            exception: false,
            outForDelivery: false,
            delivered: true
        },
        emailNotificationSettings: {
            pickup: false,
            clearanceDelay: true,
            customsClearance: false,
            exception: false,
            outForDelivery: false,
            delivered: true
        }
    };

    const defaultEmailNotification = {
        type: 'email',
        settings: notificationDefaults.emailNotificationSettings
    };

    let sut;
    let $q;
    let $timeout;
    let navigationService;
    let notificationsDialogService;
    let submitNotificationsDeferred;
    let getDefaultsDeferred;
    let $scope;

    beforeEach(inject(($rootScope, _$q_, _$timeout_) => {
        $q = _$q_;
        $timeout = _$timeout_;

        navigationService = jasmine.mockComponent(new NavigationService());
        navigationService.getParamFromUrl.and.returnValue(shipmentId);

        notificationsDialogService = jasmine.mockComponent(new NotificationsDialogService());

        submitNotificationsDeferred = $q.defer();
        notificationsDialogService.submitNotifications.and.returnValue(submitNotificationsDeferred.promise);
        getDefaultsDeferred = $q.defer();
        notificationsDialogService.getDefaults.and.returnValue(getDefaultsDeferred.promise);

        $scope = $rootScope.$new();
        $scope.notificationsForm = {};
        $scope.ewfModalCtrl = jasmine.createSpyObj('ewfModalCtrl', ['close', 'dismiss']);

        sut = new NotificationsDialogController($scope, navigationService, notificationsDialogService);
    }));

    describe('constructor', () => {
        it('should add empty notification to notifications', () => {
            getDefaultsDeferred.resolve(notificationDefaults);
            $timeout.flush();
            expect(sut.notifications).toEqual([defaultEmailNotification]);
        });
    });

    describe('interaction with notifications', () => {
        beforeEach(() => {
            getDefaultsDeferred.resolve(notificationDefaults);
            $timeout.flush();
        });

        describe('#addNotification', () => {
            beforeEach(() => {
                sut.addNotification();
            });

            it('should add default notification to notifications', () => {
                expect(sut.notifications[1]).toEqual(defaultEmailNotification);
            });
        });

        describe('#deleteNotification', () => {
            beforeEach(() => {
                sut.deleteNotification(0);
            });

            it('should delete notification by index', () => {
                expect(sut.notifications).toEqual([]);
            });
        });

        describe('#onNotificationTypeChange', () => {
            it('should switch to sms notification defaults', () => {
                let testedNotification = sut.notifications[0];
                testedNotification.type = 'sms';
                sut.onNotificationTypeChange(testedNotification);
                expect(testedNotification.settings).toEqual(notificationDefaults.smsNotificationSettings);
            });
        });
    });

    describe('#submitNotifications', () => {
        describe('success handling', () => {
            beforeEach(() => {
                sut.submitNotifications();
                submitNotificationsDeferred.resolve();

                $timeout.flush();
            });

            it('should set $submitted property of the notificationsForm to true', () => {
                expect($scope.notificationsForm.$submitted).toBe(true);
            });

            it('should call submitNotifications method of notificationsDialogService', () => {
                expect(notificationsDialogService.submitNotifications)
                    .toHaveBeenCalledWith(shipmentId, sut.notifications);
            });

            it('should close dialog', () => {
                expect($scope.ewfModalCtrl.close).toHaveBeenCalled();
            });
        });

        describe('error handling', () => {
            beforeEach(() => {
                sut.submitNotifications();
                submitNotificationsDeferred.reject();

                $timeout.flush();
            });

            it('should set error value', () => {
                expect(sut.error)
                    .toBe('shipment.shipment_complete_notifications_dialog_submit_error');
            });
        });

        describe('validation handling', () => {
            beforeEach(() => {
                $scope.notificationsForm.$invalid = true;
                sut.submitNotifications();
            });

            it('should set $submitted property of the notificationsForm to true', () => {
                expect($scope.notificationsForm.$submitted).toBe(true);
            });

            it('should not submit notifications when form is invalid', () => {
                expect(notificationsDialogService.submitNotifications).not.toHaveBeenCalled();
            });
        });
    });

    describe('#getFieldError', () => {
        it('should return the first actual error from $error object of the ng-form field', () => {
            const field = {
                $error: {
                    required: false,
                    email: true,
                    pattern: true
                }
            };

            expect(sut.getFieldError(field)).toBe('email');
        });
    });
});
