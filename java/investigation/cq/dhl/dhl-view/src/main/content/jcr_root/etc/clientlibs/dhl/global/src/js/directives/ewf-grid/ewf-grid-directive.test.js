import ewfGrid from './ewf-grid-directive';
import 'angularMocks';

describe('', () => {
    let sut;
    let $scope;
    let elem;
    let attrs;
    let ewfGridCtrl;

    function callPostLink() {
        sut.link.post($scope, elem, attrs, [ewfGridCtrl]);
    }

    beforeEach(inject((_$rootScope_) => {
        $scope = _$rootScope_.$new();
        elem = {};
        attrs = {
            updateUrl: 'updateUrl',
            listUrl: 'listUrl',
            addUrl: 'addUrl',
            getUrl: 'getUrl',
            deleteUrl: 'deleteUrl'
        };
        ewfGridCtrl = jasmine.createSpyObj('ewfGridCtrl', ['gridInit']);

        sut = new ewfGrid();
    }));

    describe('#postLink', () => {
        it('should call init in grid controller', () => {
            callPostLink();

            expect(ewfGridCtrl.gridInit).toHaveBeenCalled();
        });
    });
});
