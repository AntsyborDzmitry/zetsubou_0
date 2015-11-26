package com.dhl.services.enums;

import org.apache.commons.lang3.EnumUtils;

public enum HtmlTag {
    UNSUPPORTED,
    I,
    B,
    U,
    UL,
    OL,
    LI,
    P;

    /**
     * Create tag base in name
     *
     * @param name tag name
     * @return tag or "unsupported" tag if not exists
     */
    public static HtmlTag tagValue(String name) {
        HtmlTag tag = EnumUtils.getEnum(HtmlTag.class, name.toUpperCase());
        return (tag == null) ? HtmlTag.UNSUPPORTED : tag;
    }
}
