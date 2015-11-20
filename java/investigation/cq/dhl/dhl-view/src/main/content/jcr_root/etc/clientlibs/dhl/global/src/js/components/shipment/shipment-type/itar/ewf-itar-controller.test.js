import ItarController from './ewf-itar-controller';
import ShipmentService from './../../ewf-shipment-service';
import ItarService from './ewf-itar-service';
import NlsService from './../../../../services/nls-service';
import ModalService from './../../../../services/modal/modal-service';
import ConfigService from './../../../../services/config-service';
import 'angularMocks';

describe('ItarController', () => {
    let sut;
    let nlsService, modalService, shipmentService, itarService, configService;
    let country, itarDetails;
    let $q, $timeout, $scope, $filter, deferred, criticalValueDeferred, configDeferred, enableItarDeferred;
    let messageCode, translatedMessageWithCriticalValue, criticalPrice, info;

    beforeEach(module('ewf'));
    beforeEach(inject((_$q_, _$timeout_, _$filter_) => {
        $q = _$q_;
        $timeout = _$timeout_;
        $scope = {id: '123'};
        $filter = _$filter_;

        country = 'US';
        itarDetails = {
            criticalShipmentItemValue: 2500,
            ftrExemptionList: ['30.2(d)(2)', '30.36', '30.37(b)', '30.37(e)', '30.37(f)'],
            employeeIdentificationNumberAvailable: true
        };
        criticalValueDeferred = $q.defer();
        configDeferred = $q.defer();
        enableItarDeferred = $q.defer();

        nlsService = jasmine.mockComponent(new NlsService());
        modalService = jasmine.mockComponent(new ModalService());
        configService = jasmine.mockComponent(new ConfigService());
        configService.getValue.and.returnValue(configDeferred.promise);

        shipmentService = jasmine.mockComponent(new ShipmentService());
        shipmentService.getShipmentCountry.and.returnValue(country);

        itarService = jasmine.mockComponent(new ItarService());
        itarService.getCriticalShipmentItem.and.returnValue(criticalValueDeferred.promise);
        deferred = $q.defer();
        itarService.getItarDetails.and.returnValue(deferred.promise);
        itarService.getEnableItarValue.and.returnValue(enableItarDeferred.promise);

        sut = new ItarController($scope,
                                 $filter,
                                 nlsService,
                                 configService,
                                 modalService,
                                 shipmentService,
                                 itarService);

        criticalPrice = 2500;
        info = {
            data: {
                value: 'https://aesdirect.census.gov/l/login/login.asp?URL=/aes'
            }
        };
        translatedMessageWithCriticalValue =
            'Most shipments under $2500 are filed under Federal Trade Regulations (FTR)';
        const replaceSpy = jasmine.createSpy().and.returnValue(translatedMessageWithCriticalValue);
        nlsService.getTranslationSync.and.returnValue({
            replace: replaceSpy
        });
    }));

    describe('#init', () => {
        beforeEach(() => {
            shipmentService.getDestinationCountry.and.returnValue('US');
        });

        it('should call getItarDetails in itarService to get itar details', () => {
            sut.init();
            expect(itarService.getItarDetails).toHaveBeenCalledWith('US');
        });

        it('should get destinationCountry to pass to service', () => {
            sut.init();
            expect(shipmentService.getDestinationCountry).toHaveBeenCalled();
        });

        describe('getItarDetails', () => {
            beforeEach(() => {
                messageCode = 'shipment.shipment_type_itar_not_department_of_state_description';
            });


            it('should translate description', () => {
                sut.init();
                enableItarDeferred.resolve(true);
                deferred.resolve(itarDetails);
                criticalValueDeferred.resolve(criticalPrice);
                configDeferred.resolve(info);
                $timeout.flush();

                expect(nlsService.getTranslationSync).toHaveBeenCalledWith(messageCode);
                expect(sut.notDepartmentOfStateDescription).toEqual(translatedMessageWithCriticalValue);
                expect(sut.ftrExemptionList).toEqual(itarDetails.ftrExemptionList);
            });

            it('should retrieve itn link', () => {
                sut.init();
                enableItarDeferred.resolve(true);
                deferred.resolve(itarDetails);
                criticalValueDeferred.resolve(criticalPrice);
                configDeferred.resolve(info);
                $timeout.flush();

                expect(sut.itnLink).toEqual(info.data.value);
            });

            it('should retrieve ftr exemption list', () => {
                sut.init();
                enableItarDeferred.resolve(true);
                deferred.resolve(itarDetails);
                criticalValueDeferred.resolve(criticalPrice);
                configDeferred.resolve(info);
                $timeout.flush();

                expect(sut.ftrExemptionList).toEqual(itarDetails.ftrExemptionList);
            });

            it('should retrieve Employee Identification Number if it available', () => {
                sut.init();
                enableItarDeferred.resolve(true);
                deferred.resolve(itarDetails);
                criticalValueDeferred.resolve(criticalPrice);
                configDeferred.resolve(info);
                $timeout.flush();

                expect(sut.employeeIdAvailable).toEqual(itarDetails.employeeIdentificationNumberAvailable);
            });

            it('should set error message if getItarDetails request rejected', () => {
                const errorCode = 'error.service_unavailable';
                const errorMessage = 'Service temporary unavailable';
                nlsService.getTranslationSync.and.returnValue(errorMessage);

                sut.init();

                deferred.reject(errorCode);
                $timeout.flush();

                expect(sut.error).toEqual(errorMessage);
            });
        });
    });

    describe('#showItar', () => {
        it('should return true if Itar should be shown', () => {
            sut.init();
            enableItarDeferred.resolve(true);
            deferred.resolve(itarDetails);
            criticalValueDeferred.resolve(criticalPrice);
            configDeferred.resolve(info);
            $timeout.flush();

            expect(sut.showItar()).toEqual(true);
        });

        it('should return false if Itar should be shown', () => {
            sut.init();
            enableItarDeferred.resolve(false);
            deferred.resolve(itarDetails);
            criticalValueDeferred.resolve(criticalPrice);
            configDeferred.resolve(info);
            $timeout.flush();

            expect(sut.showItar()).toEqual(false);
        });
    });

    describe('#getItar', () => {
        beforeEach(() => {
            sut.isDepartmentOfState = false;
            sut.federalTradeRegulations = false;
        });

        it('should return itar with setted fields values if department of state was chosen', () => {
            const itnNumberCapital = 'X12345678912345';
            sut.itnNumber = 'x12345678912345';
            sut.stateDepartmentFields = {
                exportLicenseNumber: 'sdf2fsd232',
                ultimateConsignee: '23f32f23'
            };
            sut.isDepartmentOfState = true;

            const itar = sut.getItar();

            expect(itar).toEqual(jasmine.objectContaining({
                departmentOfState: true,
                itn: itnNumberCapital,
                exportLicenseNumber: sut.stateDepartmentFields.exportLicenseNumber,
                ultimateConsignee: sut.stateDepartmentFields.ultimateConsignee
            }));
        });

        it('should return itar with federal Trade Regulations flag if this option was chosen', () => {
            sut.isDepartmentOfState = false;
            sut.federalTradeRegulations = true;

            const itar = sut.getItar();

            expect(itar).toEqual(jasmine.objectContaining({
                departmentOfState: false,
                federalTradeRegulations: true
            }));
        });

        it('should make first letter capital in itn field if department of state was chosen', () => {
            sut.itnNumber = 'x12345678912345';
            const itnNumberCapital = 'X12345678912345';
            sut.stateDepartmentFields = {
                exportLicenseNumber: 'sdf2fsd232',
                ultimateConsignee: '23f32f23'
            };
            sut.isDepartmentOfState = true;

            const itar = sut.getItar();

            expect(itar.itn).toEqual(itnNumberCapital);
        });

        it('should get itar for FTR option', () => {
            sut.shipmentExportType = sut.shipmentExportTypes.FTR;
            sut.ftrExemptions = {code: '3032(b)'};

            expect(sut.getItar()).toEqual(jasmine.objectContaining({
                departmentOfState: false,
                federalTradeRegulations: false,
                exportFilingOption: sut.shipmentExportTypes.FTR,
                ftrExemptions: sut.ftrExemptions.code
            }));
        });

        it('should get itar for ITN option', () => {
            sut.shipmentExportType = sut.shipmentExportTypes.ITN;
            sut.itnNumber = 'x12345678912345';

            expect(sut.getItar()).toEqual(jasmine.objectContaining({
                departmentOfState: false,
                federalTradeRegulations: false,
                exportFilingOption: sut.shipmentExportTypes.ITN,
                itn: `X${sut.itnNumber.slice(1)}`
            }));
        });

        it('should get itar for EIN option', () => {
            sut.shipmentExportType = sut.shipmentExportTypes.EIN;
            sut.aespostTermsAccepted = true;
            sut.einNumber = '12345';

            expect(sut.getItar()).toEqual(jasmine.objectContaining({
                departmentOfState: false,
                federalTradeRegulations: false,
                exportFilingOption: sut.shipmentExportTypes.EIN,
                employerIdentificationNumber: sut.einNumber,
                aespostTermsAccepted: sut.aespostTermsAccepted
            }));
        });

        it('should get itar for EEI option', () => {
            sut.shipmentExportType = sut.shipmentExportTypes.EEI;
            sut.itarEeiCtrl = {
                isRelated: true
            };
            sut.itarEeiCtrl = {
                ein: '12345'
            };
            sut.itarEeiCtrl = {
                commodityList: [{
                    description: 'description',
                    licenseType: 'licenseType',
                    licenseNumber: 'licenseType',
                    ECCN: 'licenseType',
                    quantity: 1,
                    quantityUnit: 'gram',
                    exportCode: {value: 'code'},
                    origin: 'origin',
                    totalWeight: 1,
                    totalValue: 1
                }]
            };
            const resultCommodityList = [{
                description: 'description',
                licenseType: 'licenseType',
                licenseNumber: 'licenseType',
                eccn: 'licenseType',
                quantity: 1,
                units: 'gram',
                exportCode: 'code',
                commodityOrigin: 'origin',
                totalWeight: 1,
                totalValue: 1
            }];

            expect(sut.getItar()).toEqual(jasmine.objectContaining({
                departmentOfState: false,
                federalTradeRegulations: false,
                exportFilingOption: sut.shipmentExportTypes.EEI,
                employerIdentificationNumber: sut.itarEeiCtrl.ein,
                electronicExportInformation: {
                    items: resultCommodityList,
                    senderAndReceiverRelated: sut.itarEeiCtrl.isRelated
                }
            }));
        });
    });

    describe('#isNotFederalRegulations', () => {
        beforeEach(() => {
            sut.isDepartmentOfState = false;
        });
        it('should return true if it was chosen not federal regulation option', () => {
            sut.federalTradeRegulations = false;

            const result = sut.isNotFederalRegulations();

            expect(result).toEqual(true);
        });

        it('should return false if it was chosen federal regulation option', () => {
            sut.federalTradeRegulations = true;

            const result = sut.isNotFederalRegulations();

            expect(result).toEqual(false);
        });
    });

    describe('#openFtrCodesPopup', () => {
        it('should open ftr codes lookup popup with correct params', () => {
            sut.openFtrCodesPopup();
            expect(modalService.showDialog).toHaveBeenCalledWith(jasmine.objectContaining({
                closeOnEsc: true,
                scope: $scope,
                windowClass: 'ngdialog-theme-default ewf-modal_width_large',
                template: jasmine.any(String)
            }));
        });
    });

    describe('patterns', () => {
        let regexp;

        describe('ITN', () => {
            beforeEach(() => {
                regexp = new RegExp(sut.PATTERNS.ITN);
            });

            it('should PASS', () => {
                expect(regexp.test('')).toEqual(true);
                expect(regexp.test('X12345678912345')).toEqual(true);
                expect(regexp.test('x12345678912345')).toEqual(true);
            });

            it('should FAIL', () => {
                expect(regexp.test('12345678912345')).toEqual(false);
                expect(regexp.test('abc X12345678912345')).toEqual(false);
                expect(regexp.test('X12345678912345X12345678912345')).toEqual(false);
            });
        });

        describe('exportLicenseNumber', () => {
            beforeEach(() => {
                regexp = new RegExp(sut.PATTERNS.exportLicenseNumber);
            });

            it('should PASS', () => {
                expect(regexp.test('')).toEqual(true);
                expect(regexp.test('abc12345678901234567890')).toEqual(true);
                expect(regexp.test('A1a1B1b2C3c3D4d4E5e5F6f')).toEqual(true);
                expect(regexp.test('abc')).toEqual(true);
                expect(regexp.test('123')).toEqual(true);
            });

            it('should FAIL', () => {
                expect(regexp.test('long string more 23 symbols abc123')).toEqual(false);
            });
        });

        describe('ultimateConsignee', () => {
            beforeEach(() => {
                regexp = new RegExp(sut.PATTERNS.ultimateConsignee);
            });

            it('should PASS', () => {
                expect(regexp.test('')).toEqual(true);
                expect(regexp.test('abcde123456789012345678901234567890')).toEqual(true);
                expect(regexp.test('A1a1B1b2C3c3D4d4E5e5F6f')).toEqual(true);
                expect(regexp.test('abc')).toEqual(true);
                expect(regexp.test('123')).toEqual(true);
            });

            it('should FAIL', () => {
                expect(regexp.test('string longer 35 symbols abcde123456789012345678901234567890')).toEqual(false);
            });
        });

        describe('EIN', () => {
            beforeEach(() => {
                regexp = new RegExp(sut.PATTERNS.EIN);
            });

            it('should PASS', () => {
                expect(regexp.test('')).toEqual(true);
                expect(regexp.test('123456789AB')).toEqual(true);
                expect(regexp.test('123456789ab')).toEqual(true);
                expect(regexp.test('12345678912')).toEqual(true);
            });

            it('should FAIL', () => {
                expect(regexp.test('123456789AB12')).toEqual(false);
                expect(regexp.test('123456789AB123456789AB')).toEqual(false);
                expect(regexp.test('12AB')).toEqual(false);
            });
        });
    });
});
