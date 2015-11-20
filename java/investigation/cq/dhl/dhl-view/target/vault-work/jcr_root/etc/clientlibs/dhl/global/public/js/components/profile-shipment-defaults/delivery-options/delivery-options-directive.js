define(['exports', 'module', 'ewf', './delivery-options-controller'], function (exports, module, _ewf, _deliveryOptionsController) {
    'use strict';

    module.exports = DeliveryOptions;

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _ewf2 = _interopRequireDefault(_ewf);

    var _DeliveryOptionsController = _interopRequireDefault(_deliveryOptionsController);

    _ewf2['default'].directive('deliveryOptions', DeliveryOptions);

    function DeliveryOptions() {
        return {
            restrict: 'AE',
            controller: _DeliveryOptionsController['default'],
            controllerAs: 'deliveryOptionsCtrl',
            link: {
                post: post
            }
        };

        function post($scope, elem, attrs, controller) {
            controller.init();
        }
    }
});
//# sourceMappingURL=delivery-options-directive.js.map
