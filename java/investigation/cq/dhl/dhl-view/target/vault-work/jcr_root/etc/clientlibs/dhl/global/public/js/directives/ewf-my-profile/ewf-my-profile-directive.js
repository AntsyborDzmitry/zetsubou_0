define(['exports', 'ewf', './ewf-my-profile-controller'], function (exports, _ewf, _ewfMyProfileController) {
    'use strict';

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _ewf2 = _interopRequireDefault(_ewf);

    var _EwfMyProfileController = _interopRequireDefault(_ewfMyProfileController);

    _ewf2['default'].directive('ewfMyProfile', function () {
        return {
            restrict: 'E',
            controller: _EwfMyProfileController['default'],
            controllerAs: 'myProfileCtrl',
            template: '<a class=top-nav__link href=\"{{ myProfileCtrl.urlWithLang }}/profile-details.html?tab=userDetails\"><i class=dhlicon-user></i><span nls=my-profile.my_profile_tab_title></span></a><div class=\"dropdown dropdown_right\"><div class=dropdown__wrap><ul class=dropdown__list><li class=dropdown__list-item><a class=dropdown__link href=\"{{ myProfileCtrl.urlWithLang }}/profile-details.html?tab=userDetails\" nls=my-profile.my_profile_update_contact_info_tab_title></a></li><li class=dropdown__list-item><a class=dropdown__link href=\"{{ myProfileCtrl.urlWithLang }}/profile-details.html?tab=passwordUpdate\" nls=my-profile.my_profile_change_password_tab_title></a></li><li class=dropdown__list-item><a class=dropdown__link href=\"{{ myProfileCtrl.urlWithLang }}/profile-details.html?tab=manageLinks\" nls=my-profile.my_profile_manage_quick_links_tab_title></a></li><li class=dropdown__list-item ng-if=myProfileCtrl.showRewardCards><a class=dropdown__link href=\"{{ myProfileCtrl.urlWithLang }}/profile-details.html?tab=rewardProgram\" nls=my-profile.my_profile_manage_rewards_cards_tab_title></a></li></ul></div></div>'
        };
    });
});
//# sourceMappingURL=ewf-my-profile-directive.js.map
