package com.dhl.taglib.util;

public class HtmlConst {
    public static final String SCRIPT_START = "<script>";
    public static final String SCRIPT_END = "</script>";
    public static final String REGISTER_ELEMENT = "document.createElement('%s');";
    public static final String REGISTER_COMPONENT = "dhl.registerComponent('%s');";
    public static final String REQUIRE_MODULE = "dhl.needAngularModule('%s');";

    private HtmlConst() {
        //Do nothing
    }
}
