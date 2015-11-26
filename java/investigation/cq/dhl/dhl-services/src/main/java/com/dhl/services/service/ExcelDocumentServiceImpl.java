package com.dhl.services.service;

import com.dhl.services.exception.DocumentException;
import com.dhl.services.helper.FormattedStringParser;
import com.dhl.services.helper.builder.ExcelDocumentBuilder;
import com.dhl.services.model.CqLocale;
import com.dhl.services.model.DictionaryRecord;
import com.google.gson.Gson;
import org.apache.commons.collections.MapUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.felix.scr.annotations.Component;
import org.apache.felix.scr.annotations.Reference;
import org.apache.felix.scr.annotations.Service;
import org.apache.poi.openxml4j.exceptions.InvalidFormatException;
import org.apache.poi.openxml4j.opc.OPCPackage;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.xssf.usermodel.XSSFCell;
import org.apache.poi.xssf.usermodel.XSSFRow;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.*;
import java.util.*;

@Component
@Service(ExcelDocumentService.class)
public class ExcelDocumentServiceImpl implements ExcelDocumentService {
    private static final Logger LOG = LoggerFactory.getLogger(ExcelDocumentServiceImpl.class);
    private static final String DICTIONARY = "dictionary";
    private static final String PATH_SEPARATOR_REGEX = ".*/";
    private static final String EN = "en";
    private static final String KEY = "key";
    private static final String KEYS = "keys";
    private static final String LANGUAGES = "languages";
    private static final String DESCRIPTION = "description";

    @Reference
    private NlsService nlsService;

    @Override
    public ByteArrayOutputStream writeDocument(final String jsonData) throws DocumentException {
        final ExcelDocumentBuilder builder = parseData(jsonData);
        if (builder == null) {
            throw new DocumentException("Excel representation is null");
        }

        final ByteArrayOutputStream out = new ByteArrayOutputStream();
        builder.build(out);

        return out;
    }

    @Override
    public void readUpdateDocument(final InputStream in) throws DocumentException {
        final List<DictionaryRecord> dictionaryRecords = new ArrayList<>();
        final List<String> languages = new ArrayList<>();

        try (OPCPackage opcPackage = OPCPackage.open(in)){
            final XSSFWorkbook workbook = new XSSFWorkbook(opcPackage);
            final XSSFSheet sheet = workbook.getSheetAt(0);
            fillRows(dictionaryRecords, languages, sheet);

            for (final DictionaryRecord record : dictionaryRecords) {
                for (final String language : record.getMessages().keySet()) {
                    updateRecords(sheet, record, language);
                }
            }
        } catch (IOException | InvalidFormatException e) {
            throw new DocumentException(e.getMessage(), e);
        }
    }

    private void updateRecords(final XSSFSheet sheet, final DictionaryRecord record, final String language) {
        try {
            nlsService.updateResources(record.getKey(), record.getMessages().get(language),
                    sheet.getSheetName(), language);
        } catch (final IllegalArgumentException e) {
            LOG.error(e.getMessage(), e);
        }
    }

    private void fillRows(final List<DictionaryRecord> records, final List<String> languages, final XSSFSheet sheet)
            throws DocumentException {
        final Iterator<Row> rowIterator = sheet.rowIterator();
        int rowNum = 0;
        while (rowIterator.hasNext()) {
            final XSSFRow row = (XSSFRow) rowIterator.next();
            final Iterator<Cell> cellIterator = row.cellIterator();
            if (rowNum > 0) {
                fillRowValues(records, languages, rowNum, cellIterator);
                rowNum++;
            } else {
                int cellNum = 0;
                while (cellIterator.hasNext()) {
                    fillLanguagesCellsHeaders(languages, cellIterator, cellNum);
                    cellNum++;
                }
                rowNum++;
            }
        }
    }

    private void fillRowValues(final List<DictionaryRecord> records, final List<String> languages, final int rowNumber, final Iterator<Cell>
            cellIterator) throws DocumentException {
        int cellNum = 0;
        final Map<String, String> languageMessages = new HashMap<>();
        String key = null;
        String description = null;
        while (cellIterator.hasNext()) {
            final XSSFCell cell = (XSSFCell) cellIterator.next();
            if (cellNum > 1) {
                fillLanguagesCells(cell, languages, cellNum, languageMessages);
            } else if (cellNum > 0) {
                final FormattedStringParser parser = new FormattedStringParser();
                description = parser.parseCellText(cell);
            } else {
                key = cell.getStringCellValue();
                if (StringUtils.isBlank(key)) {
                    throw new DocumentException("Key is blank " + rowNumber + "," + cellNum);
                }
            }
            cellNum++;
        }
        records.add(new DictionaryRecord(key, description, languageMessages));
    }

    private void fillLanguagesCells(final XSSFCell cell, final List<String> languages, final int cellNum, final Map<String, String> languageMessages) throws DocumentException {
        final FormattedStringParser parser = new FormattedStringParser();
        final String language = languages.get(cellNum - 2);
        final String message = parser.parseCellText(cell);
        languageMessages.put(language, message);
    }

    private void fillLanguagesCellsHeaders(final List<String> languages, final Iterator<Cell> cellIterator, final int cellNumber) {
        final XSSFCell cell = (XSSFCell) cellIterator.next();
        if (cellNumber > 1) {
            final String language = cell.getStringCellValue();
            languages.add(language);
        }
    }

    @SuppressWarnings("unckecked")
    private ExcelDocumentBuilder parseData(final String jsonData) throws DocumentException {
        final int FIRST_SHEET = 0;
        final Gson gson = new Gson();
        final Map<String, List<String>> data = gson.fromJson(jsonData, Map.class);
        String dictionary = data.get(DICTIONARY).get(FIRST_SHEET);
        dictionary = dictionary.replaceAll(PATH_SEPARATOR_REGEX, StringUtils.EMPTY);
        final List<String> keys = data.get(KEYS);
        final Set<String> languages = new HashSet<>(data.get(LANGUAGES));
        final ExcelDocumentBuilder builder = new ExcelDocumentBuilder();
        final Map<String, Map<String, String>> messages = getAllMessages(dictionary, languages);
        final Map<String, String> descriptions = getDescriptions(dictionary, keys);
        final List<DictionaryRecord> records = getRecords(keys, messages, descriptions);

        builder.appendSheet(dictionary);

        fillHeader(builder, languages);
        fillData(builder, records);

        return builder;
    }

    private void fillData(final ExcelDocumentBuilder builder, final List<DictionaryRecord> records) throws
            DocumentException {
        for (DictionaryRecord record : records) {
            builder.appendRow();

            builder.appendCell();
            FormattedStringParser parser = new FormattedStringParser();
            parser.parseAndFillCell(builder, record.getKey());

            builder.appendCell();
            parser = new FormattedStringParser();
            parser.parseAndFillCell(builder, record.getComment());

            Map<String, String> messages = record.getMessages();
            if (MapUtils.isNotEmpty(messages)) {
                for (final String language : messages.keySet()) {
                    builder.appendCell();
                    parser = new FormattedStringParser();
                    parser.parseAndFillCell(builder, messages.get(language));
                }
            }
        }
    }

    private void fillHeader(final ExcelDocumentBuilder builder, final Set<String> languages) throws
            DocumentException {
        builder.appendRow();
        builder.appendCell()
                .appendCellText(KEY).fillCellString();
        builder.appendCell()
                .appendCellText(DESCRIPTION).fillCellString();
        for (final String languageCode : languages) {
            builder.appendCell()
                    .appendCellText(languageCode).fillCellString();
        }
    }

    private List<DictionaryRecord> getRecords(final List<String> keys, final Map<String, Map<String, String>> allMessages,
                            final Map<String, String> descriptions) {
        List<DictionaryRecord> records = new ArrayList<>();
        for (final String key : keys) {
            final DictionaryRecord record = new DictionaryRecord(key, descriptions.get(key),
                    messagesToPairLangMessage(allMessages, key));
            records.add(record);
        }
        return records;
    }

    private Map<String, String> messagesToPairLangMessage(final Map<String, Map<String, String>> allMessages,
                                                          final String key) {
        Map<String, String> messages = new HashMap<>();
        Set<String> languages = allMessages.keySet();
        for (String language : languages) {
            Map<String, String> keyValue = allMessages.get(language);
            if (MapUtils.isNotEmpty(keyValue)) {
                messages.put(language, keyValue.get(key));
            } else {
                messages.put(language, StringUtils.EMPTY);
            }
        }
        return messages;
    }

    private Map<String, Map<String, String>> getAllMessages(final String dictionary, final Set<String> languageCodes) {
        // <String language <String messageKey, String messageValue>>
        Map<String, Map<String, String>> messages = new HashMap<>();
        for (String languageCode : languageCodes) {
            final Map<String, String> languageResources = nlsService.getLanguageResources(new CqLocale(null, languageCode),
                    dictionary);
            messages.put(languageCode, languageResources);
        }
        return messages;
    }

    private Map<String, String> getDescriptions(final String dictionary, final List<String> keys) {
        // <String messageKey, String messageDescription>
        final Map<String, String> comments = nlsService.getDescriptions(EN, dictionary);
        for (final String key : keys) {
            String description = comments.get(key);
            if (NlsServiceImpl.NO_DESCRIPTION.equals(description)) {
                description = StringUtils.EMPTY;
            }
            comments.put(key, description);
        }
        return comments;
    }
}
