package com.zetsubou_0.pattern.journaldev;

import com.zetsubou_0.pattern.journaldev.abstractfactory.ComputerFactory;
import com.zetsubou_0.pattern.journaldev.abstractfactory.PcFactory;
import com.zetsubou_0.pattern.journaldev.abstractfactory.ServerFactory;
import com.zetsubou_0.pattern.journaldev.adapter.ClassSocketAdapter;
import com.zetsubou_0.pattern.journaldev.adapter.ObjectSocketAdapter;
import com.zetsubou_0.pattern.journaldev.adapter.Socket;
import com.zetsubou_0.pattern.journaldev.bridge.GreenColor;
import com.zetsubou_0.pattern.journaldev.bridge.RedColor;
import com.zetsubou_0.pattern.journaldev.chainofresponsibility.*;
import com.zetsubou_0.pattern.journaldev.composite.Circle;
import com.zetsubou_0.pattern.journaldev.composite.CompositeShape;
import com.zetsubou_0.pattern.journaldev.composite.Rectangle;
import com.zetsubou_0.pattern.journaldev.composite.Shape;
import com.zetsubou_0.pattern.journaldev.decorator.Car;
import com.zetsubou_0.pattern.journaldev.decorator.SalesmanCar;
import com.zetsubou_0.pattern.journaldev.decorator.SportCar;
import com.zetsubou_0.pattern.journaldev.facade.FacadeHelper;
import com.zetsubou_0.pattern.journaldev.factory.Types;
import com.zetsubou_0.pattern.journaldev.factory.bean.Computer;
import com.zetsubou_0.pattern.journaldev.flyweight.ShapeFlyweightFactory;
import com.zetsubou_0.pattern.journaldev.mediator.MediatorChat;
import com.zetsubou_0.pattern.journaldev.mediator.MediatorChatimpl;
import com.zetsubou_0.pattern.journaldev.mediator.UserImpl;
import com.zetsubou_0.pattern.journaldev.observer.MailReceiver;
import com.zetsubou_0.pattern.journaldev.observer.MailSender;
import com.zetsubou_0.pattern.journaldev.prototype.World;
import com.zetsubou_0.pattern.journaldev.proxy.Command;
import com.zetsubou_0.pattern.journaldev.proxy.CommandProxy;
import com.zetsubou_0.pattern.journaldev.proxy.User;
import com.zetsubou_0.pattern.journaldev.strategy.Cardpay;
import com.zetsubou_0.pattern.journaldev.strategy.NetPay;
import com.zetsubou_0.pattern.journaldev.strategy.PayStrategy;
import com.zetsubou_0.pattern.journaldev.strategy.Shop;
import com.zetsubou_0.pattern.journaldev.templatemethod.BlockedHouse;
import com.zetsubou_0.pattern.journaldev.templatemethod.TemplateHouse;
import com.zetsubou_0.pattern.journaldev.templatemethod.WoodHouse;

/**
 * Created by Kiryl_Lutsyk on 10/1/2015.
 */
public class Runner {
    public static void main(String[] args) {
        /************************************************
         *   Creational Design Patterns                 *
         ***********************************************/
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


        /************************************************
         *   Structural Design Patterns                 *
         ***********************************************/
        /*adapter*/
        //java.util.Arrays#asList()
        //java.io.InputStreamReader(InputStream) (returns a Reader)
        //java.io.OutputStreamWriter(OutputStream) (returns a Writer)
        //javax.xml.bind.annotation.adapters.XmlAdapter#marshal()
        System.out.println("\nAdapter");
        Socket socket = new Socket();
        System.out.println(socket.getVolt());
        System.out.println(new ClassSocketAdapter().get5Socket().getVolt());
        System.out.println(new ClassSocketAdapter().get12Socket().getVolt());
        System.out.println(new ObjectSocketAdapter(new Socket()).get5Socket().getVolt());
        System.out.println(new ObjectSocketAdapter(new Socket()).get12Socket().getVolt());


        /*bridge*/
        // None comes to mind yet
        System.out.println("\nBridge");
        com.zetsubou_0.pattern.journaldev.bridge.Shape shape = new com.zetsubou_0.pattern.journaldev.bridge.Circle(new RedColor());
        com.zetsubou_0.pattern.journaldev.bridge.Shape shape2 = new com.zetsubou_0.pattern.journaldev.bridge.Rectangle(new GreenColor());
        shape.draw();
        shape2.draw();


        /*composite*/
        //java.awt.Container#add(Component) (practically all over Swing thus)
        //javax.faces.component.UIComponent#getChildren() (practically all over JSF UI thus)
        System.out.println("\nComposite");
        Shape circle = new Circle();
        Shape rectangle = new Rectangle();
        CompositeShape group = new CompositeShape();
        group.add(circle);
        group.add(rectangle);
        group.draw();


        /*decorator*/
        //All subclasses of java.io.InputStream, OutputStream, Reader and Writer have a constructor taking an instance of same type.
        //java.util.Collections, the checkedXXX(), synchronizedXXX() and unmodifiableXXX() methods.
        //javax.servlet.http.HttpServletRequestWrapper and HttpServletResponseWrapper
        System.out.println("\nDecorator");
        Car car = new SalesmanCar();
        car.drive();
        Car sportCar = new SportCar(car);
        sportCar.drive();
        new SportCar(sportCar).drive();


        /*facade*/
        //javax.faces.context.FacesContext, it internally uses among others the abstract/interface types LifeCycle, ViewHandler, NavigationHandler and many more without that the enduser has to worry about it (which are however overrideable by injection).
        //javax.faces.context.ExternalContext, which internally uses ServletContext, HttpSession, HttpServletRequest, HttpServletResponse, etc.
        System.out.println("\nFacade");
        FacadeHelper.report(FacadeHelper.BaseType.SQL, FacadeHelper.ReportType.HTML, "someTable");
        FacadeHelper.report(FacadeHelper.BaseType.ORACLE, FacadeHelper.ReportType.PDF, "someTable");


        /*flyweight*/
        //java.lang.Integer#valueOf(int) (also on Boolean, Byte, Character, Short, Long and BigDecimal)
        System.out.println("\nFlyweight");
        System.out.println(ShapeFlyweightFactory.getShape(ShapeFlyweightFactory.Type.CIRCLE));
        System.out.println(ShapeFlyweightFactory.getShape(ShapeFlyweightFactory.Type.ORB_2D));
        System.out.println(ShapeFlyweightFactory.getShape(ShapeFlyweightFactory.Type.ORB_3D));
        System.out.println(ShapeFlyweightFactory.getShape(ShapeFlyweightFactory.Type.ORB_2D));


        /*proxy*/
        //java.lang.reflect.Proxy
        //java.rmi.*, the whole API actually.
        System.out.println("\nProxy");
        try {
            Command command = new CommandProxy(User.ADMIN);
            command.execute("init");
            command = new CommandProxy(User.GUEST);
            command.execute("init");
            command = new CommandProxy(null);
            command.execute("init");
        } catch (Exception e) {
            e.printStackTrace();
        }


        /************************************************
         *   Behavioral Design Patterns                 *
         ***********************************************/
        /*Chain of responsibility*/
        //java.util.logging.Logger#log()
        //javax.servlet.Filter#doFilter()
        System.out.println("\nChain of responsibility");
        Chain node1 = new Chain50();
        Chain node2 = new Chain20();
        Chain node3 = new Chain10();
        Chain node4 = new Chain5();
        Chain node5 = new Chain1();
        node1.setNextChain(node2);
        node2.setNextChain(node3);
        node3.setNextChain(node4);
        node4.setNextChain(node5);
        try {
            node1.perform(537);
        } catch (Exception e) {
            e.printStackTrace();
        }


        /*Command*/
        //All implementations of java.lang.Runnable
        //All implementations of javax.swing.Action
        System.out.println("\nCommand");


        /*Interpreter*/
        //java.util.Pattern
        //java.text.Normalizer
        //All subclasses of java.text.Format
        //All subclasses of javax.el.ELResolver
        System.out.println("\nInterpreter");


        /*Iterator*/
        //All implementations of java.util.Iterator (thus among others also java.util.Scanner!).
        //All implementations of java.util.Enumeration
        System.out.println("\nIterator");


        /*Mediator*/
        //java.util.Timer (all scheduleXXX() methods)
        //java.util.concurrent.Executor#execute()
        //java.util.concurrent.ExecutorService (the invokeXXX() and submit() methods)
        //java.util.concurrent.ScheduledExecutorService (all scheduleXXX() methods)
        //java.lang.reflect.Method#invoke()
        System.out.println("\nMediator");
        MediatorChat mediatorChat = new MediatorChatimpl();
        com.zetsubou_0.pattern.journaldev.mediator.User u1 = new UserImpl("a", mediatorChat);
        com.zetsubou_0.pattern.journaldev.mediator.User u2 = new UserImpl("b", mediatorChat);
        com.zetsubou_0.pattern.journaldev.mediator.User u3 = new UserImpl("c", mediatorChat);
        com.zetsubou_0.pattern.journaldev.mediator.User u4 = new UserImpl("d", mediatorChat);
        mediatorChat.addUser(u1);
        mediatorChat.addUser(u2);
        mediatorChat.addUser(u3);
        mediatorChat.addUser(u4);
        mediatorChat.addUser(u2);
        u2.sendMsg("Hello");


        /*Memento*/
        //java.util.Date (the setter methods do that, Date is internally represented by a long value)
        //All implementations of java.io.Serializable
        //All implementations of javax.faces.component.StateHolder
        System.out.println("\nMemento");


        /*Observer (or Publish/Subscribe)*/
        //java.util.Observer/java.util.Observable (rarely used in real world though)
        //All implementations of java.util.EventListener (practically all over Swing thus)
        //javax.servlet.http.HttpSessionBindingListener
        //javax.servlet.http.HttpSessionAttributeListener
        //javax.faces.event.PhaseListener
        System.out.println("\nObserver (or Publish/Subscribe)");
        MailReceiver employee1 = new MailReceiver("e1@company.com");
        MailReceiver employee2 = new MailReceiver("e2@company.com");
        MailReceiver employee3 = new MailReceiver("e3@company.com");
        MailReceiver employee4 = new MailReceiver("e4@company.com");
        MailReceiver employee5 = new MailReceiver("e5@company.com");
        MailSender mailSender = new MailSender();
        mailSender.addObserver(employee1);
        mailSender.addObserver(employee2);
        mailSender.addObserver(employee3);
        mailSender.addObserver(employee4);
        mailSender.addObserver(employee5);
        mailSender.sendMail(employee4, "Hello");


        /*State*/
        //javax.faces.lifecycle.LifeCycle#execute() (controlled by FacesServlet, the behaviour is dependent on current phase (state) of JSF lifecycle)
        System.out.println("\nState");


        /*Strategy*/
        //java.util.Comparator#compare(), executed by among others Collections#sort().
        //javax.servlet.http.HttpServlet, the service() and all doXXX() methods take HttpServletRequest and HttpServletResponse and the implementor has to process them (and not to get hold of them as instance variables!).
        //javax.servlet.Filter#doFilter()
        System.out.println("\nStrategy");
        Shop shop = new Shop();
        PayStrategy card = new Cardpay(12345678);
        PayStrategy inet = new NetPay("uSer", "www.aliexpress.com");
        shop.buy("mobile", 200, card);
        shop.buy("mobile", 110, inet);


        /*Template method*/
        //All non-abstract methods of java.io.InputStream, java.io.OutputStream, java.io.Reader and java.io.Writer.
        //All non-abstract methods of java.util.AbstractList, java.util.AbstractSet and java.util.AbstractMap.
        //javax.servlet.http.HttpServlet, all the doXXX() methods by default sends a HTTP 405 "Method Not Allowed" error to the response. You're free to implement none or any of them.
        System.out.println("\nTemplate method");
        TemplateHouse woodHouse = new WoodHouse();
        TemplateHouse blockedHouse = new BlockedHouse();
        woodHouse.build();
        blockedHouse.build();


        /*Visitor*/
        //javax.lang.model.element.AnnotationValue and AnnotationValueVisitor
        //javax.lang.model.element.Element and ElementVisitor
        //javax.lang.model.type.TypeMirror and TypeVisitor
        //java.nio.file.FileVisitor and SimpleFileVisitor
        System.out.println("\nVisitor");


        /*----------------------
        facade
        mediator
        -----------------------*/
    }
}
