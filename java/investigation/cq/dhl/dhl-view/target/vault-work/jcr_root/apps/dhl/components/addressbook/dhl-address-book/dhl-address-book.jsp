<%@page session="false" contentType="text/html; charset=utf-8" pageEncoding="utf-8" %>
<%@include file="/apps/dhl/foundation/global.jsp"%>
<cq:setContentBundle source="page"/>

<ewf:registerComponent
        elements="ewf-address-book"
        paths="components/address-book/address-book-directive,
            directives/ewf-grid/ewf-grid-directive,
            directives/ewf-grid/ewf-grid-pagination-directive,
            directives/ewf-spinner/ewf-spinner-directive"/>

<div class="spinner-wrapper"
   ewf-spinner
   data-aq-id="spinner"
   ng-show="ewfSpinnerCtrl.isSpinnerVisible()">
    <div class="spinner-wrapper__spinner"></div>
</div>

<ewf-address-book ewf-container ${properties.addressBookAttributes} ewf-form="addressBook" >
    <div class="container" ng-cloak="">
        <h1 ng-if="!addressBookCtrl.isPopup" nls="address-book.title"></h1>
        <div ng-class="{ area: !addressBookCtrl.isPopup }">
            <div class="row">
                <div class="col-12">
                    <div class="alert alert_success" ng-if="addressBookCtrl.gridActionStatus.updated">
                        <fmt:message key="address_book_update_success"/>
                    </div>
                    <div class="alert alert_success" ng-if="addressBookCtrl.gridActionStatus.deleted">
                        <fmt:message key="address_book_delete_success"/>
                    </div>
                    <div class="alert alert_error" ng-if="addressBookCtrl.gridActionStatus.rejected">
                        <fmt:message key="address_book_error_alert_message"/>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-5">
                    <div class="address-entry">
                        <!-- Search include -->
                        <cq:include path="search" resourceType="dhl/components/form/dhl-search" />
                    </div>
                </div>
                <div class="col-6 a-right right m-right-small unselectable"
                   ewf-grid-pagination
                   grid-data="ewfGridCtrl.attributes.gridData"
                   hide-page-range="true"
                   hide-pagination-span="${!properties.showPaginationSpan}"
                   pagination-settings="ewfGridCtrl.attributes.pagination"
                   on-pagination-update="ewfGridCtrl.updatePagination(pagination)">
                </div>
            </div>
            <div ng-class="{ grid: !addressBookCtrl.isPopup }">
                <div class="row" ng-if="!addressBookCtrl.isPopup">
                    <div class="col-6">
                        <ul class="nav">
                            <li class="nav__item">
                                <button class="btn btn_success btn_small" ng-disabled="ewfGridCtrl.getSelectedKeysOnCurrentPage().length < 1" ng-click="ewfGridCtrl.showActionsInvert()"><fmt:message key="address_book_actions_btn"/><i class="dhlicon-arrow-down"></i></button>
                                <ul class="menu p-absolute" ng-show="ewfGridCtrl.showActions" ng-mouseleave="ewfGridCtrl.showActionsToFalse()">
                                    <li class="menu__item">
                                        <a ng-click="addressBookCtrl.bulkDeleteElements('address-book.delete_elements_confirmation_message')">
                                            <i class="dhlicon-remove"></i><fmt:message key="address_book_delete_selected_btn"/>
                                        </a>
                                    </li>
                                    <li class="menu__item"><a><i class="dhlicon-download"></i><fmt:message key="address_book_download_selected_btn"/></a></li>
                                    <li class="menu__item"><a><i class="dhlicon-pages"></i><fmt:message key="address_book_create_mailing_btn"/></a></li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                    <div class="col-6 a-right">
                        <ul class="nav">
                            <li class="nav__item"><a class="btn btn_action"><fmt:message key="address_book_upload_contacts_btn"/></a></li>
                            <li class="nav__item"><a class="btn btn_action"><fmt:message key="address_book_download_all_contacts_btn"/></a></li>
                            <li class="nav__item"><a href="new-contact.html" class="btn btn_success btn_small"><fmt:message key="address_book_add_contact_btn"/></a></li>
                        </ul>
                    </div>
                </div>
                <div ewf-grid ng-class="{'data-table_advanced': !addressBookCtrl.isPopup, 'data-table_zebra': addressBookCtrl.isPopup}"
                     delete-url="/api/addressbook/contact/delete"
                     delete-param="contactKeysDeletionRequest"
                     list-url="!addressBookCtrl.isPopup && '/api/addressbook/contact/list'
                        || addressBookCtrl.isPopup
                        && '/api/addressbook/contact/list?sortingParameter=${properties.showFavoritesFrom
                        ? "favoriteShipFrom" : "favoriteShipTo"}'"
                     visible-columns="addressBookCtrl.columnsToDisplay"
                     available-columns="addressBookCtrl.availableColumns"
                     on-columns-changed="addressBookCtrl.handleColumnsChange(selectedColumns)"
                     on-selection="addressBookCtrl.onSelection($selection, $index)"
                     sort-column="!addressBookCtrl.isPopup && addressBookCtrl.columnsToDisplay[0].alias || ''"
                     is-popup="addressBookCtrl.isPopup"
                     pagination-size="${properties.paginationSize}"
                     show-customization-button="!addressBookCtrl.isPopup">
                </div>
            </div>
            <div class="row"
                ewf-grid-pagination
                grid-data="ewfGridCtrl.attributes.gridData"
                pagination-settings="ewfGridCtrl.attributes.pagination"
                on-pagination-update="ewfGridCtrl.updatePagination(pagination)">
            </div>
        </div>
    </div>
</ewf-address-book>
