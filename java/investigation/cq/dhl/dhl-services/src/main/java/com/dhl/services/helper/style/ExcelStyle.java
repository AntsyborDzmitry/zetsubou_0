package com.dhl.services.helper.style;

import org.apache.poi.xssf.usermodel.XSSFFont;

/**
 * Applied style for font depends on type.
 */
public interface ExcelStyle {
    /**
     * Applied style for font depends on type.
     *
     * @param font Font where new functionality is added
     */
    void applyStyle(XSSFFont font);
}
