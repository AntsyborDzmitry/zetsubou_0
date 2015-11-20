define(['exports', 'module', 'ewf', './ewf-shipment-type-controller', './../../../directives/ewf-container/ewf-container-directive', './itar/ewf-itar-directive', './itar/eei/ewf-itar-eei-directive'], function (exports, module, _ewf, _ewfShipmentTypeController, _directivesEwfContainerEwfContainerDirective, _itarEwfItarDirective, _itarEeiEwfItarEeiDirective) {
    'use strict';

    module.exports = EwfShipmentType;

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _ewf2 = _interopRequireDefault(_ewf);

    var _EwfShipmentTypeController = _interopRequireDefault(_ewfShipmentTypeController);

    _ewf2['default'].directive('ewfShipmentType', EwfShipmentType);

    function EwfShipmentType() {
        var shipmentTypeCtrl = undefined,
            ewfContainerCtrl = undefined;

        function setItemAttrCtrlLink() {
            var itemAttrCtrl = ewfContainerCtrl.getRegisteredControllerInstance('itemAttrCtrl');
            shipmentTypeCtrl.itemAttrCtrl = itemAttrCtrl;
        }

        function setItarCtrlLink() {
            var itarCtrl = ewfContainerCtrl.getRegisteredControllerInstance('itarCtrl');
            shipmentTypeCtrl.itarCtrl = itarCtrl;
        }

        return {
            restrict: 'E',
            controller: _EwfShipmentTypeController['default'],
            controllerAs: 'shipmentTypeCtrl',
            require: ['^ewfShipment', 'ewfShipmentType', 'ewfContainer'],
            link: {
                pre: function pre($scope, element, attrs, controllers) {
                    var shipmentCtrl = controllers[0];
                    shipmentTypeCtrl = controllers[1];
                    shipmentCtrl.addStep(shipmentTypeCtrl);
                },
                post: function postLink($scope, element, attrs, controllers) {
                    shipmentTypeCtrl = controllers[1];
                    ewfContainerCtrl = controllers[2];

                    ewfContainerCtrl.registerCallback('itemAttrCtrl', setItemAttrCtrlLink);
                    ewfContainerCtrl.registerCallback('itarCtrl', setItarCtrlLink);
                }
            }
        };
    }
});
//# sourceMappingURL=ewf-shipment-type-directive.js.map
