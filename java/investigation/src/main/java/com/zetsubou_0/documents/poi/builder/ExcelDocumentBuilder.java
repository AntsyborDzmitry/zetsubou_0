package com.zetsubou_0.documents.poi.builder;

import com.zetsubou_0.documents.poi.api.Style;
import com.zetsubou_0.documents.poi.exception.DocumentException;
import org.apache.poi.xssf.usermodel.*;

import java.io.IOException;
import java.io.OutputStream;

/**
 * Created by Kiryl_Lutsyk on 11/19/2015.
 */
public class ExcelDocumentBuilder {
    private final String sheetName;

    private XSSFWorkbook workbook;
    private XSSFSheet sheet;
    private XSSFRow currentRow;
    private int rowIndex;
    private int cellIndex;

    public ExcelDocumentBuilder(String sheetName) {
        this.sheetName = sheetName;
        init();
    }

    public ExcelDocumentBuilder appendRow() throws DocumentException {
        currentRow = sheet.createRow(rowIndex++);
        cellIndex = 0;
        return this;
    }

    public ExcelDocumentBuilder appendCell(String text) throws DocumentException {
        return appendCell(text, 0, null);
    }

    public ExcelDocumentBuilder appendCell(String text, Style... styles) throws DocumentException {
        return appendCell(text, 0, styles);
    }

    public ExcelDocumentBuilder appendCell(String text, int cellNumber, Style... styles) throws DocumentException{
        if (currentRow == null) {
            appendRow();
        }
        cellIndex = cellNumber;
        XSSFRichTextString string = new XSSFRichTextString(text);
        applyStyles(string, styles);
        XSSFCell cell = currentRow.createCell(cellIndex++);
        cell.setCellValue(string);
        return this;
    }

    public void build(OutputStream out) throws DocumentException {
        try {
            workbook.write(out);
        } catch (IOException e) {
            throw new DocumentException(e.getMessage(), e);
        }
    }

    protected void init() {
        this.workbook = new XSSFWorkbook();
        this.sheet = this.workbook.createSheet(sheetName);
        this.rowIndex = 0;
        this.cellIndex = 0;
    }

    private void applyStyles(XSSFRichTextString string, Style... styles) {
        XSSFFont font = workbook.createFont();
        for (Style style : styles) {
            style.applyStyle(font);
        }
        string.applyFont(font);
    }
}
