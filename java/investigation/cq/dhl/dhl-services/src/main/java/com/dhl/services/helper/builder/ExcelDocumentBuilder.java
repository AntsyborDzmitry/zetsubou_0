package com.dhl.services.helper.builder;

import com.dhl.services.exception.DocumentException;
import com.dhl.services.helper.style.ExcelStyle;
import org.apache.commons.lang3.StringUtils;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.xssf.usermodel.*;

import java.io.IOException;
import java.io.OutputStream;

public class ExcelDocumentBuilder {
    private XSSFWorkbook workbook;
    private XSSFSheet sheet;
    private XSSFRow currentRow;
    private XSSFCell currentCell;
    private XSSFRichTextString string;
    private CellStyle wrappedTextStyle;
    private int rowIndex;
    private int cellIndex;
    private int maxColumnsInRow = 0;

    /**
     * Creates a new ExcelDocumentBuilder
     */
    public ExcelDocumentBuilder() {
        this.workbook = new XSSFWorkbook();
        this.wrappedTextStyle = this.workbook.createCellStyle();
        this.wrappedTextStyle.setWrapText(true);
        init();
    }

    /**
     * Appends sheet to ExcelDocumentBuilder
     * @param sheetName the name of a sheet
     * @return current ExcelDocumentBuilder object
     */
    public ExcelDocumentBuilder appendSheet(final String sheetName) {
        this.sheet = this.workbook.createSheet(sheetName);
        init();
        return this;
    }

    /**
     * Appends row to ExcelDocumentBuilder
     * @return current ExcelDocumentBuilder object
     * @throws DocumentException If append row exception occurs
     */
    public ExcelDocumentBuilder appendRow() throws DocumentException {
        return appendRow(rowIndex);
    }

    /**
     * Appends row to ExcelDocumentBuilder
     * @param row the row index
     * @return current ExcelDocumentBuilder object
     * @throws DocumentException If append row exception occurs
     */
    public ExcelDocumentBuilder appendRow(final int row) throws DocumentException {
        rowIndex = row;
        currentRow = sheet.createRow(rowIndex++);
        maxColumnsInRow = (maxColumnsInRow < cellIndex) ? cellIndex : maxColumnsInRow;
        cellIndex = 0;
        return this;
    }

    /**
     * Appends cell  to ExcelDocumentBuilder
     * @return current ExcelDocumentBuilder object
     * @throws DocumentException  If append cell exception occurs
     */
    public ExcelDocumentBuilder appendCell() throws DocumentException {
        return appendCell(cellIndex);
    }

    /**
     * Appends cell  to ExcelDocumentBuilder
     * @param cellNumber the cell number
     * @return current ExcelDocumentBuilder object
     * @throws DocumentException  If append cell exception occurs
     */
    public ExcelDocumentBuilder appendCell(final int cellNumber) throws DocumentException{
        if (currentRow == null) {
            throw new DocumentException("Row is null");
        }
        string = new XSSFRichTextString(StringUtils.EMPTY);
        cellIndex = cellNumber;
        currentCell = currentRow.createCell(cellIndex++);
        currentCell.setCellStyle(wrappedTextStyle);
        return this;
    }

    /**
     * Appends cell text
     * @param text the cell text to append
     * @return current ExcelDocumentBuilder object
     * @throws DocumentException If append exception occurs
     */
    public ExcelDocumentBuilder appendCellText(final String text) throws DocumentException {
        return appendCellText(text, null);
    }

    /**
     * Appends cell text
     * @param text the cell text to append
     * @param styles the styles
     * @return current ExcelDocumentBuilder object
     * @throws DocumentException If append exception occurs
     */
    public ExcelDocumentBuilder appendCellText(final String text, final ExcelStyle... styles) throws DocumentException {
        if (currentCell == null) {
            throw new DocumentException("Cell is null");
        }
        if (string == null) {
            throw new DocumentException("String doesn't initialized (null)");
        }
        applyStyles(text, styles);
        return this;
    }

    /**
     * Sets the currentCell value
     * @return current ExcelDocumentBuilder object
     */
    public ExcelDocumentBuilder fillCellString() {
        if (currentCell != null && string != null) {
            currentCell.setCellValue(string);
        }
        return this;
    }

    /**
     * Build document into output stream
     *
     * @param out document representation
     * @throws DocumentException
     */
    public void build(final OutputStream out) throws DocumentException {
        try {
            for (int column = 0; column < maxColumnsInRow; column++) {
                sheet.autoSizeColumn(column);
            }
            workbook.write(out);
        } catch (IOException e) {
            throw new DocumentException(e.getMessage(), e);
        }
    }

    /**
     * Current ExcelDocumentBuilder object initialization
     */
    protected void init() {
        this.currentRow = null;
        this.currentCell = null;
        this.string = null;
        this.rowIndex = 0;
        this.cellIndex = 0;
    }

    /**
     * Applies styles to the text
     * @param text the text
     * @param styles the styles
     */
    private void applyStyles(final String text, final ExcelStyle... styles) {
        if (styles == null) {
            string.append(text);
            return;
        }

        XSSFFont font = workbook.createFont();
        for (ExcelStyle style : styles) {
            if (style != null) {
                style.applyStyle(font);
            }
        }

        int length = string.length();
        string.append(text);
        string.applyFont(length, length + text.length(), font);
    }
}
