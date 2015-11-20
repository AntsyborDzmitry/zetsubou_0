<%@page session="false" contentType="text/html; charset=utf-8" pageEncoding="utf-8" %>
<%@include file="/apps/dhl/foundation/global.jsp"%>
<cq:setContentBundle source="page"/>

<slice:lookup var="componentProperties" appName="dhlApp" type="<%=com.dhl.components.model.ComponentProperties.class%>" />

<contact-pickup-info pickup="${componentProperties.parentControllerObject}">
    <div class="overlay-white" ng-init="isEditing = false">
        <div class="nav right">
            <a id="contactPickupShowEditInfo"
               class="nav__item btn btn_action"
               ng-click="isEditing = true"
               ng-hide="isEditing">
                   <i class="dhlicon-pencil"></i>
                   <span><fmt:message key="edit_btn"/></span>
            </a>
        </div>
        <div class="nav right">
            <a id="contactPickupHideEditInfo"
               class="nav__item btn btn_action"
               ng-click="isEditing = false"
               ng-hide="!isEditing">
                   <i class="dhlicon-pencil"></i>
                   <span><fmt:message key="hide_btn"/></span>
            </a>
        </div>

        <h3 class="margin-none"><fmt:message key="pickup_label"/></h3>
        <div class="row" ng-show="isEditing">
            <hr>
            <label class="label"><fmt:message key="pickup_location_label"/></label>
            <span class="select select_width_full">
                <select id="pickupLocationId" name="pickupLocationName"
                    ng-options="key as pickupLocation for (key, pickupLocation) in contactPickupInfoCtrl.pickupLocations"
                    ng-model="contactPickupInfoCtrl.attributes.pickup.selectedPickupLocation">
                </select>
            </span>
            <hr>
            <div id="contactPickupSpecialInstruction" class="field-row">
                <label class="label"><fmt:message key="special_instructions_for_dhl_courier_label"/></label>
                <textarea class="textarea textarea_width_full" ng-model="contactPickupInfoCtrl.attributes.pickup.instructionsForCourier"></textarea>
            </div>
        </div>
    </div>
</contact-pickup-info>