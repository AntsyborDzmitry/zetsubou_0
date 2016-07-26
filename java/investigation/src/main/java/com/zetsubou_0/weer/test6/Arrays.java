package com.zetsubou_0.weer.test6;

public class Arrays {

    private static int[] array1;

    private static boolean[] array2 = new boolean[4];

    private static String[] arrayObject2 = new String[4];

    private static int[] array3 = new int[4];

    private static int[][] array4;

    public static void main(String[] args) {

        System.out.println(array1);
        System.out.println();

        System.out.println(array2);
        for (boolean i : array2) {
            System.out.println(i);
        }
        System.out.println();

        System.out.println(arrayObject2);
        for (String str : arrayObject2) {
            System.out.println(str);
        }
        System.out.println();

        for (int i = 0; i < array3.length; i++) {
            array3[i] = (i + 1) * (i + 1);
        }
        for (int i : array3) {
            System.out.println(i);
        }
        System.out.println();

        try {
            System.out.println(array3[4]);
        } catch (IndexOutOfBoundsException e) {
            System.out.println("Not found. " + e);
        }
        System.out.println();

        int tmp = array3[0];
        array3[0] = array3[2];
        array3[2] = tmp;
        for (int i : array3) {
            System.out.println(i);
        }
        System.out.println();

        int count = 1;
        array4 = new int[3][];
        for (int i = 0; i < array4.length; i++) {
            array4[i] = new int[5];
            for (int j = 0; j < array4[i].length; j++) {
                array4[i][j] = count++;
            }
        }
        for (int i = 0; i < array4.length; i++) {
            for (int j = 0; j < array4[i].length; j++) {
                System.out.print(array4[i][j] + "\t");
            }
            System.out.println();
        }
        System.out.println(array4[1][2]);
        System.out.println();

        count = 1;
        array4 = new int[5][];
        for (int i = 0; i < array4.length; i++) {
            array4[i] = new int[count];
            for (int j = 0; j < array4[i].length; j++) {
                array4[i][j] = count++ - 1;
            }
        }
        for (int i = 0; i < array4.length; i++) {
            for (int j = 0; j < array4[i].length; j++) {
                System.out.print(array4[i][j] + "\t");
            }
            System.out.println();
        }
        System.out.println();
    }
}
