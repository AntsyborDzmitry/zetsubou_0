<%@page session="false" contentType="text/html; charset=utf-8" pageEncoding="utf-8" %>
<%@include file="/apps/dhl/foundation/global.jsp"%>
<cq:setContentBundle/>

<ewf:registerComponent
        elements="shipment-reference,
            ewf-grid"
        paths="components/shipment-reference/shipment-reference-directive,
            directives/ewf-grid/ewf-grid-directive,
            directives/ewf-grid/ewf-grid-pagination-directive,
            directives/ewf-form/ewf-form-controller,
            directives/ewf-validate/ewf-validate-pattern-directive"/>

<shipment-reference class="dhl-shipment-reference" ewf-container>

    <div class="row">
        <div class="col-6">
            <h3 class="margin-none"><fmt:message key="ship_ref__title"/></h3>
        </div>
        <hr class="hr">
    </div>

    <div class="row"><fmt:message key="ship_ref__intro"/></div>

    <div class="row margin-top">
        <span class="fw-bold">
            <fmt:message key="ship_ref__label"/>
            <a class="info">
                <span><fmt:message key="ship_ref__label_info"/></span>
            </a>
        </span>
        <input type="text" class="input m-left-small m-right-small" id="refFieldLabelInput"
           ng-model="shipmentReferenceCtrl.referenceDefaults.referenceLabel">
        <a id="refFieldLabeUpdateBtn"
           ng-click="shipmentReferenceCtrl.updateReferenceLabel($event)">
            <fmt:message key="ship_ref__upd_btn"/>
        </a>
    </div>

    <div class="alert alert_success" ng-if="shipmentReferenceCtrl.referenceDefaultChanged">
        <fmt:message key="ship_ref__reference_default_changed"/>
    </div>
    <div class="overlay-white">
        <div class="nav right">
            <a class="nav__item btn btn_action dhlicon-pencil" id="defaultReferenceEditBtn"
               ng-hide="shipmentReferenceCtrl.showEditDefaults"
               ng-click="shipmentReferenceCtrl.toggleEditDefaults($event)">
                <fmt:message key="ship_ref__edit_btn"/>
            </a>
        </div>
        <h3 class="margin-top-none"><fmt:message key="ship_ref__default_ref"/></h3>
        <div class="row"
           ng-hide="shipmentReferenceCtrl.showEditDefaults">
            {{shipmentReferenceCtrl.defaultReference.name || '<fmt:message key="ship_ref__defaults_none"/>'}}
        </div>
        <div ng-show="shipmentReferenceCtrl.showEditDefaults" id="defaultReferenceSelect">
            <span class="select">
                <select ng-model="shipmentReferenceCtrl.selectedDefault"
                   ng-options="item.name for item in shipmentReferenceCtrl.gridData track by item.key">
                    <option value=""><fmt:message key="ship_ref__defaults_none"/></option>
                </select>
            </span>
            <div class="row">
                <div class="col-12 a-right">
                    <a class="m-right-small" id="defaultReferenceCancelBtn"
                       ng-click="shipmentReferenceCtrl.toggleEditDefaults($event)">
                        <fmt:message key="cancel_button"/>
                    </a>
                    <button class="btn" id="defaultReferenceSaveBtn"
                       ng-click="shipmentReferenceCtrl.setDefaultReference()">
                        <fmt:message key="save_button"/>
                    </button>
                </div>
            </div>
        </div>
    </div>

    <div class="row">
        <h5 class="col-6 margin-bottom-none"><fmt:message key="ship_ref__subtitle"/></h5>
    </div>

    <div class="alert alert_success" ng-if="shipmentReferenceCtrl.gridActionStatus.created">
        <fmt:message key="ship_ref__mdl_add_success"/>
    </div>
    <div class="alert alert_success" ng-if="shipmentReferenceCtrl.gridActionStatus.updated">
        <fmt:message key="ship_ref__mdl_upd_success"/>
    </div>
    <div class="alert alert_success" ng-if="shipmentReferenceCtrl.gridActionStatus.deleted">
        <fmt:message key="ship_ref__mdl_del_success"/>
    </div>
    <div class="alert alert_error" ng-if="shipmentReferenceCtrl.gridActionStatus.rejected">
        <fmt:message key="ship_ref__mdl_reject"/>
    </div>

    <div id="customPackagingList" class="overlay-grey">
        <div class="row">
            <div class="col-6">
                <button class="btn btn_small btn_success"
                   ng-click="shipmentReferenceCtrl.bulkDeleteElements()"
                   ng-disabled="!ewfGridCtrl.getSelectedKeysOnCurrentPage().length">
                    <i class="dhlicon-remove"></i>
                    <fmt:message key="ship_ref__delete_selected"/>
                </button>
            </div>
            <div class="col-6 a-right">
                <a ng-click="shipmentReferenceCtrl.runAddDialog()" class="btn btn_small btn_success">
                    <i class="dhlicon-add"></i>
                    <fmt:message key="ship_ref__mdl_add_dlg_title"/>
                </a>
            </div>
        </div>
        <div class="row"
           ewf-grid-pagination
           grid-data="ewfGridCtrl.attributes.gridData"
           pagination-settings="ewfGridCtrl.attributes.pagination"
           on-pagination-update="ewfGridCtrl.updatePagination(pagination)">
        </div>
        <div ewf-grid
           sort-column="nickName"
           on-selection="true"
           visible-columns="shipmentReferenceCtrl.columnsToDisplay"
           grid-data="shipmentReferenceCtrl.gridData"
           add-url="/api/myprofile/shipment/references/add"
           delete-url="/api/myprofile/shipment/references/delete"
           delete-param="deletionRequest"
           update-url="/api/myprofile/shipment/references/modify"
           simple-first-column="true">
        </div>
        <div class="row"
           ewf-grid-pagination
           grid-data="ewfGridCtrl.attributes.gridData"
           pagination-settings="ewfGridCtrl.attributes.pagination"
           on-pagination-update="ewfGridCtrl.updatePagination(pagination)">
        </div>
    </div>

</shipment-reference>

