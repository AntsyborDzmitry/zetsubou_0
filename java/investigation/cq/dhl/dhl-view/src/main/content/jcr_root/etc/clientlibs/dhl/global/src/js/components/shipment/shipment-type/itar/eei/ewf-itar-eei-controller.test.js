import ItarEeiController from './ewf-itar-eei-controller';
import NlsService from './../../../../../services/nls-service';
import ShipmentService from './../../../ewf-shipment-service';
import ShipmentTypeService from './../../shipment-type-service';
import EwfFormController from './../../../../../directives/ewf-form/ewf-form-controller';
import ItarService from './../ewf-itar-service';
import PackageDetailsService from './../../../package-details/package-details-service';
import 'angularMocks';

describe('ItarEeiController', () => {
    let sut, defer, $q, $timeout, $filter, criticalValueDeferred;
    let nlsService, shipmentService, shipmentTypeService, itarService, packageDetailsService;
    let criticalPrice, description;
    let basicNlsCalls = 0;

    const countrySomParameters = {
        shipperCountrySom: 'METRIC',
        weightConvertionRate: 3.2,
        userProfileCountryConversionPrecision: 3
    };

    beforeEach(module('ewf'));
    beforeEach(inject((_$q_, _$timeout_, _$filter_) => {
        $q = _$q_;
        $timeout = _$timeout_;
        $filter = _$filter_;
        defer = $q.defer();
        criticalValueDeferred = $q.defer();
        criticalPrice = 2500;

        nlsService = jasmine.mockComponent(new NlsService());
        shipmentService = jasmine.mockComponent(new ShipmentService());
        shipmentTypeService = jasmine.mockComponent(new ShipmentTypeService());
        itarService = jasmine.mockComponent(new ItarService());
        packageDetailsService = jasmine.mockComponent(new PackageDetailsService());

        shipmentService.getCountrySomParameters.and.returnValue(countrySomParameters);
        shipmentTypeService.getShipmentParameters.and.returnValue(defer.promise);
        packageDetailsService.getPackagingDetails.and.returnValue(defer.promise);
        itarService.getItarDetails.and.returnValue(defer.promise);
        itarService.getCriticalShipmentItem.and.returnValue(criticalValueDeferred.promise);

        sut = new ItarEeiController(
            $filter,
            nlsService,
            shipmentService,
            shipmentTypeService,
            itarService,
            packageDetailsService
        );

        description = 'Most shipments under $2500 are filed under Federal Trade Regulations (FTR)';
        const replaceSpy = jasmine.createSpy().and.returnValue(description);
        nlsService.getTranslationSync.and.returnValue({
            replace: replaceSpy
        });
    }));

    describe('#init', () => {
        const maxTotalWeight = 12;
        const maxTotalValue = 2500;
        const response = {
            maxTotalWeight,
            criticalShipmentItemValue: maxTotalValue,
            units: [{
                name: 'Gramms',
                default: false
            }, {
                name: 'Pieces',
                default: true
            }]
        };

        beforeEach(() => {
            sut.init();
            criticalValueDeferred.resolve(criticalPrice);
            $timeout.flush();
        });

        it('should have init method', () => {
            expect(sut.init).toBeDefined();
        });

        it('should add one default row to the commodities list', () => {
            expect(sut.commodityList.length).toEqual(1);
        });

        describe('when custom invoices exists', () => {
            it('should call getCustomsInvoice method from shipment service.', () => {
                expect(shipmentService.getCustomsInvoice).toHaveBeenCalledWith();
            });

            it('should not affect commodity list if shipment service returned customs invoice without items', () => {
                const initialCommodityList = ['test'];
                sut.commodityList = initialCommodityList;
                shipmentService.getCustomsInvoice.and.returnValue({});

                expect(sut.commodityList).toEqual(initialCommodityList);
            });

            it('should map data and sum weight and value for the same commodity from item-attr to ITAR EEI', () => {
                const expectedResult = {
                    description: '1234/some description',
                    quantity: 5,
                    quantityUnit: 'Pieces',
                    totalWeight: 66,
                    totalValue: 38,
                    editable: false
                };

                shipmentService.getCustomsInvoice.and.returnValue({
                    items: [{
                        commodityCode: 1234,
                        countryOfManufactureCode: 'US',
                        grossWeight: 11,
                        netWeight: 12,
                        quantity: 2,
                        value: 7,
                        quantityUnits: 'Pieces',
                        description: 'some description'
                    }, {
                        commodityCode: 1234,
                        countryOfManufactureCode: 'US',
                        grossWeight: 13,
                        netWeight: 14,
                        quantity: 3,
                        value: 8,
                        quantityUnits: 'Pieces',
                        description: 'some description'
                    }]
                });
                sut.init();

                expect(sut.commodityList[0]).toEqual(jasmine.objectContaining(expectedResult));
            });
        });

        it('should set maximum total value on form', () => {
            defer.resolve(response);
            $timeout.flush();

            expect(sut.maxTotalValue).toEqual(maxTotalValue);
        });

        it('should set maximum total value in description of block', () => {
            defer.resolve(response);
            $timeout.flush();
            basicNlsCalls++;

            expect(sut.descriptionContinuing).toEqual(description);
        });

        it('should translate export codes and license types nls keys', () => {
            const nlsCallsCount = nlsService.getTranslationSync.calls.count();
            const expectedCallsCount = sut.exportCodes.length + sut.licenseTypes.length + basicNlsCalls;

            expect(nlsCallsCount).toEqual(expectedCallsCount);
        });

        describe('quantity units', () => {
            beforeEach(() => {
                defer.resolve(response);
                $timeout.flush();
            });

            it('should call getShipmentItemAttributesDetails method to get quantity units', () => {
                expect(shipmentTypeService.getShipmentParameters).toHaveBeenCalled();
            });

            it('should map quantity units from response', () => {
                const expectedList = ['Gramms', 'Pieces'];
                expect(sut.quantityUnits).toEqual(expectedList);
            });

            it('should set default quantity unit', () => {
                expect(sut.commodityList[0].quantityUnit).toEqual('Pieces');
            });
        });

        it('should get country SOM parameters', () => {
            expect(shipmentService.getCountrySomParameters).toHaveBeenCalledWith();
        });

        it('should set current weight unit according to the SOM', () => {
            expect(sut.currentWeightUnit).toEqual('kg');
        });

        it('should set weight convertion rate', () => {
            expect(sut.weightConvertionRate).toEqual(countrySomParameters.weightConvertionRate);
        });

        it('should set weight convertion precision', () => {
            const expectedPrecision = countrySomParameters.userProfileCountryConversionPrecision;
            expect(sut.userProfileCountryConversionPrecision).toEqual(expectedPrecision);
        });

        it('should perform service call to get maximum total weight', () => {
            expect(packageDetailsService.getPackagingDetails).toHaveBeenCalled();
        });

        it('should set maximum total weight', () => {
            defer.resolve(response);
            $timeout.flush();

            expect(sut.maxTotalWeight).toEqual(maxTotalWeight);
        });

        it('should call itar-service to get maximum total value', () => {
            expect(itarService.getCriticalShipmentItem).toHaveBeenCalled();
        });
    });

    describe('#addEmptyCommodityRow', () => {
        it('should add new row to the commodities list', () => {
            sut.commodityList = [];
            sut.addEmptyCommodityRow();

            expect(sut.commodityList.length).toEqual(1);
        });
    });

    describe('#addNewCommodityRow', () => {
        let form, ewfFormCtrl;

        beforeEach(() => {
            sut.commodityList = [];
            form = {$valid: true};
            ewfFormCtrl = jasmine.mockComponent(new EwfFormController());
        });

        it('should trigger validation if form is invalid', () => {
            form.$valid = false;
            sut.addNewCommodityRow(form, ewfFormCtrl);

            expect(ewfFormCtrl.ewfValidation).toHaveBeenCalled();
        });

        it('should add commodity row if the form is valid', () => {
            sut.addNewCommodityRow(form, ewfFormCtrl);
            expect(sut.commodityList.length).toEqual(1);
        });

        it('should not add commodity row if the form is invalid', () => {
            form.$valid = false;
            ewfFormCtrl.ewfValidation.and.returnValue(true);
            sut.addNewCommodityRow(form, ewfFormCtrl);

            expect(sut.commodityList.length).toEqual(0);
        });
    });

    describe('#deleteCommodityRow', () => {
        it('should remove the chosen row from commodities list', () => {
            const initialList = [{
                quantity: 2,
                description: 'test'
            }, {
                quantity: 1,
                description: 'other'
            }];
            const expectedList = [{
                quantity: 1,
                description: 'other'
            }];
            sut.commodityList = initialList;
            sut.deleteCommodityRow(initialList[0]);

            expect(sut.commodityList).toEqual(jasmine.objectContaining(expectedList));
        });
    });

    describe('#calculateTotalWeight', () => {
        it('should calculate total weight', () => {
            sut.commodityList = [{
                quantity: 1,
                totalWeight: 0.1
            }, {
                quantity: 1,
                totalWeight: 0.2
            }, {
                quantity: 3,
                totalWeight: 4
            }];
            expect(sut.calculateTotalWeight()).toEqual(12.3);
        });
    });
});
