package com.epam.pattern.headfirst.observer.weatherstantion.standart.handler;

import com.epam.pattern.headfirst.observer.weatherstantion.bean.WeatherData;
import com.epam.pattern.headfirst.observer.weatherstantion.generator.Generator;
import com.epam.pattern.headfirst.observer.weatherstantion.generator.WeatherGenerator;

import java.util.Observable;
import java.util.concurrent.TimeUnit;

/**
 * Created by Kiryl_Lutsyk on 1/12/2015.
 */
public class WeatherStationDefault extends Observable implements Runnable {
    private WeatherData weatherData;

    public WeatherStationDefault() {
    }

    @Override
    public void run() {
        Generator generator = new WeatherGenerator();
        weatherData = generator.generate();
        while(true) {
            try {
                generator.change(weatherData);
                setChanged();
                notifyObservers();
                TimeUnit.SECONDS.sleep(3);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
    }

    public WeatherData getWeatherData() {
        return weatherData;
    }
}
