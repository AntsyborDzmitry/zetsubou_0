//import com.vi.ni.autotest.appium.SetUpTest;
//import io.appium.java_client.AppiumDriver;
//
//import org.junit.Assert;
//import org.openqa.selenium.By;
//import org.openqa.selenium.WebElement;
//
//import org.testng.annotations.Test;
//
//
//public class MyTest {
//
//    AppiumDriver driver;
//
//    @Test
//    public void calcResultCheck () throws Exception {
//
//
//        SetUpTest st = new SetUpTest ();
//
//       driver = st.setUp();
//
//        String result = "11";
//
//        WebElement sixButton = driver.findElement(By.id("com.android.calculator2:id/digit_6"));
//        sixButton.click();
//        WebElement sumButton = driver.findElement(By.id("com.android.calculator2:id/op_add"));
//        sumButton.click();
//        WebElement fiveButton = driver.findElement(By.id("com.android.calculator2:id/digit_5"));
//        fiveButton.click();
//        WebElement equallButton = driver.findElement(By.id("com.android.calculator2:id/eq"));
//        equallButton.click();
//
//        WebElement resultWindow = driver.findElement(By.id("com.android.calculator2:id/formula"));
//        String result = resultWindow.getAttribute("text");
//        Assert.assertEquals(11, result);
//        System.out.println("Number sum result is : " + result);
//
//       // st.shoutDown();
//
//    }
//
//}
