define(['exports', 'module', 'ewf', './payment-products-controller'], function (exports, module, _ewf, _paymentProductsController) {
    'use strict';

    var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

    module.exports = PaymentProducts;

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _ewf2 = _interopRequireDefault(_ewf);

    var _PaymentProductsCtrl = _interopRequireDefault(_paymentProductsController);

    _ewf2['default'].directive('paymentProducts', PaymentProducts);

    function PaymentProducts() {
        return {
            restrict: 'E',
            require: ['paymentProducts', 'ngModel'],
            controller: _PaymentProductsCtrl['default'],
            controllerAs: 'paymentProductsCtrl',
            template: '<div class=\"field card-list\" ng-class=\"{open: paymentProductsCtrl.productsShown}\"><input type=text class=\"input input_width_full\" nls=shipment.credit_card_selector ng-change=paymentProductsCtrl.onRawProductUpdate() ng-focus=paymentProductsCtrl.showProducts() ng-blur=paymentProductsCtrl.hideProducts() ng-model=paymentProductsCtrl.rawProduct><ul class=dropdown-menu><li ng-repeat=\"product in paymentProductsCtrl.products\" ng-click=paymentProductsCtrl.onProductSelect(product)><a class=card-list_item><img class=card-type ng-src={{product.img}}> <span ng-bind=product.label></span></a></li></ul></div>',
            link: { post: post },
            scope: {
                products: '='
            }
        };

        function post(scope, element, attrs, controllers) {
            var _controllers = _slicedToArray(controllers, 2);

            var paymentProductsCtrl = _controllers[0];
            var ngModelCtrl = _controllers[1];

            paymentProductsCtrl.init(ngModelCtrl);

            scope.$watch('products', function (products) {
                if (Array.isArray(products)) {
                    paymentProductsCtrl.onProductsUpdate(products);
                }
            });
        }
    }
});
//# sourceMappingURL=payment-products-directive.js.map
