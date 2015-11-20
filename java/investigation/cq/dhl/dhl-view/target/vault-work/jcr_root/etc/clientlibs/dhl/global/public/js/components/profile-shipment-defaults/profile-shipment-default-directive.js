define(['exports', 'module', 'ewf', './profile-shipment-default-controller'], function (exports, module, _ewf, _profileShipmentDefaultController) {
    'use strict';

    module.exports = ewfProfileShipmentDefault;

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _ewf2 = _interopRequireDefault(_ewf);

    var _ProfileSettingsDefaultController = _interopRequireDefault(_profileShipmentDefaultController);

    _ewf2['default'].directive('ewfProfileShipmentDefault', ewfProfileShipmentDefault);

    function ewfProfileShipmentDefault() {
        return {
            restrict: 'AE',
            controller: _ProfileSettingsDefaultController['default'],
            controllerAs: 'defaultShipmentController',
            link: {
                pre: preLink
            }
        };

        function preLink(scope, elem, attrs, controller) {
            controller.preloadTabFromUrl();
        }
    }
});
//# sourceMappingURL=profile-shipment-default-directive.js.map
