<%@page session="false" contentType="text/html; charset=utf-8" pageEncoding="utf-8" %>
<%@include file="/apps/dhl/foundation/global.jsp"%>
<cq:setContentBundle/>

<ewf:registerComponent paths="directives/ewf-click/ewf-click-directive"/>

<div ng-switch-when="${properties['tabName']}">

<div ewf-profile-quick-links ewf-container>
    <form ewf-form="profile-links" name="profile_links">
        <div>
            <div class="row">
                <h5 class="margin-top-none">Manage Quick Links</h5>
                Links that are added here will be displayed on your dashboard when you login.<br><br>
            </div>
            <div class="row">
                <div class="col-4">
                    <div class="field-wrapper" ewf-field="linkName">
                        <label for="link_name" class="label">Link Name</label>
                        <input type="text" class="input" name="link_name" id="link_name"
                        ng-model="profileQuickLinksCtrl.quickLinkName"
                        ewf-input="profile_links.linkName"
                        ewf-validate-required>
                        <span class="validation-mark"></span>
                        <div ewf-field-errors></div>
                    </div>
                </div>
                <div class="col-6">
                    <div class="field-wrapper" ewf-field="linkUrl">
                        <label for="link_url" class="label">Link URL</label>
                        <input type="text" class="input input_width_full" name="link_url"
                            placeholder="http://" id="link_url"
                            ng-model="profileQuickLinksCtrl.quickLinkUrl"
                            ewf-input="profile_links.linkUrl"
                            ewf-validate-required
                            ewf-validate-pattern="^(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?$"
                            ewf-validate-pattern-message = "my-profile.error_pattern_quick_link">
                            <span class="validation-mark"></span>
                            <div ewf-field-errors></div>
                    </div>
                </div>
                <div class="col-2 a-right">
                    <br>
                    <button type="button" class="btn btn_success btn_small"
                       ewf-click="profileQuickLinksCtrl.addQuickLink(profile_links, ewfFormCtrl)">Add link</button>
                </div>
            </div>
        </div>
    </form>

    <div class="alert alert_success" ng-if="profileQuickLinksCtrl.alertTypes.added">
            <fmt:message key="add_links_success_message"/>
        </div>
        <div class="alert alert_success" ng-if="profileQuickLinksCtrl.alertTypes.updated">
            <fmt:message key="update_links_success_message"/>
        </div>
        <div class="alert alert_success" ng-if="profileQuickLinksCtrl.alertTypes.deleted">
            <fmt:message key="delete_links_success_message"/>
        </div>

        <div id="customPackagingList" class="overlay-grey">
            <div class="row">
                <div class="col-6">
                    <button class="btn btn_small btn_success" ng-click="ewfGridCtrl.bulkDeleteElements('shipment-settings.are_you_sure_you_want_to_delete')" ng-disabled="ewfGridCtrl.getSelectedKeysOnCurrentPage().length === 0">
                        <i class="dhlicon-remove"></i>
                        <fmt:message key="dhl_accounts_delete_title"/>
                    </button>
                </div>

                <div class="col-6"
                   ewf-grid-pagination
                   grid-data="ewfGridCtrl.attributes.gridData"
                   pagination-settings="ewfGridCtrl.attributes.pagination"
                   on-pagination-update="ewfGridCtrl.updatePagination(pagination)"
                   hide-page-range="true">
                </div>
            </div>

            <div ewf-grid
               delete-url="/api/myprofile/links/delete"
               delete-param="quickLinkDeletionRequest"
               update-url="/api/myprofile/links/modify"
               grid-data="profileQuickLinksCtrl.gridData"
               visible-columns="profileQuickLinksCtrl.columnsToDisplay"
               simple-first-column="true"
               use-trusted-html="true"
               sort-column="name">
            </div>

            <div class="row"
               ewf-grid-pagination
               grid-data="ewfGridCtrl.attributes.gridData"
               pagination-settings="ewfGridCtrl.attributes.pagination"
               on-pagination-update="ewfGridCtrl.updatePagination(pagination)">
            </div>
        </div>
    </div>
</div>
