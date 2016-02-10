package base;

import base.Comparator.*;

import java.util.*;



public class TankBase {

    public static void main(String[] args) {

        Scanner in;
        // in = new Scanner(System.in);

        List<Tank> tankList = new ArrayList<>();

        readTankInfo(tankList);

        WriteToXml xml = new WriteToXml("tanks_list.xml");
        xml.writeToXML(tankList);
        System.out.println("Данные переданы и сохранены в файл: tanks_list.xml");

        System.out.print("Выберите вариант сортировки: 1 - по массе, 2 - по типу, 3 - по модели, 4 - по орудию, 5 - по экипажу.");

        in = new Scanner(System.in);
        int sortedMethod = in.nextInt();
        Set<Tank> sortedTanks;

        switch(sortedMethod) {
            case 1:
                sortedTanks = new TreeSet<>(new SortDataTankWeight());
            break;
            case 2:
                sortedTanks = new TreeSet<>(new SortDataTankType());
            break;
            case 3:
                sortedTanks = new TreeSet<>(new SortDataTankModel());
            break;
            case 4:
                sortedTanks = new TreeSet<>(new SortDataTankMainCannon());
            break;
            case 5:
                sortedTanks = new TreeSet<>(new SortDataTankCrew());
            break;
            default:
                return;
        }
        sortedTanks.addAll(tankList);

        xml = new WriteToXml("sorted_tanks_list.xml");
        xml.writeToXML(sortedTanks);

    }

    private static void readTankInfo(List<Tank> tankList) {
        Scanner in;
        while (true) {

            in = new Scanner(System.in);

            Tank tank = new Tank();


            System.out.print("Введите название модели танка: ");
            String model = in.nextLine();
            tank.setModel(model);

            System.out.print("Введите тип танка: ");
            String type = in.nextLine();
            tank.setType(type);

            System.out.print("Введите количество членов экипажа: ");
            int crew = in.nextInt();
            tank.setCrew(crew);

            System.out.print("Введите клибр основного орудия в мм: ");
            int mainCannon = in.nextInt();
            tank.setMainCannon(mainCannon);

            System.out.print("Введите боевую массу танка в кг: ");
            int weight = in.nextInt();
            tank.setWeight(weight);
            in.nextLine();

            tankList.add(tank);

            System.out.println("Модель танка: " + tank.getModel() + "\nТип танка: " + tank.getType() + "\nЭкипаж, человек; " +   tank.getCrew() + "\nОсновное орудие, мм: " + tank.getMainCannon() + "\nБоевая масса танка, кг: " + tank.getWeight());

            System.out.print("Хотите прордолжить Д/Н?");
            String isContinue = in.next();
            if (!"д".equalsIgnoreCase(isContinue)) {
                break;
            }
        }
    }
}