package com.zetsubou_0.carchooser.core.comparator;

import com.zetsubou_0.carchooser.core.been.car.Car;

import java.util.Comparator;

public enum RatingComparator {
    MILEAGE(new MileageComparator());

    private final Comparator<Car> comparator;

    RatingComparator(final Comparator<Car> comparator) {
        this.comparator = comparator;
    }

    public Comparator<Car> getComparator() {
        return comparator;
    }

    private static class MileageComparator implements Comparator<Car> {
        public int compare(final Car car1, final Car car2) {
            return (int) (car1.getMileage().getKm() - car2.getMileage().getKm());
        }
    }
}
