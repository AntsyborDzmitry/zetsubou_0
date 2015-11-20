package com.zetsubou_0.documents.poi.helper;

import com.zetsubou_0.documents.poi.api.ExcelStyle;
import com.zetsubou_0.documents.poi.builder.ExcelDocumentBuilder;
import com.zetsubou_0.documents.poi.exception.DocumentException;
import com.zetsubou_0.documents.poi.style.ExcelBoldStyle;
import com.zetsubou_0.documents.poi.style.ExcelItalicStyle;
import com.zetsubou_0.documents.poi.style.ExcelUnderlineStyle;
import org.apache.commons.lang3.StringUtils;
import org.jsoup.Jsoup;
import org.jsoup.nodes.*;

import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.util.ArrayList;
import java.util.List;

public class FormattedStringParserUtil {
    private static final String[] AVAILABLE_TAGS = {"i", "b", "u"};
    private static final String REGEX = ".*<\\/?[%s]>.*";

    private String text;
    private String regex;
    private ExcelDocumentBuilder builder;

    public FormattedStringParserUtil(String text) throws DocumentException {
        this.text = text;
        init();
    }

    public void parseAndFillCell(ExcelDocumentBuilder builderWithCell) throws DocumentException {
        Document document = Jsoup.parse(text);
        this.builder = builderWithCell;
        parseString(document.body().childNodes(), null);
    }

    protected void init() {
        StringBuilder tags = new StringBuilder(AVAILABLE_TAGS.length);
        for (String tag : AVAILABLE_TAGS) {
            tags.append(tag);
        }
        this.regex = String.format(REGEX, tags.toString());
    }

    private void parseString(List<Node> nodes, List<ExcelStyle> styles) throws DocumentException {
        for (Node node : nodes) {
            List<ExcelStyle> s;
            if (styles != null) {
                s = new ArrayList<>(styles);
            } else {
                s = new ArrayList<>();
            }
            if (AVAILABLE_TAGS[0].equals(node.nodeName())) {
                s.add(new ExcelItalicStyle());
            } else if (AVAILABLE_TAGS[1].equals(node.nodeName())) {
                s.add(new ExcelBoldStyle());
            } else if (AVAILABLE_TAGS[2].equals(node.nodeName())) {
                s.add(new ExcelUnderlineStyle());
            }
            parseString(node.childNodes(), s);
            ExcelStyle[] stylesArray;
            if (styles != null) {
                stylesArray = new ExcelStyle[styles.size()];
                styles.toArray(stylesArray);
            } else {
                stylesArray = new ExcelStyle[0];
            }

            String text = node.toString().replace("\n", StringUtils.EMPTY);

            if (!text.matches(this.regex)) {
                builder.appendCellText(text, stylesArray);
            }
        }
    }

    public static void main(String[] args) {
        try {
            FormattedStringParserUtil parser = new FormattedStringParserUtil("I'm <i>fat <b>crab</b></i> ...");
            ExcelDocumentBuilder builder = new ExcelDocumentBuilder();
            builder.appendSheet("D").appendRow().appendCell();
            parser.parseAndFillCell(builder);
            parser.builder.fillCellString();
            parser.builder.build(new FileOutputStream("D:/t.xlsx"));
        } catch (DocumentException e) {
            e.printStackTrace();
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        }
    }
}
