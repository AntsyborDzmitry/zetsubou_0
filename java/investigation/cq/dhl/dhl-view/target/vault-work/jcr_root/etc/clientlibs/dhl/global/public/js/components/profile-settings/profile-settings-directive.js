define(['exports', 'ewf', './profile-settings-controller', './profile-password/profile-password-directive', './profile-rewards/profile-rewards-directive', './profile-quick-links/profile-quick-links-directive'], function (exports, _ewf, _profileSettingsController, _profilePasswordProfilePasswordDirective, _profileRewardsProfileRewardsDirective, _profileQuickLinksProfileQuickLinksDirective) {
    'use strict';

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _ewf2 = _interopRequireDefault(_ewf);

    var _ProfileSettingsController = _interopRequireDefault(_profileSettingsController);

    _ewf2['default'].directive('ewfProfileSettings', ewfProfileSettings);

    function ewfProfileSettings() {
        return {
            restrict: 'E',
            controller: _ProfileSettingsController['default'],
            controllerAs: 'profileSettingsCtrl'
        };
    }
});
//# sourceMappingURL=profile-settings-directive.js.map
