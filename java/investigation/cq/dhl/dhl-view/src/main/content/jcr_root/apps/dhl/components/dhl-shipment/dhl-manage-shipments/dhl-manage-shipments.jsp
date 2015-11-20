<%@page session="false" contentType="text/html; charset=utf-8" pageEncoding="utf-8" %>
<%@include file="/apps/dhl/foundation/global.jsp"%>
<cq:setContentBundle/>

<ewf:registerComponent
        elements="ewf-manage-shipments"
        paths="components/shipment/manage-shipments/manage-shipments-directive,
            directives/ewf-data-table/ewf-data-table-directive,
            directives/ewf-data-table-header-cell/ewf-data-table-header-cell-directive"
/>

<ewf-manage-shipments ng-cloak>
    <div class="container">
        <h1 class="page-title">
            <fmt:message key="manage_shipments_title"/>
        </h1>

        <section class="area">
            <div class="row">
                <form class="col-6"
                   ng-submit="manageShipmentsCtrl.filterShipments();">
                    <input type="text" class="input input_small"
                       placeholder='<fmt:message key="manage_shipments_search_placeholder"/>'
                       ng-model="manageShipmentsCtrl.searchQuery">
                    <button class="btn btn_small" type="submit">
                        <i class="dhlicon-search"></i>
                    </button>
                </form>
            </div>
            <div class="overlay-grey"
               ewf-data-table
               dt-data="manageShipmentsCtrl.filteredShipments">
                <div class="row">
                    <div class="col-6">
                        <ul class="table-actions top nav">
                            <li class="nav__item">
                                <button class="btn btn_success btn_small"
                                   ng-disabled="!ewfDataTableCtrl.hasSelectedData()">
                                    <fmt:message key="manage_shipments_grid_actions_button"/>
                                    <i class="dhlicon-arrow-down"></i>
                                </button>
                                <ul class="menu p-absolute is-invisible">
                                    <li class="menu__item">
                                        <a href="#">
                                            <i class="dhlicon-copy"></i>
                                            <fmt:message key="manage_shipments_grid_copy_selected_action"/>
                                        </a>
                                    </li>
                                    <li class="menu__item">
                                        <a href="#">
                                            <i class="dhlicon-print"></i>
                                            <fmt:message key="manage_shipments_grid_reprint_selected_labels_action"/>
                                        </a>
                                    </li>
                                    <li class="menu__item">
                                        <a href="#">
                                            <i class="dhlicon-cancel"></i>
                                            <fmt:message key="manage_shipments_grid_cancel_selected_action"/>
                                        </a>
                                    </li>
                                    <li class="menu__item">
                                        <a href="#">
                                            <i class="dhlicon-download"></i>
                                            <fmt:message key="manage_shipments_grid_download_selected_action"/>
                                        </a>
                                    </li>
                                    <li class="menu__item">
                                        <a href="#">
                                            <i class="dhlicon-favorite-empty"></i>
                                            <fmt:message key="manage_shipments_grid_mark_selected_as_favorite_action"/>
                                        </a>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                    <div class="col-6 a-right">
                        <ul class="table-actions top nav">
                            <li class="nav__item">
                                <button class="btn btn_action">
                                    <fmt:message key="manage_shipments_grid_create_shipment_button"/>
                                </button>
                            </li>
                            <li class="nav__item">
                                <button class="btn btn_action">
                                   <fmt:message key="manage_shipments_grid_download_all_shipments_button"/>
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
                <table class="data-table data-table_advanced">
                    <thead>
                        <tr class="data-table__header">
                            <th class="data-table__header-cell checkbox-cell">
                                <label class="checkbox checkbox_inline">
                                    <input id="data-table-row-checkbox" type="checkbox" class="checkbox__input"
                                       ng-model="ewfDataTableCtrl.allItemsAreSelected"
                                       ng-change="ewfDataTableCtrl.changeSelection(ewfDataTableCtrl.allItemsAreSelected);"
                                       data-aqa-id="data-table-row-checkbox">
                                    <span class="label"></span>
                                </label>
                            </th>
                            <th class="data-table__header-cell checkbox-cell">
                            </th>
                            <th class="data-table__header-cell"
                               ewf-data-table-header-cell
                               dt-property="airWayBillNumber"
                               dt-nls-caption="shipment.manage_shipments_grid_waybill_column"
                               dt-sortable="true">
                            </th>
                            <th class="data-table__header-cell"
                               ewf-data-table-header-cell
                               dt-property="status"
                               dt-nls-caption="shipment.manage_shipments_grid_status_column"
                               dt-sortable="true">
                            </th>
                            <th class="data-table__header-cell"
                               ewf-data-table-header-cell
                               dt-property="shipmentDate"
                               dt-nls-caption="shipment.manage_shipments_grid_shipment_date_column"
                               dt-sortable="true">
                            </th>
                            <th class="data-table__header-cell"
                               ewf-data-table-header-cell
                               dt-nls-caption="shipment.manage_shipments_grid_shipment_details_column">
                            </th>
                            <th class="data-table__header-cell"
                               ewf-data-table-header-cell
                               dt-nls-caption="shipment.manage_shipments_grid_ship_from_column">
                            </th>
                            <th class="data-table__header-cell"
                               ewf-data-table-header-cell
                               dt-nls-caption="shipment.manage_shipments_grid_ship_to_column">
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr class="data-table__item"
                           ng-repeat="shipment in ewfDataTableCtrl.getViewData()"
                           ng-class="{ 'selected': shipment.dataTableSelected }">
                            <td class="data-table__cell checkbox-cell">
                                <label class="checkbox">
                                    <input id="data-table-row-{{$index}}-checkbox" type="checkbox" class="checkbox__input"
                                       ng-model="shipment.dataTableSelected"
                                       data-aqa-id="data-table-row-{{$index}}-checkbox">
                                    <span class="label"></span>
                                </label>
                            </td>
                            <td class="data-table__cell">
                                <i class="dhlicon-alert"></i>
                                <ul class="individual-options">
                                    <li>
                                        <button class="btn btn_success btn_small">
                                           <fmt:message key="manage_shipments_grid_item_quick_view_action"/>
                                           <i class="dhlicon-search"></i>
                                        </button>
                                    </li>
                                    <li>
                                        <button class="btn btn_small">
                                           <fmt:message key="manage_shipments_grid_item_track_action"/>
                                        </button>
                                    </li>
                                    <li>
                                        <button class="btn btn_small">
                                           <fmt:message key="manage_shipments_grid_item_copy_action"/>
                                        </button>
                                    </li>
                                    <li>
                                        <button class="btn btn_action">
                                           <fmt:message key="manage_shipments_grid_item_print_action"/>
                                        </button>
                                    </li>
                                    <li>
                                        <button class="btn btn_action">
                                           <fmt:message key="manage_shipments_grid_item_download_action"/>
                                        </button>
                                    </li>
                                    <li>
                                        <a href="#">
                                            <fmt:message key="manage_shipments_grid_item_more_link"/>
                                        </a>
                                    </li>
                                </ul>
                            </td>
                            <td class="data-table__cell">
                                <b class="block">
                                    <a href="#" ng-click="manageShipmentsCtrl.openShipmentPage(shipment);">
                                        {{shipment.airWayBillNumber || '<fmt:message key="manage_shipments_grid_item_no_waybill"/>'}}
                                    </a>
                                </b>
                                <small class="block">
                                    {{shipment.name}}
                                </small>
                            </td>
                            <td class="data-table__cell">
                                <b class="block">
                                   <fmt:message key="manage_shipments_grid_item_in_progress_status"/>
                                </b>
                                <a href="#" class="block">
                                    <fmt:message key="manage_shipments_grid_item_saved_by_you_cell"/>
                                    <br>
                                    {{shipment.savedDate | date : 'MM/dd/yyyy'}}
                                </a>
                            </td>
                            <td class="data-table__cell">
                                <em>
                                    <fmt:message key="manage_shipments_grid_item_pending_shipment_completion_cell"/>
                                </em>
                            </td>
                            <td class="data-table__cell">
                                <div class="row">
                                    <div class="col-3">
                                        <%-- TODO: render package type --%>
                                    </div>
                                    <div class="col-9">
                                        <a href="#">
                                            <%-- TODO: render packages number --%>
                                        </a>
                                    </div>
                                </div>
                            </td>
                            <td class="data-table__cell">
                                <b class="block">
                                    {{shipment.fromName}}
                                    <br>
                                    {{shipment.fromCompany}}
                                </b>
                                <span class="block">{{shipment.fromAddress.addressLine1}}</span>
                                <span class="block">
                                    {{shipment.fromAddress.cityName}} {{shipment.fromAddress.postCode}}, {{shipment.fromAddress.countryCode}}
                                </span>
                            </td>
                            <td class="data-table__cell">
                                <b class="block">
                                    {{shipment.toName}}
                                    <br>
                                    {{shipment.toCompany}}
                                </b>
                                <span class="block">{{shipment.toAddress.addressLine1}}</span>
                                <span class="block">
                                    {{shipment.toAddress.cityName}} {{shipment.toAddress.postCode}}, {{shipment.toAddress.countryCode}}
                                </span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </section>
    </div>
</ewf-manage-shipments>
