package com.epam.pattern.headfirst.observer.weatherstantion;

import com.epam.pattern.headfirst.observer.weatherstantion.custom.handler.WeatherStation;
import com.epam.pattern.headfirst.observer.weatherstantion.custom.listener.Device1;
import com.epam.pattern.headfirst.observer.weatherstantion.custom.listener.Device2;
import com.epam.pattern.headfirst.observer.weatherstantion.standart.handler.WeatherStationDefault;
import com.epam.pattern.headfirst.observer.weatherstantion.standart.listener.Device3;
import com.epam.pattern.headfirst.observer.weatherstantion.standart.listener.Device4;

/**
 * Created by Kiryl_Lutsyk on 1/12/2015.
 *
 * Observer
 * defines a one-to-many dependency
 * between objects so that when one
 * object changes the state, all its
 * dependents are notified and updated
 * automatically
 */
public class WeatherStationRunner {
    public static void main(String[] args) {
        WeatherStation weatherStation = new WeatherStation();
        WeatherStationDefault weatherStationDefault = new WeatherStationDefault();

        Device1 d1 = new Device1(weatherStation);
        Device2 d2 = new Device2(weatherStation);
        Device3 d3 = new Device3(weatherStationDefault);
        Device4 d4 = new Device4(weatherStationDefault);

        new Thread(weatherStation).start();
        new Thread(weatherStationDefault).start();
    }
}
