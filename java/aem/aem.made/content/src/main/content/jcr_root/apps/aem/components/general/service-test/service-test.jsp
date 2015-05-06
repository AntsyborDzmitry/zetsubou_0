<%@ include file="/apps/aem/components/global.jspx" %>

<jsp:useBean id="testPage" class="com.zetsubou_0.test.bean.Page">
    <jsp:setProperty name="testPage" property="title" value="${currentPage.title}" />
    <jsp:setProperty name="testPage" property="sling" value="${sling}" />
</jsp:useBean>

Token: ${testPage.connection}