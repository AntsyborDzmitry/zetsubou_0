import EwfShipmentType from './ewf-shipment-type-directive';
import EwfShipmentTypeController from './ewf-shipment-type-controller';
import EwfShipmentController from '../ewf-shipment-controller';
import EwfContainerController from './../../../directives/ewf-container/ewf-container-directive';
import 'angularMocks';

describe('EwfShipmentType', () => {
    let sut;
    let $scope, elem, attrs, controllers;
    let [shipmentCtrl, shipmentTypeCtrl] = [{}, {}];

    function callPreLink() {
        sut.link.pre($scope, elem, attrs, controllers);
    }

    beforeEach(inject((_$rootScope_) => {
        $scope = _$rootScope_.$new();
        elem = {};
        attrs = {};
        controllers = [new EwfShipmentController(), new EwfShipmentTypeController(), new EwfContainerController()];
        [shipmentCtrl, shipmentTypeCtrl] = controllers;
        spyOn(shipmentCtrl, 'addStep');

        sut = new EwfShipmentType();
    }));

    describe('#preLink', () => {
        it('should add step to shipment controller', () => {
            callPreLink();

            expect(shipmentCtrl.addStep).toHaveBeenCalledWith(shipmentTypeCtrl);
        });
    });
});
