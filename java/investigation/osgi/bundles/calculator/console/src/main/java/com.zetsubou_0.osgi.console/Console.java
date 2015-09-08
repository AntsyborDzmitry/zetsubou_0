package com.zetsubou_0.osgi.console;

import java.io.*;
import java.util.Scanner;

/**
 * Created by Kiryl_Lutsyk on 9/8/2015.
 */
public class Console implements Runnable {
    private BufferedReader in;
    private PrintStream out;

    public Console(PrintStream out, InputStream in) {
        this.out = out;
        this.in = new BufferedReader(new InputStreamReader(in));
    }

    @Override
    public void run() {
        synchronized (Console.class) {
            try {
                while (true) {
                    String str = in.readLine();
                    if(str.startsWith("calculator:")) {
                        out.println(str.toUpperCase());
                    } else {
                        out.println(str);
                    }
                    out.flush();
                }
            } catch(Exception e) {
                out.println(e);
            }
        }
    }

}
