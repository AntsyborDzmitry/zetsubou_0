package com.zetsubou_0.anime.bean;

import java.util.HashSet;
import java.util.Set;

/**
 * Created by zetsubou_0 on 20.04.15.
 */
public class Series<T extends Anime> {
    private String id;
    private Set<T> seriesSet;

    public Series() {
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Set<T> getSeriesSet() {
        return seriesSet;
    }

    public void setSeriesSet(Set<T> seriesSet) {
        this.seriesSet = seriesSet;
    }

    public void addElement(T t) {
        if(seriesSet == null) {
            seriesSet = new HashSet<>();
        }
        seriesSet.add(t);
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        Series series = (Series) o;

        if (id != null ? !id.equals(series.id) : series.id != null) return false;
        if (seriesSet != null ? !seriesSet.equals(series.seriesSet) : series.seriesSet != null) return false;

        return true;
    }

    @Override
    public int hashCode() {
        int result = seriesSet != null ? seriesSet.hashCode() : 0;
        result = 31 * result + (id != null ? id.hashCode() : 0);
        return result;
    }
}
