package com.zetsubou_0.testdemo.impl2;

import com.zetsubou_0.testdemo.api.Divider;
import org.junit.Test;

import static org.junit.Assert.*;

/**
 * Created by Kiryl_Lutsyk on 12/2/2015.
 */
public class DividerTest {
    private Divider sut = new DividerImpl();

    @Test
    public void shouldDivide() {
        Double result = sut.divide(10, 2);
        assertEquals(new Double(5.0), result);
    }

    @Test(expected = IllegalArgumentException.class)
    public void shouldNotDivideByZero() {
        sut.divide(10, 0);
    }
}
