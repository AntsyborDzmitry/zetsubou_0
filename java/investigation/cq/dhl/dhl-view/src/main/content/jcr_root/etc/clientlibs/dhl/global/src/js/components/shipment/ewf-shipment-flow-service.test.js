import ShipmentFlowService from './ewf-shipment-flow-service';
import 'angularMocks';

describe('shipmentFlowService', () => {
    describe('#constructor', () => {
        it('should have getStepsIncompleteData', () => {
            const sut = new ShipmentFlowService();
            expect(sut.getStepsIncompleteData).toEqual(jasmine.any(Function));
        });
    });
});
