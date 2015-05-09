package com.epam.pattern.headfirst.observer.weatherstantion.generator;

import com.epam.pattern.headfirst.observer.weatherstantion.bean.WeatherData;

/**
 * Created by Kiryl_Lutsyk on 1/12/2015.
 */
public interface Generator {
    WeatherData generate();
    void change(WeatherData weatherData);
}
