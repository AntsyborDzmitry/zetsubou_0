package com.zetsubou_0.pattern.headfirst.observer.weatherstantion.custom.listener;

import com.zetsubou_0.pattern.headfirst.observer.weatherstantion.bean.WeatherData;

/**
 * Created by Kiryl_Lutsyk on 1/12/2015.
 */
public interface Listener {
    void update(WeatherData data);
}
