import itemAttributes from './item-attributes-directive';
import ItemAttributesController from './item-attributes-controller';
import EwfContainerController from './../../../../directives/ewf-container/ewf-container-controller';
import 'angularMocks';

describe('itemAttributes', () => {
    let sut;
    let $scope, elem, attrs;
    let itemAttrCtrl, ewfContainerCtrl;

    function callPreLink() {
        const controllers = [itemAttrCtrl, ewfContainerCtrl];
        sut.link.pre($scope, elem, attrs, controllers);
    }

    beforeEach(inject((_$rootScope_) => {
        $scope = _$rootScope_.$new();
        elem = {};
        attrs = {};
        itemAttrCtrl = new ItemAttributesController();
        ewfContainerCtrl = new EwfContainerController();
        spyOn(itemAttrCtrl, 'init');
        spyOn(ewfContainerCtrl, 'registerControllerInstance');
        spyOn(ewfContainerCtrl, 'registerCallback');

        sut = new itemAttributes();
    }));

    it('should require two controllers', () => {
        expect(sut.require.length).toEqual(2);
    });

    describe('#preLink', () => {
        beforeEach(() => {
            callPreLink();
        });

        it('should init the item attributes controller', () => {
            expect(itemAttrCtrl.init).toHaveBeenCalled();
        });

        it('should register controller by ewf container', () => {
            expect(ewfContainerCtrl.registerControllerInstance).toHaveBeenCalledWith('itemAttrCtrl', itemAttrCtrl);
        });

        it('should register callback for ewf-grid controller', () => {
            expect(ewfContainerCtrl.registerCallback).toHaveBeenCalledWith('grid', jasmine.any(Function));
        });
    });
});
