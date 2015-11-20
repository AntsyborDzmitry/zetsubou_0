<%@page session="false" contentType="text/html; charset=utf-8" pageEncoding="utf-8" %>
<%@include file="/apps/dhl/foundation/global.jsp"%>
<cq:setContentBundle/>
<slice:lookup var="model" appName="dhlApp" type="<%=com.dhl.components.model.BasePageModel.class%>" />

<ewf:registerComponent
        elements="ewf-my-profile"
        paths="directives/ewf-my-profile/ewf-my-profile-directive,
            directives/ewf-location/ewf-location-directive"/>

<header class="header">
    <div class="container"><div class="header__container">

        <nav class="top-bar" id="eyebrowNav">
            <div class="header__logo">
                <a>DHL</a>
            </div>
            <div class="country-selector" id="country">
                <div class="country">
                    <div class="country__current">
                        <i class="country__current-flag flag flag_${model.countryCss}"></i>
                        <%--TODO: List of countries in GREF(DHL service) and Adobe AEM(eWF) is different. We need to think about its synchronisation--%>
                        <ul class="country__list"
                            ewf-location>
                            <li class="country__item"
                                ng-repeat="countryInfo in locationCtrl.availableLocations">
                                <a class="country__link"
                                   ng-click="locationCtrl.logInAnotherCountry(countryInfo.code3)">
                                    {{countryInfo.capitalizedName}}
                                    <i class="country__flag flag"
                                       ng-class="countryInfo.flag"></i>
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="country-selector__lang" id="languages">
                    <a href="#" class="is-selected">${model.languageName}</a>
                </div>
            </div>

            <ul class="top-nav top-nav_tiny">
                <li class="top-nav__item">
                    <a class="top-nav__link" href="">Help Center</a>
                </li>
                <li class="top-nav__item">
                    <a class="top-nav__link" href="">Locations</a>
                </li>
            </ul>
        </nav>

        <nav class="nav-bar">
            <ul class="top-nav top-nav_main">
                <li class="top-nav__item">
                    <a class="top-nav__link" link-text="MyDHL Home">MyDHL Home</a>
                </li>
                <c:if test="${model.loggedIn}">
                <li class="top-nav__item">
                    <a class="top-nav__link" href="${model.urlWithLang}/shipment.html" link-text="Ship">Ship</a>
                    <div class="dropdown">
                        <div class="dropdown__wrap">
                            <ul class="dropdown__list">
                                <li class="dropdown__list-item">
                                    <a class="dropdown__link" href="${model.urlWithLang}/shipment.html">Create a Shipment</a>
                                </li>
                                <li class="dropdown__list-item">
                                    <a class="dropdown__link" href="#">Get a Rate and Time Quote</a>
                                </li>
                                <li class="dropdown__list-item">
                                    <a class="dropdown__link" href="#">Schedule a Pickup</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </li>
                </c:if>
                <li class="top-nav__item">
                    <a class="top-nav__link" link-text="Track">Track</a>
                    <div class="dropdown">
                        <div class="dropdown__wrap">
                            <ul class="dropdown__list">
                                <li class="dropdown__list-item"><a class="dropdown__link" href="#">Track Shipments</a></li>
                                <li class="dropdown__list-item"><a class="dropdown__link" href="#">Get Notifications</a></li>
                                <li class="dropdown__list-item"><a class="dropdown__link" href="#">Obtain Proof of Delivery</a></li>
                                <li class="dropdown__list-item"><a class="dropdown__link" href="#">Pay Import Duties and Taxes</a></li>
                            </ul>
                        </div>
                    </div>
                </li>
                <c:if test="${model.loggedIn}">
                    <li class="top-nav__item" >
                        <a class="top-nav__link" link-text="Manage Shipments">Manage Shipments</a>
                        <div class="dropdown">
                            <div class="dropdown__wrap">
                                <ul class="dropdown__list">
                                    <li class="dropdown__list-item"><a class="dropdown__link" href="#">My Pickups</a></li>
                                    <li class="dropdown__list-item"><a class="dropdown__link" href="${model.urlWithLang}/address-book.html">Address Book</a></li>
                                    <li class="dropdown__list-item"><a class="dropdown__link" href="#">Reports</a></li>
                                </ul>
                            </div>
                        </div>
                    </li>
                </c:if>
            </ul>

            <c:if test="${model.loggedIn}">
                <ul class="top-nav top-nav_tiny right">
                    <li class="top-nav__item" class="top-nav__item">
                        <a class="top-nav__link" href="${model.urlWithLang}/shipment-settings.html"><fmt:message key="shipment_defaults_my_shipment_settings"/></a>
                        <div class="dropdown dropdown_right">
                            <div class="dropdown__wrap">
                                <div class="dropdown__col">
                                    <strong class="dropdown__title"><fmt:message key="shipment_defaults_menu"/></strong>
                                    <ul class="dropdown__list">
                                        <li class="dropdown__list-item"><a class="dropdown__link" href="${model.urlWithLang}/shipment-settings.html?tab=manageShipment&section=deliveryOptions"><fmt:message key="shipment_defaults_delivery_options"/></a></li>
                                        <li class="dropdown__list-item"><a class="dropdown__link" href="${model.urlWithLang}/shipment-settings.html?tab=manageShipment&section=shipmentProtection"><fmt:message key="shipment_protection"/></a></li>
                                        <li class="dropdown__list-item"><a class="dropdown__link" href="${model.urlWithLang}/shipment-settings.html?tab=manageShipment&section=customsClearance"><fmt:message key="shipment_defaults_customs_clearance"/></a></li>
                                        <%--temporary disabled--%>
                                        <%--<li class="dropdown__list-item"><a class="dropdown__link" href="${model.urlWithLang}/shipment-settings.html?tab=manageShipment&section=declarations"><fmt:message key="shipment_defaults_declarations"/></a></li>--%>
                                        <li class="dropdown__list-item"><a class="dropdown__link" href="${model.urlWithLang}/shipment-settings.html?tab=manageShipment&section=pickups"><fmt:message key="shipment_defaults_pickups"/></a></li>
                                        <li class="dropdown__list-item"><a class="dropdown__link" href="${model.urlWithLang}/shipment-settings.html?tab=manageShipment&section=returnShipments"><fmt:message key="shipment_defaults_return_shipments"/></a></li>
                                        <li class="dropdown__list-item"><a class="dropdown__link" href="${model.urlWithLang}/shipment-settings.html?tab=manageShipment&section=savingShipments"><fmt:message key="shipment_defaults_saving_shipments"/></a></li>
                                        <li class="dropdown__list-item"><a class="dropdown__link" href="${model.urlWithLang}/shipment-settings.html?tab=manageShipment&section=assigningShipments"><fmt:message key="shipment_defaults_assigning_shipments"/></a></li>
                                        <li class="dropdown__list-item"><a class="dropdown__link" href="${model.urlWithLang}/shipment-settings.html?tab=manageShipment&section=somCurrency"><fmt:message key="som_currency_label"/></a></li>
                                        <li class="dropdown__list-item"><a class="dropdown__link" href="${model.urlWithLang}/shipment-settings.html?tab=manageShipment&section=addressEntry"><fmt:message key="address_entry__title"/></a></li>
                                    </ul>
                                </div>

                                <div class="dropdown__col">
                                    <strong class="dropdown__title"><fmt:message key="saved_settings_menu"/></strong>
                                    <ul class="dropdown__list">
                                        <li class="dropdown__list-item"><a class="dropdown__link" href="${model.urlWithLang}/shipment-settings.html?tab=myDhlAccount"><fmt:message key="dhl_shipment_settings_my_accounts_title"/></a></li>
                                        <li class="dropdown__list-item"><a class="dropdown__link" href="${model.urlWithLang}/shipment-settings.html?tab=authorizedAccountUsage"><fmt:message key="dhl_shipment_settings_my_authorized_accounts_title"/></a></li>
                                        <li class="dropdown__list-item"><a class="dropdown__link" href="${model.urlWithLang}/shipment-settings.html?tab=packagingSettings"><fmt:message key="dhl_shipment_settings_my_packagings_title"/></a></li>
                                        <li class="dropdown__list-item"><a class="dropdown__link" href="${model.urlWithLang}/shipment-settings.html?tab=shipmentReference"><fmt:message key="dhl_shipment_settings_my_sipment_reference"/></a></li>
                                        <li class="dropdown__list-item"><a class="dropdown__link" href="${model.urlWithLang}/shipment-settings.html?tab=printerSettings"><fmt:message key="printer_settings_page_title"/></a></li>
                                        <li class="dropdown__list-item"><a class="dropdown__link" href="${model.urlWithLang}/shipment-settings.html?tab=notificationAndSharing"><fmt:message key="nfn_shr__menu"/></a></li>
                                        <li class="dropdown__list-item"><a class="dropdown__link" href="${model.urlWithLang}/shipment-settings.html?tab=authorizedPickupLocations"><fmt:message key="authorized_pickup_locations_menu"/></a></li>
                                    </ul>
                                </div>

                                <div class="dropdown__col">
                                    <strong class="dropdown__title"><fmt:message key="customs_clearance_settings_menu"/></strong>
                                    <ul class="dropdown__list">
                                        <li class="dropdown__list-item"><a class="dropdown__link" href="${model.urlWithLang}/shipment-settings.html?tab=customsInvoiceTemplates"><fmt:message key="customs_invoice_templates_menu"/></a></li>
                                        <li class="dropdown__list-item"><a class="dropdown__link" href="${model.urlWithLang}/shipment-settings.html?tab=myProductDescriptions"><fmt:message key="my_product_list_menu"/></a></li>
                                        <li class="dropdown__list-item"><a class="dropdown__link" href="${model.urlWithLang}/shipment-settings.html?tab=paperlessCustomsEnrollment"><fmt:message key="digital_customs_invoices_menu"/></a></li>
                                    </ul>
                                </div>

                            </div>
                        </div>
                    </li>
                    <li class="top-nav__item">
                        <ewf-my-profile url-with-lang="'${model.urlWithLang}'"></ewf-my-profile>
                    </li>
                    <li class="top-nav__item" id="logoutButton">
                        <a class="top-nav__link" href="#" ewf-logout="">Logout</a>
                    </li>
                </ul>
            </c:if>

            <c:if test="${!model.loggedIn}">
            <ul class="top-nav top-nav_tiny">
                <li class="top-nav__item">
                    <a class="top-nav__link" href="${model.urlWithLang}/registration.html">Register</a>
                </li>
                <li class="top-nav__item">
                    <div id="loginContainer">
                        <a href="${model.urlWithLang}/auth/login.html" id="loginButton" class="top-nav__button btn"><span>Login</span></a>
                    </div>
                </li>
            </ul>
            </c:if>
        </nav>
    </div></div>
</header>