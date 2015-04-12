package com.zetsubou_0.services.xpath;

import javax.jcr.Node;
import java.util.Map;
import java.util.Set;

public interface FileXPathService {
    final String PATH_KEY = "path";
    final String WORD_KEY = "word";

    void setParams(Map<String, String> params);
    Set<Node> getResults();
}
