package com.vi.ni.autotest.appium;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.firefox.FirefoxDriver;

public enum Driver {
    DEFAULT(new ChromeDriver()),
    FIREFOX(new FirefoxDriver()),
    CHROME(new ChromeDriver());

    private final WebDriver webDriver;

    Driver(WebDriver webDriver) {
        this.webDriver = webDriver;
    }

    public WebDriver getWebDriver() {
        return webDriver;
    }
}
