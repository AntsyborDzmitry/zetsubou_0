define(['exports', 'module', 'ewf', './pickup-packagings-controller'], function (exports, module, _ewf, _pickupPackagingsController) {
    'use strict';

    module.exports = PickupPackagings;

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _ewf2 = _interopRequireDefault(_ewf);

    var _PickupPackagingsCtrl = _interopRequireDefault(_pickupPackagingsController);

    _ewf2['default'].directive('pickupPackagings', PickupPackagings);

    function PickupPackagings() {
        return {
            restrict: 'AE',
            require: 'pickupPackagings',
            controller: _PickupPackagingsCtrl['default'],
            controllerAs: 'pickupPackagingsCtrl',
            template: '<div><div class=row><div class=col-7 nls=shipment.pickup_packaging_type_title></div><div class=col-2 nls=shipment.pickup_packaging_qty_title></div></div><div class=\"row field-wrapper\" ng-repeat=\"packaging in pickupPackagingsCtrl.packagings\"><div class=col-7><div ewf-field=packagingType{{$index}} class=select><select class=select ng-change=pickupPackagingsCtrl.onPackagingTypeChange(packaging) ng-model=packaging.id ng-options=\"type.id as type.name for type in pickupPackagingsCtrl.packagingTypes\" ewf-input=pickupPackagings.packagingType{{$index}} ewf-validate-required><option class=is-hidden selected disabled nls=shipment.pickup_packaging_select_packaging></option></select><span class=validation-mark></span><div ewf-field-errors></div></div></div><div class=col-2 ewf-field=packagingQty{{$index}}><input type=text class=input ng-disabled=!packaging.id ng-model=packaging.quantity ewf-input=pickupPackagings.packagingQty{{$index}} ewf-validate-pattern=NATURAL_NUMBER ewf-validate-max-message=shipment.package_details_max_quantity_validation_error ewf-validate-max={{pickupPackagingsCtrl.getMaxQty(packaging)}}><div ewf-field-errors></div></div><div class=col-3><button class=\"btn btn_action\" ng-hide=pickupPackagingsCtrl.hasOnlyOnePackaging() ng-click=pickupPackagingsCtrl.removePackaging(packaging) nls=shipment.pickup_packaging_remove></button></div></div><button class=\"btn btn_animate btn_small\" ng-click=pickupPackagingsCtrl.addPackaging()><span class=dhlicon-add></span> <span class=btn__text nls=shipment.pickup_packaging_add></span></button></div>',
            link: { post: post },
            scope: {
                packagings: '=ngModel',
                country: '='
            }
        };

        function post(scope, element, attrs, ctrl) {
            ctrl.packagings = scope.packagings;

            if (!scope.packagings.length) {
                ctrl.addPackaging();
            }

            scope.$watch('country', ctrl.onShipperCountryUpdate);
        }
    }
});
//# sourceMappingURL=pickup-packagings-directive.js.map
