package com.zetsubou_0.rmi.client;

import com.zetsubou_0.rmi.Greeting;

import java.net.MalformedURLException;
import java.rmi.Naming;
import java.rmi.NotBoundException;
import java.rmi.RemoteException;

/**
 * Created by Kiryl_Lutsyk on 9/30/2015.
 */
public class Client {
    private static final String NAME = "rmi://localhost:5000/hello";

    public static void main(String[] args) {
        try {
            Greeting stub = (Greeting) Naming.lookup(NAME);
            System.out.println(stub.say());
        } catch (RemoteException | MalformedURLException | NotBoundException e) {
            e.printStackTrace();
        }
    }
}
