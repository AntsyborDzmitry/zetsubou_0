package com.zetsubou_0.carchooser.core.been.car;

import java.util.Calendar;

public class Model {

    private final String company;

    private final String title;

    private final Calendar year;

    public Model(final String company, final String title, final Calendar year) {
        this.company = company;
        this.title = title;
        this.year = year;
    }

    public String getCompany() {
        return company;
    }

    public String getTitle() {
        return title;
    }

    public Calendar getYear() {
        return year;
    }
}
