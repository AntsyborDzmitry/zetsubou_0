package com.zetsubou_0.documents.poi;

import com.zetsubou_0.documents.poi.api.WordService;
import com.zetsubou_0.documents.poi.builder.WordDocumentBuilder;
import com.zetsubou_0.documents.poi.exception.DocumentException;

import java.io.*;

/**
 * Created by Kiryl_Lutsyk on 11/19/2015.
 */
public class WordServiceImpl implements WordService {
    @Override
    public void writeDocument(String path, WordDocumentBuilder builder) throws DocumentException {
        try (OutputStream out = new BufferedOutputStream(new FileOutputStream(path))) {
            builder.buildDocument(out);
        } catch (IOException e) {
            throw new DocumentException(e.getMessage(), e);
        }
    }

    @Override
    public String readDocument(String path) throws DocumentException {
        return null;
    }
}
