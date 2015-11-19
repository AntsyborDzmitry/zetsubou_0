package com.zetsubou_0.documents.poi;

import com.zetsubou_0.documents.poi.api.ExcelDocumentService;
import com.zetsubou_0.documents.poi.builder.ExcelDocumentBuilder;
import com.zetsubou_0.documents.poi.exception.DocumentException;

import java.io.*;

/**
 * Created by Kiryl_Lutsyk on 11/19/2015.
 */
public class ExcelDocumentServiceImpl implements ExcelDocumentService {
    @Override
    public void writeDocument(String path, ExcelDocumentBuilder builder) throws DocumentException {
        File file = new File(path);
        try (OutputStream out = new BufferedOutputStream(new FileOutputStream(file))) {
            builder.build(out);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    @Override
    // todo: will be implemented in scope of DHLEWFCON-11648
    public String readDocument(String path) throws DocumentException {
        return null;
    }
}
