package com.vi.ni.autotest.appium;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;

public enum Driver {

    DEFAULT, FIREFOX, CHROME;

    public WebDriver getDefault() {
        return new ChromeDriver();
    }
}
