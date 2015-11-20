import DeliveryOptionsController from './delivery-options-controller';
import deliveryOption from './delivery-options-directive';
import 'angularMocks';

describe('deliveryOption', () => {

    let $scope;
    let elem;
    let attrs;
    let deliveryOptionsCtrl;
    let sut;

    function postLinkInit() {
        sut.link.post($scope, elem, attrs, deliveryOptionsCtrl);
    }

    beforeEach(inject((_$rootScope_) => {
        $scope = _$rootScope_.$new();
        elem = {};
        attrs = {};
        deliveryOptionsCtrl = jasmine.mockComponent(new DeliveryOptionsController());
        sut = new deliveryOption();
    }));

    describe('postLink function', () => {
        beforeEach(() => {
            postLinkInit();
        });

        it('should call to init function of controller', () => {
            expect(deliveryOptionsCtrl.init).toHaveBeenCalled();
        });
    });
});
