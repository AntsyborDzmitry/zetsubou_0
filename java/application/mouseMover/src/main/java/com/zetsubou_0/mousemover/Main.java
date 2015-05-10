//package com.zetsubou_0.mousemover;
//
//import com.zetsubou_0.mousemover.robot.MouseMover;
//import com.zetsubou_0.mousemover.util.process.ProcessFinder;
//import com.zetsubou_0.mousemover.util.process.ProcessFinderLinux;
//import org.json.simple.JSONArray;
//import org.json.simple.JSONObject;
//import org.json.simple.parser.JSONParser;
//import org.json.simple.parser.ParseException;
//
//import java.io.File;
//import java.io.FileReader;
//import java.io.IOException;
//
///**
// * Created by zetsubou_0 on 14.02.15.
// */
//public class Main {
//    private static final String PATH = "properties.json";
//
//    public static void main(String[] args) {
//        File f = new File(PATH);
//
//        JSONParser parser = new JSONParser();
//        try {
//            MouseMover mouseMover = new MouseMover();
//            mouseMover.setHeight(16000);
//            mouseMover.setWidth(9000);
//            ProcessFinder processFinder = new ProcessFinderLinux();
//
//            while(true) {
//                JSONObject properties = (JSONObject) parser.parse(new FileReader(f));
//                JSONArray processList = (JSONArray) properties.get("list");
//                for(Object obj : processList) {
//                    boolean isActive = processFinder.isActive((String) obj);
//                    if(isActive) {
//                        JSONObject timeout = (JSONObject) properties.get("timeout");
//                        String timeName = (String) timeout.get("time");
//                        Long timeValue = (Long) timeout.get("value");
//
//                        mouseMover.setDelay(timeValue);
//                        mouseMover.setTimeName(timeName);
//
//                        Thread mover = new Thread(mouseMover);
//                        mover.start();
//                        mover.join();
//                    }
//                }
//
//                Thread.sleep(5000);
//            }
//        } catch (IOException e) {
//            e.printStackTrace();
//        } catch (ParseException e) {
//            e.printStackTrace();
//        } catch (InterruptedException e) {
//            e.printStackTrace();
//        }
//
//    }
//}
