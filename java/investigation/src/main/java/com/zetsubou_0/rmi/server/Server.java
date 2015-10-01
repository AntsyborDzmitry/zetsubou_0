package com.zetsubou_0.rmi.server;

import com.zetsubou_0.rmi.Greeting;
import com.zetsubou_0.rmi.RemoteGreeting;

import java.net.MalformedURLException;
import java.rmi.AlreadyBoundException;
import java.rmi.Naming;
import java.rmi.RemoteException;

/**
 * Created by Kiryl_Lutsyk on 9/30/2015.
 */
public class Server {
    private static final String NAME = "rmi://localhost:5000/hello";

    public static void main(String[] args) {
        try {
            Greeting stub = new RemoteGreeting();
            Naming.bind(NAME, stub);
        } catch (RemoteException | MalformedURLException | AlreadyBoundException e) {
            e.printStackTrace();
        }
    }
}
