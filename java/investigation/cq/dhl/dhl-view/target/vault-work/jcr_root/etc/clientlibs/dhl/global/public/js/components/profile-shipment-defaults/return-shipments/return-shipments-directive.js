define(['exports', 'module', 'ewf', './return-shipments-controller', './../../../directives/ewf-form/ewf-form-directive'], function (exports, module, _ewf, _returnShipmentsController, _directivesEwfFormEwfFormDirective) {
    'use strict';

    module.exports = returnShipments;

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _ewf2 = _interopRequireDefault(_ewf);

    var _ReturnShipmentsController = _interopRequireDefault(_returnShipmentsController);

    _ewf2['default'].directive('returnShipments', returnShipments);

    function returnShipments() {
        return {
            restrict: 'AE',
            controller: _ReturnShipmentsController['default'],
            controllerAs: 'returnShipmentsCtrl',
            link: {
                pre: preLink
            }
        };

        function preLink(scope, elem, attrs, controller) {
            controller.preloadSectionFromUrl();
        }
    }
});
//# sourceMappingURL=return-shipments-directive.js.map
