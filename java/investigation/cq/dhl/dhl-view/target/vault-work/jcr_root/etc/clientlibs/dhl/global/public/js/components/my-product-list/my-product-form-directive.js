define(['exports', 'module', 'ewf', './my-product-form-controller'], function (exports, module, _ewf, _myProductFormController) {
    'use strict';

    module.exports = MyProductFormDirective;

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _ewf2 = _interopRequireDefault(_ewf);

    var _MyProductFormController = _interopRequireDefault(_myProductFormController);

    _ewf2['default'].directive('ewfMyProductForm', MyProductFormDirective);

    function MyProductFormDirective() {
        return {
            restrict: 'AE',
            controller: _MyProductFormController['default'],
            controllerAs: 'myProductFormCtrl',
            link: link
        };

        function link(scope, element, attrs, controller) {
            controller.init();
        }
    }
});
//# sourceMappingURL=my-product-form-directive.js.map
