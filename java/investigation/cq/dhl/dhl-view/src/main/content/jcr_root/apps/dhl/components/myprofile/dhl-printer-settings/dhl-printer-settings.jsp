<%@page session="false" contentType="text/html; charset=utf-8" pageEncoding="utf-8" %>
<%@include file="/apps/dhl/foundation/global.jsp"%>
<cq:setContentBundle/>

<ewf:registerComponent
        elements="printer-settings"
        paths="components/printer-setting/printer-settings-directive" />

<div printer-settings>
    <div class="row">
        <div class="col-6">
            <h3 class="margin-none"><ewf:nls bundle="shipment-settings" key="printer_settings_page_title"/></h3>
        </div>
        <hr class="hr">
    </div>
    <div class="row margin-none">
        <div class="row">
            <div><ewf:nls bundle="shipment-settings" key="printer_settings_select_printer_type"/></div>
            <span class="select select_width_half">
                <select ng-model="printerSettingsCtrl.printerType"
                    ng-options="printerType.name for printerType in printerSettingsCtrl.printerTypes track by printerType.key">
                    <option value=""><ewf:nls bundle="shipment" key="select_one"/></option>
                </select>
            </span>
        </div>
        <div class="row margin-top">
            <label class="checkbox checkbox_inline">
                <input type="checkbox" class="checkbox__input" id="printer_settings"
                   data-aqa-id="printer_settings"
                   ng-model="printerSettingsCtrl.printReceipt">
                <span class="label">
                    <ewf:nls bundle="shipment-settings" key="printer_settings_print_shipments_receipt"/>
                </span>
            </label>
        </div>

        <div class="row margin-top">
            <button class="btn" ng-click="printerSettingsCtrl.updatePrinterSettings()"><ewf:nls bundle="shipment-settings" key="save_changes_button"/></button>
            &nbsp;
            <a ng-click="printerSettingsCtrl.resetValuesToDefault()"><ewf:nls bundle="shipment-settings" key="cancel_button"/></a>
        </div>
    </div>
</div>

