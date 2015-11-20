import EnhancedInvoiceController from './enhanced-invoice-controller';
import EnhancedInvoiceService from './enhanced-invoice-service';
import ModalService from './../../../services/modal/modal-service';
import ShipmentService from './../ewf-shipment-service';
import EnhancedInvoiceModel from './enhanced-invoice-model';
import LocationService from './../../../services/location-service';
import EwfFileUploaderController from './../../../directives/ewf-file-uploader/ewf-file-uploader-controller';
import EwfFileUploaderService from './../../../directives/ewf-file-uploader/ewf-file-uploader-service';
import AttrsService from './../../../services/attrs-service';
import systemSettings from './../../../constants/system-settings-constants';

describe('EnhancedInvoiceController', () => {
    let sut;
    let enhancedInvoiceService, modalService, shipmentService, enhancedInvoiceModel, locationService;
    let involvedPartiesData, locationList;
    let $q, $timeout, $filter, $scope;
    let deferred;
    let fileUploaderCtrl, attrsService, ewfFileUploaderService;

    beforeEach(module('ewf'));
    beforeEach(inject((_$rootScope_, _$q_, _$timeout_, _$filter_) => {
        $q = _$q_;
        $timeout = _$timeout_;
        $filter = _$filter_;
        involvedPartiesData = {
            exportIdType: 'NONE',
            shipper: {
                name: 'fromName',
                company: 'fromCompany',
                address: 'fromAddress',
                country: 'fromCountry',
                email: 'fromEmail',
                vat: 'fromVatTax'
            },
            receiver: {
                name: 'toName',
                company: 'toCompany',
                address: 'toAddress',
                country: 'toCountry',
                email: 'toEmail',
                vat: 'toVatTax'
            }
        };
        locationList = [{
                code2: 'BR',
                code3: 'BRA',
                name: 'BRAZIL',
                phoneCode: '55'
            }, {
                code2: 'CN',
                code3: 'CHN',
                name: 'CHINA, PEOPLES REPUBLIC',
                phoneCode: '86'
            }];
        deferred = $q.defer();

        const $attrs = {};
        $scope = _$rootScope_.$new();

        attrsService = jasmine.mockComponent(new AttrsService());
        ewfFileUploaderService = jasmine.mockComponent(new EwfFileUploaderService());

        const parameters = [$scope, $attrs, attrsService, ewfFileUploaderService];
        fileUploaderCtrl = jasmine.mockComponent(new EwfFileUploaderController(...parameters));

        enhancedInvoiceService = jasmine.mockComponent(new EnhancedInvoiceService());
        locationService = jasmine.mockComponent(new LocationService());
        locationService.loadAvailableLocations.and.returnValue(deferred.promise);
        modalService = jasmine.mockComponent(new ModalService());
        shipmentService = jasmine.mockComponent(new ShipmentService());
        shipmentService.getInvolvedPartiesAddressDetails.and.returnValue(involvedPartiesData);
        enhancedInvoiceModel = jasmine.mockComponent(new EnhancedInvoiceModel($filter, {}));
        enhancedInvoiceModel.invoice = {involvedPartiesData};
        enhancedInvoiceModel.init.and.returnValue(enhancedInvoiceModel.invoice);

        sut = new EnhancedInvoiceController($timeout,
                                            systemSettings,
                                            shipmentService,
                                            modalService,
                                            locationService,
                                            enhancedInvoiceModel,
                                            enhancedInvoiceService);
    }));

    it('should be defined', () => {
        expect(sut).toBeDefined();
    });

    describe('#init', () => {
        beforeEach(() => {
            sut.init();
            deferred.resolve(locationList);
            $timeout.flush();
        });

        it('should retrieve address details and init model for mapping on involved parties section', () => {
            expect(enhancedInvoiceModel.init).toHaveBeenCalledWith(jasmine.objectContaining({involvedPartiesData}));
        });

        it('should set invoice data to view model', () => {
            expect(sut.invoice).toBe(enhancedInvoiceModel.invoice);
        });

        it('should call location service to get countries', () => {
            expect(locationService.loadAvailableLocations).toHaveBeenCalled();
        });

        it('should set countries from service', () => {
            expect(enhancedInvoiceModel.setInvoiceData).toHaveBeenCalledWith({countriesList: locationList});
        });

        it('should cache enhanced invoice model for the future cleaning', () => {
            expect(enhancedInvoiceModel.cacheModel).toHaveBeenCalled();
        });
    });

    describe('#showSavedCustomsTemplatesPopup', () => {
        it('should call modal service to show popup', () => {
            sut.showSavedCustomsTemplatesPopup();
            expect(modalService.showDialog).toHaveBeenCalled();
        });
    });

    describe('#logoUploaded', () => {
        const uploadedLogo = {name: 'logo.jpg', src: 'images/logo.jpg'};

        beforeEach(() => {
            sut.invoice = {logoParameters: null};
            sut.logoUploadErrors = ['errors.uploaded_file_has_wrong_dimensions'];
            sut.logoUploaded(uploadedLogo);
        });

        it('should clear upload logo errors', () => {
            expect(sut.logoUploadErrors).toEqual([]);
        });

        it('should point uploaded logo to setting', () => {
            expect(sut.invoice.logoParameters).toEqual(uploadedLogo);
        });
    });

    describe('#logoUploadError', () => {
        const errors = ['errors.uploaded_file_has_wrong_dimensions'];

        beforeEach(() => {
            sut.logoUploadErrors = [];
            sut.logoUploadError(errors);
        });

        it('should display server error according to type', () => {
            expect(sut.logoUploadErrors).toEqual(errors);
        });

        it('should hide server error after timeout', () => {
            $timeout.flush();
            expect(sut.logoUploadErrors).toEqual([]);
        });

        it('should display generic error if server did not return any errors', () => {
            sut.logoUploadError([]);
            expect(sut.logoUploadErrors).toEqual(['errors.uploaded_file_failed']);
        });
    });

    describe('#removeLogoImage', () => {
        it('should remove image object from setting', () => {
            const key = 'some-image-db-key';
            sut.invoice = {logoParameters: {key}};
            sut.removeLogoImage();

            expect(sut.invoice.logoParameters).toBe(null);
        });
    });

    describe('#isAttachLogoButtonVisible', () => {
        beforeEach(() => {
            sut.invoice = {};
        });

        it('should test file-uploader-controller method to check filelist visibility', () => {
            sut.isAttachLogoButtonVisible(fileUploaderCtrl);
            expect(fileUploaderCtrl.canShowFileList).toHaveBeenCalled();
        });

        it('should be falsy if filelist is visible', () => {
            fileUploaderCtrl.canShowFileList.and.returnValue(true);
            expect(sut.isAttachLogoButtonVisible(fileUploaderCtrl)).toEqual(false);
        });

        it('should be truthy if filelist is not visible and there is no logo', () => {
            fileUploaderCtrl.canShowFileList.and.returnValue(false);
            expect(sut.isAttachLogoButtonVisible(fileUploaderCtrl)).toEqual(true);
        });

        it('should be falsy if there is logo, but filelist is visible', () => {
            fileUploaderCtrl.canShowFileList.and.returnValue(true);
            sut.invoice.logoParameters = {src: 'test'};

            expect(sut.isAttachLogoButtonVisible(fileUploaderCtrl)).toEqual(false);
        });

        it('should be falsy if filelist is not visible but there is logo', () => {
            fileUploaderCtrl.canShowFileList.and.returnValue(false);
            sut.invoice.logoParameters = {src: 'test'};

            expect(sut.isAttachLogoButtonVisible(fileUploaderCtrl)).toEqual(false);
        });
    });

    describe('#isAttachNewLogoButtonVisible', () => {
        beforeEach(() => {
            sut.invoice = {};
        });

        it('should be truthy if files was uploaded', () => {
            fileUploaderCtrl.filesUploaded = true;
            expect(sut.isAttachNewLogoButtonVisible(fileUploaderCtrl)).toEqual(true);
        });

        it('should be truthy if there is logo available', () => {
            sut.invoice.logoParameters = {src: 'test'};
            expect(sut.isAttachNewLogoButtonVisible(fileUploaderCtrl)).toEqual(true);
        });

        it('should be falsy if files was not uploaded and there is no logo available', () => {
            expect(sut.isAttachNewLogoButtonVisible(fileUploaderCtrl)).toEqual(false);
        });
    });

    describe('#clearInvoice', () => {
        beforeEach(() => {
            sut.invoice = enhancedInvoiceModel;
        });

        it('should reset model to the cached state', () => {
            sut.clearInvoice();
            expect(sut.invoice.resetModel).toHaveBeenCalled();
        });

        it('should clean logo errors parameters', () => {
            const expectedParameters = {
                logoUploadErrors: []
            };
            sut.logoUploadErrors = ['logo error'];
            sut.clearInvoice();

            expect(sut).toEqual(jasmine.objectContaining(expectedParameters));
        });

        it('should also clean logo parameters from model', () => {
            const expectedParameters = {
                logoParameters: null
            };
            sut.invoice.logoParameters = {src: 'test'};
            sut.clearInvoice();

            expect(enhancedInvoiceModel).toEqual(jasmine.objectContaining(expectedParameters));
        });
    });
});
