import NotificationsDialogService from './notifications-dialog-service';
import 'angularMocks';

describe('notificationsDialogService', () => {
    const shipmentId = 1;

    let sut;
    let $q;
    let $http;
    let $httpBackend;
    let logService;

    beforeEach(inject((_$http_, _$httpBackend_, _$q_) => {
        $q = _$q_;
        $http = _$http_;
        $httpBackend = _$httpBackend_;

        logService = jasmine.createSpyObj('logService', ['error']);

        sut = new NotificationsDialogService($http, $q, logService);
    }));

    afterEach(() => {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    describe('#submitNotifications', () => {
        const url = `/api/shipment/${shipmentId}/notification`;

        let resolved, error;

        beforeEach(() => {
            const notifications = [
                {
                    type: 'email',
                    email: 'mail@example.com',
                    settings: {
                        pickup: false,
                        clearanceDelay: true,
                        customsClearance: false,
                        exception: false,
                        outForDelivery: false,
                        delivered: true
                    }
                },
                {
                    type: 'sms',
                    phoneCode: '1',
                    phone: '(111) 111-1111',
                    settings: {
                        pickup: false,
                        clearanceDelay: true,
                        customsClearance: false,
                        exception: false,
                        outForDelivery: false,
                        delivered: true
                    }
                }
            ];
            sut.submitNotifications(shipmentId, notifications)
                .then(() => {
                    resolved = true;
                })
                .catch((err) => {
                    error = err;
                });
        });

        it('should post valid data', () => {
            const expectedData = {
                emailNotificationItems: [
                    {
                        email: 'mail@example.com',
                        notificationEvents: {
                            pickup: false,
                            clearanceDelay: true,
                            customsClearance: false,
                            exception: false,
                            outForDelivery: false,
                            delivered: true
                        }
                    }
                ],
                smsNotificationItems: [
                    {
                        phoneCountryCode: '1',
                        phone: '(111) 111-1111',
                        notificationEvents: {
                            pickup: false,
                            clearanceDelay: true,
                            customsClearance: false,
                            exception: false,
                            outForDelivery: false,
                            delivered: true
                        }
                    }
                ]
            };

            $httpBackend.expectPOST(url, expectedData).respond(200);
            $httpBackend.flush();

            expect(resolved).toBeTruthy();
        });

        describe('error handling', () => {
            const err = {
                status: 400,
                data: 'Bad request'
            };

            beforeEach(() => {
                $httpBackend.whenPOST(url).respond(err.status, err.data);
                $httpBackend.flush();
            });

            it('should log error', () => {
                expect(logService.error).toHaveBeenCalledWith(jasmine.objectContaining(err));
            });

            it('should return error', () => {
                expect(error).toEqual(jasmine.objectContaining(err));
            });
        });
    });

    describe('#getDefaults', () => {
        const getDefaultsUrl = '/api/myprofile/notification/settings?fetchScope=RECIPIENT_NOTIFICATION';

        const expectedDefaultsResponse = {
            data: {
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
            }
        };

        it('should call correct url', () => {
            spyOn($http, 'get').and.returnValue($q.when(expectedDefaultsResponse));
            sut.getDefaults();

            expect($http.get).toHaveBeenCalledWith(getDefaultsUrl);
        });

        it('should process data response correctly', () => {
            $httpBackend.whenGET(getDefaultsUrl).respond(200, expectedDefaultsResponse);
            const getDefaultsPromise = sut.getDefaults();

            getDefaultsPromise.then((response) => {
                expect(response).toEqual(expectedDefaultsResponse);
            });
            $httpBackend.flush();
        });

        it('should handle error response correctly', () => {
            const errorResponse = 'bad request';
            $httpBackend.whenGET(getDefaultsUrl).respond(422, errorResponse);
            const getDefaultsPromise = sut.getDefaults();

            getDefaultsPromise.catch((err) => {
                expect(err).toEqual(jasmine.objectContaining({data: errorResponse}));
            });
            $httpBackend.flush();
        });
    });
});
