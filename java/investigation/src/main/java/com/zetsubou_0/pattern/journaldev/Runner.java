package com.zetsubou_0.pattern.journaldev;

import com.zetsubou_0.pattern.journaldev.abstractfactory.ComputerFactory;
import com.zetsubou_0.pattern.journaldev.abstractfactory.PcFactory;
import com.zetsubou_0.pattern.journaldev.abstractfactory.ServerFactory;
import com.zetsubou_0.pattern.journaldev.factory.Types;
import com.zetsubou_0.pattern.journaldev.factory.bean.Computer;
import com.zetsubou_0.pattern.journaldev.prototype.World;

/**
 * Created by Kiryl_Lutsyk on 10/1/2015.
 */
public class Runner {
    public static void main(String[] args) {
        /*factory*/
        //java.util.Calendar#getInstance()
        //java.util.ResourceBundle#getBundle()
        //java.text.NumberFormat#getInstance()
        //java.nio.charset.Charset#forName()
        //java.net.URLStreamHandlerFactory#createURLStreamHandler(String)
        Computer pc = com.zetsubou_0.pattern.journaldev.factory.ComputerFactory.getComputer(Types.PC, "ram", "hd", "cpu");
        Computer server = com.zetsubou_0.pattern.journaldev.factory.ComputerFactory.getComputer(Types.SERVER, "ram", "hd", "cpu");
        System.out.println("Factory");
        System.out.println(pc);
        System.out.println(server);


        /*abstract factory*/
        //javax.xml.parsers.DocumentBuilderFactory#newInstance()
        //javax.xml.transform.TransformerFactory#newInstance()
        //javax.xml.xpath.XPathFactory#newInstance()
        System.out.println("\nAbstract Factory");
        com.zetsubou_0.pattern.journaldev.abstractfactory.bean.Computer pc2 = ComputerFactory.getComputer(
                new PcFactory("hd", "ram", "cpu"));
        com.zetsubou_0.pattern.journaldev.abstractfactory.bean.Computer server2 = ComputerFactory.getComputer(
                new ServerFactory("hd", "ram", "cpu"));
        System.out.println(pc2);
        System.out.println(server2);


        /*builder*/
        //java.lang.StringBuilder#append()
        //java.lang.StringBuffer#append()
        //java.nio.ByteBuffer#put()
        System.out.println("\nBuilder");
        com.zetsubou_0.pattern.journaldev.builder.Computer computer = new com.zetsubou_0.pattern.journaldev.builder.Computer.ComputerBuilder("cpu", "hd", "ram")
                .setModelName("model name").build();
        System.out.println(computer);


        /*prototype*/
        //java.lang.Object#clone()
        System.out.println("\nPrototype");
        try {
            World world = new World();
            world.getRegions().add("Russia");
            world.getRegions().add("Belarus");
            world.getRegions().add("America");
            World world1 = (World) world.clone();
            world1.getRegions().remove("America");
            System.out.println(world.getRegions());
            System.out.println(world1.getRegions());
        } catch (CloneNotSupportedException e) {
            e.printStackTrace();
        }


        /*adapter*/
        //java.util.Arrays#asList()
        //java.io.InputStreamReader(InputStream) (returns a Reader)
        //java.io.OutputStreamWriter(OutputStream) (returns a Writer)
        //javax.xml.bind.annotation.adapters.XmlAdapter#marshal()
        System.out.println("\nAdapter");
    }
}