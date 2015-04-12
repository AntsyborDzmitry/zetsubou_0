<%@ include file="/apps/aem-generated/components/global.jspx" %>
<%@ page import="org.apache.sling.api.resource.LoginException,
org.apache.sling.api.resource.ResourceResolver,
org.apache.sling.api.resource.ResourceResolverFactory,
org.apache.sling.api.scripting.SlingScriptHelper,
org.osgi.framework.Constants,
org.slf4j.Logger,
org.slf4j.LoggerFactory,
javax.jcr.Node,
javax.jcr.NodeIterator,
javax.jcr.RepositoryException,
javax.jcr.Session,
javax.jcr.query.Query,
javax.jcr.query.QueryManager,
javax.servlet.jsp.PageContext,
java.util.HashSet,
java.util.Map,
java.util.Set;" %>
<%
    String TYPE_QUERY = "//element (*, nt:file)";
    String ROOT_PATH = "/jcr:root";
    final String DEFAULT_PATH = "/content/tmp/files";

    Set<Node> nodes = new HashSet<Node>();
    String querySting = ROOT_PATH + DEFAULT_PATH + TYPE_QUERY +
        "/jcr:content [jcr:contains(. ,'" + "CERN" + "')]" +
        "/..";

    try {
        final QueryManager queryManager = resourceResolver.adaptTo(Session.class).getWorkspace().getQueryManager();
        final Query query = queryManager.createQuery(querySting, Query.XPATH);
        NodeIterator iterator = query.execute().getNodes();

        if(iterator != null) {
            while(iterator.hasNext()) {
                nodes.add(iterator.nextNode());
            }
        }
    } catch (RepositoryException e) {
    }

%>

<h3>File XPath</h3>

<div>From service (<%=nodes.size()%>):</div>
<ul>
    <%
        int count = 1;
        for(Node node : nodes) {
    %>
        <li><b><%=count++%></b> <%=node.getPath()%></li>
    <%}%>
</ul>