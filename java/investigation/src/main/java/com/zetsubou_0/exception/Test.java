package com.zetsubou_0.exception;

/**
 * Created by Kiryl_Lutsyk on 2/17/2016.
 */
public class Test {
    public static void main(String[] args) {
        try {
            throwException();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private static void throwException() throws Exception {
        try {
            throw new Exception("Exception in try");
        } catch (Exception e) {
            System.out.println("Catch exception. " + e.getMessage());
            throw new Exception("Exception in catch");
        } finally {
            System.out.println("Finally");
        }
    }
}
