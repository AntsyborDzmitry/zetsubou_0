import PackagingSettingsController from './packaging-settings-controller';
import EwfCrudService from './../../services/ewf-crud-service';
import EwfGridController from './../../directives/ewf-grid/ewf-grid-controller';
import AttrsService from './../../services/attrs-service';
import EwfPatternService from './../../services/ewf-pattern-service';
import PackagingMeasuresService from './packaging-measures-service';
import angular from 'angular';
import 'angularMocks';

describe('PackagingSettingsController', () => {
    let sut, $scope, $q, $timeout, defer;
    let ewfCrudServiceMock, ewfGridControllerMock;
    let nlsService, attrsServiceMock;
    let ewfPatternServiceMock;
    let packagingMeasuresServiceMock;

    const defaultWeightUnit = {
        key: 'LB',
        title: 'lb'
    };
    const defaultDimensionUnit = {
        key: 'IN',
        title: 'in'
    };
    const emptySinglePackage = {
        key: '',
        nickName: '',
        isDocuments: true,
        isPackages: false,
        pieceReference: '',
        packagingType: 'DOCUMENT',
        defaultWeight: {
            unit: defaultWeightUnit.key,
            value: ''
        },
        defaultDimensions: {
            unit: defaultDimensionUnit.key,
            height: '',
            width: '',
            length: ''
        },
        isPallet: false
    };

    beforeEach(inject((_$rootScope_, _$q_, _$timeout_) => {
        $scope = _$rootScope_.$new();
        $q = _$q_;
        $timeout = _$timeout_;
        defer = $q.defer();

        attrsServiceMock = jasmine.mockComponent(new AttrsService());

        ewfCrudServiceMock = jasmine.mockComponent(new EwfCrudService());
        ewfCrudServiceMock.addElement.and.returnValue(defer.promise);
        ewfCrudServiceMock.updateElement.and.returnValue(defer.promise);
        ewfCrudServiceMock.getElementList.and.returnValue(defer.promise);

        ewfGridControllerMock = jasmine.mockComponent(
            new EwfGridController($scope, {}, $timeout, $q, nlsService, ewfCrudServiceMock, attrsServiceMock)
        );
        ewfGridControllerMock.rebuildGrid.and.returnValue('');

        ewfPatternServiceMock = jasmine.mockComponent(new EwfPatternService());
        ewfPatternServiceMock.getPattern.and.callThrough();

        packagingMeasuresServiceMock = jasmine.mockComponent(new PackagingMeasuresService(ewfPatternServiceMock));
        packagingMeasuresServiceMock.getDefaultWeightUnit.and.returnValue(defaultWeightUnit);
        packagingMeasuresServiceMock.getDefaultDimensionUnit.and.returnValue(defaultDimensionUnit);
        packagingMeasuresServiceMock.getUnitInfo.and.callThrough();

        sut = new PackagingSettingsController(ewfCrudServiceMock, packagingMeasuresServiceMock);
        sut.gridCtrl = ewfGridControllerMock;
    }));

    describe('#saveOrUpdate', () => {
        describe('should check packaging type set correctly', () => {
            it('when item is of document-type only', () => {
                sut.singlePackage = angular.copy(emptySinglePackage);

                sut.saveOrUpdate({$valid: true}, {ewfValidation: function() {}});

                expect(sut.singlePackage.packagingType).toEqual('DOCUMENT');
            });

            it('when item is of package-type only', () => {
                sut.singlePackage = angular.copy(emptySinglePackage);
                sut.singlePackage.isDocuments = false;
                sut.singlePackage.isPackages = true;

                sut.saveOrUpdate({$valid: true}, {ewfValidation: function() {}});

                expect(sut.singlePackage.packagingType).toEqual('PACKAGE');
            });

            it('when item is of both types', () => {
                sut.singlePackage = angular.copy(emptySinglePackage);
                sut.singlePackage.isPackages = true;

                sut.saveOrUpdate({$valid: true}, {ewfValidation: function() {}});

                expect(sut.singlePackage.packagingType).toEqual('BOTH');
            });
        });

        it('should check is packaging updated', () => {
            const ckey = 'key';
            const ePackage = angular.copy(emptySinglePackage);
            ePackage.key = ckey;
            sut.singlePackage = angular.copy(ePackage);
            sut.packageList = [sut.singlePackage];

            sut.gridData = [{
                key: ckey,
                nickName: '',
                isDocuments: true,
                isPackages: false,
                pieceReference: '',
                packagingType: 'DOCUMENT',
                defaultDimensions: '1 X 3 X 5',
                defaultWeight: {
                    unit: 'KG',
                    value: '2'
                }
            }];

            sut.saveOrUpdate({$valid: true}, {ewfValidation: function() {}});

            ePackage.key = ckey;
            ePackage.pieceReference = 'newRef';

            defer.resolve(ePackage);
            $timeout.flush();

            expect(sut.gridData[0].pieceReference).toBe(ePackage.pieceReference);
            expect(sut.gridData.length).toBe(1);
            expect(sut.packageList[0].pieceReference).toBe(ePackage.pieceReference);
            expect(sut.packageList.length).toBe(1);
        });
    });

    describe('#closeDialog', () => {
        it('should check is showEditPopup is false', () => {
            sut.closeDialog();

            expect(sut.showEditPopup).toBe(false);
        });
    });

    describe('#showAddDialog', () => {
        it('shows dialog', () => {
            sut.showAddDialog();

            expect(sut.showEditPopup).toBe(true);
        });

        it('clears data in single package object', () => {
            sut.showAddDialog();

            expect(sut.singlePackage).not.toBe(emptySinglePackage);
            expect(sut.singlePackage).toEqual(emptySinglePackage);
        });
    });

    describe('#showDialog', () => {
        it('should check is showEditPopup is false', () => {
            sut.showDialog();

            expect(sut.showEditPopup).toBe(true);
        });
    });

    describe('#editAction', () => {
        let singlePackage;

        beforeEach(() => {
            singlePackage = {
                key: 'key',
                nickName: '',
                isDocuments: true,
                isPackages: false,
                pieceReference: '',
                packagingType: 'BOTH',
                defaultWeight: {
                    unit: defaultWeightUnit.key,
                    value: ''
                },
                defaultDimensions: {
                    unit: defaultDimensionUnit.key,
                    height: '',
                    width: '',
                    length: ''
                },
                isPallet: false
            };
        });

        it('should set correct data to singlePackage object', () => {
            const key = 'key';
            sut.packageList = [singlePackage];
            sut.editAction(key);

            expect(sut.singlePackage.isDocuments).toBe(true);
            expect(sut.singlePackage.isPackages).toBe(true);
        });

        it('should open pop-up', () => {
            const key = 'key';
            sut.packageList = [singlePackage];
            sut.editAction(key);

            expect(sut.showEditPopup).toBe(true);
        });
    });

    describe('#init', () => {
        let serverResponse, dataInGrid;
        beforeEach(() => {
            const responseFromServerMock = [
                {
                    key: '001',
                    nickName: 'My Parts Packaging',
                    isDocuments: false,
                    isPackages: true,
                    packagingType: 'PACKAGE',
                    pieceReference: '34874382-05a',
                    defaultWeight: {
                        unit: 'KG',
                        value: 1.0
                    },
                    defaultDimensions: {
                        unit: 'CM',
                        height: 5.0,
                        width: 4.40,
                        length: 7.0
                    },
                    isPallet: false
                },
                {
                    key: '002',
                    nickName: 'My Seat Cover Packaging',
                    isDocuments: true,
                    isPackages: false,
                    packagingType: 'DOCUMENT',
                    pieceReference: '90543621-09a',
                    defaultWeight: {
                        unit: 'LB',
                        value: 5.0
                    },
                    defaultDimensions: {
                        unit: 'IN',
                        height: 4,
                        width: 5.0,
                        length: 10.6
                    },
                    isPallet: false
                }
            ];

            const gridDataListMock = [{
                key: '001',
                nickName: 'My Parts Packaging',
                isDocuments: false,
                isPackages: true,
                packagingType: 'PACKAGE',
                pieceReference: '34874382-05a',
                defaultDimensions: '7 cm X 4.4 cm X 5 cm',
                defaultWeight: '1 kg',
                isPallet: false,
                packageVolume: 154.00000000000003
            }, {
                key: '002',
                isDocuments: true,
                isPackages: false,
                packagingType: 'DOCUMENT',
                nickName: 'My Seat Cover Packaging',
                pieceReference: '90543621-09a',
                defaultDimensions: '10.6 in X 5 in X 4 in',
                defaultWeight: '5 lb',
                isPallet: false,
                packageVolume: 212
            }];

            serverResponse = responseFromServerMock;
            dataInGrid = gridDataListMock;
        });

        it('should make call to measures service to get defaults units', () => {
            sut.init();

            expect(packagingMeasuresServiceMock.getDefaultWeightUnit).toHaveBeenCalledWith();
            expect(packagingMeasuresServiceMock.getDefaultDimensionUnit).toHaveBeenCalledWith();
        });

        it('should call grid init with parsed data', () => {
            sut.init();

            defer.resolve(serverResponse);
            $timeout.flush();

            //It's possible to use object deep comparison, but this check gives you an answer what is failed much faster
            expect(sut.gridData[0].key).toEqual(dataInGrid[0].key);
            expect(sut.gridData[0].isDocuments).toEqual(dataInGrid[0].isDocuments);
            expect(sut.gridData[0].isPackages).toEqual(dataInGrid[0].isPackages);
            expect(sut.gridData[0].packagingType).toEqual(dataInGrid[0].packagingType);
            expect(sut.gridData[0].nickName).toEqual(dataInGrid[0].nickName);
            expect(sut.gridData[0].pieceReference).toEqual(dataInGrid[0].pieceReference);
            expect(sut.gridData[0].defaultDimensions).toEqual(dataInGrid[0].defaultDimensions);
            expect(sut.gridData[0].defaultWeight).toEqual(dataInGrid[0].defaultWeight);
            expect(sut.gridData[0].isPallet).toEqual(dataInGrid[0].isPallet);

            expect(sut.gridData[1].key).toEqual(dataInGrid[1].key);
            expect(sut.gridData[1].isDocuments).toEqual(dataInGrid[1].isDocuments);
            expect(sut.gridData[1].isPackages).toEqual(dataInGrid[1].isPackages);
            expect(sut.gridData[1].packagingType).toEqual(dataInGrid[1].packagingType);
            expect(sut.gridData[1].nickName).toEqual(dataInGrid[1].nickName);
            expect(sut.gridData[1].pieceReference).toEqual(dataInGrid[1].pieceReference);
            expect(sut.gridData[1].defaultDimensions).toEqual(dataInGrid[1].defaultDimensions);
            expect(sut.gridData[1].defaultWeight).toEqual(dataInGrid[1].defaultWeight);
            expect(sut.gridData[1].isPallet).toEqual(dataInGrid[1].isPallet);

            expect(sut.gridCtrl.rebuildGrid).toHaveBeenCalledWith(dataInGrid);
        });

        it('onSort should return true', () => {
            const sortResult = sut.onSort('defaultDimensions', {packageVolume: 10.22}, {packageVolume: 20.22});
            expect(sortResult).toBe(true);
        });

        it('onSort should return false', () => {
            const sortResult = sut.onSort('defaultDimensions', {packageVolume: 12.22}, {packageVolume: 0.22});
            expect(sortResult).toBe(false);
        });

        it('onSort should return undefined', () => {
            const sortResult = sut.onSort('otherColumn', {packageVolume: 12.22}, {packageVolume: 0.22});
            expect(sortResult).toBe(undefined);
        });
    });

    describe('#mapOptionKey', () => {
        it('should return input as is if provided input is valuable, and do not have "key" property', () => {
            expect(sut.mapOptionKey('qwer')).toEqual('qwer');
            expect(sut.mapOptionKey(234)).toEqual(234);
        });

        it('should return option.key property value if provided input has it', () => {
            const key = 1234;

            expect(sut.mapOptionKey({
                key
            })).toEqual(key);
        });
    });

    describe('#onChangeWeightUnit', () => {
        it('should convert value by service', () => {
            const oldUnit = 'some_old_unit';
            const newUnit = 'some_new_unit';
            const oldValue = 'some_old_value';
            const newValue = 'some_new_value';
            const anyUnit = {};

            sut.singlePackage.defaultWeight.unit = newUnit;
            sut.singlePackage.defaultWeight.value = oldValue;

            packagingMeasuresServiceMock.convertValue.and.returnValue(newValue);
            packagingMeasuresServiceMock.getUnitInfo.and.returnValue(anyUnit);

            sut.onChangeWeightUnit(oldUnit);

            expect(packagingMeasuresServiceMock.convertValue).toHaveBeenCalledWith(oldUnit, newUnit, oldValue);
            expect(sut.singlePackage.defaultWeight.value).toBe(newValue);
        });
    });

    describe('#onChangeDimensionUnit', () => {
        it('should convert value by service', () => {
            const oldUnit = 'some_old_unit';
            const newUnit = 'some_new_unit';
            const oldValue = 'some_old_value';
            const newValue = 'some_new_value';
            const anyUnit = {};

            sut.singlePackage.defaultDimensions.unit = newUnit;
            sut.singlePackage.defaultDimensions.length = oldValue;
            sut.singlePackage.defaultDimensions.width = oldValue;
            sut.singlePackage.defaultDimensions.height = oldValue;

            packagingMeasuresServiceMock.convertValue.and.returnValue(newValue);
            packagingMeasuresServiceMock.getUnitInfo.and.returnValue(anyUnit);

            sut.onChangeDimensionUnit(oldUnit);

            expect(packagingMeasuresServiceMock.convertValue).toHaveBeenCalledWith(oldUnit, newUnit, oldValue);
            expect(sut.singlePackage.defaultDimensions.length).toBe(newValue);
            expect(sut.singlePackage.defaultDimensions.width).toBe(newValue);
            expect(sut.singlePackage.defaultDimensions.height).toBe(newValue);
        });
    });
});
