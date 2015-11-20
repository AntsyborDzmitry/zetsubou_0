<%@page session="false" contentType="text/html; charset=utf-8" pageEncoding="utf-8" %>
<%@include file="/apps/dhl/foundation/global.jsp"%>
<cq:setContentBundle/>

<div ng-switch-when="${properties['tabName']}">
    <ewf:registerComponent
            elements="profile-password,
                ewf-password"
            paths="components/profile-settings/profile-password/profile-password-directive,
                directives/ewf-form/ewf-form-directive,
                directives/ewf-input/ewf-input-controller,
                directives/ewf-validate/ewf-validate-pattern-directive,
                directives/ewf-validate/ewf-validate-required-directive,
                directives/ewf-click/ewf-click-directive"/>

    <profile-password ewf-form="profile-details">

    <form name="profileChangePassword"  ng-if="ewfFormCtrl.rulesObtained" save-to-local-storage="" novalidate>
        <div class="row">
            <h5 class="margin-top-none"><fmt:message key="change_password_title"/><i class="dhlicon-lock"></i></h5>
        </div>
        <div id="alert_password_changed_success" class="alert alert_success" ng-if="profilePasswordCtrl.passwordUpdated">
            <fmt:message key="change_password_password_changed"/>
        </div>
        <div ng-init="profileChangePassword.updatePassword = false">
            <div class="row">
                <div class="col-4">
                    <label class="label"><fmt:message key="change_password_email_address"/></label>
                    <b><label class="label">{{profilePasswordCtrl.emailAddress}}</label></b><br>
                </div>
                <div class="col-8">
                    <i>
                        <label class="label">
                            <fmt:message key="change_password_contact_dhl" var="contact_dhl" />
                            <fmt:message key="change_password_notice_email">
                                <fmt:param value="<a href='dhl-help.html'>${contact_dhl}</a>" />
                            </fmt:message>
                        </label>
                    </i><br>
                </div>
            </div>
            <div class="row">
                <div class="col-4">
                    <div class="field-wrapper" ewf-field="oldPassword">
                        <label class="label"><fmt:message key="change_password_current_password"/></label>
                        <input type="password" name="currentPassword" id="input_current-password" class="input input_width_full"
                           ng-model="profilePasswordCtrl.oldPassword"
                           ng-change="profileChangePassword.updatePassword = true"
                           ewf-validate-password-equality="{passwordField: 'ewfPasswordCtrl.password', operation: 'differs', errorMessage: 'errors.password_identical'}"
                           ewf-input="profile-details.oldPassword"
                           ewf-validate-required
                           exclude-from-local-storage>

                        <span class="validation-mark"></span>
                        <div ewf-field-errors></div>
                    </div>
                    <ewf-password ewf-form-name="profile-details" ng-model="profilePasswordCtrl.newPassword"></ewf-password>

                </div>
            </div>
            <div class="row a-right">
                <br>
                <button type="button" class="btn"
                   ewf-click="profilePasswordCtrl.updatePassword()"
                   ng-show="profileChangePassword.updatePassword">
                    <fmt:message key="change_password_update_password"/>
                </button>
            </div>
        </div>
    </form>

</profile-password>
</div>
