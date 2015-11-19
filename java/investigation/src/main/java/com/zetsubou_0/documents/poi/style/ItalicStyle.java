package com.zetsubou_0.documents.poi.style;

import com.zetsubou_0.documents.poi.api.Style;
import org.apache.poi.xssf.usermodel.XSSFFont;

/**
 * Created by Kiryl_Lutsyk on 11/19/2015.
 */
public class ItalicStyle implements Style {
    @Override
    public void applyStyle(final XSSFFont font) {
        font.setItalic(true);
    }
}
