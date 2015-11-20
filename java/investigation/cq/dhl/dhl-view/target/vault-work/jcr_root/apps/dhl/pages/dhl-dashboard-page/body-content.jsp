<%@page session="false" contentType="text/html; charset=utf-8" pageEncoding="utf-8" %>
<%@include file="/apps/dhl/foundation/global.jsp"%>

<div class="log">
    <div class="area__background"></div>
    <div class="container">
        <div class="col-8">
            <cq:include path="content" resourceType="foundation/components/parsys"/>
        </div>
        <div class="col-3 offset-1">
            <cq:include path="sidebar" resourceType="foundation/components/parsys"/>
        </div>
    </div>
</div>