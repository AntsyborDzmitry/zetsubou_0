<%@page session="false" contentType="text/html; charset=utf-8" pageEncoding="utf-8" %>
<%@include file="/apps/dhl/foundation/global.jsp"%>
<cq:setContentBundle/>

<ewf:registerComponent
        elements="ewf-package-details"
        paths="components/shipment/package-details/package-details-directive"/>

<ewf-package-details>
    <div ng-cloak ng-if="packageDetailsCtrl.initialized">
        <div class="row">
            <div class="area-wrap" id="section_package-details">
                <section class="area" ng-if="packageDetailsCtrl.editModeActive">
                    <header class="area__header">
                        <span class="right"></span>
                        <div class="row">
                            <div class="col-6">
                                <h2 class="area__title h2"><fmt:message key="package_details_title"/></h2>
                            </div>
                            <div class="col-6">
                                <a class="area-help__link right"><fmt:message key="package_details_help_me"/></a>
                            </div>
                        </div>
                    </header>
                    <div class="area__content">
                        <div>
                            <div class="package-details">
                                <div ng-if="packageDetailsCtrl.packageGeneratorOn">
                                    <div class="row package-generator" ng-form="packageGeneratorForm" ewf-form="packageGeneratorForm">
                                        <div class="form-line">
                                            <strong><fmt:message key="package_details_package_generator_title"/></strong>
                                        </div>
                                        <div class="form-line">
                                            <div class="field" ewf-field="generatorWeight">
                                                <span><fmt:message key="package_details_package_generator_weight"/></span>
                                                (<u nls="{{packageDetailsCtrl.userProfileWeightUomKey}}"></u>):&nbsp;
                                                <input type="text" class="input input_width_tiny" maxlength="5"
                                                    ng-model="packageDetailsCtrl.generator.weight"
                                                    ewf-input="packageDetails.generatorWeight"
                                                    field-name-dynamic="{{row.rowId}}"
                                                    ewf-validate-pattern="{{packageDetailsCtrl.PATTERNS.dimension}}"
                                                    ewf-validate-max-message="shipment.package_details_max_total_weight_error_message"
                                                    ewf-validate-max="{{packageDetailsCtrl.calcGeneratorMaxWeight()}}">
                                                <div ewf-field-errors></div>
                                            </div>
                                        </div>
                                        <div class="form-line">
                                            <div class="field" ewf-field="generatorQuantity">
                                                <span><fmt:message key="package_details_package_generator_number"/>:&nbsp;</span>
                                                <input type="text" class="input input_width_tiny" maxlength="5"
                                                    ng-model="packageDetailsCtrl.generator.piecesAmount"
                                                    ewf-input="packageDetailsCtrl.generatorQuantity"
                                                    field-name-dynamic="{{row.rowId}}"
                                                    ewf-validate-pattern="{{packageDetailsCtrl.PATTERNS.quantity}}"
                                                    ewf-validate-required
                                                    ewf-validate-max-message="shipment.package_details_max_total_quantity_error_message"
                                                    ewf-validate-max="{{packageDetailsCtrl.calcGeneratorMaxPiecesAmount()}}">
                                                <span class="validation-mark"></span>
                                                <div ewf-field-errors></div>
                                            </div>
                                        </div>
                                        <div class="package-item__actions form-line">
                                            <button type="button" class="btn btn_action"
                                                ng-click="packageDetailsCtrl.generateRowsWithPredefinedWeight(packageGeneratorForm, ewfFormCtrl)">
                                                <fmt:message key="package_details_package_generator_generate"/>
                                            </button>
                                        </div>
                                    </div>
                                    <hr class="hr">
                                </div>
                                <div class="package-list">
                                    <div class="package-list__header">
                                        <div class="package-item__name form-line"><fmt:message key="package_details_packaging"/></div>
                                        <div class="package-item__quantity form-line"><fmt:message key="package_details_quantity"/></div>
                                        <div class="package-item__weight form-line">
                                            <span><fmt:message key="package_details_weight"/></span>
                                            <span class="select-units" nls="{{packageDetailsCtrl.userProfileWeightUomKey}}"></span>
                                        </div>
                                        <div class="package-item__dimensions form-line">
                                            <span><fmt:message key="package_details_dimensions"/></span>
                                            <span class="select-units" nls="{{packageDetailsCtrl.userProfileDimensionsUomKey}}"></span>
                                        </div>
                                    </div>
                                </div>

                                <cq:include script="dhl-package-details-form.jsp"/>

                                <div class="package-list__footer margin-top">
                                    <div class="package-item__name form-line">
                                        <strong><fmt:message key="package_details_total"/></strong>
                                    </div>
                                    <div class="package-item__quantity package-item__summary form-line">
                                        <div class="field">
                                            <span ng-class="{'warning-text': !packageDetailsCtrl.isTotalQuantityValid()}">
                                                <strong>{{packageDetailsCtrl.totalQuantity = (packageDetailsCtrl.packagesRows | calculateTotal : 'quantity')}}</strong>
                                            </span>
                                            <div class="msg-error msg-error_static msg-error_right margin-right-none" ng-if="!packageDetailsCtrl.isTotalQuantityValid()">
                                                <fmt:message key="package_details_max_total_quantity_error_message"/>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="package-item__weight package-item__summary form-line">
                                        <div class="field-wrapper">
                                            <span ng-class="{'warning-text': !packageDetailsCtrl.isTotalWeightValid()}">
                                                <strong>{{packageDetailsCtrl.totalWeight = (packageDetailsCtrl.packagesRows | calculateTotal : 'weight' : 'quantity')}}</strong>
                                                <span nls="{{packageDetailsCtrl.userProfileWeightUomKey}}"></span>
                                            </span>
                                            <div class="msg-error msg-error_static msg-error_left" ng-if="!packageDetailsCtrl.isTotalWeightValid()">
                                                <fmt:message key="package_details_max_total_weight_error_message"/>
                                            </div>
                                        </div>
                                        <div ng-if="packageDetailsCtrl.somAreDifferent && packageDetailsCtrl.totalWeight">
                                            <small>
                                                {{packageDetailsCtrl.totalWeight | convertUomToOpposite : packageDetailsCtrl.weightConvertionReverseRate : packageDetailsCtrl.shipperCountryConversionPrecision}}
                                                <span nls="{{packageDetailsCtrl.shipperCountryWeightUomKey}}"></span>
                                            </small>
                                        </div>
                                    </div>
                                    <div class="package-item__actions form-line">
                                        <button type="button" class="btn btn_small right btn_animate" ng-click="packageDetailsCtrl.addAnotherPackage()">
                                            <span class="btn__text"><fmt:message key="package_details_add_another_package"/></span><i class="dhlicon-add"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <footer class="area__footer">
                        <span class="label-error left" ng-if="!packageDetailsCtrl.shipmentCountry"><fmt:message key="package_details_country_is_not_selected"/></span>
                        <a href="" class="btn btn_success right" ng-click="packageDetailsCtrl.onNextClick(packageDetailsForm, ewfFormCtrl)"><fmt:message key="next"/></a>
                    </footer>

                    <div class="alert alert_info" ng-show="packageDetailsCtrl.somAreDifferent">
                        <fmt:message key="package_details_convertation_message"/>
                    </div>
                </section>

                <section class="synopsis synopsis_with-icon" ng-if="!packageDetailsCtrl.editModeActive">
                    <i class="synopsis__icon dhlicon-packages"></i>
                    <button type="button" class="synopsis__edit btn btn_action" ng-click="packageDetailsCtrl.onEditClick()"><fmt:message key="edit"/></button>
                    <div ng-repeat="row in packageDetailsCtrl.packagesRows">
                        {{ row.packagingName }} - {{ row.quantity }}
                        <span><fmt:message key="package_details_piece"/></span> - {{ row.weight }} <span><fmt:message key="package_details_kg"/></span>
                        ({{ row.width }} X {{ row.height }} X {{ row.length }} <span><fmt:message key="package_details_cm"/></span>)
                    </div>
                </section>
            </div>
        </div>
    </div>
</ewf-package-details>