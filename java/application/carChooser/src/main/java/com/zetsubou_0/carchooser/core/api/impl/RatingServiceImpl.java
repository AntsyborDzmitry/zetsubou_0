package com.zetsubou_0.carchooser.core.api.impl;

import com.zetsubou_0.carchooser.core.api.RatingService;
import com.zetsubou_0.carchooser.core.been.car.Car;
import com.zetsubou_0.carchooser.core.comparator.RatingComparator;

import java.util.*;

public class RatingServiceImpl implements RatingService {

    private final Set<Car> cars;

    public RatingServiceImpl(final Set<Car> cars) {
        this.cars = cars == null ? new HashSet<Car>() : cars;
    }

    public int getTotalRating(final Car car, final boolean withDisadvantages) {
        return getMileageRating(car);
    }

    private int getMileageRating(final Car car) {
        Rating rating = new Rating(RatingComparator.MILEAGE, cars);
        return rating.getCarRating(car);
    }

    private static final class Rating {

        private final RatingComparator comparator;

        private final Set<Car> cars;

        private Map<Car, Integer> sortedCars = new HashMap<Car, Integer>();

        Rating(final RatingComparator comparator, final Set<Car> cars) {
            this.comparator = comparator;
            this.cars = cars == null ? new HashSet<Car>() : cars;
            init();
        }

        int getCarRating(final Car car) {
            return sortedCars.get(car);
        }

        private void init() {
            Set<Car> sortedCarSet = new TreeSet<Car>(comparator.getComparator());
            sortedCarSet.addAll(cars);
            int position = 0;
            for (Car car : sortedCarSet) {
                sortedCars.put(car, ++position);
            }
        }
    }
}
