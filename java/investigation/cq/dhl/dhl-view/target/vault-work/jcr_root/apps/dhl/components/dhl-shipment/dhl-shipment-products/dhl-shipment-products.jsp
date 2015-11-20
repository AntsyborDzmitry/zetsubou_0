<%@page session="false" contentType="text/html; charset=utf-8" pageEncoding="utf-8" %>
<%@include file="/apps/dhl/foundation/global.jsp"%>
<cq:setContentBundle/>

<ewf:registerComponent
        elements="ewf-shipment-products"
        paths="components/shipment/shipment-products/ewf-shipment-products-directive" />

<ewf-shipment-products>

<div id="section_deliveryOptions" class="area-wrap"
    ng-cloak
    ng-if="shipmentProductsCtrl.initialized">
    <section class="area" ng-if="shipmentProductsCtrl.editModeActive">
        <header class="area__header">
            <h3 class="area__title"><fmt:message key="shipment_products_delivery_title_message"/></h3>
        </header>
        <div class="row">
            <div class="col-9">
                <ul class="delivery-tabs">
                    <li class="delivery-tabs__item delivery-date"
                        ng-repeat="date in shipmentProductsCtrl.shipmentDates track by $index"
                        ng-class="{'is-active': shipmentProductsCtrl.datesEquals(shipmentProductsCtrl.activeDate, date)}">
                        <div class="delivery-tabs__item-content" ng-click="shipmentProductsCtrl.displayProductsByDate(date)">
                            <div class="delivery-date__month">{{shipmentProductsCtrl.formatShipmentMonth(date)}}</div>
                            <div class="delivery-date__date">{{date | date:'d'}}</div>
                            <div class="delivery-date__day">{{shipmentProductsCtrl.formatShipmentDate(date)}}</div>
                        </div>
                    </li>
                    <li class="delivery-tabs__item delivery-date delivery-date_flex">
                        <div class="delivery-tabs__item-content" ng-click="shipmentProductsCtrl.openCalendar()">
                            <div class="delivery-date__month">More</div>
                            <div class="delivery-date__date">+</div>
                            <div class="delivery-date__day">&nbsp;</div>
                        </div>

                        <div class="delivery-date-calendar"
                            ng-show="shipmentProductsCtrl.calendarOpened"
                            ng-click="$event.stopPropagation();">
                            <datepicker
                                show-weeks="false"
                                min-date="shipmentProductsCtrl.getMinDate()"
                                ng-model="shipmentProductsCtrl.calendarSelectedDate"
                                date-disabled="shipmentProductsCtrl.isDateDisabled(date, mode)">
                            </datepicker>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
        <div class="row">
            <div class="col-9">
                <div class="delivery-table">
                    <div class="delivery-table__header">
                        <div class="delivery-table__cell">
                            <div class="delivery-table__caption">
                                <i class="dhlicon-delivery-date delivery-table__icon"></i>
                                <span><fmt:message key="shipment_products_delivery_date_label"/></span>
                            </div>
                        </div>
                        <div class="delivery-table__cell">
                            <div class="delivery-table__caption">
                                <i class="dhlicon-clock delivery-table__icon"></i>
                                <span><fmt:message key="shipment_products_delivery_by_label"/></span>
                            </div>
                        </div>
                        <div class="delivery-table__cell">
                            <div class="delivery-table__caption">
                                <span class="currency-icon">$</span>
                                <span><fmt:message key="shipment_products_delivery_estimated_price_label"/></span>
                                <div class="ewf-tooltip">
                                    <i class="dhlicon-help-circle ewf-tooltip__icon"></i>
                                    <div class="ewf-tooltip__text"><fmt:message key="shipment_products_delivery_estimated_price_tooltip"/></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="alert alert_error" ng-if="shipmentProductsCtrl.dctErrorMessageShown" nls="errors.dct_server_error_message"></div>
                    <div class="alert alert_warning" ng-if="shipmentProductsCtrl.dctNotFoundMessageShown" nls="shipment.products_not_found"></div>
                    <div class="delivery-table__item delivery-product" ng-repeat="prod in shipmentProductsCtrl.products track by $index"
                        ng-class="{'is-favorite': prod.code === shipmentProductsCtrl.favoriteProduct}">
                        <div class="delivery-table__holder">
                            <div class="delivery-table__row">
                                <div class="delivery-table__cell">
                                    <div class="delivery-product__month">{{prod.deliveryMonth}}</div>
                                    <div class="delivery-product__date">{{prod.deliveryDate}}</div>
                                    <div class="delivery-product__day">{{prod.deliveryDay}}</div>
                                    <div class="delivery-product__name">{{prod.name}}</div>
                                </div>
                                <div class="delivery-table__cell">
                                    <div class="delivery-product__time">{{prod.deliveredBy}}</div>
                                </div>
                                <div class="delivery-table__cell">
                                    <div class="delivery-product__price"><sup class="delivery-product__currency"><span>$</span></sup>{{prod.costTotal}}</div>
                                    <a class="delivery-product__link" ng-click="shipmentProductsCtrl.toggleDetails($index)">
                                        <span><fmt:message key="shipment_products_delivery_details_label"/></span>
                                        <i class="dhlicon-carat-down"></i>
                                    </a>
                                </div>
                                <div class="delivery-table__cell">
                                    <a class="btn btn_success" ng-click="shipmentProductsCtrl.selectProduct(prod, $index)"><fmt:message key="shipment_products_delivery_select"/></a>
                                </div>
                            </div>
                        </div>
                        <div class="product-details overlay-dark" ng-if="shipmentProductsCtrl.isDetailsVisible($index)">
                            <a class="close close_white"
                               ng-click="shipmentProductsCtrl.toggleDetails($index)"></a>
                            <div class="row">
                                <div class="col-6">
                                    <div class="product-details__item">
                                        <i class="dhlicon-clock product-details__icon"></i>
                                        <span><fmt:message key="shipment_products_details_book_by"/></span>: {{prod.bookBy}}<br>
                                        <span><fmt:message key="shipment_products_details_latest_pickup"/></span>: {{prod.latestPickup}}
                                    </div>
                                    <div class="product-details__item">
                                        <i class="dhlicon-doorway-in product-details__icon"></i>
                                        <span><fmt:message key="shipment_products_details_door_to_door_service"/></span>
                                    </div>
                                    <div class="product-details__item" ng-if="prod.moneyBackGuarantee.applicable">
                                        <i class="dhlicon-thumbs-up product-details__icon"></i>
                                        <span>{{prod.moneyBackGuarantee.text}}</span>
                                        <div class="ewf-tooltip">
                                            <i class="dhlicon-help-circle ewf-tooltip__icon"></i>
                                            <div class="ewf-tooltip__text">{{prod.moneyBackGuarantee.tooltip}}</div>
                                        </div>
                                    </div>
                                    <div class="product-details__item" ng-if="prod.receiveDeliveryNotifications.applicable">
                                        <i class="dhlicon-mobile product-details__icon"></i>
                                        <span>{{prod.receiveDeliveryNotifications.text}}</span>
                                        <div class="ewf-tooltip">
                                            <i class="dhlicon-help-circle ewf-tooltip__icon"></i>
                                            <div class="ewf-tooltip__text">{{prod.receiveDeliveryNotifications.tooltip}}</div>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-6">
                                    <table class="product-details__charges">
                                        <tbody>
                                            <tr ng-repeat="detail in prod.costDetails">
                                                <td>{{detail.name}}</td>
                                                <td><span>$</span></td>
                                                <td class="cost">{{detail.value}}</td>
                                            </tr>
                                            <tr>
                                                <th><fmt:message key="details_total"/></th>
                                                <th><span>$</span>
                                                </th>
                                                <th class="cost">{{prod.costTotal}}</th>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="col-3">
                <div class="callout callout_carat_left" style="margin-top: 100px;"
                        ng-if="shipmentProductsCtrl.products">
                    <h3 class="callout__title"><fmt:message key="shipment_products_get_it_there_faster_title"/></h3>
                    <div class="callout__content">{{shipmentProductsCtrl.getFasterMessageTranslation()}}</div>
                </div>
            </div>
        </div>
        <div class="rate-estimate">{{shipmentProductsCtrl.shipmentEstimateMessage}}</div>
        <a ng-if="!shipmentProductsCtrl.disclaimerVisible" ng-click="shipmentProductsCtrl.showDisclaimer()">
            <i class="dhlicon-terms"></i><span><fmt:message key="shipment_products_disclaimer_title"/></span>
        </a>

        <div ng-if="shipmentProductsCtrl.disclaimerVisible">
            <h4><fmt:message key="shipment_products_disclaimer_title"/></h4>
            <ul>
                <li><fmt:message key="shipment_products_disclaimer_first_row"/></li>
                <li><fmt:message key="shipment_products_disclaimer_second_row"/></li>
                <li><fmt:message key="shipment_products_disclaimer_third_row"/></li>
                <li><fmt:message key="shipment_products_disclaimer_fourth_row"/></li>
            </ul>
        </div>

    </section>

        <div class="synopsis" ng-if="!shipmentProductsCtrl.editModeActive">
        <a class="synopsis__edit btn btn_action" ng-click="shipmentProductsCtrl.onEditClick()"><fmt:message key="edit"/></a>

        <div class="row">
            <div class="col-6 synopsis_with-icon">
                <i class="synopsis__icon dhlicon-delivery-date"></i>
                <b><span><fmt:message key="shipment_products_delivery_date_label"/></span>:</b>
                {{shipmentProductsCtrl.selectedProduct.deliveryDateShort}}<br>
                <b><span><fmt:message key="shipment_products_delivery_by_label"/></span>:</b>
                {{shipmentProductsCtrl.selectedProduct.deliveredBy}}
            </div>
            <div class="col-6">
                <b><span><fmt:message key="shipment_products_delivery_shipment_cost"/></span>:</b>
                <span>$</span>{{shipmentProductsCtrl.selectedProduct.costTotal}}<br>
                <b><span><fmt:message key="shipment_products_delivery_pickup_or_drop_off"/></span>:</b> Pickup
            </div>
        </div>
    </div>
</div>

</ewf-shipment-products>
