define(['exports', 'ewf', './shipment-toolbar-controller'], function (exports, _ewf, _shipmentToolbarController) {
    'use strict';

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _ewf2 = _interopRequireDefault(_ewf);

    var _ShipmentToolbarController = _interopRequireDefault(_shipmentToolbarController);

    _ewf2['default'].directive('ewfShipmentToolbar', ewfShipmentToolbar);

    function ewfShipmentToolbar() {
        return {
            restrict: 'A',
            controller: _ShipmentToolbarController['default'],
            controllerAs: 'toolbarCtrl',
            template: '<div class=menu-bar><div><ul class=menu-bar__items><li class=menu-bar__item ng-if=!shipmentCtrl.isMainFlowVisible()><a class=\"btn btn_action btn_action_white\" ng-click=shipmentCtrl.triggerMainFlowVisibility()><i class=dhlicon-carat-left></i> <span nls=shipment.toolbar_go_back></span></a></li><li class=menu-bar__item ng-if=!shipmentCtrl.isMainFlowVisible()><a class=\"btn btn_action btn_action_white\" ng-click=toolbarCtrl.cancelEnhancedInvoiceChanges(shipmentCtrl)><i class=dhlicon-cancel></i> <span nls=shipment.toolbar_cancel_shipment></span></a></li><li class=menu-bar__item ng-if=shipmentCtrl.isMainFlowVisible()><a class=\"btn btn_action btn_action_white\" href=#><i class=dhlicon-cancel></i> <span nls=shipment.toolbar_cancel></span></a></li><li class=menu-bar__item ng-if=shipmentCtrl.isMainFlowVisible()><a class=\"btn btn_action btn_action_white\"><i class=dhlicon-terms></i> <span nls=shipment.toolbar_assign_shipment></span></a></li><li class=menu-bar__item><a class=\"btn btn_success btn_small\" ng-click=toolbarCtrl.showSaveForLaterDialog()><i class=dhlicon-save></i> <span nls=shipment.toolbar_save_for_later></span></a></li></ul></div></div>'
        };
    }
});
//# sourceMappingURL=shipment-toolbar-directive.js.map
