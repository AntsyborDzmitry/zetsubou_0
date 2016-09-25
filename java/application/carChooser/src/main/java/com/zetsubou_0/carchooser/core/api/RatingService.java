package com.zetsubou_0.carchooser.core.api;

import com.zetsubou_0.carchooser.core.been.car.Car;

public interface RatingService {
    int getTotalRating(Car car, boolean withDisadvantages);
}
