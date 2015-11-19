package com.zetsubou_0.documents.poi.api;

import com.zetsubou_0.documents.poi.builder.WordDocumentBuilder;
import com.zetsubou_0.documents.poi.exception.DocumentException;

/**
 * Created by Kiryl_Lutsyk on 11/18/2015.
 */
public interface WordService {
    void writeDocument(String path, WordDocumentBuilder builder) throws DocumentException;
    String readDocument(String path) throws DocumentException;
}
