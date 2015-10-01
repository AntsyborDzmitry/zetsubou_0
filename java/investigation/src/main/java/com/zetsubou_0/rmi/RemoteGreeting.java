package com.zetsubou_0.rmi;

import java.rmi.RemoteException;
import java.rmi.server.RMIClientSocketFactory;
import java.rmi.server.RMIServerSocketFactory;
import java.rmi.server.UnicastRemoteObject;

/**
 * Created by Kiryl_Lutsyk on 9/30/2015.
 */
public class RemoteGreeting extends UnicastRemoteObject implements Greeting {
    public RemoteGreeting() throws RemoteException {
        super();
    }

    public RemoteGreeting(int port) throws RemoteException {
        super(port);
    }

    public RemoteGreeting(int port, RMIClientSocketFactory csf, RMIServerSocketFactory ssf) throws RemoteException {
        super(port, csf, ssf);
    }

    @Override
    public String say() throws RemoteException {
        return "Hello everybody";
    }
}
