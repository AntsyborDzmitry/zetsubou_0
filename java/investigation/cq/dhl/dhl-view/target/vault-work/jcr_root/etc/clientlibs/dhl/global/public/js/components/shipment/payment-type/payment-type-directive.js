define(['exports', 'module', 'ewf', './payment-type-controller'], function (exports, module, _ewf, _paymentTypeController) {
    'use strict';

    var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

    module.exports = EwfPaymentType;

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _ewf2 = _interopRequireDefault(_ewf);

    var _PaymentTypeController = _interopRequireDefault(_paymentTypeController);

    _ewf2['default'].directive('ewfPaymentType', EwfPaymentType);

    function EwfPaymentType() {
        return {
            restrict: 'E',
            controller: _PaymentTypeController['default'],
            controllerAs: 'paymentTypeCtrl',
            require: ['^ewfShipment', 'ewfPaymentType'],
            link: {
                post: function post($scope, elem, attrs, controllers) {
                    var _controllers = _slicedToArray(controllers, 2);

                    var shipmentCtrl = _controllers[0];
                    var paymentTypeCtrl = _controllers[1];

                    shipmentCtrl.addStep(paymentTypeCtrl);
                }
            }
        };
    }
});
//# sourceMappingURL=payment-type-directive.js.map
