package uiversity.tasks;

import uiversity.tasks.model.Edition;
import uiversity.tasks.model.Journal;
import uiversity.tasks.model.Newspaper;

public class Task4 {
    public static void main(String[] args) {
        Edition edition = new Edition("Edition", "BPI", 1230);
        Edition newspaper = new Newspaper("Accident", "BPI", 12, Newspaper.Color.BLACK_WHITE);
        Edition journal = new Journal("Edition", "BPI", 51, Journal.Type.GLOSSY);

        System.out.println(edition);
        System.out.println();
        System.out.println(newspaper);
        System.out.println();
        System.out.println(journal);
    }
}
