import ewfItarEei from './ewf-itar-eei-directive';
import ItarEeiController from './ewf-itar-eei-controller';
import EwfContainerController from './../../../../../directives/ewf-container/ewf-container-controller';
import ItemAttributesController from './../../item-attributes/item-attributes-controller';
import 'angularMocks';

describe('ewfItarEei', () => {
    let sut;
    let itarEeiCtrl, ewfContainerCtrl, itemAttrCtrl;
    let $scope, elem, attrs;

    beforeEach(inject((_$rootScope_) => {
        $scope = _$rootScope_.$new();
        elem = {};
        attrs = {};


        itarEeiCtrl = jasmine.mockComponent(new ItarEeiController());
        ewfContainerCtrl = jasmine.mockComponent(new EwfContainerController());

        itemAttrCtrl = jasmine.mockComponent(new ItemAttributesController());
        ewfContainerCtrl.getRegisteredControllerInstance.and.returnValue(itemAttrCtrl);

        sut = new ewfItarEei();
    }));

    function callPreLink() {
        const controllers = [itarEeiCtrl, ewfContainerCtrl];
        sut.link.pre($scope, elem, attrs, controllers);
    }

    describe('preLink', () => {
        beforeEach(() => {
            itemAttrCtrl.itemAttrFormCtrl = {
                onNextClick: jasmine.createSpy('onNextClick')
            };
            callPreLink();
        });

        it('should init ewf ITAR EEI controller', () => {
            expect(itarEeiCtrl.init).toHaveBeenCalled();
        });

        it('should register controller instance by ewf-container', () => {
            expect(ewfContainerCtrl.registerControllerInstance).toHaveBeenCalled();
        });

        it('should call on next click method from item-attributes-form to update customs invoice', () => {
            expect(itemAttrCtrl.itemAttrFormCtrl.onNextClick).toHaveBeenCalled();
        });

        it('should call on next click method from item-attributes to update shipping purpose', () => {
            expect(itemAttrCtrl.onNextClick).toHaveBeenCalled();
        });

        it('should not try to use itemAttrCtrl if it is not defined to ewfContainerCtrl', () => {
            ewfContainerCtrl.getRegisteredControllerInstance.and.returnValue(undefined);
            itemAttrCtrl.onNextClick.calls.reset();
            callPreLink();

            expect(itemAttrCtrl.onNextClick).not.toHaveBeenCalled();
        });
    });
});
