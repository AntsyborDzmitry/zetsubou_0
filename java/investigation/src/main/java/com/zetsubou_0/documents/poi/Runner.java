package com.zetsubou_0.documents.poi;

import com.zetsubou_0.documents.poi.api.WordService;
import com.zetsubou_0.documents.poi.builder.StyleType;
import com.zetsubou_0.documents.poi.builder.WordDocumentBuilder;
import com.zetsubou_0.documents.poi.exception.DocumentException;
import org.apache.poi.openxml4j.exceptions.InvalidFormatException;
import org.apache.poi.openxml4j.opc.OPCPackage;
import org.apache.poi.ss.usermodel.FontUnderline;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.xssf.extractor.XSSFExportToXml;
import org.apache.poi.xssf.usermodel.*;
import org.apache.poi.xwpf.converter.xhtml.XHTMLConverter;
import org.apache.poi.xwpf.converter.xhtml.XHTMLOptions;
import org.apache.poi.xwpf.usermodel.*;
import org.xml.sax.SAXException;

import javax.xml.parsers.ParserConfigurationException;
import javax.xml.transform.TransformerException;
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

    private static WordService wordService = new WordServiceImpl();

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
                StringBuilder text = new StringBuilder();
                for (XWPFRun r :  p.getRuns()) {
                    if (r.isBold()) {
                        text.append("<b>");
                    }
                    if (r.isItalic()) {
                        text.append("<i>");
                    }
                    text.append(r.getText(TEXT_START_POSITION));
                    if (r.isBold()) {
                        text.append("</b>");
                    }
                    if (r.isItalic()) {
                        text.append("</i>");
                    }
                }
                System.out.println(text.toString());
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
                StringBuilder text = new StringBuilder();
                if (cell != null) {
                    if (cell.getCellType() == XSSFCell.CELL_TYPE_STRING) {
                        int i = 0;
                        int j = 0;
                        XSSFRichTextString string = cell.getRichStringCellValue();
                        while (string.getLengthOfFormattingRun(i) > 0) {
                            XSSFFont font = string.getFontOfFormattingRun(i);
                            if (font != null) {
                                if (font.getBold()) {
                                    text.append("<b>");
                                }
                                if (font.getItalic()) {
                                    text.append("<i>");
                                }
                            }
                            text.append(string.getString().substring(j, string.getLengthOfFormattingRun(i) + j));
                            j += string.getLengthOfFormattingRun(i);
                            if (font != null) {
                                if (font.getBold()) {
                                    text.append("</b>");
                                }
                                if (font.getItalic()) {
                                    text.append("</i>");
                                }
                            }
                            i++;
                        }

                        if (i == 0) {
                            text.append(string.getString());
                        }
                    } else if (cell.getCellType() == XSSFCell.CELL_TYPE_NUMERIC) {
                        text.append((int) cell.getNumericCellValue());
                    }
                    text.append(" => ");
                }
                cell = row.getCell(1);
                if (cell != null) {
                    int i = 0;
                    int j = 0;
                    XSSFRichTextString string = cell.getRichStringCellValue();
                    while (string.getLengthOfFormattingRun(i) > 0) {
                        XSSFFont font = string.getFontOfFormattingRun(i);
                        if (font != null) {
                            if (font.getBold()) {
                                text.append("<b>");
                            }
                            if (font.getItalic()) {
                                text.append("<i>");
                            }
                        }
                        text.append(string.getString().substring(j, string.getLengthOfFormattingRun(i) + j));
                        j += string.getLengthOfFormattingRun(i);
                        if (font != null) {
                            if (font.getBold()) {
                                text.append("</b>");
                            }
                            if (font.getItalic()) {
                                text.append("</i>");
                            }
                        }
                        i++;
                    }

                    if (i == 0) {
                        text.append(string.getString());
                    }
                }
                System.out.println(text.toString());
            }
        } catch (IOException e) {
            e.printStackTrace();
        }


        try (FileInputStream in = new FileInputStream(XLSX_FILE);
             OutputStream out = new FileOutputStream(new File
                ("D:/test.xml"))) {
            XSSFWorkbook workbook = new XSSFWorkbook(in);

            for (XSSFMap map : workbook.getCustomXMLMappings()) {
                XSSFExportToXml exporter = new XSSFExportToXml(map);
                exporter.exportToXML(out, false);
            }
        } catch (IOException e) {
            e.printStackTrace();
        } catch (SAXException e) {
            e.printStackTrace();
        } catch (ParserConfigurationException e) {
            e.printStackTrace();
        } catch (TransformerException e) {
            e.printStackTrace();
        }
    }
}
