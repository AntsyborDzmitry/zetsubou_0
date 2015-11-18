package com.zetsubou_0.documents.poi;

import org.apache.poi.openxml4j.exceptions.InvalidFormatException;
import org.apache.poi.openxml4j.opc.OPCPackage;
import org.apache.poi.ss.usermodel.FontUnderline;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.xssf.usermodel.*;
import org.apache.poi.xwpf.converter.xhtml.XHTMLConverter;
import org.apache.poi.xwpf.converter.xhtml.XHTMLOptions;
import org.apache.poi.xwpf.usermodel.*;

import java.io.*;
import java.util.Iterator;

/**
 * Created by Kiryl_Lutsyk on 11/17/2015.
 */
public class Runner {

    public static final int TEXT_START_POSITION = 0;
    public static final String DOCX_FILE = "D:/test.docx";
    public static final String DOCX_SIMPLE_FILE = "D:/test-simple.docx";
    public static final String XLSX_FILE = "D:/test.xlsx";
    public static final String XLSX_SHEET = "Dictionary";
    public static final String HTML_FILE = "D:/test.html";
    public static final String HTML_FILE_2 = "D:/test2.html";

    public static void main(String[] args) {
        // write docx
        try (OutputStream out = new FileOutputStream(DOCX_FILE)) {
            XWPFDocument document = new XWPFDocument();

            XWPFParagraph paragraph = document.createParagraph();
            paragraph.setAlignment(ParagraphAlignment.CENTER);
            XWPFRun run = paragraph.createRun();
            run.setText("Document test");
            run.setBold(true);
            run.setFontSize(32);

            paragraph = document.createParagraph();
            run = paragraph.createRun();
            run.setText("Some text ");

            run = paragraph.createRun();
            run.setUnderline(UnderlinePatterns.DASH);
            run.setText("Some underline text ");

            run = paragraph.createRun();
            run.setItalic(true);
            run.setText("Some italic text ");

            run = paragraph.createRun();
            run.setText("Русский текст");

            document.write(out);
        } catch (IOException e) {
            e.printStackTrace();
        }


        // read docx
        try (FileInputStream in = new FileInputStream(DOCX_FILE)) {
            XWPFDocument document = new XWPFDocument(OPCPackage.open(in));
            for (XWPFParagraph p : document.getParagraphs()) {
                for (XWPFRun r :  p.getRuns()) {
                    if (r.isBold()) {
                        System.out.print("<b>");
                    }
                    if (r.isItalic()) {
                        System.out.print("<i>");
                    }
                    System.out.print(r.getText(TEXT_START_POSITION));
                    if (r.isBold()) {
                        System.out.print("</b>");
                    }
                    if (r.isItalic()) {
                        System.out.print("</i>");
                    }
                }
                System.out.println();
            }
        } catch (IOException | InvalidFormatException e) {
            e.printStackTrace();
        }


        // convert simple docx to html
        try (OutputStream out = new FileOutputStream(new File(HTML_FILE));
             FileInputStream in = new FileInputStream(DOCX_SIMPLE_FILE)) {
            XWPFDocument document = new XWPFDocument(OPCPackage.open(in));
            XHTMLConverter.getInstance().convert(document, out, XHTMLOptions.create());
        } catch (IOException | InvalidFormatException e) {
            e.printStackTrace();
        }


        // convert docx to html
//        try (OutputStream out = new FileOutputStream(new File(HTML_FILE_2));
//             FileInputStream in = new FileInputStream(DOCX_FILE)) {
//            XWPFDocument document = new XWPFDocument(OPCPackage.open(in));
//            XHTMLConverter.getInstance().convert(document, out, XHTMLOptions.create());
//        } catch (IOException | InvalidFormatException e) {
//            e.printStackTrace();
//        }


        // write xslx
        try (OutputStream out = new FileOutputStream(new File(XLSX_FILE))) {
            XSSFWorkbook workbook = new XSSFWorkbook();
            XSSFSheet sheet = workbook.createSheet(XLSX_SHEET);
            XSSFFont bold = workbook.createFont();
            bold.setBold(true);
            XSSFFont italic = workbook.createFont();
            italic.setItalic(true);
            XSSFFont underline = workbook.createFont();
            underline.setUnderline(FontUnderline.SINGLE);

            int rowCount = 0;
            XSSFRow row = sheet.createRow(rowCount++);
            XSSFCell cell = row.createCell(0);
            XSSFRichTextString string = new XSSFRichTextString("Key");
            string.applyFont(bold);
            cell.setCellValue(string);
            cell = row.createCell(1);
            string.setString("Value");
            string.applyFont(bold);
            cell.setCellValue(string);

            row = sheet.createRow(rowCount);
            cell = row.createCell(0);
            cell.setCellValue(rowCount++);
            cell = row.createCell(1);
            string.setString("Some ");
            int strLength = string.length();
            string.append("bold");
            string.applyFont(strLength, strLength + "bold".length(), bold);
            string.append(" text");
            cell.setCellValue(string);

            row = sheet.createRow(rowCount);
            cell = row.createCell(0);
            cell.setCellValue(rowCount++);
            cell = row.createCell(1);
            string.setString("Some ");
            cell.setCellValue("Some text ");

            row = sheet.createRow(rowCount);
            cell = row.createCell(0);
            cell.setCellValue(rowCount++);
            cell = row.createCell(1);
            string.setString("Some ");
            strLength = string.length();
            string.append("underline");
            string.applyFont(strLength, strLength + "underline".length(), underline);
            string.append(" text");
            cell.setCellValue(string);

            row = sheet.createRow(rowCount);
            cell = row.createCell(0);
            cell.setCellValue(rowCount++);
            cell = row.createCell(1);
            string.setString("Some ");
            strLength = string.length();
            string.append("italic");
            string.applyFont(strLength, strLength + "italic".length(), italic);
            string.append(" text");
            cell.setCellValue(string);

            row = sheet.createRow(rowCount);
            cell = row.createCell(0);
            cell.setCellValue(rowCount++);
            cell = row.createCell(1);
            cell.setCellValue("Русский текст");

            workbook.write(out);
        } catch (IOException e) {
            e.printStackTrace();
        }



        // read xslx
        try (FileInputStream in = new FileInputStream(XLSX_FILE)) {
            XSSFWorkbook workbook = new XSSFWorkbook(in);
            XSSFSheet sheet = workbook.getSheet(XLSX_SHEET);

            Iterator<Row> rows = sheet.rowIterator();
            while (rows.hasNext()) {
                XSSFRow row = (XSSFRow) rows.next();
                XSSFCell cell = row.getCell(0);
                if (cell != null) {
                    if (cell.getCellType() == XSSFCell.CELL_TYPE_STRING) {
                        System.out.print(cell.getRichStringCellValue());
                    } else if (cell.getCellType() == XSSFCell.CELL_TYPE_NUMERIC) {
                        System.out.print((int) cell.getNumericCellValue());
                    }
                    System.out.print(" => ");
                }
                cell = row.getCell(1);
                if (cell != null) {
                    System.out.println(cell.getRichStringCellValue());
                }
            }
        } catch (IOException e) {
            e.printStackTrace();
        }


    }
}
