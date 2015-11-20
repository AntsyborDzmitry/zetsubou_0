import EwfDataTableHeaderCellController from './ewf-data-table-header-cell-controller';
import EwfDataTableController from './../ewf-data-table/ewf-data-table-controller';

describe('EwfDataTableHeaderCellController', () => {
    let sut;
    let $scope;
    let ewfDataTableCtrl;

    beforeEach(inject(($rootScope) => {
        ewfDataTableCtrl = jasmine.mockComponent(new EwfDataTableController($rootScope.$new()));

        $scope = $rootScope.$new();
        Object.assign($scope, {
            property: 'property1',
            ewfDataTableCtrl
        });

        sut = new EwfDataTableHeaderCellController($scope);
    }));

    describe('#handleClick', () => {
        it('should set asc sorting on first click', () => {
            sut.handleClick();

            const expectedSorting = {
                property: $scope.property,
                direction: 'asc'
            };

            expect(ewfDataTableCtrl.setSorting).toHaveBeenCalledWith(expectedSorting);
        });

        it('should set desc sorting on second click', () => {
            const initialSorting = {
                property: $scope.property,
                direction: 'asc'
            };

            ewfDataTableCtrl.getSorting.and.returnValue(initialSorting);
            sut.handleClick();

            const expectedSorting = {
                property: $scope.property,
                direction: 'desc'
            };

            expect(ewfDataTableCtrl.setSorting).toHaveBeenCalledWith(expectedSorting);
        });
    });

    describe('#getClasses', () => {
        it('should get current sorting from data table controller', () => {
            sut.getClasses();

            expect(ewfDataTableCtrl.getSorting).toHaveBeenCalled();
        });

        it('should return "" at if current property is not sorted', () => {
            const expectedClasses = {
                current: false,
                ascending: false,
                descending: false
            };

            expect(sut.getClasses()).toEqual(expectedClasses);
        });

        it('should return "current ascending" on first click', () => {
            const initialSorting = {
                property: $scope.property,
                direction: 'asc'
            };

            ewfDataTableCtrl.getSorting.and.returnValue(initialSorting);

            const expectedClasses = {
                current: true,
                ascending: true,
                descending: false
            };

            expect(sut.getClasses()).toEqual(expectedClasses);
        });

        it('should return "current descending" on second click', () => {
            const initialSorting = {
                property: $scope.property,
                direction: 'desc'
            };

            ewfDataTableCtrl.getSorting.and.returnValue(initialSorting);

            const expectedClasses = {
                current: true,
                ascending: false,
                descending: true
            };

            expect(sut.getClasses()).toEqual(expectedClasses);
        });
    });
});
