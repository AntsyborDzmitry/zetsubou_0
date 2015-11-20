import ewf from 'ewf';
import PaymentProductsCtrl from './payment-products-controller';

ewf.directive('paymentProducts', PaymentProducts);

export default function PaymentProducts() {
    return {
        restrict: 'E',
        require: ['paymentProducts', 'ngModel'],
        controller: PaymentProductsCtrl,
        controllerAs: 'paymentProductsCtrl',
        templateUrl: 'payment-products.html',
        link: {post},
        scope: {
            products: '='
        }
    };

    function post(scope, element, attrs, controllers) {
        const [paymentProductsCtrl, ngModelCtrl] = controllers;

        paymentProductsCtrl.init(ngModelCtrl);

        scope.$watch('products', (products) => {
            if (Array.isArray(products)) {
                paymentProductsCtrl.onProductsUpdate(products);
            }
        });
    }
}
