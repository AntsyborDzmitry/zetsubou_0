package com.zetsubou_0.pattern.journaldev.templatemethod;

/**
 * Created by Kiryl_Lutsyk on 10/2/2015.
 */
public abstract class TemplateHouse implements House {
    @Override
    public void build() {
        System.out.println("**Build new house**");
        buildFoundation();
        buildPillars();
        buildWall();
        buildWindow();
    }

    @Override
    public void buildFoundation() {
        System.out.println("Default foundation");
    }

    @Override
    public void buildWindow() {
        System.out.println("Glass window");
    }
}
