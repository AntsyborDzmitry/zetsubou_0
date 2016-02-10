package base;


import java.util.Scanner;

public class TriangleAction {

    public static void main(String[] args) {

        System.out.println("Выберите вариант создания треугольника по известным вам данным:\n" +
                "1 - Известны строноы  a, b, c;");
        System.out.println("2 - Известны стороны  a, b  и угол между ними;");
        System.out.println("3 - Известна сторона с и два прилежащих к ней угла;");


        Triangle T1;

        Scanner in;
        in = new Scanner(System.in);
        int inputVariant = in.nextInt();

        switch(inputVariant) {
            case 1:
                System.out.println("Введите сторону a в мм ");
                int a = in.nextInt();
                System.out.println("Введите сторону b в мм");
                int b = in.nextInt();
                System.out.println("Введите сторону c в мм");
                int c = in.nextInt();
                T1 = new Triangle(a, b, c);
                break;
            case 2:
                System.out.println("Введите сторону a в мм");
                a = in.nextInt();
                System.out.println("Введите сторону b в мм");
                b = in.nextInt();
                System.out.println("Введите угол Y между ними в градусах");
                double angleA = in.nextDouble();
                T1 = new Triangle(a, b, angleA);
                break;
            case 3:
                System.out.println("Введите сторону c в мм");
                c = in.nextInt();
                System.out.println("Введите угол A в градусах");
                angleA = in.nextInt();
                System.out.println("Введите угол B в градусах");
                double angleB = in.nextDouble();
                T1 = new Triangle(c, angleA, angleB);
                break;
            default:
                return;
        }

        if (T1.checkTriangle()) {
            System.out.println("Вы создали треугольник:" + "\nсо стороной a " + T1.getA() + " мм;");
            System.out.println("со стороной b " + T1.getB() + " мм;");
            System.out.println("со стороной c " + T1.getC() + " мм;");
        } else {
            System.out.println("Вы ввели неверные значения. Треугольник не создан");
        }

    }

}
