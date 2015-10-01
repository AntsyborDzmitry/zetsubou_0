package com.zetsubou_0.pattern.journaldev.prototype;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by Kiryl_Lutsyk on 10/1/2015.
 */
public class World implements Cloneable {
    private List<String> regions;

    public World() {
        regions = new ArrayList<>();
    }

    public World(List<String> regions) {
        this.regions = regions;
    }

    public List<String> getRegions() {
        return regions;
    }

    @Override
    public Object clone() throws CloneNotSupportedException {
        return new World(new ArrayList<>(regions));
    }
}
