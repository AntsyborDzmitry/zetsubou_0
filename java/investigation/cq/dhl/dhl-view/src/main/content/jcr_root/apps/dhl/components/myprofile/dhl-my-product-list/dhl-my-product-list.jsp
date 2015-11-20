<%@page session="false" contentType="text/html; charset=utf-8" pageEncoding="utf-8" %>
<%@include file="/apps/dhl/foundation/global.jsp"%>
<cq:setContentBundle source="page"/>
<ewf:registerComponent
    elements="my-product-list,
    product-upload-list,
    ewf-file-uploader,
    ewf-progress-bar,
    ewf-my-product-form"
    paths="components/my-product-list/my-product-list-directive,
    components/my-product-list/my-product-form-directive,
    components/my-product-list/product-upload-list/product-upload-list-directive,
    directives/ewf-grid/ewf-grid-directive,
    directives/ewf-grid/ewf-grid-pagination-directive,
    directives/ewf-file-uploader/ewf-file-uploader-directive,
    directives/ewf-progress-bar/ewf-progress-bar-directive,
    directives/ewf-modal/ewf-modal-directive"/>

<my-product-list ewf-container id="my-products-list">
    <div ng-hide="myProductListCtrl.isFormVisible">
        <div class="alert alert_success" id="listAddedAlert"
           ng-if="myProductListCtrl.alertTypes.catalogUpdated">
            <fmt:message key="my_product_list_added"/>
        </div>
        <div class="alert alert_error" id="listErrorAlert"
           ng-if="myProductListCtrl.alertTypes.catalogError">
            <fmt:message key="my_product_list_error"/>
        </div>
        <div class="row">
            <div class="col-5">
                <h3 class="margin-none">
                    <fmt:message key="my_product_list_header"/>
                </h3>
            </div>
            <hr class="hr margin-top-none">
            <p>
                <fmt:message key="my_product_list_description"/>
            </p>
        </div>
        <div class="row">
            <div class="product-entry">
                <div class="col-6">
                    <div class="col-4">
                        <span class="select">
                            <select>
                                <option value="$" selected="">
                                    <fmt:message key="my_product_list_filter_all"/>
                                </option>
                                <option value="name">
                                    <fmt:message key="my_product_list_filter_name"/>
                                </option>
                                <option value="description">
                                    <fmt:message key="my_product_list_filter_description"/>
                                </option>
                                <option value="country">
                                    <fmt:message key="my_product_list_filter_country"/>
                                </option>
                            </select>
                        </span>
                    </div>
                    <div class="col-8">
                        <input type="text" placeholder="<fmt:message key='my_product_list_search_placeholder'/>" class="input input_width_full product-search" autocomplete="off">
                    </div>
                </div>
                <div class="col-6"
                   ewf-grid-pagination
                   grid-data="ewfGridCtrl.attributes.gridData"
                   pagination-settings="ewfGridCtrl.attributes.pagination"
                   on-pagination-update="ewfGridCtrl.updatePagination(pagination)"
                   hide-page-range="true">
                </div>
            </div>
        </div>
        <div class="alert alert_success"
           ng-if="myProductListCtrl.alertTypes.uploaded">
            <fmt:message key="my_product_list_uploaded"/>
        </div>
        <div class="alert alert_success"
           ng-if="myProductListCtrl.alertTypes.added">
            <fmt:message key="my_product_list_added_product"/>
        </div>
        <div class="alert alert_success"
           ng-if="myProductListCtrl.alertTypes.updated">
            <fmt:message key="my_product_list_updated_product"/>
        </div>
        <div class="alert alert_success"
           ng-if="myProductListCtrl.alertTypes.deleted">
            <fmt:message key="my_product_list_deleted_product"/>
        </div>
        <div class="callout">
            <div class="row">
                <div class="col-6">
                    <button class="btn btn_small btn_success"
                       ng-click="ewfGridCtrl.bulkDeleteElements('shipment-settings.are_you_sure_you_want_to_delete')"
                       ng-disabled="!myProductListCtrl.isBulkDeleteButtonEnabled()">
                        <i class="dhlicon-remove"></i>
                        <fmt:message key="my_product_list_product_delete_selected"/>
                    </button>
                </div>
                <div class="col-6 a-right">
                    <button class="btn btn_action"
                       ng-click="myProductListCtrl.showUploadListDialogue()">
                        <fmt:message key="my_product_list_upload"/>
                    </button>
                    <a class="btn btn_action"
                       ng-href="/api/myprofile/customs/products/download">
                        <fmt:message key="my_product_list_download"/>
                    </a>
                    <button class="btn btn_small btn_success"
                       ng-click="myProductListCtrl.editProduct('')">
                        <i class="dhlicon-add"></i>
                        <fmt:message key="my_product_list_product_add"/>
                    </button>
                </div>
            </div>
            <div ewf-grid
               sort-column="name"
               on-selection="true"
               add-url="/api/myprofile/customs/products"
               delete-param="productItems"
               delete-url="/api/myprofile/customs/products/delete"
               grid-data="myProductListCtrl.gridData"
               visible-columns="myProductListCtrl.columnsToDisplay"
               update-url="/api/myprofile/products/modify"
               simple-first-column="true">
            </div>
        </div>
        <div class="row"
           ewf-grid-pagination
           grid-data="ewfGridCtrl.attributes.gridData"
           pagination-settings="ewfGridCtrl.attributes.pagination"
           on-pagination-update="ewfGridCtrl.updatePagination(pagination)">
        </div>
    </div>
    <div id="my-product-form"
       ng-show="myProductListCtrl.isFormVisible">
        <ewf-my-product-form
           on-product-edited="myProductListCtrl.onUpdate()"
           on-product-added="myProductListCtrl.onAdd()"
           on-edit-canceled="myProductListCtrl.onCancel()"
           my-product-list-key="myProductListCtrl.myProductListKey">
            <%@include file="dhl-my-product-form.jsp"%>
        </ewf-my-product-form>
    </div>
</my-product-list>
