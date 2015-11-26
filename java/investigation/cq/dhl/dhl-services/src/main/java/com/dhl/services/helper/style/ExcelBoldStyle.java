package com.dhl.services.helper.style;

import org.apache.poi.xssf.usermodel.XSSFFont;

public class ExcelBoldStyle implements ExcelStyle {
    @Override
    public void applyStyle(final XSSFFont font) {
        font.setBold(true);
    }
}
