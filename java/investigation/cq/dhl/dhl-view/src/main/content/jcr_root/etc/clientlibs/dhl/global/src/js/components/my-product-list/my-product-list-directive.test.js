import MyProductList from './my-product-list-directive';
import MyProductListController from './my-product-list-controller';
import EwfContainerController from './../../directives/ewf-container/ewf-container-controller';

import 'angularMocks';

describe('MyProductList', () => {
    let sut;
    let $scope, elem, attrs;
    let myProductListCtrl;
    let ewfContainerCtrl;
    const gridCtrl = {};

    beforeEach(inject((_$rootScope_) => {
        $scope = _$rootScope_.$new();
        elem = {};
        attrs = {};

        myProductListCtrl = jasmine.mockComponent(new MyProductListController());
        ewfContainerCtrl = jasmine.mockComponent(new EwfContainerController());
        ewfContainerCtrl.getRegisteredControllerInstance.and.returnValue(gridCtrl);

        sut = new MyProductList();
    }));

    function postLinkInit() {
        sut.link.post($scope, elem, attrs, [myProductListCtrl, ewfContainerCtrl]);
    }
    describe('#postLink', () => {
        beforeEach(() => {
            postLinkInit();
        });

        it('should call to init function of controller', () => {
            expect(myProductListCtrl.init).toHaveBeenCalled();
        });

        it('should controller bind to gridController', () => {
            expect(ewfContainerCtrl.getRegisteredControllerInstance).toHaveBeenCalledWith('grid');
            expect(gridCtrl.ctrlToNotify).toEqual(myProductListCtrl);
        });
    });
});
