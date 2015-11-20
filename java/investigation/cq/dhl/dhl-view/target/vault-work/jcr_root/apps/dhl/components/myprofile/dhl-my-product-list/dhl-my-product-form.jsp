<%@include file="/apps/dhl/foundation/global.jsp"%>
<ewf:registerComponent
    paths="directives/ewf-form/ewf-form-directive,
        directives/ewf-validate/ewf-validate-attribute-directive"/>

<script type="text/ng-template" id="dhl-my-product-country.html">
    <a>
        <span>{{match.model.name}}<i class="flag flag_{{match.model.code2}}"></i></span>
    </a>
</script>

<div class="row">
    <div class="col-6">
        <h3 class="margin-none">
            <span ng-if="myProductFormCtrl.isEditMode">
                <fmt:message key="my_product_form_title_edit"/>
            </span>
            <span ng-if="!myProductFormCtrl.isEditMode">
                <fmt:message key="my_product_form_title_add"/>
            </span>
        </h3>
    </div>
    <div class="col-6">
        <a class="right"
           data-aqa-id="back_to_list"
           ng-click="myProductFormCtrl.cancelForm(ewfFormCtrl, myProductForm)">
            <i class="dhlicon-carat-left"></i>
            <fmt:message key="my_product_form_back"/>
        </a>
    </div>
</div>
<form name="myProductForm" autocomplete="off"
   ewf-form="myProduct">
    <div class="overlay-grey">
        <div ewf-form-errors></div>
        <div class="row margin-top">
            <div class="field-wrapper col-6"
               ewf-field="name">
                <label class="label" for="my-product-name">
                    <fmt:message key="my_product_form_item_name"/>
                </label>
                <input type="text" class="input input_width_full" id="my-product-name"
                   data-aqa-id="product_name"
                   ng-model="myProductFormCtrl.product.name"
                   ewf-input="myProductForm.name"
                   ewf-validate-required>

                <span class="validation-mark"></span>
                <div ewf-field-errors></div>
            </div>
        </div>

        <div class="row">
            <div class="field-wrapper col-5"
               ewf-field="description">
                <label class="label" for="my-product-description">
                    <fmt:message key="my_product_form_item_description"/>
                    <a class="info">
                        <span>
                            <fmt:message key="my_product_form_item_description_info_title"/><br>
                            <fmt:message key="my_product_form_item_description_info1"/><br>
                            <fmt:message key="my_product_form_item_description_info2"/><br>
                            <fmt:message key="my_product_form_item_description_info3"/><br>
                            <i><fmt:message key="my_product_form_item_description_example"/></i>
                        </span>
                    </a>
                </label>
                <input type="text" class="input input_width_full" id="my-product-description"
                   data-aqa-id="product_description"
                   ng-model="myProductFormCtrl.product.description"
                   ewf-input="myProductForm.description"
                   ewf-validate-required>

                <span class="validation-mark"></span>
                <div ewf-field-errors></div>
            </div>
            <div class="field field_width_full field-wrapper col-3"
               ewf-field="commodityCode">
                <label class="label" for="my-product-commodity-code">
                    <fmt:message key="my_product_form_export_commodity_code"/>
                </label>
                <input type="text" class="input" id="my-product-commodity-code"
                   data-aqa-id="export_commodity_code"
                   ng-model="myProductFormCtrl.product.exportCommodityCode"
                   ewf-input="myProductForm.commodityCode"
                   ewf-validate-required>

                <button class="btn btn_addon" type="button">
                    <i class="dhlicon-search"></i>
                </button>

                <span class="validation-mark"></span>
                <div ewf-field-errors></div>
            </div>
            <div class="field-wrapper col-4"
               ewf-field="countryCode">
                <label class="label" for="my-product-country">
                    <fmt:message key="my_product_form_country"/>
                    <a class="info">
                        <span><fmt:message key="my_product_form_country_info"/></span>
                    </a>
                </label>
                <input id="my-product-country" class="input input_width_full dropdown-component" autocomplete="off"
                   data-aqa-id="country_name"
                   ng-model="myProductFormCtrl.product.countryName"
                   ng-keydown="myProductFormCtrl.clearCountryCode(myProductFormCtrl.product, $event)"
                   typeahead="country as countries.name for countries in myProductFormCtrl.availableLocations | filter: $viewValue"
                   typeahead-template-url="dhl-my-product-country.html"
                   typeahead-min-length="2"
                   typeahead-select-on-exact="true"
                   typeahead-editable="false"
                   typeahead-on-select="myProductFormCtrl.productCountryTypeaheadOnSelect($item)"
                   ewf-input="myProductForm.countryCode"
                   ewf-validate-required
                   ewf-validate-attribute
                   ewf-validate-attribute-valid="myProductFormCtrl.product.countryCode"
                   ewf-validate-attribute-message="errors.invalid_value">
                <span class="validation-mark"></span>
                <div ewf-field-errors></div>
            </div>
        </div>
        <div class="row">
            <div class="field-wrapper col-2"
               ewf-field="quantity">
                <label class="label" for="my-product-qty">
                    <fmt:message key="my_product_form_quantity"/>
                    <a class="info">
                        <span>
                            <fmt:message key="my_product_form_quantity_info1"/><br>
                            <fmt:message key="my_product_form_quantity_info2"/>
                        </span>
                    </a>
                </label>
                <input type="text" id="my-product-qty" class="input input_width_full"
                   data-aqa-id="product_quantity"
                   ng-model="myProductFormCtrl.product.quantity"
                   ewf-input="myProductForm.quantity"
                   ewf-validate-required
                   ewf-validate-pattern="POSITIVE_NUMBER">
                <span class="validation-mark"></span>
                <div ewf-field-errors></div>
            </div>

            <div class="col-2">
                <label class="label" for="my-product-quantity-unit">
                    <fmt:message key="my_product_form_units"/>
                </label>
                <div class="select"
                   ewf-field="itemUnit">
                    <select id="my-product-quantity-unit"
                       data-aqa-id="item_unit"
                       ng-model="myProductFormCtrl.product.itemUnit"
                       ewf-input="myProductForm.itemUnit"
                       ewf-validate-required>
                        <option value=""><fmt:message key="my_product_form_default_select"/></option>
                        <option value="CUBIC_METERS"><fmt:message key="cubic_meters"/></option>
                        <option value="DOZEN"><fmt:message key="dozen"/></option>
                        <option value="GRAMS"><fmt:message key="grams"/></option>
                        <option value="GROSS"><fmt:message key="gross"/></option>
                        <option value="KILOGRAMS"><fmt:message key="kilograms"/></option>
                        <option value="LITERS"><fmt:message key="liters"/></option>
                        <option value="METERS"><fmt:message key="meters"/></option>
                        <option value="NUMBER"><fmt:message key="number"/></option>
                        <option value="PAIR"><fmt:message key="pair"/></option>
                        <option value="PIECES"><fmt:message key="pieces"/></option>
                        <option value="DOZEN_PIECES"><fmt:message key="dozen_pieces"/></option>
                        <option value="SQUARE_METERS"><fmt:message key="square_meters"/></option>
                        <option value="SQUARE_CENTIMETERS"><fmt:message key="square_centimeters"/></option>
                        <option value="NO_UNIT_REQUIRED"><fmt:message key="no_unit_required"/></option>
                        <option value="CENTIGRAM"><fmt:message key="centigram"/></option>
                        <option value="CENTIMETERS"><fmt:message key="centimeters"/></option>
                        <option value="CUBIC_CENTIMETERS"><fmt:message key="cubic_centimeters"/></option>
                        <option value="CUBIC_FEET"><fmt:message key="cubic_feet"/></option>
                        <option value="EACH"><fmt:message key="each"/></option>
                        <option value="GALLONS"><fmt:message key="gallons"/></option>
                        <option value="MILLIGRAMS"><fmt:message key="milligrams"/></option>
                        <option value="MILLILITERS"><fmt:message key="milliliters"/></option>
                        <option value="OUNCES"><fmt:message key="ounces"/></option>
                        <option value="POUNDS"><fmt:message key="pounds"/></option>
                        <option value="SQUARE_FEET"><fmt:message key="square_feet"/></option>
                        <option value="SQUARE_INCHES"><fmt:message key="square_inches"/></option>
                        <option value="SQUARE_YARDS"><fmt:message key="square_yards"/></option>
                        <option value="YARDS"><fmt:message key="yards"/></option>
                    </select>
                    <span class="validation-mark"></span>
                </div>
            </div>

            <div class="field-wrapper col-2"
               ewf-field="value">
                <label class="label" for="my-product-value">
                    <fmt:message key="my_product_form_item_value"/>
                    <a class="info">
                        <span>
                            <fmt:message key="my_product_form_item_value_info1"/><br>
                            <fmt:message key="my_product_form_item_value_info2"/>
                        </span>
                    </a>
                </label>
                <input type="text" id="my-product-value" placeholder="0.00" class="input input_width_full"
                   data-aqa-id="product_value"
                   ng-model="myProductFormCtrl.product.value"
                   ewf-input="myProductForm.value"
                   ewf-validate-required
                   ewf-validate-pattern="POSITIVE_NUMBER">
                <span class="validation-mark"></span>

                <select class="select-units"
                   data-aqa-id="product_currency"
                   ng-model="myProductFormCtrl.product.currency"
                   ng-options="currency.key as currency.value for currency in myProductFormCtrl.currencyList">
                </select>
                <div ewf-field-errors></div>
            </div>
            <div>
                <div class="field-wrapper col-2 offset-1 margin-right"
                   ewf-field="netWeight">
                    <label class="label" for="my-product-net-weight">
                        <fmt:message key="my_product_form_net_weight"/>
                        <a class="info">
                            <span>
                                <fmt:message key="my_product_form_net_weight_info1"/><br>
                                <fmt:message key="my_product_form_net_weight_info2"/>
                            </span>
                        </a>
                    </label>
                    <input type="text" id="my-product-net-weight" class="input input_width_full"
                       data-aqa-id="net_weight"
                       ng-model="myProductFormCtrl.product.netWeight"
                       ewf-input="myProductForm.netWeight"
                       ewf-validate-required
                       ewf-validate-pattern="POSITIVE_NUMBER">
                    <span class="validation-mark"></span>

                    <select class="select-units"
                       data-aqa-id="net_weight_units"
                       ng-disabled="!myProductFormCtrl.hasUnitsList"
                       ng-model="myProductFormCtrl.product.weightUnits">
                        <option value="KG"><fmt:message key="kg"/></option>
                        <option value="LB"><fmt:message key="lb"/></option>
                    </select>

                    <div ewf-field-errors></div>
                </div>
                <div class="field-wrapper col-2 margin-left"
                   ewf-field="grossWeight">
                    <label class="label" for="my-product-gross-weight">
                        <fmt:message key="my_product_form_gross_weight"/>
                        <a class="info">
                            <span>
                                <fmt:message key="my_product_form_gross_weight_info1"/><br>
                                <fmt:message key="my_product_form_gross_weight_info2"/>
                            </span>
                        </a>
                    </label>
                    <input type="text" id="my-product-gross-weight" class="input input_width_full"
                       data-aqa-id="gross_weight"
                       ng-model="myProductFormCtrl.product.grossWeight"
                       ewf-input="myProductForm.grossWeight"
                       ewf-validate-required
                       ewf-validate-pattern="POSITIVE_NUMBER">
                    <span class="validation-mark"></span>

                    <select class="select-units"
                       data-aqa-id="gross_weight_units"
                       ng-disabled="!myProductFormCtrl.hasUnitsList"
                       ng-model="myProductFormCtrl.product.weightUnits">
                        <option value="KG"><fmt:message key="kg"/></option>
                        <option value="LB"><fmt:message key="lb"/></option>
                    </select>

                    <div ewf-field-errors></div>
                </div>
            </div>
        </div>

        <div class="row">
            <label class="checkbox col-4">
                <input type="checkbox" class="checkbox__input"
                   data-aqa-id="is_importing"
                   ng-model="myProductFormCtrl.product.importProduct">
                <span class="label">
                    <fmt:message key="my_product_form_will_import"/>
                </span>
            </label>
        </div>

        <div class="row">
            <div ng-if="myProductFormCtrl.product.importProduct">
                <div ng-repeat="commodityCodeItem in myProductFormCtrl.product.importCommodityCodesList track by $index">
                    <div class="col-4">
                        <label class="label">
                            <fmt:message key="my_product_form_import_commodity_code"/>
                        </label>
                    </div>
                    <div class="col-6">
                        <label class="label">
                            <fmt:message key="my_product_form_import_origin_country"/>
                        </label>
                    </div>
                    <div class="row">
                        <div class="col-4 field field_width_full field-wrapper">
                            <input type="text" class="input"
                               data-aqa-id="commodity_code_name{{$index}}"
                               ng-model="commodityCodeItem.commodityCode">
                            <button class="btn btn_addon">
                                <i class="dhlicon-search"></i>
                            </button>
                        </div>
                        <div class="col-4 field field_width_full field-wrapper">
                            <input class="input input_width_full dropdown-component" autocomplete="off"
                               data-aqa-id="origin_country_code{{$index}}"
                               ng-model="commodityCodeItem.countryName"
                               ng-keydown="myProductFormCtrl.clearCountryCode(commodityCodeItem, $event)"
                               typeahead="country as countries.name for countries in myProductFormCtrl.availableLocations | filter: $viewValue"
                               typeahead-template-url="dhl-my-product-country.html"
                               typeahead-min-length="2"
                               typeahead-editable="false"
                               typeahead-select-on-exact="true"
                               typeahead-on-select="myProductFormCtrl.countryTypeaheadOnSelect($item, $index)"
                               ewf-input="commodityCodeItem.countryName"
                               ewf-validate-required
                               ewf-validate-attribute
                               ewf-validate-attribute-valid="commodityCodeItem.countryCode"
                               ewf-validate-attribute-message="errors.invalid_value">
                        </div>
                        <div class="col-4 field field_width_full field-wrapper"
                           ng-if="myProductFormCtrl.canShowRemoveButton()">
                            <button class="btn btn_action"
                               data-aqa-id="remove_commodity_code"
                               ng-click="myProductFormCtrl.removeCommodityCode($index)">
                                <i class="dhlicon-remove"></i>
                                <fmt:message key="my_product_form_remove_btn"/>
                            </button>
                        </div>
                    </div>
                </div>
                <button class="btn btn_small"
                   data-aqa-id="new_commodity_code"
                   ng-disabled="!myProductFormCtrl.canAddCommodityCode()"
                   ng-click="myProductFormCtrl.addNewCommodityCode()">
                    <i class="dhlicon-add"></i>
                    <span class="btn__text">
                        <fmt:message key="my_product_form_add_import_code"/>
                    </span>
                </button>
            </div>
        </div>
    </div>

    <div class="row margin-top">
        <label for="my-product-notes" class="label">
            <fmt:message key="my_product_form_notes"/>
        </label>
        <textarea class="textarea textarea_width_full" id="my-product-notes"
           data-aqa-id="product_notes"
           ng-model="myProductFormCtrl.product.notes"></textarea>
    </div>
    <div class="row margin-top right">
        <a data-aqa-id="cancel_form"
           ng-click="myProductFormCtrl.cancelForm(ewfFormCtrl, myProductForm)">
            <fmt:message key="my_product_form_cancel_btn"/>
        </a>&nbsp;
        <button class="btn"
           data-aqa-id="update_product"
           ng-if="myProductFormCtrl.isEditMode"
           ng-click="myProductFormCtrl.updateProduct(ewfFormCtrl, myProductForm)">
            <fmt:message key="my_product_form_update_btn"/>
        </button>
        <button class="btn"
           data-aqa-id="add_product"
           ng-if="!myProductFormCtrl.isEditMode"
           ng-click="myProductFormCtrl.addProduct(ewfFormCtrl, myProductForm)">
            <fmt:message key="my_product_form_add_btn"/>
        </button>
    </div>
</form>
