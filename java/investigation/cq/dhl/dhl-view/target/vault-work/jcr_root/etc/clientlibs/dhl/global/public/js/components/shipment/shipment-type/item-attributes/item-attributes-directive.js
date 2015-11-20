define(['exports', 'module', 'ewf', './item-attributes-controller', './../../../../directives/ewf-container/ewf-container-directive', './item-attributes-directive'], function (exports, module, _ewf, _itemAttributesController, _directivesEwfContainerEwfContainerDirective, _itemAttributesDirective) {
    'use strict';

    var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

    module.exports = itemAttributes;

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _ewf2 = _interopRequireDefault(_ewf);

    var _ItemAttributesController = _interopRequireDefault(_itemAttributesController);

    _ewf2['default'].directive('itemAttributes', itemAttributes);

    function itemAttributes() {
        var itemAttrCtrl = undefined,
            ewfContainerCtrl = undefined;

        function setGridCtrlLink() {
            var gridCtrl = ewfContainerCtrl.getRegisteredControllerInstance('grid');
            gridCtrl.ctrlToNotify = itemAttrCtrl;
            itemAttrCtrl.gridCtrl = gridCtrl;
        }

        return {
            restrict: 'E',
            controller: _ItemAttributesController['default'],
            controllerAs: 'itemAttrCtrl',
            template: '<div ewf-form=itemAttributes class=item-attributes-container><div ng-if=\"shipmentTypeCtrl.customsInvoiceType === shipmentTypeCtrl.CUSTOMS_INVOICE_TYPE.CREATE\"><h3 class=h5><span nls=shipment.shipment_type_packages_purpose_title></span> <a class=info><span nls=shipment.shipment_type_packages_purpose_tooltip></span></a></h3><span class=select><select name=shippingPurpose class=required ng-model=itemAttrCtrl.shippingPurpose ng-options=\"purpose.reasonForExport as purpose.title for purpose in itemAttrCtrl.shippingPurposeList\" ewf-input=itemAttributes.shippingPurpose ewf-validate-required><option nls=shipment.select_one></option></select></span></div><div class=clear ng-if=itemAttrCtrl.shippingPurpose><div item-attributes-form></div><div ewf-itar></div></div></div>',
            require: ['itemAttributes', '^ewfContainer'],
            link: {
                pre: function pre(scope, element, attributes, controllers) {
                    var _controllers = _slicedToArray(controllers, 2);

                    itemAttrCtrl = _controllers[0];
                    ewfContainerCtrl = _controllers[1];

                    ewfContainerCtrl.registerControllerInstance('itemAttrCtrl', itemAttrCtrl);
                    itemAttrCtrl.init();

                    ewfContainerCtrl.registerCallback('grid', setGridCtrlLink);
                }
            }
        };
    }
});
//# sourceMappingURL=item-attributes-directive.js.map
