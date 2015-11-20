import EwfGridPaginationController from './ewf-grid-pagination-controller';

import AttrsService from './../../services/attrs-service';
import PaginationService from './../../services/pagination-service';

import 'angularMocks';

describe('EwfGridPaginationController', () => {
    let sut;
    let $q, $scope, $attrs;
    let attrsService, $parse, paginationService;

    let paginationPaginateDeffered, attrsTriggerDeffered;

    beforeEach(inject((_$q_, _$rootScope_) => {
        $q = _$q_;
        $attrs = {
            gridData: [
                {
                    name: 'qwerty1',
                    key: 'key1'
                }
            ],
            paginationSettings: {
                data: [
                    {
                        name: 'qwerty1',
                        key: 'key1'
                    }
                ],
                window: [
                    {
                        name: 'qwerty1',
                        key: 'key1'
                    }
                ],
                pageCount: 1,
                pageIndex: 0,
                pageSize: 10,
                rowMax: 1,
                rowMin: 1
            },
            hidePageRange: false,
            hidePaginationSpan: false,
            paginationSize: 10
        };

        $scope = _$rootScope_.$new();
        paginationService = jasmine.mockComponent(new PaginationService());
        attrsService = jasmine.mockComponent(new AttrsService($parse));

        paginationPaginateDeffered = $q.defer();
        attrsTriggerDeffered = $q.defer();

        paginationService.paginate.and.returnValue(paginationPaginateDeffered.promise);
        attrsService.trigger.and.returnValue(attrsTriggerDeffered.promise);
        attrsService.track.and.returnValue('');

        sut = new EwfGridPaginationController(
            $scope,
            $attrs,
            attrsService,
            paginationService
        );
    }));

    describe('#moveToPage', () => {
        const pageIndex = 13;
        const data = [{
            test: 'asdf'
        }];

        beforeEach(() => {
            sut.attributes.gridData = data;
        });

        it('should call pagination service', () => {
            const pageSize = 12;

            sut.attributes.paginationSettings.pageSize = pageSize;
            sut.moveToPage(pageIndex);

            expect(paginationService.paginate).toHaveBeenCalledWith(data, pageIndex, pageSize);
        });

        it('should take even string pageSize but convert it to integer while calling pagination', () => {
            const stringPageSize = '13';
            const intPageSize = 13;

            sut.attributes.paginationSettings.pageSize = stringPageSize;
            sut.moveToPage(pageIndex);

            expect(paginationService.paginate).toHaveBeenCalledWith(data, pageIndex, intPageSize);
        });


        it('should trigger onPaginationUpdate', () => {
            const pageSize = 13;

            sut.attributes.paginationSettings.pageSize = pageSize;
            sut.moveToPage(pageIndex);

            expect(attrsService.trigger).toHaveBeenCalledWith($scope, $attrs, 'onPaginationUpdate',
               {pagination: sut.attributes.paginationSettings});
        });
    });

    describe('#moveToPageIfExists', () => {
        beforeEach(() => {
            sut.attributes.paginationSettings = {
                data: [
                    {
                        name: 'qwerty1',
                        key: 'key1'
                    }
                ],
                window: [
                    {
                        name: 'qwerty1',
                        key: 'key1'
                    }
                ],
                pageCount: 2,
                pageIndex: 0,
                pageSize: 10,
                rowMax: 1,
                rowMin: 1
            };
        });

        it('should set page index to 0 if called with index < 0', () => {
            sut.attributes.paginationSettings.pageIndex = 2;
            sut.moveToPageIfExists(-4);

            expect(sut.attributes.paginationSettings.pageIndex).toBe(0);
        });

        it('should set page index to maximum value if index greater that page count', () => {
            sut.attributes.paginationSettings.pageIndex = 2;
            sut.attributes.paginationSettings.pageCount = 2;
            sut.moveToPageIfExists(10);

            expect(sut.attributes.paginationSettings.pageIndex).toBe(2);
        });

        it('should call move to page of index between 0 and pageCount', () => {
            const pageIndex = 1;
            const data = [{
                name: 'qwerty1',
                key: 'key1'
            }];
            const pageSize = 10;

            sut.attributes.gridData = data;
            sut.attributes.paginationSettings.pageIndex = 0;
            sut.attributes.paginationSettings.pageCount = 2;
            sut.moveToPageIfExists(pageIndex);

            expect(paginationService.paginate).toHaveBeenCalledWith(data, pageIndex, pageSize);
        });
    });
});
