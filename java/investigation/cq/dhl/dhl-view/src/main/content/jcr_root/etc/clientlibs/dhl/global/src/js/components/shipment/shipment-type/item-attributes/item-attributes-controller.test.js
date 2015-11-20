import ItemAttributesController from './item-attributes-controller';
import ItemAttributesService from './item-attributes-service';
import ShipmentService from './../../ewf-shipment-service';
import NlsService from './../../../../services/nls-service';

describe('ItemAttributesController', () => {
    let sut, purposeDefer;
    let $q, $timeout;
    let itemAttributesService, shipmentService, nlsService;

    const countryCode = 'US';

    beforeEach(module('ewf'));
    beforeEach(inject((_$q_, _$rootScope_, _$timeout_) => {
        $q = _$q_;
        $timeout = _$timeout_;

        purposeDefer = $q.defer();

        itemAttributesService = jasmine.mockComponent(new ItemAttributesService());
        nlsService = jasmine.mockComponent(new NlsService());
        shipmentService = jasmine.mockComponent(new ShipmentService());

        nlsService.getTranslationSync.and.returnValue('text');
        itemAttributesService.getShippingPurposeList.and.returnValue(purposeDefer.promise);

        shipmentService.getShipmentCountry.and.returnValue(countryCode);

        sut = new ItemAttributesController(
            nlsService,
            itemAttributesService,
            shipmentService
        );
    }));

    it('should make estimate duties checkbox be unchecked by default', () => {
        expect(sut.estimateDuties).toEqual(false);
    });

    describe('#init', () => {
        beforeEach(() => {
            sut.init();
        });

        it('should call shipment service to get shipment country', () => {
            expect(shipmentService.getShipmentCountry).toHaveBeenCalledWith();
        });

        it('should get shipping purpose list using item attributes service', () => {
            expect(itemAttributesService.getShippingPurposeList).toHaveBeenCalledWith(countryCode);
        });

        it('should call getShippingPurposeList service method to get the list of purposes', () => {
            const option = {
                reasonForExport: 'Select One',
                defaultPurpose: true
            };
            const purposeResponse = {
                find: jasmine.createSpy().and.returnValue(option),
                forEach: jasmine.createSpy()
            };

            purposeDefer.resolve(purposeResponse);
            $timeout.flush();

            expect(sut.shippingPurpose).toEqual(option);
        });
    });

    describe('#onNextClick', () => {
        it('should set shipping purpose to shipment service', () => {
            const purpose = 'some purpose';
            sut.shippingPurpose = purpose;
            sut.onNextClick();

            expect(shipmentService.setCustomsInvoicePurpose).toHaveBeenCalledWith(purpose);
        });
    });
});
