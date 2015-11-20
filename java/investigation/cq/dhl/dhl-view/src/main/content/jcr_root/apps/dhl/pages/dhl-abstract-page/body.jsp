<%@page session="false" contentType="text/html; charset=utf-8" pageEncoding="utf-8" %>
<%@include file="/apps/dhl/foundation/global.jsp"%>
<slice:lookup var="wcmMode" appName="dhlApp" type="<%=com.dhl.components.model.WCMModeModel.class%>" />

<body>
<cq:include script="body-header.jsp" />
<cq:include script="body-content.jsp"/>
<cq:include script="body-footer.jsp"/>

<script src="/etc/clientlibs/dhl/global/public/js/lib/require.js"
        data-main="/etc/clientlibs/dhl/global/public/js/main.js"></script>

<c:if test="${wcmMode.editMode}">
    <ewf:registerComponent paths="/etc/clientlibs/dhl-author/livetranslation.js" />
</c:if> 


<!-- START OF SmartSource Data Collector TAG v10.4.1 -->
<!-- Copyright (c) 2014 Webtrends Inc.  All rights reserved. -->
<script>
window.webtrendsAsyncInit=function(){
    var dcs=new Webtrends.dcs().init({
        dcsid:"dcs222w89jn5uaoy9wvtlhdfe_xxxx",
        domain:"statse.webtrendslive.com",
        timezone:1,
        fpcdom:".dhl.com",
        plugins:{
            hm:{src:"//s.webtrends.com/js/webtrends.hm.js"}
        }
        }).track();
};
(function(){
    var s=document.createElement("script"); s.async=true; s.src="/etc/clientlibs/dhl/global/js_libs/webtrends/webtrends.js";
    var s2=document.getElementsByTagName("script")[0]; s2.parentNode.insertBefore(s,s2);
}());
</script>
<noscript><img alt="dcsimg" id="dcsimg" width="1" height="1" src="//statse.webtrendslive.com/dcs222w89jn5uaoy9wvtlhdfe_4x4o/njs.gif?dcsuri=/nojavascript&amp;WT.js=No&amp;WT.tv=10.4.1&amp;dcssip=www.dhl.com"/></noscript>
<!-- END OF SmartSource Data Collector TAG v10.4.1 -->
</body>