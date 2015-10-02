package com.zetsubou_0.pattern.journaldev.facade;

/**
 * Created by Kiryl_Lutsyk on 10/2/2015.
 */
public class SqlReport implements ReportHelper {
    @Override
    public void htmlReport(String table) {
        System.out.println("HTML SQL report");
    }

    @Override
    public void pdfReport(String table) {
        System.out.println("PDF SQL report");
    }
}
