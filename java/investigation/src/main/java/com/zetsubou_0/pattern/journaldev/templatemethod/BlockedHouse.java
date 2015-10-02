package com.zetsubou_0.pattern.journaldev.templatemethod;

/**
 * Created by Kiryl_Lutsyk on 10/2/2015.
 */
public class BlockedHouse extends TemplateHouse {
    @Override
    public void buildPillars() {
        System.out.println("Metal pillars");
    }

    @Override
    public void buildWall() {
        System.out.println("Reinforced concrete walls");
    }
}
