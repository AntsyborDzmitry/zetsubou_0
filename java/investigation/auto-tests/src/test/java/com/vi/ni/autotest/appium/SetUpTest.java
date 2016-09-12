package com.vi.ni.autotest.appium;

import io.appium.java_client.AppiumDriver;
import io.appium.java_client.android.AndroidDriver;
import io.appium.java_client.remote.MobileBrowserType;
import io.appium.java_client.remote.MobileCapabilityType;
import io.appium.java_client.remote.MobilePlatform;
import org.openqa.selenium.remote.CapabilityType;
import org.openqa.selenium.remote.DesiredCapabilities;


import java.io.File;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.concurrent.TimeUnit;


public class SetUpTest {



    public AndroidDriver setUp() throws MalformedURLException {

                /* For Device */

        //File app = new File("D:/AndroidTest/LenovoCalculator.apk");

    /*    DesiredCapabilities capabilities = new DesiredCapabilities();
        capabilities.setCapability(MobileCapabilityType.PLATFORM_NAME,"Android");
        capabilities.setCapability(MobileCapabilityType.PLATFORM_VERSION,"4.2.1");
        capabilities.setCapability(MobileCapabilityType.DEVICE_NAME,"LenovoP780");
        //capabilities.setCapability("app", app.getAbsolutePath());
        //capabilities.setCapability("app","D:/AndroidTest/LenovoCalculator.apk");
        //capabilities.setCapability(MobileCapabilityType.APP,"D:/AndroidTest/LenovoCalculator.apk");
        capabilities.setCapability("appActivity","LenovoCalculator");
        capabilities.setCapability("appPackage", "com.android.calculator2.Calculator");
        capabilities.setCapability(MobileCapabilityType.BROWSER_NAME,"");
        //driver.manage().timeouts().implicitlyWait(15, TimeUnit.SECONDS);
        driver = new AndroidDriver(new URL("http://127.0.0.1:4727/wd/hub"), capabilities);

*/
/* For Emulator */



        DesiredCapabilities capabilities = new DesiredCapabilities();
        capabilities.setCapability("deviceName","Google Nexus 6");
        capabilities.setCapability("platformVersion","6.0.0");
        capabilities.setCapability("platformName","Android");
        //capabilities.setCapability(CapabilityType.BROWSER_NAME, "");
       //capabilities.setCapability("avd","AutoInsurance");
        capabilities.setCapability("appActivity","com.android.calculator2.Calculator");
        capabilities.setCapability("appPackage", "com.android.calculator2");
        return new AndroidDriver(new URL("http://127.0.0.1:4727/wd/hub"), capabilities);


    }


  //  public void shoutDown () throws Exception {
       // quit();
   // }
}
