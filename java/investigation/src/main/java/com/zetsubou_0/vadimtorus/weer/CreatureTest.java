package com.zetsubou_0.vadimtorus.weer;

import java.util.LinkedList;
import java.util.List;

public class CreatureTest {
    public static void main(String[] args) {
        Creature cat = new Cat(1, "kawaii");
        Creature dog = new Dog();

        List<Creature> creatures = new LinkedList<>();
        cat.collect(creatures);
        dog.collect(creatures);

        for (Creature creature : creatures) {
            creature.printInfo();
        }
    }
}
