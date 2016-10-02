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
        List<String> fileLines = Files.readAllLines(Paths.get(args[0]), StandardCharsets.UTF_8);

        List<EventCount> successEventList = new ArrayList<>();

		successEventsPrint(fileLines, successEventList);
        sortedListPrint(successEventList);
        chosenEventPrint(successEventList);

    }

    private static void fillList(List<EventCount> list, EventCount eventPass)
    {
        if (eventPass.result())
            list.add(eventPass);
    }
	private static void successEventsPrint(List<String> lines, List<EventCount> list)
	{
		for (String t: lines)
		{
			String[] exams = t.split(" ");
			String eventName = String.valueOf(exams[0]);

			switch (Names.valueOf(eventName))
			{
				case FIRST_EVENT:
					double firstEventExam1 = Double.valueOf(exams[1]);
					double firstEventExam2 = Double.valueOf(exams[2]);
					EventCount eventPass1 = new Event1(firstEventExam1, firstEventExam2);
					fillList(list, eventPass1);
					break;
				case SECOND_EVENT:
					double secondEventExam1 = Double.valueOf(exams[1]);
					double secondEventExam2 = Double.valueOf(exams[2]);
					EventCount eventPass2 = new Event2(secondEventExam1, secondEventExam2);
					fillList(list, eventPass2);
					break;
				case THIRD_EVENT:
					double thirdEventExam1 = Double.valueOf(exams[1]);
					double thirdEventExam2 = Double.valueOf(exams[2]);
					boolean thirdEventExam3 = Boolean.valueOf(exams[3]);
					EventCount eventPass3 = new Event3(thirdEventExam1, thirdEventExam2, thirdEventExam3);
					fillList(list, eventPass3);
					break;
				case FOURTH_EVENT:
					double fourthEventExam1 = Double.valueOf(exams[1]);
					double fourthEventExam2 = Double.valueOf(exams[2]);
					double fourthEventExam3 = Double.valueOf(exams[3]);
					EventCount eventPass4 = new Event4(fourthEventExam1, fourthEventExam2, fourthEventExam3);
					fillList(list, eventPass4);
					break;
				case FIFTH_EVENT:
					boolean fifthEventExam1 = Boolean.valueOf(exams[1]);
					boolean fifthEventExam2 = Boolean.valueOf(exams[2]);
					double fifthEventExam3 = Double.valueOf(exams[3]);
					EventCount eventPass5 = new Event5(fifthEventExam1, fifthEventExam2, fifthEventExam3);
					fillList(list, eventPass5);
					break;

			}
		}
        System.out.println("Successfully passed events:");
          for (EventCount showEvent: list)
            {
             System.out.println(showEvent);
            }

	}

    private static void sortedListPrint(List<EventCount> successEventList)
    {
        successEventList.sort((EventCount eventPass1, EventCount eventPass2) -> eventPass2.maxMark().compareTo(eventPass1.maxMark()));

        System.out.println("\nEvent list sorted by maxmark:");
        successEventList.forEach(System.out::println);
    }

    private static void chosenEventPrint (List<EventCount> successEventList)
    {

        for (int i=successEventList.size() - 1; i>=0; i--)
        {
            EventCount event = successEventList.get(i);
            if (event.maxMark()>=15)
            {
                System.out.println("\nEvent with mark >= 15:");
                System.out.println(event);
                break;
            }
        }

    }






}







