<%@page session="false" contentType="text/html; charset=utf-8" pageEncoding="utf-8" %>
<%@include file="/apps/dhl/foundation/global.jsp"%>
<cq:setContentBundle/>

<ewf:registerComponent paths="directives/ewf-click/ewf-click-directive"/>

<div id="modals" class="visible"
   ng-cloak
   ng-if="packagingSettingsCtrl.showEditPopup">
    <div id="modal-bg"></div>
    <div>
        <div class="modal visible modal-packaging-settings" ng-cloak="">
            <a class="modal__btn-close" ng-click="packagingSettingsCtrl.closeDialog()"></a>

            <form id="packagingSettings" name="packagingSettings" novalidate="" ewf-form="packaging-popup">

            <div class="row">
                <div class="col-12">
                    <h3 class="margin-none margin-bottom-small">
                        <fmt:message key="my_own_packaging_options"/>
                    </h3>
                </div>
                <hr class="hr">
            </div>

            <div class="field-wrapper">
                <div class="col-3">
                    <label for="nicknameId" class="label"
                       nls="shipment-settings.packaging_settings_popup_nickname">
                    </label>
                </div>
                <div class="col-9"
                   ewf-field="nicknameId">
                    <input id="nicknameId" class="input input_width_full" type="text"
                       ng-model="packagingSettingsCtrl.singlePackage.nickName"
                       ng-class="{'ng-invalid': packagingSettingsCtrl.nickNameDuplicated}"
                       ng-change="packagingSettingsCtrl.duplicatedNicknamesReset()"
                       ewf-input="packaging-popup.nicknameId"
                       ewf-validate-required>
                    <span class="validation-mark"></span>
                    <div ewf-field-errors></div>
                    <div ng-class="{'single-msg-error': packagingSettingsCtrl.nickNameDuplicated,
                       'is-hidden': !packagingSettingsCtrl.nickNameDuplicated}">
                        <fmt:message key="nickname_duplicated_validation_message"/>
                    </div>
                </div>
            </div>

            <div class="row margin-top">
                <div class="col-3">
                    <div class="font_small"
                       nls="shipment-settings.packaging_settings_popup_package_using">
                    </div>
                </div>
                <div class="col-9 checkbox-group"
                   ng-class="{'checkbox-group-erroneous': !packagingSettingsCtrl.singlePackage.isDocuments &&
                   !packagingSettingsCtrl.singlePackage.isPackages}">
                    <div class="col-6"
                       ewf-field="isDocuments">
                        <label class="checkbox">
                            <input type="checkbox" id="packaging-for-documents" class="checkbox__input"
                               ewf-input="packaging-popup.nicknameId.isDocuments"
                               ng-model="packagingSettingsCtrl.singlePackage.isDocuments"
                               data-aqa-id="packaging-for-documents"
                               ewf-validate-required>
                            <span class="label font_small"
                                nls="shipment-settings.packaging_settings_popup_documents">
                            </span>
                        </label>
                    </div>
                    <div class="col-6"
                       ewf-field="isPackages">
                        <label class="checkbox">
                            <input id="packaging-for-packages" class="checkbox__input" type="checkbox"
                               ewf-input="packaging-popup.nicknameId.isPackages"
                               ng-model="packagingSettingsCtrl.singlePackage.isPackages"
                               data-aqa-id="packaging-for-packages"
                               ewf-validate-required>
                            <span class="label font_small"
                               nls="shipment-settings.packaging_settings_popup_packages">
                            </span>
                        </label>
                    </div>
                    <span class="checkbox-group-error-msg"
                       nls="package-settings.checkbox_validation_message">
                    </span>
                </div>
            </div>

            <div class="field-wrapper margin-top">
                <div class="col-3">
                    <label for="pieceReferenceId" class="label"
                       nls="shipment-settings.packaging_settings_popup_piece_reference">
                    </label>
                </div>
                <div class="col-9">
                    <input type="text" class="input input_width_full" id="pieceReferenceId"
                       ng-model="packagingSettingsCtrl.singlePackage.pieceReference">
                </div>
            </div>

            <div class="field-wrapper margin-top">
                <div class="col-3">
                    <label for="packagingWeightId" class="label"
                       nls="shipment-settings.packaging_settings_popup_default_weight">
                    </label>
                </div>
                <div class="col-9"
                   ewf-field="packagingWeightId">
                    <input type="text" class="input input_width_small" id="packagingWeightId"
                       ewf-input="packaging-popup.packagingWeightId"
                       ewf-validate-required
                       ewf-validate-pattern="UNSIGNED_FLOAT"
                       ng-model="packagingSettingsCtrl.singlePackage.defaultWeight.value">
                    <span class="validation-mark"></span>
                    <div ewf-field-errors></div>
                    <span class="select">
                        <select id="uomWeightId"
                           ng-options="option.key as option.title for option in packagingSettingsCtrl.weightUnits()
                           track by packagingSettingsCtrl.mapOptionKey(option)"
                           ng-model="packagingSettingsCtrl.singlePackage.defaultWeight.unit"
                           ng-change="packagingSettingsCtrl.onChangeWeightUnit('{{packagingSettingsCtrl
                           .singlePackage.defaultWeight.unit}}')"
                           ewf-input="packaging-popup.uomWeight"
                           ewf-validate-required>
                        </select>
                    </span>
                </div>
            </div>

            <div class="fw-bold"
               nls="shipment-settings.packaging_settings_popup_dimensions">
            </div>

            <div class="field-wrapper">
                <span ewf-field="packagingLengthId">
                    <input id="packagingLengthId" class="input input_width_small" type="text" placeholder="Length"
                       ng-model="packagingSettingsCtrl.singlePackage.defaultDimensions.length"
                       ewf-input="packaging-popup.packagingLengthId"
                       ewf-validate-required
                       ewf-validate-pattern="UNSIGNED_FLOAT">
                    <span class="validation-mark"></span>
                    <div ewf-field-errors></div>
                </span>

                <span class="dimensions-divider"></span>

                <span ewf-field="packagingWidthId">
                    <input id="packagingWidthId" class="input input_width_small" type="text" placeholder="Width"
                       ng-model="packagingSettingsCtrl.singlePackage.defaultDimensions.width"
                       ewf-input="packaging-popup.packagingWidthId"
                       ewf-validate-required
                       ewf-validate-pattern="UNSIGNED_FLOAT">
                    <span class="validation-mark"></span>
                    <div ewf-field-errors></div>
                </span>

                <span class="dimensions-divider"></span>

                <span ewf-field="packagingHeightId">
                    <input id="packagingHeightId" class="input input_width_small" type="text" placeholder="Height"
                       ng-model="packagingSettingsCtrl.singlePackage.defaultDimensions.height"
                       ewf-input="packaging-popup.packagingHeightId"
                       ewf-validate-required
                       ewf-validate-pattern="UNSIGNED_FLOAT">
                    <span class="validation-mark"></span>
                    <div ewf-field-errors></div>
                </span>

                <span class="select">
                    <select id="uomDimensionId"
                       ng-options="option.key as option.title for option in packagingSettingsCtrl.dimensionUnits()
                       track by packagingSettingsCtrl.mapOptionKey(option)"
                       ng-model="packagingSettingsCtrl.singlePackage.defaultDimensions.unit"
                       ng-change="packagingSettingsCtrl.onChangeDimensionUnit('{{packagingSettingsCtrl.singlePackage.defaultDimensions.unit}}')"
                       ewf-input="packaging-popup.uomDimension"
                       ewf-validate-required>
                    </select>
                </span>

                <label class="checkbox checkbox_inline">
                    <input id="pallet_Upd" type="checkbox" class="checkbox__input"
                       data-aqa-id="pallet_Upd"
                       ng-model="packagingSettingsCtrl.singlePackage.isPallet">
                    <span class="label"
                       nls="shipment-settings.packaging_settings_popup_pallet">
                    </span>
                </label>
                <a class="info">
                    <span nls="shipment-settings.packaging_settings_popup_pallet_message"></span>
                </a>
            </div>
            <button type="submit" class="btn right"
               ewf-click="packagingSettingsCtrl.saveOrUpdate(packagingSettings, ewfFormCtrl)"
               nls="shipment-settings.packaging_settings_popup_save_button">
            </button>
        </form>
        </div>
    </div>
</div>
