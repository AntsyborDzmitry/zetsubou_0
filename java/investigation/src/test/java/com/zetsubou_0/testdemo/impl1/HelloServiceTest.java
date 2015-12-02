package com.zetsubou_0.testdemo.impl1;

import com.zetsubou_0.testdemo.api.HelloService;
import com.zetsubou_0.testdemo.impl1.HelloServiceImpl;
import org.junit.Before;
import org.junit.Ignore;
import org.junit.Test;

import static org.junit.Assert.*;

/**
 * Created by Kiryl_Lutsyk on 12/2/2015.
 */
public class HelloServiceTest {
    private static final String HELLO = "hello";

    private HelloService sut;

    @Before
    public void setupService() {
        sut = new HelloServiceImpl();
    }

    @Ignore
    @Test
    public void shouldReturnHello() {
        String actualSay = sut.hello();
        assertEquals(HELLO, actualSay);
    }
}
