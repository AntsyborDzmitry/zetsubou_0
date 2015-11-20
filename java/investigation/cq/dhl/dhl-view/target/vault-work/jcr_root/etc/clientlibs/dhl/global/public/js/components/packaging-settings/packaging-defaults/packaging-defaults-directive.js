define(['exports', 'module', 'ewf', './packaging-defaults-controller'], function (exports, module, _ewf, _packagingDefaultsController) {
    'use strict';

    module.exports = PackagingDefaults;

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _ewf2 = _interopRequireDefault(_ewf);

    var _PackagingDefaultsController = _interopRequireDefault(_packagingDefaultsController);

    _ewf2['default'].directive('packagingDefaults', PackagingDefaults);

    function PackagingDefaults() {
        return {
            restrict: 'E',
            controller: _PackagingDefaultsController['default'],
            controllerAs: 'packagingDefaultsCtrl',
            template: '<div class=\"row overlay-white\"><div class=\"nav right\"><a class=\"nav__item btn btn_action\" ng-if=packagingDefaultsCtrl.isViewMode() ng-click=packagingDefaultsCtrl.setEditMode()><i class=dhlicon-pencil></i> <span nls=package-settings.defaults__label_edit></span></a> <a class=small ng-if=packagingDefaultsCtrl.isEditMode() ng-click=packagingDefaultsCtrl.cancelChanges()><span nls=package-settings.defaults__label_close></span></a></div><h3 class=margin-top-none><span nls=package-settings.defaults__default_packaging_label></span></h3><section><div class=row ng-if=packagingDefaultsCtrl.isViewMode()><div><span nls=package-settings.defaults__document_shipment_packaging_type></span>: <b ng-if=packagingDefaultsCtrl.getSelectedDocumentName(packagingSettingsCtrl.gridData) ng-bind=packagingDefaultsCtrl.getSelectedDocumentName(packagingSettingsCtrl.gridData)></b> <b ng-if=!packagingDefaultsCtrl.getSelectedDocumentName(packagingSettingsCtrl.gridData) nls=package-settings.defaults__label_unset></b></div><div><span nls=package-settings.defaults__package_shipment_packaging_type></span>: <b ng-if=packagingDefaultsCtrl.getSelectedPackageName(packagingSettingsCtrl.gridData) ng-bind=packagingDefaultsCtrl.getSelectedPackageName(packagingSettingsCtrl.gridData)></b> <b ng-if=!packagingDefaultsCtrl.getSelectedPackageName(packagingSettingsCtrl.gridData) nls=package-settings.defaults__label_unset></b></div><div><span nls=package-settings.defaults__package_shipment_number_pieces></span>: <b ng-bind=packagingDefaultsCtrl.defaults.shippingPackagesNumber></b></div><div><span nls=package-settings.defaults__dhl_package_generator></span>: <b ng-if=packagingDefaultsCtrl.defaults.distributeWeight nls=package-settings.defaults__label_on></b> <b ng-if=!packagingDefaultsCtrl.defaults.distributeWeight nls=package-settings.defaults__label_off></b></div><div><span nls=package-settings.defaults__package_references></span>: <b ng-if=packagingDefaultsCtrl.defaults.addToPieces nls=package-settings.defaults__label_on></b> <b ng-if=!packagingDefaultsCtrl.defaults.addToPieces nls=package-settings.defaults__label_off></b></div><div><span nls=package-settings.defaults__pallet_option></span>: <b ng-if=packagingDefaultsCtrl.defaults.pallet nls=package-settings.defaults__label_on></b> <b ng-if=!packagingDefaultsCtrl.defaults.pallet nls=package-settings.defaults__label_off></b></div></div><div class=row ng-if=packagingDefaultsCtrl.isEditMode()><form id=packagingDefaults name=packagingDefaults novalidate ewf-form=defaults-panel><div class=row><b nls=package-settings.defaults__document_shipment_default_settings></b></div><div class=\"row m-bottom\"><div class=field-wrapper><label class=label for=packTypeDocument><span nls=package-settings.defaults__packaging_type></span></label> <span class=select><select id=packTypeDocument name=packTypeDocument ng-options=\"option.key as option.name for option in packagingDefaultsCtrl.getAvailableDocuments(packagingSettingsCtrl.gridData) track by packagingDefaultsCtrl.mapOptionKey(option)\" ng-model=packagingDefaultsCtrl.defaults.selectedShippingDocumentKey><option nls=package-settings.defaults__select_packaging_type></option></select></span></div></div><div class=row><b nls=package-settings.defaults__package_shipment_default_settings></b></div><div class=\"row m-bottom\"><div class=\"col-4 field-wrapper\"><label class=label for=packTypePackage><span nls=package-settings.defaults__packaging_type></span></label> <span class=select><select id=packTypePackage name=packTypePackage ng-options=\"option.key as option.name for option in packagingDefaultsCtrl.getAvailablePackages(packagingSettingsCtrl.gridData) track by packagingDefaultsCtrl.mapOptionKey(option)\" ng-model=packagingDefaultsCtrl.defaults.selectedShippingPackageKey><option nls=package-settings.defaults__select_packaging_type></option></select></span></div><div class=\"col-5 field-wrapper\" ewf-field=nbrPieces><label class=label for=nbrPieces><span nls=package-settings.defaults__number_of_pieces></span></label> <input id=nbrPieces class=\"input input_width_small\" type=text ng-model=packagingDefaultsCtrl.defaults.shippingPackagesNumber ewf-input=defaults-panel.nbrPieces ewf-validate-required ewf-validate-pattern=QUANTITY> <span class=validation-mark></span><div ewf-field-errors></div></div></div><div class=row><b nls=package-settings.defaults__package_entry_options></b></div><div class=row><div class=col-7><label class=checkbox><input id=dhlPackGenerator class=checkbox__input type=checkbox data-aqa-id=dhlPackGenerator ng-model=packagingDefaultsCtrl.defaults.distributeWeight> <span class=label nls=package-settings.defaults__package_generator_checkbox></span></label></div><div class=col-5><small><a class=info><label nls=package-settings.defaults__package_generator_help></label> <span nls=package-settings.defaults__package_generator_tooltip></span></a></small></div></div><div class=row><label class=\"col-7 checkbox\"><input id=packReferences class=checkbox__input type=checkbox data-aqa-id=packReferences ng-model=packagingDefaultsCtrl.defaults.addToPieces> <span class=label nls=package-settings.defaults__package_references_checkbox></span></label></div><div><label class=checkbox><input id=indicatePallet class=checkbox__input type=checkbox data-aqa-id=indicatePallet ng-model=packagingDefaultsCtrl.defaults.pallet> <span class=label nls=package-settings.defaults__need_a_pallet></span></label></div><div class=row><a class=\"btn right\" ng-click=\"packagingDefaultsCtrl.applyChanges(packagingDefaults, ewfFormCtrl)\"><span nls=package-settings.defaults__label_save></span></a></div></form></div></section></div>',
            link: {
                pre: preLink
            }
        };
    }

    function preLink(scope, element, attributes, packagingDefaultsCtrl) {
        packagingDefaultsCtrl.init();
    }
});
//# sourceMappingURL=packaging-defaults-directive.js.map
