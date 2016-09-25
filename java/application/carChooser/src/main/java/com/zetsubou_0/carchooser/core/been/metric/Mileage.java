package com.zetsubou_0.carchooser.core.been.metric;

public class Mileage {

    private static final double KM_IN_MILE = 1.609344;

    private final long km;

    private final long mile;

    public Mileage(final double mile) {
        this.mile = Math.round(mile);
        this.km = Math.round(mile * KM_IN_MILE);
    }

    public Mileage(final long km) {
        this.km = km;
        this.mile = Math.round(km / KM_IN_MILE);
    }

    public long getMile() {
        return mile;
    }

    public long getKm() {
        return km;
    }
}
