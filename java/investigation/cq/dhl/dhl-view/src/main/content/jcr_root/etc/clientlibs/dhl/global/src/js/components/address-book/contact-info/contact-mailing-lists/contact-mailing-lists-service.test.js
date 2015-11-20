import ContactMailingListsService from './contact-mailing-lists-service';
import 'angularMocks';

describe('#ContactMailingListsService', function() {

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


        sut = new ContactMailingListsService($httpMock, $q, logServiceMock);
    }));

    it('getTypeaheadMailingLists should call for $http.get', () => {
        sut.getTypeaheadMailingLists();
        expect($httpMock.get).toHaveBeenCalled();
    });

    it('getTypeaheadMailingLists should call for $http.get and log error', () => {
        sut.getTypeaheadMailingLists();
        httpDefer.reject({});
        $timeout.flush();
        expect($httpMock.get).toHaveBeenCalled();
        expect(logServiceMock.error).toHaveBeenCalled();
    });
});
