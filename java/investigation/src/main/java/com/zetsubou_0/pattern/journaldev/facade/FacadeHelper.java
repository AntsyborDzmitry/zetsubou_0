package com.zetsubou_0.pattern.journaldev.facade;

/**
 * Created by Kiryl_Lutsyk on 10/2/2015.
 */
public class FacadeHelper {
    public static void report(BaseType baseType, ReportType reportType, String table) {
        ReportHelper report = null;
        switch(baseType) {
            case SQL:
                report = new SqlReport();
                break;
            case ORACLE:
                report = new OracleReport();
                break;
        }

        if(report != null) {
            if(reportType == ReportType.HTML) {
                report.htmlReport(table);
            } else if(reportType == ReportType.PDF)
                report.pdfReport(table);
        }
    }

    public enum ReportType {
        HTML, PDF;
    }

    public enum BaseType {
        SQL, ORACLE;
    }
}
