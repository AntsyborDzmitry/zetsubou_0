package com.zetsubou_0.pattern.headfirst.observer.weatherstantion.custom.listener;

import com.zetsubou_0.pattern.headfirst.observer.weatherstantion.bean.WeatherData;
import com.zetsubou_0.pattern.headfirst.observer.weatherstantion.custom.handler.Handler;
import com.zetsubou_0.pattern.headfirst.observer.weatherstantion.representation.Display;

/**
 * Created by Kiryl_Lutsyk on 1/12/2015.
 */
public class Device2 implements Listener, Display {
    private Handler handler;

    public Device2(Handler handler) {
        this.handler = handler;
        handler.register(this);
    }

    @Override public void display(WeatherData data) {
        System.out.println("Advanced");
        System.out.println("Temperature: " + data.getTemperature() + " C");
        System.out.println("Humidity: " + data.getHumidity() + " %");
        System.out.println("Pressure: " + data.getPressure() + " atm");
        System.out.println();
    }

    @Override public void update(WeatherData data) {
        display(data);
    }
}
