package com.zetsubou_0.documents.poi.builder;

import com.zetsubou_0.documents.poi.exception.DocumentException;
import org.apache.poi.xwpf.usermodel.UnderlinePatterns;
import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.apache.poi.xwpf.usermodel.XWPFParagraph;
import org.apache.poi.xwpf.usermodel.XWPFRun;

import java.io.IOException;
import java.io.OutputStream;

/**
 * Created by Kiryl_Lutsyk on 11/19/2015.
 */
public class WordDocumentBuilder {
    private final XWPFDocument document = new XWPFDocument();

    private XWPFParagraph paragraph;

    public WordDocumentBuilder createParagraph() {
        this.paragraph = this.document.createParagraph();
        return this;
    }

    public WordDocumentBuilder appendString(String text) throws DocumentException {
        return appendString(text, null);
    }

    public WordDocumentBuilder appendString(String text, StyleType... styleTypes) throws DocumentException {
        if (paragraph == null) {
            this.paragraph = this.document.createParagraph();
        }

        XWPFRun run = this.paragraph.createRun();
        run.setText(text);
        if (styleTypes != null) {
            for (StyleType styleType : styleTypes)
            switch (styleType) {
                case BOLD :
                    run.setBold(true);
                    break;
                case ITALIC :
                    run.setItalic(true);
                    break;
                case UNDERLINE :
                    run.setUnderline(UnderlinePatterns.SINGLE);
                    break;
                default :
                    throw new DocumentException("Unknown type " + styleType.toString());
            }
        }
        return this;
    }

    public void buildDocument(OutputStream out) throws DocumentException {
        try {
            document.write(out);
        } catch (IOException e) {
            throw new DocumentException(e.getMessage(), e);
        }
    }
}
