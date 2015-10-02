package com.zetsubou_0.pattern.journaldev.facade;

/**
 * Created by Kiryl_Lutsyk on 10/2/2015.
 */
public class OracleReport implements ReportHelper {
    @Override
    public void htmlReport(String table) {
        System.out.println("HTML Oracle report");
    }

    @Override
    public void pdfReport(String table) {
        System.out.println("PDF Oracle report");
    }
}
