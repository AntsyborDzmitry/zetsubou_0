<%@page session="false" contentType="text/html; charset=utf-8" pageEncoding="utf-8" %>
<%@include file="/apps/dhl/foundation/global.jsp"%>
<cq:setContentBundle/>

<div ng-switch-when="${properties['tabName']}">
    <div ewfc-if="Rewards / Promotion.Available Reward programs.nectar">
        <script>
            document.createElement('profile-rewards');
            dhl.registerComponent('components/profile-settings/profile-rewards/profile-rewards-directive');
        </script>
        <profile-rewards>
            <form ng-submit="profileRewardsCtrl.$valid" name="profile_rewards">
                <div class="row">
                    <h5 class="margin-top-none"><fmt:message key="manage_reward_card_title"/></h5>
                </div>
                <div class="row">
                    <div class="col-12">
                       <div class="col-7 col-offset-1">
                            <b><fmt:message key="manage_reward_card_text_title"/></b>
                            <br>
                                <fmt:message key="manage_reward_card_text"/>
                            <br><br>
                        </div>
                        <div ng-if="profileRewardsCtrl.showRewardProgramForNewUser" class="col-4">
                            <div class="callout">
                                <span><fmt:message key="nectar_card_reward_program_message"/></span>
                                <a ng-href="{{profileRewardsCtrl.rewardProgramURL}}" target="_blank"><fmt:message key="nectar_website_link"/></a>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row" ewf-form="profile-details">
                    <div class="col-3 field-wrapper">
                        <label class="label"><b><fmt:message key="nectar_rewards_card_number"/></b></label>
                        <div class="field-wrapper nectar-rewards" ewf-field="nectarPoints">
                            <label class="label number-placeholder" ewfc-value="Rewards / Promotion.Nectar configuration.prefix"></label>
                            <div ewf-field="nectarPoints">
                                <input id="nectarPoints" name="nectarPoints"
                                    class="input input_width_full" type="text"
                                    ng-model="profileRewardsCtrl.profileRewardSecondPart"
                                    <%--TODO move functionality of server error response to ewf-validation --%>
                                    ng-class="{'ng-invalid': profileRewardsCtrl.errorMessages.length > 0}"
                                    ewf-input="profile-details.nectarPoints"
                                    ewf-validate-pattern="{{profileRewardsCtrl.patterns.numeric}}"
                                    ewf-validate-pattern-message = "my-profile.error_pattern_nectar_card_number"
                                    maxLength="11"
                                    placeholder="{{profileRewardsCtrl.defaultRewardSecondPart}}">
                                <span class="validation-mark"></span>
                                <div ewf-field-errors></div>
                                <div class="msg-error ng-invalid" ng-if="profileRewardsCtrl.errorMessages.length > 0">
                                    <span ng-repeat="error in profileRewardsCtrl.errorMessages" nls="{{error}}">{{error}}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row a-right">
                    <br>
                    <button type="button" class="btn" ng-click="profileRewardsCtrl.updateRewardNumber()"><fmt:message key="update_rewards_card_button"/></button>
                </div>
            </form>
        </profile-rewards>
    </div>
</div>
