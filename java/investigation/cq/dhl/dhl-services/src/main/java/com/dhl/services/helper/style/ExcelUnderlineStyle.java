package com.dhl.services.helper.style;

import org.apache.poi.ss.usermodel.FontUnderline;
import org.apache.poi.xssf.usermodel.XSSFFont;

public class ExcelUnderlineStyle implements ExcelStyle {
    @Override
    public void applyStyle(final XSSFFont font) {
        font.setUnderline(FontUnderline.SINGLE);
    }
}
