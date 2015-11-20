define(['exports', 'module', 'ewf', './ewf-progress-bar-controller'], function (exports, module, _ewf, _ewfProgressBarController) {
    'use strict';

    module.exports = EwfProgressBar;

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _ewf2 = _interopRequireDefault(_ewf);

    var _EwfProgressBarController = _interopRequireDefault(_ewfProgressBarController);

    _ewf2['default'].directive('ewfProgressBar', EwfProgressBar);

    function EwfProgressBar() {
        return {
            restrict: 'E',
            controller: _EwfProgressBarController['default'],
            controllerAs: 'progressBarCtrl',
            template: '<div class=\"progress progress_width_full\"><div class=progress__loader ng-style=\"{width: progressBarCtrl.progress + \'%\'}\"></div><div class=progress__counter>{{progressBarCtrl.progress}}%</div></div>',
            scope: true
        };
    }
});
//# sourceMappingURL=ewf-progress-bar-directive.js.map
