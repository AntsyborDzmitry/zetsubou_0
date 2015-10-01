package com.zetsubou_0.rmi;

import java.rmi.Remote;
import java.rmi.RemoteException;

/**
 * Created by Kiryl_Lutsyk on 9/30/2015.
 */
public interface Greeting extends Remote {
    String say() throws RemoteException;
}
