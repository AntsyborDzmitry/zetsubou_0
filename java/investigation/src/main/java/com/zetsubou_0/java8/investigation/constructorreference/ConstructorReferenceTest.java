package com.zetsubou_0.java8.investigation.constructorreference;

public class ConstructorReferenceTest {

    public static void main(String[] args) {
        StringBuffer buffer = new StringBuffer();
        buffer.append("I'am ");
        buffer.append("string");

        StringBuilder<StringBuffer> builder = String::new;
        System.out.println(builder.createString(buffer));

        ArrayBuilder<String> arrayBuilder = String[]::new;
        String[] array = arrayBuilder.build(5);
        System.out.println(array.length);
    }
}
