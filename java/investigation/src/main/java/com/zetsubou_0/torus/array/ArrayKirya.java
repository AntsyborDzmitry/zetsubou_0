package com.zetsubou_0.torus.array;

/**
 * Created by admin on 28.02.2016.
 */
public class ArrayKirya {
    // найти все отрицательные элементы массива, стоящие на чётных местах, которые делятс на 3. отсортировать по убыванию.
    public static void main(String[] args) {
        int[] array = {5,-9,8,4,-5,-3,2,-15,2,14,-4,0,3,-7,22,6,-16,9,7,-17,11,-18};
        int j  = 0;
        // прохожусь по массиву array
        for (int i = 0; i <array.length ; i++) {
            //проверяю условия и при выполнении считаю количество элементов для создания нового массива
            if (array[i] < 0 && (i+1)%2 == 0 && array[i]%3 == 0 ){
                j++;
            } else{
                array[i] = 0;
            }
        }
        int r = 0 ;
        int[] array2 = new int[j];
        //перенос данных со старого в новый массив(короткий)
        for (int i = 0; i <array.length ; i++) {
            if (array[i] != 0){
                array2[r] = array[i];
                r++;
            }
        }
        //сортировка
        int c = 1;
        do {
            for (int i = j-1; i >0 ; i--) {
                if (array2[i] > array2[i - 1]) {
                    int a = array2[i];
                    array2[i] = array2[i - 1];
                    array2[i - 1] = a;
                }
            }
        } while (c++<j);
        // выводим массив
        for (int i = 0; i <j ; i++) {
            System.out.println(array2[i]);

        }
    }
}