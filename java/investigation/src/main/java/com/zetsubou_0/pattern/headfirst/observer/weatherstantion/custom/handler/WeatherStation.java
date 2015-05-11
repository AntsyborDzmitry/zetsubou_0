package com.zetsubou_0.pattern.headfirst.observer.weatherstantion.custom.handler;

import com.zetsubou_0.pattern.headfirst.observer.weatherstantion.bean.WeatherData;
import com.zetsubou_0.pattern.headfirst.observer.weatherstantion.custom.listener.Listener;
import com.zetsubou_0.pattern.headfirst.observer.weatherstantion.generator.Generator;
import com.zetsubou_0.pattern.headfirst.observer.weatherstantion.generator.WeatherGenerator;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.TimeUnit;

/**
 * Created by Kiryl_Lutsyk on 1/12/2015.
 */
public class WeatherStation implements Handler, Runnable {
    private List<Listener> listeners;
    private WeatherData weatherData;

    public WeatherStation() {
        listeners = new ArrayList<Listener>();
        weatherData = new WeatherData();
    }

    @Override
    public void register(Listener listener) {
        listeners.add(listener);
    }

    @Override
    public void remove(Listener listener) {
        listeners.remove(listener);
    }

    @Override
    public void notifyListener() {
        for(Listener listener : listeners) {
            listener.update(weatherData);
        }
    }

    @Override
    public void run() {
        Generator generator = new WeatherGenerator();
        weatherData = generator.generate();
        while(true) {
            try {
                notifyListener();
                TimeUnit.SECONDS.sleep(4);
                 generator.change(weatherData);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
    }
}
