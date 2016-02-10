package base;

import org.w3c.dom.Document;
import org.w3c.dom.Element;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerException;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.dom.DOMSource;
import javax.xml.transform.stream.StreamResult;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.Collection;

public  class WriteToXml {
    private DocumentBuilder builder;

    private final String fileName;

    public WriteToXml(String fileName) {
        this.fileName = fileName;
    }

    public void writeToXML(Collection<Tank> tankList) {
        ParamLangXML();

        try {
            WriteParamXML(tankList);
        } catch (TransformerException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public void ParamLangXML() {
        DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
        try {
            builder = factory.newDocumentBuilder();
        } catch (ParserConfigurationException e) {
            e.printStackTrace();
        }
    }

    public void WriteParamXML(Collection<Tank> tankList) throws TransformerException, IOException {
        Document doc = builder.newDocument();

        Element RootElement = doc.createElement("tanks"); // Главная
        
        for (Tank tank : tankList) {
            // элемент танк, входит состав рутового эелемента

            Element NameElementMainTank = doc.createElement("tank");
            RootElement.appendChild(NameElementMainTank);

            // свойсва элемента танк, входят в состав элемента танк. Равны по приоритету между сосбой.

            Element NameElementModel = doc.createElement("model");
            NameElementModel.appendChild(doc.createTextNode(tank.getModel()));
            NameElementMainTank.appendChild(NameElementModel);

            Element NameElementType = doc.createElement("type");
            NameElementType.appendChild(doc.createTextNode(tank.getType()));
            NameElementMainTank.appendChild(NameElementType);

            Element NameElementCrew = doc.createElement("crew");
            NameElementCrew.appendChild(doc.createTextNode(String.valueOf(tank.getCrew())));
            NameElementMainTank.appendChild(NameElementCrew);

            Element NameElementMainСannon = doc.createElement("mainСannon");
            NameElementMainСannon.appendChild(doc.createTextNode(String.valueOf(tank.getMainCannon())));
            NameElementMainTank.appendChild(NameElementMainСannon);

            Element NameElementWeight = doc.createElement("weight");
            NameElementWeight.appendChild(doc.createTextNode(String.valueOf(tank.getWeight())));
            NameElementMainTank.appendChild(NameElementWeight);
        }

        doc.appendChild(RootElement);

        Transformer t = TransformerFactory.newInstance().newTransformer();
        t.transform(new DOMSource(doc), new StreamResult(new FileOutputStream(fileName)));

    }


}

