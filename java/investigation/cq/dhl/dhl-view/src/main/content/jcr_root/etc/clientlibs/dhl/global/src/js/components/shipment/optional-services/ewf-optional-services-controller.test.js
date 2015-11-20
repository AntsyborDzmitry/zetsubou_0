import EwfOptionalServicesController from './ewf-optional-services-controller';
import EwfShipmentStepBaseController from './../ewf-shipment-step-base-controller';
import ShipmentService from './../ewf-shipment-service';
import 'angularMocks';

describe('EwfOptionalServicesController', () => {
    let sut;
    let shipmentService;

    beforeEach(inject(() => {
        shipmentService = jasmine.mockComponent(new ShipmentService());

        sut = new EwfOptionalServicesController(shipmentService);
    }));

    describe('#constructor', () => {
        it('should be instance of EwfShipmentStepBaseController', () => {
            expect(sut instanceof EwfShipmentStepBaseController).toBe(true);
        });

        it('should set name property', () => {
            expect(sut.name).toBe('optional-services');
        });
    });

    describe('#onInit', () => {
        it('should set shipment of model from shipment service', () => {
            const shipment = {};
            shipmentService.getShipmentData.and.returnValue(shipment);
            sut.onInit();

            expect(shipmentService.getShipmentData).toHaveBeenCalledWith();
            expect(sut.shipment).toBe(shipment);
        });
    });

    describe('#hasCustomsInvoice', () => {
        it('should return true if this is shipment of packages', () => {
            shipmentService.isPackage.and.returnValue(true);

            expect(sut.hasCustomsInvoice()).toBe(true);
        });

        it('should return true if this is not shipment of packages', () => {
            shipmentService.isPackage.and.returnValue(false);

            expect(sut.hasCustomsInvoice()).toBe(false);
        });
    });

    describe('#isCustomsInvoiceOwn', () => {
        it('should return false if user does not use customs invoice', () => {
            spyOn(sut, 'hasCustomsInvoice').and.returnValue(false);

            expect(sut.isCustomsInvoiceOwn()).toBe(false);
        });

        it('should return false if customs invoice defined', () => {
            const customsInvoice = {};
            shipmentService.getCustomsInvoice.and.returnValue(customsInvoice);
            spyOn(sut, 'hasCustomsInvoice').and.returnValue(true);

            expect(sut.isCustomsInvoiceOwn()).toBe(false);
        });

        it('should return true if user uses own customs invoice', () => {
            shipmentService.getCustomsInvoice.and.returnValue();
            spyOn(sut, 'hasCustomsInvoice').and.returnValue(true);

            expect(sut.isCustomsInvoiceOwn()).toBe(true);
        });
    });

    describe('#getCountryCode', () => {
        it('should return country code of from contact', () => {
            const countryCode = 'UA';
            shipmentService.getShipmentCountry.and.returnValue(countryCode);

            expect(sut.getCountryCode()).toBe(countryCode);
        });
    });
});
