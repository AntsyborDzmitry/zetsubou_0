import EwfGridController from './ewf-grid-controller';

import AttrsService from './../../services/attrs-service';
import EwfCrudService from './../../services/ewf-crud-service';
import PaginationService from './../../services/pagination-service';
import NlsService from './../../services/nls-service';
import ModalService from './../../services/modal/modal-service';

import 'angularMocks';

describe('EwfGridController', () => {
    let sut;
    let $q, $timeout, $scope, $attrs, deleteMessage;
    let attrsService, $parse, ewfCrudService, modalService, paginationService, nlsService, logService, onSort;

    let gridListDeffered, showMessageDeferred, showConfirmationDeferred, deleteElementDeffered,
        paginationPaginateDeffered, attrsTriggerDeffered, translationDeffered, gridAddElementDeffered;

    beforeEach(inject((_$q_, _$timeout_, _$rootScope_) => {
        $q = _$q_;
        $timeout = _$timeout_;
        $attrs = {
            onSelection: true,
            isPopup: true,
            listUrl: 'werew',
            onSort: 'testSortEvent'
        };

        $scope = _$rootScope_.$new();
        onSort = jasmine.createSpy($attrs.onSort);
        $scope[$attrs.onSort] = onSort;
        onSort.and.returnValue(undefined);

        deleteMessage = 'common.delete_one_item_confirmation_message';

        gridListDeffered = $q.defer();
        gridAddElementDeffered = $q.defer();
        showMessageDeferred = $q.defer();
        showConfirmationDeferred = $q.defer();
        deleteElementDeffered = $q.defer();
        paginationPaginateDeffered = $q.defer();
        attrsTriggerDeffered = $q.defer();
        translationDeffered = $q.defer();

        modalService = jasmine.mockComponent(new ModalService());
        nlsService = jasmine.mockComponent(new NlsService());
        ewfCrudService = jasmine.mockComponent(new EwfCrudService());
        paginationService = jasmine.mockComponent(new PaginationService());
        attrsService = jasmine.mockComponent(new AttrsService($parse));
        logService = jasmine.createSpyObj('logService', ['error']);

        ewfCrudService.getElementList.and.returnValue(gridListDeffered.promise);
        ewfCrudService.addElement.and.returnValue(gridAddElementDeffered.promise);
        nlsService.getTranslation.and.returnValue(translationDeffered.promise);
        modalService.showDialog.and.returnValue(showMessageDeferred.promise);
        modalService.showConfirmationDialog.and.returnValue(showConfirmationDeferred.promise);
        ewfCrudService.deleteElements.and.returnValue(deleteElementDeffered.promise);
        paginationService.paginate.and.returnValue(paginationPaginateDeffered.promise);
        attrsService.trigger.and.returnValue(attrsTriggerDeffered.promise);
        attrsService.track.and.returnValue('');

        sut = new EwfGridController(
            $scope,
            $attrs,
            $timeout,
            $q,
            nlsService,
            ewfCrudService,
            attrsService,
            paginationService,
            modalService,
            logService
        );
    }));

    describe('#init', () => {
        it('should perform call to the address book', () => {
            sut.listUrl = 'some-list-url';
            sut.gridInit();
            expect(ewfCrudService.getElementList).toHaveBeenCalledWith(sut.listUrl);
        });

        it('should init onSort event', () => {
            expect(attrsService.trigger).toHaveBeenCalledWith($scope, $attrs, 'onSort');
        });
    });

    describe('#getSelectedKeysOnCurrentPage', () => {
        it('should return selected keys from pagination data', () => {
            sut.pagination.data = [{
                isSelected: true,
                key: 10
            }, {
                isSelected: false,
                key: 20
            }];

            expect(sut.getSelectedKeysOnCurrentPage()).toEqual([10]);
        });
    });

    describe('#getSelectedKeysOnAllPages', () => {
        it('should return selected keys from all data', () => {
            sut.attributes.gridData = [{
                isSelected: true,
                key: 10
            }, {
                isSelected: true,
                key: 11
            }, {
                isSelected: false,
                key: 12
            }, {
                isSelected: false,
                key: 13
            }, {
                isSelected: false,
                key: 14
            }, {
                isSelected: false,
                key: 15
            }, {
                isSelected: false,
                key: 16
            }, {
                isSelected: false,
                key: 17
            }, {
                isSelected: false,
                key: 18
            }, {
                isSelected: false,
                key: 19
            }, {
                isSelected: true,
                key: 20
            }, {
                isSelected: true,
                key: 21
            }, {
                isSelected: true,
                key: 22
            }, {
                isSelected: false,
                key: 23
            }];

            sut.pagination.data = [{
                isSelected: true,
                key: 10
            }, {
                isSelected: true,
                key: 11
            }, {
                isSelected: false,
                key: 12
            }, {
                isSelected: false,
                key: 13
            }, {
                isSelected: false,
                key: 14
            }, {
                isSelected: false,
                key: 15
            }, {
                isSelected: false,
                key: 16
            }, {
                isSelected: false,
                key: 17
            }, {
                isSelected: false,
                key: 18
            }, {
                isSelected: false,
                key: 19
            }];

            expect(sut.getSelectedKeysOnAllPages()).toEqual([10, 11, 20, 21, 22]);
        });
    });

    describe('#getSortOrderCssClasses', () => {
        it('should return CSS classes according to current order', () => {
            const column = 'test';
            const direction = 'ascending';

            sut.sort.column = column;
            sut.sort.direction = direction;

            expect(sut.getSortOrderCssClasses(column)).toEqual(`current ${direction}`);
        });
    });

    describe('#sortedMoveToPage', () => {
        it('should set data', () => {
            const data = [{aa: 'abc'}, {aa: 'bcd'}, {aa: 'cde'}];
            sut.attributes.sortColumn = 'aa';
            sut.sortedMoveToPage(data);

            expect(sut.attributes.gridData).toEqual(data);
        });
    });

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

            sut.pagination.pageSize = pageSize;
            sut.moveToPage(pageIndex);

            expect(paginationService.paginate).toHaveBeenCalledWith(data, pageIndex, pageSize);
        });

        it('should take even string pageSize but convert it to integer while calling pagination', () => {
            const stringPageSize = '13';
            const intPageSize = 13;

            sut.pagination.pageSize = stringPageSize;
            sut.moveToPage(pageIndex);

            expect(paginationService.paginate).toHaveBeenCalledWith(data, pageIndex, intPageSize);
        });
    });

    describe('#setSortOrder', () => {
        const column = 'test';
        const direction = 'ascending';

        beforeEach(() => {
            sut.setSortOrder(column, direction);
        });

        it('should set sorting column', () => {
            expect(sut.sort.column).toEqual(column);
        });

        it('should set sorting direction', () => {
            expect(sut.sort.direction).toEqual(direction);
        });

        it('should refresh data according to new order', () => {
            const pageSize = 12;
            const data = [{
                test: '10'
            }];

            paginationService.paginate.calls.reset();

            sut.attributes.gridData = data;
            sut.pagination.pageSize = pageSize;
            sut.setSortOrder(column, 'another-direction');

            expect(paginationService.paginate).toHaveBeenCalledWith(data, 0, pageSize);
        });

        it('should not call service if data is already sorted', () => {
            paginationService.paginate.calls.reset();
            sut.setSortOrder(column, direction);

            expect(paginationService.paginate).not.toHaveBeenCalled();
        });

        it('should sort data descending to numeric order', () => {
            const pageSize = 12;
            const unsortedData = [
                {test: '10a'},
                {test: '15a'},
                {test: '12s'},
                {test: '20dddd'}
            ];
            const sortedDescendingData = [
                {test: '20dddd'},
                {test: '15a'},
                {test: '12s'},
                {test: '10a'}
            ];

            paginationService.paginate.calls.reset();

            sut.attributes.gridData = unsortedData;
            sut.pagination.pageSize = pageSize;
            sut.setSortOrder(column, 'another-direction');

            expect(sut.attributes.gridData).toEqual(sortedDescendingData);
            expect(onSort).not.toHaveBeenCalled();
        });

        it('should sort data descending to ASCII order ignore char case', () => {
            const pageSize = 12;
            const unsortedData = [
                {test: 'a'},
                {test: 'a'},
                {test: 'dddd'},
                {test: 's'}
            ];
            const sortedDescendingData = [
                {test: 's'},
                {test: 'dddd'},
                {test: 'a'},
                {test: 'a'}
            ];

            paginationService.paginate.calls.reset();

            sut.attributes.gridData = unsortedData;
            sut.pagination.pageSize = pageSize;
            sut.setSortOrder(column, 'another-direction');

            expect(sut.attributes.gridData).toEqual(sortedDescendingData);
            expect(onSort).not.toHaveBeenCalled();
        });

        it('should sort data ascending to numeric order', () => {
            const pageSize = 12;
            const unsortedData = [
                {test: '10a'},
                {test: '15a'},
                {test: '12s'},
                {test: '20dddd'}
            ];
            const sortedAscendingData = [
                {test: '10a'},
                {test: '12s'},
                {test: '15a'},
                {test: '20dddd'}
            ];

            paginationService.paginate.calls.reset();

            sut.attributes.gridData = unsortedData;
            sut.pagination.pageSize = pageSize;
            sut.setSortOrder(column, 'another-direction');
            sut.setSortOrder(column, 'ascending');

            expect(sut.attributes.gridData).toEqual(sortedAscendingData);
            expect(onSort).not.toHaveBeenCalled();
        });

        it('should sort data ascending to ASCII order ignore char case', () => {
            const pageSize = 12;
            const unsortedData = [
                {test: 'a'},
                {test: 'dddd'},
                {test: 'a'},
                {test: 's'}
            ];
            const sortedAscendingData = [
                {test: 'a'},
                {test: 'a'},
                {test: 'dddd'},
                {test: 's'}
            ];

            paginationService.paginate.calls.reset();

            sut.attributes.gridData = unsortedData;
            sut.pagination.pageSize = pageSize;
            sut.setSortOrder(column, 'another-direction');
            sut.setSortOrder(column, 'ascending');

            expect(sut.attributes.gridData).toEqual(sortedAscendingData);
            expect(onSort).not.toHaveBeenCalled();
        });

        it('should not sort data when sorting is disabled', () => {
            const pageSize = 12;
            const unsortedData = [
                {test: 'a'},
                {test: 'dddd'},
                {test: 'a'},
                {test: 'a'},
                {test: 'a'},
                {test: 's'}
            ];

            sut.attributes.disableSorting = true;
            paginationService.paginate.calls.reset();

            sut.attributes.gridData = unsortedData;
            sut.pagination.pageSize = pageSize;
            sut.setSortOrder(column, 'another-direction');
            sut.setSortOrder(column, 'ascending');
            sut.setSortOrder(column, 'descending');

            expect(sut.attributes.gridData).toEqual(unsortedData);
            expect(onSort).not.toHaveBeenCalled();
            expect(sut.getSortOrderCssClasses()).toBe('');
        });
    });

    describe('#deleteElements', () => {
        const data = [{key: 'key1'}, {key: 'key2'}, {key: 'key3'}, {key: 'key4'}];
        let confirmationMessage;

        beforeEach(() => {
            sut.attributes.gridData = data;
            confirmationMessage = 'are you sure?';
        });

        it('should show confirmation dialog before deleting', () => {
            sut.deleteElements('key', deleteMessage);
            translationDeffered.resolve(confirmationMessage);
            $timeout.flush();

            expect(modalService.showConfirmationDialog).toHaveBeenCalled();
        });

        it('should get not only array, but also one key', () => {
            sut.deleteElements('some-key', deleteMessage);
            translationDeffered.resolve(confirmationMessage);
            $timeout.flush();

            expect(modalService.showConfirmationDialog).toHaveBeenCalledWith(jasmine.objectContaining({
                message: confirmationMessage
            }));
        });

        xit('should replace {number} variable in translation constant if it exist', () => {
            const items = [{}, {}];
            const message = 'Are you going to delete {number} items?';
            sut.deleteElements(items, message);

            expect(modalService.showConfirmationDialog).toHaveBeenCalledWith(jasmine.objectContaining({
                message: 'Are you going to delete 2 items?'
            }));
        });

        describe('returnedDeleteAddresses', () => {
            beforeEach(() => {
                sut.deleteElements('key', deleteMessage);
                showConfirmationDeferred.resolve();
                translationDeffered.resolve(confirmationMessage);
                $timeout.flush();
            });

            it('should filter data, according to returned fields', () => {
                const contactKeys = ['key1', 'key2'];
                const dataFiltered = [{key: 'key3'}, {key: 'key4'}];

                sut.sort.column = 'key';

                deleteElementDeffered.resolve(contactKeys);
                $timeout.flush();

                expect(sut.attributes.gridData).toEqual(dataFiltered);
            });

            xit('should set addressBookUpdated flag to true', () => {
                sut.sort.column = 'key';
                deleteElementDeffered.resolve([]);
                $timeout.flush();

                expect(sut.alertTypes.deleted).toEqual(true);
            });

            it('should get address book again, if all data was removed', () => {
                const returnedData = ['key1', 'key2', 'key3', 'key4'];
                sut.listUrl = 'some-list-url';
                deleteElementDeffered.resolve(returnedData);
                $timeout.flush();

                expect(ewfCrudService.getElementList).toHaveBeenCalledWith(sut.listUrl);
            });
        });
    });

    describe('#handleSearch', () => {
        it('should set data', () => {
            sut.sort.column = 'key';
            const data = [{key: '10'}, {key: '20'}, {key: '15'}];
            sut.handleSearch(data);

            expect(sut.attributes.gridData).toEqual(data);
        });

        it('should show popup if there is no address matching keyword', () => {
            sut.handleSearch();

            expect(modalService.showMessageDialog).toHaveBeenCalled();
        });
    });

    describe('#setPageSelection', () => {
        it('should set pagination data selected flags', () => {
            const newSelected = 'test';
            sut.pagination.data = [{
                isSelected: 0
            }];
            sut.setPageSelection(newSelected);

            expect(sut.pagination.data[0].isSelected).toEqual(newSelected);
        });
    });

    describe('#triggerEvent', () => {
        it('should call trigger method from attrsService', () => {
            const attributeName = 'test';
            const value = 10;
            sut.triggerEvent(attributeName, value);

            expect(attrsService.trigger).toHaveBeenCalledWith($scope, $attrs, attributeName, value);
        });
    });

    describe('#toggleSortOrder', () => {
        const column = 'test-column';

        beforeEach(() => {
            sut.sort.column = column;
        });

        it('should change ascending order to descending', () => {
            sut.sort.direction = 'ascending';
            sut.toggleSortOrder(column);

            expect(sut.sort.direction).toEqual('descending');
        });

        it('should change descending order to ascending', () => {
            sut.sort.direction = 'descending';
            sut.toggleSortOrder(column);

            expect(sut.sort.direction).toEqual('ascending');
        });

        it('should set order to ascending without toggling, if column was changed', () => {
            sut.sort.direction = 'ascending';
            sut.toggleSortOrder('other-column');

            expect(sut.sort.direction).toEqual('ascending');
        });

        it('should call sorting order method', () => {
            sut.sort.direction = 'ascending';
            sut.toggleSortOrder(column);

            expect(sut.sort.direction).toEqual('descending');
        });
    });

    describe('#updateVisibleColumns', () => {
        it('should set first column sort if previous sorting column has been removed', () => {
            sut.hideColumnCustomizationDialog = jasmine.createSpy('hideColumnCustomizationDialog').and.returnValue('');

            sut.sort = {
                column: 'test-column',
                direction: 'descending'
            };

            sut.selectedColumns = {
                column1: {
                    alias: 'test-column1',
                    title: 'Test Column 1'
                },
                column2: {
                    alias: 'test-column2',
                    title: 'Test Column 2'
                },
                column3: {
                    alias: 'test-column3',
                    title: 'Test Column 3'
                },
                column4: {
                    alias: 'test-column4',
                    title: 'Test Column 4'
                },
                column5: {
                    alias: 'test-column5',
                    title: 'Test Column 5'
                }
            };

            sut.updateVisibleColumns();

            expect(sut.sort.column).toBe(sut.selectedColumns.column1.alias);
            expect(sut.sort.direction).toBe('ascending');
        });
    });

    describe('#rebuildGrid', () => {

        beforeEach(() => {
            spyOn(sut, 'sortedMoveToPage');
        });

        it('should display logService error when no "attributes.gridData" and no listUrl is defined', () => {
            sut.attributes.gridData = undefined;
            sut.listUrl = undefined;
            sut.rebuildGrid();

            expect(logService.error).toHaveBeenCalled();
        });

       it('should save data provided to "attributes.gridData"', () => {
           const newGridData = [{name: 'some new grid element'}];
           sut.attributes.gridData = [{name: 'some old grid element'}];

           sut.rebuildGrid(newGridData);

           expect(sut.attributes.gridData).toBe(newGridData);
       });

        it('should getElementList via ewfCrudService when no gridData and listUrl is defined', () => {
            sut.listUrl = 'some-list-url';
            sut.rebuildGrid();

            expect(ewfCrudService.getElementList).toHaveBeenCalledWith(sut.listUrl);
        });

        it('should call sortedMoveToPage with correct params when there is gridData or no listUrl defined', () => {
            const newGridData = [{name: 'some new grid element'}];
            sut.rebuildGrid(newGridData);

            expect(ewfCrudService.getElementList).not.toHaveBeenCalled();
            expect(sut.sortedMoveToPage).toHaveBeenCalledWith(sut.attributes.gridData, 0);
        });
    });

    describe('#addElement', () => {
        const newElement = {};
        const error = {};

        beforeEach(() => {
            sut.attributes.gridData = [];
        });

        it('should call crud service update element method with correct url and data', () => {
            sut.addUrl = 'addUrl';
            sut.addElement(newElement);
            expect(ewfCrudService.addElement).toHaveBeenCalledWith(sut.addUrl, newElement);
        });

        it('should add element to grid data', () => {
            let gridData = sut.attributes.gridData;
            sut.addElement();
            gridAddElementDeffered.resolve(newElement);
            $timeout.flush();
            expect(gridData.includes(newElement)).toBeTruthy();
        });

        it('should rebuild grid', () => {
            spyOn(sut, 'rebuildGrid').and.callThrough();
            sut.addElement();
            gridAddElementDeffered.resolve(newElement);
            $timeout.flush();
            expect(sut.rebuildGrid).toHaveBeenCalled();
        });

        it('should return response to the next deferred handler', () => {
            sut.addElement()
                .then((response) => {
                    expect(response).toEqual(newElement);
                });
            gridAddElementDeffered.resolve(newElement);
            $timeout.flush();
        });

        it('should broadcast error to the notify controller', () => {
            spyOn(sut, 'broadcastActionReport').and.callThrough();
            sut.addElement();
            gridAddElementDeffered.reject(error);
            $timeout.flush();
            expect(sut.broadcastActionReport).toHaveBeenCalledWith('rejected', error);
        });

        it('should return error to next deferred error handler', () => {
            sut.addElement()
                .catch((errorCode) => {
                    expect(errorCode).toEqual(error);
                });
            gridAddElementDeffered.reject(error);
            $timeout.flush();
        });
    });

    describe('should set attributes', () => {
        it('should call track method with attribute gridData', () => {
            expect(attrsService.track)
            .toHaveBeenCalledWith($scope, $attrs, 'gridData', sut.attributes);
        });

        it('should call track method with attribute visibleColumns', () => {
            expect(attrsService.track)
            .toHaveBeenCalledWith($scope, $attrs, 'visibleColumns', sut.attributes);
        });

        it('should call track method with attribute availableColumns', () => {
            expect(attrsService.track)
            .toHaveBeenCalledWith($scope, $attrs, 'availableColumns', sut.attributes);
        });

        it('should call track method with attribute isPopup', () => {
            expect(attrsService.track)
            .toHaveBeenCalledWith($scope, $attrs, 'isPopup', sut.attributes);
        });

        it('should call track method with attribute listUrl', () => {
            expect(attrsService.track)
            .toHaveBeenCalledWith($scope, $attrs, 'listUrl', sut);
        });

        it('should call track method with attribute showCustomizationButton', () => {
            expect(attrsService.track)
            .toHaveBeenCalledWith($scope, $attrs, 'showCustomizationButton', sut);
        });

        it('should call track method with attribute sortColumn', () => {
            expect(attrsService.track)
            .toHaveBeenCalledWith($scope, $attrs, 'sortColumn', sut.attributes);
        });

        it('should call track method with attribute paginationSize', () => {
            expect(attrsService.track)
            .toHaveBeenCalledWith($scope, $attrs, 'paginationSize', sut.attributes, jasmine.any(Function));
        });
    });

    describe('pagination helpers', () => {
        beforeEach(() => {
            sut.pagination = {
                pageIndex: 1
            };
        });

        it('should return true if it equals to current page index', () => {
            const currentPage = {
                index: 1
            };
            const nextPage = {
                index: 2
            };
            expect(sut.isCurrentPage(currentPage)).toBe(true);
            expect(sut.isCurrentPage(nextPage)).toBe(false);
            expect(sut.isCurrentPage()).toBe(false);
        });
    });

    describe('#updatePagination', () => {
        beforeEach(() => {
            sut.pagination = {
                data: [],
                pageCount: 3,
                pageIndex: 1,
                pageSize: 10
            };
        });

        it('should set pagination', () => {
            const newPagination = {
                data: [
                    {
                        name: 'John',
                        key: 'asd123'
                    }
                ],
                pageCount: 3,
                pageIndex: 1,
                pageSize: 10
            };
            sut.updatePagination(newPagination);
            expect(sut.pagination).toBe(newPagination);
        });
    });
});
