import 'angularMocks';
import PaymentProductsCtrl from './payment-products-controller';

describe('PaymentProductsCtrl', () => {
    let sut;
    let ngModelCtrl;
    let $timeout;

    beforeEach(inject((_$timeout_) => {
        $timeout = _$timeout_;

        ngModelCtrl = jasmine.createSpyObj('ngModel', ['$setViewValue', '$render']);

        sut = new PaymentProductsCtrl($timeout);
    }));

    describe('#init', () => {
        it('writes reference to ngModel controller', () => {
            sut.init(ngModelCtrl);

            expect(sut.ngModelCtrl).toBe(ngModelCtrl);
        });

        it('rewrites ngModelCtrl $render', () => {
            ngModelCtrl.$render = null;
            sut.init(ngModelCtrl);

            expect(ngModelCtrl.$render).toBeDefined();
        });
    });

    describe('#onProductUpdate', () => {
        beforeEach(() => {
            sut.init(ngModelCtrl);
        });

        it('updates product from ngModelCtrl', () => {
            const newProduct = {id: 'visa', label: 'Visa'};
            ngModelCtrl.$modelValue = newProduct;

            sut.onProductUpdate();

            expect(sut.product).toBe(newProduct);
        });
    });

    describe('#onProductsUpdate', () => {
        it('writes products to view model', () => {
            expect(sut.products).toBe(null);

            const products = [{id: 'visa', label: 'Visa'}];
            sut.onProductsUpdate(products);

            expect(sut.products).toBe(products);
        });
    });

    describe('#onProductSelect', () => {
        beforeEach(() => {
            sut.init(ngModelCtrl);
        });

        it('rewrites new product', () => {
            const product = {id: 'visa', label: 'Visa'};
            sut.onProductSelect(product);

            expect(sut.product).toBe(product);
        });

        it('stores new product as ngModelCtrl $viewValue', () => {
            const product = {id: 'visa', label: 'Visa'};
            sut.onProductSelect(product);

            expect(ngModelCtrl.$setViewValue).toHaveBeenCalledWith(product);
        });

        it('won\'t do anything if product or ngModelCtrl is undefined', () => {
            const prevProduct = {id: 'visa', label: 'Visa'};
            sut.product = prevProduct;
            sut.ngModelCtrl = null;
            sut.onProductSelect(null);

            expect(ngModelCtrl.$setViewValue).not.toHaveBeenCalled();
            expect(sut.product).toBe(prevProduct);
        });

        it('hides products', () => {
            const product = {id: 'visa', label: 'Visa'};

            sut.productsShown = true;
            sut.onProductSelect(product);

            expect(sut.productsShown).toBe(false);
        });

        it('sets rawProduct as product\'s label', () => {
            const label = 'Visa';
            const product = {id: 'visa', label};
            sut.onProductSelect(product);

            expect(sut.rawProduct).toBe(label);
        });
    });

    describe('#showProducts', () => {
        it('sets productsShown to true', () => {
            sut.productsShown = false;
            sut.showProducts();

            expect(sut.productsShown).toBe(true);
        });
    });

    describe('#hideProducts', () => {
        it('sets productsShown to false, with timeout', () => {
            sut.productsShown = true;

            sut.hideProducts();
            $timeout.flush();

            expect(sut.productsShown).toBe(false);
        });
    });

    describe('#onRawProductUpdate', () => {
        it('sets rawProduct to product\'s label or empty string', () => {
            const label = 'Visa';
            const product = {id: 'visa', label};
            sut.product = product;

            sut.onRawProductUpdate();

            expect(sut.rawProduct).toBe(label);
        });

        it('sets rawProduct to empty string if product is not defined', () => {
            sut.product = null;

            sut.onRawProductUpdate();

            expect(sut.rawProduct).toBe('');
        });
    });
});
