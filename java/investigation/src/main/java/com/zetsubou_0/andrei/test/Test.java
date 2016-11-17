package com.zetsubou_0.andrei.test;

public class Test {

    public static void main(String[] args) {
        Cat vaska = new Cat();
        Person person = new Person();
        vaska.owner = person;
        vaska.owner.name = "God";

        Cat chinko = vaska;
        System.out.println(chinko.owner.name);

    }

    /*
    возвращаемый тип
    имя функции
    (параметры) - Тип параметра и его имя
    тело отделятся в {
       то что происходит
    }
    если возвращает, то return
    */

    // начало
    static int sum (int x, int y) {
        return x+y;
    }

    static double doubleNum (int z) {
        return 2*z ;
    }

    static double square (double z) {
        return z*z;
    }

    static void sumAndPrint (double x, double y){
          System.out.println(x+y);
    }

    static void napicatIma (String ima) {
        System.out.println("здравсвуйте "+ima);
    }

    static String vozvratStroki (int x, int y) {
        return "" + square(sum(x,y));
    }

    static void vivodStrok (String strok) {

    }

    static void sumPrint(int x, double y) {
        double z = x + y;
        System.out.println(z);
    }
    // конец

}
