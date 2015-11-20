define(['exports', 'ewf', './../../../../directives/ewf-modal/ewf-modal-directive', './want-to-share-controller'], function (exports, _ewf, _directivesEwfModalEwfModalDirective, _wantToShareController) {
    'use strict';

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _ewf2 = _interopRequireDefault(_ewf);

    var _WantToShareController = _interopRequireDefault(_wantToShareController);

    _ewf2['default'].directive('wantToShare', wantToShare);

    function wantToShare() {
        return {
            restrict: 'EA',
            controller: _WantToShareController['default'],
            controllerAs: 'wtsCtrl',
            template: '<div><h3 class=margin-top-none><i class=dhlicon-share></i><span nls=shipment.shipment_complete_want_to_share></span></h3><p class=margin-none nls=shipment.shipment_complete_want_to_share_select_shipment_details></p><div data-check-group=shareShippingDetails data-min=1 class=\"required checkbox checkbox_small\"><div class=row><div class=col-6><label class=checkbox><input type=checkbox id=checkbox_shareTrackingNumber class=checkbox__input ng-model=wtsCtrl.shareDefaults.trackingNumber data-aqa-id=checkbox_shareTrackingNumber data-group=shareShippingDetails> <span class=label nls=shipment.shipment_complete_want_to_share_tracking_number></span></label></div><div class=col-6><label class=checkbox><input type=checkbox id=checkbox_sharePickupConfirmationNumber class=checkbox__input ng-model=wtsCtrl.shareDefaults.pickupConfirmationNumber data-aqa-id=checkbox_sharePickupConfirmationNumber data-group=shareShippingDetails> <span class=label nls=shipment.shipment_complete_want_to_share_pickup_confirmation_number></span></label></div></div><div class=row><div class=col-6><label class=checkbox><input type=checkbox id=checkbox_shareShippingLabel class=checkbox__input ng-model=wtsCtrl.shareDefaults.label data-aqa-id=checkbox_shareShippingLabel data-group=shareShippingDetails> <span class=label nls=shipment.shipment_complete_want_to_share_label></span></label></div><div class=col-6><label class=checkbox><input type=checkbox id=checkbox_shareCustomsInvoice class=checkbox__input ng-model=wtsCtrl.shareDefaults.customsInvoice data-aqa-id=checkbox_shareCustomsInvoice data-group=shareShippingDetails> <span class=label nls=shipment.shipment_complete_want_to_share_invoice></span></label></div></div><div class=row><div class=col-6><label class=checkbox><input type=checkbox id=checkbox_sharePaymentReceipt class=checkbox__input ng-model=wtsCtrl.shareDefaults.receipt data-aqa-id=checkbox_sharePaymentReceipt data-group=shareShippingDetails> <span class=label nls=shipment.shipment_complete_want_to_share_receipt></span></label></div></div><hr><a class=\"btn btn_action\" ng-click=wtsCtrl.openShareDialog() nls=shipment.shipment_complete_want_to_share_share></a> <span class=msg-error nls=shipment.shipment_complete_want_to_share_error_select_one></span></div></div>'
        };
    }
});
//# sourceMappingURL=want-to-share-directive.js.map
