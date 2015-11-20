import EwfShowSearchOnFocus from './ewf-show-search-on-focus-directive';
import EwfSearchController from './ewf-search-controller';
import 'angularMocks';

describe('ewfShowSearchOnFocus', () => {
    let sut;
    let $scope;
    let element;
    let attrs;
    let searchCtrl;
    let ngModelCtrl;
    let nlsServiceMock;

    function callPostLink() {
        sut.link.post($scope, element, attrs, [searchCtrl, ngModelCtrl]);
    }

    beforeEach(inject((_$rootScope_, _$q_) => {
        $scope = _$rootScope_.$new();

        attrs = {};
        attrs.ewfSearch = '{searchType: \'default\', fieldName: \'all\'}';

        ngModelCtrl = {};
        ngModelCtrl.$parsers = jasmine.createSpyObj('$parsers', ['unshift', 'push']);

        element = jasmine.createSpyObj('element', ['on']);

        $scope.$eval = jasmine.createSpy('$eval');
        $scope.$eval.and.returnValue({searchType: 'default', fieldName: 'all'});

        nlsServiceMock = jasmine.createSpyObj('nlsServiceMock', ['getTranslation']);

        searchCtrl = jasmine.mockComponent(
            new EwfSearchController($scope, attrs, _$q_, undefined, undefined, nlsServiceMock)
        );

        sut = new EwfShowSearchOnFocus();
    }));

    describe('#postLink', () => {
        it('should subscribe on onFocus event and add parsers', () => {

            callPostLink();

            expect(element.on).toHaveBeenCalled();
            expect(ngModelCtrl.$parsers.unshift).toHaveBeenCalled();
            expect(ngModelCtrl.$parsers.push).toHaveBeenCalled();
        });
    });
});
