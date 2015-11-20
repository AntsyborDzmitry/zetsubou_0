import 'angularMocks';
import PaymentProducts from './payment-products-directive';
import PaymentProductsCtrl from './payment-products-controller';

describe('paymentProducts', () => {
    let sut;
    let scope;
    let element;
    let attrs;
    let controllers;
    let paymentProductsCtrl;
    let ngModelCtrl;

    function callPostLink() {
        sut.link.post(scope, element, attrs, controllers);
    }

    beforeEach(inject(($rootScope) => {
        scope = $rootScope.$new();
        element = {};
        attrs = {};
        paymentProductsCtrl = jasmine.mockComponent(new PaymentProductsCtrl());
        ngModelCtrl = {};
        controllers = [paymentProductsCtrl, ngModelCtrl];

        sut = new PaymentProducts();
    }));

    describe('postLink', () => {
        it('calls controller\'s init method passing ngModelCtrl', () => {
            callPostLink();

            expect(paymentProductsCtrl.init).toHaveBeenCalledWith(ngModelCtrl);
        });

        it('calls controller\'s onProductsUpdate passing products when products have been updated', () => {
            const products = [
                {id: 'visa', label: 'Visa'},
                {id: 'maestro', label: 'Maestro'}
            ];

            callPostLink();

            scope.products = products;
            scope.$apply();
            expect(paymentProductsCtrl.onProductsUpdate).toHaveBeenCalledWith(products);

            products.push({id: 'amex', label: 'American Express'});
            scope.$apply();
            expect(paymentProductsCtrl.onProductsUpdate).toHaveBeenCalledWith(products);
        });

        it('won\'t call controller\'s onProductsUpdate if products is not an array', () => {
            const products = {
                visa: {
                    id: 'visa',
                    label: 'Visa'
                }
            };

            callPostLink();

            scope.products = products;
            scope.$apply();
            expect(paymentProductsCtrl.onProductsUpdate).not.toHaveBeenCalled();
        });
    });
});
