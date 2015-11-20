<%@page session="false" contentType="text/html; charset=utf-8" pageEncoding="utf-8" %>
<%@include file="/apps/dhl/foundation/global.jsp"%>
<cq:setContentBundle source="page"/>

<h5 class="h5">
    Account Defaults for Shipments
</h5>

<div class="field-group">
    <label class="label label_big">
        <b>Domestic</b>
        <span class="label__description">
            (in countries where available)
        </span>
    </label>
    <div class="field-row">
        <div class="select">
            <select ng-model="paymentDefaultsController.defaultAccounts.domesticShipmentAccount.account"
                    ng-options="domesticAccount.title for domesticAccount in paymentDefaultsController.defaultAccounts.available track by domesticAccount.key">
            </select>
        </div>
    </div>

    <%--<label class="checkbox">--%>
        <%--<input id="domesticTransportationCharges" type="checkbox" class="checkbox__input" data-aqa-id="domesticTransportationCharges"--%>
               <%--ng-model="paymentDefaultsController.defaultAccounts[0].transportationCharges">--%>
        <%--<span class="label">Use this account for transportation changes</span>--%>
    <%--</label>--%>
</div>

<div class="field-group">
    <label class="label label_big">
        <b>Export</b>
        <span class="label__description">
            (from my country to another country)
        </span>
    </label>
    <div class="field-row">
        <div class="select">
            <select ng-model="paymentDefaultsController.defaultAccounts.exportShipmentAccount.account"
                    ng-options="exportAccount.title for exportAccount in paymentDefaultsController.defaultAccounts.available track by exportAccount.key">
            </select>
        </div>
    </div>
    <%--<label class="checkbox">--%>
        <%--<input id="exportTransportationCharges" type="checkbox" class="checkbox__input" data-aqa-id="exportTransportationCharges"--%>
               <%--ng-model="paymentDefaultsController.defaultAccounts[1].transportationCharges">--%>
        <%--<span class="label">Use this account for transportation changes</span>--%>
    <%--</label>--%>
</div>

<div class="field-group">
    <label class="label label_big">
        <b>Import shipments</b>
        <span class="label__description">
            (from another country to my country)
        </span>
    </label>
    <div class="field-row">
        <div class="select">
            <select ng-model="paymentDefaultsController.defaultAccounts.importShipmentAccount.account"
                    ng-options="importAccount.title for importAccount in paymentDefaultsController.defaultAccounts.available track by importAccount.key">
            </select>
        </div>
    </div>
    <%--<label class="checkbox">--%>
        <%--<input id="importTransportationCharges" type="checkbox" class="checkbox__input" data-aqa-id="importTransportationCharges" --%>
               <%--ng-model="paymentDefaultsController.defaultAccounts[2].transportationCharges">--%>
        <%--<span class="label">Use this account for transportation changes</span>--%>
    <%--</label>--%>
</div>


<div class="field-group">
    <label class="label label_big">
        <b>Domestic return shipments</b>
        <span class="label__description">
            (within my country)
        </span>
    </label>
    <div class="field-row">
        <div class="select">
            <select ng-model="paymentDefaultsController.defaultAccounts.domesticRetShipmentAccount.account"
                    ng-options="domesticReturn.title for domesticReturn in paymentDefaultsController.defaultAccounts.available track by domesticReturn.key">
            </select>
        </div>
    </div>
    <%--<label class="checkbox">--%>
        <%--<input id="domesticReturnTransportationCharges" type="checkbox" class="checkbox__input" data-aqa-id="domesticReturnTransportationCharges"--%>
               <%--ng-model="paymentDefaultsController.defaultAccounts[3].transportationCharges">--%>
        <%--<span class="label">Use this account for transportation changes</span>--%>
    <%--</label>--%>
</div>

<div class="field-group">
    <label class="label label_big">
        <b>International return shipments</b>
        <span class="label__description">
            (within my country)
        </span>
    </label>
    <div class="field-row">
        <div class="select">
            <select ng-model="paymentDefaultsController.defaultAccounts.internRetShipmentAccount.account"
                    ng-options="internationalReturn.title for internationalReturn in paymentDefaultsController.defaultAccounts.available track by internationalReturn.key">
            </select>
        </div>
    </div>
    <%--<label class="checkbox">--%>
        <%--<input id="internationalReturnTransportationCharges" type="checkbox" class="checkbox__input" data-aqa-id="internationalReturnTransportationCharges" --%>
               <%--ng-model="paymentDefaultsController.defaultAccounts[4].transportationCharges">--%>
        <%--<span class="label">Use this account for transportation changes</span>--%>
    <%--</label>--%>
</div>