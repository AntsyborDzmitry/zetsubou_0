package com.dhl.services.service;

import com.dhl.services.exception.DocumentException;

import java.io.ByteArrayOutputStream;
import java.io.InputStream;

/**
 * Service for import/export dictionaries into excel
 */
public interface ExcelDocumentService {
    /**
     * Import data to excel document.
     *
     * @param jsonData contains dictionaryData
     * @throws DocumentException
     * @return document stream
     */
    ByteArrayOutputStream writeDocument(String jsonData) throws DocumentException;


    /**
     * Read data from excel file and import into CQ
     *
     * @param in File
     * @throws DocumentException
     */
    void readUpdateDocument(InputStream in) throws DocumentException;
}
