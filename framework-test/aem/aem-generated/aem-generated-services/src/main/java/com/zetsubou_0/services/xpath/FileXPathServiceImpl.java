package com.zetsubou_0.services.xpath;


import org.apache.felix.scr.annotations.*;
import org.apache.sling.api.resource.LoginException;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ResourceResolverFactory;
import org.apache.sling.api.scripting.SlingScriptHelper;
import org.osgi.framework.Constants;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.jcr.Node;
import javax.jcr.NodeIterator;
import javax.jcr.RepositoryException;
import javax.jcr.Session;
import javax.jcr.query.Query;
import javax.jcr.query.QueryManager;
import javax.servlet.jsp.PageContext;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

@Component(immediate = true, metatype = true)
@Service(FileXPathService.class)
@Properties({
        @Property(name = Constants.SERVICE_VENDOR, value = "AEM Test"),
        @Property(name = Constants.SERVICE_DESCRIPTION, value = "Provide xpath request tools")
})
public class FileXPathServiceImpl implements FileXPathService {
    public static final String TYPE_QUERY = "//element (*, nt:file)";
    public static final String ROOT_PATH = "/jcr:root";
    public static final String DEFAULT_PATH = "/content/tmp/files";

    private static final Logger LOG = LoggerFactory.getLogger(FileXPathServiceImpl.class);

    private Map<String, String> params;
    private PageContext pageContext;

    @Reference
    private ResourceResolverFactory resourceResolverFactory;

    public Set<Node> getResults() {
        Set<Node> nodes = new HashSet<Node>();
        String querySting = ROOT_PATH + getPath() + TYPE_QUERY;

        try {
            final ResourceResolver resourceResolver = resourceResolverFactory.getAdministrativeResourceResolver(null);
            final QueryManager queryManager = resourceResolver.adaptTo(Session.class).getWorkspace().getQueryManager();
            final Query query = queryManager.createQuery(querySting, Query.XPATH);
            NodeIterator iterator = query.execute().getNodes();

            if(iterator != null) {
                while(iterator.hasNext()) {
                    nodes.add(iterator.nextNode());
                }
            }
        } catch (LoginException e) {
            LOG.error(e.getMessage(), e);
        } catch (RepositoryException e) {
            LOG.error(e.getMessage(), e);
        }

        return nodes;
    }

    public void setParems(Map<String, String> params) {

    }

    private String getPath() {
        String path = DEFAULT_PATH;
        if(params != null && params.containsKey(PATH_KEY)) {
            path = params.get(PATH_KEY);
        }
        return path;
    }

}
