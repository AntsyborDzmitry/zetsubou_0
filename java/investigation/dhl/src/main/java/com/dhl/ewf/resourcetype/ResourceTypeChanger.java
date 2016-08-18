package com.dhl.ewf.resourcetype;

import com.dhl.ewf.Executor;
import org.apache.commons.lang3.StringUtils;
import org.codehaus.jackson.annotate.JsonIgnoreProperties;
import org.codehaus.jackson.map.ObjectMapper;

import java.io.IOException;
import java.io.PrintStream;
import java.util.*;

public class ResourceTypeChanger {

    private static final String CONTENT_PATH = "/content/dhl";

    private static final String ANSWER = "%d : %s.\n\"%s\" type was changed to \"%s\"";

    private final String oldResourceType;

    private final String newResourceType;

    private PrintStream out = System.out;

    public ResourceTypeChanger(final String oldResourceType, final String newResourceType) {
        this.oldResourceType = oldResourceType;
        this.newResourceType = newResourceType;
    }

    public void change() throws IOException {
        String result = populateResources();
        Set<String> resourcePaths = getResourcePaths(result);
        changeResources(resourcePaths);
    }

    public void setOut(final PrintStream out) {
        this.out = out;
    }

    private String populateResources() throws IOException {
        Map<String, String> requestParams = new HashMap<>();
        requestParams.put("path", CONTENT_PATH);
        requestParams.put("property", "sling:resourceType");
        requestParams.put("property.value", oldResourceType);
        requestParams.put("p.limit", "-1");
        try (Executor executor = new Executor()) {
            return executor.executeQuery(requestParams);
        }
    }

    private Set<String> getResourcePaths(final String result) throws IOException {
        Set<String> resourcePaths = new HashSet<>();
        ObjectMapper mapper = new ObjectMapper();
        QueryBuilderResponse response = mapper.readValue(result, QueryBuilderResponse.class);
        for (Map<String, String> properties : response.getHits()) {
            String path = properties.get("path");
            if (StringUtils.isNotEmpty(path)) {
                resourcePaths.add(path);
            }
        }
        return resourcePaths;
    }

    private void changeResources(final Set<String> resourcePaths) throws IOException {
        try (Executor executor = new Executor()) {
            for (String path : resourcePaths) {
                Map<String, String> params = Collections.singletonMap("sling:resourceType", newResourceType);
                int status = executor.execute(path, params);
                out.println(String.format(ANSWER, status, path, oldResourceType, newResourceType));
                out.println();
            }
            out.println(resourcePaths.size() + " resources ware updated");
        }
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    private static final class QueryBuilderResponse {

        private List<Map<String, String>> hits;

        public List<Map<String, String>> getHits() {
            return hits;
        }

        public void setHits(final List<Map<String, String>> hits) {
            this.hits = hits;
        }
    }
}
