import EwfLogout from './logout-directive';
import LogoutController from './logout-controller';
import 'angularMocks';

describe('ewfShipment', () => {
    let sut;
    let $scope;
    let elem;
    let attrs;
    let logoutCtrl;

    function callPostLink() {
        sut.link.post($scope, elem, attrs, logoutCtrl);
    }

    beforeEach(inject((_$rootScope_) => {
        $scope = _$rootScope_.$new();
        elem = jasmine.createSpyObj('elem', ['bind']);
        attrs = {};
        logoutCtrl = new LogoutController();
        spyOn(logoutCtrl, 'onElementClick');

        sut = new EwfLogout();
    }));

    describe('#postLink', () => {
        it('should bind click for an element', () => {
            callPostLink();

            expect(elem.bind).toHaveBeenCalledWith('click', logoutCtrl.onElementClick);
        });
    });
});
