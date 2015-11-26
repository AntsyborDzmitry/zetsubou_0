<%@ page session="false" %><%
%><%@ page import="com.day.cq.commons.JS" %>
<%@taglib prefix="slice" uri="http://cognifide.com/jsp/slice" %>
<%@include file="/libs/foundation/global.jsp" %>

<slice:lookup var="translatorController" appName="dhlApp" type="<%=com.dhl.components.controller.TranslatorController.class%>" />

<html>
<head>
    <title>CQ5 Translator</title>
    
    <cq:includeClientLib css="cq.widgets" />
    <link rel="stylesheet" type="text/css" href="${translatorController.basePath}/js/ext/ux/fileuploadfield.css" />
    <link rel="stylesheet" type="text/css" href="${translatorController.basePath}/style.css" />

    <cq:includeClientLib js="cq.widgets" />
    <script type="text/javascript" src="${translatorController.basePath}/js/ext/ux/BufferView.js"></script>
    <script type="text/javascript" src="${translatorController.basePath}/js/ext/ux/FileUploadField.js"></script>
    <script type="text/javascript" src="/apps/cq/i18n/translator/js/Dialog.js"></script>
    <script type="text/javascript" src="${translatorController.basePath}/js/ImportXLIFFDialog.js"></script>
    <script type="text/javascript" src="/apps/cq/i18n/translator/js/ImportExcelDialog.js"></script>
    <script type="text/javascript" src="${translatorController.basePath}/js/TranslationsDialog.js"></script>
    <script type="text/javascript" src="/apps/cq/i18n/translator/js/translator.js"></script>
    <script type="text/javascript" src="/apps/cq/i18n/translator/js/VersionDialog.js"></script>
    <script type="text/javascript" src="/apps/cq/i18n/translator/js/versions.js"></script>
</head>
<body>
    <script>
        CQ.Translator.languages = ${translatorController.languages};
        CQ.Ext.onReady(function() {
            CQ.Translator.load("${translatorController.path}");
        })
    </script>
</body>
</html>
