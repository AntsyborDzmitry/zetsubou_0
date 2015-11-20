import ShipmentStatusController from './shipment-status-controller';
import ShipmentService from './../ewf-shipment-service';
import NavigationService from './../../../services/navigation-service';

describe('ShipmentStatusController', () => {
    let shipmentService;
    let navigationService;
    let $timeout;
    let $q;

    beforeEach(inject((_$timeout_, _$q_) => {
        $timeout = _$timeout_;
        $q = _$q_;

        shipmentService = jasmine.mockComponent(new ShipmentService());
        shipmentService.completeShipmentPayment.and.returnValue($q.defer().promise);
    }));

    describe('#constructor', () => {
        const shipmentId = '123';
        const checkoutId = '234';

        beforeEach(() => {
            navigationService = jasmine.mockComponent(new NavigationService());
            navigationService.getParamFromUrl.and.returnValues(shipmentId, checkoutId);
        });

        function createInstance() {
            return new ShipmentStatusController(navigationService, shipmentService);
        }

        it('caches shipmentId and checkoutId in view model', () => {
            const sut = createInstance();

            expect(sut.shipmentId).toBe(shipmentId);
            expect(sut.checkoutId).toBe(checkoutId);
        });

        it('calls navigationService to get shipmentId and checkoutId from url', () => {
            const shipmentIdParam = 'shipmentId';
            const checkoutIdParam = 'hostedCheckoutId';

            createInstance();

            expect(navigationService.getParamFromUrl.calls.argsFor(0)).toEqual([shipmentIdParam]);
            expect(navigationService.getParamFromUrl.calls.argsFor(1)).toEqual([checkoutIdParam]);
        });

        it('calls shipmentService passing shipmentId and checkoutId', () => {
            createInstance();

            expect(shipmentService.completeShipmentPayment).toHaveBeenCalledWith(shipmentId, checkoutId);
        });

        it('won\'t call shipmentService if shipmentId or checkoutId is undefined', () => {
            navigationService.getParamFromUrl.and.returnValues(undefined, checkoutId);

            createInstance();

            expect(shipmentService.completeShipmentPayment).not.toHaveBeenCalled();
        });

        it('redirects to print page if payment is successful', () => {
            const success = true;
            const status = {success};
            shipmentService.completeShipmentPayment.and.returnValue($q.when(status));

            createInstance();
            $timeout.flush();

            expect(navigationService.location).toHaveBeenCalledWith(`shipment-print.html?shipmentId=${shipmentId}`);
        });

        it('redirects to shipment page if payment has failed', () => {
            const success = false;
            const status = {success};
            shipmentService.completeShipmentPayment.and.returnValue($q.when(status));

            createInstance();
            $timeout.flush();

            expect(navigationService.location).toHaveBeenCalledWith(`shipment.html?shipmentId=${shipmentId}`);
        });
    });
});
