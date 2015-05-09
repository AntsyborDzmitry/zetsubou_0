package com.epam.pattern.headfirst.observer.weatherstantion.generator;

import com.epam.pattern.headfirst.observer.weatherstantion.bean.WeatherData;

/**
 * Created by Kiryl_Lutsyk on 1/12/2015.
 */
public class WeatherGenerator implements Generator {
    @Override
    public WeatherData generate() {
        double temperature = (Math.random() * 50) - 15;
        double humidity = Math.random() * 100;
        double pressure = Math.random() * 0.7 + 0.5;

        WeatherData weatherData = new WeatherData();
        weatherData.setTemperature(temperature);
        weatherData.setHumidity(humidity);
        weatherData.setPressure(pressure);
        return weatherData;
    }

    @Override
    public void change(WeatherData weatherData) {
        double temperatureDelta = (Math.random() * 2) - 1;
        double humidityDelta = (Math.random() * 2) - 1;
        double pressureDelta = (Math.random() * 2) - 1;

        weatherData.setTemperature(weatherData.getTemperature() + temperatureDelta);
        weatherData.setHumidity(weatherData.getHumidity() + humidityDelta);
        weatherData.setPressure(weatherData.getPressure() + pressureDelta);
    }
}
