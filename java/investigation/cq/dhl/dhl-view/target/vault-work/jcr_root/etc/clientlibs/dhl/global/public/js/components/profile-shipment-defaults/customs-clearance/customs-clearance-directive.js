define(['exports', 'module', 'ewf', './customs-clearance-controller'], function (exports, module, _ewf, _customsClearanceController) {
    'use strict';

    module.exports = CustomsClearance;

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _ewf2 = _interopRequireDefault(_ewf);

    var _CustomsClearanceController = _interopRequireDefault(_customsClearanceController);

    _ewf2['default'].directive('customsClearance', CustomsClearance);

    function CustomsClearance() {
        return {
            restrict: 'AE',
            controller: _CustomsClearanceController['default'],
            controllerAs: 'customsClearanceCtrl',
            link: {
                post: post
            }
        };

        function post(scope, elem, attrs, controller) {
            controller.init();
        }
    }
});
//# sourceMappingURL=customs-clearance-directive.js.map
