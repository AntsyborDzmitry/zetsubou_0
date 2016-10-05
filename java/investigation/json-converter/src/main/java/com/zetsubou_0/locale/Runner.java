package com.zetsubou_0.locale;

import com.zetsubou_0.locale.util.JsonConverter;

import java.io.File;

/**
 * Created by Kiryl_Lutsyk on 9/27/2016.
 */
public class Runner {

    private static final String PATH = "";

    public static void main(String[] args) {

        try {
            JsonConverter.convertJsonAndWriteInXml(new File(PATH));
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
