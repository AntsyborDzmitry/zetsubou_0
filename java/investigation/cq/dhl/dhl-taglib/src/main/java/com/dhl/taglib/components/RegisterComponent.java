package com.dhl.taglib.components;

import com.dhl.taglib.util.HtmlConst;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.jsp.JspException;
import javax.servlet.jsp.JspWriter;
import javax.servlet.jsp.tagext.TagSupport;
import java.io.IOException;

public class RegisterComponent extends TagSupport {

    private static final Logger LOG = LoggerFactory.getLogger(RegisterComponent.class);

    private String elements;
    private String paths;
    private String modules;

    @Override
    public int doStartTag() throws JspException {
        String[] elementsArray = parseArray(elements);
        String[] pathsArray = parseArray(paths);
        String[] modulesArray = parseArray(modules);

        JspWriter out = pageContext.getOut();
        try {
            out.write(HtmlConst.SCRIPT_START);

            out.write(getScriptPart(elementsArray, HtmlConst.REGISTER_ELEMENT));
            out.write(getScriptPart(pathsArray, HtmlConst.REGISTER_COMPONENT));
            out.write(getScriptPart(modulesArray, HtmlConst.REQUIRE_MODULE));

            out.write(HtmlConst.SCRIPT_END);
        } catch (IOException e) {
            LOG.error("Cannot process registerComponent tag: ", e);
        }
        return super.doStartTag();
    }

    private String[] parseArray(String arrayStr) {
        if(arrayStr != null) {
            String[] elements = StringUtils.split(arrayStr, ',');
            return StringUtils.stripAll(elements);
        } else {
            return null;
        }
    }

    private String getScriptPart(String[] arrayValue, String scriptPattern) {
        StringBuilder sb = new StringBuilder();

        if(null != arrayValue) {
            for(String val : arrayValue) {
                sb.append(String.format(scriptPattern, val));
            }
        }

        return sb.toString();
    }

    public String getElements() {
        return elements;
    }

    public void setElements(String elements) {
        this.elements = elements;
    }

    public String getPaths() {
        return paths;
    }

    public void setPaths(String paths) {
        this.paths = paths;
    }

    public String getModules() {
        return modules;
    }

    public void setModules(String modules) {
        this.modules = modules;
    }
}
