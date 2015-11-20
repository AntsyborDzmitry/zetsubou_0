import ProfileRewardsController from './profile-rewards-controller';
import EwfCrudService from './../../../services/ewf-crud-service';
import 'angularMocks';

describe('ProfileRewardsController', () => {
    let sut, $q, $timeout, $scope, deferred;
    let logServiceMock, ewfCrudServiceMock;

    beforeEach(inject((_$q_, _$timeout_, _$rootScope_) => {
        $q = _$q_;
        $timeout = _$timeout_;
        $scope = _$rootScope_.$new();
        deferred = $q.defer();

        ewfCrudServiceMock = jasmine.mockComponent(new EwfCrudService());

        ewfCrudServiceMock.getElementDetails.and.returnValue(deferred.promise);
        ewfCrudServiceMock.updateElement.and.returnValue(deferred.promise);
        logServiceMock = jasmine.createSpyObj('logService', ['log', 'error']);

        sut = new ProfileRewardsController($scope, $q, ewfCrudServiceMock, logServiceMock);
    }));

    it('should check if service is called', () => {
        const successResponse = {
            status: 200,
            userName: 'Anonymous',
            rewardsCardNumber: '1111111198267777',
            replace: () => {}
        };
        spyOn(successResponse, 'replace').and.returnValue({replace: () => {
            return successResponse.rewardsCardNumber;
        }});
        deferred.resolve(successResponse);
        $timeout.flush();
        expect(ewfCrudServiceMock.getElementDetails).toHaveBeenCalled();
        expect(sut.profileReward).toBe(successResponse.rewardsCardNumber);
    });

    it('should display error if service failed', () => {
        const rejectResponse = {
            status: 500,
            data: {
                message: 'fail'
            },
            replace: () => {}
        };
        deferred.reject(rejectResponse);
        $timeout.flush();
        expect(ewfCrudServiceMock.getElementDetails).toHaveBeenCalled();
        expect(logServiceMock.error).toHaveBeenCalled();
    });

    it('should check if reward number updated', () => {
        const successResponse = {
            status: 200,
            userName: 'Anonymous',
            rewardsCardNumber: '1111111198267777',
            replace: () => {}
        };
        spyOn(successResponse, 'replace').and.returnValue({replace: () => {
            return successResponse.rewardsCardNumber;
        }});
        sut.updateRewardNumber();

        deferred.resolve(successResponse);
        $timeout.flush();
        expect(ewfCrudServiceMock.updateElement).toHaveBeenCalled();

        expect(sut.rewardNumberResponse).toBe(successResponse);
    });
});
