import MyProductListController from'./my-product-list-controller';
import EwfCrudService from './../../services/ewf-crud-service';
import EwfGridController from './../../directives/ewf-grid/ewf-grid-controller';
import AttrsService from './../../services/attrs-service';
import ModalService from './../../services/modal/modal-service';
import 'angularMocks';

describe('MyProductListController', () => {
    let sut, $scope, $q, $timeout, defer;
    let ewfCrudServiceMock, ewfGridControllerMock;
    let nlsService, attrsServiceMock, modalServiceMock;
    const PRODUCT_URL = '/api/myprofile/customs/products';

    beforeEach(inject((_$rootScope_, _$q_, _$timeout_) => {
        $scope = _$rootScope_.$new();
        $q = _$q_;
        $timeout = _$timeout_;
        defer = $q.defer();

        attrsServiceMock = jasmine.mockComponent(new AttrsService());

        modalServiceMock = jasmine.mockComponent(new ModalService());
        ewfCrudServiceMock = jasmine.mockComponent(new EwfCrudService());
        ewfCrudServiceMock.addElement.and.returnValue(defer.promise);
        ewfCrudServiceMock.updateElement.and.returnValue(defer.promise);
        ewfCrudServiceMock.getElementList.and.returnValue(defer.promise);

        ewfGridControllerMock = jasmine.mockComponent(
            new EwfGridController($scope, {}, $timeout, $q, nlsService, ewfCrudServiceMock, attrsServiceMock)
        );
        ewfGridControllerMock.rebuildGrid.and.returnValue('');

        sut = new MyProductListController($scope, $timeout, ewfCrudServiceMock, modalServiceMock, {});
        sut.gridCtrl = ewfGridControllerMock;
    }));

    describe('#constuctor', () => {
        it('should initialized with alert messages flag set as false', () => {
            sut = new MyProductListController($scope, $timeout, ewfCrudServiceMock, modalServiceMock, {});
            expect(sut.alertTypes.catalogUpdated).toBe(false);
            expect(sut.alertTypes.catalogError).toBe(false);
            expect(sut.alertTypes.uploaded).toBe(false);
            expect(sut.alertTypes.added).toBe(false);
            expect(sut.alertTypes.updated).toBe(false);
            expect(sut.alertTypes.deleted).toBe(false);
        });
    });

    describe('#init', () => {
        let serverResponse, dataInGrid;
        beforeEach(() => {
            const responseFromServerMock = [
                {
                    key: 0,
                    group: 'Audi Parts',
                    name: 'Audi Exhaust',
                    description: 'Exhaust system for Audi A4',
                    countryName: '1023'
                },
                {
                    key: 1,
                    group: 'Audi Parts',
                    name: 'Audi Cam Shafts',
                    description: 'Cam shafts for 1997 Audi A4 Quattro wagon, made from steal',
                    countryName: '1023'
                }
            ];

            const gridDataListMock = [
                {
                    key: 0,
                    group: 'Audi Parts',
                    name: 'Audi Exhaust',
                    description: 'Exhaust system for Audi A4',
                    countryName: '1023'
                },
                {
                    key: 1,
                    group: 'Audi Parts',
                    name: 'Audi Cam Shafts',
                    description: 'Cam shafts for 1997 Audi A4 Quattro wagon, made from steal',
                    countryName: '1023'
                }
            ];

            serverResponse = responseFromServerMock;
            dataInGrid = gridDataListMock;
        });

        it('should get data from service', () => {
            sut.init();
            expect(ewfCrudServiceMock.getElementList).toHaveBeenCalledWith(PRODUCT_URL);
        });

        it('should call grid init with parsed data', () => {
            sut.init();

            defer.resolve(serverResponse);
            $timeout.flush();

            //It's possible to use object deep comparison, but this check gives you an answer what is failed much faster
            expect(sut.gridData[0].key).toEqual(dataInGrid[0].key);
            expect(sut.gridData[0].group).toEqual(dataInGrid[0].group);
            expect(sut.gridData[0].name).toEqual(dataInGrid[0].name);
            expect(sut.gridData[0].description).toEqual(dataInGrid[0].description);
            expect(sut.gridData[0].countryName).toEqual(dataInGrid[0].countryName);

            expect(sut.gridData[1].key).toEqual(dataInGrid[1].key);
            expect(sut.gridData[1].group).toEqual(dataInGrid[1].group);
            expect(sut.gridData[1].name).toEqual(dataInGrid[1].name);
            expect(sut.gridData[1].description).toEqual(dataInGrid[1].description);
            expect(sut.gridData[1].countryName).toEqual(dataInGrid[1].countryName);

            expect(sut.gridCtrl.rebuildGrid).toHaveBeenCalledWith(dataInGrid);
        });
    });

    describe('#editProduct', () => {
        const key = 1;
        beforeEach(() => {
            sut.isFormVisible = false;
            sut.myProductListKey = '';
            sut.editProduct(key);
        });
        it('should show Form', () => {
            expect(sut.isFormVisible).toBe(true);
        });
        it('should set key as myProductListKey', () => {
            expect(sut.myProductListKey).toBe(key);
        });

        describe('add new product', () => {
            const newKey = '';
            beforeEach(() => {
                sut.isFormVisible = false;
                sut.myProductListKey = undefined;
                sut.editProduct(newKey);
            });

            it('should show Form', () => {
                expect(sut.isFormVisible).toBe(true);
            });
            it('should set key as empty string', () => {
                expect(sut.myProductListKey).toBe(newKey);
            });
        });
    });

    describe('#onUpdate', () => {
        beforeEach(() => {
            sut.onUpdate();
        });

        it('should get new data from service', () => {
            expect(ewfCrudServiceMock.getElementList).toHaveBeenCalledWith(PRODUCT_URL);
        });
        it('should notify user about update', () => {
            expect(sut.alertTypes.updated).toBe(true);
        });
        it('should clean product key', () => {
            expect(sut.myProductListKey).toBe('');
        });
        it('should show Grid and hide Form', () => {
            expect(sut.isFormVisible).toBe(false);
        });
    });

    describe('#onAdd', () => {
        beforeEach(() => {
            sut.onAdd();
        });

        it('should get new data from service', () => {
            expect(ewfCrudServiceMock.getElementList).toHaveBeenCalledWith(PRODUCT_URL);
        });
        it('should notify user about update', () => {
            expect(sut.alertTypes.added).toBe(true);
        });
        it('should clean product key', () => {
            expect(sut.myProductListKey).toBe('');
        });
        it('should show Grid and hide Form', () => {
            expect(sut.isFormVisible).toBe(false);
        });
    });

    describe('#onCancel', () => {
        beforeEach(() => {
            sut.onCancel();
        });

        it('should show Grid and hide Form', () => {
            expect(sut.isFormVisible).toBe(false);
        });
        it('should clean product key', () => {
            expect(sut.myProductListKey).toBe('');
        });
    });

    describe('#toggleNotificationAlert', () => {
        it('should set alerts type value to true, and false by timeout', () => {
            sut.alertTypes = {};
            sut.toggleNotificationAlert('key');
            expect(sut.alertTypes.key).toBe(true);
            $timeout.flush();
            expect(sut.alertTypes.key).toBe(false);
        });
    });

    describe('#onCatalogUpdated', () => {
        beforeEach(() => {
            sut.onCatalogUpdated();
        });
        it('should get new data from service', () => {
            expect(ewfCrudServiceMock.getElementList).toHaveBeenCalledWith(PRODUCT_URL);
        });
        it('should notify user about catalog update', () => {
            expect(sut.alertTypes.catalogUpdated).toBe(true);
        });
    });

    describe('#onCatalogError', () => {
        beforeEach(() => {
            sut.onCatalogError();
        });
        it('should notify user about catalog error', () => {
            expect(sut.alertTypes.catalogError).toBe(true);
        });
    });

    describe('#isBulkDeleteButtonEnabled', () => {
        it('should disable bulk delete button when there is no selected data', () => {
            const gridSelectedData = [];
            ewfGridControllerMock.getSelectedKeysOnCurrentPage.and.returnValue(gridSelectedData);

            expect(sut.isBulkDeleteButtonEnabled()).toBe(false);
        });

        it('should enable bulk delete button when there are selected data', () => {
            const gridSelectedData = ['1', '2', '3'];
            ewfGridControllerMock.getSelectedKeysOnCurrentPage.and.returnValue(gridSelectedData);

            expect(sut.isBulkDeleteButtonEnabled()).toBe(true);
        });
    });

    it('should show upload dialogue', () => {
        sut.showUploadListDialogue();
        expect(modalServiceMock.showDialog).toHaveBeenCalledWith(jasmine.any(Object));
    });
});
