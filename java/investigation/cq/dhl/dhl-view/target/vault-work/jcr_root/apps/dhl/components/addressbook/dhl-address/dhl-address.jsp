<%@page session="false" contentType="text/html; charset=utf-8" pageEncoding="utf-8" %>
<%@include file="/apps/dhl/foundation/global.jsp"%>
<cq:setContentBundle source="page"/>

<slice:lookup var="componentProperties" appName="dhlApp" type="<%=com.dhl.components.model.ComponentProperties.class%>" />

<c:set var="from" value="${componentProperties.parentController}.FROM"/>
<c:set var="to" value="${componentProperties.parentController}.TO"/>

<ewf:registerComponent paths="directives/ewf-address/ewf-address-cq-directive" />

<!-- TODO: Do we need to move it to the separate file? It's so tiny...  -->
<script type="text/ng-template" id="address-item.html">
    <div class="typeahead-group-header" ng-if="match.model.firstInGroup">{{match.model.group}}</div>
    <a>
        <span bind-html-unsafe="match.model.fullAddress | typeaheadHighlight:query"></span>
    </a>
</script>
<script type="text/ng-template" id="address-country.html">
    <a>
        <span>{{match.model.name}}<i class="flag flag_{{match.model.code2}}"></i></span>
    </a>
</script>
<script type="text/ng-template" id="zipTypeaheadTemplate.html">
    <a>
        <span bind-html-unsafe="match.label | typeaheadHighlight:query"></span>
        <span>{{match.model.city}}, </span>
        <span>{{match.model.stateName}}</span>
    </a>
</script>
<script type="text/ng-template" id="cityTypeaheadTemplate.html">
    <a>
        <span>{{match.model.postalCode}}</span>
        <span bind-html-unsafe="(match.label | typeaheadHighlight:query) + ','"></span>
        <span>{{match.model.stateName}}</span>
    </a>
</script>

<ewf-address
   address="${componentProperties.parentControllerObject}"
   form="address"
   pre-id="${componentProperties.ewfAddressIdSuffix}"
   set-residential-flag-from-profile="${properties.setResidentialFlagFromProfile}">
    <ng-form novalidate name="contactDetailsAddress" ewf-form="addressDefinition" autocomplete="off">
        <div class="row">
            <c:if test="${isUserProfileBookPage != null}">
            <div class="col-3">
                <div class="field-wrapper" ewf-field="title">
                    <label for="country-select" class="label"><fmt:message key="address__title"/></label>
                    <span class="select select_width_full" id="title">
                        <select id="country-select"
                           ng-model="addressCtrl.attributes.address.title"
                           ng-options="title.value as title.name for title in addressCtrl.attributes.address.titleOptions">
                        </select>
                    </span>
                    <span class="validation-mark"></span>
                    <div ewf-field-errors></div>
                </div>
            </div>
            <div class="col-9">
                </c:if>
                <div class="field-wrapper" ewf-field="fullName" ng-if="!ewfFormCtrl.hideRules.fullName" ewf-search="{searchType: 'ordered', fieldName: 'name', queryParams: {priority: ${properties.showAheadFrom ? "'favoriteShipFrom'" : "'favoriteShipTo'"}}}">
                    <label for="fullName" class="label"><fmt:message key="address__name_label"/></label>
                    <input maxlength="35" type="text" class="input input_width_full" name="fullName" id="fullName" autocomplete="off"
                       ewf-input="contactDetailsAddress.fullName"
                       ng-model="addressCtrl.attributes.address.name"
                       ewf-validate-required
                       <c:if test="${properties.showAheadFrom || properties.showAheadTo}">
                          typeahead="addr as addr.name for addr in ewfSearchCtrl.typeAheadSearch($viewValue, ewfSearchCtrl.searchCategory)"
                          typeahead-template-url="ewf-shipment-search-item.html"
                          typeahead-wait-ms="500"
                          typeahead-on-select="${componentProperties.parentController}.addressBookSelected($model.data, ${properties.showAheadFrom ? from : properties.showAheadTo ? to : ""})"
                       </c:if>
                       <c:if test="${componentProperties.showNickNameField}" >
                           ng-change="addressCtrl.nicknameGenerator()"
                       </c:if>>
                    <span class="validation-mark"></span>
                    <div ewf-field-errors></div>
                    <c:if test="${componentProperties.showAddressBookButton}">
                        <div id="modals" class="visible" ng-cloak="" ng-if="addressCtrl.showPopup">
                            <div id="modal-bg"></div>

                            <div class="modal full-width visible" id="modal_address-book">
                                <div>
                                    <cq:include path="addressbook" resourceType="dhl/components/addressbook/dhl-address-book" />
                                </div>
                                <a class="x-button close-modal" ng-click="addressCtrl.showPopup = false"></a>
                            </div>
                        </div>

                        <button type="button" class="btn btn_addon btn_animate" ng-click="addressCtrl.showPopup = true">
                            <span class="btn__text"><fmt:message key="address__address_book_button"/></span><i class="dhlicon-address-book"></i>
                        </button>
                    </c:if>
                </div>
                <c:if test="${isUserProfileBookPage != null}">
            </div>
            </c:if>
        </div>
        <div class="field-wrapper" ewf-field="companyName">
            <label for="company" class="label"><fmt:message key="address__company_label"/></label>
            <input type="text" class="input input_width_full" name="companyName" id="companyName" maxlength="35"
               ng-model="addressCtrl.attributes.address.company"
               ng-if="addressCtrl.attributes.address.addressDetails.residentialAddress"
               <c:if test="${componentProperties.showNickNameField}" >
                   ng-change="addressCtrl.nicknameGenerator()"
               </c:if>>
            <input type="text" class="input input_width_full" name="companyName" id="companyName" maxlength="35"
               ng-model="addressCtrl.attributes.address.company"
               ng-if="!addressCtrl.attributes.address.addressDetails.residentialAddress"
               ewf-input="contactDetailsAddress.companyName"
               ewf-validate-required
               <c:if test="${componentProperties.showNickNameField}" >
                   ng-change="addressCtrl.nicknameGenerator()"
               </c:if>>
            <div ewf-field-errors></div>
        </div>

        <c:if test="${componentProperties.showNickNameField}" >
            <div class="field-wrapper" ewf-field="nickname" ng-if="(addressCtrl.preId !== 'from') && (addressCtrl.preId !=='to')">
                <label for="contactID" class="label"><fmt:message key="address__nickname_label"/></label>
                <input type="text" class="input input_width_full" name="nickname" id="nickname" maxlength="135"
                   ewf-input="contactDetailsAddress.nickname"
                   ng-model="addressCtrl.attributes.address.nickname"
                   ewf-validate-required>
                <span class="validation-mark"></span>
                <div ewf-field-errors></div>
            </div>
        </c:if>
        <div id="contactAE">
            <div class="field-wrapper" ewf-field="country">
                <label for="country-input" class="label">
                    <fmt:message key="address__country_label"/>
                    <c:if test="${isUserProfileBookPage}"><a class="info"><div>Country must be changed by DHL.</div></a></c:if>
                </label>
                <input class="is-hidden" type="text" ng-model="addressCtrl.attributes.address.addressDetails.countryCode">
                <input id="country-input" class="input input_width_full dropdown-component" name="address" type="text" autocomplete="off"
                    <c:if test="${isUserProfileBookPage != null}">
                   disabled
                    </c:if>
                   ng-model="addressCtrl.attributes.address.addressDetails.countryName"
                   typeahead="country.name for country in addressCtrl.attributes.address.countries | filter : { name: $viewValue }"
                   typeahead-template-url="address-country.html"
                   typeahead-min-length="2"
                   typeahead-on-select="addressCtrl.onCountrySelect($item, ewfFormCtrl)"
                   ewf-input="contactDetailsAddress.country"
                   ewf-validate-required>
                <span class="validation-mark"></span>
                <div ewf-field-errors></div>
            </div>
        </div>
        <div class="field-group" ng-if="addressCtrl.attributes.address.addressDetails.countryCode">
            <div class="row">
                <div class="field-wrapper" ewf-field="address">
                    <label for="address" class="label"><fmt:message key="address__address_label"/></label>
                    <input type="text" class="input input_width_full" name="address" id="address"
                       ng-model="addressCtrl.attributes.address.addressDetails.addrLine1"
                       typeahead="address as address.name for address in addressCtrl.getAddresses($viewValue)"
                       typeahead-template-url="address-item.html"
                       typeahead-min-length="2"
                       typeahead-on-select="addressCtrl.addressSelected($item, $model, $label)"
                       ewf-input="contactDetailsAddress.address"
                       ${componentProperties.address_required ? ' ewf-validate-required' : ''}>
                    <span class="validation-mark"></span>
                    <div ewf-field-errors></div>
                </div>
            </div>
            <div class="row">
                <div class="field-wrapper" ewf-field="address2" ng-if="!ewfFormCtrl.hideRules.address2">
                    <label for="address2" class="label"><fmt:message key="address__address2_label"/></label>
                    <input type="text" class="input input_width_full" name="address2" id="address2" maxlength="35"
                       ng-model="addressCtrl.attributes.address.addressDetails.addrLine2"
                       ewf-input="contactDetailsAddress.address2"
                       ${componentProperties.address2_required ? 'ewf-validate-required' : ''}>
                    <span class="validation-mark"></span>
                    <div ewf-field-errors></div>
                </div>
            </div>
            <div class="row">
                <div class="field-wrapper" ewf-field="address3" ng-if="!ewfFormCtrl.hideRules.address3">
                    <label for="address3" class="label"><fmt:message key="address__address3_label"/></label>
                    <input type="text" class="input input_width_full" name="address3" id="address3" maxlength="35"
                       ng-model="addressCtrl.attributes.address.addressDetails.addrLine3"
                       ewf-input="contactDetailsAddress.address3"
                       ${componentProperties.address3_required ? 'ewf-validate-required' : ''}>
                    <span class="validation-mark"></span>
                    <div ewf-field-errors></div>
                </div>
            </div>
            <div class="row">
                <div class="field-wrapper" ewf-field="province" ng-if="!ewfFormCtrl.hideRules.province">
                    <label for="province" class="label"><fmt:message key="address__province_label"/></label>
                    <input type="text" class="input input_width_full" name="province" id="province"
                       ng-model="addressCtrl.attributes.address.addressDetails.stateOrProvince"
                       ewf-input="contactDetailsAddress.province"
                       ${componentProperties.provinceRequired ? 'ewf-validate-required' : ''}>
                    <span class="validation-mark"></span>
                    <div ewf-field-errors></div>
                </div>
            </div>
            <div class="row">
                <div class="field-wrapper col-3" ewf-field="zip" ng-if="!ewfFormCtrl.hideRules.zip">
                    <label for="zip" class="label"><fmt:message key="address__zip_code_label"/></label>
                    <input type="text" class="input input_width_full" name="zip" id="zip"
                       ng-model="addressCtrl.attributes.address.addressDetails.zipOrPostCode"
                       ewf-input="contactDetailsAddress.zip"
                       ${componentProperties.zip_code_required ? ' ewf-validate-required' : ''}
                       <c:if test="${componentProperties.isZipAndCityAutocompleteEnabled}">
                              typeahead="zip as zip.postalCode for zip in addressCtrl.getZipCodes($viewValue)"
                              typeahead-on-select="addressCtrl.zipCodeOrCitySelected($item)"
                              typeahead-template-url="zipTypeaheadTemplate.html"
                       </c:if>>
                    <span class="validation-mark"></span>
                    <div ewf-field-errors></div>
                </div>
                <div class="field-wrapper col-5" ewf-field="code" ng-if="!ewfFormCtrl.hideRules.code">
                    <label for="postal" class="label"><fmt:message key="address__postal_code_label"/></label>
                    <input type="text" class="input input_width_full" name="postal" id="postal"
                       ng-model="addressCtrl.attributes.address.addressDetails.zipOrPostCode"
                       ewf-input="contactDetailsAddress.code"
                       ${componentProperties.postal_code_required ? ' ewf-validate-required' : ''}
                       <c:if test="${componentProperties.isZipAndCityAutocompleteEnabled}">
                              typeahead="zip as zip.postalCode for zip in addressCtrl.getZipCodes($viewValue)"
                              typeahead-on-select="addressCtrl.zipCodeOrCitySelected($item)"
                              typeahead-template-url="zipTypeaheadTemplate.html"
                       </c:if>>
                    <span class="validation-mark"></span>
                    <div ewf-field-errors></div>
                </div>
                <div class="field-wrapper col-4" ewf-field="city" ng-if="!ewfFormCtrl.hideRules.city">
                    <label for="city" class="label"><fmt:message key="address__city_label"/></label>
                    <input type="text" class="input input_width_full" name="city" id="city"
                       ng-model="addressCtrl.attributes.address.addressDetails.city"
                       ewf-input="contactDetailsAddress.city"
                       ${componentProperties.city_required ? ' ewf-validate-required' : ''}
                       <c:if test="${componentProperties.isZipAndCityAutocompleteEnabled}">
                              typeahead="city as city.city for city in addressCtrl.getCities($viewValue)"
                              typeahead-on-select="addressCtrl.zipCodeOrCitySelected($item)"
                              typeahead-template-url="cityTypeaheadTemplate.html"
                       </c:if>>
                    <span class="validation-mark"></span>
                    <div ewf-field-errors></div>
                </div>
                <div class="field-wrapper col-5" ewf-field="state" ng-if="!ewfFormCtrl.hideRules.state">
                    <label for="state" class="label"><fmt:message key="address__state_label"/></label>
                    <input type="text" class="input input_width_full" name="state" id="state"
                       ng-model="addressCtrl.attributes.address.addressDetails.stateOrProvince"
                       ewf-input="contactDetailsAddress.state"
                       ${componentProperties.state_required? ' ewf-validate-required' : ''}>
                    <span class="validation-mark"></span>
                    <div ewf-field-errors></div>
                </div>
            </div>
        </div>
        <label class="checkbox" ng-if="addressCtrl.isResidentialFlagVisible()">
            <input type="checkbox" id="{{'checkbox_residentialAddress'+addressCtrl.preId}}" class="checkbox__input" name="residentialAddress"
               ng-model="addressCtrl.attributes.address.addressDetails.residentialAddress"
               ng-if="!ewfFormCtrl.hideRules.residential"
               data-aqa-id="{{'checkbox_residentialAddress'+addressCtrl.preId}}">
            <span class="label checkbox__label" ng-if="!ewfFormCtrl.hideRules.residential">
                <fmt:message key="address__residential_address_checkbox"/>
            </span>
        </label>
    </ng-form>
</ewf-address>
