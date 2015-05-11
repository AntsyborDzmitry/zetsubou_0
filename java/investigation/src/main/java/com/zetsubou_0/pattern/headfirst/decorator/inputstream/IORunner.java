package com.zetsubou_0.pattern.headfirst.decorator.inputstream;

import java.io.*;

/**
 * Created by Kiryl_Lutsyk on 1/13/2015.
 */
public class IORunner {
    private static String file = "d:\\temp\\iotest";

    public static void main(String[] args) {
        InputStream in = null;
        try {
            in = new LowerCaseInputStream(new BufferedInputStream(new FileInputStream(file)));
            int c;
            while((c = in.read()) >= 0) {
                System.out.print((char)c);
            }
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            try {
                if(in != null) {
                    in.close();
                }
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }
}
