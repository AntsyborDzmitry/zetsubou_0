define(['exports', 'ewf', './shipment-complete-controller', './want-to-share/want-to-share-directive'], function (exports, _ewf, _shipmentCompleteController, _wantToShareWantToShareDirective) {
    'use strict';

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _ewf2 = _interopRequireDefault(_ewf);

    var _ShipmentCompleteController = _interopRequireDefault(_shipmentCompleteController);

    _ewf2['default'].directive('ewfShipmentComplete', ewfShipmentComplete);

    function ewfShipmentComplete() {
        return {
            restrict: 'E',
            controller: _ShipmentCompleteController['default'],
            controllerAs: 'completeCtrl',
            template: '<div class=container><ul class=steppable-breadcrumbs><li class=\"steppable-breadcrumbs__item is-complete\">Create Shipment</li><li class=\"steppable-breadcrumbs__item is-complete\">Pay</li><li class=\"steppable-breadcrumbs__item is-complete\">Print</li></ul><section class=area><h1 class=margin-none>Import Shipment Complete</h1><div class=row><div class=col-9><div class=\"alert alert_info\">If you would like to view the shipments that were incomplete, please visit <a href=#>Manage Shipments</a></div><div class=overlay-grey><h2 class=margin-top-none>Important</h2><ul><li>Your shipping instructions and documents have been sent to your shipper</li><li>Check Manage Shipments to monitor progress of your shipment</li><li>You can also select to receive notifications on the shipment\'s progress or share shipment details with others</li></ul></div><div class=overlay-white><div class=col-6><div id=getNotifications><h3 class=margin-top-none><i class=dhlicon-mobile></i> Want Status Notifications?</h3><p>Set up email or text notifications for this shipment\'s progress - for you or others!</p><a class=\"btn btn_action\" ng-click=completeCtrl.showNotificationsDialog();>Get and Send Notifications</a></div></div><div class=col-6><div want-to-share></div></div></div><div class=\"overlay-white ng-scope is-hidden\" accessible-for=expert></div></div><div class=col-3><div class=overlay-white><div><h3 class=margin-none>Your Tracking Number:</h3><h2 class=\"trackingNumber margin-none ng-binding\">6933574203</h2><input type=hidden name=trackingNumber value=4323991800></div></div><ul class=no-bullets><li accessible-for=expert class=is-hidden></li><li accessible-for=novice><div><div class=\"single-line row\"><a class=\"btn btn_action full-width a-left\" ng-click=completeCtrl.showSaveAsFavoriteDialog()><i class=dhlicon-favorite-empty></i> Save as Favorite</a> <span class=dhlicon-check ng-show=false>Saved as Favorite</span></div></div></li><li accessible-for=expert></li><li><a class=\"btn btn_action full-width a-left\"><i class=dhlicon-print></i> Reprint Documents</a></li><li><a class=\"btn btn_action full-width a-left\"><i class=dhlicon-download></i> Download Documents</a></li><li><hr></li><li accessible-for=expert class=is-hidden></li><li><a class=\"btn btn_action btn_regular full-width\" href=#>Create Another Shipment</a></li><li accessible-for=novice><div><hr class=\"large ng-scope\"><div id=saveShipmentDefaults><h3 class=margin-none>Save Shipment Defaults</h3><p class=margin-none>Save these defaults to use for future shipments.</p><div data-check-group=saveShipmentDefaults data-min=1 class=\"required ng-scope\" accessible-for=\"guest, novice\"><label class=\"checkbox checkbox_small\"><input type=checkbox id=checkbox_saveDefaults_shipmentType class=checkbox__input data-group=saveShipmentDefaults name=saveDefaults_shipmentType data-aqa-id=checkbox_saveDefaults_shipmentType> <span class=label nls=shipment.shipment_complete_save_defaults_shipment_type></span></label> <label class=\"checkbox checkbox_small\"><input type=checkbox name=saveDefaults_packageType id=checkbox_saveDefaults_packageType class=checkbox__input data-group=saveShipmentDefaults data-aqa-id=checkbox_saveDefaults_packageType> <span class=label nls=shipment.shipment_complete_save_defaults_package_type></span></label> <label class=\"checkbox checkbox_small\"><input type=checkbox name=saveDefaults_product id=checkbox_saveDefaults_product class=checkbox__input data-group=saveShipmentDefaults data-aqa-id=checkbox_saveDefaults_product> <span class=\"label ng-binding\" nls=shipment.shipment_complete_save_defaults_product></span></label></div><br><span data-check-group=saveShipmentDefaults data-min=1 class=\"checkbox checkbox_small required row\" accessible-for=expert></span><hr><a class=\"btn btn_action\" ng-click>Save</a> <small><a>Edit</a></small></div></div></li><li accessible-for=expert></li></ul></div></div></section></div>'
        };
    }
});
//# sourceMappingURL=shipment-complete-directive.js.map
