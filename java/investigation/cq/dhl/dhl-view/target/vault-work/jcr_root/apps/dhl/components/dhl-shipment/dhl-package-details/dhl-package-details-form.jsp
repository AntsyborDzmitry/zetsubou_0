<%@page session="false" contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
<%@include file="/apps/dhl/foundation/global.jsp"%>
<cq:setContentBundle />

<div ng-form="packageDetailsForm" ewf-form="packageDetails">
    <div class="package-item"
       ng-form="packageItemForm"
       ng-repeat="row in packageDetailsCtrl.packagesRows"
       ewf-form="packageItemForm">
        <div class="row" ng-if="row.dimensionsEditable && row.packageId !== ''">
            <div class="form-line package-item__name"></div>
            <div class="form-line package-item__quantity"></div>
            <div class="form-line package-item__weight"></div>

            <div class="package-item__dimensions form-line">
                <div class="package-item__dimensions-info">
                    <div class="field form-line input_width_small"><b>{{row.widthOriginal}}</b></div>
                    <div class="field form-line input_width_small"><b>{{row.heightOriginal}}</b></div>
                    <div class="field form-line input_width_small"><b>{{row.lengthOriginal}}</b></div>
                </div>
            </div>
        </div>

        <div class="row">
            <div class="package-item__name form-line field">
                <div ng-model="row">
                    <div class="ewf-autocomplete">
                        <div class="field" ewf-field="packagingName{{row.rowId}}">
                            <input name="packagingName" class="input input_width_full" type="text"
                               placeholder="<fmt:message key="package_details_select_packaging.placeholder"/>"
                               ng-model="row.packagingName"
                               ng-focus="packageDetailsCtrl.triggerPackagingListVisibility(row)"
                               ng-blur="packageDetailsCtrl.hideRowPackagingList(row)"
                               ng-change="packageDetailsCtrl.filteringPackagingList(row)"
                               field-name-dynamic="{{row.rowId}}"
                               ewf-input="packageDetails.packagingName{{row.rowId}}"
                               ewf-validate-required>
                            <span class="validation-mark"></span>
                            <div ewf-field-errors></div>
                            <ul class="ewf-autocomplete__list" ng-if="row.isPackagesListVisible && row.isFilteredPackagingListNotEmpty">
                                <li class="package-type" ng-mousedown="packageDetailsCtrl.pickPackage(row, package)" ng-repeat="package in packageDetailsCtrl.packagingList | filter : {name : row.packagingName}">
                                    <img ng-if="package.id" class="package-type__img-icon" ng-src="{{packageDetailsCtrl.getPackageIconUrl(package)}}">
                                    <strong class="package-type__name">{{ package.name }}</strong>
                                    <em ng-if="package.packageType !== packageDetailsCtrl.PACKAGING_TYPES.CUSTOM" class="package-type__dimensions">
                                        <span ng-if="package.units === packageDetailsCtrl.userProfileCountrySom">
                                            {{package.width}} X {{package.height}} X {{package.length}}
                                            <span nls="{{packageDetailsCtrl.uomKeys.dimensions[package.units]}}"></span>
                                        </span>
                                        <span ng-if="package.units !== packageDetailsCtrl.userProfileCountrySom">
                                            {{package.width | convertUomToOpposite : packageDetailsCtrl.dimensionConvertionRate : packageDetailsCtrl.userProfileCountryConversionPrecision}} X
                                            {{package.height | convertUomToOpposite : packageDetailsCtrl.dimensionConvertionRate : packageDetailsCtrl.userProfileCountryConversionPrecision}} X
                                            {{package.length | convertUomToOpposite : packageDetailsCtrl.dimensionConvertionRate : packageDetailsCtrl.userProfileCountryConversionPrecision}}
                                            <span nls="{{packageDetailsCtrl.userProfileDimensionsUomKey}}"></span>
                                        </span>
                                    </em>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <div class="package-item__quantity field form-line" ewf-field="quantity{{row.rowId}}">
                <input type="text" name="quantity" class="input input_width_tiny" maxlength="5"
                   ng-model="row.quantity"
                   field-name-dynamic="{{row.rowId}}"
                   ewf-input="packageDetails.quantity{{row.rowId}}"
                   ewf-validate-required
                   ewf-validate-pattern="{{packageDetailsCtrl.PATTERNS.quantity}}"
                   ewf-validate-max-message="shipment.package_details_max_quantity_validation_error"
                   ewf-validate-max="{{row.maxQuantity}}">
                <span class="validation-mark"></span>
                <div class="msg-error_right" ewf-field-errors></div>
            </div>
            <div class="package-item__weight field form-line" ewf-field="weight{{row.rowId}}">
                <div ng-if="!row.fixedWeight">
                    <input type="text" name="weight" class="input input_width_tiny" maxlength="5"
                       ng-model="row.weight"
                       ng-change="packageDetailsCtrl.updateSaveButtonState(row)"
                       field-name-dynamic="{{row.rowId}}"
                       ewf-input="packageDetails.weight{{row.rowId}}"
                       ewf-validate-pattern="{{packageDetailsCtrl.PATTERNS.dimension}}"
                       ewf-validate-max-message="shipment.package_details_max_weight_validation_error"
                       ewf-validate-max="{{row.maxWeight}}"
                       ewf-validate-required>
                    <span class="validation-mark"></span>
                    <div class="msg-error_left" ewf-field-errors></div>
                </div>
                <div ng-if="row.fixedWeight">
                    {{row.weight}}
                </div>
            </div>

            <div class="package-item__dimensions form-line">
                <div ng-if="row.dimensionsEditable">
                    <div ewf-field="width{{row.rowId}}" class="field">
                        <input type="text" name="width" class="input input_width_small" maxlength="5"
                           placeholder="<fmt:message key="package_details_width.placeholder"/>"
                           ng-model="row.width"
                           ng-change="packageDetailsCtrl.updateSaveButtonState(row)"
                           field-name-dynamic="{{row.rowId}}"
                           ewf-input="packageDetails.width{{row.rowId}}"
                           ewf-validate-pattern="{{packageDetailsCtrl.PATTERNS.dimension}}"
                           ewf-validate-required>
                        <span class="validation-mark"></span>
                        <div ewf-field-errors></div>
                        <span class="dimensions-divider"></span>
                    </div>
                    <div ewf-field="height{{row.rowId}}" class="field">
                        <input type="text" name="height" class="input input_width_small" maxlength="5"
                           placeholder="<fmt:message key="package_details_height.placeholder"/>"
                           ng-model="row.height"
                           ng-change="packageDetailsCtrl.updateSaveButtonState(row)"
                           field-name-dynamic="{{row.rowId}}"
                           ewf-input="packageDetails.height{{row.rowId}}"
                           ewf-validate-pattern="{{packageDetailsCtrl.PATTERNS.dimension}}"
                           ewf-validate-required>
                        <span class="validation-mark"></span>
                        <div ewf-field-errors></div>
                        <span class="dimensions-divider"></span>
                    </div>
                    <div ewf-field="length{{row.rowId}}" class="field">
                        <input type="text" name="length" class="input input_width_small" maxlength="5"
                           placeholder="<fmt:message key="package_details_length.placeholder"/>"
                           ng-model="row.length"
                           ng-change="packageDetailsCtrl.updateSaveButtonState(row)"
                           field-name-dynamic="{{row.rowId}}"
                           ewf-input="packageDetails.length{{row.rowId}}"
                           ewf-validate-pattern="{{packageDetailsCtrl.PATTERNS.dimension}}"
                           ewf-validate-required>
                        <span class="validation-mark"></span>
                        <div ewf-field-errors></div>
                    </div>
                </div>

                <div class="package-item__dimensions-info" ng-if="packageDetailsCtrl.showReadOnlyDimensions(row)">
                    <strong>{{row.width}}</strong>
                    <small>x</small>
                    <strong>{{row.height}}</strong>
                    <small>x</small>
                    <strong>{{row.length}}</strong>
                </div>

                <div class="package-item__fixed-weight-msg" ng-if="!row.dimensionsEditable && row.fixedWeight">
                    <span>{{packageDetailsCtrl.generateFixedWeightMsg(row)}}</span>
                </div>

                <label class="checkbox checkbox_small" ng-if="row.packageType === packageDetailsCtrl.PACKAGING_TYPES.CUSTOM">
                    <input id="known_dimensions_{{$index}}" type="checkbox" class="checkbox__input" name="knownDimensions_{{$index}}"
                       data-aqa-id="known_dimensions_{{$index}}"
                       ng-model="row.knownDimensions"
                       ng-change="packageDetailsCtrl.onKnownDimensionsChange(row)">
                    <span class="label">I know my package dimensions</span>
                </label>
            </div>

            <div class="package-item__actions form-line">
                <button type="button" class="btn btn_action"
                   ng-if="packageDetailsCtrl.isAuthorized"
                   ng-disabled="!row.isSaveButtonAvailable"
                   ng-click="packageDetailsCtrl.handleSaveAction(row, packageItemForm, ewfFormCtrl)">
                    <span ng-hide="row.saved">
                        <i class="dhlicon-save"></i>
                        <span class="btn__text" nls="shipment.package_details_save_button"></span>
                    </span>
                    <span ng-show="row.saved">
                        <i class="dhlicon-check"></i>
                        <span class="btn__text" nls="shipment.package_details_packaging_saved"></span>
                    </span>
                </button>
                <button type="button" class="btn btn_action"
                   ng-show="packageDetailsCtrl.packagesRows.length > 1"
                   ng-click="packageDetailsCtrl.deletePackageRow(row)">
                    <i class="dhlicon-remove"></i> <span><fmt:message key="package_details_delete"/></span>
                </button>
                <button type="button" class="btn btn_action"
                   ng-disabled="!packageDetailsCtrl.isQuantityCorrectForCopy(row)"
                   ng-click="packageDetailsCtrl.copyPackageRow(row)">
                    <i class="dhlicon-copy"></i> <span><fmt:message key="package_details_copy"/></span>
                </button>
            </div>
        </div>

        <!-- Converted values-->
        <div class="row"
           ng-if="packageDetailsCtrl.isConvertedValuesVisible(row)">
            <div class="form-line package-item__name"></div>
            <div class="form-line package-item__quantity"></div>
            <div class="form-line package-item__weight">
                <small ng-if="row.weight">
                    {{row.weight | convertUomToOpposite : packageDetailsCtrl.weightConvertionReverseRate : packageDetailsCtrl.shipperCountryConversionPrecision}}
                    <span nls="{{packageDetailsCtrl.shipperCountryWeightUomKey}}"></span>
                </small>
            </div>

            <div class="package-item__dimensions form-line">
                <div ng-if="row.dimensionsEditable" class="package-item__dimensions-info">
                    <div class="package-item__dimension-converted">
                        <small class="input_width_small" ng-if="row.width">
                            {{row.width | convertUomToOpposite : packageDetailsCtrl.dimensionConvertionReverseRate : packageDetailsCtrl.shipperCountryConversionPrecision}}
                            <span nls="{{packageDetailsCtrl.shipperCountryDimensionsUomKey}}"></span>
                        </small>
                    </div>
                    <div class="package-item__dimension-converted">
                        <small class="input_width_small" ng-if="row.height">
                            {{row.height | convertUomToOpposite : packageDetailsCtrl.dimensionConvertionReverseRate : packageDetailsCtrl.shipperCountryConversionPrecision}}
                            <span nls="{{packageDetailsCtrl.shipperCountryDimensionsUomKey}}"></span>
                        </small>
                    </div>
                    <div class="package-item__dimension-converted">
                        <small class="input_width_small" ng-if="row.length">
                            {{row.length | convertUomToOpposite : packageDetailsCtrl.dimensionConvertionReverseRate : packageDetailsCtrl.shipperCountryConversionPrecision}}
                            <span nls="{{packageDetailsCtrl.shipperCountryDimensionsUomKey}}"></span>
                        </small>
                    </div>
                </div>

                <div ng-if="!row.dimensionsEditable && row.packageId !== ''" class="package-item__dimensions-info">
                    <div ng-if="packageDetailsCtrl.somAreDifferent">
                        <small>
                            {{row.width | convertUomToOpposite : packageDetailsCtrl.dimensionConvertionReverseRate : packageDetailsCtrl.shipperCountryConversionPrecision}}
                            <span nls="{{packageDetailsCtrl.shipperCountryDimensionsUomKey}}"></span>
                            <span>x</span>
                            {{row.height | convertUomToOpposite : packageDetailsCtrl.dimensionConvertionReverseRate : packageDetailsCtrl.shipperCountryConversionPrecision}}
                            <span nls="{{packageDetailsCtrl.shipperCountryDimensionsUomKey}}"></span>
                            <span>x</span>
                            {{row.length | convertUomToOpposite : packageDetailsCtrl.dimensionConvertionReverseRate : packageDetailsCtrl.shipperCountryConversionPrecision}}
                            <span nls="{{packageDetailsCtrl.shipperCountryDimensionsUomKey}}"></span>
                        </small>
                    </div>
                
                    <div ng-if="!packageDetailsCtrl.somAreDifferent">
                        {{row.width}}
                        <small>x</small>
                        {{row.height}}
                        <small>x</small>
                        {{row.length}}
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>