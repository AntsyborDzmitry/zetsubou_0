package com.zetsubou_0.carchooser.core.been.car;

public class Consumption {

    private final double cityConsumption;

    private final double  traceConsumption;

    public Consumption(final double cityConsumption, final double traceConsumption) {
        this.cityConsumption = cityConsumption;
        this.traceConsumption = traceConsumption;
    }

    public double getCityConsumption() {
        return cityConsumption;
    }

    public double getTraceConsumption() {
        return traceConsumption;
    }
}
