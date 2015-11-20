import ProfileSettingsService from './profile-settings-service';
import 'angularMocks';

describe('profileSettingsService', () => {

    let sut, logService, getRequestDeferred;
    let $http, $q, $timeout;

    const QUICK_LINKS_ENDPOINT = '/api/myprofile/links';

    beforeEach(inject((_$q_, _$timeout_) => {
        $q = _$q_;
        $timeout = _$timeout_;

        getRequestDeferred = $q.defer();

        $http = {
            get: jasmine.createSpy('get').and.returnValue(getRequestDeferred.promise),
            post: jasmine.createSpy('post').and.returnValue(getRequestDeferred.promise)
        };

        logService = jasmine.createSpyObj('logService', ['error']);

        sut = new ProfileSettingsService($http, $q, logService);
    }));

    describe('#getAuthenticationDetails', () => {

            it('should call for $http.get', () => {
                sut.getAuthenticationDetails();
                expect($http.get).toHaveBeenCalled();
            });

            it('should load contact details ', () => {
                const successResponse = {
                    status: 200,
                    data: {
                        userName: 's@t.com',
                        groups: ['regular'],
                        countryCode2: 'US',
                        countryCode3: 'USA',
                        personaType: 'Novice'
                    }
                };

                sut.getAuthenticationDetails()
                    .then((response) => {
                        expect(response).toBe(successResponse.data);
                        expect(logService.error).not.toHaveBeenCalled();
                    });

                getRequestDeferred.resolve(successResponse);

                $timeout.flush();

            });

            it('should log error when load data failed', () => {
                const errorResponse = {
                    status: 403,
                    data: {
                        message: 'fail'
                    }
                };

                sut.getAuthenticationDetails()
                    .then((response) => {
                        expect(response).toBe(errorResponse.data);
                        expect(logService.error).toHaveBeenCalled();
                    });

                getRequestDeferred.reject(errorResponse);

                $timeout.flush();
            });
        });

    describe('#updateProfilePassword', () => {
        it('should send post method', () => {
            const endpointUrl = '/api/myprofile/password/change';

            const oldPassword = 'test';
            const newPassword = 'test';
            const credentials = {
                currentPassword: oldPassword,
                newPassword
            };

            sut.updateProfilePassword(credentials);
            expect($http.post).toHaveBeenCalledWith(endpointUrl, credentials);
        });
    });

    describe('#getQuickLinks', () => {

        it('should call for $http.get', () => {
            sut.getQuickLinks();
            expect($http.get).toHaveBeenCalledWith(QUICK_LINKS_ENDPOINT);
        });

        it('should load contact details ', () => {
            const successResponse = {
                status: 200,
                data: [{key: '0d3b681c-4104-4b15-ad44-4d45549b18a6', name: 'asdasd', url: 'http://cdscsr.csd'}]
            };

            sut.getQuickLinks()
                .then((response) => {
                    expect(response).toBe(successResponse.data);
                    expect(logService.error).not.toHaveBeenCalled();
                });

            getRequestDeferred.resolve(successResponse);

            $timeout.flush();
        });

        it('should log error when load data failed', () => {
            const errorResponse = {
                status: 403,
                data: {
                    message: 'fail'
                }
            };

            sut.getQuickLinks()
                .then((response) => {
                    expect(response).toBe(errorResponse.data);
                    expect(logService.error).toHaveBeenCalled();
                });

            getRequestDeferred.reject(errorResponse);

            $timeout.flush();
        });
    });
});
