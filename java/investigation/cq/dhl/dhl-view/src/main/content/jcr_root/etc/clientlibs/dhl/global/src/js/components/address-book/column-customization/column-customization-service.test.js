import ColumnCustomizationService from './column-customization-service';
import 'angularMocks';

describe('#ColumnCustomizationService', function() {

    let sut, logServiceMock;
    let $httpMock, $q, $timeout, httpDefer;

    beforeEach(inject((_$q_, _$timeout_) => {
        $q = _$q_;
        $timeout = _$timeout_;
        httpDefer = $q.defer();

        logServiceMock = jasmine.createSpyObj('logService', ['log', 'error']);
        $httpMock = jasmine.createSpyObj('$http', ['get', 'post']);

        $httpMock.get.and.returnValue(httpDefer.promise);
        $httpMock.post.and.returnValue(httpDefer.promise);


        sut = new ColumnCustomizationService($httpMock, $q, logServiceMock);
    }));

    it('getColumnsInfo should call for $http.get', () => {
        sut.getColumnsInfo();
        expect($httpMock.get).toHaveBeenCalled();
    });

    it('getColumnsInfo should call for $http.get and log error', () => {
        sut.getColumnsInfo();
        httpDefer.reject({});
        $timeout.flush();
        expect($httpMock.get).toHaveBeenCalled();
        expect(logServiceMock.error).toHaveBeenCalled();
    });

    it('updateColumnsInfo should call for $http.post', () => {
        sut.updateColumnsInfo();
        expect($httpMock.post).toHaveBeenCalled();
    });

    it('updateColumnsInfo should call for $http.post and log error', () => {
        sut.updateColumnsInfo();
        httpDefer.reject({});
        $timeout.flush();
        expect($httpMock.post).toHaveBeenCalled();
        expect(logServiceMock.error).toHaveBeenCalled();
    });
});
