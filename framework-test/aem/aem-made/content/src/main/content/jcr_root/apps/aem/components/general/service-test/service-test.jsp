<%@ include file="/apps/aem/components/global.jspx" %>

<jsp:useBean id="testPage" class="com.zetsubou_0.test.bean.Page">
    <jsp:setProperty name="testPage" property="title" value="${currentPage.title}" />
    <jsp:setProperty name="testPage" property="description" value="${currentPage.title} description" />
    <jsp:setProperty name="testPage" property="sling" value="${sling}" />
</jsp:useBean>

<h1>Test</h1>
${testPage}<br>
Title: ${testPage.title}<br>
Description: ${testPage.description}<br>
Hello: ${testPage.hello}<br>
RR: ${testPage.resolver}<br>