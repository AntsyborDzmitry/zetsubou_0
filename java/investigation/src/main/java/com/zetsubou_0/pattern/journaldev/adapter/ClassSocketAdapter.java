package com.zetsubou_0.pattern.journaldev.adapter;

/**
 * Created by Kiryl_Lutsyk on 10/1/2015.
 */
public class ClassSocketAdapter extends Socket implements SocketAdapter {
    @Override
    public Socket get5Socket() {
        Volt v = getVolt();
        v.setVolt(5);
        Socket s = new Socket();
        s.setVolt(v);
        return s;
    }

    @Override
    public Socket get12Socket() {
        Volt v = getVolt();
        v.setVolt(12);
        Socket s = new Socket();
        s.setVolt(v);
        return s;
    }
}
