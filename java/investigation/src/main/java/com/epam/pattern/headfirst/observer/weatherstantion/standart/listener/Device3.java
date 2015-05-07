package com.epam.pattern.headfirst.observer.weatherstantion.standart.listener;

import com.epam.pattern.headfirst.observer.weatherstantion.bean.WeatherData;
import com.epam.pattern.headfirst.observer.weatherstantion.representation.Display;
import com.epam.pattern.headfirst.observer.weatherstantion.standart.handler.WeatherStationDefault;

import java.util.Observable;
import java.util.Observer;

/**
 * Created by Kiryl_Lutsyk on 1/12/2015.
 */
public class Device3 implements Observer, Display {
    private Observable handler;

    public Device3(Observable handler) {
        this.handler = handler;
        handler.addObserver(this);
    }

    @Override public void display(WeatherData data) {
        System.out.println("Simple Default (C): " + (int)data.getTemperature());
        System.out.println();
    }

    @Override public void update(Observable o, Object arg) {
        if(o instanceof WeatherStationDefault) {
            WeatherStationDefault weatherStation = (WeatherStationDefault) o;
            display(weatherStation.getWeatherData());
        }
    }
}
