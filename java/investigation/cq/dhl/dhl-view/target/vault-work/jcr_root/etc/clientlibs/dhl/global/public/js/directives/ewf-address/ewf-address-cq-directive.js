define(['exports', 'module', 'ewf', './ewf-address-controller'], function (exports, module, _ewf, _ewfAddressController) {
    'use strict';

    module.exports = EwfAddress;

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _ewf2 = _interopRequireDefault(_ewf);

    var _EwfAddressController = _interopRequireDefault(_ewfAddressController);

    _ewf2['default'].directive('ewfAddress', EwfAddress);

    function EwfAddress() {
        return {
            restrict: 'E',
            controller: _EwfAddressController['default'],
            controllerAs: 'addressCtrl',
            scope: true,
            require: 'ewfAddress',
            link: {
                post: postLink
            }
        };

        function postLink(scope, elem, attrs, controller) {
            var setResidentialFlagFromProfile = scope.$eval(attrs.setResidentialFlagFromProfile);
            controller.init({
                setResidentialFlagFromProfile: setResidentialFlagFromProfile
            });
        }
    }
});
//# sourceMappingURL=ewf-address-cq-directive.js.map
