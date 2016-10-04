package com.zetsubou_0.locale.util;

import com.zetsubou_0.locale.model.Dictionary;
import org.apache.commons.lang3.StringUtils;
import org.codehaus.jackson.map.ObjectMapper;
import org.codehaus.jackson.type.JavaType;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.xml.sax.SAXException;

import javax.xml.XMLConstants;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import javax.xml.transform.OutputKeys;
import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerException;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.dom.DOMSource;
import javax.xml.transform.stream.StreamResult;
import java.io.*;
import java.util.HashMap;
import java.util.Map;

public class JsonConverter {

    private static final String DICTIONARY_PATH =
            "";

    private static final ObjectMapper MAPPER = new ObjectMapper();

    private static final JavaType DICTIONARIES_LIST =
            MAPPER.getTypeFactory().constructMapType(HashMap.class, String.class, Dictionary.class);

    public static void convertJsonAndWriteInXml(final File file) throws Exception {
        Map<String, Dictionary> dictionaries = MAPPER.readValue(file, DICTIONARIES_LIST);
        for (Map.Entry<String, Dictionary> entry : dictionaries.entrySet()) {
            Dictionary dictionaryModel = entry.getValue();
            String dictionaryName = dictionaryModel.getName();
            String path = getDictionaryPath(dictionaryName);
            try (InputStream in = new FileInputStream(path)) {
                modifyXml(in, dictionaryModel.getMessages(), path);
            }
        }
    }

    private static void modifyXml(final InputStream in, final Map<String, Dictionary.Key> messages, final String path)
            throws ParserConfigurationException, IOException, SAXException, TransformerException {
        Document doc = getDomDocument(in);
        Element root = doc.getDocumentElement();
        NodeList keyNodes = root.getChildNodes();
        Map<String, String> keyAlias = getKeyAndAlias(messages);
        updateAliases(keyNodes, keyAlias);


        TransformerFactory transformerFactory = TransformerFactory.newInstance();
        Transformer transformer = transformerFactory.newTransformer();
        transformer.setOutputProperty("{http://xml.apache.org/xslt}indent-amount", "4");
        transformer.setOutputProperty(OutputKeys.INDENT, "yes");
        DOMSource source = new DOMSource(doc);
        StreamResult streamResult = new StreamResult(new File(path));
        transformer.transform(source, streamResult);
    }

    private static void updateAliases(final NodeList keyNodes, final Map<String, String> keyAlias) {
        for (int index = 0; index < keyNodes.getLength(); index++) {
            Node keyNode = keyNodes.item(index);
            String alias = keyAlias.get(keyNode.getNodeName());
            if (StringUtils.isNotBlank(alias)) {
                ((Element) keyNode).setAttribute("alias", alias);
            }
        }
    }

    private static Map<String, String> getKeyAndAlias(final Map<String, Dictionary.Key> messages) {
        Map<String, String> keyAlias = new HashMap<>(messages.size());
        for (Map.Entry<String, Dictionary.Key> messageEntry : messages.entrySet()) {
            String alias = messageEntry.getKey();
            Dictionary.Key keyModel = messageEntry.getValue();
            String keyName = keyModel.getKey();
            keyAlias.put(keyName, alias);
        }
        return keyAlias;
    }

    private static String getDictionaryPath(final String dictionary) {
        return String.format(DICTIONARY_PATH, dictionary);
    }

    private static Document getDomDocument(final InputStream inputStream)
            throws ParserConfigurationException, IOException, SAXException {
        DocumentBuilderFactory documentBuilderFactory = DocumentBuilderFactory.newInstance();
        documentBuilderFactory.setFeature(XMLConstants.FEATURE_SECURE_PROCESSING, true);
        DocumentBuilder documentBuilder = documentBuilderFactory.newDocumentBuilder();
        return documentBuilder.parse(inputStream);
    }

}
