package com.epam.pattern.headfirst.observer.weatherstantion.custom.listener;

import com.epam.pattern.headfirst.observer.weatherstantion.bean.WeatherData;
import com.epam.pattern.headfirst.observer.weatherstantion.custom.handler.Handler;
import com.epam.pattern.headfirst.observer.weatherstantion.representation.Display;

/**
 * Created by Kiryl_Lutsyk on 1/12/2015.
 */
public class Device1 implements Listener, Display {
    private Handler handler;

    public Device1(Handler handler) {
        this.handler = handler;
        handler.register(this);
    }

    @Override public void display(WeatherData data) {
        System.out.println("Simple (C): " + (int)data.getTemperature());
        System.out.println();
    }

    @Override public void update(WeatherData data) {
        display(data);
    }
}
