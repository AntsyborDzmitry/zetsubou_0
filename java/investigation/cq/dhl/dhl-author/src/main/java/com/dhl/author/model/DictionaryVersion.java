package com.dhl.author.model;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

/**
 * Bean that is used to represent data for i18n history.
 */
public class DictionaryVersion {
    private Integer total;
    private List<Entry> paths = new ArrayList<>();

    public List<Entry> getPaths() {
        return paths;
    }

    public void setPaths(List<Entry> paths) {
        this.paths = paths;
    }

    public Integer getTotal() {
        return total;
    }

    public void setTotal(Integer total) {
        this.total = total;
    }

    public void setPaths(Set<String> paths) {
        for (String version : paths) {
            this.paths.add(new Entry(version));
        }
    }

    class Entry {

        private String path;

        public Entry(String path){
            this.path = path;
        }

        public String getPath() {
            return path;
        }

        public void setPath(String path) {
            this.path = path;
        }
    }
}
