package com.zetsubou_0.vadimtorus.vadim;
import java.util.*;
import java.nio.file.*;
import java.nio.charset.*;
import java.io.IOException;

public class Event{
    public static void main (String[] args) throws IOException {

        List<String> lines = Files.readAllLines(Paths.get("Exams.txt"), StandardCharsets.UTF_8);

        String firstevent = lines.get(0);
        String[] firstexams = firstevent.split(" ");
        float firsteventexam1 = Float.valueOf(firstexams[1]);
        float firsteventexam2 = Float.valueOf(firstexams[2]);

        String secondevent = lines.get(1);
        String[] secondexams = secondevent.split(" ");
        float secondeventexam1 = Float.valueOf(secondexams[1]);
        float secondeventexam2 = Float.valueOf(secondexams[2]);

        String thirdevent = lines.get(2);
        String[] thirdexams = thirdevent.split(" ");
        float thirdeventexam1 = Float.valueOf(thirdexams[1]);
        float thirdeventexam2 = Float.valueOf(thirdexams[2]);
        boolean thirdeventexam3 = Boolean.valueOf(thirdexams[3]);

        String fourthevent = lines.get(3);
        String[] fourthexams = fourthevent.split(" ");
        float fourtheventexam1 = Float.valueOf(fourthexams[1]);
        float fourtheventexam2 = Float.valueOf(fourthexams[2]);
        float fourtheventexam3 = Float.valueOf(fourthexams[3]);

        String fifthevent = lines.get(4);
        String[] fifthexams = fifthevent.split(" ");
        boolean fiftheventexam1 = Boolean.valueOf(fifthexams[1]);
        boolean fiftheventexam2 = Boolean.valueOf(fifthexams[2]);
        float fiftheventexam3 = Float.valueOf(fifthexams[3]);


        EventCount candidate1 = new Event1(firsteventexam1, firsteventexam2);
        EventCount candidate2 = new Event2(secondeventexam1, secondeventexam2);
        EventCount candidate3 = new Event3(thirdeventexam1, thirdeventexam2, thirdeventexam3);
        EventCount candidate4 = new Event4(fourtheventexam1, fourtheventexam2, fourtheventexam3);
        EventCount candidate5 = new Event5(fiftheventexam1, fiftheventexam2, fiftheventexam3);

        ArrayList<EventCount> list = new ArrayList<EventCount>();


        if (candidate1.Result()==true)
            list.add(candidate1);
        if (candidate2.Result()==true)
            list.add(candidate2);
        if (candidate3.Result()==true)
            list.add(candidate3);
        if (candidate4.Result()==true)
            list.add(candidate4);
        if (candidate5.Result()==true)
            list.add(candidate5);
        for (EventCount t: list)
            System.out.println(t.toString());


    }
}
