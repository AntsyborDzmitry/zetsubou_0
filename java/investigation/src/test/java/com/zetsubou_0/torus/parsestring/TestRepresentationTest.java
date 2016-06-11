package com.zetsubou_0.torus.parsestring;

import org.junit.Assert;
import org.junit.Test;

public class TestRepresentationTest {

    private static final String INPUT = "1\ta\n2\tb\n344\tx\t13\nn\n";

    private TestsRepresentation sut = new TestsRepresentation(INPUT);

    @Test
    public void shouldParseString() {
        String firstTest = sut.getTestLiteralByNumberIfExists(1);
        String secondTest = sut.getTestLiteralByNumberIfExists(2);
        String thirdTest = sut.getTestLiteralByNumberIfExists(344);
        String fourthTest = sut.getTestLiteralByNumberIfExists(13);

        Assert.assertEquals("a", firstTest);
        Assert.assertEquals("b", secondTest);
        Assert.assertEquals("x", thirdTest);
        Assert.assertEquals("n", fourthTest);
    }
}