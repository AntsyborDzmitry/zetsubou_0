define(['exports', 'ewf', './profile-rewards-controller', './../../../directives/ewf-input/ewf-input-directive', './../../../directives/ewf-validate/ewf-validate-pattern-directive'], function (exports, _ewf, _profileRewardsController, _directivesEwfInputEwfInputDirective, _directivesEwfValidateEwfValidatePatternDirective) {
    'use strict';

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _ewf2 = _interopRequireDefault(_ewf);

    var _ProfileRewardsController = _interopRequireDefault(_profileRewardsController);

    _ewf2['default'].directive('profileRewards', ProfileRewards);

    function ProfileRewards() {
        return {
            restrict: 'E',
            controller: _ProfileRewardsController['default'],
            controllerAs: 'profileRewardsCtrl',
            require: 'profileRewards'
        };
    }
});
//# sourceMappingURL=profile-rewards-directive.js.map
