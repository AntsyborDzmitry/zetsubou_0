import PackageDetailsService from './package-details-service';
import 'angularMocks';

describe('packageDetailsService', () => {
    let sut, logService;
    let $httpBackend;
    let $http;
    let $q;

    beforeEach(inject((_$http_, _$q_, _$httpBackend_) => {
        $httpBackend = _$httpBackend_;
        $http = _$http_;
        $q = _$q_;
        logService = jasmine.createSpyObj('logService', ['error']);

        sut = new PackageDetailsService($http, $q, logService);
    }));

    afterEach(() => {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    describe('#getPackagingDetails', () => {
        const shipmentType = 'documents';
        const shipmentCountry = 'US';
        const requestUrl = `/api/shipment/packaging/details/${shipmentCountry}/${shipmentType}`;

        it('should make API call to proper URL', () => {
            $httpBackend.whenGET(requestUrl).respond(401, 'some error');
            sut.getPackagingDetails(shipmentType, shipmentCountry);
            $httpBackend.flush();

            expect(logService.error).toHaveBeenCalledWith('Packaging details failed with some error');
        });

        it('excludes custom packagings', () => {
            spyOn($http, 'get');
            $http.get.and.returnValue($q.defer().promise);
            sut.getPackagingDetails(shipmentType, shipmentCountry, true);
            const params = {isCustomPackagesExcluded: true};

            expect($http.get).toHaveBeenCalledWith(requestUrl, {params});
        });
    });

    describe('#saveCustomPackaging', () => {
        const customPackaging = {name: 'custom'};
        it('should make API call to proper URL', () => {
            $httpBackend.whenPOST('/api/myprofile/packaging/custom').respond(401, 'some error');
            sut.saveCustomPackaging(customPackaging);
            $httpBackend.flush();

            expect(logService.error).toHaveBeenCalledWith('Saving package failed with some error');
        });
    });
});
