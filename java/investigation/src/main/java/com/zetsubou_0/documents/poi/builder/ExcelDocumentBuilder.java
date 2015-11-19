package com.zetsubou_0.documents.poi.builder;

import com.zetsubou_0.documents.poi.api.Style;
import com.zetsubou_0.documents.poi.exception.DocumentException;
import org.apache.commons.lang3.StringUtils;
import org.apache.poi.xssf.usermodel.*;

import java.io.IOException;
import java.io.OutputStream;

/**
 * Created by Kiryl_Lutsyk on 11/19/2015.
 */
public class ExcelDocumentBuilder {
    private XSSFWorkbook workbook;
    private XSSFSheet sheet;
    private XSSFRow currentRow;
    private XSSFCell currentCell;
    private XSSFRichTextString string;
    private int rowIndex;
    private int cellIndex;
    private int maxColumnsInRow = 0;

    public ExcelDocumentBuilder() {
        this.workbook = new XSSFWorkbook();
        init();
    }

    public ExcelDocumentBuilder appendSheet(String sheetName) {
        this.sheet = this.workbook.createSheet(sheetName);
        init();
        return this;
    }

    public ExcelDocumentBuilder appendRow() throws DocumentException {
        return appendRow(rowIndex);
    }

    public ExcelDocumentBuilder appendRow(int row) throws DocumentException {
        rowIndex = row;
        currentRow = sheet.createRow(rowIndex++);
        maxColumnsInRow = (maxColumnsInRow < cellIndex) ? cellIndex : maxColumnsInRow;
        cellIndex = 0;
        return this;
    }

    public ExcelDocumentBuilder appendCell() throws DocumentException {
        return appendCell(cellIndex);
    }

    public ExcelDocumentBuilder appendCell(int cellNumber) throws DocumentException{
        if (currentRow == null) {
            throw new DocumentException("Row is null");
        }
        string = new XSSFRichTextString(StringUtils.EMPTY);
        cellIndex = cellNumber;
        currentCell = currentRow.createCell(cellIndex++);
        return this;
    }

    public ExcelDocumentBuilder appendCellText(String text) throws DocumentException {
        return appendCellText(text, null);
    }

    public ExcelDocumentBuilder appendCellText(String text, Style... styles) throws DocumentException {
        if (currentCell == null) {
            throw new DocumentException("Cell is null");
        }
        if (string == null) {
            throw new DocumentException("String doesn't initialized (null)");
        }
        applyStyles(text, styles);
        return this;
    }

    public ExcelDocumentBuilder fillCellString() {
        if (currentCell != null && string != null) {
            currentCell.setCellValue(string);
        }
        return this;
    }


    public void build(OutputStream out) throws DocumentException {
        try {
            for (int column = 0; column < maxColumnsInRow; column++) {
                sheet.autoSizeColumn(column);
            }
            workbook.write(out);
        } catch (IOException e) {
            throw new DocumentException(e.getMessage(), e);
        }
    }

    protected void init() {
        this.currentRow = null;
        this.currentCell = null;
        this.string = null;
        this.rowIndex = 0;
        this.cellIndex = 0;
    }

    private void applyStyles(String text, Style... styles) {
        if (styles == null) {
            string.append(text);
            return;
        }

        XSSFFont font = workbook.createFont();
        for (Style style : styles) {
            style.applyStyle(font);
        }

        int length = string.length();
        string.append(text);
        string.applyFont(length, length + text.length(), font);
    }
}
