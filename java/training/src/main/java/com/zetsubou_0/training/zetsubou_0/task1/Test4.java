package com.zetsubou_0.training.zetsubou_0.task1;

/**
 * Created by zetsubou_0 on 08.06.15.
 */
public class Test4 {
    public static void main(String[] args) {
        int[] arr = new int[20];
        arr[0] = 1;
        for(int i = 1; i < 20; i++) {
            arr[i] = arr[i - 1] + i;
        }

        int arrSize = 0;
        for(Integer i : arr) {
            if(check(i)) {
                arrSize++;
            }
        }

        double[] arr2 = new double[arrSize];
        int x = 0;
        for(int i = arr.length - 1; i >= 0; i--) {
            if(check(arr[i])) {
                arr2[x++] = arr[i] * 0.25;
            }
        }

        print(arr);
        print(arr2);
    }

    private static boolean check(int i) {
        return !((i % 2 == 0) || (i > 90 & i < 110));
    }

    private static void print(int[] intArray) {
        for(int i = 0; i < intArray.length; i++) {
            System.out.print(intArray[i] + "\t");
            if(i % 5 == 4) {
                System.out.print("\n");
            }
        }
        if(intArray.length % 5 != 4) {
            System.out.print("\n");
        }
    }

    private static void print(double[] doubleArray) {
        for(int i = 0; i < doubleArray.length; i++) {
            System.out.print(doubleArray[i] + "\t");
            if(i % 5 == 4) {
                System.out.print("\n");
            }
        }
        if(doubleArray.length % 5 != 4) {
            System.out.print("\n");
        }
    }
}
