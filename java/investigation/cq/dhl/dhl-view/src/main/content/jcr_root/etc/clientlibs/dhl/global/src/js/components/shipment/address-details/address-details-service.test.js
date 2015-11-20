import addressDetailsService from './address-details-service';
import 'angularMocks';
/*eslint-disable */
describe('addressDetailsService', function() {

    let sut, getRequestDeferred;
    let $http, $q;

    beforeEach(inject((_$q_) => {
        $q = _$q_;

        getRequestDeferred = $q.defer();

        $http = {
            get: jasmine.createSpy('get').and.returnValue(getRequestDeferred.promise)
        };

        sut = new addressDetailsService($http, $q);
    }));

    //describe('#checkUserCanImport', function () {
    //
    //    it('should call for $http.get', function () {
    //        sut.checkUserCanImport();
    //        expect($http.get).toHaveBeenCalled();
    //    });
    //
    //    it('should call proper endpoint with needed data', function () {
    //
    //        const fromCountryCode = 'US';
    //        const toCountryCode = 'UA';
    //        const importAccountNumber = '123456789';
    //
    //        const expectedUrl = `/api/account/can_import/${fromCountryCode}/${toCountryCode}/${importAccountNumber}`;
    //
    //        sut.checkUserCanImport(fromCountryCode, toCountryCode, importAccountNumber);
    //
    //        expect($http.get).toHaveBeenCalledWith(expectedUrl);
    //
    //    });
    //});
});
