import 'angularMocks';
import MyProductFormDirective from './my-product-form-directive';
import MyProductFormController from './my-product-form-controller';

describe('MyProductFormDirective', () => {
    let sut;
    let myProductFormCtrlMock;

    beforeEach(() => {
        myProductFormCtrlMock = jasmine.mockComponent(new MyProductFormController());
        sut = MyProductFormDirective();
    });

    it('should have correct DDO', () => {
        expect(sut).toEqual({
            restrict: 'AE',
            controller: jasmine.any(Function),
            controllerAs: 'myProductFormCtrl',
            link: jasmine.any(Function)
        });
    });

    describe('linking function', () => {
        it('should init controller', () => {
            sut.link({}, {}, {}, myProductFormCtrlMock);
            expect(myProductFormCtrlMock.init).toHaveBeenCalled();
        });
    });
});
