package com.zetsubou_0.pattern.journaldev.templatemethod;

/**
 * Created by Kiryl_Lutsyk on 10/2/2015.
 */
public class WoodHouse extends TemplateHouse {
    @Override
    public void buildPillars() {
        System.out.println("Wood pillars");
    }

    @Override
    public void buildWall() {
        System.out.println("Wood walls");
    }
}
