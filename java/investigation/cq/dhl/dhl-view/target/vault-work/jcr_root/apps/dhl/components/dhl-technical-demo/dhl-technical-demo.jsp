<%@page session="false" contentType="text/html; charset=utf-8" pageEncoding="utf-8" %>
<%@include file="/apps/dhl/foundation/global.jsp"%>

<div>
    <p>Boolean demo. Next block with text "Boolean demo here" will be shown, if Rewards / Promotion.Available Reward programs.nectar key is true in ADT</p>
    <div ewfc-if="Rewards / Promotion.Available Reward programs.nectar">
        Boolean demo here
    </div>
</div>
<div>
    <p>String demo. Next block with text "Boolean demo here" will be shown with text value from Rewards / Promotion.Nectar configuration.prefix ADT</p>
    <div ewfc-value="Rewards / Promotion.Nectar configuration.prefix"></div>
</div>