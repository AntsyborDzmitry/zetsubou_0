<%--

    This is a simple non-page component using JSP that extends the foundation parbase component.

--%>

<%@ include file="/apps/cq-testproject/components/global.jspx" %>

<%@ taglib prefix="cq-z-test" uri="http://zetsubou_0.com/taglibs/cq-testproject-taglib" %>

<p>This is an example non-page component (examplecomponent).</p>

<h1><cq-z-test:helloWorld name="CQ Blueprints User"/></h1>
