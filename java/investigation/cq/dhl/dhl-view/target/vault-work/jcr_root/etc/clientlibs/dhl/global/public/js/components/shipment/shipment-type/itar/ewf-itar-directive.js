define(['exports', 'module', 'ewf', './ewf-itar-controller', './../../../../directives/ewf-container/ewf-container-directive'], function (exports, module, _ewf, _ewfItarController, _directivesEwfContainerEwfContainerDirective) {
    'use strict';

    var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

    module.exports = ewfItar;

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _ewf2 = _interopRequireDefault(_ewf);

    var _ItarController = _interopRequireDefault(_ewfItarController);

    _ewf2['default'].directive('ewfItar', ewfItar);

    function ewfItar() {
        var ewfContainerCtrl = undefined,
            itarCtrl = undefined;

        function setItarEeiCtrlLink() {
            var itarEeiCtrl = ewfContainerCtrl.getRegisteredControllerInstance('itarEeiCtrl');
            itarCtrl.itarEeiCtrl = itarEeiCtrl;
        }

        return {
            restrict: 'EA',
            controller: _ItarController['default'],
            controllerAs: 'itarCtrl',
            template: '<div ng-if=itarCtrl.showItar() ng-form=itarForm ewf-form=itar><section class=row><div class=\"itar-block section__content callout\" ng-class=\"itarCtrl.shipmentExportType === itarCtrl.shipmentExportTypes.EEI ? \'col-12\' : \'col-8\'\"><div class=row><h4 class=\"h4 section-title margin-top-none\" nls=shipment.shipment_type_itar_electronic_export_filling></h4></div><div class=row><span class=label-error>{{ itarCtrl.error }}</span> <label class=label><span nls=shipment.shipment_type_itar_is_department_of_state></span> <a class=info><span nls=shipment.shipment_type_itar_is_department_of_state_tooltip></span></a></label><div class=field-wrapper ewf-field=checkDepartmentOfState><div class=\"radio radio_inline\"><input type=radio id=radio_yes class=radio__input name=filler ng-model=itarCtrl.isDepartmentOfState ng-value=true ewf-input=itarForm.checkDepartmentOfState ewf-validate-required> <label class=label for=radio_yes nls=shipment.shipment_type_yes></label></div><div class=\"radio radio_inline\"><input type=radio id=radio_no class=radio__input name=filler ng-model=itarCtrl.isDepartmentOfState ng-value=false ewf-input=itarForm.checkDepartmentOfState ewf-validate-required> <label class=label for=radio_no nls=shipment.shipment_type_no></label></div><span class=validation-mark></span><div ewf-field-errors></div></div></div><div class=row ng-if=itarCtrl.isDepartmentOfState><label class=label><span nls=shipment.shipment_type_itar_itn_field_title></span> <a class=info><div><p class=margin-none nls=shipment.shipment_type_itar_itn_field_tooltip_title></p><ul class=margin-bottom-none><li nls=shipment.shipment_type_itar_tooltip_generated_by_aes></li><li nls=shipment.shipment_type_itar_tooltip_assigned_to_specific_shipment></li><li nls=shipment.shipment_type_itar_tooltip_confirmation_eei></li></ul></div></a></label><div class=row ng-include=\"\'itar-itn-template\'\"></div><label class=label><span nls=shipment.shipment_type_itar_export_license_number_title></span> <a class=info><div><p class=margin-top-none nls=shipment.shipment_type_itar_export_license_number_tooltip_first_paragraph></p><p class=margin-bottom-none nls=shipment.shipment_type_itar_export_license_number_tooltip_second_paragraph></p></div></a></label><div class=row><div class=\"col-6 field-wrapper\" ewf-field=exportLicenseNumber><input type=text class=\"input input_width_full\" name=exportLicenseNumber maxlength=23 ng-model=itarCtrl.stateDepartmentFields.exportLicenseNumber ewf-input=itarForm.exportLicenseNumber ewf-validate-required ewf-validate-pattern={{itarCtrl.PATTERNS.exportLicenseNumber}}> <span class=validation-mark></span><div ewf-field-errors></div></div></div><label class=label nls=shipment.shipment_type_itar_ultimate_consignee_field_title></label><div class=row><div class=\"col-6 field-wrapper\" ewf-field=ultimateConsignee><input type=text class=\"input input_width_full\" name=ultimateConsignee maxlength=35 ng-model=itarCtrl.stateDepartmentFields.ultimateConsignee ewf-input=itarForm.ultimateConsignee ewf-validate-required ewf-validate-pattern={{itarCtrl.PATTERNS.ultimateConsignee}}> <span class=validation-mark></span><div ewf-field-errors></div></div></div></div><div ng-if=\"itarCtrl.isDepartmentOfState === false\" ewf-field=checkFtrExamption><div class=radio><p>{{ itarCtrl.notDepartmentOfStateDescription }}</p><div><input class=radio__input id=radio_shipment_yes ng-model=itarCtrl.federalTradeRegulations ng-value=true type=radio name=checkFtrExamption ewf-input=itarForm.checkFtrExamption ewf-validate-required> <label class=label for=radio_shipment_yes nls=shipment.shipment_type_itar_not_department_of_state_answer_yes></label>&nbsp;&nbsp; <input class=radio__input id=radio_shipment_no ng-model=itarCtrl.federalTradeRegulations ng-value=false type=radio name=checkFtrExamption ewf-input=itarForm.checkFtrExamption ewf-validate-required> <label class=label for=radio_shipment_no nls=shipment.shipment_type_itar_not_department_of_state_answer_no></label></div><div ewf-field-errors></div></div></div><div ng-if=itarCtrl.isNotFederalRegulations() class=margin-top><label class=\"label block\" nls=shipment.shipment_type_itar_select_export_option_description></label> <span class=select ng-class=\"{\'margin-bottom\' : itarCtrl.shipmentExportType}\"><select ng-model=itarCtrl.shipmentExportType ewf-input=itarForm.shipmentExportType ewf-validate-required><option value={{exportType.value}} nls={{exportType.nlsKey}} ng-repeat=\"exportType in itarCtrl.shipmentExportTypesList\" ng-selected=\"itarCtrl.shipmentExportType === exportType.value\"></option><option value={{itarCtrl.shipmentExportTypes.EIN}} nls=shipment.shipment_type_itar_ein_option ng-if=itarCtrl.employeeIdAvailable ng-selected=\"itarCtrl.shipmentExportType === itarCtrl.shipmentExportTypes.EIN\"></option></select></span><div ng-if=\"itarCtrl.shipmentExportType === itarCtrl.shipmentExportTypes.FTR\"><label class=label><span nls=shipment.shipment_type_itar_ftr_title></span> <a ng-click=itarCtrl.openFtrCodesPopup() nls=shipment.shipment_type_itar_ftr_lookup_link></a></label> <span class=select><select name=ftrExemptionList ng-model=itarCtrl.ftrExemptions ng-options=\"option as option.code for option in itarCtrl.ftrExemptionList track by option.code\" ewf-input=itarForm.ftrExemptions ewf-validate-required><option selected nls=shipment.shipment_type_itar_select_one></option></select></span></div><div ng-if=\"itarCtrl.shipmentExportType === itarCtrl.shipmentExportTypes.ITN\"><label class=label><span nls=shipment.shipment_type_itar_itn_field_title></span> <a class=info><div><p class=margin-none nls=shipment.shipment_type_itar_itn_field_tooltip_title></p><ul class=margin-bottom-none><li nls=shipment.shipment_type_itar_tooltip_generated_by_aes></li><li nls=shipment.shipment_type_itar_tooltip_assigned_to_specific_shipment></li><li nls=shipment.shipment_type_itar_tooltip_confirmation_eei></li></ul></div></a></label><div class=row ng-include=\"\'itar-itn-template\'\"></div></div><div ng-if=\"itarCtrl.shipmentExportType === itarCtrl.shipmentExportTypes.EIN\"><div class=row><div class=\"col-6 field-wrapper\" ewf-field=ein><input type=text class=\"input input_width_full\" name=ein maxlength=11 ng-model=itarCtrl.einNumber ewf-input=itarForm.ein ewf-validate-required ewf-validate-pattern={{itarCtrl.PATTERNS.EIN}}> <span class=validation-mark></span><div ewf-field-errors></div></div></div><div class=row nls=shipment.shipment_type_itar_aespost_message></div><label class=\"checkbox field\" ewf-field=aespostTermsAccepted><input id=ein-confirm type=checkbox class=checkbox__input name=aespostTermsAccepted ng-model=itarCtrl.aespostTermsAccepted ewf-input=itarForm.aespostTermsAccepted data-aqa-id=ein-confirm ewf-validate-equality=true> <span class=label nls=shipment.shipment_type_itar_aespost_confirm_label></span><div class=\"msg-error_left msg-error_permanent\" ewf-field-errors></div></label></div><div ewf-itar-eei ng-if=\"itarCtrl.shipmentExportType === itarCtrl.shipmentExportTypes.EEI\"></div></div></div></section></div>',
            require: ['ewfItar', '^ewfContainer'],
            link: {
                pre: function pre(scope, element, attributes, controllers) {
                    var _controllers = _slicedToArray(controllers, 2);

                    itarCtrl = _controllers[0];
                    ewfContainerCtrl = _controllers[1];

                    ewfContainerCtrl.registerControllerInstance('itarCtrl', itarCtrl);
                    ewfContainerCtrl.registerCallback('itarEeiCtrl', setItarEeiCtrlLink);

                    itarCtrl.init();
                }
            }
        };
    }
});
//# sourceMappingURL=ewf-itar-directive.js.map
