define(['exports', 'ewf', './contact-share-info-controller'], function (exports, _ewf, _contactShareInfoController) {
    'use strict';

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _ewf2 = _interopRequireDefault(_ewf);

    var _ContactShareInfoController = _interopRequireDefault(_contactShareInfoController);

    _ewf2['default'].directive('contactShareInfo', ContactShareInfo);

    function ContactShareInfo() {
        return {
            restrict: 'EA',
            controller: _ContactShareInfoController['default'],
            controllerAs: 'contactShareInfoCtrl',
            scope: true,
            template: '<div class=overlay-white ng-init=\"isEditing = false\"><div class=showcase><div class=\"nav right\"><a id=contactNotificationShowEditInfo class=\"nav__item btn btn_action\" ng-click=\"isEditing = true\" ng-show=!isEditing><i class=dhlicon-pencil></i> <span nls=address-book.edit_btn></span></a></div><div class=\"nav right\"><a id=contactNotificationHideEditInfo class=\"nav__item btn btn_action\" ng-click=\"isEditing = false\" ng-show=isEditing><i class=dhlicon-pencil></i> <span nls=address-book.hide_btn></span></a></div><h3 class=margin-none nls=address-book.share_title></h3><div class=row ng-show=isEditing><hr><label class=label nls=address-book.email_details_to_contact_title></label><div class=\"form-group form-group_small\"><div class=row><div class=col-4><label class=\"checkbox checkbox_small\"><input type=checkbox id=trackingNum class=checkbox__input data-aqa-id=trackingNum ng-model=contactShareInfoCtrl.shareSettings.sharedInfo.trackingNumber> <span class=label nls=address-book.tracking_number_title></span></label></div><div class=col-4><label class=\"checkbox checkbox_small\"><input type=checkbox id=pickupConfirmation class=checkbox__input data-aqa-id=pickupConfirmation ng-model=contactShareInfoCtrl.shareSettings.sharedInfo.pickupConfirmation> <span class=label nls=address-book.pickup_confirmation_title></span></label></div><div class=col-4><label class=\"checkbox checkbox_small\"><input type=checkbox id=shippingLabel class=checkbox__input data-aqa-id=shippingLabel ng-model=contactShareInfoCtrl.shareSettings.sharedInfo.shippingLabel> <span class=label nls=address-book.shipping_lable_waybill_title></span></label></div></div><div class=row><div class=col-4><label class=\"checkbox checkbox_small\"><input type=checkbox id=customsInvoice class=checkbox__input data-aqa-id=customsInvoice ng-model=contactShareInfoCtrl.shareSettings.sharedInfo.customsInvoice> <span class=label nls=address-book.customs_invoice_title></span></label></div><div class=col-4><label class=\"checkbox checkbox_small\"><input type=checkbox id=shippingReceipt class=checkbox__input data-aqa-id=shippingReceipt ng-model=contactShareInfoCtrl.shareSettings.sharedInfo.shippingReceipt> <span class=label nls=address-book.shipping_receipt_title></span></label></div></div></div><div class=field-wrapper><label class=label nls=address-book.include_message_in_email_title></label> <textarea class=\"textarea textarea_width_full\" ng-model=contactShareInfoCtrl.shareSettings.emailMessage></textarea></div></div></div></div>'
        };
    }
});
//# sourceMappingURL=contact-share-info-directive.js.map
