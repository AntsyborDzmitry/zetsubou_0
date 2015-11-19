package com.zetsubou_0.documents.poi.style;

import com.zetsubou_0.documents.poi.api.Style;
import org.apache.poi.ss.usermodel.FontUnderline;
import org.apache.poi.xssf.usermodel.XSSFFont;

/**
 * Created by Kiryl_Lutsyk on 11/19/2015.
 */
public class UnderlineStyle implements Style {
    @Override
    public void applyStyle(XSSFFont font) {
        font.setUnderline(FontUnderline.SINGLE);
    }
}
