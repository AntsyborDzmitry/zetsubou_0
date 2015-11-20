import 'angularMocks';
import EwfDataTableController from './ewf-data-table-controller';

describe('EwfDataTableController', () => {
    let sut;
    let $scope;

    beforeEach(inject(($rootScope) => {
        $scope = $rootScope.$new();

        sut = new EwfDataTableController($scope);
    }));

    describe('#setData', () => {
        it('should set data object', () => {
            const data = [
                {
                    prop: 'val'
                }
            ];
            sut.setData(data);

            expect(sut.getViewData()).toEqual(data);
        });
    });

    describe('#getSorting', () => {
        const sorting = {
            property: 'prop1',
            sorting: 'desc'
        };

        it('should get sorting object from directive scope', () => {
            $scope.sorting = sorting;
            $scope.$apply();

            expect(sut.getSorting()).toEqual(sorting);
        });
    });

    describe('#setSorting', () => {
        it('should set sorting object', () => {
            const sorting = {
                property: 'prop',
                sorting: 'desc'
            };
            sut.setSorting(sorting);

            expect(sut.getSorting()).toEqual(sorting);
        });
    });

    describe('#getSelectedData', () => {
        it('should return selected items', () => {
            const data = [
                {
                    prop: 'val0',
                    dataTableSelected: true
                },
                {
                    prop: 'val1',
                    dataTableSelected: false
                }
            ];
            sut.setData(data);

            expect(sut.getSelectedData()).toEqual([data[0]]);
        });
    });

    describe('#hasSelectedData', () => {
        it('should return selected items', () => {
            const data = [
                {
                    prop: 'val0',
                    dataTableSelected: true
                },
                {
                    prop: 'val1',
                    dataTableSelected: false
                }
            ];
            sut.setData(data);

            expect(sut.hasSelectedData()).toBe(true);
        });
    });

    describe('#changeSelection', () => {
      it('should select all if passed true', () => {
        const initialData = [
            {
                prop: 'val'
            }
        ];
        sut.setData(initialData);
        sut.changeSelection(true);

        const expectedData = [
            {
                prop: 'val',
                dataTableSelected: true
            }
        ];
        expect(sut.getSelectedData()).toEqual(expectedData);
      });

      it('should deselect all if passed false', () => {
        const initialData = [
            {
                prop: 'val',
                dataTableSelected: true
            }
        ];
        sut.setData(initialData);
        sut.changeSelection(false);

        expect(sut.getSelectedData()).toEqual([]);
      });
    });

    describe('#getViewData', () => {
        it('should return initial data when there is no sorting', () => {
            const data = [
                {
                    prop: 'val'
                }
            ];

            $scope.data = data;
            $scope.$apply();

            expect(sut.getViewData()).toEqual(data);
        });

        it('should sort data in asc direction', () => {
            const intialData = [
                {
                    prop: 'val2'
                },
                {
                    prop: undefined
                },
                {
                    prop: 'val1'
                }
            ];
            sut.setData(intialData);

            const initialSorting = {
                property: 'prop',
                direction: 'asc'
            };
            sut.setSorting(initialSorting);

            const expectedData = [
                {
                    prop: 'val1'
                },
                {
                    prop: 'val2'
                },
                {
                    prop: undefined
                }
            ];
            expect(sut.getViewData()).toEqual(expectedData);
        });

        it('should sort data in desc direction', () => {
            const intialData = [
                {
                    prop: 'val1'
                },
                {
                    prop: 'val2'
                },
                {
                    prop: undefined
                }
            ];
            sut.setData(intialData);

            const initialSorting = {
                property: 'prop',
                direction: 'desc'
            };
            sut.setSorting(initialSorting);

            const expectedData = [
                {
                    prop: undefined
                },
                {
                    prop: 'val2'
                },
                {
                    prop: 'val1'
                }
            ];
            expect(sut.getViewData()).toEqual(expectedData);
        });
    });
});
