package com.epam.pattern.headfirst.observer.weatherstantion.representation;

import com.epam.pattern.headfirst.observer.weatherstantion.bean.WeatherData;

/**
 * Created by Kiryl_Lutsyk on 1/12/2015.
 */
public interface Display {
    void display(WeatherData data);
}
