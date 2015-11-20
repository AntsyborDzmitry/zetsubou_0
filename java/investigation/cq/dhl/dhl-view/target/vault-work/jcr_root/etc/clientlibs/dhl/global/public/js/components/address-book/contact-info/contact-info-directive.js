define(['exports', 'ewf', './contact-info-controller', 'directives/ewf-address/ewf-address-cq-directive', 'directives/ewf-phone/ewf-phone-cq-directive', './contact-payment-info/contact-payment-info-directive', './contact-pickup-info/contact-pickup-info-directive', './re-apply-rules/re-apply-rules-directive', './contact-notifications-info/contact-notifications-info-directive', './contact-share-info/contact-share-info-directive', './contact-mailing-lists/contact-mailing-lists-directive'], function (exports, _ewf, _contactInfoController, _directivesEwfAddressEwfAddressCqDirective, _directivesEwfPhoneEwfPhoneCqDirective, _contactPaymentInfoContactPaymentInfoDirective, _contactPickupInfoContactPickupInfoDirective, _reApplyRulesReApplyRulesDirective, _contactNotificationsInfoContactNotificationsInfoDirective, _contactShareInfoContactShareInfoDirective, _contactMailingListsContactMailingListsDirective) {
    'use strict';

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _ewf2 = _interopRequireDefault(_ewf);

    var _ContactInfoController = _interopRequireDefault(_contactInfoController);

    _ewf2['default'].directive('ewfContactInfo', ewfContactInfo);

    function ewfContactInfo() {
        return {
            restrict: 'E',
            controller: _ContactInfoController['default'],
            controllerAs: 'contactInfoCtrl',
            required: 'ewfContactInfo'
        };
    }
});
//# sourceMappingURL=contact-info-directive.js.map
