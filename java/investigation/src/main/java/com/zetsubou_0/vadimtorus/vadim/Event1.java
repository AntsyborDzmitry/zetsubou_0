package com.zetsubou_0.vadimtorus.vadim;

public class Event1 implements EventCount {
    static float a;
    static float b;

    public Event1(float exam1, float exam2)
    {
        a = exam1;
        b = exam2;
    }
    public boolean Result(){
        return (a+b)>=15;
    }

}