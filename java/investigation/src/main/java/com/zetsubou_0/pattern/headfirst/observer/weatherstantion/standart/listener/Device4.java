package com.zetsubou_0.pattern.headfirst.observer.weatherstantion.standart.listener;

import com.zetsubou_0.pattern.headfirst.observer.weatherstantion.bean.WeatherData;
import com.zetsubou_0.pattern.headfirst.observer.weatherstantion.representation.Display;
import com.zetsubou_0.pattern.headfirst.observer.weatherstantion.standart.handler.WeatherStationDefault;

import java.util.Observable;
import java.util.Observer;

/**
 * Created by Kiryl_Lutsyk on 1/12/2015.
 */
public class Device4 implements Observer, Display {
    private Observable handler;

    public Device4(Observable handler) {
        this.handler = handler;
        handler.addObserver(this);
    }

    @Override public void display(WeatherData data) {
        System.out.println("Advanced default");
        System.out.println("Temperature: " + data.getTemperature() + " C");
        System.out.println("Humidity: " + data.getHumidity() + " %");
        System.out.println("Pressure: " + data.getPressure() + " atm");
        System.out.println();
    }

    @Override public void update(Observable o, Object arg) {
        if(o instanceof WeatherStationDefault) {
            WeatherStationDefault weatherStation = (WeatherStationDefault) o;
            display(weatherStation.getWeatherData());
        }
    }
}
