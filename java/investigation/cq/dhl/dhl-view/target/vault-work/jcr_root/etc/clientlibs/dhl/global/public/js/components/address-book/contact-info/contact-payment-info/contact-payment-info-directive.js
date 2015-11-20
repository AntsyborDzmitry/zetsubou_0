define(['exports', 'ewf', './contact-payment-info-controller'], function (exports, _ewf, _contactPaymentInfoController) {
    'use strict';

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _ewf2 = _interopRequireDefault(_ewf);

    var _EwfContactPaymentInfoController = _interopRequireDefault(_contactPaymentInfoController);

    _ewf2['default'].directive('contactPaymentInfo', contactPaymentInfo);

    function contactPaymentInfo() {
        return {
            restrict: 'E',
            controller: _EwfContactPaymentInfoController['default'],
            controllerAs: 'contactPaymentInfoCtrl',
            scope: true,
            template: '<div class=\"overlay-white ng-scope\"><div class=\"nav right\"><a id=contactPaymentShowEditInfo class=\"nav__item btn btn_action\" ng-click=\"isEditing = true\" ng-show=!isEditing><i class=dhlicon-pencil></i> <span nls=address-book.edit_btn></span></a></div><div class=\"nav right\"><a id=contactPaymentHideEditInfo class=\"nav__item btn btn_action\" ng-click=\"isEditing = false\" ng-show=isEditing><i class=dhlicon-pencil></i> <span nls=address-book.hide_btn></span></a></div><h3 class=margin-none>Payment</h3><div ng-show=isEditing><hr><div ng-if=contactPaymentInfoCtrl.multipleDefaultAccounts><label class=label nls=address-book.which_dhl_shipper_accounts_to_used_label></label> <span class=\"select select_width_full\"><select id=defaultAccount name=defaultAccount ng-options=\"option as option.title for option in contactPaymentInfoCtrl.defaultAccount track by contactPaymentInfoCtrl.mapOption(option)\" ng-model=contactPaymentInfoCtrl.attributes.paymentSettings.defaultAccount><option hidden></option></select></span><hr></div><label class=label nls=address-book.bill_shipping_charges_to_label></label> <span class=\"select select_width_full\"><select id=accountForShippingCharges name=accountForShippingCharges ng-options=\"option as option.title for option in contactPaymentInfoCtrl.accountForShippingCharges track by contactPaymentInfoCtrl.mapOption(option)\" ng-model=contactPaymentInfoCtrl.attributes.paymentSettings.accountForShippingCharges><option hidden></option></select></span><hr><div ng-if=contactPaymentInfoCtrl.isUserProfileAccounts><label class=label ng-if=!contactPaymentInfoCtrl.attributes.paymentSettings.splitDutiesAndTaxes nls=address-book.bill_duties_and_taxes_to_label></label> <label class=label ng-if=contactPaymentInfoCtrl.attributes.paymentSettings.splitDutiesAndTaxes nls=address-book.bill_duties_to_label></label> <span class=\"select select_width_full\"><select id=accountForDuties name=accountForDuties ng-options=\"option as option.title for option in contactPaymentInfoCtrl.accountForDuties track by contactPaymentInfoCtrl.mapOption(option)\" ng-model=contactPaymentInfoCtrl.attributes.paymentSettings.accountForDuties><option hidden></option></select></span><hr></div><div ng-if=contactPaymentInfoCtrl.attributes.paymentSettings.splitDutiesAndTaxes><label class=label nls=address-book.bill_taxes_to_label></label> <span class=\"select select_width_full\"><select id=accountForTaxes name=accountForTaxes ng-options=\"option as option.title for option in contactPaymentInfoCtrl.accountForTaxes track by contactPaymentInfoCtrl.mapOption(option)\" ng-model=contactPaymentInfoCtrl.attributes.paymentSettings.accountForTaxes><option hidden></option></select></span><hr></div><label class=checkbox><input id=splitDutiesAndTaxes type=checkbox class=checkbox__input data-aqa-id=splitDutiesAndTaxes ng-model=contactPaymentInfoCtrl.attributes.paymentSettings.splitDutiesAndTaxes> <span class=\"label checkbox__label\" nls=address-book.split_duty_and_tax_payments_label></span></label><hr><label class=label nls=address-book.terms_of_trade_for_customs_clearance_label></label> <span class=\"select select_width_full\"><select id=selectedTermOfTrade name=selectedTermOfTrade ng-options=\"option for option in contactPaymentInfoCtrl.selectedTermOfTrade track by option\" ng-model=contactPaymentInfoCtrl.attributes.paymentSettings.selectedTermOfTrade><option hidden></option></select></span></div></div>'
        };
    }
});
//# sourceMappingURL=contact-payment-info-directive.js.map
