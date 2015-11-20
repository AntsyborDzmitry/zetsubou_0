define(['exports', 'module', 'ewf', './contact-notifications-info-controller', 'directives/ewf-content-slider/ewf-content-slider-directive'], function (exports, module, _ewf, _contactNotificationsInfoController, _directivesEwfContentSliderEwfContentSliderDirective) {
    'use strict';

    module.exports = contactNotificationsInfo;

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _ewf2 = _interopRequireDefault(_ewf);

    var _EwfContactNotificationsInfoController = _interopRequireDefault(_contactNotificationsInfoController);

    _ewf2['default'].directive('contactNotificationsInfo', contactNotificationsInfo);

    function contactNotificationsInfo() {
        return {
            restrict: 'E',
            controller: _EwfContactNotificationsInfoController['default'],
            controllerAs: 'contactNotificationsInfoCtrl',
            scope: true,
            link: {
                post: function post(scope, element, attrs, ctrl) {
                    ctrl.init();
                    if (!ctrl.attributes.notificationSettings.length) {
                        ctrl.attributes.notificationSettings = [];
                        ctrl.addRepeaterItem();
                    }
                }
            }
        };
    }
});
//# sourceMappingURL=contact-notifications-info-directive.js.map
