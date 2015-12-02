package com.zetsubou_0.testdemo.impl1;

import com.zetsubou_0.testdemo.api.HelloService;

/**
 * Created by Kiryl_Lutsyk on 12/2/2015.
 */
public class HelloServiceImpl2 implements HelloService {
    private static final String HELLO = "hello";

    @Override
    public String hello() {
        return HELLO;
    }
}
