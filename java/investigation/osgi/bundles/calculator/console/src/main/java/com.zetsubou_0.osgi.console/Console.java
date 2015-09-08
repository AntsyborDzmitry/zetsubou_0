package com.zetsubou_0.osgi.console;

import java.io.*;

/**
 * Created by Kiryl_Lutsyk on 9/8/2015.
 */
public class Console implements Runnable {
    private BufferedReader in;
    private PrintStream out;
    private boolean isWorking;

    public Console(PrintStream out, InputStream in) {
        this.out = out;
        this.in = new BufferedReader(new InputStreamReader(in));
    }

    @Override
    public void run() {
        synchronized (Console.class) {
            try {
                isWorking = true;
                while (isWorking) {
                    String str = in.readLine();
                    out.println(str.toUpperCase());
                }
            } catch (IOException e) {
                out.println(e);
            }
        }
    }

    public boolean isWorking() {
        return isWorking;
    }

    public void setWorking(boolean isWorking) {
        this.isWorking = isWorking;
    }
}
