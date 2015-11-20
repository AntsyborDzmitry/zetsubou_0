<%@page session="false" contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
<%@include file="/apps/dhl/foundation/global.jsp"%>
<slice:lookup var="model" type="<%=com.dhl.components.model.ProfileDetailsModel.class%>" />

<!--<div class="address-book-modal" ng-if="!ewfFormCtrl.rulesObtained">
    <div class="la-ball-pulse"><div></div><div></div><div></div></div>
</div> -->
<c:set var="isUserProfileBookPage" value="${true}" scope="request" />
<ewf:registerComponent
        elements="ewf-profile-settings"
        paths="components/profile-settings/profile-settings-directive,
            directives/ewf-spinner/ewf-spinner-directive" />

<div class="spinner-wrapper"
   ewf-spinner
   data-aq-id="spinner"
   ng-show="ewfSpinnerCtrl.isSpinnerVisible()">
    <div class="spinner-wrapper__spinner"></div>
</div>

<ewf-profile-settings ewf-form="profile-details">
<div class="container">
    <h1 class="page-title">My Profile and Settings</h1>
    <section class="area row area_tabs">
        <div class="col-2 col-2_tabs">
            <ul class="tabs tabs_vertical tabs_vertical_full">
                <c:if test="${not empty model.profileTabs}">
                    <c:forEach var="tab" items="${model.profileTabs}">
                      <li class="tabs__item"
                          ng-class="{'is-active': profileSettingsCtrl.currentTab === '${tab.tabNameProp}'}"
                          ng-if="profileSettingsCtrl.canShowTabByName('${tab.tabNameProp}')">
                          <a href="#" ng-click="profileSettingsCtrl.setCurrentTab('${tab.tabNameProp}')">
                                ${tab.tabTitleProp}
                          </a>
                      </li>
                    </c:forEach>
                </c:if>
            </ul>
        </div>
        <div class="col-10 tab-content">
            <div ng-switch="profileSettingsCtrl.currentTab">
                <cq:include path="tabs-container" resourceType="foundation/components/parsys" />
            </div>
        </div>
    </section>
</div>
</ewf-profile-settings>