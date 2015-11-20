define(['exports', 'module'], function (exports, module) {
    'use strict';

    module.exports = PaymentProductsCtrl;
    PaymentProductsCtrl.$inject = ['$timeout'];

    function PaymentProductsCtrl($timeout) {
        var vm = this;

        Object.assign(vm, {
            init: init,
            onProductUpdate: onProductUpdate,
            onRawProductUpdate: onRawProductUpdate,
            onProductsUpdate: onProductsUpdate,
            onProductSelect: onProductSelect,
            showProducts: showProducts,
            hideProducts: hideProducts,

            rawProduct: '',
            products: null,
            product: null,
            ngModelCtrl: null
        });

        function init(ngModelCtrl) {
            vm.ngModelCtrl = ngModelCtrl;

            vm.ngModelCtrl.$render = onProductUpdate;
        }

        function onProductUpdate() {
            vm.product = vm.ngModelCtrl.$modelValue;
        }

        function onProductsUpdate(products) {
            vm.products = products;
        }

        function onProductSelect(product) {
            if (!product || !vm.ngModelCtrl) {
                return;
            }

            vm.product = product;
            vm.ngModelCtrl.$setViewValue(product);

            vm.rawProduct = product.label;

            hide();
        }

        function onRawProductUpdate() {
            vm.rawProduct = vm.product ? vm.product.label : '';
        }

        function showProducts() {
            vm.productsShown = true;
        }

        function hideProducts() {
            $timeout(hide, 100);
        }

        function hide() {
            vm.productsShown = false;
        }
    }
});
//# sourceMappingURL=payment-products-controller.js.map
