package com.zetsubou_0.carchooser.core.been.car;

public class Motor {

    private final MotorType type;

    private double volume;

    private double power;

    private double torque;

    private int cylinders;

    private Consumption passportConsumption;

    private Consumption benchmarkConsumption;

    public Motor(final MotorType type) {
        this.type = type;
    }

    public MotorType getType() {
        return type;
    }

    public double getVolume() {
        return volume;
    }

    public void setVolume(final double volume) {
        this.volume = volume;
    }

    public double getPower() {
        return power;
    }

    public void setPower(final double power) {
        this.power = power;
    }

    public double getTorque() {
        return torque;
    }

    public void setTorque(final double torque) {
        this.torque = torque;
    }

    public int getCylinders() {
        return cylinders;
    }

    public void setCylinders(final int cylinders) {
        this.cylinders = cylinders;
    }

    public Consumption getPassportConsumption() {
        return passportConsumption;
    }

    public void setPassportConsumption(final Consumption passportConsumption) {
        this.passportConsumption = passportConsumption;
    }

    public Consumption getBenchmarkConsumption() {
        return benchmarkConsumption;
    }

    public void setBenchmarkConsumption(final Consumption benchmarkConsumption) {
        this.benchmarkConsumption = benchmarkConsumption;
    }

    public enum MotorType {
        DIZEL, GASOLINE;
    }
}
