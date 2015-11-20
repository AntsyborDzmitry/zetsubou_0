import EwfPickup from './ewf-pickup-directive';
import EwfShipmentController from '../ewf-shipment-controller';
import 'angularMocks';

describe('EwfPickup', () => {
    let sut;
    let $scope;
    let elem;
    let attrs;
    let controllers;
    let shipmentCtrl;
    let pickupCtrl;

    beforeEach(inject((_$rootScope_) => {
        $scope = _$rootScope_.$new();
        attrs = {};

        shipmentCtrl = jasmine.mockComponent(new EwfShipmentController());
        pickupCtrl = jasmine.createSpyObj('PickupsController', ['setPickupWindowDisplayCallback']);
        controllers = [shipmentCtrl, pickupCtrl];
        elem = jasmine.createSpyObj('element', ['find', 'click', 'text', 'attr', 'ionRangeSlider']);
        elem.find.and.returnValue(elem);
        elem.text.and.returnValue('some element text');

        sut = new EwfPickup();
    }));

    describe('#postLink', () => {
        const rangeSliderOptions = {name: 'some options for rangeSlider'};

        beforeEach(() => {
            pickupCtrl.setPickupWindowDisplayCallback = function(callback) {
                callback(rangeSliderOptions);
            };
        });

        it('should add step to shipment controller', () => {
            sut.link.post($scope, elem, attrs, controllers);
            expect(shipmentCtrl.addStep).toHaveBeenCalledWith(pickupCtrl);
        });

        it('should call controller to post-load settings for pickup window slider', () => {
            spyOn(pickupCtrl, 'setPickupWindowDisplayCallback');
            sut.link.post($scope, elem, attrs, controllers);
            expect(pickupCtrl.setPickupWindowDisplayCallback).toHaveBeenCalled();
        });

        it('should init ionRangeSlider when callback function is called', () => {
            sut.link.post($scope, elem, attrs, controllers);
            expect(elem.find).toHaveBeenCalledWith('#range-slider');
            expect(elem.ionRangeSlider).toHaveBeenCalledWith(rangeSliderOptions);
        });

        it('should add attrs to ".irs-from" and ".irs-to" when callback function is called', () => {
            sut.link.post($scope, elem, attrs, controllers);
            expect(elem.find).toHaveBeenCalledWith('.irs-from');
            expect(elem.find).toHaveBeenCalledWith('.irs-to');
            expect(elem.attr).toHaveBeenCalledWith('data-content', jasmine.any(String));
        });
    });
});
