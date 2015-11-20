import AssigningShipments from './assigning-shipments-directive';
import AssigningShipmentsController from './assigning-shipments-controller';
import 'angularMocks';

describe('assigningShipments', () => {
    let sut;
    let assigningShipmentsControllerMock;

    beforeEach(() => {
        assigningShipmentsControllerMock = jasmine.mockComponent(new AssigningShipmentsController());

        sut = new AssigningShipments();
    });

    describe('preLink function', () => {
        it('should call to init function of controller', () => {
            sut.link.pre({}, {}, {}, assigningShipmentsControllerMock);

            expect(assigningShipmentsControllerMock.init).toHaveBeenCalledWith();
        });
    });
});
