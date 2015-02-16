package com.zetsubou_0.application.mousemover.robot;

import java.awt.*;
import java.util.concurrent.TimeUnit;

/**
 * Created by zetsubou_0 on 14.02.15.
 */
public class MouseMover implements Runnable {
    private int width;
    private int height;
    private long delay;
    private String timeVal;

    @Override
    public void run() {
        try {
            Robot robot = new Robot();
            robot.mouseMove(width, height);
            TimeUnit.valueOf(timeVal.toUpperCase()).sleep(delay);
        } catch (AWTException e) {
            e.printStackTrace();
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }

    public int getWidth() {
        return width;
    }

    public void setWidth(int width) {
        this.width = width;
    }

    public int getHeight() {
        return height;
    }

    public void setHeight(int height) {
        this.height = height;
    }

    public long getDelay() {
        return delay;
    }

    public void setDelay(long delay) {
        this.delay = delay;
    }

    public String getTimeVal() {
        return timeVal;
    }

    public void setTimeName(String timeVal) {
        this.timeVal = timeVal;
    }
}
