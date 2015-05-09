package com.epam.pattern.headfirst.observer.weatherstantion.bean;

/**
 * Created by Kiryl_Lutsyk on 1/12/2015.
 */
public class WeatherData {
    private double temperature;
    private double humidity;
    private double pressure;

    public WeatherData() {
    }

    public double getTemperature() {
        return temperature;
    }

    public void setTemperature(double temperature) {
        this.temperature = temperature;
    }

    public double getHumidity() {
        return humidity;
    }

    public void setHumidity(double humidity) {
        this.humidity = humidity;
    }

    public double getPressure() {
        return pressure;
    }

    public void setPressure(double pressure) {
        this.pressure = pressure;
    }
}
