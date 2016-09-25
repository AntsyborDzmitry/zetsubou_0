package com.zetsubou_0.carchooser.core.been.car;

import com.zetsubou_0.carchooser.core.been.info.AdvantagesDisadvantages;
import com.zetsubou_0.carchooser.core.been.metric.Mileage;

public class Car {

    private final Model model;

    private final Motor motor;

    private Mileage mileage;

    private AdvantagesDisadvantages advantagesDisadvantages;

    public Car(final Model model, final Motor motor) {
        this.model = model;
        this.motor = motor;
    }

    public Model getModel() {
        return model;
    }

    public Motor getMotor() {
        return motor;
    }

    public Mileage getMileage() {
        return mileage;
    }

    public void setMileage(final Mileage mileage) {
        this.mileage = mileage;
    }

    public AdvantagesDisadvantages getAdvantagesDisadvantages() {
        return advantagesDisadvantages;
    }

    public void setAdvantagesDisadvantages(final AdvantagesDisadvantages advantagesDisadvantages) {
        this.advantagesDisadvantages = advantagesDisadvantages;
    }
}
