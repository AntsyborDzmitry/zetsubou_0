<%@page session="false" contentType="text/html; charset=utf-8" pageEncoding="utf-8" %>
<%@include file="/apps/dhl/foundation/global.jsp"%>
<cq:setContentBundle/>

<ewf:registerComponent
        elements="packaging-defaults,
            packaging-settings,
            ewf-grid"
        paths="components/packaging-settings/packaging-defaults/packaging-defaults-directive,
            components/packaging-settings/packaging-settings-directive,
            directives/ewf-grid/ewf-grid-directive,
            directives/ewf-grid/ewf-grid-pagination-directive"/>

<!--TODO: whole source code below will be refactored,
     it is done in presentation purposes for testers, please ignore -->
<div id="customPkgList">

    <div class="row">
        <div class="col-6">
            <h3 class="m-none">
                Packaging Settings
            </h3>
        </div>
        <hr class="hr">
    </div>

    <div class="row">
        If you frequently use packaging options, you can set up defaults to help you save time when creating shipments. You can turn defaults on/off or modify whenever needed.
    </div>

    <packaging-settings ewf-container>
        <packaging-defaults></packaging-defaults>

        <div class="row">
            <h5 class="col-6 margin-bottom-none">
                <fmt:message key="my_own_packaging_options"/>
            </h5>
        </div>

        <div class="row">
            <div class="col-12">
                <div class="alert alert_success"
                   ng-if="packagingSettingsCtrl.gridActionStatus.created"
                   nls="package-settings.create_success_message">
                </div>
                <div class="alert alert_success"
                   ng-if="packagingSettingsCtrl.gridActionStatus.updated"
                   nls="package-settings.update_success_message">
                </div>
                <div class="alert alert_success"
                   ng-if="packagingSettingsCtrl.gridActionStatus.deleted &&
                   packagingSettingsCtrl.notificationData === 1"
                   nls="package-settings.delete_single_success_message">
                </div>
                <div class="alert alert_success"
                   ng-if="packagingSettingsCtrl.gridActionStatus.deleted &&
                   packagingSettingsCtrl.notificationData > 1">
                    {{ packagingSettingsCtrl.notificationData }}
                    <span nls="package-settings.delete_multiple_success_message"></span>
                </div>
                <div class="alert alert_error"
                   ng-if="packagingSettingsCtrl.gridActionStatus.rejected"
                   nls="package-settings.update_rejected">
                </div>
            </div>
        </div>

        <div id="customPackagingList" class="overlay-grey">
            <div class="row">
                <div class="col-6">
                    <button class="btn btn_small btn_success"
                       ng-click="ewfGridCtrl.bulkDeleteElements('shipment-settings.are_you_sure_you_want_to_delete')"
                       ng-disabled="ewfGridCtrl.getSelectedKeysOnCurrentPage().length === 0">
                        <i class="dhlicon-remove"></i>
                        Delete Selected
                    </button>
                </div>
                <div class="col-6 a-right">
                    <a class="btn btn_small btn_success" href="#"
                       ng-click="packagingSettingsCtrl.showAddDialog()">
                        <i class="dhlicon-add"></i>
                        <fmt:message key="add_my_own_packaging"/>
                    </a>
                </div>
            </div>
            <div class="row"
               ewf-grid-pagination
               grid-data="packagingSettingsCtrl.gridData"
               pagination-settings="ewfGridCtrl.attributes.pagination"
               on-pagination-update="ewfGridCtrl.updatePagination(pagination)">
            </div>
            <div ewf-grid
               on-selection="true"
               delete-url="/api/myprofile/packaging/delete"
               delete-param="customPackagingDeletionRequest"
               grid-data="packagingSettingsCtrl.gridData"
               visible-columns="packagingSettingsCtrl.columnsToDisplay"
               sort-column="nickName"
               on-sort="packagingSettingsCtrl.onSort"
               simple-first-column="true">
            </div>
            <div class="row"
               ewf-grid-pagination
               grid-data="packagingSettingsCtrl.gridData"
               pagination-settings="ewfGridCtrl.attributes.pagination"
               on-pagination-update="ewfGridCtrl.updatePagination(pagination)">
            </div>
        </div>
        <cq:include script="dhl-packaging-modals.jsp"/>
    </packaging-settings>
</div>
