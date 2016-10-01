package com.zetsubou_0.vadimtorus.vadim;

import java.lang.*;
import java.util.*;
import java.nio.file.*;
import java.nio.charset.*;
import java.io.IOException;



public class Event
{
    public static void main (String[] args) throws IOException
    {

        List<String> lines = Files.readAllLines(Paths.get(args[0]), StandardCharsets.UTF_8);

        List<EventCount> list = new ArrayList<>();

        for (int i=0; i<lines.size(); i++)
        {
            String line = lines.get(i);
            String[] exams = line.split(" ");
            String eventName = String.valueOf(exams[0]);

            switch (Names.valueOf(eventName))
            {
                case FIRST_EVENT:
                    float firsteventexam1 = Float.valueOf(exams[1]);
                    float firsteventexam2 = Float.valueOf(exams[2]);
                    EventCount eventpass1 = new Event1(firsteventexam1, firsteventexam2);
                    fillList(list, eventpass1);
                    break;
                case SECOND_EVENT:
                    float secondeventexam1 = Float.valueOf(exams[1]);
                    float secondeventexam2 = Float.valueOf(exams[2]);
                    EventCount eventpass2 = new Event2(secondeventexam1, secondeventexam2);
                    fillList(list, eventpass2);
                    break;
                case THIRD_EVENT:
                    float thirdeventexam1 = Float.valueOf(exams[1]);
                    float thirdeventexam2 = Float.valueOf(exams[2]);
                    boolean thirdeventexam3 = Boolean.valueOf(exams[3]);
                    EventCount eventpass3 = new Event3(thirdeventexam1, thirdeventexam2, thirdeventexam3);
                    fillList(list, eventpass3);
                    break;
                case FOURTH_EVENT:
                    float fourtheventexam1 = Float.valueOf(exams[1]);
                    float fourtheventexam2 = Float.valueOf(exams[2]);
                    float fourtheventexam3 = Float.valueOf(exams[3]);
                    EventCount eventpass4 = new Event4(fourtheventexam1, fourtheventexam2, fourtheventexam3);
                    fillList(list, eventpass4);
                    break;
                case FIFTH_EVENT:
                    boolean fiftheventexam1 = Boolean.valueOf(exams[1]);
                    boolean fiftheventexam2 = Boolean.valueOf(exams[2]);
                    float fiftheventexam3 = Float.valueOf(exams[3]);
                    EventCount eventpass5 = new Event5(fiftheventexam1, fiftheventexam2, fiftheventexam3);
                    fillList(list, eventpass5);
                    break;
            }
        }

        System.out.println("Successfully passed events:");

        for (EventCount t: list)
        {
            System.out.println(t.toString());
        }

        list.sort((EventCount eventPass1, EventCount eventPass2) -> eventPass2.maxMark().compareTo(eventPass1.maxMark()));


        System.out.println("\nSorted event list:");


        list.forEach(System.out::println);

     for (int i=list.size() - 1; i>=0; i--)
     {
         EventCount x = list.get(i);
         if (x.maxMark()>=15)
         {
             System.out.println("\nEvent with mark >= 15:");
             System.out.println(x);
             break;
         }

     }


    }

    private static void fillList(List<EventCount> list, EventCount eventPass)
    {
        if (eventPass.result())
            list.add(eventPass);
    }



}







