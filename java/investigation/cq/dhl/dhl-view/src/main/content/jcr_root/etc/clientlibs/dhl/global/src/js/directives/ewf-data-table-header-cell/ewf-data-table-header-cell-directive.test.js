import 'angularMocks';
import EwfDataTableHeaderCell from './ewf-data-table-header-cell-directive';
import EwfDataTableController from './../ewf-data-table/ewf-data-table-controller';

describe('ewfDataTableHeaderCell', () => {
    let sut;
    let $scope, ewfDataTableCtrl;

    function callSutPreLink() {
        sut.link.pre($scope, null, null, ewfDataTableCtrl);
    }

    beforeEach(inject(($rootScope) => {
        $scope = $rootScope.$new();

        ewfDataTableCtrl = jasmine.mockComponent(new EwfDataTableController($scope));

        sut = new EwfDataTableHeaderCell();
    }));

    describe('#preLink', () => {
        it('should set ewfDataTable controller instance to the scope', () => {
            callSutPreLink();
            expect($scope.ewfDataTableCtrl).toBe(ewfDataTableCtrl);
        });
    });
});
