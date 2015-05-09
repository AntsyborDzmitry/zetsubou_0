package com.zetsubou_0.test.scheduleimport;

/**
 * Created by Kiryl_Lutsyk on 4/1/2015.
 */
public class ScheduleManagerImpl {
    public ScheduleManagerImpl() {}

    public String fixShowName(String s) {
        String displayName = "";
        if (s.length() >= 1) {
            s = s.trim();
            String[] tempSplit = s.split("[\\s]+");
            for (String bits : tempSplit) {
                displayName = displayName + " " + bits.substring(0, 1).toUpperCase() + bits.substring(1).toLowerCase();
            }
        }
        return displayName.trim();
    }

    public String fixArticles(String title) {
        title = title.trim();
        String lower_title = title.toLowerCase();
        final String[] articles = {"A", "The"};
        for (String article : articles) {
            if (lower_title.endsWith(", " + article.toLowerCase())) {
                return article + " " + title.substring(0, title.length() - article.length() - 2);
            }
        }
        return title;
    }


}
