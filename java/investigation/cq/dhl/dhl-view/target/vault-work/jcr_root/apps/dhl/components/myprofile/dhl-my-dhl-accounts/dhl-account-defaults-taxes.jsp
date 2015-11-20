<%@page session="false" contentType="text/html; charset=utf-8" pageEncoding="utf-8" %>
<%@include file="/apps/dhl/foundation/global.jsp"%>
<cq:setContentBundle source="page"/>

<h5 class="h5">
    Account Defaults for Duties and Taxes
</h5>

<div class="field-group">
    <label class="label label_big">
        Duties and taxes on  <b>export shipments</b>
        <span class="label__description">
            (from my country to another country)
        </span>
    </label>
    <div class="field-row">
        <div class="select">
            <select ng-model="paymentDefaultsController.defaultAccounts.exportDutiesAndTaxesAccount.account"
                    ng-options="export.title for export in paymentDefaultsController.defaultAccounts.available2 track by export.key">
            </select>
        </div>
    </div>
</div>

<div class="field-group">
    <label class="label label_big">
        Duties and taxes on  <b>import shipments</b>
        <span class="label__description">
            (from another country to my country)
        </span>
    </label>
    <div class="field-row">
        <div class="select">
            <select ng-model="paymentDefaultsController.defaultAccounts.importDutiesAndTaxesAccount.account"
                    ng-options="imports.title for imports in paymentDefaultsController.defaultAccounts.available2 track by imports.key">
            </select>
        </div>
    </div>
</div>

<div class="field-group">
    <label class="label label_big">
        Duties and taxes on  <b>return shipments</b>
        <span class="label__description">
            (from another country to my country)
        </span>
    </label>
    <div class="field-row">
        <div class="select">
            <select ng-model="paymentDefaultsController.defaultAccounts.returnDutiesAndTaxesAccount.account"
                    ng-options="return.title for return in paymentDefaultsController.defaultAccounts.available2 track by return.key">
            </select>
        </div>
    </div>
</div>