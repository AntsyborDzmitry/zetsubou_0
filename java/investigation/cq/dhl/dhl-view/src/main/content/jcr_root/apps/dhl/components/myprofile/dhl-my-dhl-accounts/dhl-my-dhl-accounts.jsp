<%@page session="false" contentType="text/html; charset=utf-8" pageEncoding="utf-8" %>
<%@include file="/apps/dhl/foundation/global.jsp"%>
<cq:setContentBundle source="page"/>
<slice:lookup var="model" appName="dhlApp" type="<%=com.dhl.components.model.BasePageModel.class%>" />

<ewf:registerComponent
        elements="grid,
            cell-template,
            field-option,
            my-dhl-accounts-defaults"
        paths="directives/ewf-grid/ewf-grid-pagination-directive,
            directives/ewf-click/ewf-click-directive,
            components/profile-account-settings/account-defaults/my-dhl-accounts-defaults-directive,
            components/profile-account-settings/my-dhl-accounts/my-dhl-accounts-directive"/>

<div>
    <div class="row">
        <a class="right" href="${model.urlWithLang}/shipment-settings.html?tab=authorizedAccountUsage"><fmt:message key="account_authorized_link"/></a>
        <h3 class="margin-none">
            <fmt:message key="account_title"/>
        </h3>
    </div>

    <!-- Shows up when a request has been submitted to add a DHL Account -->

<div my-dhl-accounts-defaults>
    <form name="accountsDefaultsForm" ng-submit="accountsDefaultsForm.$valid && paymentDefaultsController.updateAccountsDefaults()" class="margin-top"
          ewf-form="manageAccounts">
        <div class="alert alert_success" ng-if="paymentDefaultsController.accountListUpdated">
            <fmt:message key="account_success_message"/>
        </div>
        <div class="alert alert_error" ng-if="myDhlAccountsCtrl.gridActionStatus.rejected">
            <span ng-repeat="error in myDhlAccountsCtrl.notificationData.errors" nls="{{error}}"></span>
        </div>
        <div class="overlay-white" ng-init="paymentDefaultsController.isEditing = false">
            <div class="nav right">
                <a class="nav__item btn btn_action"
                   ng-click="paymentDefaultsController.isEditing = true;"
                   ng-hide="paymentDefaultsController.isEditing">
                    <i class="dhlicon-pencil"></i><fmt:message key="account_edit"/>
                </a>
                <a class="small"
                   ng-click="paymentDefaultsController.isEditing = false;"
                   ng-show="paymentDefaultsController.isEditing">
                    <fmt:message key="close_link"/>
                </a>
            </div>
            <h3 class="margin-top-none"><fmt:message key="account_details_settings"/></h3>
            <div>
                <div class="row" ng-hide="paymentDefaultsController.isEditing">
                    <div class="col-6">
                        <div><fmt:message key="dhl_accounts_title"/>
                            <b ng-if="paymentDefaultsController.maskDhlAccounts"><fmt:message key="dhl_accounts_masked_title"/></b>
                            <b ng-if="!paymentDefaultsController.maskDhlAccounts"><fmt:message key="dhl_accounts_not_masked_title"/></b>
                        </div>
                        <div><fmt:message key="dhl_accounts_domestic_shipment_edit_title"/><b ng-bind="paymentDefaultsController.domesticShipmentAccount.data.title"></b></div>
                        <div><fmt:message key="dhl_accounts_export_shipment_edit_title"/><b ng-bind="paymentDefaultsController.exportShipmentAccount.data.title"></b></div>
                        <div><fmt:message key="dhl_accounts_import_shipment_edit_title"/><b ng-bind="paymentDefaultsController.importShipmentAccount.data.title"></b></div>
                    </div>
                    <div class="col-6">
                        <div><fmt:message key="dhl_accounts_domestic_return_shipment_edit_title"/><b ng-bind="paymentDefaultsController.domesticRetShipmentAccount.data.title"></b></div>
                        <div><fmt:message key="dhl_accounts_international_return_shipment_edit_title"/><b ng-bind="paymentDefaultsController.internRetShipmentAccount.data.title"></b></div>
                        <div><fmt:message key="dhl_accounts_export_duties_edit_title"/><b ng-bind="paymentDefaultsController.exportDutiesAndTaxesAccount.data.title"></b></div>
                        <div><fmt:message key="dhl_accounts_import_duties_edit_title"/><b ng-bind="paymentDefaultsController.importDutiesAndTaxesAccount.data.title"></b></div>
                        <div><fmt:message key="dhl_accounts_return_duties_edit_title"/><b ng-bind="paymentDefaultsController.returnDutiesAndTaxesAccount.data.title"></b></div>
                    </div>
                </div>
                <div ng-show="paymentDefaultsController.isEditing">
                    <label class="checkbox">
                        <input type="checkbox" id="mask_account_number" class="checkbox__input"
                           data-aqa-id="mask_account_number"
                           ng-model="paymentDefaultsController.maskDhlAccounts">
                        <span for="mask_account_number" class="label label_big">
                            <b><fmt:message key="dhl_accounts_mask_dhl_account_title"/></b>
                            <br />
                            <fmt:message key="dhl_accounts_mask_dhl_account_help1"/><i><fmt:message key="dhl_accounts_mask_dhl_account_help2"/></i>
                        </span>
                    </label>
                    <hr class="hr">
                    <h3 class="margin-none">
                        <fmt:message key="dhl_accounts_defaults_title"/>
                    </h3>
                    <div>
                        <fmt:message key="dhl_accounts_defaults_description"/>
                    </div>

                    <div class="row">
                        <div class="col-6">
                            <h5 class="h5">
                                <fmt:message key="dhl_accounts_shipment_defaults_title"/>
                            </h5>

                            <div class="field-group">
                                <label class="label label_big">
                                    <b><fmt:message key="dhl_accounts_shipment_domestic_title"/></b>
                                    <span class="label__description">
                                        <fmt:message key="dhl_accounts_shipment_domestic_descr"/>
                                    </span>
                                </label>
                                <div class="field-row">
                                    <div class="select">
                                        <select ng-model="paymentDefaultsController.domesticShipmentAccount.data"
                                           ng-options="domesticAccount.title for domesticAccount in paymentDefaultsController.availableForShipment track by domesticAccount.key"
                                           data-aqa-id="domesticShipmentAccount">
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div class="field-group">
                                <label class="label label_big">
                                    <b><fmt:message key="dhl_accounts_shipment_export_title"/></b>
                                    <span class="label__description">
                                        <fmt:message key="dhl_accounts_shipment_export_descr"/>
                                    </span>
                                </label>
                                <div class="field-row">
                                    <div class="select">
                                        <select ng-model="paymentDefaultsController.exportShipmentAccount.data"
                                           ng-options="exportAccount.title for exportAccount in paymentDefaultsController.availableForShipment track by exportAccount.key"
                                           data-aqa-id="exportShipmentAccount">
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div class="field-group">
                                <label class="label label_big">
                                    <b><fmt:message key="dhl_accounts_shipment_import_title"/></b>
                                    <span class="label__description">
                                        <fmt:message key="dhl_accounts_shipment_import_descr"/>
                                    </span>
                                </label>
                                <div class="field-row">
                                    <div class="select">
                                        <select ng-model="paymentDefaultsController.importShipmentAccount.data"
                                           ng-options="importAccount.title for importAccount in paymentDefaultsController.availableForShipmentImportAccounts track by importAccount.key"
                                           data-aqa-id="importShipmentAccount">
                                        </select>
                                    </div>
                                </div>
                            </div>


                            <div class="field-group">
                                <label class="label label_big">
                                    <b><fmt:message key="dhl_accounts_shipment_domestic_return_title"/></b>
                                    <span class="label__description">
                                        <fmt:message key="dhl_accounts_shipment_domestic_return_descr"/>
                                    </span>
                                </label>
                                <div class="field-row">
                                    <div class="select">
                                        <select ng-model="paymentDefaultsController.domesticRetShipmentAccount.data"
                                           ng-options="domesticReturn.title for domesticReturn in paymentDefaultsController.availableForShipment track by domesticReturn.key"
                                           data-aqa-id="domesticRetShipmentAccount">
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div class="field-group">
                                <label class="label label_big">
                                    <b><fmt:message key="dhl_accounts_shipment_international_return_title"/></b>
                                    <span class="label__description">
                                        <fmt:message key="dhl_accounts_shipment_international_return_descr"/>
                                    </span>
                                </label>
                                <div class="field-row">
                                    <div class="select">
                                        <select ng-model="paymentDefaultsController.internRetShipmentAccount.data"
                                           ng-options="internationalReturn.title for internationalReturn in paymentDefaultsController.availableForShipmentImportAccounts track by internationalReturn.key"
                                           data-aqa-id="internRetShipmentAccount">
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-6">
                            <h5 class="h5">
                                <fmt:message key="dhl_accounts_duties_title"/>
                            </h5>

                            <div class="field-group">
                                <label class="label label_big">
                                    <fmt:message key="dhl_accounts_duties_title1"/><b><fmt:message key="dhl_accounts_duties_export_title2"/></b>
                                    <span class="label__description">
                                        <fmt:message key="dhl_accounts_duties_export_descr"/>
                                    </span>
                                </label>
                                <div class="field-row">
                                    <div class="select">
                                        <select ng-model="paymentDefaultsController.exportDutiesAndTaxesAccount.data"
                                           ng-options="export.title for export in paymentDefaultsController.availableForDutiesAndTaxes track by export.key"
                                           data-aqa-id="exportDutiesAndTaxesAccount">
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div class="field-group">
                                <label class="label label_big">
                                    <fmt:message key="dhl_accounts_duties_title1"/><b><fmt:message key="dhl_accounts_duties_import_title2"/></b>
                                    <span class="label__description">
                                        <fmt:message key="dhl_accounts_duties_import_descr"/>
                                    </span>
                                </label>
                                <div class="field-row">
                                    <div class="select">
                                        <select ng-model="paymentDefaultsController.importDutiesAndTaxesAccount.data"
                                           ng-options="imports.title for imports in paymentDefaultsController.availableForDutiesAndTaxes track by imports.key"
                                           data-aqa-id="importDutiesAndTaxesAccount">
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div class="field-group">
                                <label class="label label_big">
                                    <fmt:message key="dhl_accounts_duties_title1"/><b><fmt:message key="dhl_accounts_duties_return_title2"/></b>
                                    <span class="label__description">
                                        <fmt:message key="dhl_accounts_duties_return_descr"/>
                                    </span>
                                </label>
                                <div class="field-row">
                                    <div class="select">
                                        <select ng-model="paymentDefaultsController.returnDutiesAndTaxesAccount.data"
                                           ng-options="return.title for return in paymentDefaultsController.availableForDutiesAndTaxes track by return.key"
                                           data-aqa-id="returnDutiesAndTaxesAccount">
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                            <button type="submit" class="btn right">Save</button>
                            <button type="button" class="btn right m-right-small" ng-click="paymentDefaultsController.cancelEditing()">Cancel</button>
                    </div>
                </div>
            </div>
        </div>
    </form>

    <div my-dhl-accounts ewf-container>
        <h5 class="h5"><fmt:message key="saved_accounts_text"/></h5>

        <div id="customPackagingList" class="overlay-grey">
            <div class="row">
                <div class="col-6">
                    <button class="btn btn_small btn_success" ng-click="ewfGridCtrl.bulkDeleteElements('shipment-settings.are_you_sure_you_want_to_delete')" ng-disabled="ewfGridCtrl.getSelectedKeysOnCurrentPage().length === 0">
                        <i class="dhlicon-remove"></i>
                        <fmt:message key="dhl_accounts_delete_title"/>
                    </button>
                </div>
                <div class="col-6 a-right">
                    <a ng-click="myDhlAccountsCtrl.showAddDialog()" href="#" class="btn btn_small btn_success">
                        <i class="dhlicon-add"></i>
                        <fmt:message key="dhl_accounts_add_dhl_account_button"/>
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
                 simple-first-column="true"
                 delete-url="/api/myprofile/accounts/delete"
                 delete-param="accounts"
                 grid-data="myDhlAccountsCtrl.gridData"
                 visible-columns="myDhlAccountsCtrl.columnsToDisplay"
                 sort-column="accountNickname">
            </div>

            <div class="row"
               ewf-grid-pagination
               grid-data="ewfGridCtrl.attributes.gridData"
               pagination-settings="ewfGridCtrl.attributes.pagination"
               on-pagination-update="ewfGridCtrl.updatePagination(pagination)">
            </div>
        </div>

    <div id="modals" class="visible" ng-cloak="" ng-if="myDhlAccountsCtrl.showEditPopup">
        <div id="modal-bg"></div>
        <div>
            <div class="modal visible modal-packaging-settings" ng-cloak="">
                <a class="modal__btn-close" ng-click="myDhlAccountsCtrl.closeDialog()"></a>
            <form id="formEditAccount" name="formEditAccount" ewf-form="accountDetails">
                <h3 ng-show="!myDhlAccountsCtrl.singleAccount.key" nls="my-accounts.dhl_accounts_add_modal_title"></h3>
                <h3 ng-show="myDhlAccountsCtrl.singleAccount.key" nls="my-accounts.dhl_accounts_edit_modal_title"></h3>
                    <div class="field-wrapper" ewf-field="accountNickname">
                        <label class="label"><fmt:message key="dhl_accounts_edit_modal_account_nickname"/></label>
                        <input type="text" class="input input_width_full" id="account_name"
                               ng-model="myDhlAccountsCtrl.singleAccount.accountNickname"
                               ewf-input="manageAccounts.accountNickname"
                               ewf-validate-required="">
                        <span class="validation-mark"></span>
                        <div ewf-field-errors></div>
                    </div>
                <div class="field-wrapper" ewf-field="accountNumber">
                    <label class="label"><fmt:message key="dhl_accounts_edit_modal_account_number"/></label>
                    <input type="text" class="input input_width_full" id="account_number"
                           ng-model="myDhlAccountsCtrl.singleAccount.accountNumber"
                           ewf-input="manageAccounts.accountNumber"
                           <%--REMOVE redundant validation will be discussed with Roman Gordienko--%>
                           <%--ewf-check-account="IMP"--%>
                    <%-- TODO: Async validation with ewf-validate-dhl-account="IMP" --%>
                           ng-class="{'ng-invalid': myDhlAccountsCtrl.accountErrors.length > 0}"
                           ng-model-options="{ updateOn: 'blur'}"
                           ewf-validate-required>
                    <span class="validation-mark"></span>
                    <div ewf-field-errors></div>
                    <div class="msg-error ng-invalid" ng-if="myDhlAccountsCtrl.accountErrors.length > 0">
                        <span ng-repeat="error in myDhlAccountsCtrl.accountErrors" nls="{{error}}">{{error}}</span>
                    </div>
                </div>
                <div ewf-field="dhlAccountType">
                    <div class="radio">
                        <input type="radio" name="radioType" id="type_shipper_edit" class="radio__input radio" value="SHIPPER" 
                           ng-model="myDhlAccountsCtrl.singleAccount.accountType"
                           ewf-input="manageAccounts.dhlAccountType"
                           ewf-validate-required>
                        <label for="type_shipper_edit" class="label">
                            <fmt:message key="dhl_accounts_edit_modal_descr1"/><b><fmt:message key="dhl_accounts_edit_modal_top_radio_button_title"/></b><fmt:message key="dhl_accounts_edit_modal_descr2"/>
                        </label>
                    </div>
                    <div class="radio">
                        <input type="radio" name="radioType" id="type_payer_edit" class="radio__input radio"  value="PAYER"
                           ng-model="myDhlAccountsCtrl.singleAccount.accountType"
                           ewf-input="manageAccounts.dhlAccountType"
                           ewf-validate-required>
                        <label for="type_payer_edit" class="label">
                            <fmt:message key="dhl_accounts_edit_modal_descr3"/><b><fmt:message key="dhl_accounts_edit_modal_title2"/></b><fmt:message key="dhl_accounts_edit_modal_descr4"/>
                        </label>
                    </div>
                </div>
                <button class="btn right"
                   ewf-click="myDhlAccountsCtrl.saveOrUpdate(formEditAccount, ewfFormCtrl)">
                    <span ng-show="!myDhlAccountsCtrl.singleAccount.key" nls="my-accounts.dhl_accounts_add_modal_title"></span>
                    <span ng-show="myDhlAccountsCtrl.singleAccount.key" nls="my-accounts.dhl_accounts_edit_modal_save_button"></span>
                </button>
            </form>
        </div>
    </div>
    </div>
    </div>
</div>
</div>
