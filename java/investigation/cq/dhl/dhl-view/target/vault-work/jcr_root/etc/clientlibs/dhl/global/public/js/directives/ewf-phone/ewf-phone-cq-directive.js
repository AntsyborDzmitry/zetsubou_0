define(['exports', 'ewf', './ewf-phone-controller'], function (exports, _ewf, _ewfPhoneController) {
    'use strict';

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _ewf2 = _interopRequireDefault(_ewf);

    var _EwfPhoneController = _interopRequireDefault(_ewfPhoneController);

    _ewf2['default'].directive('ewfPhone', ewfPhone);

    function ewfPhone() {
        return {
            restrict: 'E',
            controller: _EwfPhoneController['default'],
            controllerAs: 'phoneCtrl',
            scope: true,
            require: 'ewfPhone',
            //templateUrl: /* NO EMBED */'ewf-phone.html',
            link: function link(scope, element, attrs, ctrl) {
                ctrl.form = attrs.form;
                ctrl.preId = attrs.preId;
            }
        };
    }
});
//# sourceMappingURL=ewf-phone-cq-directive.js.map
