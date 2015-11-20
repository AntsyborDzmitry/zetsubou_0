import PackageDetailsController from './package-details-controller';

import PackageDetailsService from './package-details-service';
import ShipmentService from './../ewf-shipment-service';
import NavigationService from './../../../services/navigation-service';
import NlsService from './../../../services/nls-service';
import UserService from './../../../services/user-service';
//import ConfirmationDialogService from './../../../services/confirmation/confirmation-dialog-service';

//TODO: replace confirmationDialogService to ConfirmationDialogService in service
//TODO: and make ConfirmationDialogService exported as constructor-function

import 'angularMocks';

describe('PackageDetailsController', () => {
    let sut, $q, $timeout, $filter, uomConverter;
    let packageDetailsService, shipmentService, navigationService, confirmationDialogService, nlsService, userService;
    let deferred, saveDeferred, showConfirmationDeferred;
    const userProfileCountrySom = 'IMPERIAL';
    const shipperCountrySom = 'METRIC';
    const confirmationSaveMessage = 'some_message';
    const weightConvertionRate = 0.34;
    const dimensionConvertionRate = 0.27;
    const shipperCountryConversionPrecision = 3;
    const userProfileCountryConversionPrecision = 4;

    beforeEach(module('ewf'));
    beforeEach(inject((_$q_, _$timeout_, _$filter_) => {
        $q = _$q_;
        $timeout = _$timeout_;
        $filter = _$filter_;

        uomConverter = $filter('convertUomToOpposite');

        nlsService = jasmine.mockComponent(new NlsService());
        nlsService.getTranslationSync.and.returnValue(confirmationSaveMessage);
        userService = jasmine.mockComponent(new UserService());
        userService.isAuthorized.and.returnValue(true);

        navigationService = jasmine.mockComponent(new NavigationService());
        packageDetailsService = jasmine.mockComponent(new PackageDetailsService());
        shipmentService = jasmine.mockComponent(new ShipmentService());
        confirmationDialogService = jasmine.createSpyObj('confirmationDialogService', ['showConfirmationDialog']);

        deferred = $q.defer();
        saveDeferred = $q.defer();
        showConfirmationDeferred = $q.defer();

        packageDetailsService.saveCustomPackaging.and.returnValue(saveDeferred.promise);
        packageDetailsService.getPackagingDetails.and.returnValue(deferred.promise);
        shipmentService.getShipmentCountry.and.returnValue('US');
        shipmentService.getShipmentType.and.returnValue('DOCUMENT');
        shipmentService.getCountrySomParameters.and.returnValue({
            userProfileCountrySom,
            shipperCountrySom,
            weightConvertionRate,
            dimensionConvertionRate,
            shipperCountryConversionPrecision,
            userProfileCountryConversionPrecision
        });
        confirmationDialogService.showConfirmationDialog.and.returnValue(showConfirmationDeferred.promise);

        sut = new PackageDetailsController($timeout, $filter, nlsService, userService, navigationService,
                                            packageDetailsService, shipmentService, confirmationDialogService);
    }));

    describe('#init', () => {
        it('should make initialized true', () => {
            sut.init();
            expect(sut.initialized).toEqual(true);
        });

        it('should check authorization', () => {
            sut.init();
            expect(userService.isAuthorized).toHaveBeenCalled();
        });

        it('should get country soms', () => {
            sut.init();
            expect(shipmentService.getCountrySomParameters).toHaveBeenCalled();
        });

        it('should set userProfileCountry SOM to vm', () => {
            sut.init();
            expect(sut.userProfileCountrySom).toEqual(userProfileCountrySom);
        });

        it('should set reverse weight conversion rate to vm', () => {
            sut.init();
            expect(sut.weightConvertionReverseRate).toEqual(1 / weightConvertionRate);
        });

        it('should set dimension conversion rate to vm', () => {
            sut.init();
            expect(sut.dimensionConvertionRate).toEqual(dimensionConvertionRate);
        });

        it('should set reverse dimension conversion rate to vm', () => {
            sut.init();
            expect(sut.dimensionConvertionReverseRate).toEqual(1 / dimensionConvertionRate);
        });

        it('should set shipper country conversion precision rate to vm', () => {
            sut.init();
            expect(sut.shipperCountryConversionPrecision).toEqual(shipperCountryConversionPrecision);
        });

        it('should set user profile conversion precision rate to vm', () => {
            sut.init();
            expect(sut.userProfileCountryConversionPrecision).toEqual(userProfileCountryConversionPrecision);
        });

        describe('if shipment loaded', () => {
            let loadedPackageDetailsData, dhlPackageName;
            beforeEach(() => {
                dhlPackageName = '4BX';
                nlsService.getTranslationSync.and.returnValue(dhlPackageName);
                loadedPackageDetailsData = {
                    packagingList: [{
                        defaultWeight: 1,
                        height: 10,
                        id: '',
                        length: 10,
                        maxQuantity: 40,
                        maxWeight: 10,
                        name: 'shipment.package_details_own_packaging_label',
                        packageType: 'CUSTOM',
                        pallet: false,
                        reference: 'reference',
                        units: 'METRIC',
                        weight: 10,
                        width: 10
                    }]
                };
                sut.packagingList = [{
                    defaultWeight: 1,
                    height: 30,
                    id: 1,
                    length: 20,
                    maxQuantity: 20,
                    maxWeight: 40,
                    name: dhlPackageName,
                    packageType: 'DHL',
                    pallet: false,
                    reference: 'reference',
                    units: 'METRIC',
                    weight: 2,
                    width: 30
                }];

                shipmentService.getPackageDetailsModelData.and.returnValue({});
                sut.loadShipmentData({});
                sut.init();
            });

            it('should load packaging details data to sut', () => {
                const packagingDetailsData = {
                    data: 'some data'
                };
                shipmentService.getPackageDetailsModelData.and.returnValue(packagingDetailsData);
                sut.loadShipmentData(packagingDetailsData);
                expect(sut).toEqual(jasmine.objectContaining(packagingDetailsData));
            });

            it('should get packaging details', () => {
                expect(packageDetailsService.getPackagingDetails).toHaveBeenCalledWith(sut.shipmentType,
                                                                                                sut.shipmentCountry);
            });

            it('should set packaging list', () => {
                deferred.resolve(loadedPackageDetailsData);
                $timeout.flush();
                expect(sut.packagingList).toEqual(loadedPackageDetailsData.packagingList);
            });

            it('should generate package row with dhl package', () => {
                const packagesRowsAfterConvert = [{
                    height: 8.1,
                    packageId: 1,
                    length: 5.4,
                    maxWeight: 13.6,
                    units: 'METRIC',
                    weight: 0.68,
                    width: 8.1,
                    quantity: 2,
                    widthOriginal: 8.1,
                    heightOriginal: 8.1,
                    lengthOriginal: 5.4,
                    packagingName: dhlPackageName,
                    weightOriginal: 0.68
                }];
                sut.packagesRows = [{
                    height: 30,
                    packageId: 1,
                    length: 20,
                    maxWeight: 40,
                    units: 'METRIC',
                    weight: 2,
                    width: 30,
                    quantity: 2
                }];
                deferred.resolve(loadedPackageDetailsData);
                $timeout.flush();
                expect(sut.packagesRows).toEqual(jasmine.objectContaining(packagesRowsAfterConvert));
            });

            it('should generate package row with custom package', () => {
                const customPackageName = 'custom';
                const packagesRowsAfterConvert = [{
                    height: 8.1,
                    packageId: 2,
                    length: 5.4,
                    maxWeight: 13.6,
                    units: 'METRIC',
                    weight: 0.68,
                    width: 8.1,
                    quantity: 2,
                    widthOriginal: 8.1,
                    heightOriginal: 8.1,
                    lengthOriginal: 5.4,
                    packagingName: customPackageName,
                    weightOriginal: 0.68
                }];
                nlsService.getTranslationSync.and.returnValue(customPackageName);
                sut.packagesRows = [{
                    height: 30,
                    packageId: 2,
                    length: 20,
                    maxWeight: 40,
                    units: 'METRIC',
                    weight: 2,
                    width: 30,
                    quantity: 2
                }];
                deferred.resolve(loadedPackageDetailsData);
                $timeout.flush();
                expect(sut.packagesRows).toEqual(jasmine.objectContaining(packagesRowsAfterConvert));
            });
        });
    });

    describe('#addAnotherPackage', () => {
        it('should add package row', () => {
            sut.selectedSom = 'metric';
            sut.packagesRows = [];
            sut.packagesRows.push = spyOn(sut.packagesRows, 'push');
            sut.addAnotherPackage();

            expect(sut.packagesRows.push).toHaveBeenCalledWith(jasmine.objectContaining({
                isPackagesListVisible: false,
                isFilteredPackagingListNotEmpty: true,
                packagingName: '',
                packagingNameOriginal: '',
                ownPackage: true,
                quantity: 1,
                weight: '',
                maxWeight: '',
                unit: '',
                reference: '',
                dimensionsEditable: true,
                packageType: 'USER_PROFILE',
                width: '',
                height: '',
                length: ''
            }));
        });
    });

    describe('#deletePackageRow', () => {
        it('should delete package row', () => {
            const row = {
                rowId: 3,
                packageId: '',
                packagingName: '',
                packagingNameOriginal: '',
                ownPackage: true,
                quantity: 1,
                weight: '',
                maxWeight: '',
                unit: 'METRIC',
                reference: '',
                packageType: 'CUSTOM',
                dimensions: {
                    editable: false,
                    width: '',
                    height: '',
                    length: ''
                }
            };

            sut.packagesRows.indexOf = spyOn(sut.packagesRows, 'indexOf').and.returnValue(3);
            sut.packagesRows.splice = spyOn(sut.packagesRows, 'splice');

            sut.deletePackageRow(row);
            expect(sut.packagesRows.splice).toHaveBeenCalledWith(3, 1);
        });
    });

    describe('#pickPackage', () => {
        let row, selectedPackaging;
        beforeEach(() => {
            row = {
                rowId: 'some row id',
                packageId: '',
                packagingName: '',
                ownPackage: false,
                quantity: 1,
                weight: '',
                maxWeight: '',
                unit: 'METRIC',
                reference: '',
                dimensionsEditable: false,
                isPackagesListVisible: true,
                isUomMissmatchErrorMessageVisible: false,
                width: '',
                height: '',
                length: ''
            };

            selectedPackaging = {
                id: '29h4f934hf938hf',
                name: 'DHL Large Padded Pouch',
                weight: '8',
                maxWeight: 10,
                width: 5,
                height: 6,
                length: 4,
                packageType: 'USER_PROFILE',
                units: 'METRIC',
                fixedWeight: true
            };

            sut.init();
        });

        it('should update package row fields when packaging SOM equals userProfileCountrySom', () => {
            sut.userProfileCountrySom = 'METRIC';
            sut.pickPackage(row, selectedPackaging);
            $timeout.flush();
            expect(row).toEqual(jasmine.objectContaining({
                packageId: selectedPackaging.id,
                packagingName: selectedPackaging.name,
                weight: selectedPackaging.weight,
                maxWeight: selectedPackaging.maxWeight,
                dimensionsEditable: true,
                width: selectedPackaging.width,
                widthOriginal: selectedPackaging.width,
                height: selectedPackaging.height,
                heightOriginal: selectedPackaging.height,
                length: selectedPackaging.length,
                lengthOriginal: selectedPackaging.length,
                fixedWeight: true
            }));
        });

        it('should update package row fields when packaging SOM and userProfileCountrySom are different', () => {
            sut.userProfileCountrySom = 'IMPERIAL';
            sut.pickPackage(row, selectedPackaging);
            $timeout.flush();
            expect(row).toEqual(jasmine.objectContaining({
                packageId: selectedPackaging.id,
                packagingName: selectedPackaging.name,
                dimensionsEditable: true,
                weight: uomConverter(
                    selectedPackaging.weight,
                    weightConvertionRate,
                    sut.shipperCountryConversionPrecision
                ),
                maxWeight: uomConverter(
                    selectedPackaging.maxWeight,
                    weightConvertionRate,
                    sut.shipperCountryConversionPrecision
                ),
                width: uomConverter(
                    selectedPackaging.width,
                    dimensionConvertionRate,
                    sut.shipperCountryConversionPrecision
                ),
                widthOriginal: uomConverter(
                    selectedPackaging.width,
                    dimensionConvertionRate,
                    sut.shipperCountryConversionPrecision
                ),
                height: uomConverter(
                    selectedPackaging.height,
                    dimensionConvertionRate,
                    sut.shipperCountryConversionPrecision
                ),
                heightOriginal: uomConverter(
                    selectedPackaging.height,
                    dimensionConvertionRate,
                    sut.shipperCountryConversionPrecision
                ),
                length: uomConverter(
                    selectedPackaging.length,
                    dimensionConvertionRate,
                    sut.shipperCountryConversionPrecision
                ),
                lengthOriginal: uomConverter(
                    selectedPackaging.length,
                    dimensionConvertionRate,
                    sut.shipperCountryConversionPrecision
                )
            }));
        });

        it('should set maxWeight to empty in case it is has no limits', () => {
            sut.userProfileCountrySom = 'METRIC';
            selectedPackaging.maxWeight = 0;
            sut.pickPackage(row, selectedPackaging);
            expect(row.maxWeight).toEqual('');
        });

        it('should not convert values for CUSTOM packages (Your own package)', () => {
            sut.userProfileCountrySom = 'IMPERIAL';
            selectedPackaging.packageType = 'CUSTOM';
            sut.pickPackage(row, selectedPackaging);
            expect(row.width).toEqual(selectedPackaging.width);
        });
    });

    describe('#copyPackageRow', () => {
        it('should copy row and insert into packaging list', () => {
            const row = {
                packagingName: 'row1',
                rowId: 1
            };
            sut.packagesRows = [row];
            sut.copyPackageRow(sut.packagesRows[0]);
            expect(sut.packagesRows.length).toEqual(2);
            expect(sut.packagesRows[1].packagingName).toEqual('');
            expect(sut.packagesRows[1].rowId).toEqual(1);
        });
    });

    describe('#hideRowPackagingList', () => {
        let row;
        beforeEach(() => {
            row = {
                isPackagesListVisible: true,
                packageId: 'some id',
                packagingName: 'name',
                packagingNameOriginal: 'name original',
                packageType: 'CUSTOM',
                dimensionsEditable: false,
                width: '1',
                height: '2',
                length: '3'
            };
        });

        it('should hide packaging list', () => {
            sut.hideRowPackagingList(row);
            expect(row.isPackagesListVisible).toEqual(false);
        });

        it('should NOT set packagingName to packagingNameOriginal if packageId is empty', () => {
            row.packageId = '';
            sut.hideRowPackagingList(row);
            expect(row.packagingName).not.toEqual(row.packagingNameOriginal);
        });

        it('should make isSaveButtonAvailable flag truthy if name is changed', () => {
            sut.hideRowPackagingList(row);
            expect(row.isSaveButtonAvailable).toEqual(true);
        });

        it('should make isSaveButtonAvailable flag falsy if name and dimensions were NOT changed', () => {
            row.packagingNameOriginal = 'name';
            row.weightOriginal = row.weight = '10';
            row.widthOriginal = row.width;
            row.heightOriginal = row.height;
            row.lengthOriginal = row.length;
            sut.hideRowPackagingList(row);
            expect(row.isSaveButtonAvailable).toEqual(false);
        });

        it('should make isSaveButtonAvailable flag falsy if name was changed to empty', () => {
            row.packagingNameOriginal = 'name';
            row.packagingName = '';
            sut.hideRowPackagingList(row);
            expect(row.isSaveButtonAvailable).toEqual(false);
        });

        it('should change packaging type from DHL to USER_PROFILE in case of changed name', () => {
            row.packageType = 'DHL';
            sut.hideRowPackagingList(row);
            expect(row.packageType).toEqual('USER_PROFILE');
        });

        it('should set original dimensions and clear default', () => {
            row.packageType = 'DHL';
            sut.hideRowPackagingList(row);
            expect(row).toEqual(jasmine.objectContaining({
                widthOriginal: '1',
                width: '',
                heightOriginal: '2',
                height: '',
                lengthOriginal: '3',
                length: ''
            }));
        });
    });

    describe('#isTotalWeightValid', () => {
        it('should be truthy if maximum total value is default', () => {
            sut.maxTotalWeight = 0;
            expect(sut.isTotalWeightValid()).toEqual(true);
        });

        it('should be truthy if total value is less than maximum allowed total value', () => {
            sut.maxTotalWeight = 20;
            sut.totalWeight = 10;

            expect(sut.isTotalWeightValid()).toEqual(true);
        });

        it('should be truthy even if total value is equal to maximum total value', () => {
            sut.maxTotalWeight = 20;
            sut.totalWeight = 20;

            expect(sut.isTotalWeightValid()).toEqual(true);
        });

        it('should be falsy if total value is more than maximum total value', () => {
            sut.maxTotalWeight = 20;
            sut.totalWeight = 25;

            expect(sut.isTotalWeightValid()).toEqual(false);
        });
    });

    describe('#isTotalQuantityValid', () => {
        it('should be truthy if total quantity is less than maximum allowed total quantity', () => {
            sut.totalQuantity = 10;
            sut.maxTotalQuantity = 20;

            expect(sut.isTotalQuantityValid()).toEqual(true);
        });

        it('should be truthy even if total quantity is equal to maximum allowed total quantity', () => {
            sut.totalQuantity = 20;
            sut.maxTotalQuantity = 20;

            expect(sut.isTotalQuantityValid()).toEqual(true);
        });

        it('should be falsy if total quantity is more than maximum allowed total quantity', () => {
            sut.totalQuantity = 30;
            sut.maxTotalQuantity = 20;

            expect(sut.isTotalQuantityValid()).toEqual(false);
        });
    });

    describe('#isConvertedValuesVisible', () => {
        let row;

        beforeEach(() => {
            row = {};
        });

        it('should be falsy is SOM are equal', () => {
            sut.somAreDifferent = false;
            expect(sut.isConvertedValuesVisible(row)).toEqual(false);
        });

        it('should be falsy if there are no dimensions and weight', () => {
            sut.somAreDifferent = true;
            expect(sut.isConvertedValuesVisible(row)).toEqual(false);
        });

        it('should be truthy if there is any dimension', () => {
            sut.somAreDifferent = true;
            row.height = 10;

            expect(sut.isConvertedValuesVisible(row)).toEqual(true);
        });

        it('should be truthy if the weight is defined', () => {
            sut.somAreDifferent = true;
            row.weight = 10;

            expect(sut.isConvertedValuesVisible(row)).toEqual(true);
        });

        it('should be truthy if every dimension and weight are defined', () => {
            sut.somAreDifferent = true;
            row = {
                width: 10,
                height: 10,
                length: 10,
                weight: 10
            };

            expect(sut.isConvertedValuesVisible(row)).toEqual(true);
        });
    });

    describe('#onNextClick', () => {
        let form, ewfFormCtrl, row;
        const field = {
            $dirty: false,
            $invalid: false,
            $viewValue: 'value',
            $setViewValue: jasmine.createSpy('$setViewValue')
        };
        let nextCallback;
        const countrySom = 'IMPERIAL';

        beforeEach(() => {
            nextCallback = jasmine.createSpy('nextCallback');
            sut.setNextCallback(nextCallback);

            ewfFormCtrl = jasmine.createSpyObj('ewfFormCtrl', ['ewfValidation']);
            ewfFormCtrl.ewfValidation.and.returnValue(true);

            sut.totalWeight = 40;
            sut.totalQuantity = 10;
            sut.maxTotalWeight = 50;
            row = {
                packageType: 'DHL',
                width: '1',
                height: '1',
                length: '1'
            };
            sut.packagesRows = [row];
            form = {
                $dirty: false,
                field,
                $invalid: false
            };

            field.$invalid = false;
        });

        it('should call next callback if form is valid and total weight is normal', () => {
            sut.onNextClick(form);
            expect(nextCallback).toHaveBeenCalled();
        });

        it('should call next callback if form is valid and max total weight equals 0', () => {
            sut.totalWeight = 50;
            sut.maxTotalWeight = 0;
            sut.onNextClick(form);
            expect(nextCallback).toHaveBeenCalled();
        });

        it('should call next callback if form is valid and total quantity valid', () => {
            sut.onNextClick(form);
            expect(nextCallback).toHaveBeenCalled();
        });

        it('should call next callback if form is valid and total weight is equal max allowed weight', () => {
            sut.totalWeight = sut.maxTotalWeight;
            sut.onNextClick(form);
            expect(nextCallback).toHaveBeenCalled();
        });

        it('should call next callback if form is valid and total weight is equal max allowed weight', () => {
            sut.totalQuantity = sut.maxTotalQuantity;
            sut.onNextClick(form);
            expect(nextCallback).toHaveBeenCalled();
        });

        it('should NOT call next callback if form is valid, but total weight is more then allowed', () => {
            sut.totalWeight = 100;

            sut.onNextClick(form);
            expect(nextCallback).not.toHaveBeenCalled();
        });

        it('should NOT call next callback if form is NOT valid', () => {
            form.$invalid = true;

            sut.onNextClick(form, ewfFormCtrl);
            expect(nextCallback).not.toHaveBeenCalled();
        });

        it('should trigger form fields validation if form is NOT valid', () => {
            form.$invalid = true;

            sut.onNextClick(form, ewfFormCtrl);
            expect(ewfFormCtrl.ewfValidation).toHaveBeenCalled();
        });

        it('shoud NOT allow to pass an empty packagesRows list', () => {
            sut.packagesRows = [];
            sut.onNextClick(form);
            expect(nextCallback).not.toHaveBeenCalled();
        });

        describe('setRowsData', () => {
            beforeEach(() => {
                spyOn(angular, 'copy').and.returnValue(sut.packagesRows);
            });

            it('should prepare data based on copied rows', () => {
                sut.onNextClick(form);
                expect(angular.copy).toHaveBeenCalledWith(sut.packagesRows);
            });

            it('should set unit for each row', () => {
                sut.onNextClick(form);
                row.unit = countrySom;
                expect(shipmentService.setPackageDetails).toHaveBeenCalledWith([row]);
            });

            it('should convert weight and dimensions to shipper country if SOM are different', () => {
                sut.onNextClick(form);
                row.weight = uomConverter(row.weight, weightConvertionRate, sut.shipperCountryConversionPrecision);
                row.width = uomConverter(row.width, dimensionConvertionRate, sut.shipperCountryConversionPrecision);
                row.height = uomConverter(row.height, dimensionConvertionRate, sut.shipperCountryConversionPrecision);
                row.length = uomConverter(row.length, dimensionConvertionRate, sut.shipperCountryConversionPrecision);
                expect(shipmentService.setPackageDetails).toHaveBeenCalledWith([row]);
            });

            it('should unset dimensions if user was not provided them', () => {
                row.knownDimensions = false;
                row.packageType = sut.PACKAGING_TYPES.CUSTOM;
                sut.onNextClick(form);

                row.width = null;
                row.height = null;
                row.length = null;

                expect(shipmentService.setPackageDetails).toHaveBeenCalledWith([row]);
            });
        });

        it('should set total weight and total weight uom to shipment service', () => {
            sut.totalWeight = '20';
            sut.userProfileWeightUomKey = 'shipment.package_details_kg';
            sut.onNextClick(form);
            expect(shipmentService.setTotalWeight).toHaveBeenCalledWith(sut.totalWeight, sut.userProfileWeightUomKey);
        });
    });

    describe('#onEditClick', () => {
        it('should call edit callback', () => {
            const editCallback = jasmine.createSpy('editCallback');
            sut.setEditCallback(editCallback);

            sut.onEditClick();

            expect(editCallback).toHaveBeenCalled();

        });
    });

    describe('#edit', () => {
        beforeEach(() => {
            sut.editModeActive = false;
        });

        it('should call service to get shipment country if is not received yet', () => {
            sut.edit();
            expect(shipmentService.getShipmentCountry).toHaveBeenCalled();
        });

        it('should call service to get shipment country if is not received yet', () => {
            sut.edit();
            expect(shipmentService.getShipmentType).toHaveBeenCalled();
        });

        it('should call service to get package list if is not received yet and shipment country selected', () => {
            sut.packagingList = [];
            sut.edit();
            expect(packageDetailsService.getPackagingDetails)
                .toHaveBeenCalledWith(sut.shipmentType, sut.shipmentCountry);
        });

        it(`should NOT call service to get package list
                if already received and shippment country and type are the same`, () => {
            sut.shipmentType = 'DOCUMENT';
            shipmentService.getShipmentType.and.returnValue(sut.shipmentType);
            sut.shipmentCountry = 'US';
            shipmentService.getShipmentCountry.and.returnValue(sut.shipmentCountry);

            sut.packagingList = [{
                packageId: 'some id'
            }];

            sut.edit();
            expect(packageDetailsService.getPackagingDetails).not.toHaveBeenCalled();
        });

        it('should clear pieces updating packaging details', () => {
            sut.packagesRows = [{rowId: 1}];
            sut.packagingList = [];
            sut.edit();

            expect(sut.packagesRows).toEqual([]);
        });
    });

    describe('#getPackageIconUrl', () => {
        const pkg = {
            id: '2BX',
            packageType: 'DHL'
        };
        const origin = 'http://origin/';
        let url;

        beforeEach(() => {
            navigationService.getOriginFromUrl.and.returnValue(origin);
        });

        it('should call service method to get origin', () => {
            url = sut.getPackageIconUrl(pkg);
            expect(navigationService.getOriginFromUrl).toHaveBeenCalled();
        });

        it('should return correct url', () => {
            url = sut.getPackageIconUrl(pkg);
            expect(url).toEqual(origin + '/etc/clientlibs/dhl/global/public/img/packaging/' + pkg.id + '.png');
        });

        it('should empty url in case of CUSTOM package type', () => {
            pkg.packageType = 'CUSTOM';
            url = sut.getPackageIconUrl(pkg);
            expect(url).toEqual('');
        });
    });

    describe('#handleSaveAction', () => {
        const form = {
            $invalid: false
        };
        const row = {
            packagingName: 'name',
            packagingNameOriginal: 'name',
            packageType: 'CUSTOM',
            dimensions: {
                height: 1,
                length: 1,
                weight: 1
            }
        };
        beforeEach(() => {
            sut.packagingList = [{
                name: 'name',
                packageType: 'CUSTOM'
            }];
            spyOn(sut, 'saveCustomPackaging');
        });

        it('should open confirmation popup if name is the same', () => {
            sut.handleSaveAction(row, form);
            expect(confirmationDialogService.showConfirmationDialog).toHaveBeenCalledWith(confirmationSaveMessage);
        });

        it('should get nls message for confirmation', () => {
            const nlsKey = 'shipment.package_details_save_confirmation_message';
            sut.handleSaveAction(row, form);
            expect(nlsService.getTranslationSync).toHaveBeenCalledWith(nlsKey);
        });

        it('should NOT get nls message for confirmation twice but use local var', () => {
            sut.handleSaveAction(row, form);
            sut.handleSaveAction(row, form);
            expect(nlsService.getTranslationSync.calls.count()).toEqual(1);
        });

        it('should save package if user confirms', () => {
            sut.handleSaveAction(row, form);
            showConfirmationDeferred.resolve();
            $timeout.flush();
            expect(sut.saveCustomPackaging).toHaveBeenCalledWith(row);
        });
    });

    describe('#saveCustomPackaging', () => {
        const customPackaging = {
            name: 'My custom package',
            shipmentType: 'DOCUMENT',
            width: 1,
            height: 2,
            length: 3,
            weight: '10',
            units: 'METRIC',
            packageType: 'USER_PROFILE'
        };

        const row = {
            rowId: 1,
            packagingName: 'My custom package',
            packageId: '',
            ownPackage: true,
            quantity: 1,
            weight: '10',
            unit: 'METRIC',
            reference: '',
            dimensionsEditable: false,
            width: 1,
            height: 2,
            length: 3
        };

        beforeEach(() => {
            sut.userProfileCountrySom = 'METRIC';
            sut.hideRowPackagingList({}, {
                $invalid: false
            });
        });

        it('should save custom package', () => {
            sut.shipmentType = 'DOCUMENT';
            sut.saveCustomPackaging(row);
            saveDeferred.resolve({});
            expect(packageDetailsService.saveCustomPackaging).toHaveBeenCalledWith(customPackaging);
        });

        it('should hide Save button', () => {
            sut.saveCustomPackaging(row);
            expect(row.isSaveButtonAvailable).toEqual(false);
        });

        it('should set packaging id that comes from response and put it to the list', () => {
            const response = 5;
            sut.packagingList = [];
            sut.shipmentType = 'DOCUMENT';
            customPackaging.id = response;

            sut.saveCustomPackaging(row);
            saveDeferred.resolve(response);
            $timeout.flush();

            expect(sut.packagingList[0]).toEqual(customPackaging);
        });

        it('should pick custom package', () => {
            const response = 5;
            sut.packagingList = [];
            sut.shipmentType = 'DOCUMENT';
            customPackaging.id = response;

            spyOn(sut, 'pickPackage');
            sut.saveCustomPackaging(row);
            saveDeferred.resolve(response);
            $timeout.flush();

            expect(sut.pickPackage).toHaveBeenCalledWith(row, customPackaging);
        });
    });

    describe('#updateSaveButtonState', () => {
        let row = {
            width: 2,
            widthOriginal: 2,
            height: 3,
            heightOriginal: 3,
            length: 4,
            lengthOriginal: 4,
            weight: 1,
            weightOriginal: 1,
            isSaveButtonAvailable: false,
            packageType: 'USER_PROFILE',
            packagingName: 'fake name',
            saved: true
        };

        it('should set isSaveButtonAvailable to false if there are no changes', () => {
            row.packagingNameOriginal = row.packagingName;
            sut.updateSaveButtonState(row);
            expect(row.isSaveButtonAvailable).toEqual(false);
        });

        it('should set isSaveButtonAvailable to true if there are any changes in mandatory field - weight', () => {
            row.weight = 10;
            sut.updateSaveButtonState(row);
            expect(row.isSaveButtonAvailable).toEqual(true);
        });

        it('should mark row as unsaved', () => {
            sut.hideRowPackagingList(row);
            expect(row.saved);
        });
    });

    describe('#triggerPackagingListVisibility', () => {
        let row = {
            isPackagesListVisible: true
        };

        it('should trigger isPackagesListVisible for row', () => {
            sut.triggerPackagingListVisibility(row);
            expect(row.isPackagesListVisible).toEqual(false);
        });
    });

    describe('#onGetPackagingDetails', () => {
        let response = {
            defaultPiecesAmount: 3,
            defaultPackagingId: '4BX',
            packagingList: [
                {
                    id: '4BX',
                    name: 'Test Box'
                },
                {
                    id: '1',
                    packageType: 'CUSTOM',
                    name: 'shipment.package_details_own_packaging_label'
                }
            ],
            maxTotalWeight: 123,
            maxTotalWeightSom: 'IMPERIAL'
        };

        function imitateEdit() {
            sut.shipmentCountry = 'US';
            sut.packagingList = [];
            sut.edit();

            deferred.resolve(response);
            $timeout.flush();
        }

        beforeEach(() => {
            nlsService.getTranslationSync.and.returnValue('translated name');
            sut.init();
            imitateEdit();
        });

        it('should save response to packagingList', () => {
            expect(sut.packagingList).toEqual(response.packagingList);
        });

        it('should save translated name into proper field', () => {
            expect(sut.packagingList[1].name).toEqual('translated name');
        });

        it('should set max total quantity to 999 in case it is not specified in response', () => {
            expect(sut.maxTotalQuantity).toEqual(999);
        });

        it('should set max total quantity to 999 in case it is not specified in response', () => {
            response.maxTotalQuantity = 0;
            imitateEdit();
            expect(sut.maxTotalQuantity).toEqual(999);
        });

        describe('getMaxTotalWeight', () => {
            it('should not conver maxTotalWeight if its SOM is the same as in user profile', () => {
                sut.userProfileCountrySom = 'IMPERIAL';
                expect(sut.maxTotalWeight).toEqual(response.maxTotalWeight);
            });

            it('should not conver maxTotalWeight if its SOM is the same as in user profile', () => {
                sut.userProfileCountrySom = 'METRIC';
                sut.userProfileCountryConversionPrecision = 1;
                const convertedMaxTotalWeight = uomConverter(response.maxTotalWeight, 1,
                                                                sut.userProfileCountryConversionPrecision);
                expect(sut.maxTotalWeight).toEqual(convertedMaxTotalWeight);
            });
        });

        describe('#generatePackagingRows', () => {
            it('should generate packaging rows in amount defined by user settings', () => {
                expect(sut.packagesRows.length).toEqual(response.defaultPiecesAmount);
            });

            it('should generate 1 row if user did not defined it in settings', () => {
                sut.packagesRows = [];
                response.defaultPiecesAmount = undefined;
                imitateEdit();

                expect(sut.packagesRows.length).toEqual(1);
            });

            it('should generate packaging rows with defined like default', () => {
                sut.packagesRows = [];
                response.packagingList[0].defaultPackaging = true;
                imitateEdit();

                expect(sut.packagesRows[0].packageId).toEqual(response.packagingList[0].id);
            });

            it('should generate packaging rows with defined by user packaging id for every row', () => {
                sut.packagesRows = [];
                response.packagingList[0].defaultPackaging = true;
                imitateEdit();
                sut.packagesRows.filter = jasmine.createSpy().and.returnValue([]);
                let wrongRows = sut.packagesRows.filter();
                expect(wrongRows.length).toEqual(0);
            });

            it('should not affect adding new empty package row', () => {
                sut.addAnotherPackage();
                expect(sut.packagesRows[sut.packagesRows.length - 1].packageId).toEqual('');
            });
        });
    });

    describe('#filteringPackagingList', () => {
        beforeEach(() => {
            sut.packagingList = [{
                    name: 'Some 1'
                },
                {
                    name: 'Some 2'
                }];
        });

        it('should set true isFilteredPackagingListNotEmpty to current row if it is not empty after filtering', () => {
            let row = {
                packagingName: '1'
            };

            sut.filteringPackagingList(row);

            expect(row.isFilteredPackagingListNotEmpty).toEqual(true);
        });

        it('should set false isFilteredPackagingListNotEmpty to current row if it is empty after filtering', () => {
            let row = {
                packagingName: '3'
            };

            sut.filteringPackagingList(row);

            expect(row.isFilteredPackagingListNotEmpty).toEqual(false);
        });

        it('should set true isFilteredPackagingListNotEmpty to current row if packaging name field is empty', () => {
            let row = {
                packagingName: ''
            };

            sut.filteringPackagingList(row);

            expect(row.isFilteredPackagingListNotEmpty).toEqual(true);
        });
    });

    describe('#onKnownDimensionsChange', () => {
        let row;

        beforeEach(() => {
            row = {
                knownDimensions: false,
                dimensionsEditable: true,
                width: '10',
                height: '20',
                length: '30'
            };
        });

        it('it should change row dimensionsEditable in accordance with knownDimensions flag', () => {
            sut.onKnownDimensionsChange(row);
            expect(row.dimensionsEditable).toEqual(row.knownDimensions);
        });

        it('should clear dimensions if user does not provided dimensions but checked that he knows it', () => {
            row.knownDimensions = true;
            sut.onKnownDimensionsChange(row);
            expect(row).toEqual(jasmine.objectContaining({
                width: '',
                height: '',
                length: ''
            }));
        });

        it('should unset dimensions if user does not knows them', () => {
            row.knownDimensions = false;
            row.packageType = sut.PACKAGING_TYPES.CUSTOM;
            sut.onKnownDimensionsChange(row);

            expect(row).toEqual(jasmine.objectContaining({
                width: null,
                height: null,
                length: null
            }));
        });

        it('should unset dimensions if user set custom type of packaging and does not provided dimensions', () => {
            row.knownDimensions = false;
            row.packageType = sut.PACKAGING_TYPES.CUSTOM;
            sut.onKnownDimensionsChange(row);

            expect(row).toEqual(jasmine.objectContaining({
                width: null,
                height: null,
                length: null
            }));
        });
    });

    describe('#generateRowsWithPredefinedWeight', () => {
        const ewfFormCtrl = {
            ewfValidation: jasmine.createSpy().and.returnValue(true)
        };
        const form = {
            $invalid: true
        };

        beforeEach(() => {
            sut.packagesRows = [];
            sut.generator = {
                weight: 1.5,
                piecesAmount: 2
            };
        });

        it('should no generate any rows in case of invalid form', () => {
            sut.generateRowsWithPredefinedWeight(form, ewfFormCtrl);
            expect(sut.packagesRows.length).toEqual(0);
        });

        it('should trigger validation of invalid field', () => {
            sut.generateRowsWithPredefinedWeight(form, ewfFormCtrl);
            expect(ewfFormCtrl.ewfValidation).toHaveBeenCalled();
        });

        it('should generate rows according to specified pieces amount', () => {
            form.$invalid = false;
            sut.generateRowsWithPredefinedWeight(form, ewfFormCtrl);
            expect(sut.packagesRows.length).toEqual(sut.generator.piecesAmount);
        });

        it('should generate rows with specified weight', () => {
            form.$invalid = false;
            sut.generateRowsWithPredefinedWeight(form, ewfFormCtrl);
            expect(sut.packagesRows[0].weight).toEqual(sut.generator.weight);
        });

        it('should generate row with empty weight if it is not specified', () => {
            sut.generator.weight = '';
            sut.generateRowsWithPredefinedWeight(form, ewfFormCtrl);
            expect(sut.packagesRows[0].weight).toEqual(sut.generator.weight);
        });

        it('should not generate any rows if pieces amount is not specified', () => {
            sut.generator.piecesAmount = '';
            sut.generateRowsWithPredefinedWeight(form, ewfFormCtrl);
            expect(sut.packagesRows.length).toEqual(0);
        });
    });

    describe('#generateFixedWeightMsg', () => {
        const fakeNlsMessage = 'Fake {weight} and fake dimensions {width} x {height} x {length}.';
        const row = {
            weight: 1,
            width: 2,
            height: 3,
            length: 4
        };
        beforeEach(() => {
            sut.userProfileWeightUomKey = 'weight key';
            sut.userProfileDimensionsUomKey = 'dimension key';
            nlsService.getTranslationSync.and.callFake((key) => {
                if (key === sut.userProfileWeightUomKey) {
                    return 'kg';
                } else if (key === sut.userProfileDimensionsUomKey) {
                    return 'cm';
                } else if (key === 'shipment.package_details_fixed_weight_message') {
                    return fakeNlsMessage;
                }
            });
        });

        it('should replace weight and dimensions placeholders with actual data from row', () => {
            const msg = sut.generateFixedWeightMsg(row);
            expect(msg).toEqual('Fake 1kg and fake dimensions 2cm x 3cm x 4cm.');
        });
    });

    describe('#showReadOnlyDimensions', () => {
        const row = {
            dimensionsEditable: false,
            fixedWeight: false,
            packageId: '2BX'
        };

        it('should show dimensions as readonly', () => {
            expect(sut.showReadOnlyDimensions(row)).toEqual(true);
        });

        it('should show NOT show readonly dimensions in case of fixed weight packageing', () => {
            row.fixedWeight = true;
            const result = sut.showReadOnlyDimensions(row);
            expect(result).toEqual(false);
        });

        it('should show NOT show readonly dimensions in case of dimensionsEditable flag is false', () => {
            row.dimensionsEditable = false;
            const result = sut.showReadOnlyDimensions(row);
            expect(result).toEqual(false);
        });

        it('should show NOT show readonly dimensions in case of empty id', () => {
            row.packageId = '';
            const result = sut.showReadOnlyDimensions(row);
            expect(result).toEqual(false);
        });
    });

    describe('#calcGeneratorMaxPiecesAmount', () => {
        it('should calculate maximum allowed pieces amount for package generator', () => {
            sut.maxTotalQuantity = 10;
            sut.totalQuantity = 5;
            expect(sut.calcGeneratorMaxPiecesAmount()).toEqual(sut.maxTotalQuantity - sut.totalQuantity);
        });
    });

    describe('calcGeneratorMaxWeight', () => {
        beforeEach(() => {
            sut.maxTotalWeight = 10;
            sut.totalWeight = 5;
            sut.generator = {
                piecesAmount: 2
            };
        });

        it('should calculate maximum allowed weight for package generator', () => {
            const allowedAmount = (sut.maxTotalWeight - sut.totalWeight) / sut.generator.piecesAmount;
            expect(sut.calcGeneratorMaxWeight()).toEqual(allowedAmount);
        });

        it('should calculate maximum allowed weight for package generator even if amount is not specified', () => {
            sut.generator.piecesAmount = '';
            const allowedAmount = (sut.maxTotalWeight - sut.totalWeight) / 1;
            expect(sut.calcGeneratorMaxWeight()).toEqual(allowedAmount);
        });
    });

    describe('#isQuantityCorrectForCopy', () => {
        beforeEach(() => {
            sut.maxTotalQuantity = 10;
            sut.packagesRows = [{
                packagingName: 'row1',
                quantity: 1
            }];
        });

        it('should return true if quantity will not exceed max totals after copy', () => {
            const row = {
                packagingName: 'row',
                quantity: 1
            };
            const result = sut.isQuantityCorrectForCopy(row);
            expect(result).toEqual(true);
        });

        it('should return false if weight and quantity will exceed max totals after copy', () => {
            const row = {
                packagingName: 'row',
                quantity: 40
            };
            const result = sut.isQuantityCorrectForCopy(row);
            expect(result).toEqual(false);
        });
    });

    describe('#getCurrentIncompleteData', () => {
        let row;

        beforeEach(() => {
            sut.totalWeight = 40;
            sut.totalQuantity = 10;
            sut.maxTotalWeight = 50;
            row = {
                packageType: 'DHL',
                width: '1',
                height: '1',
                length: '1'
            };
            sut.packagesRows = [row];
        });

        it('should get current data without validation', () => {
            sut.init();
            sut.getCurrentIncompleteData();
            expect(shipmentService.setPackageDetails).toHaveBeenCalled();
        });
    });

    describe('#loadShipmentData', () => {
        const shipmentData = {
            fromAddress: {
                countryCode: 'JP'
            },
            type: 'DOCUMENT',
            pieces: [
                {
                    height: 80,
                    width: 90,
                    length: 120,
                    weight: 5,
                    unit: 'METRIC',
                    quantity: 1,
                    packageId: 3,
                    refNum: 'Ref'
                }
            ]
        };
        const packageDetailsData = {
            shipmentCountry: 'JP',
            shipmentType: 'DOCUMENT',
            packagesRows: [
                {
                    height: 80,
                    width: 90,
                    length: 120,
                    weight: 5,
                    unit: 'METRIC',
                    quantity: 1,
                    packageId: 3,
                    reference: 'Ref',
                    rowId: 1
                }
            ]
        };

        beforeEach(() => {
            shipmentService.getPackageDetailsModelData.and.returnValue(packageDetailsData);
            sut.loadShipmentData(shipmentData);
        });

        it('should populate controller with package details data', () => {
            expect(shipmentService.getPackageDetailsModelData).toHaveBeenCalledWith(shipmentData);
            expect(sut).toEqual(jasmine.objectContaining(packageDetailsData));
        });
    });
});
