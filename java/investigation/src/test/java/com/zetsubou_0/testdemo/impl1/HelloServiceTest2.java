package com.zetsubou_0.testdemo.impl1;

import com.zetsubou_0.testdemo.api.HelloService;
import com.zetsubou_0.testdemo.impl1.HelloServiceImpl2;
import org.junit.Before;
import org.junit.Test;

import static org.junit.Assert.assertEquals;

/**
 * Created by Kiryl_Lutsyk on 12/2/2015.
 */
public class HelloServiceTest2 {
    private static final String HELLO = "hello";

    private HelloService sut;

    @Before
    public void setupService() {
        sut = new HelloServiceImpl2();
    }

    @Test
    public void shouldReturnHello() {
        String actualSay = sut.hello();
        assertEquals(HELLO, actualSay);
    }
}
