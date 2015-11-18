package com.zetsubou_0.documents.poi.api;

import com.zetsubou_0.documents.poi.exception.DocumentException;
import org.apache.poi.xwpf.usermodel.XWPFRun;

/**
 * Created by Kiryl_Lutsyk on 11/18/2015.
 */
public interface WordService {
    void crateParagraph(XWPFRun ... formattedText) throws DocumentException;
    void writeDocument(String path) throws DocumentException;
    String readDocument(String path) throws DocumentException;
}
