<%--

    This is a simple non-page component using JSP that extends the foundation parbase component.

--%>

<%@ include file="/apps/aem-test/components/global.jspx" %>

<%@ taglib prefix="cq-test" uri="http://example.cqblueprints.com/taglibs/aem-test-taglib" %>

<p>This is an example non-page component (examplecomponent).</p>

<h1><cq-test:helloWorld name="CQ Blueprints User"/></h1>
