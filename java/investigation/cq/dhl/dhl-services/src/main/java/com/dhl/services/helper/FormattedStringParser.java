package com.dhl.services.helper;

import com.dhl.services.enums.HtmlTag;
import com.dhl.services.exception.DocumentException;
import com.dhl.services.factory.ExcelStylesFactory;
import com.dhl.services.helper.builder.ExcelDocumentBuilder;
import com.dhl.services.helper.style.ExcelStyle;
import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang3.StringEscapeUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.poi.xssf.usermodel.XSSFCell;
import org.apache.poi.xssf.usermodel.XSSFFont;
import org.apache.poi.xssf.usermodel.XSSFRichTextString;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Node;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.ArrayList;
import java.util.List;

public class FormattedStringParser {
    private static final Logger LOG = LoggerFactory.getLogger(FormattedStringParser.class);
    private static final String TAG_REGEX = ".*<\\/?[%s]>.*";
    private static final String ORDERED_LIST_REGEX = "^\\s*(\\d)+[.].+";
    private static final String UNORDERED_LIST_REGEX = "^\\s*(\\u2022)+.+";
    private static final String DIGITAL_REGEX = "^\\s*\\d+[.]";
    private static final String PARAGRAPH_REGEX = "</?p>";
    private static final String NEW_LINE = "\n";
    private static final String LIST_MARKER = "\u2022";
    private static final String DOT = ".";
    private static final String OPEN = "<%s>";
    private static final String CLOSE = "</%s>";

    private String regex;
    private ExcelDocumentBuilder builder;
    private boolean isOlOpen = false;
    private boolean isUlOpen = false;

    public FormattedStringParser() {
        init();
    }

    /**
     * Parse HTML text and add formatted text into XLS cell
     *
     * @param builderWithCell builder that contain cell
     * @param text html text or plain text
     * @throws DocumentException
     */
    public void parseAndFillCell(final ExcelDocumentBuilder builderWithCell, final String text) throws
            DocumentException {
        String result = parseParagraph(text);
        result = parseHtmlFindList(result);
        final Document document = Jsoup.parse(result);
        this.builder = builderWithCell;
        parseString(document.body().childNodes(), null);
        this.builder.fillCellString();
    }

    /**
     * Parse text into cell and return HTML representation
     *
     * @param cell XLS cell with text
     * @return HTML text
     */
    public String parseCellText(final XSSFCell cell) {
        final StringBuilder text = new StringBuilder();

        if (cell != null) {
            appendCellText(text, cell);
        }

        final StringBuilder result = new StringBuilder();
        final String[] strParts = text.toString().split(NEW_LINE);
        if (strParts.length > 1) {
            for (final String stringLine : strParts) {
                result.append(String.format(OPEN, HtmlTag.P.toString().toLowerCase()));
                result.append(checkLists(stringLine));
                result.append(String.format(CLOSE, HtmlTag.P.toString().toLowerCase()));
            }
        } else {
            result.append(checkLists(text.toString()));
        }
        result.append(checkAndClose(true, true));

        return result.toString();
    }

    protected void init() {
        final StringBuilder tags = new StringBuilder(HtmlTag.values().length);
        for (final HtmlTag tag : HtmlTag.values()) {
            tags.append(tag.toString().toLowerCase());
        }
        this.regex = String.format(TAG_REGEX, tags.toString());
    }

    private void appendCellText(final StringBuilder stringBuilder, final XSSFCell cell) {
        int readStringLength = 0;
        final XSSFRichTextString cellValue = cell.getRichStringCellValue();
        for (int run = 0; run < cellValue.numFormattingRuns(); run++) {
            XSSFFont font = null;
            // throw null pointer exception when got font of bullet (\u2022),
            // but could continue working (bullet without any styles)
            try {
                font = cellValue.getFontOfFormattingRun(run);
            } catch (final NullPointerException e) { // NOSONAR
                LOG.info("Font for string \"{}\" throw null pointer exception", cellValue);
            }

            createTags(stringBuilder, font, OPEN);

            final String cellSubstring = cellValue.getString().substring(readStringLength,
                    cellValue.getLengthOfFormattingRun(run) + readStringLength);
            stringBuilder.append(cellSubstring);
            readStringLength += cellValue.getLengthOfFormattingRun(run);

            createTags(stringBuilder, font, CLOSE);
        }
    }

    private void parseString(final List<Node> nodes, final List<ExcelStyle> styles) throws DocumentException {
        for (final Node node : nodes) {
            final List<ExcelStyle> nodeStyles = (CollectionUtils.isEmpty(styles))
                    ? new ArrayList<ExcelStyle>() : new ArrayList<>(styles);

            HtmlTag tag = HtmlTag.tagValue(node.nodeName());

            final ExcelStyle excelStyle = ExcelStylesFactory.getInstance(tag);
            if (excelStyle != null) {
                nodeStyles.add(excelStyle);
            }
            parseString(node.childNodes(), nodeStyles);
            final ExcelStyle[] stylesArray;
            if (styles != null) {
                stylesArray = new ExcelStyle[styles.size()];
                styles.toArray(stylesArray);
            } else {
                stylesArray = new ExcelStyle[0];
            }

            String text = node.toString();
            if (text.startsWith(NEW_LINE)) {
                text = text.replace(NEW_LINE, StringUtils.EMPTY);
            }

            if (!text.matches(this.regex)) {
                builder.appendCellText(StringEscapeUtils.unescapeHtml4(text), stylesArray);
            }
        }
    }

    private String parseParagraph(String text) {
        final StringBuilder result = new StringBuilder();
        final String[] parts = text.split(PARAGRAPH_REGEX);
        if (parts.length > 1) {
            for (final String paragraph : parts) {
                if (StringUtils.isNoneBlank(paragraph)) {
                    result.append(paragraph);
                    result.append(NEW_LINE);
                }
            }
        } else {
            result.append(text);
        }
        return result.toString();
    }

    private String parseHtmlFindList(final String text) {
        final Document document = Jsoup.parse(text);
        final StringBuilder result = new StringBuilder();

        for (final Node node : document.body().childNodes()) {
            result.append(getWrappedTextByNodeName(node));
        }
        return result.toString();
    }

    private StringBuilder getWrappedTextByNodeName(Node node) {
        final StringBuilder result = new StringBuilder();
        switch (HtmlTag.tagValue(node.nodeName())) {
            case UL:
                return result.append(createXlsList(node, false));
            case OL:
                return result.append(createXlsList(node, true));
            default:
                return result.append(node);
        }
    }

    private void createTags(final StringBuilder text, final XSSFFont font, final String tag) {
        if (font != null) {
            if (font.getBold()) {
                text.append(String.format(tag, HtmlTag.B.toString().toLowerCase()));
            }
            if (font.getItalic()) {
                text.append(String.format(tag, HtmlTag.I.toString().toLowerCase()));
            }
            if (font.getUnderline() != 0) {
                text.append(String.format(tag, HtmlTag.U.toString().toLowerCase()));
            }
        }
    }

    private StringBuilder createXlsList(final Node node, final boolean isOrdered) {
        final StringBuilder result = new StringBuilder();
        int count = 1;
        for (final Node childNode : node.childNodes()) {
            HtmlTag tag = HtmlTag.tagValue(childNode.nodeName());
            if (HtmlTag.LI == tag) {
                if (isOrdered) {
                    result.append(count++);
                    result.append(DOT);
                } else {
                    result.append(LIST_MARKER);
                }
                Node textNode = childNode.childNode(0);
                result.append(textNode);
                result.append(NEW_LINE);
            }
        }
        return result;
    }

    private StringBuilder checkAndClose(final boolean isCheckUl, final boolean isCheckOl) {
        final StringBuilder text = new StringBuilder();
        if (isCheckUl && isUlOpen) {
            text.append(String.format(CLOSE, HtmlTag.UL.toString().toLowerCase()));
            isUlOpen = false;
        }
        if (isCheckOl && isOlOpen) {
            text.append(String.format(CLOSE, HtmlTag.OL.toString().toLowerCase()));
            isOlOpen = false;
        }
        return text;
    }

    private StringBuilder checkLists(final String line) {
        final StringBuilder result = new StringBuilder();
        if (line.matches(ORDERED_LIST_REGEX)) {
            result.append(checkAndClose(true, false));
            if (!isOlOpen) {
                result.append(String.format(OPEN, HtmlTag.OL.toString().toLowerCase()));
                isOlOpen = true;
            }
            result.append(String.format(OPEN, HtmlTag.LI.toString().toLowerCase()));
            result.append(line.replaceAll(DIGITAL_REGEX, StringUtils.EMPTY));
            result.append(String.format(CLOSE, HtmlTag.LI.toString().toLowerCase()));
        } else if (line.matches(UNORDERED_LIST_REGEX)) {
            result.append(checkAndClose(false, true));
            if (!isUlOpen) {
                result.append(String.format(OPEN, HtmlTag.UL.toString().toLowerCase()));
                isUlOpen = true;
            }
            result.append(String.format(OPEN, HtmlTag.LI.toString().toLowerCase()));
            result.append(line.replaceAll(LIST_MARKER, StringUtils.EMPTY));
            result.append(String.format(CLOSE, HtmlTag.LI.toString().toLowerCase()));
        } else {
            result.append(checkAndClose(true, true));
            result.append(line);
        }
        return result;
    }
}
