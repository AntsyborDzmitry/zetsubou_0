package com.dhl.services.factory;

import com.dhl.services.enums.HtmlTag;
import com.dhl.services.helper.style.ExcelBoldStyle;
import com.dhl.services.helper.style.ExcelItalicStyle;
import com.dhl.services.helper.style.ExcelStyle;
import com.dhl.services.helper.style.ExcelUnderlineStyle;

public class ExcelStylesFactory {

    public static ExcelStyle getInstance(final HtmlTag tag) {
        switch (tag) {
            case I:
                return new ExcelItalicStyle();
            case B:
                return new ExcelBoldStyle();
            case U:
                return new ExcelUnderlineStyle();
            default:
                return null;
        }
    }
}
